import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

import { bookingmood } from '@corsair-dev/bookingmood';
import { createCorsair } from 'corsair';

import { sqlite } from '../db';

const hubProjectApiKey =
	process.env.CORSAIR_DEV_API_KEY ?? process.env.CORSAIR_API_KEY;
const hubSigningSecret =
	process.env.CORSAIR_DEV_SIGNING_SECRET ?? process.env.CORSAIR_SIGNING_SECRET;

export const corsair = createCorsair({
	multiTenancy: false,
	database: sqlite,
	kek: process.env.CORSAIR_KEK || 'test-kek-key-32-chars-long-secret!',
	permissions: {
		timeout: '10m',
		onTimeout: 'deny',
	},
	hub:
		hubProjectApiKey && hubSigningSecret
			? {
					projectApiKey: hubProjectApiKey,
					signingSecret: hubSigningSecret,
				}
			: undefined,
	plugins: [bookingmood()],
});
