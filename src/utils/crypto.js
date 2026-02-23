import crypto from 'crypto';

const SECRET = crypto.createHash('sha256').update(process.env.METADATA_SECRET || 'metadata-secret').digest();

export function encryptMetadata(payload) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', SECRET, iv);
  const text = Buffer.from(JSON.stringify(payload));
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString('base64');
}
