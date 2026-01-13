import { createCorsair } from 'corsair';
import { drizzleAdapter } from 'corsair/adapters/drizzle';
import { slack } from 'corsair/plugins';
import { db } from './db';
import * as schema from './db/schema';

export const corsair = createCorsair({
	multiTenancy: false,
	database: drizzleAdapter(db, { provider: 'pg', schema }),
	plugins: [
		slack({
			credentials: {
				botToken: process.env.SLACK_BOT_TOKEN ?? 'dev-token',
			},
		}),
		// linear({
		// 	credentials: {
		// 		apiKey: process.env.LINEAR_API_KEY ?? 'dev-token',
		// 	},
		// }),
	],
});
