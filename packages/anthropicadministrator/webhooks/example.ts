import { logEventFromContext } from 'corsair/core';
import type { AnthropicAdministratorWebhooks } from '..';
import { createAnthropicAdministratorMatch, verifyAnthropicAdministratorWebhookSignature } from './types';

export const example: AnthropicAdministratorWebhooks['example'] = {
	match: createAnthropicAdministratorMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyAnthropicAdministratorWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;
		if (event.type !== 'example') {
			return { success: true, data: undefined };
		}

		await logEventFromContext(ctx, 'anthropicadministrator.webhook.example', { ...event }, 'completed');

		return { success: true, data: event };
	},
};
