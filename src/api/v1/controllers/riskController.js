import { computeRisk, simulateWhatIf } from '../../../services/risk/riskEngine.js';
import { RiskAssessment } from '../../../models/RiskAssessment.js';
import { ok } from '../../../utils/response.js';

export async function generateRisk(req, res) {
  const payload = { ...req.body, medicationAdherence: Number(req.body.medicationAdherence || 0) };
  const result = computeRisk(payload);
  const saved = await RiskAssessment.create({ patientId: req.body.patientId, ...result });
  return ok(res, saved);
}

export async function whatIfSimulation(req, res) {
  const { current, changes } = req.body;
  return ok(res, simulateWhatIf(current, changes));
}
