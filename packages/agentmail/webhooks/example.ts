import { logEventFromContext } from 'corsair/core';
import type { AgentMailWebhooks } from '..';
import { createAgentMailMatch, verifyAgentMailWebhookSignature } from './types';

export const example: AgentMailWebhooks['example'] = {
	match: createAgentMailMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyAgentMailWebhookSignature(request, ctx.key);
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

		await logEventFromContext(ctx, 'agentmail.webhook.example', { ...event }, 'completed');

		return { success: true, data: event };
	},
};
