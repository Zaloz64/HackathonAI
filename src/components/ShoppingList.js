import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PERSONAS, EVENTS, API_URL } from '../config/constants';

// Filter type icons
const FILTER_ICONS = {
  persona: 'person',
  allergen: 'warning',
  event: 'calendar',
};

// Build a description of active filters for the AI prompt
function buildFilterContext(selectedPersonas, selectedAllergens, selectedEventId) {
  const parts = [];
  const activePersonas = PERSONAS.filter((p) => selectedPersonas.includes(p.id));
  if (activePersonas.length > 0) {
    activePersonas.forEach((p) => {
      parts.push(`${p.name} is allergic to: ${p.allergies.length ? p.allergies.join(', ') : 'nothing'}`);
    });
  }
  if (selectedAllergens.length > 0) {
    parts.push(`Must avoid these allergens: ${selectedAllergens.join(', ')}`);
  }
  if (selectedEventId) {
    const evt = EVENTS.find((e) => e.id === selectedEventId);
    if (evt) {
      const invited = evt.invited
        .map((id) => PERSONAS.find((p) => p.id === id))
        .filter(Boolean);
      const allAllergies = [...new Set(invited.flatMap((p) => p.allergies))];
      parts.push(`Event "${evt.title}" with guests who are allergic to: ${allAllergies.length ? allAllergies.join(', ') : 'nothing'}`);
    }
  }
  return parts.length ? parts.join('. ') : 'No dietary restrictions.';
}

// Calculate the number of servings based on active filters
function getServings(selectedPersonas, selectedEventId) {
  if (selectedEventId) {
    const evt = EVENTS.find((e) => e.id === selectedEventId);
    if (evt) return evt.invited.length;
  }
  if (selectedPersonas.length > 0) return selectedPersonas.length;
  return 2; // default
}

export default function ShoppingList({
  selectedPersonas = [], selectedAllergens = [], selectedEventId = null,
  listGroups, setListGroups, chatResponse, setChatResponse,
}) {
  const [newGroupName, setNewGroupName] = useState('');
  const [groupInputs, setGroupInputs] = useState({});
  const [collapsedGroups, setCollapsedGroups] = useState({});

  // --- Recipe chat state ---
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // Current active filters as tags
  const activeFilters = [
    ...PERSONAS.filter((p) => selectedPersonas.includes(p.id)).map((p) => ({
      type: 'persona',
      label: p.name,
      id: p.id,
    })),
    ...selectedAllergens.map((a) => ({
      type: 'allergen',
      label: a.charAt(0).toUpperCase() + a.slice(1),
      id: a,
    })),
    ...(selectedEventId
      ? [{ type: 'event', label: EVENTS.find((e) => e.id === selectedEventId)?.title || 'Event', id: selectedEventId }]
      : []),
  ];

  // Create a shopping list group from a recipe object
  const createListFromRecipe = (recipe) => {
    if (!recipe || !recipe.ingredients?.length) return;

    const items = recipe.ingredients.map((ing, idx) => ({
      id: `recipe-${Date.now()}-${idx}`,
      text: `${ing.amount ? ing.amount + ' ' : ''}${ing.item}${ing.warning ? ' ⚠️ ' + ing.warning : ''}`,
      checked: false,
    }));

    // Add shopping tips as note items
    const tipItems = (recipe.shopping_tips || []).map((tip, idx) => ({
      id: `tip-${Date.now()}-${idx}`,
      text: `💡 ${tip}`,
      checked: false,
    }));

    const group = {
      id: `recipe-${Date.now()}`,
      name: recipe.name || 'Recipe',
      filters: [...activeFilters],
      items: [...items, ...tipItems],
      isRecipe: true,
      dietaryNotes: recipe.dietary_notes || null,
    };

    setListGroups((prev) => [group, ...prev]);
  };

  // --- Recipe chat ---
  const sendRecipeQuery = async () => {
    const trimmed = chatInput.trim();
    if (!trimmed || chatLoading) return;

    setChatResponse(null);
    setChatInput('');
    setChatLoading(true);

    const dietaryContext = buildFilterContext(selectedPersonas, selectedAllergens, selectedEventId);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch(`${API_URL}/api/recipe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: trimmed,
          dietary_context: dietaryContext,
          servings: getServings(selectedPersonas, selectedEventId),
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        setChatResponse({ text: data.response || 'Here is your recipe suggestion.', expanded: false });

        // Auto-create shopping list from recipe
        if (data.recipe) {
          createListFromRecipe(data.recipe);
        }
      } else {
        setChatResponse({ text: 'Sorry, could not generate a recipe right now. Try again later.', expanded: false });
      }
    } catch {
      setChatResponse({ text: 'Connection failed. Make sure the backend is running.', expanded: false });
    } finally {
      setChatLoading(false);
    }
  };

  // --- List group management ---
  const createGroup = () => {
    const name = newGroupName.trim();
    if (!name) return;
    const group = {
      id: `grp-${Date.now()}`,
      name,
      filters: [...activeFilters],
      items: [],
    };
    setListGroups((prev) => [...prev, group]);
    setNewGroupName('');
  };

  const addItemToGroup = (groupId) => {
    const text = (groupInputs[groupId] || '').trim();
    if (!text) return;
    setListGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? { ...g, items: [...g.items, { id: `${Date.now()}`, text, checked: false }] }
          : g
      )
    );
    setGroupInputs((prev) => ({ ...prev, [groupId]: '' }));
  };

  const toggleGroupItem = (groupId, itemId) => {
    setListGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? { ...g, items: g.items.map((i) => (i.id === itemId ? { ...i, checked: !i.checked } : i)) }
          : g
      )
    );
  };

  const removeGroupItem = (groupId, itemId) => {
    setListGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? { ...g, items: g.items.filter((i) => i.id !== itemId) }
          : g
      )
    );
  };

  const deleteGroup = (groupId) => {
    setListGroups((prev) => prev.filter((g) => g.id !== groupId));
  };

  const toggleCollapseGroup = (groupId) => {
    setCollapsedGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
    >
      <ScrollView style={s.container} contentContainerStyle={{ paddingBottom: 30 }} keyboardShouldPersistTaps="handled">

        {/* Recipe Chat */}
        <View style={s.chatSection}>
          <View style={s.chatHeader}>
            <Ionicons name="sparkles" size={18} color="#5F8A5F" />
            <Text style={s.chatTitle}>Recipe Assistant</Text>
          </View>
          <Text style={s.chatHint}>
            Tell me what you want to cook and I'll suggest a recipe based on your dietary filters.
          </Text>

          {chatResponse && (
            <TouchableOpacity
              style={s.chatBubbleAI}
              onPress={() => setChatResponse((prev) => prev ? { ...prev, expanded: !prev.expanded } : prev)}
              activeOpacity={0.7}
            >
              <Ionicons name="sparkles" size={14} color="#5F8A5F" style={{ marginRight: 6, marginTop: 2 }} />
              <View style={{ flex: 1 }}>
                <Text
                  style={s.chatBubbleText}
                  numberOfLines={chatResponse.expanded ? undefined : 2}
                >
                  {chatResponse.text}
                </Text>
                <Text style={s.expandHint}>
                  {chatResponse.expanded ? 'Tap to collapse' : 'Tap to read more'}
                </Text>
              </View>
            </TouchableOpacity>
          )}

          {chatLoading && (
            <View style={s.chatBubbleAI}>
              <ActivityIndicator size="small" color="#5F8A5F" />
              <Text style={[s.chatBubbleText, { marginLeft: 8 }]}>Thinking...</Text>
            </View>
          )}

          <View style={s.chatInputRow}>
            <TextInput
              value={chatInput}
              onChangeText={setChatInput}
              placeholder="e.g. I want to make sushi for dinner"
              placeholderTextColor="#999"
              style={s.chatInput}
              returnKeyType="send"
              onSubmitEditing={sendRecipeQuery}
              editable={!chatLoading}
            />
            <TouchableOpacity
              style={[s.chatSendBtn, chatLoading && { opacity: 0.5 }]}
              onPress={sendRecipeQuery}
              activeOpacity={0.85}
              disabled={chatLoading}
            >
              <Ionicons name="send" size={18} color="#fff" />
            </TouchableOpacity>
          </View>

          {activeFilters.length > 0 && (
            <View style={s.activeFiltersRow}>
              <Ionicons name="funnel" size={12} color="#999" />
              <Text style={s.activeFiltersText}>
                Active: {activeFilters.map((f) => f.label).join(', ')}
              </Text>
            </View>
          )}
        </View>

        {/* Create new list group */}
        <View style={s.createGroupSection}>
          <Text style={s.createGroupLabel}>Shopping Lists</Text>
          <View style={s.createGroupRow}>
            <TextInput
              value={newGroupName}
              onChangeText={setNewGroupName}
              placeholder="New list name..."
              placeholderTextColor="#999"
              style={s.createGroupInput}
              returnKeyType="done"
              onSubmitEditing={createGroup}
            />
            <TouchableOpacity style={s.createGroupBtn} onPress={createGroup} activeOpacity={0.85}>
              <Ionicons name="add" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          {activeFilters.length > 0 && (
            <Text style={s.createGroupHint}>
              New lists will be tagged with your current filters
            </Text>
          )}
        </View>

        {/* List groups */}
        {listGroups.map((group) => {
          const collapsed = collapsedGroups[group.id];
          const total = group.items.length;
          const done = group.items.filter((i) => i.checked).length;
          const unchecked = group.items.filter((i) => !i.checked);
          const checked = group.items.filter((i) => i.checked);

          return (
            <View key={group.id} style={s.section}>
              <TouchableOpacity
                style={s.sectionHeader}
                onPress={() => toggleCollapseGroup(group.id)}
                activeOpacity={0.7}
              >
                <View style={s.sectionLeft}>
                  <View style={[s.sectionIcon, group.isRecipe && s.sectionIconRecipe]}>
                    <Ionicons name={group.isRecipe ? 'restaurant' : 'list'} size={16} color="#fff" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.sectionTitle}>{group.name}</Text>
                    {group.dietaryNotes && (
                      <Text style={s.dietaryNote} numberOfLines={2}>{group.dietaryNotes}</Text>
                    )}
                    {group.filters.length > 0 && (
                      <View style={s.filterTags}>
                        {group.filters.map((f, idx) => (
                          <View key={idx} style={s.filterTag}>
                            <Ionicons name={FILTER_ICONS[f.type] || 'ellipse'} size={10} color="#5F8A5F" />
                            <Text style={s.filterTagText}>{f.label}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                </View>
                <View style={s.sectionRight}>
                  <Text style={s.sectionCount}>{done}/{total}</Text>
                  <TouchableOpacity onPress={() => deleteGroup(group.id)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Ionicons name="trash-outline" size={16} color="#ccc" />
                  </TouchableOpacity>
                  <Ionicons name={collapsed ? 'chevron-forward' : 'chevron-down'} size={18} color="#999" />
                </View>
              </TouchableOpacity>

              {!collapsed && (
                <View>
                  <View style={s.inputRow}>
                    <TextInput
                      value={groupInputs[group.id] || ''}
                      onChangeText={(v) => setGroupInputs((p) => ({ ...p, [group.id]: v }))}
                      placeholder="Add item..."
                      placeholderTextColor="#999"
                      style={s.input}
                      returnKeyType="done"
                      onSubmitEditing={() => addItemToGroup(group.id)}
                    />
                    <TouchableOpacity style={s.addBtn} onPress={() => addItemToGroup(group.id)} activeOpacity={0.85}>
                      <Ionicons name="add" size={20} color="#fff" />
                    </TouchableOpacity>
                  </View>

                  {unchecked.map((item) => (
                    <View key={item.id} style={s.itemRow}>
                      <TouchableOpacity style={s.checkbox} onPress={() => toggleGroupItem(group.id, item.id)} activeOpacity={0.7}>
                        <View style={s.checkboxEmpty} />
                      </TouchableOpacity>
                      <Text style={s.itemText}>{item.text}</Text>
                      <TouchableOpacity onPress={() => removeGroupItem(group.id, item.id)} activeOpacity={0.7}>
                        <Ionicons name="close-circle" size={20} color="#ccc" />
                      </TouchableOpacity>
                    </View>
                  ))}

                  {checked.length > 0 && (
                    <>
                      <Text style={s.doneLabel}>Done ({checked.length})</Text>
                      {checked.map((item) => (
                        <View key={item.id} style={[s.itemRow, s.itemRowDone]}>
                          <TouchableOpacity style={s.checkbox} onPress={() => toggleGroupItem(group.id, item.id)} activeOpacity={0.7}>
                            <View style={s.checkboxChecked}>
                              <Ionicons name="checkmark" size={14} color="#fff" />
                            </View>
                          </TouchableOpacity>
                          <Text style={[s.itemText, s.itemTextDone]}>{item.text}</Text>
                          <TouchableOpacity onPress={() => removeGroupItem(group.id, item.id)} activeOpacity={0.7}>
                            <Ionicons name="close-circle" size={20} color="#ccc" />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </>
                  )}

                  {group.items.length === 0 && (
                    <Text style={s.emptyText}>No items yet</Text>
                  )}
                </View>
              )}
            </View>
          );
        })}

        {listGroups.length === 0 && (
          <View style={s.emptyState}>
            <Ionicons name="cart-outline" size={40} color="#ccc" />
            <Text style={s.emptyStateText}>No shopping lists yet</Text>
            <Text style={s.emptyStateHint}>Create a list above to get started</Text>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F0E2' },

  // Chat
  chatSection: {
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
  },
  chatHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  chatTitle: { fontSize: 16, fontWeight: '700', color: '#333' },
  chatHint: { fontSize: 12, color: '#999', marginBottom: 10 },

  chatBubbleAI: {
    backgroundColor: '#E8F0E4',
    alignSelf: 'flex-start',
    borderRadius: 12,
    borderBottomLeftRadius: 4,
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 10,
    marginBottom: 8,
  },
  chatBubbleText: { fontSize: 14, color: '#333', flex: 1, lineHeight: 20 },
  expandHint: { fontSize: 11, color: '#5F8A5F', fontWeight: '600', marginTop: 4 },

  chatInputRow: { flexDirection: 'row', gap: 8, marginTop: 4 },
  chatInput: {
    flex: 1,
    backgroundColor: '#F4F0E2',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#333',
  },
  chatSendBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: '#5F8A5F',
    justifyContent: 'center', alignItems: 'center',
  },
  activeFiltersRow: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    marginTop: 8,
  },
  activeFiltersText: { fontSize: 11, color: '#999' },

  // Create group
  createGroupSection: {
    marginHorizontal: 16,
    marginBottom: 4,
  },
  createGroupLabel: { fontSize: 18, fontWeight: '800', color: '#333', marginBottom: 10 },
  createGroupRow: { flexDirection: 'row', gap: 8 },
  createGroupInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: '#333',
    borderWidth: 1,
    borderColor: '#9DBB97',
  },
  createGroupBtn: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: '#5F8A5F',
    justifyContent: 'center', alignItems: 'center',
  },
  createGroupHint: { fontSize: 11, color: '#999', marginTop: 6 },

  // Sections
  section: {
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  sectionLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  sectionIcon: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: '#5F8A5F',
    justifyContent: 'center', alignItems: 'center',
  },
  sectionIconRecipe: { backgroundColor: '#D4874D' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#333' },
  dietaryNote: { fontSize: 11, color: '#888', fontStyle: 'italic', marginTop: 2 },
  sectionRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionCount: { fontSize: 13, color: '#999', fontWeight: '600' },

  filterTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 4 },
  filterTag: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: '#E8F0E4',
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 8,
  },
  filterTagText: { fontSize: 10, color: '#5F8A5F', fontWeight: '600' },

  // Items
  inputRow: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingBottom: 10,
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#F4F0E2',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#333',
  },
  addBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: '#5F8A5F',
    justifyContent: 'center', alignItems: 'center',
  },

  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#f5f3eb',
  },
  itemRowDone: { opacity: 0.5 },

  checkbox: { marginRight: 12 },
  checkboxEmpty: {
    width: 22, height: 22, borderRadius: 6,
    borderWidth: 2, borderColor: '#9DBB97',
  },
  checkboxChecked: {
    width: 22, height: 22, borderRadius: 6,
    backgroundColor: '#5F8A5F',
    justifyContent: 'center', alignItems: 'center',
  },

  itemText: { flex: 1, fontSize: 14, color: '#333', fontWeight: '500' },
  itemTextDone: { textDecorationLine: 'line-through', color: '#999' },

  doneLabel: {
    fontSize: 12, fontWeight: '700', color: '#999',
    paddingHorizontal: 14, paddingTop: 8, paddingBottom: 4,
  },

  emptyText: {
    fontSize: 13, color: '#bbb', textAlign: 'center',
    paddingVertical: 16,
  },

  emptyState: {
    alignItems: 'center', paddingVertical: 40,
  },
  emptyStateText: { fontSize: 16, fontWeight: '600', color: '#999', marginTop: 10 },
  emptyStateHint: { fontSize: 13, color: '#bbb', marginTop: 4 },
});
