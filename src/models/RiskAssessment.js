import mongoose from 'mongoose';

const factorSchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
    weight: { type: Number, required: true },
    value: { type: Number, required: true },
    contribution: { type: Number, required: true },
    rationale: { type: String, required: true }
  },
  { _id: false }
);

const riskAssessmentSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    score: { type: Number, min: 0, max: 100, required: true },
    tier: { type: String, enum: ['Low', 'Moderate', 'High', 'Critical'], required: true },
    confidenceInterval: {
      lower: { type: Number, min: 0, max: 100, required: true },
      upper: { type: Number, min: 0, max: 100, required: true }
    },
    factors: { type: [factorSchema], default: [] },
    actionPlan: [{ type: String }],
    forecasts: {
      hospitalizationProbability: Number,
      readmissionLikelihood: Number,
      escalationRisk: Number,
      adherenceProbability: Number
    }
  },
  { timestamps: true, strict: 'throw' }
);

riskAssessmentSchema.index({ patientId: 1, createdAt: -1 });
riskAssessmentSchema.index({ score: -1, createdAt: -1 });

export const RiskAssessment = mongoose.model('RiskAssessment', riskAssessmentSchema);
