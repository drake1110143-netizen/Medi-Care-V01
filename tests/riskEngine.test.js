import test from 'node:test';
import assert from 'node:assert/strict';
import { computeRisk, simulateWhatIf } from '../src/services/risk/riskEngine.js';

test('computeRisk returns bounded score with tier', () => {
  const result = computeRisk({
    demographics: 60,
    vitalsDeviation: 55,
    labVariance: 80,
    chronicBurden: 90,
    medicationAdherence: 30,
    behavioral: 40,
    missedAppointments: 20,
    documentTrends: 75,
    dataCompleteness: 90
  });

  assert.equal(typeof result.score, 'number');
  assert.ok(result.score >= 0 && result.score <= 100);
  assert.ok(['Low', 'Moderate', 'High', 'Critical'].includes(result.tier));
  assert.equal(result.factors.length, 8);
});

test('simulateWhatIf projects score improvement', () => {
  const baseline = {
    demographics: 70,
    vitalsDeviation: 70,
    labVariance: 70,
    chronicBurden: 70,
    medicationAdherence: 80,
    behavioral: 75,
    missedAppointments: 60,
    documentTrends: 65
  };
  const sim = simulateWhatIf(baseline, { vitalsDeviation: 45, behavioral: 45, missedAppointments: 20 });
  assert.ok(sim.projected.score < sim.baseline.score);
  assert.ok(sim.percentageImprovement > 0);
});
