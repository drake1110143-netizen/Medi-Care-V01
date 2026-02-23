import mongoose from 'mongoose';

const baselineLabsSchema = new mongoose.Schema(
  {
    marker: { type: String, required: true, trim: true },
    value: { type: Number, required: true },
    unit: { type: String, trim: true },
    refRangeLow: Number,
    refRangeHigh: Number
  },
  { _id: false }
);

const patientProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    demographics: {
      age: { type: Number, min: 0, max: 120 },
      sex: { type: String, enum: ['male', 'female', 'other'] },
      smoker: { type: Boolean, default: false }
    },
    chronicConditions: [{ type: String, trim: true }],
    allergies: [{ type: String, trim: true }],
    baselineLabs: [baselineLabsSchema]
  },
  { timestamps: true, strict: 'throw' }
);

patientProfileSchema.index({ doctorId: 1, updatedAt: -1 });

export const PatientProfile = mongoose.model('PatientProfile', patientProfileSchema);
