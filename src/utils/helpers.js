import { PERSONAS, ALLERGENS, EVENTS } from '../config/constants';

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

// Check a persona's allergies against the full verdict
const checkPersonaAgainstVerdict = (persona, verdict) => {
  const reasons = [];
  for (const allergen of persona.allergies) {
    const entry = verdict[allergen];
    if (!entry) continue;
    if (entry.contains) {
      reasons.push(`Contains ${allergen}`);
    }
    if (entry.traces) {
      reasons.push(`May contain traces of ${allergen}`);
    }
  }
  return reasons;
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

    const reasons = checkPersonaAgainstVerdict(persona, verdict);
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

// Check if product is safe for all people invited to an event
export const checkSafetyForEvent = (verdict, eventId) => {
  if (!verdict || !eventId) {
    return null;
  }

  const event = EVENTS.find(e => e.id === eventId);
  if (!event) return null;

  const invitedPersonas = event.invited
    .map(id => PERSONAS.find(p => p.id === id))
    .filter(Boolean);

  const unsafeFor = [];

  invitedPersonas.forEach(persona => {
    const reasons = checkPersonaAgainstVerdict(persona, verdict);
    if (reasons.length > 0) {
      unsafeFor.push({ name: persona.name, reasons });
    }
  });

  return {
    safe: unsafeFor.length === 0,
    unsafeFor,
    checkedPersonas: invitedPersonas.map(p => p.name),
    totalInvited: invitedPersonas.length,
    unsafeCount: unsafeFor.length,
    eventTitle: event.title
  };
};

export const checkSafetyForDiet = (verdict, selectedAllergens) => {
  if (!verdict || selectedAllergens.length === 0) {
    return null;
  }

  const unsafeFor = [];

  selectedAllergens.forEach(allergen => {
    const verdictEntry = verdict[allergen];
    if (!verdictEntry) return;

    const reasons = [];

    if (verdictEntry.contains) {
      reasons.push(`Contains ${allergen}`);
    }
    if (verdictEntry.traces) {
      reasons.push(`May contain traces of ${allergen}`);
    }

    if (reasons.length > 0) {
      unsafeFor.push({ name: allergen, reasons });
    }
  });

  return {
    safe: unsafeFor.length === 0,
    unsafeFor,
    checkedAllergens: [...selectedAllergens]
  };
};
