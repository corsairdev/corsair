import 'dotenv/config';
import { github } from '@corsair-dev/github';
import { createCorsair } from 'corsair';
import { pool } from './db/index';

export const corsair = createCorsair({
	kek: process.env.CORSAIR_KEK!,
	database: pool,

	hub: {
		projectApiKey: process.env.CORSAIR_DEV_API_KEY!,
		signingSecret: process.env.CORSAIR_DEV_SIGNING_SECRET!,
	},

	plugins: [github({ authType: 'managed' })],
});
