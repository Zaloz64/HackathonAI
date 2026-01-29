import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/styles';

export default function BottomNavigation({
  activeTab,
  onSelectTab,
  onScanPress,
  onScanLongPress,
  loading,
}) {
  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => onSelectTab('events')}
      >
        <Ionicons
          name={activeTab === 'events' ? 'calendar' : 'calendar-outline'}
          size={28}
          color={activeTab === 'events' ? '#5F8A5F' : '#8E8E93'}
        />
        <Text style={[styles.navLabel, activeTab === 'events' && styles.navLabelActive]}>Events</Text>
      </TouchableOpacity>

      {/* Center Scan Button */}
      <TouchableOpacity
        style={activeTab === 'scan' ? styles.scanButton : styles.scanButtonSmall}
        onPress={activeTab === 'scan' ? onScanPress : () => onSelectTab('scan')}
        onLongPress={activeTab === 'scan' ? onScanLongPress : undefined}
        disabled={loading}
      >
        <View style={activeTab === 'scan' ? styles.scanButtonInner : styles.scanButtonInnerSmall}>
          <Ionicons name="scan" size={activeTab === 'scan' ? 32 : 24} color="#fff" />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => onSelectTab('profile')}
      >
        <Ionicons
          name={activeTab === 'profile' ? 'person' : 'person-outline'}
          size={28}
          color={activeTab === 'profile' ? '#5F8A5F' : '#8E8E93'}
        />
        <Text style={[styles.navLabel, activeTab === 'profile' && styles.navLabelActive]}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
}
