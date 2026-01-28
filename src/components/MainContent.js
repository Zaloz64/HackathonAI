import React from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PERSONAS } from '../config/constants';
import { styles } from '../styles/styles';

export default function MainContent({
  loading,
  ingredientsImage,
  safetyResult,
  selectedPersonas,
  scannedIngredients,
  onViewDetails,
}) {
  if (loading) {
    return (
      <View style={styles.mainContent}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5F8A5F" />
          <Text style={styles.loadingText}>Processing...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.mainContent}>
      <View style={styles.scanPreview}>
        {/* Safety Result - Clean display */}
        {safetyResult && selectedPersonas.length > 0 ? (
          <View style={styles.safetyResultContainer}>
            {safetyResult.safe ? (
              <>
                <View style={styles.safeIconLarge}>
                  <Ionicons name="checkmark" size={80} color="#fff" />
                </View>
                <Text style={styles.safetyResultText}>
                  This is safe for {safetyResult.checkedPersonas?.join(', ')}:
                </Text>
              </>
            ) : (
              <>
                <View style={styles.unsafeIconLarge}>
                  <Ionicons name="close" size={80} color="#fff" />
                </View>
                {safetyResult.unsafeFor.map((person, idx) => (
                  <View key={idx} style={styles.unsafeReasonBlock}>
                    <Text style={styles.safetyResultText}>
                      This is not safe for {person.name}:
                    </Text>
                    {person.reasons.map((reason, rIdx) => (
                      <Text key={rIdx} style={styles.unsafeReasonItem}>• {reason}</Text>
                    ))}
                  </View>
                ))}
              </>
            )}

            {/* View details link */}
            <TouchableOpacity
              style={styles.viewDetailsLink}
              onPress={onViewDetails}
            >
              <Text style={styles.viewDetailsLinkText}>View full details</Text>
            </TouchableOpacity>
          </View>
        ) : ingredientsImage ? (
          <View style={styles.scanCompleteContainer}>
            <Ionicons name="checkmark-circle" size={48} color="#5F8A5F" />
            <Text style={styles.imageOverlayText}>Scan complete</Text>
            {selectedPersonas.length === 0 && (
              <Text style={styles.selectPersonaHint}>Select a persona to check safety</Text>
            )}
          </View>
        ) : (
          <View style={styles.scanFrame}>
            <Ionicons name="camera-outline" size={64} color="#9DBB97" />
            <Text style={styles.scanHint}>Tap the scan button below</Text>
            <Text style={styles.scanSubHint}>to scan ingredients or barcode</Text>
            {selectedPersonas.length > 0 && (
              <Text style={styles.selectedPersonasHint}>
                Checking for: {selectedPersonas.map(id => PERSONAS.find(p => p.id === id)?.name).join(', ')}
              </Text>
            )}
          </View>
        )}

        {/* View last scan */}
        {scannedIngredients && !safetyResult && (
          <TouchableOpacity
            style={styles.lastScanCard}
            onPress={onViewDetails}
          >
            <Ionicons name="document-text" size={20} color="#5F8A5F" />
            <Text style={styles.lastScanText}>View scan results</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
