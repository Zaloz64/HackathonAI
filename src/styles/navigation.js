// Navigation styles (TopNavigation, BottomNavigation, PersonaBar)
export const navigationStyles = {
  // Top Navigation Pills
  topBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 10,
    backgroundColor: '#fff',
  },
  topPill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#e8e8e8',
  },
  topPillActive: {
    backgroundColor: '#007AFF',
  },
  topPillText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  topPillTextActive: {
    color: '#fff',
  },

  // Persona Bar
  personaBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  personaPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  personaPillActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  personaPillText: {
    fontSize: 14,
    color: '#666',
  },
  personaPillTextActive: {
    color: '#fff',
  },

  // Bottom Navigation
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  navItem: {
    alignItems: 'center',
    flex: 1,
  },
  navLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
  },
  navLabelActive: {
    color: '#007AFF',
  },

  // Scan Button (in bottom nav)
  scanButton: {
    marginTop: -30,
  },
  scanButtonSmall: {
    marginTop: 0,
  },
  scanButtonInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  scanButtonInnerSmall: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
};
