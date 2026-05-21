# Faultline Labs — Landing Page

Marketing site for **Relay**, an operational recovery layer for AI workflows.
Currently in early validation.

**Status:** Pre-product. Landing page live for design-partner outreach.
Product build planned during the OpenAI × Outskill AI Builders Hackathon (May 25–31, 2026).

**Live site:** https://faultlinelabs.netlify.app

---

## The problem

When AI workflows built on tools like n8n, LangGraph, or custom agents fail in production, recovery is still manual. Teams have to read logs, figure out which steps ran, and decide whether retrying is safe.

## What Relay does

- Captures workflow context at the moment of failure
- Summarizes the incident in plain English
- Routes it to a human via Slack
- Enables structured recovery actions: retry, resume, or abort

---

## What's in this repo

- `index.html` — single-file landing page (HTML / CSS / vanilla JS, no framework)

## What's NOT here yet

The product itself. Building during hackathon week.

The live landing page contains placeholder blocks for customer quotes, design partner logos, founder bio, and demo video — these will be filled with real content as design-partner conversations and the product build progress.

---

## Stack planned for the product build

- **n8n integration** — custom node that intercepts workflow failures
- **Failure summarizer** — Codex / GPT-powered plain-English context generator
- **Slack bot** — one-click recovery actions (resume / modify / abort)
- **State store** — preserve execution context at the failure point

---

## About

Built by Kapil. Reach out: kapildevtamrakar9@gmail.com

---

*This repo will be updated as the product takes shape during hackathon week.*
