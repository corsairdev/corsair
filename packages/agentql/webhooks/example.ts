import { logEventFromContext } from 'corsair/core';
import type { AgentQLWebhooks } from '..';
import { createAgentQLMatch, verifyAgentQLWebhookSignature } from './types';

export const example: AgentQLWebhooks['example'] = {
	match: createAgentQLMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyAgentQLWebhookSignature(request, ctx.key);
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

		await logEventFromContext(ctx, 'agentql.webhook.example', { ...event }, 'completed');

		return { success: true, data: event };
	},
};
