# Medi-Care V01 Backend

Enterprise-grade, AI-native Node.js + Express + MongoDB backend skeleton for Medicare intelligence workloads.

## Key capabilities
- API versioning under `/api/v1`.
- Strict Mongoose schemas, field validation, and compound indexes.
- Session-based auth (username-only) with MongoDB session store (no JWT).
- Role-based middleware for `management`, `doctor`, `patient` and ownership enforcement.
- GridFS-only medical file storage from in-memory upload streams.
- Audit logging for all API reads/writes with request trace IDs.
- Winston structured logging, rate limiting, and Mongo sanitization.
- BullMQ async pipeline for OCR/entity extraction/summarization/embedding persistence.
- Deterministic risk scoring engine with forecasting + what-if simulation.
- Appointment intelligence smart booking primitives.
- Lifestyle, chatbot, and prescription intelligence service modules.

## Boot
```bash
cp .env.example .env
npm install
npm run dev
```

## Environment
See `.env.example`.

## Security notes
- Closed-environment authentication uses username + secure server-side session.
- MongoDB is source of truth (sessions, domain data, audit trails).
- Sensitive metadata is encrypted before persistence.
- All uploads are validated by MIME and size; no disk persistence is used.
