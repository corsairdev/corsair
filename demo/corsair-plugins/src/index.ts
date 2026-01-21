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
			authType: 'bot_token',
			credentials: {
				botToken: process.env.SLACK_BOT_TOKEN ?? 'dev-token',
			},
			errorHandlers: {
				DEFAULT: {
					match: () => true,
					handler: async () => {
						console.log('in default');

						return {
							maxRetries: 2,
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
			// No plugin-specific error handlers defined, so will fall back to root handlers
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

/**
 * Corsair Error Handling Demo - Function-Based Approach
 *
 * This example shows the complete error handling flow using the match/handler pattern:
 *
 * 1. API calls are made through plugin endpoints
 * 2. If an error occurs, each error handler's match function is checked in order:
 *    - Plugin-specific error handlers (checked first)
 *    - Root-level error handlers (fallback)
 *    - System default handler (always matches)
 * 3. The first matching error handler is executed
 * 4. Error handlers return retry strategies
 * 5. Based on the strategy, the system can retry the operation
 *
 * Benefits of the new approach:
 * - No more repetitive try/catch blocks in endpoint code
 * - Each error handler includes its own matching logic (like webhooks)
 * - Plugin-specific handlers take priority over root handlers
 * - Easy to add new error handlers without modifying core code
 * - Strongly typed with minimal duplication
 *
 * Example usage:
 * ```
 * const client = corsair.withTenant('tenant-123');
 *
 * try {
 *   // This will automatically use error handling if the call fails
 *   const result = await client.slack.api.channels.create({
 *     name: 'new-channel'
 *   });
 * } catch (error) {
 *   // Error has been processed by the error handling system
 *   // Retry strategies are logged automatically
 *   console.log('Final error after handling:', error);
 * }
 * ```
 */
