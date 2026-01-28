import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../styles/styles';

export default function TopNavigation({ selectedTab, onSelectTab, personaCount }) {
  return (
    <View style={styles.topBar}>
      <TouchableOpacity
        style={[styles.topPill, selectedTab === 'persona' && styles.topPillActive]}
        onPress={() => onSelectTab('persona')}
      >
        <Text style={[styles.topPillText, selectedTab === 'persona' && styles.topPillTextActive]}>
          Persona ({personaCount})
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.topPill, selectedTab === 'dietary' && styles.topPillActive]}
        onPress={() => onSelectTab('dietary')}
      >
        <Text style={[styles.topPillText, selectedTab === 'dietary' && styles.topPillTextActive]}>
          Dietary
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.topPill, selectedTab === 'events' && styles.topPillActive]}
        onPress={() => onSelectTab('events')}
      >
        <Text style={[styles.topPillText, selectedTab === 'events' && styles.topPillTextActive]}>
          Events (10)
        </Text>
      </TouchableOpacity>
    </View>
  );
}
