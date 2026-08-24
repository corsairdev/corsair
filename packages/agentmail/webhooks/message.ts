import { logEventFromContext } from 'corsair/core';
import { cacheAgentMailMessage } from '../cache-message';
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
		const corsairEntityId = await cacheAgentMailMessage(ctx, event.message);

		await logEventFromContext(
			ctx,
			'agentmail.webhook.messageReceived',
			{
				event_id: event.event_id,
				inbox_id: event.message.inbox_id,
				message_id: event.message.message_id,
				thread_id: event.message.thread_id,
			},
			'completed',
		);

		return {
			success: true,
			corsairEntityId,
			data: event,
		};
	},
};
