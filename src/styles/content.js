// Main content area styles (MainContent component)
// Color palette:
// Primary (dark green): #5F8A5F
// Secondary (light sage): #9DBB97
// Accent (medium sage): #9FBE9A
// Background (cream): #F4F0E2

export const contentStyles = {
  // Main Content Area
  mainContent: {
    flex: 1,
    backgroundColor: '#9DBB97',
    margin: 15,
    borderRadius: 12,
    overflow: 'hidden',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#5F8A5F',
  },

  // Scan Preview (image container)
  scanPreview: {
    flex: 1,
    backgroundColor: '#F4F0E2',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#333',
    margin: 10,
    marginBottom: 0,
    borderRadius: 8,
    overflow: 'hidden',
  },

  // Image - lowest layer
  scannedImagePreview: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    zIndex: 1,
  },

  // Blur overlay - on top of image
  blurOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
  },

  // Dim overlay - on top of blur
  dimOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.15)',
    zIndex: 3,
  },

  // Center icon overlay - on top of dim
  centerIconOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },

  // Result badge at top
  resultBadge: {
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
    zIndex: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 8,
  },
  resultBadgeSafe: {
    backgroundColor: 'rgba(95,138,95,0.92)',
  },
  resultBadgeUnsafe: {
    backgroundColor: 'rgba(211,47,47,0.92)',
  },
  resultBadgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  resultBadgeSubtext: {
    color: 'rgba(255,255,255,0.92)',
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },

  // Checkmark and X circles
  checkmarkCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#5F8A5F',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  crossCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#D32F2F',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },

  // Select Persona Overlay (when image but no persona selected)
  selectPersonaOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(244,240,226,0.9)',
    zIndex: 10,
  },
  selectPersonaText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#5F8A5F',
    marginTop: 12,
  },
  selectPersonaSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },

  // Safety Message Container (below image)
  safetyMessageContainer: {
    backgroundColor: '#F4F0E2',
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  safeMessage: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5F8A5F',
    textAlign: 'center',
  },
  unsafeMessage: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D32F2F',
    textAlign: 'center',
    marginBottom: 8,
  },
  unsafeReasonText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 2,
  },

  // Scan Frame (no image yet)
  scanFrame: {
    alignItems: 'center',
    zIndex: 10,
  },
  scanHint: {
    fontSize: 18,
    color: '#5F8A5F',
    fontWeight: '500',
    marginTop: 15,
  },
  scanSubHint: {
    fontSize: 14,
    color: '#9DBB97',
    marginTop: 5,
  },
  selectedPersonasHint: {
    fontSize: 14,
    color: '#5F8A5F',
    marginTop: 15,
    textAlign: 'center',
  },

  // View Details Link
  viewDetailsLinkText: {
    fontSize: 14,
    color: '#5F8A5F',
    textDecorationLine: 'underline',
    // marginTop: 10,
    position: 'relative',
    bottom: 0,
  },

  // Legacy styles (kept for compatibility)
  scannedImageBlurred: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    opacity: 0.6,
    zIndex: 1,
  },
  safetyIconOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 10,
  },
  imageOverlay: {
    backgroundColor: 'rgba(244,240,226,0.9)',
    paddingHorizontal: 30,
    paddingVertical: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  imageOverlayText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 10,
  },
  selectPersonaHint: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  lastScanCard: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#9FBE9A',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 10,
  },
  lastScanText: {
    fontSize: 14,
    color: '#333',
  },
  scanCompleteContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  safetyResultContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  safeIconLarge: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  unsafeIconLarge: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  safetyResultText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  unsafeReasonBlock: {
    alignItems: 'center',
    marginBottom: 10,
  },
  unsafeReasonItem: {
    fontSize: 14,
    color: '#333',
    marginTop: 4,
  },
  viewDetailsLink: {
    marginTop: 20,
    paddingVertical: 10,
  },
  safetyOverlay: {
    backgroundColor: 'rgba(95,138,95,0.9)',
    padding: 30,
    borderRadius: 12,
    alignItems: 'center',
    maxWidth: '90%',
  },
  safeIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#5F8A5F',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  unsafeIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  safetyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  unsafeReasonContainer: {
    marginBottom: 10,
  },
  unsafeReason: {
    fontSize: 14,
    color: '#fff',
    marginLeft: 10,
  },
  viewDetailsButton: {
    marginTop: 15,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
  },
  viewDetailsText: {
    color: '#fff',
    fontSize: 14,
  },
};
