import { logEventFromContext } from 'corsair/core';
import type { AgentMailWebhooks } from '../index';
import {
	createAgentMailMatch,
	MessageReceivedEventSchema,
	verifyAgentMailWebhookSignature,
} from './types';

export const received: AgentMailWebhooks['messageReceived'] = {
	match: createAgentMailMatch('message.received'),

	handler: async (ctx, request) => {
		const verification = verifyAgentMailWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const parsed = MessageReceivedEventSchema.safeParse(request.payload);
		if (!parsed.success) {
			return {
				success: false,
				statusCode: 400,
				error: 'Invalid AgentMail message.received payload',
			};
		}

		const event = parsed.data;

		await logEventFromContext(
			ctx,
			'agentmail.webhook.messageReceived',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			data: event,
		};
	},
};
