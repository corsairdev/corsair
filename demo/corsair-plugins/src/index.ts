import { createCorsair } from 'corsair';
import { drizzleAdapter } from 'corsair/adapters/drizzle';
import { gmail, linear, slack } from 'corsair/plugins';
import { db } from './db';
import * as schema from './db/schema';

export const corsair = createCorsair({
	multiTenancy: true,
	database: drizzleAdapter(db, { provider: 'pg', schema }),
	plugins: [
		slack({
			authType: 'bot_token',
			credentials: {
				botToken: process.env.SLACK_BOT_TOKEN ?? 'dev-token',
			},
		}),
		linear({
			authType: 'api_key',
			credentials: {
				apiKey: process.env.LINEAR_API_KEY ?? 'dev-token',
			},
		}),
		gmail({
			authType: 'oauth_2',
			credentials: {
				clientId: process.env.GMAIL_CLIENT_ID ?? '',
				clientSecret: process.env.GMAIL_CLIENT_SECRET ?? '',
				accessToken: process.env.GMAIL_ACCESS_TOKEN ?? '',
				refreshToken: process.env.GMAIL_REFRESH_TOKEN ?? '',
			},
		}),
	],
});
