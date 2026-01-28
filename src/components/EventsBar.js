import React from 'react';
import { Text, TouchableOpacity, ScrollView } from 'react-native';
import { EVENTS } from '../config/constants';
import { styles } from '../styles/styles';

export default function EventsBar({ selectedEventId, onSelectEvent }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={[styles.barWrapper, { flexGrow: 0 }]}
      contentContainerStyle={styles.barContent}
    >
      {EVENTS.map((event) => (
        <TouchableOpacity
          key={event.id}
          style={[
            styles.personaPill,
            selectedEventId === event.id && styles.personaPillActive,
          ]}
          onPress={() => onSelectEvent(event.id)}
        >
          <Text
            style={[
              styles.personaPillText,
              selectedEventId === event.id && styles.personaPillTextActive,
            ]}
          >
            {event.title}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
