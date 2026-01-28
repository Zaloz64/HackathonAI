import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function EventsPage() {
  const events = [
    {
      id: 1,
      title: 'Birthday Party',
      date: 'Feb 15, 2026',
      time: '6:00 PM',
      attendees: 12,
      icon: 'gift',
    },
    {
      id: 2,
      title: 'Team Lunch',
      date: 'Feb 18, 2026',
      time: '12:30 PM',
      attendees: 8,
      icon: 'restaurant',
    },
    {
      id: 3,
      title: 'Dinner with Friends',
      date: 'Feb 22, 2026',
      time: '7:30 PM',
      attendees: 5,
      icon: 'people',
    },
    {
      id: 4,
      title: 'Family Brunch',
      date: 'Feb 25, 2026',
      time: '11:00 AM',
      attendees: 10,
      icon: 'home',
    },
  ];

  return (
    <View style={eventStyles.container}>
      <View style={eventStyles.header}>
        <Text style={eventStyles.headerTitle}>Upcoming Events</Text>
        <TouchableOpacity style={eventStyles.addButton}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={eventStyles.eventList}>
        {events.map(event => (
          <TouchableOpacity key={event.id} style={eventStyles.eventCard}>
            <View style={eventStyles.eventIcon}>
              <Ionicons name={event.icon} size={24} color="#007AFF" />
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
                <Ionicons name="people-outline" size={14} color="#007AFF" />
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

import { StyleSheet } from 'react-native';

const eventStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventList: {
    flex: 1,
    padding: 15,
  },
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
    backgroundColor: '#E8F4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  eventMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  eventDate: {
    fontSize: 13,
    color: '#666',
    marginLeft: 5,
  },
  attendeesRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attendeesText: {
    fontSize: 13,
    color: '#007AFF',
    marginLeft: 5,
  },
  emptySpace: {
    height: 20,
  },
});
