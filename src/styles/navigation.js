// Navigation styles (TopNavigation, BottomNavigation, PersonaBar)
// Color palette:
// Primary (dark green): #5F8A5F
// Secondary (light sage): #9DBB97
// Accent (medium sage): #9FBE9A
// Background (cream): #F4F0E2

export const navigationStyles = {
  // Top Navigation Pills
  topBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 10,
    gap: 10,
    backgroundColor: '#9DBB97',
  },
  topPill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  topPillActive: {
    backgroundColor: '#3D6B3D',
  },
  topPillText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3D6B3D',
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
    backgroundColor: '#9DBB97',
    borderBottomWidth: 1,
    borderBottomColor: '#8AAD84',
  },
  personaPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.35)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  personaPillActive: {
    backgroundColor: '#3D6B3D',
    borderColor: '#3D6B3D',
  },
  personaPillText: {
    fontSize: 14,
    color: '#3D6B3D',
  },
  personaPillTextActive: {
    color: '#fff',
  },

  // Bottom Navigation
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#F4F0E2',
    paddingVertical: 10,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: '#9DBB97',
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
    color: '#5F8A5F',
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
    backgroundColor: '#5F8A5F',
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
    backgroundColor: '#5F8A5F',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  barWrapper: {
  paddingVertical: 10,
  backgroundColor: '#9DBB97',
  borderBottomWidth: 1,
  borderBottomColor: '#8AAD84',
},

barContent: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 20,
  gap: 10,
},

};
