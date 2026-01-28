// Modal styles (ProductModal, IngredientsModal)
export const modalStyles = {
  // Modal Container
  modalScrollView: {
    flex: 1,
    backgroundColor: '#fff',
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
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
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
    borderBottomColor: '#ddd',
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
    color: '#007AFF',
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
    color: '#333',
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
    backgroundColor: '#038141',
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
    backgroundColor: '#ddd',
    borderRadius: 5,
    overflow: 'hidden',
  },
  confidenceFill: {
    height: '100%',
    backgroundColor: '#007AFF',
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
    borderLeftColor: '#007AFF',
  },
  evidenceText: {
    fontSize: 13,
    color: '#333',
    fontStyle: 'italic',
  },

  // Allergen Section
  allergenSection: {
    width: '100%',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 15,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  allergenSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
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
    backgroundColor: '#038141',
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
    borderTopColor: '#ddd',
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
