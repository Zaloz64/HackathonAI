// Button styles (shared across components)
// Color palette:
// Primary (dark green): #5F8A5F
// Secondary (light sage): #9DBB97
// Accent (medium sage): #9FBE9A
// Background (cream): #F4F0E2

export const buttonStyles = {
  button: {
    backgroundColor: '#5F8A5F',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  viewButton: {
    backgroundColor: '#9DBB97',
  },
  ingredientButton: {
    backgroundColor: '#9FBE9A',
  },
  analyzeButton: {
    backgroundColor: '#5F8A5F',
    marginTop: 30,
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#8B4513',
    marginTop: 40,
    marginBottom: 50,
  },
  cancelButton: {
    position: 'absolute',
    bottom: 50,
    width: '60%',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
};
