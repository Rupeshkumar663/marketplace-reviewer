# InspectFlow - Marketplace Listing Quality & Policy Reviewer

InspectFlow is an AI-powered compliance auditing system that reviews e-commerce listings against marketplace legal, safety, and brand policies. It features a deterministic validation engine, a high-throughput Groq LLM integration (`openai/gpt-oss-120b`), and a human-in-the-loop remediation dashboard.

## Key Features
- **Deterministic Guardrails:** Sub-millisecond pre-checks for missing fields, invalid pricing, duplicate titles, and excessive capitalization.
- **AI Policy Reasoner:** Evaluates listings for deceptive claims, superlatives, and prohibited medical promises with cited policy sections.
- **Graceful Fallback:** Automatically switches to deterministic regex heuristics if the AI engine encounters rate limits or network failures.
- **Side-by-Side Remediation:** Granular diff viewer allowing human auditors to accept, reject, or edit proposed fixes per field.
- **Decision Audit Trail:** Complete ledger tracking all submitted reviews and auditor overrides.

## Tech Stack
- **Backend:** Node.js, Express (ES Modules), Groq Cloud API
- **Frontend:** React, Vite, Redux Toolkit, Tailwind CSS
- **Testing:** Node Native Test Runner (`node:test`, `node:assert/strict`)

## Getting Started

### 1. Backend Setup
```bash
cd backend
npm install
# Ensure backend/.env contains PORT=5000 and GROQ_API_KEY
npm run dev