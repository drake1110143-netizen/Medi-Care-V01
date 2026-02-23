import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import mongoSanitize from 'express-mongo-sanitize';
import routes from './api/v1/routes/index.js';
import { env } from './config/env.js';
import { apiRateLimiter } from './middleware/rateLimiter.js';
import { requestContext } from './middleware/requestContext.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { auditTrail } from './middleware/auditTrail.js';

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: '2mb' }));
  app.use(mongoSanitize());
  app.use(requestContext);

  app.use(
    session({
      name: 'medicare.sid',
      secret: env.sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: env.nodeEnv === 'production',
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 12
      },
      store: MongoStore.create({ mongoUrl: env.mongoUri, collectionName: 'sessions' })
    })
  );

  app.use(apiRateLimiter);
  app.use(auditTrail);
  app.use('/api/v1', routes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
