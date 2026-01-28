import { PERSONAS } from '../config/constants';

// Get Nutri-Score color based on grade
export const getNutriScoreColor = (grade) => {
  const colors = {
    a: { backgroundColor: '#038141' },
    b: { backgroundColor: '#85BB2F' },
    c: { backgroundColor: '#FECB02' },
    d: { backgroundColor: '#EE8100' },
    e: { backgroundColor: '#E63E11' },
  };
  return colors[grade?.toLowerCase()] || { backgroundColor: '#666' };
};

// Check if product is safe for selected personas
export const checkSafetyForPersonas = (verdict, selectedPersonas) => {
  if (!verdict || selectedPersonas.length === 0) {
    return null;
  }

  const unsafeFor = [];

  selectedPersonas.forEach(personaId => {
    const persona = PERSONAS.find(p => p.id === personaId);
    if (!persona) return;

    const reasons = [];

    // Check gluten
    if (persona.allergies.includes('gluten') && verdict.gluten?.contains) {
      reasons.push('Contains gluten');
    }
    if (persona.allergies.includes('gluten') && verdict.gluten?.traces) {
      reasons.push('May contain traces of gluten');
    }

    // Check milk/lactose
    if ((persona.allergies.includes('milk') || persona.allergies.includes('lactose')) && verdict.milk?.contains) {
      reasons.push('Contains milk');
    }
    if ((persona.allergies.includes('milk') || persona.allergies.includes('lactose')) && verdict.milk?.traces) {
      reasons.push('May contain traces of milk');
    }

    if (reasons.length > 0) {
      unsafeFor.push({ name: persona.name, reasons });
    }
  });

  return {
    safe: unsafeFor.length === 0,
    unsafeFor,
    checkedPersonas: selectedPersonas.map(id => PERSONAS.find(p => p.id === id)?.name).filter(Boolean)
  };
};
