import { createCorsair, linear, resend, slack } from 'corsair';
import { errorHandlers } from 'corsair/plugins/slack/error-handlers';
import { database } from './db';

// hover over anything or try writing code yourself to see how great the DX is!
// control + space for Intellisense

export const corsair = createCorsair({
	database,
	multiTenancy: true,
	kek: process.env.CORSAIR_KEK!,
	plugins: [
		slack({
			errorHandlers: {
				// implement your own custom error handlers
				RATE_LIMIT_ERROR: {
					match: errorHandlers.RATE_LIMIT_ERROR.match,
					handler: async (error, context) => {
						const operation = context.operation;
						console.error(`Rate Limit error: ${error.message} by ${operation}`);
						return {
							// if headers return retryAfter, Corsair prioritizes that
							headersRetryAfterMs: (error as any)?.retryAfter || undefined,
							// otherwise, you can define a retry strategy!
							maxRetries: 3,
							retryStrategy: 'exponential_backoff_jitter',
						};
					},
				},
			},
		}),
		linear({
			hooks: {
				issues: {
					create: {
						async after(ctx, res) {
							// call Corsair plugins from Corsair plugin hooks
							await corsair.withTenant(ctx.tenantId!).slack.api.messages.post({
								channel: '#technology',
								text: `New Linear issue: ${res.title}`,
							});
						},
					},
				},
			},
		}),
		resend({
			webhookHooks: {
				emails: {
					failed: {
						after(ctx, response) {
							// notice that this is a webhook hook
							// Resend will send this out if an email is failed
							// run some code every time this happens!
						},
					},
				},
			},
		}),
	],
});
