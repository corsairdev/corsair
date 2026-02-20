import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

async function startWatch() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
  );

  // Paste your saved access + refresh token here
  oauth2Client.setCredentials({
    access_token: process.env.GMAIL_ACCESS_TOKEN,
    refresh_token: process.env.GMAIL_REFRESH_TOKEN,
  });

  const gmail = google.gmail({ version: "v1", auth: oauth2Client });

  const res = await gmail.users.watch({
    userId: "me",
    requestBody: {
      topicName: process.env.GMAIL_WEBHOOK_TOPIC,
      labelIds: ["INBOX"],
    },
  });
    
  console.log("WATCH RESPONSE:", res.data);
}

startWatch().catch(console.error);
