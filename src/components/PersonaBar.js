import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { PERSONAS } from '../config/constants';
import { styles } from '../styles/styles';

export default function PersonaBar({ selectedPersonas, onTogglePersona }) {
  return (
    <View style={styles.personaBar}>
      {PERSONAS.map(persona => (
        <TouchableOpacity
          key={persona.id}
          style={[
            styles.personaPill,
            selectedPersonas.includes(persona.id) && styles.personaPillActive
          ]}
          onPress={() => onTogglePersona(persona.id)}
        >
          <Text style={[
            styles.personaPillText,
            selectedPersonas.includes(persona.id) && styles.personaPillTextActive
          ]}>
            {persona.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
