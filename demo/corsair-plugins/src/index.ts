import { createCorsair } from 'corsair';
import { drizzleAdapter } from 'corsair/adapters/drizzle';
import { linear, slack } from 'corsair/plugins';
import { db } from './db';
import * as schema from './db/schema';

export const corsair = createCorsair({
	multiTenancy: true,
	database: drizzleAdapter(db, { provider: 'pg', schema }),
	plugins: [
		slack({
			authType: 'api_key',
			credentials: {
				botToken: process.env.SLACK_BOT_TOKEN ?? 'dev-token',
			},
			hooks: {
				messages: {
					post: {
						before(ctx, args) {
							return {
								ctx,
								args,
							};
						},
					},
				},
			},
			errorHandlers: {
				RATE_LIMIT_ERROR: {
					match: () => {
						return false;
					},
					handler: async () => {
						return {
							maxRetries: 3,
							retryStrategy: 'exponential_backoff_jitter',
						};
					},
				},
				DEFAULT: {
					match: () => {
						return true;
					},
					handler: async (error, context) => {
						console.log('default');
						return {
							maxRetries: 0,
						};
					},
				},
			},
		}),
		linear({
			authType: 'api_key',
			credentials: {
				apiKey: process.env.LINEAR_API_KEY ?? 'dev-token',
			},
		}),
	],
	errorHandlers: {
		RATE_LIMIT_ERROR: {
			match: (error: Error, context) => {
				const errorMessage = error.message.toLowerCase();
				return (
					errorMessage.includes('rate_limited') ||
					errorMessage.includes('ratelimited') ||
					error.message.includes('429')
				);
			},
			handler: async (error: Error, context) => {
				console.log(
					`[SLACK:${context.operation}] Rate limit exceeded - ROOT LEVEL`,
				);
				return {
					maxRetries: 5,
				};
			},
		},
	},
});
