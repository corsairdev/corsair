import 'dotenv/config';

import { github } from '@corsair-dev/github';
import { gmail } from '@corsair-dev/gmail';
import { googlecalendar } from '@corsair-dev/googlecalendar';
import { googlesheets } from '@corsair-dev/googlesheets';
import { linear } from '@corsair-dev/linear';
import { onedrive } from '@corsair-dev/onedrive';
import { openweathermap } from '@corsair-dev/openweathermap';
import { sharepoint } from '@corsair-dev/sharepoint';
import { slack } from '@corsair-dev/slack';
import { vapi } from '@corsair-dev/vapi';
import { xquik } from '@corsair-dev/xquik';
import { createCorsair } from 'corsair';
import { sqlite } from '../db';
import { bitwarden } from '@corsair-dev/bitwarden';

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
		openweathermap(),
		vapi({
			key: process.env.VAPI_API_KEY,
			webhookSecret: process.env.VAPI_WEBHOOK_SECRET,
		}),
		bitwarden({
			key: process.env.BITWARDEN_API_KEY,
		xquik({
			key: process.env.XQUIK_API_KEY,
			webhookSecret: process.env.XQUIK_WEBHOOK_SECRET,
		}),
	],
});
