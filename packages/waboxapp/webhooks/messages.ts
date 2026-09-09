import { logEventFromContext } from 'corsair/core';
import type { WaboxappWebhooks } from '..';
import {
	AckEventSchema,
	createWaboxappMatch,
	MessageEventSchema,
	parseWaboxappWebhookBody,
	verifyWaboxappWebhookToken,
} from './types';

export const received: WaboxappWebhooks['message'] = {
	match: createWaboxappMatch('message'),

	handler: async (ctx, request) => {
		const parsed = parseWaboxappWebhookBody(request.payload);
		const token =
			parsed && typeof parsed.token === 'string' ? parsed.token : undefined;
		const verification = verifyWaboxappWebhookToken(
			{ payload: { token } },
			ctx.key,
		);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Webhook token verification failed',
			};
		}

		const event = MessageEventSchema.safeParse(parsed);
		if (!event.success) {
			return {
				success: false,
				statusCode: 400,
				error: 'Invalid Waboxapp message payload',
			};
		}

		await logEventFromContext(
			ctx,
			'waboxapp.webhook.message',
			{
				event: event.data.event,
				uid: event.data.uid,
				contactUid: event.data.contact?.uid,
				messageUid: event.data.message?.uid,
				messageType: event.data.message?.type,
			},
			'completed',
		);

		return { success: true, data: event.data };
	},
};

export const ack: WaboxappWebhooks['ack'] = {
	match: createWaboxappMatch('ack'),

	handler: async (ctx, request) => {
		const parsed = parseWaboxappWebhookBody(request.payload);
		const token =
			parsed && typeof parsed.token === 'string' ? parsed.token : undefined;
		const verification = verifyWaboxappWebhookToken(
			{ payload: { token } },
			ctx.key,
		);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Webhook token verification failed',
			};
		}

		const event = AckEventSchema.safeParse(parsed);
		if (!event.success) {
			return {
				success: false,
				statusCode: 400,
				error: 'Invalid Waboxapp ack payload',
			};
		}

		await logEventFromContext(
			ctx,
			'waboxapp.webhook.ack',
			{
				event: event.data.event,
				uid: event.data.uid,
				muid: event.data.muid,
				ack: event.data.ack,
			},
			'completed',
		);

		return { success: true, data: event.data };
	},
};
