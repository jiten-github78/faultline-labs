# CODEX / AI USAGE REPORT

## Project: Relay MVP
AI-powered workflow failure recovery system for n8n

---

## Session 1 — AI Summarization Service

- **Goal:** Build AI-powered workflow failure summarization using Groq LLM
- **Status:** ✅ Completed
- **Tool Used:** ChatGPT (acting as Codex equivalent)
- **Date:** May 27, 2026

### Prompt Given to AI

Generate a JavaScript function `generateAISummary(errorMessage, workflowName)` that uses Groq's Llama 3.3 70B model to analyze AI workflow failures.

Requirements:
- Use OpenAI SDK with Groq base URL
- Return plain-English summaries
- Keep summaries concise and actionable
- Include fallback error handling
- Optimized for operations teams with non-technical users

---

### AI-Generated Components

- `generateAISummary()` function
- Groq + OpenAI SDK integration
- Structured system prompts
- Error handling fallback responses
- AI-generated recovery summaries

---

### Manual Engineering Changes

- Fixed import ordering issues
- Added `.env` configuration debugging
- Replaced localhost with `127.0.0.1` for n8n compatibility
- Built Express webhook architecture manually
- Added Slack alert integration
- Implemented recovery ID generation using UUID
- Debugged n8n Error Trigger workflow integration
- Fixed request payload validation issues

---

### Why AI Helped

Without AI assistance:
- Prompt engineering and LLM integration would take several hours
- Groq API integration required experimentation
- Structured AI summaries required multiple iterations

Using AI accelerated:
- LLM integration
- Summary formatting
- Error handling structure
- Boilerplate generation

Estimated time saved: 3–4 hours.

---

### Final Result

Relay MVP can now:
- Detect failed n8n workflows
- Send failures to an Express backend
- Generate AI-powered plain-English recovery summaries
- Send Slack alerts automatically
- Store failures with recovery IDs

The system successfully demonstrated end-to-end AI-assisted workflow recovery automation.