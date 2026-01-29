import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
  TextInput,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getFriendsOf, getPersonById } from '../config/people';

const CURRENT_USER_ID = 'hugo';

export default function EventDetailPage({ event, onBack }) {
  const allFriends = getFriendsOf(CURRENT_USER_ID);

  // Seed guests from event.attendeeIds if available
  const [guestIds, setGuestIds] = useState(() => {
    if (event.attendeeIds) return [...event.attendeeIds];
    return [CURRENT_USER_ID];
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);

  const guests = guestIds.map(getPersonById).filter(Boolean);

  // Friends not already guests
  const availableFriends = allFriends.filter((f) => !guestIds.includes(f.id));
  const filtered = availableFriends.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  const openModal = () => {
    setSelectedIds([]);
    setSearch('');
    setModalVisible(true);
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const confirmAdd = () => {
    setGuestIds((prev) => [...prev, ...selectedIds]);
    setModalVisible(false);
  };

  // Build dietary summary from guests
  const dietarySummary = (() => {
    const all = new Set();
    guests.forEach((g) => {
      g.allergies?.forEach((a) => all.add(a));
      g.dietaryProfile?.forEach((d) => all.add(d));
    });
    if (all.size === 0) return 'No dietary restrictions';
    return [...all].join(', ');
  })();

  return (
    <View style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={onBack} activeOpacity={0.85}>
          <Ionicons name="chevron-back" size={22} color="#F4F0E2" />
          <Text style={s.backText}>Events</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>{event.title}</Text>
        <View style={{ width: 72 }} />
      </View>

      <ScrollView style={s.body} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Event Info Card */}
        <View style={s.card}>
          <Text style={s.cardTitle}>{event.title}</Text>
          <Text style={s.cardDate}>{event.date} - {event.time}</Text>
          <Text style={s.cardSummary}>{dietarySummary}</Text>
        </View>

        {/* Guests Card */}
        <View style={s.card}>
          <View style={s.guestHeader}>
            <Text style={s.guestTitle}>Guests</Text>
            <TouchableOpacity style={s.addGuestBtn} onPress={openModal} activeOpacity={0.85}>
              <Text style={s.addGuestText}>Add guest</Text>
            </TouchableOpacity>
          </View>

          {guests.map((g) => (
            <View key={g.id} style={s.guestRow}>
              <View style={s.avatar}>
                <Ionicons name="person" size={20} color="#fff" />
              </View>
              <Text style={s.guestName}>{g.name}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Add Guest Modal */}
      <Modal transparent visible={modalVisible} animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <Pressable style={s.backdrop} onPress={() => setModalVisible(false)} />

        <View style={s.modalCenter}>
          <View style={s.modalCard}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>Add guest</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} activeOpacity={0.8}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search friend or username..."
              placeholderTextColor="#999"
              style={s.searchInput}
            />

            <ScrollView style={{ maxHeight: 260 }}>
              {filtered.map((f) => {
                const isSelected = selectedIds.includes(f.id);
                return (
                  <TouchableOpacity
                    key={f.id}
                    style={s.friendRow}
                    onPress={() => toggleSelect(f.id)}
                    activeOpacity={0.7}
                  >
                    <View style={s.avatar}>
                      <Ionicons name="person" size={20} color="#fff" />
                    </View>
                    <Text style={s.friendName}>{f.name}</Text>
                    <View style={[s.radio, isSelected && s.radioSelected]}>
                      {isSelected && <View style={s.radioDot} />}
                    </View>
                  </TouchableOpacity>
                );
              })}
              {filtered.length === 0 && (
                <Text style={s.emptyText}>No friends found</Text>
              )}
            </ScrollView>

            {selectedIds.length > 0 && (
              <TouchableOpacity style={s.confirmBtn} onPress={confirmAdd} activeOpacity={0.85}>
                <Text style={s.confirmText}>Add {selectedIds.length} guest{selectedIds.length > 1 ? 's' : ''}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F0E2' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#5F8A5F',
    borderBottomWidth: 1,
    borderBottomColor: '#9DBB97',
  },
  backBtn: { flexDirection: 'row', alignItems: 'center', width: 72 },
  backText: { fontSize: 14, fontWeight: '700', color: '#F4F0E2' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#F4F0E2' },

  body: { flex: 1, padding: 16 },

  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#333', textAlign: 'center' },
  cardDate: { fontSize: 14, color: '#666', textAlign: 'center', marginTop: 4 },
  cardSummary: { fontSize: 13, color: '#5F8A5F', textAlign: 'center', marginTop: 8 },

  guestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  guestTitle: { fontSize: 17, fontWeight: '700', color: '#333' },
  addGuestBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: '#5F8A5F',
    borderRadius: 8,
  },
  addGuestText: { color: '#fff', fontSize: 13, fontWeight: '700' },

  guestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#9DBB97',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  guestName: { fontSize: 15, color: '#333', fontWeight: '500' },

  // Modal
  backdrop: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  modalCenter: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  modalTitle: { fontSize: 17, fontWeight: '700', color: '#333' },

  searchInput: {
    borderWidth: 0,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: '#333',
    marginVertical: 12,
  },

  friendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  friendName: { flex: 1, fontSize: 15, color: '#333', fontWeight: '500' },

  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: '#5F8A5F',
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#5F8A5F',
  },

  confirmBtn: {
    marginTop: 14,
    backgroundColor: '#5F8A5F',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  confirmText: { color: '#fff', fontSize: 15, fontWeight: '700' },

  emptyText: { color: '#999', fontSize: 14, textAlign: 'center', paddingVertical: 20 },
});
