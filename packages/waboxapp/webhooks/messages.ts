import type { WebhookResponse } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { z } from 'zod';
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
	// unknown justified: webhook boundary receives untyped external HTTP payload.
	payload: unknown,
	schema: {
		safeParse: (
			// unknown justified: schema validator accepts untyped data input.
			data: unknown,
		) => { success: true; data: T } | { success: false };
	},
	eventName: string,
	// unknown justified: event logging payload dictionary allowing dynamic key-value pairs.
	logFields: (data: T) => Record<string, unknown>,
	invalidMessage: string,
): Promise<WebhookResponse<T>> {
	const parsed = parseWaboxappWebhookBody(payload);
	const tokenResult = z.string().safeParse(parsed?.token);
	const token = tokenResult.success ? tokenResult.data : undefined;
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

	const event = schema.safeParse(parsed);
	if (!event.success) {
		return {
			success: false,
			statusCode: 400,
			error: invalidMessage,
		};
	}

	await logEventFromContext(ctx, eventName, logFields(event.data), 'completed');
	return { success: true, data: event.data };
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
