export function evaluatePrescription({ medications = [], allergies = [] }) {
  const interactions = [];
  for (const med of medications) {
    if (allergies.some((a) => med.name.toLowerCase().includes(a.toLowerCase()))) {
      interactions.push({ medication: med.name, severity: 'high', reason: 'allergy conflict' });
    }
  }

  return {
    interactionScore: Math.min(100, interactions.length * 35),
    contraindications: interactions,
    refillPredictionDays: 28,
    adherenceProbability: 0.74,
    polypharmacyRisk: medications.length > 5 ? 'high' : 'moderate'
  };
}
