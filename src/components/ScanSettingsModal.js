import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PERSONAS, ALLERGENS, EVENTS } from '../config/constants';

export default function ScanSettingsModal({
  visible,
  onClose,
  selectedPersonas,
  onTogglePersona,
  selectedAllergens,
  onToggleAllergen,
  selectedEventId,
  onSelectEvent,
}) {
  const [activeSection, setActiveSection] = useState('persona');

  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  const selectionSummary = () => {
    const parts = [];
    if (selectedPersonas.length > 0)
      parts.push(`${selectedPersonas.length} persona${selectedPersonas.length > 1 ? 's' : ''}`);
    if (selectedAllergens.length > 0)
      parts.push(`${selectedAllergens.length} allergen${selectedAllergens.length > 1 ? 's' : ''}`);
    if (selectedEventId) parts.push('1 event');
    return parts.length ? parts.join(', ') : null;
  };

  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
      <Pressable style={s.backdrop} onPress={onClose} />

      <View style={s.sheet}>
        {/* Handle */}
        <View style={s.handleRow}>
          <View style={s.handle} />
        </View>

        {/* Header */}
        <View style={s.header}>
          <Text style={s.title}>Scan Settings</Text>
          <TouchableOpacity onPress={onClose} activeOpacity={0.8}>
            <Ionicons name="close-circle" size={28} color="#9DBB97" />
          </TouchableOpacity>
        </View>

        {/* Section tabs */}
        <View style={s.tabs}>
          {[
            { key: 'persona', label: 'People', icon: 'people' },
            { key: 'dietary', label: 'Dietary', icon: 'nutrition' },
            { key: 'events', label: 'Events', icon: 'calendar' },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[s.tab, activeSection === tab.key && s.tabActive]}
              onPress={() => setActiveSection(tab.key)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={tab.icon}
                size={18}
                color={activeSection === tab.key ? '#fff' : '#5F8A5F'}
              />
              <Text style={[s.tabText, activeSection === tab.key && s.tabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Content */}
        <ScrollView style={s.content} contentContainerStyle={{ paddingBottom: 20 }}>
          {activeSection === 'persona' && (
            <>
              <Text style={s.sectionHint}>Select people to check safety for:</Text>
              {PERSONAS.map((p) => {
                const active = selectedPersonas.includes(p.id);
                return (
                  <TouchableOpacity
                    key={p.id}
                    style={[s.optionRow, active && s.optionRowActive]}
                    onPress={() => onTogglePersona(p.id)}
                    activeOpacity={0.7}
                  >
                    <View style={[s.avatar, active && s.avatarActive]}>
                      <Ionicons name="person" size={18} color={active ? '#fff' : '#5F8A5F'} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[s.optionName, active && s.optionNameActive]}>{p.name}</Text>
                      {p.allergies.length > 0 && (
                        <Text style={s.optionSub}>
                          Allergies: {p.allergies.map(capitalize).join(', ')}
                        </Text>
                      )}
                    </View>
                    <View style={[s.check, active && s.checkActive]}>
                      {active && <Ionicons name="checkmark" size={16} color="#fff" />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </>
          )}

          {activeSection === 'dietary' && (
            <>
              <Text style={s.sectionHint}>Select allergens to check for:</Text>
              <View style={s.pillGrid}>
                {ALLERGENS.map((a) => {
                  const active = selectedAllergens.includes(a);
                  return (
                    <TouchableOpacity
                      key={a}
                      style={[s.pill, active && s.pillActive]}
                      onPress={() => onToggleAllergen(a)}
                      activeOpacity={0.7}
                    >
                      <Text style={[s.pillText, active && s.pillTextActive]}>
                        {capitalize(a)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </>
          )}

          {activeSection === 'events' && (
            <>
              <Text style={s.sectionHint}>Select an event to check for all guests:</Text>
              {EVENTS.map((e) => {
                const active = selectedEventId === e.id;
                return (
                  <TouchableOpacity
                    key={e.id}
                    style={[s.optionRow, active && s.optionRowActive]}
                    onPress={() => onSelectEvent(e.id)}
                    activeOpacity={0.7}
                  >
                    <View style={[s.avatar, active && s.avatarActive]}>
                      <Ionicons name="calendar" size={18} color={active ? '#fff' : '#5F8A5F'} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[s.optionName, active && s.optionNameActive]}>{e.title}</Text>
                      <Text style={s.optionSub}>{e.date} - {e.time}</Text>
                    </View>
                    <View style={[s.radio, active && s.radioActive]}>
                      {active && <View style={s.radioDot} />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </>
          )}
        </ScrollView>

        {/* Footer summary */}
        <View style={s.footer}>
          <Text style={s.footerText}>
            {selectionSummary() || 'No filters selected'}
          </Text>
          <TouchableOpacity style={s.doneBtn} onPress={onClose} activeOpacity={0.85}>
            <Text style={s.doneBtnText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    marginTop: 'auto',
    backgroundColor: '#F4F0E2',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    minHeight: '50%',
  },
  handleRow: { alignItems: 'center', paddingTop: 10 },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#9DBB97' },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 10,
  },
  title: { fontSize: 20, fontWeight: '800', color: '#333' },

  tabs: {
    flexDirection: 'row',
    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 4,
    gap: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  tabActive: {
    backgroundColor: '#5F8A5F',
  },
  tabText: { fontSize: 13, fontWeight: '700', color: '#5F8A5F' },
  tabTextActive: { color: '#fff' },

  content: { flex: 1, paddingHorizontal: 20, marginTop: 16 },
  sectionHint: { fontSize: 13, color: '#666', marginBottom: 12 },

  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  optionRowActive: {
    backgroundColor: '#E8F0E4',
    borderWidth: 1,
    borderColor: '#9DBB97',
    padding: 13,
  },
  avatar: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#E8F0E4',
    justifyContent: 'center', alignItems: 'center',
    marginRight: 12,
  },
  avatarActive: { backgroundColor: '#5F8A5F' },
  optionName: { fontSize: 15, fontWeight: '600', color: '#333' },
  optionNameActive: { color: '#3D6B3D' },
  optionSub: { fontSize: 12, color: '#888', marginTop: 2 },

  check: {
    width: 24, height: 24, borderRadius: 12,
    borderWidth: 2, borderColor: '#ccc',
    justifyContent: 'center', alignItems: 'center',
  },
  checkActive: { backgroundColor: '#5F8A5F', borderColor: '#5F8A5F' },

  radio: {
    width: 24, height: 24, borderRadius: 12,
    borderWidth: 2, borderColor: '#ccc',
    justifyContent: 'center', alignItems: 'center',
  },
  radioActive: { borderColor: '#5F8A5F' },
  radioDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#5F8A5F' },

  pillGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  pill: {
    paddingHorizontal: 18, paddingVertical: 10,
    borderRadius: 20, backgroundColor: '#fff',
    borderWidth: 1, borderColor: '#9DBB97',
  },
  pillActive: { backgroundColor: '#5F8A5F', borderColor: '#5F8A5F' },
  pillText: { fontSize: 14, fontWeight: '600', color: '#5F8A5F' },
  pillTextActive: { color: '#fff' },

  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    paddingBottom: 34,
    borderTopWidth: 1,
    borderTopColor: '#9DBB97',
    backgroundColor: '#fff',
  },
  footerText: { fontSize: 13, color: '#666', flex: 1 },
  doneBtn: {
    backgroundColor: '#5F8A5F',
    paddingHorizontal: 24, paddingVertical: 10,
    borderRadius: 10,
  },
  doneBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
