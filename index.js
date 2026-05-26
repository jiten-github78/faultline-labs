require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const { WebClient } = require('@slack/web-api');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Slack setup
const slack = new WebClient(process.env.SLACK_BOT_TOKEN);
const channelId = process.env.SLACK_CHANNEL_ID;

// In-memory store
const failures = new Map();

// Slack alert function
async function sendSlackAlert(message) {
  try {
    await slack.chat.postMessage({
      channel: channelId,
      text: message,
    });

    console.log('✅ Slack alert sent');
  } catch (error) {
    console.error('❌ Slack error:', error.message);
  }
}

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// Get all failures
app.get('/failures', (req, res) => {
  res.json(Array.from(failures.values()));
});

// Get single failure
app.get('/failures/:id', (req, res) => {
  const failure = failures.get(req.params.id);

  if (!failure) {
    return res.status(404).json({
      error: 'Failure not found',
    });
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

    // Validation
    if (
      !workflowId ||
      !workflowName ||
      !nodeId ||
      !nodeName ||
      !errorMessage ||
      !executionId ||
      !timestamp
    ) {
      return res.status(400).json({
        error: 'Missing required fields',
      });
    }

    const recovery_id = uuidv4();

    const failureData = {
      recovery_id,
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

    // Slack notification
    await sendSlackAlert(
      `🚨 Workflow Failed: ${workflowName}\n\nError: ${errorMessage}\n\nRecovery ID: ${recovery_id}`
    );

    return res.status(200).json({
      recovery_id,
      status: 'received',
    });
  } catch (error) {
    console.error('❌ Webhook error:', error.message);

    return res.status(500).json({
      error: 'Internal server error',
    });
  }
});

// Resume endpoint
app.post('/recover/:id/resume', (req, res) => {
  const failure = failures.get(req.params.id);

  if (!failure) {
    return res.status(404).json({
      error: 'Failure not found',
    });
  }

  failure.status = 'resumed';

  console.log(`✅ Recovery resumed: ${req.params.id}`);

  res.json({
    success: true,
    status: 'resumed',
  });
});

// Abort endpoint
app.post('/recover/:id/abort', (req, res) => {
  const failure = failures.get(req.params.id);

  if (!failure) {
    return res.status(404).json({
      error: 'Failure not found',
    });
  }

  failure.status = 'aborted';

  console.log(`❌ Recovery aborted: ${req.params.id}`);

  res.json({
    success: true,
    status: 'aborted',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Relay server running on port ${PORT}`);
});