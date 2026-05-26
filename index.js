require('dotenv').config();

const { WebClient } = require('@slack/web-api');

const slack = new WebClient(process.env.SLACK_BOT_TOKEN);

async function sendAlert() {
  try {
    await slack.chat.postMessage({
      channel: process.env.SLACK_CHANNEL_ID,
      text: '🚨 Relay test alert working successfully'
    });

    console.log('✅ Message sent!');
  } catch (error) {
    console.error(error);
  }
}

sendAlert();