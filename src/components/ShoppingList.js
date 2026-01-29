import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PERSONAS } from '../config/constants';

// Default starter items per persona (keyed by persona id)
const DEFAULT_ITEMS = {
  saga: [
    { id: 's1', text: 'Gluten-free pasta', checked: false },
    { id: 's2', text: 'Soy-free sauce', checked: false },
  ],
  hugo: [
    { id: 'h1', text: 'Oat milk', checked: false },
    { id: 'h2', text: 'Lactose-free cheese', checked: false },
  ],
  hanna: [
    { id: 'n1', text: 'Gluten-free bread', checked: false },
    { id: 'n2', text: 'Dairy-free butter', checked: false },
  ],
  amanda: [
    { id: 'a1', text: 'Fruit salad mix', checked: false },
  ],
  _general: [
    { id: 'g1', text: 'Bananas', checked: false },
    { id: 'g2', text: 'Chicken breast', checked: false },
    { id: 'g3', text: 'Rice', checked: true },
  ],
};

export default function ShoppingList({ selectedPersonas = [] }) {
  // Each list keyed by persona id (plus '_general')
  const [lists, setLists] = useState(() => {
    const init = {};
    // General list always exists
    init._general = [...(DEFAULT_ITEMS._general || [])];
    PERSONAS.forEach((p) => {
      init[p.id] = [...(DEFAULT_ITEMS[p.id] || [])];
    });
    return init;
  });

  const [inputs, setInputs] = useState({});
  const [collapsedSections, setCollapsedSections] = useState({});

  const getInput = (key) => inputs[key] || '';
  const setInput = (key, val) => setInputs((prev) => ({ ...prev, [key]: val }));

  const toggleCollapse = (key) =>
    setCollapsedSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const addItem = (listKey) => {
    const trimmed = getInput(listKey).trim();
    if (!trimmed) return;
    setLists((prev) => ({
      ...prev,
      [listKey]: [...(prev[listKey] || []), { id: `${Date.now()}`, text: trimmed, checked: false }],
    }));
    setInput(listKey, '');
  };

  const toggleItem = (listKey, itemId) => {
    setLists((prev) => ({
      ...prev,
      [listKey]: prev[listKey].map((item) =>
        item.id === itemId ? { ...item, checked: !item.checked } : item
      ),
    }));
  };

  const removeItem = (listKey, itemId) => {
    setLists((prev) => ({
      ...prev,
      [listKey]: prev[listKey].filter((item) => item.id !== itemId),
    }));
  };

  const personasToShow = PERSONAS.filter((p) => selectedPersonas.includes(p.id));

  // Build sections: selected personas first, then general
  const sections = [
    ...personasToShow.map((p) => ({
      key: p.id,
      label: p.name,
      icon: 'person',
      allergies: p.allergies,
    })),
    { key: '_general', label: 'General', icon: 'cart' },
  ];

  const renderList = (listKey) => {
    const items = lists[listKey] || [];
    const unchecked = items.filter((i) => !i.checked);
    const checked = items.filter((i) => i.checked);

    return (
      <View>
        {/* Input */}
        <View style={s.inputRow}>
          <TextInput
            value={getInput(listKey)}
            onChangeText={(v) => setInput(listKey, v)}
            placeholder="Add item..."
            placeholderTextColor="#999"
            style={s.input}
            returnKeyType="done"
            onSubmitEditing={() => addItem(listKey)}
          />
          <TouchableOpacity style={s.addBtn} onPress={() => addItem(listKey)} activeOpacity={0.85}>
            <Ionicons name="add" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {unchecked.map((item) => (
          <View key={item.id} style={s.itemRow}>
            <TouchableOpacity style={s.checkbox} onPress={() => toggleItem(listKey, item.id)} activeOpacity={0.7}>
              <View style={s.checkboxEmpty} />
            </TouchableOpacity>
            <Text style={s.itemText}>{item.text}</Text>
            <TouchableOpacity onPress={() => removeItem(listKey, item.id)} activeOpacity={0.7}>
              <Ionicons name="close-circle" size={20} color="#ccc" />
            </TouchableOpacity>
          </View>
        ))}

        {checked.length > 0 && (
          <>
            <Text style={s.doneLabel}>Done ({checked.length})</Text>
            {checked.map((item) => (
              <View key={item.id} style={[s.itemRow, s.itemRowDone]}>
                <TouchableOpacity style={s.checkbox} onPress={() => toggleItem(listKey, item.id)} activeOpacity={0.7}>
                  <View style={s.checkboxChecked}>
                    <Ionicons name="checkmark" size={14} color="#fff" />
                  </View>
                </TouchableOpacity>
                <Text style={[s.itemText, s.itemTextDone]}>{item.text}</Text>
                <TouchableOpacity onPress={() => removeItem(listKey, item.id)} activeOpacity={0.7}>
                  <Ionicons name="close-circle" size={20} color="#ccc" />
                </TouchableOpacity>
              </View>
            ))}
          </>
        )}

        {items.length === 0 && (
          <Text style={s.emptyText}>No items yet</Text>
        )}
      </View>
    );
  };

  return (
    <ScrollView style={s.container} contentContainerStyle={{ paddingBottom: 30 }}>
      {sections.map((section) => {
        const collapsed = collapsedSections[section.key];
        const items = lists[section.key] || [];
        const total = items.length;
        const done = items.filter((i) => i.checked).length;

        return (
          <View key={section.key} style={s.section}>
            <TouchableOpacity
              style={s.sectionHeader}
              onPress={() => toggleCollapse(section.key)}
              activeOpacity={0.7}
            >
              <View style={s.sectionLeft}>
                <View style={[s.sectionIcon, section.key === '_general' && s.sectionIconGeneral]}>
                  <Ionicons name={section.icon} size={16} color="#fff" />
                </View>
                <Text style={s.sectionTitle}>{section.label}</Text>
                {section.allergies && section.allergies.length > 0 && (
                  <Text style={s.allergyHint}>
                    ({section.allergies.join(', ')})
                  </Text>
                )}
              </View>
              <View style={s.sectionRight}>
                <Text style={s.sectionCount}>{done}/{total}</Text>
                <Ionicons
                  name={collapsed ? 'chevron-forward' : 'chevron-down'}
                  size={18}
                  color="#999"
                />
              </View>
            </TouchableOpacity>

            {!collapsed && renderList(section.key)}
          </View>
        );
      })}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F0E2' },

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
  sectionIconGeneral: { backgroundColor: '#9DBB97' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#333' },
  allergyHint: { fontSize: 11, color: '#999', fontWeight: '500' },
  sectionRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sectionCount: { fontSize: 13, color: '#999', fontWeight: '600' },

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
});
