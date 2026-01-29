import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/styles';

export default function IngredientsModal({
  visible,
  ingredientsImage,
  scannedIngredients,
  allergenVerdict,
  analyzingAllergens,
  safetyResult,
  onAnalyzeAllergens,
  onClose,
}) {
  const [showAllergens, setShowAllergens] = useState(false);
  const [showExtracted, setShowExtracted] = useState(false);

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <ScrollView style={styles.modalScrollView}>
        <View style={styles.productModalContainer}>
          <Text style={styles.productName}>More details</Text>

          {!allergenVerdict && (
            <TouchableOpacity
              style={[styles.button, styles.analyzeButton]}
              onPress={onAnalyzeAllergens}
              disabled={analyzingAllergens}
            >
              {analyzingAllergens ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Analyze Allergens</Text>
              )}
            </TouchableOpacity>
          )}

          {allergenVerdict && (
            <>
              <Text style={styles.resultTitle}>Allergen Results</Text>

              {/* People affected summary */}
              {safetyResult && safetyResult.checkedPersonas && (
                <View style={[styles.allergenSection, { marginBottom: 8 }]}>
                  <Text style={styles.allergenSectionTitle}>
                    {safetyResult.eventTitle
                      ? `${safetyResult.eventTitle} — People`
                      : 'People checked'}
                  </Text>
                  <Text style={{ fontSize: 14, color: safetyResult.safe ? '#038141' : '#D32F2F', fontWeight: '700', marginBottom: 4 }}>
                    {safetyResult.safe
                      ? `Safe for all ${safetyResult.checkedPersonas.length} people`
                      : `Unsafe for ${safetyResult.unsafeFor.length} of ${safetyResult.checkedPersonas.length} people`}
                  </Text>
                  {safetyResult.unsafeFor?.map((person, idx) => (
                    <View key={idx} style={{ marginLeft: 8, marginBottom: 4 }}>
                      <Text style={{ fontSize: 13, fontWeight: '600', color: '#D32F2F' }}>{person.name}</Text>
                      {person.reasons.map((reason, rIdx) => (
                        <Text key={rIdx} style={{ fontSize: 12, color: '#666', marginLeft: 8 }}>• {reason}</Text>
                      ))}
                    </View>
                  ))}
                </View>
              )}

              {/* Notes */}
              {allergenVerdict.notes && (
                <Text style={styles.notesText}>{allergenVerdict.notes}</Text>
              )}

              <Text style={styles.methodText}>Method: {allergenVerdict.method}</Text>

              {/* Collapsible: All allergen details */}
              <TouchableOpacity
                style={collapsibleStyles.toggle}
                onPress={() => setShowAllergens(!showAllergens)}
                activeOpacity={0.7}
              >
                <Text style={collapsibleStyles.toggleText}>Show all allergens</Text>
                <Ionicons
                  name={showAllergens ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color="#5F8A5F"
                />
              </TouchableOpacity>

              {showAllergens && (
                <View>
                  {['gluten', 'milk', 'soy', 'eggs', 'nuts', 'lactose'].map(allergen => {
                    const entry = allergenVerdict[allergen];
                    if (!entry) return null;
                    return (
                      <View key={allergen} style={styles.allergenSection}>
                        <Text style={styles.allergenSectionTitle}>{allergen.charAt(0).toUpperCase() + allergen.slice(1)}</Text>
                        <View style={styles.allergenRow}>
                          <View style={styles.allergenIndicator}>
                            <Text style={styles.allergenLabel}>Contains:</Text>
                            <View style={[styles.statusBadge, entry.contains ? styles.statusDanger : styles.statusSafe]}>
                              <Text style={styles.statusText}>{entry.contains ? 'YES' : 'NO'}</Text>
                            </View>
                          </View>
                          <View style={styles.allergenIndicator}>
                            <Text style={styles.allergenLabel}>Traces:</Text>
                            <View style={[styles.statusBadge, entry.traces ? styles.statusWarning : styles.statusSafe]}>
                              <Text style={styles.statusText}>{entry.traces ? 'YES' : 'NO'}</Text>
                            </View>
                          </View>
                        </View>
                        <Text style={styles.confidenceSmall}>
                          Confidence: {Math.round((entry.confidence || 0) * 100)}%
                        </Text>
                      </View>
                    );
                  })}
                </View>
              )}

              {/* Collapsible: Extracted text */}
              <TouchableOpacity
                style={collapsibleStyles.toggle}
                onPress={() => setShowExtracted(!showExtracted)}
                activeOpacity={0.7}
              >
                <Text style={collapsibleStyles.toggleText}>Extracted text</Text>
                <Ionicons
                  name={showExtracted ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color="#5F8A5F"
                />
              </TouchableOpacity>

              {showExtracted && (
                <View style={collapsibleStyles.extractedBox}>
                  <Text style={collapsibleStyles.extractedText}>
                    {scannedIngredients?.raw || 'No text extracted'}
                  </Text>
                </View>
              )}
            </>
          )}

          {/* If no verdict yet, show extracted text normally */}
          {!allergenVerdict && scannedIngredients?.raw && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Extracted Text</Text>
              <Text style={styles.sectionContent}>
                {scannedIngredients.raw}
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.button, styles.closeButton]}
            onPress={onClose}
          >
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Modal>
  );
}

const collapsibleStyles = {
  toggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#E8F0E4',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 14,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#5F8A5F',
  },
  extractedBox: {
    backgroundColor: '#f9f9f6',
    padding: 14,
    borderRadius: 10,
    marginTop: 6,
  },
  extractedText: {
    fontSize: 13,
    color: '#555',
    lineHeight: 20,
  },
};
