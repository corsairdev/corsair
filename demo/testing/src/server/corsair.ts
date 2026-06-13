import 'dotenv/config';

import { agentmail } from '@corsair-dev/agentmail';
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

export const corsair = createCorsair({
	multiTenancy: false,
	database: sqlite,
	kek: process.env.CORSAIR_KEK!,
	approval: {
		timeout: '10m',
		onTimeout: 'deny',
	},
	plugins: [
		github(),
		slack(),
		googlesheets(),
		googlecalendar(),
		gmail(),
		linear(),
		sharepoint(),
		onedrive(),
		hubspot(),
		twilio(),
		agentmail({
			key: process.env.AGENTMAIL_API_KEY,
			webhookSecret: process.env.AGENTMAIL_WEBHOOK_SECRET,
		}),
		vapi({
			key: process.env.VAPI_API_KEY,
			webhookSecret: process.env.VAPI_WEBHOOK_SECRET,
		}),
	],
});
