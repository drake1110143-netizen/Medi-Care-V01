import multer from 'multer';
import { env } from '../../../config/env.js';
import { uploadToGridFs, downloadFromGridFs } from '../../../services/ai/gridFsStorage.js';
import { encryptMetadata } from '../../../utils/crypto.js';
import { MedicalDocument } from '../../../models/MedicalDocument.js';
import { documentQueue } from '../../../jobs/queues.js';
import { ok } from '../../../utils/response.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: env.maxUploadBytes }
});

export const uploadMiddleware = upload.single('file');

export async function uploadDocument(req, res) {
  if (!req.file) return res.status(400).json({ success: false, error: 'file is required' });
  const patientId = req.body.patientId || req.user._id.toString();
  const encryptedMetadata = encryptMetadata({
    originalName: req.file.originalname,
    size: req.file.size,
    uploadedAt: new Date().toISOString()
  });

  const gridFsFileId = await uploadToGridFs({
    filename: req.file.originalname,
    mimeType: req.file.mimetype,
    buffer: req.file.buffer,
    metadata: { patientId }
  });

  const doc = await MedicalDocument.create({
    patientId,
    uploaderId: req.user._id,
    gridFsFileId,
    mimeType: req.file.mimetype,
    encryptedMetadata,
    aiPipelineStatus: 'queued'
  });

  await documentQueue.add(
    'process-document',
    { documentId: doc._id.toString(), promptTrace: { requestId: req.requestId, actorId: req.user._id.toString() } },
    { attempts: 3, backoff: { type: 'exponential', delay: 5000 }, removeOnComplete: 50, removeOnFail: 200 }
  );

  return ok(res, doc);
}

export async function streamDocument(req, res) {
  const doc = await MedicalDocument.findById(req.params.id).lean();
  if (!doc) return res.status(404).json({ success: false, error: 'Document not found' });
  res.setHeader('Content-Type', doc.mimeType);
  return downloadFromGridFs(doc.gridFsFileId).pipe(res);
}
