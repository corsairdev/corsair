import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

import { close } from '@corsair-dev/close';
import { createCorsair } from 'corsair';
import { sqlite } from '../db';

const hubProjectApiKey = process.env.CORSAIR_API_KEY || 'test_api_key';
const hubSigningSecret =
	process.env.CORSAIR_SIGNING_SECRET || 'test_signing_secret';

export const corsair = createCorsair({
	multiTenancy: false,
	database: sqlite,
	kek: process.env.CORSAIR_KEK || 'test_kek_32_bytes_long_secret_key_123',
	permissions: {
		timeout: '10m',
		onTimeout: 'deny',
	},
	hub: {
		projectApiKey: hubProjectApiKey,
		signingSecret: hubSigningSecret,
	},
	plugins: [
		close({
			key: process.env.CLOSE_API_KEY,
		}),
	],
});
