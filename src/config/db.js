import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from './logger.js';

export async function connectDb() {
  mongoose.set('strictQuery', true);
  await mongoose.connect(env.mongoUri, {
    autoIndex: true,
    maxPoolSize: 50,
    minPoolSize: 5
  });
  logger.info('MongoDB connected', { uri: env.mongoUri });
}
