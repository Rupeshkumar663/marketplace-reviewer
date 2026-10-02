# Agent Architecture & Operational Playbook

## Architectural Flow
1. **Deterministic Rule Layer (`validator.js`):** Runs first locally to validate core invariants (required fields, positive price, title casing rules, duplicate checks).
2. **AI Semantic Gateway (`aiService.js`):** Routes listings to Groq LPU using `openai/gpt-oss-120b` enforcing structured JSON outputs.
3. **Resilience Strategy:** Automatically degrades to regex-based local fallback heuristics if API requests fail or credentials are omitted.
4. **Human Review Loop (`DiffViewer.jsx`):** Allows compliance officers to review changes side-by-side with granular accept/edit/reject controls before ledger persistence.
