# Relay — Operational Recovery Layer for AI Workflows

> “PagerDuty for AI Automation Workflows”

**Status:** ✅ Working MVP built during the OpenAI × Outskill AI Builders Hackathon (May 2026)

**Live Site:** https://faultlinelabs.netlify.app

---

# The Problem

AI workflows fail silently in production.

When workflows built on n8n, Make, LangGraph, or custom automation systems fail:

* Teams manually inspect logs and partial execution states
* Engineers are paged for operational incidents at odd hours
* Recovery is slow, stressful, and inconsistent
* Non-technical operators cannot confidently take action
* Existing orchestration tools focus on developers, not operators

Modern AI infrastructure has orchestration layers, but no operator-friendly recovery layer exists.

As AI workflows become mission-critical, operational reliability becomes a major bottleneck.

---

# What Relay Does

Relay detects workflow failures, explains them in plain English using AI, and helps teams recover incidents directly from Slack.

Relay:

* Captures workflow failure context
* Generates AI-powered operational summaries
* Sends Slack alerts instantly
* Creates recovery IDs for incident tracking
* Enables structured operational recovery

Operators can understand failures and take action without reading logs or paging engineers.

---

# Working MVP Flow

```text
Workflow fails inside n8n
        ↓
Relay backend receives failure event
        ↓
Groq Llama 3.3 analyzes logs + execution context
        ↓
Plain-English AI summary generated
        ↓
Slack alert sent with recovery context + tracking ID
        ↓
Operator reviews incident and takes action
```

---

# Working MVP Features

* ✅ Workflow failure interception via n8n error workflows
* ✅ Express.js webhook backend
* ✅ AI-generated plain-English summaries using Groq Llama 3.3
* ✅ Slack operational alerts
* ✅ UUID-based recovery tracking IDs
* ✅ Failure logging and tracking endpoints
* ✅ End-to-end automation recovery pipeline
* ✅ Real-time webhook integrations
* ✅ Recovery action endpoints (resume / abort)

---

## MVP Screenshots

### n8n Workflow Failure Handling
![n8n workflow](n8n-workflow..png)

### Backend Logs + AI Summary Generation
![backend logs](backend-logs.png)

### Slack AI Operational Alert
![slack alert](slack-alert.png)

---

# Tech Stack

| Component                | Technology                  |
| ------------------------ | --------------------------- |
| Backend / Webhook Server | Node.js + Express           |
| Workflow Automation      | n8n                         |
| AI Summarization         | Groq Llama 3.3 70B          |
| AI SDK                   | OpenAI SDK                  |
| Operational Alerts       | Slack API                   |
| Incident Tracking        | UUID                        |
| APIs                     | REST APIs                   |
| Deployment               | Netlify + Local Node Server |

---

# API Endpoints

## Health Check

GET `/health`

## Get All Failures

GET `/failures`

## Get Failure By ID

GET `/failures/:id`

## Resume Recovery

POST `/recover/:id/resume`

## Abort Recovery

POST `/recover/:id/abort`

## Failure Webhook

POST `/webhook/failure`

---

# Example Slack Alert

```text
🚨 Workflow Failed: Test Failure Workflow

❌ Error:
timeout error

🤖 AI Summary:
The workflow likely failed due to a timeout while waiting for an external service. Retry the workflow after checking service availability.

🆔 Recovery ID: 1234-5678
```

---

# How I Used Codex / OpenAI

OpenAI/Codex-assisted development workflows were used throughout the MVP build process.

AI assistance was used for:

* backend architecture
* debugging
* workflow payload structuring
* webhook integration
* recovery pipeline logic
* AI summarization flow
* Slack integration
* rapid iteration and infrastructure troubleshooting

The project was built using iterative prompt-driven development workflows inside VS Code.

See:
`CODEX_USAGE.md`

---

# Local Setup

## 1. Clone Repository

```bash
git clone https://github.com/jiten-github78/faultline-labs.git
cd faultline-labs
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Create `.env`

```env
SLACK_BOT_TOKEN=xoxb-your-token
SLACK_CHANNEL_ID=C-your-channel
GROQ_API_KEY=gsk-your-key
```

---

## 4. Start Backend

```bash
node index.js
```

Server runs on:

```text
http://localhost:3001
```

---

## 5. Configure n8n Error Workflow

Configure an Error Workflow inside n8n that sends POST requests to:

```text
http://localhost:3001/webhook/failure
```

---

# Target Audience

* Automation agencies managing multiple client workflows
* AI operations teams
* Businesses using n8n or Make
* Internal workflow automation teams
* AI agent startups
* No-code / low-code operators
* Teams managing mission-critical workflows

---

# Vision

Reliable AI automation needs AI-native operational tooling.

Relay is building the operational recovery layer that makes AI workflows:

* understandable
* observable
* recoverable
* operator-friendly

Every mission-critical AI workflow will eventually require an operational recovery system.

---

# Roadmap

### Current MVP

* Workflow failure detection
* AI summaries
* Slack alerts
* Recovery tracking

### Next Steps

* Slack recovery buttons
* Workflow replay / retry
* Persistent database layer
* Dashboard for operators
* Production deployment
* Advanced AI recovery suggestions

---

# Built During Hackathon

Built during the OpenAI × Outskill AI Builders Hackathon 2026.

Focus Areas:

* AI-assisted software development
* Operational reliability
* AI workflow recovery
* Lean MVP execution
* Rapid iteration and shipping

---



GitHub:
https://github.com/jiten-github78


