const WEIGHTS = {
  demographics: 0.1,
  vitalsDeviation: 0.15,
  labVariance: 0.15,
  chronicBurden: 0.15,
  medicationAdherence: 0.1,
  behavioral: 0.1,
  missedAppointments: 0.1,
  documentTrends: 0.15
};

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

export function classifyTier(score) {
  if (score >= 85) return 'Critical';
  if (score >= 70) return 'High';
  if (score >= 40) return 'Moderate';
  return 'Low';
}

export function computeRisk(input) {
  const factors = Object.entries(WEIGHTS).map(([key, weight]) => {
    const value = clamp(Number(input[key] ?? 0));
    return {
      key,
      weight,
      value,
      contribution: Number((weight * value).toFixed(2)),
      rationale: `${key} contributed ${(weight * value).toFixed(2)} points`
    };
  });

  const score = clamp(factors.reduce((sum, f) => sum + f.contribution, 0));
  const tier = classifyTier(score);
  const uncertainty = 5 + (input.dataCompleteness ? (100 - input.dataCompleteness) * 0.05 : 5);

  return {
    score: Number(score.toFixed(2)),
    tier,
    confidenceInterval: {
      lower: clamp(score - uncertainty),
      upper: clamp(score + uncertainty)
    },
    factors,
    actionPlan: [
      'Prioritize medication adherence reinforcement',
      'Schedule follow-up based on urgency tier',
      'Trigger lifestyle plan recalibration'
    ],
    forecasts: {
      hospitalizationProbability: Number((score / 100).toFixed(2)),
      readmissionLikelihood: Number(((score * 0.85) / 100).toFixed(2)),
      escalationRisk: Number(((score * 0.9) / 100).toFixed(2)),
      adherenceProbability: Number((1 - input.medicationAdherence / 120).toFixed(2))
    }
  };
}

export function simulateWhatIf(currentInput, changes) {
  const baseline = computeRisk(currentInput);
  const projectedInput = { ...currentInput, ...changes };
  const projected = computeRisk(projectedInput);
  return {
    baseline,
    projected,
    percentageImprovement: Number((((baseline.score - projected.score) / baseline.score) * 100 || 0).toFixed(2)),
    timeToImpactDays: 14,
    sensitivity: Object.keys(changes).map((k) => ({ factor: k, delta: (changes[k] ?? 0) - (currentInput[k] ?? 0) }))
  };
}
