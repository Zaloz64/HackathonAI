import React from 'react';
import { View, Text, Image, TouchableOpacity, Modal, ScrollView, ActivityIndicator } from 'react-native';
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


          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Extracted Text</Text>
            <Text style={styles.sectionContent}>
              {scannedIngredients?.raw || 'No text extracted'}
            </Text>
          </View>

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

              {/* All 6 allergen sections */}
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

              {/* Notes */}
              {allergenVerdict.notes && (
                <Text style={styles.notesText}>{allergenVerdict.notes}</Text>
              )}

              <Text style={styles.methodText}>Method: {allergenVerdict.method}</Text>
            </>
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
