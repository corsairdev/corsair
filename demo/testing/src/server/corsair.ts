import 'dotenv/config';

import { agentql } from '@corsair-dev/agentql';
import { github } from '@corsair-dev/github';
import { gmail } from '@corsair-dev/gmail';
import { googlecalendar } from '@corsair-dev/googlecalendar';
import { googlesheets } from '@corsair-dev/googlesheets';
import { hubspot } from '@corsair-dev/hubspot';
import { linear } from '@corsair-dev/linear';
import { onedrive } from '@corsair-dev/onedrive';
import { sharepoint } from '@corsair-dev/sharepoint';
import { slack } from '@corsair-dev/slack';
import { twilio } from '@corsair-dev/twilio';
import { vapi } from '@corsair-dev/vapi';
import { createCorsair } from 'corsair';

import { sqlite } from '../db';

const appUrl = process.env.APP_URL ?? 'http://localhost:3001';
const hubProjectApiKey = process.env.CORSAIR_API_KEY!;
const hubSigningSecret = process.env.CORSAIR_SIGNING_SECRET!;
// const hubApiUrl = process.env.HUB_API_URL;
// const hubOAuthCallbackUrl = process.env.HUB_OAUTH_CALLBACK_URL;

export const corsair = createCorsair({
	multiTenancy: false,
	database: sqlite,
	kek: process.env.CORSAIR_KEK!,
	permissions: {
		timeout: '10m',
		onTimeout: 'deny',
	},
	hub: {
		// apiUrl: hubApiUrl,
		// oauthCallbackUrl: hubOAuthCallbackUrl,
		projectApiKey: hubProjectApiKey,
		signingSecret: hubSigningSecret,
		deliveryUrl: `${appUrl}/api/corsair`,
	},
	plugins: [
		// github({ authType: 'managed' }),
		slack({
			permissions: {
				mode: 'cautious',
				overrides: {
					'messages.post': 'require_approval',
				},
			},
		}),
		googlesheets(),
		googlecalendar(),
		gmail(),
		linear(),
		sharepoint(),
		onedrive(),
		hubspot(),
		agentql({
			key: process.env.AGENTQL_API_KEY,
		}),
		twilio(),
		vapi({
			key: process.env.VAPI_API_KEY,
			webhookSecret: process.env.VAPI_WEBHOOK_SECRET,
		}),
	],
});
