require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const { WebClient } = require('@slack/web-api');
const { App } = require('@slack/bolt');
const OpenAI = require('openai');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Debug: Check if API key loaded
console.log('GROQ_API_KEY loaded:', process.env.GROQ_API_KEY ? 'YES' : 'NO');
console.log('Key starts with:', process.env.GROQ_API_KEY?.substring(0, 7));

// Groq setup (using OpenAI SDK with Groq base URL)
const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

// Slack setup (for sending messages)
const slack = new WebClient(process.env.SLACK_BOT_TOKEN);
const channelId = process.env.SLACK_CHANNEL_ID;

// Slack Bolt setup (for listening to button clicks)
const boltApp = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
});

// In-memory store
const failures = new Map();

// AI Summary function
async function generateAISummary(errorMessage, workflowName) {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content:
            'You are an AI workflow recovery assistant. Analyze failures and give short, actionable, plain-English summaries for operations teams. No technical jargon.',
        },
        {
          role: 'user',
          content: `Workflow Name: ${workflowName}\nError: ${errorMessage}\n\nProvide:\n1. What likely happened (1 sentence)\n2. Suggested recovery action (1 sentence)\n\nKeep response under 3 sentences total.`,
        },
      ],
      model: 'llama-3.3-70b-versatile',
    });

    return completion.choices[0]?.message?.content || 'AI summary unavailable';
  } catch (error) {
    console.error('❌ AI Summary Error:', error.message);
    return 'AI summary unavailable';
  }
}

// Slack alert function — with interactive buttons (Block Kit)
async function sendSlackAlert({ workflowName, errorMessage, aiSummary, recovery_id }) {
  try {
    await slack.chat.postMessage({
      channel: channelId,
      text: `🚨 Workflow Failed: ${workflowName}`, // fallback text for notifications
      blocks: [
        {
          type: 'header',
          text: { type: 'plain_text', text: '🚨 Workflow Failed', emoji: true },
        },
        {
          type: 'section',
          fields: [
            { type: 'mrkdwn', text: `*Workflow:*\n${workflowName}` },
            { type: 'mrkdwn', text: `*Recovery ID:*\n${recovery_id}` },
          ],
        },
        {
          type: 'section',
          text: { type: 'mrkdwn', text: `*❌ Error:*\n${errorMessage}` },
        },
        {
          type: 'section',
          text: { type: 'mrkdwn', text: `*🤖 AI Summary:*\n${aiSummary}` },
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: { type: 'plain_text', text: 'Resume', emoji: true },
              style: 'primary',
              value: recovery_id,
              action_id: 'resume_workflow',
            },
            {
              type: 'button',
              text: { type: 'plain_text', text: 'Modify', emoji: true },
              value: recovery_id,
              action_id: 'modify_workflow',
            },
            {
              type: 'button',
              text: { type: 'plain_text', text: 'Abort', emoji: true },
              style: 'danger',
              value: recovery_id,
              action_id: 'abort_workflow',
            },
          ],
        },
      ],
    });
    console.log('✅ Slack alert sent');
  } catch (error) {
    console.error('❌ Slack error:', error.message);
  }
}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get all failures
app.get('/failures', (req, res) => {
  res.json(Array.from(failures.values()));
});

// Get single failure
app.get('/failures/:id', (req, res) => {
  const failure = failures.get(req.params.id);
  if (!failure) {
    return res.status(404).json({ error: 'Failure not found' });
  }
  res.json(failure);
});

// Webhook endpoint
app.post('/webhook/failure', async (req, res) => {
  try {
    const {
      workflowId,
      workflowName,
      nodeId,
      nodeName,
      errorMessage,
      executionId,
      timestamp,
    } = req.body;

    if (
      !workflowId ||
      !workflowName ||
      !nodeId ||
      !nodeName ||
      !errorMessage ||
      !executionId ||
      !timestamp
    ) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log('🤖 Generating AI summary...');
    const aiSummary = await generateAISummary(errorMessage, workflowName);
    console.log('✅ AI Summary Generated');

    const recovery_id = uuidv4();

    const failureData = {
      recovery_id,
      aiSummary,
      failure: {
        workflowId,
        workflowName,
        nodeId,
        nodeName,
        errorMessage,
        executionId,
        timestamp,
      },
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    failures.set(recovery_id, failureData);

    console.log('🚨 Failure received');
    console.log(JSON.stringify(failureData, null, 2));

    await sendSlackAlert({ workflowName, errorMessage, aiSummary, recovery_id });

    return res.status(200).json({
      recovery_id,
      status: 'received',
      aiSummary,
    });
  } catch (error) {
    console.error('❌ Webhook error:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Resume endpoint
app.post('/recover/:id/resume', (req, res) => {
  const failure = failures.get(req.params.id);
  if (!failure) {
    return res.status(404).json({ error: 'Failure not found' });
  }
  failure.status = 'resumed';
  console.log(`✅ Recovery resumed: ${req.params.id}`);
  res.json({ success: true, status: 'resumed' });
});

// Abort endpoint
app.post('/recover/:id/abort', (req, res) => {
  const failure = failures.get(req.params.id);
  if (!failure) {
    return res.status(404).json({ error: 'Failure not found' });
  }
  failure.status = 'aborted';
  console.log(`❌ Recovery aborted: ${req.params.id}`);
  res.json({ success: true, status: 'aborted' });
});

// ===== Slack Bolt button handlers =====

boltApp.action('resume_workflow', async ({ ack, body, client }) => {
  await ack();
  const recoveryId = body.actions[0].value;
  console.log('🟢 Resume clicked | Recovery ID:', recoveryId);

  const failure = failures.get(recoveryId);
  if (failure) {
    failure.status = 'resumed';
    console.log(`✅ Recovery resumed: ${recoveryId}`);
  }

  // Update the Slack message to show resolved
  try {
    await client.chat.update({
      channel: body.channel.id,
      ts: body.message.ts,
      text: '✅ Resolved',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `✅ *Resolved* by <@${body.user.id}>\nRecovery ID: ${recoveryId}`,
          },
        },
      ],
    });
  } catch (e) {
    console.error('❌ Message update error:', e.message);
  }
});

boltApp.action('abort_workflow', async ({ ack, body, client }) => {
  await ack();
  const recoveryId = body.actions[0].value;
  console.log('🔴 Abort clicked | Recovery ID:', recoveryId);

  const failure = failures.get(recoveryId);
  if (failure) {
    failure.status = 'aborted';
    console.log(`❌ Recovery aborted: ${recoveryId}`);
  }

  try {
    await client.chat.update({
      channel: body.channel.id,
      ts: body.message.ts,
      text: '🔴 Aborted',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `🔴 *Aborted* by <@${body.user.id}>\nRecovery ID: ${recoveryId}`,
          },
        },
      ],
    });
  } catch (e) {
    console.error('❌ Message update error:', e.message);
  }
});

boltApp.action('modify_workflow', async ({ ack, body }) => {
  await ack();
  const recoveryId = body.actions[0].value;
  console.log('🟡 Modify clicked | Recovery ID:', recoveryId);
});

// Start Express server
app.listen(PORT, () => {
  console.log(`🚀 Relay server running on port ${PORT}`);
});

// Start Slack Bolt (Socket Mode)
(async () => {
  await boltApp.start();
  console.log('⚡ Slack Bolt running');
})();