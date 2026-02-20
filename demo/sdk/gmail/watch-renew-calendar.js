import { google } from "googleapis";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

async function startWatch() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
  );

  oauth2Client.setCredentials({
    access_token: process.env.GMAIL_ACCESS_TOKEN,
    refresh_token: process.env.GMAIL_REFRESH_TOKEN,
  });

  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  const channelId = crypto.randomUUID();

  const res = await calendar.events.watch({
    calendarId: "primary",
    requestBody: {
      id: channelId,
      type: "web_hook",
      address: process.env.GMAIL_WEBHOOK_URL,
    },
  });

  console.log("WATCH RESPONSE:", res.data);
  console.log("Channel ID:", channelId);
  console.log("Expiration:", new Date(Number(res.data.expiration)).toISOString());
}

startWatch().catch(console.error);
