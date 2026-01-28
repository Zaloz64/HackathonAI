// Scanner camera view styles (Scanner component)
// Color palette:
// Primary (dark green): #5F8A5F
// Secondary (light sage): #9DBB97
// Accent (medium sage): #9FBE9A
// Background (cream): #F4F0E2

export const scannerStyles = {
  scannerContainer: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scannerOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scannerFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#9FBE9A',
    borderRadius: 10,
  },
  scannerText: {
    color: '#F4F0E2',
    fontSize: 18,
    marginTop: 20,
  },
};
