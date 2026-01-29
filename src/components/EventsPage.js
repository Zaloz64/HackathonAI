import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EVENTS } from '../config/constants';

const INITIAL_EVENTS = EVENTS.map((e) => ({
  id: e.id,
  title: e.title,
  date: e.date,
  time: e.time,
  attendees: e.invited?.length || 0,
  attendeeIds: e.invited,
  icon: 'calendar',
  location: e.location,
  notes: e.notes,
}));

const ICON_OPTIONS = [
  { name: 'gift', label: 'Party' },
  { name: 'restaurant', label: 'Food' },
  { name: 'people', label: 'Social' },
  { name: 'home', label: 'Home' },
  { name: 'cafe', label: 'Cafe' },
  { name: 'fitness', label: 'Sport' },
];

export default function EventsPage({ onOpenFriends, onOpenEvent }) {
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('gift');

  const openModal = () => {
    setTitle('');
    setDate('');
    setTime('');
    setSelectedIcon('gift');
    setModalVisible(true);
  };

  const addEvent = () => {
    const trimmed = title.trim();
    if (!trimmed) return;

    const newEvent = {
      id: Date.now(),
      title: trimmed,
      date: date.trim() || 'TBD',
      time: time.trim() || 'TBD',
      attendees: 0,
      icon: selectedIcon,
    };

    setEvents((prev) => [...prev, newEvent]);
    setModalVisible(false);
  };

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Text style={s.headerTitle}>Upcoming Events</Text>

        <View style={s.headerActions}>
          <TouchableOpacity
            style={s.iconButtonSecondary}
            onPress={onOpenFriends}
            activeOpacity={0.85}
          >
            <Ionicons name="people-outline" size={22} color="#F4F0E2" />
          </TouchableOpacity>

          <TouchableOpacity
            style={s.addButton}
            onPress={openModal}
            activeOpacity={0.85}
          >
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={s.eventList}>
        {events.map((event) => (
          <TouchableOpacity
            key={event.id}
            style={s.eventCard}
            activeOpacity={0.85}
            onPress={() => onOpenEvent?.(event)}
          >
            <View style={s.eventIcon}>
              <Ionicons name={event.icon} size={24} color="#5F8A5F" />
            </View>
            <View style={s.eventInfo}>
              <Text style={s.eventTitle}>{event.title}</Text>
              <View style={s.eventMeta}>
                <Ionicons name="calendar-outline" size={14} color="#666" />
                <Text style={s.eventDate}>{event.date}</Text>
                <Ionicons name="time-outline" size={14} color="#666" style={{ marginLeft: 10 }} />
                <Text style={s.eventDate}>{event.time}</Text>
              </View>
              <View style={s.attendeesRow}>
                <Ionicons name="people-outline" size={14} color="#5F8A5F" />
                <Text style={s.attendeesText}>{event.attendees} attendees</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        ))}
        <View style={s.emptySpace} />
      </ScrollView>

      {/* Add Event Modal */}
      <Modal transparent visible={modalVisible} animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <Pressable style={s.backdrop} onPress={() => setModalVisible(false)} />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={s.modalCenter}
        >
          <View style={s.modalCard}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>New Event</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} activeOpacity={0.8}>
                <Ionicons name="close" size={22} color="#333" />
              </TouchableOpacity>
            </View>

            <Text style={s.inputLabel}>Title</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Dinner at Hugo's"
              placeholderTextColor="#999"
              style={s.input}
              autoFocus
            />

            <Text style={s.inputLabel}>Date</Text>
            <TextInput
              value={date}
              onChangeText={setDate}
              placeholder="e.g. Feb 28, 2026"
              placeholderTextColor="#999"
              style={s.input}
            />

            <Text style={s.inputLabel}>Time</Text>
            <TextInput
              value={time}
              onChangeText={setTime}
              placeholder="e.g. 7:00 PM"
              placeholderTextColor="#999"
              style={s.input}
            />

            <Text style={s.inputLabel}>Icon</Text>
            <View style={s.iconRow}>
              {ICON_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt.name}
                  style={[s.iconOption, selectedIcon === opt.name && s.iconOptionActive]}
                  onPress={() => setSelectedIcon(opt.name)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={opt.name}
                    size={22}
                    color={selectedIcon === opt.name ? '#fff' : '#5F8A5F'}
                  />
                </TouchableOpacity>
              ))}
            </View>

            <View style={s.modalActions}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={s.btnSecondary} activeOpacity={0.85}>
                <Text style={s.btnSecondaryText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={addEvent} style={s.btnPrimary} activeOpacity={0.85}>
                <Text style={s.btnPrimaryText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F0E2' },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 15,
    backgroundColor: '#5F8A5F',
    borderBottomWidth: 1,
    borderBottomColor: '#9DBB97',
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#F4F0E2' },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },

  iconButtonSecondary: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#9DBB97',
    justifyContent: 'center', alignItems: 'center',
  },
  addButton: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#9FBE9A',
    justifyContent: 'center', alignItems: 'center',
  },

  eventList: { flex: 1, padding: 15 },

  eventCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
  },
  eventIcon: {
    width: 50, height: 50, borderRadius: 25,
    backgroundColor: '#9DBB97',
    justifyContent: 'center', alignItems: 'center', marginRight: 15,
  },
  eventInfo: { flex: 1 },
  eventTitle: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 5 },
  eventMeta: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  eventDate: { fontSize: 13, color: '#666', marginLeft: 5 },
  attendeesRow: { flexDirection: 'row', alignItems: 'center' },
  attendeesText: { fontSize: 13, color: '#5F8A5F', marginLeft: 5 },
  emptySpace: { height: 20 },

  // Modal
  backdrop: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  modalCenter: {
    flex: 1, justifyContent: 'center', paddingHorizontal: 20,
  },
  modalCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 18,
  },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 14,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#333' },

  inputLabel: { fontSize: 13, fontWeight: '600', color: '#666', marginBottom: 4, marginTop: 10 },
  input: {
    backgroundColor: '#f5f5f5', borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 10,
    fontSize: 15, color: '#333',
  },

  iconRow: {
    flexDirection: 'row', gap: 10, marginTop: 8,
  },
  iconOption: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: '#E8F0E4', justifyContent: 'center', alignItems: 'center',
  },
  iconOptionActive: {
    backgroundColor: '#5F8A5F',
  },

  modalActions: {
    flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 18,
  },
  btnSecondary: {
    paddingVertical: 10, paddingHorizontal: 14,
    borderRadius: 10, backgroundColor: '#F1F1F1',
  },
  btnSecondaryText: { color: '#333', fontWeight: '600' },
  btnPrimary: {
    paddingVertical: 10, paddingHorizontal: 14,
    borderRadius: 10, backgroundColor: '#5F8A5F',
  },
  btnPrimaryText: { color: '#fff', fontWeight: '700' },
});
