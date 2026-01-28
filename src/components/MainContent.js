import React from 'react';
import { View, Text, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
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
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Processing...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.mainContent}>
      <View style={styles.scanPreview}>
        {/* Show scanned image if available */}
        {ingredientsImage && (
          <Image
            source={{ uri: ingredientsImage }}
            style={styles.scannedImagePreview}
            blurRadius={4}
          />
        )}

        {/* Safety Result Overlay */}
        {safetyResult && selectedPersonas.length > 0 ? (
          <View style={styles.safetyOverlay}>
            {safetyResult.safe ? (
              <>
                <View style={styles.safeIcon}>
                  <Ionicons name="checkmark" size={60} color="#fff" />
                </View>
                <Text style={styles.safetyTitle}>
                  This is safe for {safetyResult.checkedPersonas?.join(', ')}
                </Text>
              </>
            ) : (
              <>
                <View style={styles.unsafeIcon}>
                  <Ionicons name="close" size={60} color="#fff" />
                </View>
                {safetyResult.unsafeFor.map((person, idx) => (
                  <View key={idx} style={styles.unsafeReasonContainer}>
                    <Text style={styles.safetyTitle}>
                      This is not safe for {person.name}:
                    </Text>
                    {person.reasons.map((reason, rIdx) => (
                      <Text key={rIdx} style={styles.unsafeReason}>• {reason}</Text>
                    ))}
                  </View>
                ))}
              </>
            )}

            {/* View details button */}
            <TouchableOpacity
              style={styles.viewDetailsButton}
              onPress={onViewDetails}
            >
              <Text style={styles.viewDetailsText}>View full details</Text>
            </TouchableOpacity>
          </View>
        ) : ingredientsImage ? (
          <View style={styles.imageOverlay}>
            <Ionicons name="checkmark-circle" size={48} color="#34C759" />
            <Text style={styles.imageOverlayText}>Scan complete</Text>
            {selectedPersonas.length === 0 && (
              <Text style={styles.selectPersonaHint}>Select a persona to check safety</Text>
            )}
          </View>
        ) : (
          <View style={styles.scanFrame}>
            <Ionicons name="camera-outline" size={64} color="#ccc" />
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
            <Ionicons name="document-text" size={20} color="#007AFF" />
            <Text style={styles.lastScanText}>View scan results</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
