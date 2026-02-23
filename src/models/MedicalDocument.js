import mongoose from 'mongoose';

const medicalDocumentSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    uploaderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    gridFsFileId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
    mimeType: {
      type: String,
      required: true,
      enum: ['application/pdf', 'image/png', 'image/jpeg', 'application/dicom']
    },
    encryptedMetadata: { type: String, required: true },
    ocrText: { type: String, default: '' },
    extractedEntities: { type: mongoose.Schema.Types.Mixed, default: {} },
    summary: { type: String, default: '' },
    embeddings: { type: [Number], default: [] },
    aiPipelineStatus: {
      type: String,
      enum: ['queued', 'processing', 'completed', 'failed'],
      default: 'queued',
      index: true
    },
    aiErrors: [{ type: String }]
  },
  { timestamps: true, strict: 'throw' }
);

medicalDocumentSchema.index({ patientId: 1, createdAt: -1 });
medicalDocumentSchema.index({ patientId: 1, aiPipelineStatus: 1, createdAt: -1 });
medicalDocumentSchema.index({ ocrText: 'text' });
medicalDocumentSchema.index({ embeddings: 1 });

export const MedicalDocument = mongoose.model('MedicalDocument', medicalDocumentSchema);
