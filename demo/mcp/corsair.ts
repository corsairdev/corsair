import 'dotenv/config';
import { github } from '@corsair-dev/github';
import { linear } from '@corsair-dev/linear';
// import { gmail } from '@corsair-dev/gmail'
// import { googlecalendar } from '@corsair-dev/googlecalendar'
import { slack } from '@corsair-dev/slack';
import { createCorsair } from 'corsair';
import sqlite from './db.js';

export const corsair = createCorsair({
	database: sqlite,
	kek: process.env.CORSAIR_KEK!,
	multiTenancy: true,
	hub: {
		projectApiKey: process.env.CORSAIR_DEV_API_KEY!,
		signingSecret: process.env.CORSAIR_DEV_SIGNING_SECRET!,
	},
	plugins: [slack(), linear(), github({ authType: 'managed' })],
});
