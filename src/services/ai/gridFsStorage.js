import mongoose from 'mongoose';
import { Readable } from 'stream';

const allowedMime = new Set(['application/pdf', 'image/png', 'image/jpeg', 'application/dicom']);

export async function uploadToGridFs({ filename, mimeType, buffer, metadata }) {
  if (!allowedMime.has(mimeType)) throw new Error('Unsupported MIME type');
  const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'medical_docs' });
  const uploadStream = bucket.openUploadStream(filename, {
    metadata: { ...metadata, mimeType },
    contentType: mimeType
  });

  await new Promise((resolve, reject) => {
    Readable.from(buffer).pipe(uploadStream).on('error', reject).on('finish', resolve);
  });

  return uploadStream.id;
}

export function downloadFromGridFs(fileId) {
  const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'medical_docs' });
  return bucket.openDownloadStream(new mongoose.Types.ObjectId(fileId));
}
