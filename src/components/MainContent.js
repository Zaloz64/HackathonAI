import React from 'react';
import { View, Text, Image, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { PERSONAS } from '../config/constants';
import { styles } from '../styles/styles';

export default function MainContent({
  loading,
  ingredientsImage,
  safetyResult,
  selectedPersonas,
  selectedAllergens,
  selectedEventId,
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

  const hasSelection = selectedPersonas.length > 0 || (selectedAllergens && selectedAllergens.length > 0) || !!selectedEventId;
  const showResult = !!(ingredientsImage && safetyResult && hasSelection);

  const getUnsafeNames = () => {
    if (!safetyResult || safetyResult.safe) return [];
    return safetyResult.unsafeFor.map(p => p.name);
  };

  const checkedNames =
    safetyResult?.checkedAllergens?.length
      ? safetyResult.checkedAllergens.join(', ')
      : safetyResult?.checkedPersonas?.length
        ? safetyResult.checkedPersonas.join(', ')
        : selectedPersonas
            .map(id => PERSONAS.find(p => p.id === id)?.name)
            .filter(Boolean)
            .join(', ');

  return (
    <View style={styles.mainContent}>
      <View style={styles.scanPreview}>
        {/* LAYER 1: Base image - centered */}
        {ingredientsImage && (
          <Image
            source={{ uri: ingredientsImage }}
            style={localStyles.centeredImage}
          />
        )}

        {/* LAYER 2-5: Result overlays */}
        {showResult && (
          <>
            {/* Blur */}
            <BlurView intensity={30} tint="light" style={localStyles.overlay} />

            {/* Dim */}
            <View style={localStyles.dimOverlay} />

            {/* Center icon */}
            <View style={localStyles.centerOverlay}>
              <View style={safetyResult.safe ? styles.checkmarkCircle : styles.crossCircle}>
                <Ionicons
                  name={safetyResult.safe ? 'checkmark' : 'close'}
                  size={90}
                  color="#fff"
                />
              </View>
            </View>

            {/* Top badge */}
            <View style={[
              localStyles.topBadge,
              safetyResult.safe ? localStyles.badgeSafe : localStyles.badgeUnsafe,
            ]}>
              <Ionicons
                name={safetyResult.safe ? 'checkmark-circle' : 'close-circle'}
                size={18}
                color="#fff"
              />
              <Text style={localStyles.badgeText}>
                {safetyResult.safe ? 'SAFE' : 'NOT SAFE'}
              </Text>
              <Text style={localStyles.badgeSubtext} numberOfLines={2}>
                {safetyResult.safe
                  ? safetyResult.eventTitle
                    ? `Safe for all ${safetyResult.totalInvited} at ${safetyResult.eventTitle}`
                    : `For: ${checkedNames}`
                  : safetyResult.eventTitle
                    ? `Unsafe for ${safetyResult.unsafeCount} of ${safetyResult.totalInvited} at ${safetyResult.eventTitle}`
                    : `Not for: ${getUnsafeNames().join(', ')}`}
              </Text>
            </View>

            {/* Bottom "View details" button */}
            <TouchableOpacity style={localStyles.bottomButton} onPress={onViewDetails}>
              <Text style={localStyles.bottomButtonText}>View details</Text>
              <Ionicons name="chevron-forward" size={16} color="#fff" />
            </TouchableOpacity>
          </>
        )}

        {/* No image - show scan prompt */}
        {!ingredientsImage && (
          <View style={styles.scanFrame}>
            <Ionicons name="camera-outline" size={64} color="#9DBB97" />
            <Text style={styles.scanHint}>Tap the scan button below</Text>
            <Text style={styles.scanSubHint}>to scan ingredients or barcode</Text>
            {selectedPersonas.length > 0 && (
              <Text style={styles.selectedPersonasHint}>
                Checking for:{' '}
                {selectedPersonas
                  .map(id => PERSONAS.find(p => p.id === id)?.name)
                  .filter(Boolean)
                  .join(', ')}
              </Text>
            )}
          </View>
        )}

        {/* Image but no selection - show prompt */}
        {ingredientsImage && !hasSelection && (
          <View style={localStyles.selectOverlay}>
            <Ionicons name="people-outline" size={48} color="#5F8A5F" />
            <Text style={styles.selectPersonaText}>Select a persona or allergen above</Text>
            <Text style={styles.selectPersonaSubtext}>to check if this is safe</Text>
          </View>
        )}
      </View>
    </View>
  );
}

// Local styles
const localStyles = StyleSheet.create({
  centeredImage: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'contain',  // Center and fit image within bounds
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  dimOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  centerOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(244,240,226,0.95)',
  },
  topBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badgeSafe: {
    backgroundColor: 'rgba(95,138,95,0.95)',
  },
  badgeUnsafe: {
    backgroundColor: 'rgba(211,47,47,0.95)',
  },
  badgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
  },
  badgeSubtext: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  bottomButton: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    backgroundColor: 'rgba(95,138,95,0.9)',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  bottomButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
