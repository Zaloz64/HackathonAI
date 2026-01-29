import { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/styles';

export default function IngredientsModal({
  visible,
  scannedIngredients,
  allergenVerdict,
  analyzingAllergens,
  safetyResult,
  onAnalyzeAllergens,
  onClose,
}) {
  const [showExtracted, setShowExtracted] = useState(false);

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: '#F4F0E2' }}>
        <ScrollView style={styles.modalScrollView} contentContainerStyle={{ paddingBottom: 20 }}>
          <View style={styles.productModalContainer}>

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

                  

               
                {['gluten', 'milk', 'soy', 'eggs', 'nuts', 'lactose'].map(allergen => {
                  const entry = allergenVerdict[allergen];
                  if (!entry || (!entry.contains && !entry.traces)) return null;
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

                      <Text style={styles.methodText}>Method: {allergenVerdict.method}</Text>

           {allergenVerdict.notes && (
                  <Text style={styles.notesText}>{allergenVerdict.notes}</Text>
                )}

                {/* Collapsible: Extracted text */}
                <TouchableOpacity
                  style={cs.toggle}
                  onPress={() => setShowExtracted(!showExtracted)}
                  activeOpacity={0.7}
                >
                  <Text style={cs.toggleText}>Extracted text</Text>
                  <Ionicons name={showExtracted ? 'chevron-up' : 'chevron-down'} size={18} color="#5F8A5F" />
                </TouchableOpacity>

                {showExtracted && (
                  <View style={cs.extractedBox}>
                    <Text style={cs.extractedText}>
                      {scannedIngredients?.raw || 'No text extracted'}
                    </Text>
                  </View>
                )}
              </>
            )}
            

            {!allergenVerdict && scannedIngredients?.raw && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Extracted Text</Text>
                <Text style={styles.sectionContent}>{scannedIngredients.raw}</Text>
              </View>
            )}
          </View>
        
        </ScrollView>

        {/* Sticky close button */}
        <View style={cs.stickyFooter}>
          <TouchableOpacity style={cs.closeBtn} onPress={onClose} activeOpacity={0.85}>
            <Text style={cs.closeBtnText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const cs = {
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
  toggleText: { fontSize: 14, fontWeight: '700', color: '#5F8A5F' },
  extractedBox: {
    backgroundColor: '#f9f9f6',
    padding: 14,
    borderRadius: 10,
    marginTop: 6,
  },
  extractedText: { fontSize: 13, color: '#555', lineHeight: 20 },
  stickyFooter: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    paddingBottom: 34,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  closeBtn: {
    backgroundColor: '#5F8A5F',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
};
