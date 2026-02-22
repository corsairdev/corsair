/**
 * Setup guide for the Google Calendar plugin.
 *
 * This string is read by the Corsair setup agent at runtime to walk a developer
 * through configuring the integration. It is NOT intended for human readers —
 * the agent interprets the instructions and asks the user one step at a time.
 */
export const GoogleCalendarSetup = `
## Google Calendar OAuth2 Setup

Google Calendar uses OAuth2 and requires 4 credentials:
- **client_id** + **client_secret** (integration-level, shared) — from your GCP OAuth app
- **access_token** + **refresh_token** (account-level) — from the OAuth flow

Walk the user through these steps exactly, one at a time:

---

### Step 1: Check for an existing GCP project

ask_human: "Do you already have a Google Cloud Platform project you'd like to use, or should we create a new one?"

- If yes → go to Step 2.
- If no → tell them:
  1. Go to https://console.cloud.google.com
  2. Click the project dropdown at the top → "New Project"
  3. Name it (e.g., "Corsair") and click "Create"
  ask_human: "Let me know once your GCP project is ready!"

---

### Step 2: Enable the Google Calendar API

Tell them:
- In GCP Console, go to "APIs & Services" → "Library" (left sidebar)
- Search for "Google Calendar API" → click it → click "Enable"

ask_human: "Done enabling the Google Calendar API? Let me know!"

---

### Step 3: Configure the OAuth Consent Screen

Ask first: "Have you already set up an OAuth consent screen for this GCP project?"

If not, tell them:
- Go to "APIs & Services" → "OAuth consent screen"
- Choose "External" → click "Create"
- Fill in:
  - App name: anything (e.g., "Corsair")
  - User support email: their Google email
  - Developer contact: their email
- Click "Save and Continue"
- On Scopes → click "Add or Remove Scopes" → search "calendar" → select: https://www.googleapis.com/auth/calendar → click "Update" → "Save and Continue"
- On Test Users → click "Add Users" → add their Google email → "Save and Continue"

ask_human: "Done with the OAuth consent screen? Let me know!"

---

### Step 4: Create OAuth 2.0 Credentials

Tell them:
- Go to "APIs & Services" → "Credentials"
- Click "+ Create Credentials" → "OAuth client ID"
- Application type: **Web application**
- Name: anything (e.g., "Corsair Calendar")
- Under "Authorized redirect URIs" → click "+ Add URI" → add:
  \`https://developers.google.com/oauthplayground\`
- Click "Create"
- A popup shows the **Client ID** and **Client Secret** — copy both

ask_human: "Have you got your Client ID and Client Secret? Let me know!"

---

### Step 5: Enter Client ID and Client Secret

Call get_setup_url for plugin="googlecalendar" (no field — shows all fields).
Send the message: "Enter your Client ID and Client Secret at this URL: {URL}. Look for the 'OAuth2 Client ID' and 'OAuth2 Client Secret' fields."

ask_human: "Let me know when you've saved the Client ID and Client Secret!"

Then call verify_setup. If client_id and client_secret are both set, move on. If not, send the URL again with a note to double-check.

---

### Step 6: Get Access Token and Refresh Token (OAuth Playground)

Tell them:
1. Go to https://developers.google.com/oauthplayground/
2. Click the **gear icon (⚙️)** top right → check "Use your own OAuth credentials"
3. Enter your Client ID and Client Secret → close the settings panel
4. In the left panel, scroll to "Google Calendar API v3"
5. Check the scope: \`https://www.googleapis.com/auth/calendar\`
6. Click "Authorize APIs" → sign in with Google → click "Allow"
7. On Step 2: click the blue "Exchange authorization code for tokens" button
8. In the JSON response on the right, copy:
   - \`access_token\`
   - \`refresh_token\`

ask_human: "Let me know when you have both tokens!"

---

### Step 7: Enter Access Token and Refresh Token

Call get_setup_url for plugin="googlecalendar".
Send: "Enter your Access Token and Refresh Token at this URL: {URL}"

ask_human: "Let me know when you've saved both tokens!"

Then call verify_setup. If all 4 fields (client_id, client_secret, access_token, refresh_token) are set, the plugin is ready!

---

### Step 8: Webhook Setup (Optional)

Tell them: "Google Calendar is now connected! Would you like to set up webhooks so Corsair can trigger automations when your calendar events change? This requires a public HTTPS URL for your Corsair server, which we'll help you set up."

ask_human: "Do you want to set up webhooks? Reply 'yes' or 'no'."

If no → call finish_setup with "Google Calendar is all set! You can now create, read, update, and delete calendar events from Corsair."

If yes → proceed to Step 9.

---

### Step 9: Get a Public Webhook URL

ask_human: "Do you already have a public HTTPS URL for this Corsair server (e.g. from Railway, Render, Vercel, or a VPS)? If so, reply with the base URL. If not, reply 'no' and I'll help you set up ngrok."

If they provide a URL: the webhook endpoint is \`{their-url}/api/webhook\`. Go to Step 11.

If 'no' → Step 10: ngrok setup.

---

### Step 10: Set Up ngrok

Tell them: "We'll use ngrok to create a temporary public URL that tunnels to your local Corsair server. It takes about 2 minutes to set up."

**Install ngrok** (if not already):
- Mac: \`brew install ngrok\`
- Or download from https://ngrok.com/download
- Or: \`npm install -g ngrok\`

ask_human: "Do you have ngrok installed? Run \`which ngrok\` to check. Reply 'yes' or 'no'."

If no: give them the install command for their OS. ask_human: "Let me know once ngrok is installed!"

**Authenticate ngrok:**
Tell them:
1. Sign up (free) at https://ngrok.com
2. Go to https://dashboard.ngrok.com/get-started/your-authtoken
3. Copy your auth token
4. Run: \`ngrok config add-authtoken YOUR_TOKEN_HERE\`

ask_human: "Done adding your ngrok auth token? Let me know!"

**Start the tunnel:**
Tell them: "Now run this in a separate terminal (keep it open while using webhooks):"
\`\`\`
ngrok http 3001
\`\`\`
"Copy the Forwarding URL that looks like \`https://abc123.ngrok-free.app\`"

ask_human: "What's the HTTPS forwarding URL from ngrok? (e.g. https://abc123.ngrok-free.app)"

The webhook URL will be: \`{their-ngrok-url}/api/webhook\`

---

### Step 11: Create the Calendar Watch Channel

Now run the watch setup script. The webhook URL is \`{url-from-step-9-or-10}/api/webhook\`.

Run this from alongside their package.json to ensure imports will be correctly linked.

Use run_script with this TypeScript code (fill in the actual webhook URL and calendar ID):

\`\`\`typescript
import * as crypto from 'node:crypto';

import * as crypto from 'node:crypto';
import { corsair } from './server/corsair';

const main = async () => {
	const getClientId = corsair.keys.googlecalendar.get_client_id;
	const getClientSecret = corsair.keys.googlecalendar.get_client_secret;
	const getRefreshToken = corsair.googlecalendar.keys.get_refresh_token;

	const [clientId, clientSecret, refreshToken] = await Promise.all([
		getClientId(),
		getClientSecret(),
		getRefreshToken(),
	]);

	if (!clientId || !clientSecret || !refreshToken) {
		console.error(
			'Missing credentials — please complete credential setup first.',
		);
		process.exit(1);
	}

	// Refresh access token
	const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams({
			client_id: clientId,
			client_secret: clientSecret,
			refresh_token: refreshToken,
			grant_type: 'refresh_token',
		}),
	});

	if (!tokenRes.ok) {
		const err = await tokenRes.text();
		console.error('Token refresh failed:', err);
		process.exit(1);
	}

	const { access_token } = (await tokenRes.json()) as { access_token: string };

	// Create the watch channel
	const channelId = crypto.randomUUID();
	const WEBHOOK_URL = 'REPLACE_WITH_WEBHOOK_URL'; // e.g. https://abc123.ngrok-free.app/api/webhook
	const CALENDAR_ID = 'primary'; // or specific calendar ID

	const watchRes = await fetch(
		'https://www.googleapis.com/calendar/v3/calendars/' +
			encodeURIComponent(CALENDAR_ID) +
			'/events/watch',
		{
			method: 'POST',
			headers: {
				Authorization: 'Bearer ' + access_token,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				id: channelId,
				type: 'web_hook',
				address: WEBHOOK_URL,
			}),
		},
	);

	if (!watchRes.ok) {
		const err = await watchRes.text();
		console.error('Calendar watch failed:', err);
		process.exit(1);
	}

	const data = (await watchRes.json()) as {
		id: string;
		resourceId: string;
		expiration: string;
	};

	const expiration = new Date(Number(data.expiration)).toISOString();
	console.log('Watch channel created!');
	console.log('Channel ID:', channelId);
	console.log('Resource ID:', data.resourceId);
	console.log('Expiration:', expiration);
	console.log('');
	console.log('IMPORTANT: This watch channel expires on', expiration);
	console.log('To renew it, re-run this setup step before it expires.');
};

main().catch((e: Error) => {
  console.error(e.message);
  process.exit(1);
});
\`\`\`

Replace REPLACE_WITH_WEBHOOK_URL with the actual URL and run_script it. Report the output (Channel ID, Resource ID, Expiration) to the user.

Then call finish_setup with a message like: "Google Calendar is fully set up with webhooks! Channel expires on {date} — you can re-run this setup step to renew it when needed."
`;
