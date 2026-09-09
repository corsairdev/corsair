import { logEventFromContext } from 'corsair/core';
import type { WaboxappContext, WaboxappWebhooks } from '..';
import {
	AckEventSchema,
	createWaboxappMatch,
	MessageEventSchema,
	parseWaboxappWebhookBody,
	verifyWaboxappWebhookToken,
} from './types';

async function handleWebhook<T>(
	ctx: WaboxappContext,
	payload: unknown,
	schema: {
		safeParse: (
			data: unknown,
		) => { success: true; data: T } | { success: false };
	},
	eventName: string,
	logFields: (data: T) => Record<string, unknown>,
	invalidMessage: string,
) {
	const parsed = parseWaboxappWebhookBody(payload);
	const token =
		parsed && typeof parsed.token === 'string' ? parsed.token : undefined;
	const verification = verifyWaboxappWebhookToken(
		{ payload: { token } },
		ctx.key,
	);
	if (!verification.valid) {
		return {
			success: false as const,
			statusCode: 401,
			error: verification.error || 'Webhook token verification failed',
		};
	}

	const event = schema.safeParse(parsed);
	if (!event.success) {
		return {
			success: false as const,
			statusCode: 400,
			error: invalidMessage,
		};
	}

	await logEventFromContext(ctx, eventName, logFields(event.data), 'completed');
	return { success: true as const, data: event.data };
}

export const received: WaboxappWebhooks['message'] = {
	match: createWaboxappMatch('message'),
	handler: async (ctx, request) =>
		handleWebhook(
			ctx,
			request.payload,
			MessageEventSchema,
			'waboxapp.webhook.message',
			(data) => ({
				event: data.event,
				uid: data.uid,
				contactUid: data.contact?.uid,
				messageUid: data.message?.uid,
				messageType: data.message?.type,
			}),
			'Invalid Waboxapp message payload',
		),
};

export const ack: WaboxappWebhooks['ack'] = {
	match: createWaboxappMatch('ack'),
	handler: async (ctx, request) =>
		handleWebhook(
			ctx,
			request.payload,
			AckEventSchema,
			'waboxapp.webhook.ack',
			(data) => ({
				event: data.event,
				uid: data.uid,
				muid: data.muid,
				ack: data.ack,
			}),
			'Invalid Waboxapp ack payload',
		),
};
