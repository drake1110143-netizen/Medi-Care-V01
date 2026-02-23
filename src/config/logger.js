import winston from 'winston';
import { env } from './env.js';

const { combine, timestamp, json, errors } = winston.format;

export const logger = winston.createLogger({
  level: env.nodeEnv === 'production' ? 'info' : 'debug',
  format: combine(timestamp(), errors({ stack: true }), json()),
  defaultMeta: { service: 'medicare-intelligence-backend' },
  transports: [new winston.transports.Console()]
});
