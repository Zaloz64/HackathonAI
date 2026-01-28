// Main content area styles (MainContent component)
export const contentStyles = {
  // Main Content Area
  mainContent: {
    flex: 1,
    backgroundColor: '#e0e0e0',
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
    color: '#666',
  },

  // Scan Preview
  scanPreview: {
    flex: 1,
    backgroundColor: '#fff',
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
    backgroundColor: 'rgba(255,255,255,0.85)',
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
    color: '#666',
    fontWeight: '500',
    marginTop: 15,
  },
  scanSubHint: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
  },
  selectedPersonasHint: {
    fontSize: 14,
    color: '#007AFF',
    marginTop: 15,
    textAlign: 'center',
  },
  lastScanCard: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 10,
  },
  lastScanText: {
    fontSize: 14,
    color: '#333',
  },

  // Safety Overlay
  safetyOverlay: {
    backgroundColor: 'rgba(0,0,0,0.75)',
    padding: 30,
    borderRadius: 12,
    alignItems: 'center',
    maxWidth: '90%',
  },
  safeIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#34C759',
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
