export function buildLifestylePlan({ riskTier, allergies = [], preferences = [] }) {
  return {
    weeklyMealPlan: {
      calories: riskTier === 'Critical' ? 1700 : 2100,
      macros: { protein: 30, carbs: 40, fat: 30 },
      glycemicLoad: 'controlled',
      sodiumMg: 1800,
      exclusions: allergies,
      preferences
    },
    activity: {
      cardioMinPerWeek: riskTier === 'Critical' ? 90 : 150,
      strengthSessions: 2,
      rehabSensitive: true
    },
    sleep: { targetHours: 8 },
    stress: ['breathing-10min', 'mindfulness-15min'],
    hydration: { liters: 2.5 }
  };
}
