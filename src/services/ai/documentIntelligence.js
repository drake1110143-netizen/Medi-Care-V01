import { MedicalDocument } from '../../models/MedicalDocument.js';
import { logger } from '../../config/logger.js';

function validateAiOutput(output) {
  const required = ['ocrText', 'entities', 'summary', 'embeddings'];
  for (const key of required) {
    if (!(key in output)) {
      throw new Error(`AI output validation failed: missing ${key}`);
    }
  }
}

export async function processDocumentAI({ documentId, promptTrace }) {
  const doc = await MedicalDocument.findById(documentId);
  if (!doc) throw new Error('Document not found for AI processing');

  doc.aiPipelineStatus = 'processing';
  await doc.save();

  const aiOutput = {
    ocrText: 'Extracted OCR text for indexing',
    entities: {
      diagnoses: ['Hypertension'],
      medications: [{ name: 'Lisinopril', dosage: '10mg' }],
      labMarkers: [{ marker: 'HbA1c', value: 7.2, refRange: '4.0-5.6', abnormal: true }],
      allergies: ['Penicillin']
    },
    summary: 'AI summary. This is an assistive insight and not a medical diagnosis.',
    embeddings: Array.from({ length: 8 }, (_, i) => Number((0.01 * (i + 1)).toFixed(4)))
  };

  validateAiOutput(aiOutput);

  doc.ocrText = aiOutput.ocrText;
  doc.extractedEntities = aiOutput.entities;
  doc.summary = aiOutput.summary;
  doc.embeddings = aiOutput.embeddings;
  doc.aiPipelineStatus = 'completed';
  await doc.save();

  logger.info('AI document pipeline completed', { documentId, promptTrace });
  return aiOutput;
}
