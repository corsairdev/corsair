import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

import { docusign } from '@corsair-dev/docusign';
import { createCorsair } from 'corsair';

const hubProjectApiKey =
	process.env.CORSAIR_DEV_API_KEY ??
	process.env.CORSAIR_API_KEY ??
	'test_api_key';
const hubSigningSecret =
	process.env.CORSAIR_DEV_SIGNING_SECRET ??
	process.env.CORSAIR_SIGNING_SECRET ??
	'test_signing_secret';

// Mock Kysely instance interface to satisfy Corsair initialization
const mockDb = {
	selectFrom: () => ({
		select: () => ({
			where: () => ({
				execute: () => Promise.resolve([]),
			}),
			execute: () => Promise.resolve([]),
		}),
	}),
	insertInto: () => ({
		values: () => ({
			execute: () => Promise.resolve([]),
		}),
	}),
	getExecutor: () => ({}),
};

export const corsair = createCorsair({
	multiTenancy: false,
	database: mockDb as any,
	kek: process.env.CORSAIR_KEK ?? '01234567890123456789012345678901',
	permissions: {
		timeout: '10m',
		onTimeout: 'deny',
	},
	hub: {
		projectApiKey: hubProjectApiKey,
		signingSecret: hubSigningSecret,
	},
	plugins: [docusign()],
});
