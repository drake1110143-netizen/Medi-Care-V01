import { createApp } from './app.js';
import { connectDb } from './config/db.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import './jobs/queues.js';

async function bootstrap() {
  await connectDb();
  const app = createApp();
  app.listen(env.port, () => {
    logger.info('Server started', { port: env.port, apiVersion: '/api/v1' });
  });
}

bootstrap().catch((err) => {
  logger.error('Bootstrap failed', { err });
  process.exit(1);
});
