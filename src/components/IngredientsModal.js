import React from 'react';
import { View, Text, Image, TouchableOpacity, Modal, ScrollView, ActivityIndicator } from 'react-native';
import { styles } from '../styles/styles';

export default function IngredientsModal({
  visible,
  ingredientsImage,
  scannedIngredients,
  allergenVerdict,
  analyzingAllergens,
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
          <Text style={styles.productName}>Scanned Text</Text>

          {ingredientsImage && (
            <Image source={{ uri: ingredientsImage }} style={styles.productImage} />
          )}

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

              {/* Gluten Section */}
              <View style={styles.allergenSection}>
                <Text style={styles.allergenSectionTitle}>Gluten</Text>
                <View style={styles.allergenRow}>
                  <View style={styles.allergenIndicator}>
                    <Text style={styles.allergenLabel}>Contains:</Text>
                    <View style={[styles.statusBadge, allergenVerdict.gluten?.contains ? styles.statusDanger : styles.statusSafe]}>
                      <Text style={styles.statusText}>{allergenVerdict.gluten?.contains ? 'YES' : 'NO'}</Text>
                    </View>
                  </View>
                  <View style={styles.allergenIndicator}>
                    <Text style={styles.allergenLabel}>Traces:</Text>
                    <View style={[styles.statusBadge, allergenVerdict.gluten?.traces ? styles.statusWarning : styles.statusSafe]}>
                      <Text style={styles.statusText}>{allergenVerdict.gluten?.traces ? 'YES' : 'NO'}</Text>
                    </View>
                  </View>
                </View>
                {allergenVerdict.gluten?.evidence?.length > 0 && (
                  <View style={styles.evidenceInline}>
                    {allergenVerdict.gluten.evidence.map((item, index) => (
                      <Text key={index} style={styles.evidenceTextSmall}>"{item}"</Text>
                    ))}
                  </View>
                )}
                <Text style={styles.confidenceSmall}>
                  Confidence: {Math.round((allergenVerdict.gluten?.confidence || 0) * 100)}%
                </Text>
              </View>

              {/* Milk Section */}
              <View style={styles.allergenSection}>
                <Text style={styles.allergenSectionTitle}>Milk</Text>
                <View style={styles.allergenRow}>
                  <View style={styles.allergenIndicator}>
                    <Text style={styles.allergenLabel}>Contains:</Text>
                    <View style={[styles.statusBadge, allergenVerdict.milk?.contains ? styles.statusDanger : styles.statusSafe]}>
                      <Text style={styles.statusText}>{allergenVerdict.milk?.contains ? 'YES' : 'NO'}</Text>
                    </View>
                  </View>
                  <View style={styles.allergenIndicator}>
                    <Text style={styles.allergenLabel}>Traces:</Text>
                    <View style={[styles.statusBadge, allergenVerdict.milk?.traces ? styles.statusWarning : styles.statusSafe]}>
                      <Text style={styles.statusText}>{allergenVerdict.milk?.traces ? 'YES' : 'NO'}</Text>
                    </View>
                  </View>
                </View>
                {allergenVerdict.milk?.evidence?.length > 0 && (
                  <View style={styles.evidenceInline}>
                    {allergenVerdict.milk.evidence.map((item, index) => (
                      <Text key={index} style={styles.evidenceTextSmall}>"{item}"</Text>
                    ))}
                  </View>
                )}
                <Text style={styles.confidenceSmall}>
                  Confidence: {Math.round((allergenVerdict.milk?.confidence || 0) * 100)}%
                </Text>
              </View>

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
