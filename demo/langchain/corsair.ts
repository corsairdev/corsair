import 'dotenv/config';
import { slack } from '@corsair-dev/slack';
import { createCorsair } from 'corsair';
import sqlite from './db.js';

export const TENANT = process.env.CORSAIR_TENANT ?? 'demo';

export const corsair = createCorsair({
	database: sqlite,
	kek: process.env.CORSAIR_KEK!,
	multiTenancy: true,
	hub: {
		projectApiKey: process.env.CORSAIR_API_KEY!,
		signingSecret: process.env.CORSAIR_SIGNING_SECRET!,
	},
	plugins: [slack({ authType: 'managed' })],
});
