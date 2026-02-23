import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    appointmentDate: { type: Date, required: true },
    urgency: { type: String, enum: ['routine', 'priority', 'urgent', 'critical'], required: true },
    noShowProbability: { type: Number, min: 0, max: 1, default: 0 },
    triageScore: { type: Number, min: 0, max: 100, default: 0 },
    aiRecommendations: { type: mongoose.Schema.Types.Mixed, default: {} },
    status: {
      type: String,
      enum: ['booked', 'rescheduled', 'completed', 'cancelled', 'waitlisted'],
      default: 'booked'
    }
  },
  { timestamps: true, strict: 'throw' }
);

appointmentSchema.index({ doctorId: 1, appointmentDate: 1 });
appointmentSchema.index({ patientId: 1, appointmentDate: -1 });

export const Appointment = mongoose.model('Appointment', appointmentSchema);
