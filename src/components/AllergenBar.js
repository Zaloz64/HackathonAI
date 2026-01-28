import React from 'react';
import { Text, TouchableOpacity, ScrollView } from 'react-native';
import { ALLERGENS } from '../config/constants';
import { styles } from '../styles/styles';

export default function AllergenBar({ selectedAllergens, onToggleAllergen }) {
  const formatAllergen = (allergen) =>
    allergen.charAt(0).toUpperCase() + allergen.slice(1);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={[styles.barWrapper, { flexGrow: 0 }]}     // ✅ prevents tall growth
      contentContainerStyle={styles.barContent}        // ✅ row layout inside
    >
      {ALLERGENS.map((allergen) => (
        <TouchableOpacity
          key={allergen}
          style={[
            styles.personaPill,
            selectedAllergens.includes(allergen) && styles.personaPillActive,
          ]}
          onPress={() => onToggleAllergen(allergen)}
        >
          <Text
            style={[
              styles.personaPillText,
              selectedAllergens.includes(allergen) && styles.personaPillTextActive,
            ]}
          >
            {formatAllergen(allergen)}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
