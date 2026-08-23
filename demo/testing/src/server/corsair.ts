import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

import { diffbot } from '@corsair-dev/diffbot';
import { createCorsair } from 'corsair';

import { sqlite } from '../db';

const hubProjectApiKey =
	process.env.CORSAIR_DEV_API_KEY ??
	process.env.CORSAIR_API_KEY ??
	'test_api_key';
const hubSigningSecret =
	process.env.CORSAIR_DEV_SIGNING_SECRET ??
	process.env.CORSAIR_SIGNING_SECRET ??
	'test_signing_secret';
// const hubApiUrl = process.env.HUB_API_URL;
// const hubOAuthCallbackUrl = process.env.HUB_OAUTH_CALLBACK_URL;

export const corsair = createCorsair({
	multiTenancy: false,
	database: sqlite,
	kek: process.env.CORSAIR_KEK ?? 'fallback_kek_for_testing_only',
	permissions: {
		timeout: '10m',
		onTimeout: 'deny',
	},
	hub: {
		// apiUrl: hubApiUrl,
		// oauthCallbackUrl: hubOAuthCallbackUrl,
		projectApiKey: hubProjectApiKey,
		signingSecret: hubSigningSecret,
	},
	plugins: [
		diffbot({
			key: process.env.DIFFBOT_API_KEY,
		}),
	],
});
