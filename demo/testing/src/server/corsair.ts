import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

import { browsertool } from '@corsair-dev/browsertool';
import { createCorsair } from 'corsair';

import { sqlite } from '../db';

const hubProjectApiKey =
	process.env.CORSAIR_DEV_API_KEY ?? process.env.CORSAIR_API_KEY!;

const hubSigningSecret =
	process.env.CORSAIR_DEV_SIGNING_SECRET ?? process.env.CORSAIR_SIGNING_SECRET!;

export const corsair = createCorsair({
	multiTenancy: false,
	database: sqlite,
	kek: process.env.CORSAIR_KEK!,
	permissions: {
		timeout: '10m',
		onTimeout: 'deny',
	},
	hub: {
		projectApiKey: hubProjectApiKey,
		signingSecret: hubSigningSecret,
	},
	plugins: [
		browsertool({
			key: process.env.BROWSERTOOL_API_KEY,
			webhookSecret: process.env.BROWSERTOOL_WEBHOOK_SECRET,
		}),
	],
});
