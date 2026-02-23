import { Queue, Worker, QueueEvents } from 'bullmq';
import { redis } from '../config/redis.js';
import { processDocumentAI } from '../services/ai/documentIntelligence.js';
import { logger } from '../config/logger.js';
import { MedicalDocument } from '../models/MedicalDocument.js';

export const documentQueue = new Queue('document-intelligence', { connection: redis });
export const documentQueueEvents = new QueueEvents('document-intelligence', { connection: redis });

export const documentWorker = new Worker(
  'document-intelligence',
  async (job) => {
    try {
      return await processDocumentAI(job.data);
    } catch (error) {
      await MedicalDocument.findByIdAndUpdate(job.data.documentId, {
        aiPipelineStatus: 'failed',
        $push: { aiErrors: error.message }
      });
      throw error;
    }
  },
  { connection: redis }
);

documentWorker.on('completed', (job) => {
  logger.info('Document job completed', { jobId: job.id });
});

documentWorker.on('failed', (job, err) => {
  logger.error('Document job failed', { jobId: job?.id, err: err.message });
});
