import { Appointment } from '../../../models/Appointment.js';
import { ok } from '../../../utils/response.js';

export async function smartBook(req, res) {
  const { patientId, doctorId, appointmentDate, riskScore = 0, missedHistory = 0 } = req.body;
  const triageScore = Math.min(100, Number(riskScore) * 0.7 + Number(missedHistory) * 10);
  const urgency = triageScore > 85 ? 'critical' : triageScore > 70 ? 'urgent' : triageScore > 40 ? 'priority' : 'routine';
  const noShowProbability = Math.min(1, Number(missedHistory) * 0.15);

  const appointment = await Appointment.create({
    patientId,
    doctorId,
    appointmentDate,
    urgency,
    noShowProbability,
    triageScore,
    aiRecommendations: {
      followUpIntervalDays: urgency === 'routine' ? 90 : 14,
      reminders: ['T-48h', 'T-24h', 'T-2h'],
      overbookingEligible: noShowProbability > 0.5
    }
  });

  return ok(res, appointment);
}
