import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    actorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    actorRole: { type: String },
    action: { type: String, required: true },
    resourceType: { type: String, required: true },
    resourceId: { type: String },
    method: { type: String, required: true },
    path: { type: String, required: true },
    statusCode: { type: Number, required: true },
    requestId: { type: String, required: true },
    details: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  { timestamps: true, strict: true }
);

auditLogSchema.index({ resourceType: 1, createdAt: -1 });
auditLogSchema.index({ actorId: 1, createdAt: -1 });

export const AuditLog = mongoose.model('AuditLog', auditLogSchema);
