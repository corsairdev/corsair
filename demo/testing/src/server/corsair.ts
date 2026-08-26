import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

import { aryn } from '@corsair-dev/aryn';
import { createCorsair } from 'corsair';

import { sqlite } from '../db';

const hubProjectApiKey =
	process.env.CORSAIR_DEV_API_KEY ??
	process.env.CORSAIR_API_KEY ??
	'mock-hub-key';
const hubSigningSecret =
	process.env.CORSAIR_DEV_SIGNING_SECRET ??
	process.env.CORSAIR_SIGNING_SECRET ??
	'mock-hub-secret';
const kek = process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef';

export const corsair = createCorsair({
	multiTenancy: false,
	database: sqlite,
	kek: kek,
	permissions: {
		timeout: '10m',
		onTimeout: 'deny',
	},
	hub: {
		projectApiKey: hubProjectApiKey,
		signingSecret: hubSigningSecret,
	},
	plugins: [
		aryn({
			key: process.env.ARYN_API_KEY ?? 'mock-aryn-key',
		}),
	],
});
