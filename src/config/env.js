import dotenv from 'dotenv';

dotenv.config();

const required = ['MONGO_URI', 'SESSION_SECRET', 'REDIS_URL'];
for (const key of required) {
  if (!process.env[key]) {
    console.warn(`[config] Missing environment variable: ${key}`);
  }
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 4000),
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/medicare',
  sessionSecret: process.env.SESSION_SECRET || 'change-me',
  redisUrl: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
  maxUploadBytes: Number(process.env.MAX_UPLOAD_BYTES || 20 * 1024 * 1024)
};
