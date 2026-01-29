// Modal styles (ProductModal, IngredientsModal)
// Color palette:
// Primary (dark green): #5F8A5F
// Secondary (light sage): #9DBB97
// Accent (medium sage): #9FBE9A
// Background (cream): #F4F0E2

export const modalStyles = {
  // Modal Container
  modalScrollView: {
    flex: 1,
    backgroundColor: '#F4F0E2',
  },
  productModalContainer: {
    padding: 20,
    alignItems: 'center',
    paddingTop: 60,
  },

  // Product Info
  productImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20,
    borderRadius: 10,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
    color: '#333',
  },
  productBrand: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },

  // Nutri-Score
  nutriScoreBadge: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 20,
  },
  nutriScoreText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Sections
  section: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#9DBB97',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#5F8A5F',
  },
  sectionContent: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },

  // Nutrients
  nutrientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#9DBB97',
  },
  nutrientLabel: {
    fontSize: 14,
    color: '#333',
  },
  nutrientValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },

  // Allergens
  allergenText: {
    fontSize: 14,
    color: '#E63E11',
    fontWeight: '500',
  },

  // Ingredients List
  ingredientItem: {
    flexDirection: 'row',
    paddingVertical: 4,
    alignItems: 'flex-start',
  },
  ingredientBullet: {
    fontSize: 14,
    color: '#5F8A5F',
    marginRight: 8,
    fontWeight: 'bold',
  },
  ingredientText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },

  // Results
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5F8A5F',
    marginTop: 10,
    marginBottom: 5,
  },

  // Allergen Verdict
  allergenVerdictContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    marginVertical: 20,
  },
  allergenBadge: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 12,
    minWidth: 120,
    alignItems: 'center',
  },
  allergenDanger: {
    backgroundColor: '#E63E11',
  },
  allergenSafe: {
    backgroundColor: '#5F8A5F',
  },
  allergenBadgeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Confidence
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  confidenceLabel: {
    fontSize: 14,
    color: '#333',
    marginRight: 10,
  },
  confidenceBar: {
    flex: 1,
    height: 10,
    backgroundColor: '#9DBB97',
    borderRadius: 5,
    overflow: 'hidden',
  },
  confidenceFill: {
    height: '100%',
    backgroundColor: '#5F8A5F',
    borderRadius: 5,
  },
  confidenceValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginLeft: 10,
    minWidth: 40,
  },

  // Warnings & Evidence
  fallbackWarning: {
    fontSize: 12,
    color: '#FF9500',
    fontStyle: 'italic',
    marginBottom: 15,
    textAlign: 'center',
  },
  evidenceItem: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 6,
    marginVertical: 4,
    borderLeftWidth: 3,
    borderLeftColor: '#5F8A5F',
  },
  evidenceText: {
    fontSize: 13,
    color: '#333',
    fontStyle: 'italic',
  },

  // Allergen Section
  allergenSection: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#9DBB97',
  },
  allergenSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5F8A5F',
    marginBottom: 10,
  },
  allergenRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  allergenIndicator: {
    alignItems: 'center',
  },
  allergenLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },

  // Status Badges
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  statusDanger: {
    backgroundColor: '#E63E11',
  },
  statusWarning: {
    backgroundColor: '#FF9500',
  },
  statusSafe: {
    backgroundColor: '#5F8A5F',
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },

  // Evidence Inline
  evidenceInline: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#9DBB97',
  },
  evidenceTextSmall: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  confidenceSmall: {
    fontSize: 12,
    color: '#888',
    marginTop: 8,
    textAlign: 'right',
  },

  // Notes
  notesText: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 10,
  },
  methodText: {
    fontSize: 11,
    color: '#999',
    marginTop: 5,
    textAlign: 'center',
  },
};
