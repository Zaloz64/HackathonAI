import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function EventsPage({ onOpenFriends, onAddEvent }) {
  const events = [
    { id: 1, title: 'Birthday Party', date: 'Feb 15, 2026', time: '6:00 PM', attendees: 12, icon: 'gift' },
    { id: 2, title: 'Team Lunch', date: 'Feb 18, 2026', time: '12:30 PM', attendees: 8, icon: 'restaurant' },
    { id: 3, title: 'Dinner with Friends', date: 'Feb 22, 2026', time: '7:30 PM', attendees: 5, icon: 'people' },
    { id: 4, title: 'Family Brunch', date: 'Feb 25, 2026', time: '11:00 AM', attendees: 10, icon: 'home' },
  ];

  return (
    <View style={eventStyles.container}>
      <View style={eventStyles.header}>
        <Text style={eventStyles.headerTitle}>Upcoming Events</Text>

        <View style={eventStyles.headerActions}>
          {/* Friends Page Button */}
          <TouchableOpacity
            style={eventStyles.iconButtonSecondary}
            onPress={onOpenFriends}
            activeOpacity={0.85}
          >
            <Ionicons name="people-outline" size={22} color="#F4F0E2" />
          </TouchableOpacity>

          {/* Add Event Button */}
          <TouchableOpacity
            style={eventStyles.addButton}
            onPress={onAddEvent}
            activeOpacity={0.85}
          >
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={eventStyles.eventList}>
        {events.map(event => (
          <TouchableOpacity key={event.id} style={eventStyles.eventCard} activeOpacity={0.85}>
            <View style={eventStyles.eventIcon}>
              <Ionicons name={event.icon} size={24} color="#5F8A5F" />
            </View>
            <View style={eventStyles.eventInfo}>
              <Text style={eventStyles.eventTitle}>{event.title}</Text>
              <View style={eventStyles.eventMeta}>
                <Ionicons name="calendar-outline" size={14} color="#666" />
                <Text style={eventStyles.eventDate}>{event.date}</Text>
                <Ionicons name="time-outline" size={14} color="#666" style={{ marginLeft: 10 }} />
                <Text style={eventStyles.eventDate}>{event.time}</Text>
              </View>
              <View style={eventStyles.attendeesRow}>
                <Ionicons name="people-outline" size={14} color="#5F8A5F" />
                <Text style={eventStyles.attendeesText}>{event.attendees} attendees</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        ))}

        <View style={eventStyles.emptySpace} />
      </ScrollView>
    </View>
  );
}

const eventStyles = StyleSheet.create({
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#9DBB97',
    justifyContent: 'center',
    alignItems: 'center',
  },

  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#9FBE9A',
    justifyContent: 'center',
    alignItems: 'center',
  },

  eventList: { flex: 1, padding: 15 },

  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#9DBB97',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  eventInfo: { flex: 1 },
  eventTitle: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 5 },
  eventMeta: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  eventDate: { fontSize: 13, color: '#666', marginLeft: 5 },
  attendeesRow: { flexDirection: 'row', alignItems: 'center' },
  attendeesText: { fontSize: 13, color: '#5F8A5F', marginLeft: 5 },
  emptySpace: { height: 20 },
});
