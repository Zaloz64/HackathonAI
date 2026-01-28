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

  // Scan Preview
  scanPreview: {
    flex: 1,
    backgroundColor: '#F4F0E2',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#333',
    margin: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  scannedImagePreview: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
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
  scanFrame: {
    alignItems: 'center',
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

  // Scan Complete Container
  scanCompleteContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Safety Result - Clean Display (new design)
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
  viewDetailsLinkText: {
    fontSize: 14,
    color: '#5F8A5F',
    textDecorationLine: 'underline',
  },

  // Safety Overlay (legacy - kept for compatibility)
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
