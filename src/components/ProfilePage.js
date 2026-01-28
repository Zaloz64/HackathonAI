import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/styles';

export default function ProfilePage() {
  return (
    <ScrollView style={profileStyles.container}>
      <View style={profileStyles.header}>
        <View style={profileStyles.avatar}>
          <Ionicons name="person" size={60} color="#fff" />
        </View>
        <Text style={profileStyles.name}>My Profile</Text>
        <Text style={profileStyles.email}>user@example.com</Text>
      </View>

      <View style={profileStyles.section}>
        <Text style={profileStyles.sectionTitle}>My Allergies</Text>
        <View style={profileStyles.allergyTags}>
          <View style={profileStyles.allergyTag}>
            <Text style={profileStyles.allergyTagText}>Gluten</Text>
          </View>
          <View style={profileStyles.allergyTag}>
            <Text style={profileStyles.allergyTagText}>Lactose</Text>
          </View>
          <TouchableOpacity style={profileStyles.addTag}>
            <Ionicons name="add" size={20} color="#007AFF" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={profileStyles.section}>
        <Text style={profileStyles.sectionTitle}>Settings</Text>

        <TouchableOpacity style={profileStyles.menuItem}>
          <Ionicons name="notifications-outline" size={24} color="#333" />
          <Text style={profileStyles.menuItemText}>Notifications</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={profileStyles.menuItem}>
          <Ionicons name="shield-outline" size={24} color="#333" />
          <Text style={profileStyles.menuItemText}>Privacy</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={profileStyles.menuItem}>
          <Ionicons name="help-circle-outline" size={24} color="#333" />
          <Text style={profileStyles.menuItemText}>Help & Support</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={profileStyles.menuItem}>
          <Ionicons name="information-circle-outline" size={24} color="#333" />
          <Text style={profileStyles.menuItemText}>About</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={profileStyles.logoutButton}>
        <Text style={profileStyles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

import { StyleSheet } from 'react-native';

const profileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  allergyTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  allergyTag: {
    backgroundColor: '#FFE5E5',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  allergyTagText: {
    color: '#D63031',
    fontWeight: '500',
  },
  addTag: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
  },
  logoutButton: {
    margin: 20,
    backgroundColor: '#FF3B30',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
