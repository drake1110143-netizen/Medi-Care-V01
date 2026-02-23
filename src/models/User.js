import mongoose from 'mongoose';

export const ROLES = ['management', 'doctor', 'patient'];

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 64 },
    role: { type: String, enum: ROLES, required: true },
    profile: {
      firstName: { type: String, trim: true, maxlength: 100 },
      lastName: { type: String, trim: true, maxlength: 100 }
    },
    encryptedFields: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  { timestamps: true, strict: 'throw' }
);

export const User = mongoose.model('User', userSchema);
