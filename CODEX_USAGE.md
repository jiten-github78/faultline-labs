# CODEX_USAGE.md — Relay

AI/Codex usage log during OpenAI × Outskill AI Builders Hackathon.

---

### Session 1 — AI Summarization Service ✅
- **Tool:** Codex (ChatGPT/GPT-4)
- **File:** index.js → generateAISummary()

**Prompt:** "Generate a JS function generateAISummary(errorMessage, workflowName) using Groq Llama 3.3 via OpenAI-compatible SDK. Return plain English failure summaries for ops teams."

**Generated:** generateAISummary() with system prompt, user prompt, error handling, fallback response.

**Modifications:** Fixed imports; added debug logging; switched groq-sdk → openai package; added .trim() for env safety.

**Time saved:** 2-3 hours of prompt engineering + Groq integration research.

**Result:** Slack messages include plain-English failure explanations. Ops teams act without reading logs.

---

### Session 2 — Slack Interactive Recovery Buttons ✅
- **Tool:** Codex (ChatGPT/GPT-4)
- **File:** index.js → sendSlackAlert() + Bolt handlers

**Prompt:** "Rewrite Slack alert with Block Kit buttons (Resume/Modify/Abort), each carrying recovery_id. Set up @slack/bolt Socket Mode to listen for clicks, update status, edit message to Resolved."

**Generated:** Block Kit message (header + fields + error + AI summary + 3 buttons) + Bolt Socket Mode setup + 3 action handlers with chat.update.

**Modifications:** Changed sendSlackAlert to accept object; updated webhook caller; removed duplicate require; merged Bolt with Express via async IIFE.

**Time saved:** Block Kit JSON + Bolt Socket Mode is verbose. Codex generated correct schema + handlers instantly.

**Result:** Full recovery loop working. Resume click → ✅ Resolved by @user. Abort click → 🔴 Aborted.

---

### Session 3 — Webhook + Failure Storage Logic ✅
- **Tool:** Codex (ChatGPT/GPT-4)
- **File:** index.js → /webhook/failure endpoint

**Prompt:** "Build Express POST /webhook/failure that validates 7 fields, generates UUID recovery_id, stores in Map, returns recovery_id."

**Generated:** Full endpoint with validation, uuid store, GET /failures, GET /failures/:id, resume/abort stubs.

**Modifications:** Added AI summary call + Slack alert call + emoji logging.

**Time saved:** ~1 hour of boilerplate Express setup.

**Result:** Every n8n failure captured, stored, retrievable via API.

---

### Session 4 — Error Handling + Retry Logic ✅
- **Tool:** Codex (ChatGPT/GPT-4)
- **File:** index.js → generateAISummary() (updated)

**Prompt:** "Add retry logic to generateAISummary. If Groq fails, retry once. If both fail, return fallback string."

**Generated:** while loop with retries counter, try/catch, retry log, fallback return.

**Modifications:** None — generated code integrated directly.

**Time saved:** Retry logic with fallback takes time to get right. Codex got it in one shot.

**Result:** No crashes on Groq failure. Safe fallback returned. Production-ready AI integration.

---

## Summary

| Session | Feature | Status |
|---|---|---|
| 1 | AI Summarization (Groq) | ✅ |
| 2 | Slack Block Kit Buttons + Bolt | ✅ |
| 3 | Webhook + Failure Storage | ✅ |
| 4 | Error Handling + Retry | ✅ |