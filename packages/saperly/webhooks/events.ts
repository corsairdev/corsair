import { logEventFromContext } from 'corsair/core';
import { makeSaperlyRequest, tryGetStoredKey } from '../client';
import { CallSchema, MessageSchema } from '../endpoints/types';
import type { SaperlyContext, SaperlyWebhooks } from '../index';
import type { ConfirmedDelivery } from './types';
import { DeliveryEnvelopeSchema } from './types';
import { verifySaperlySignature } from './verify';

const seenDeliveries = new Map<string, number>();
const DEDUP_MS = 5 * 60 * 1000;

const CALL_EVENTS = new Set([
	'call.received',
	'call.completed',
	'call.failed',
	'call.recording.saved',
]);

function reject(statusCode: number, error: string) {
	return { success: false as const, statusCode, error };
}

function expireDeliveries(now: number): void {
	for (const [seenKey, seenAt] of seenDeliveries) {
		if (now - seenAt > DEDUP_MS) seenDeliveries.delete(seenKey);
	}
}

async function accountScope(ctx: SaperlyContext): Promise<string> {
	if (!ctx.database) return '';
	try {
		return await ctx.$getAccountId();
	} catch {
		return '';
	}
}

async function finishDelivery(
	ctx: SaperlyContext,
	dedupKey: string,
	data: ConfirmedDelivery,
	logFields: Record<string, string>,
) {
	const response = { success: true as const, data };
	await logEventFromContext(
		ctx,
		'saperly.webhooks.delivery',
		logFields,
		'completed',
	);
	const after = ctx.options.webhookHooks?.events?.delivery?.after;
	if (after) {
		// Run the after hook before sealing. A throw leaves the id unsealed
		// so a redelivery can retry the hook with the confirmed resource.
		// Returning success false afterwards stops the framework from running
		// that same hook a second time.
		await after(ctx, response);
		if (dedupKey) seenDeliveries.set(dedupKey, Date.now());
		return { success: false as const, statusCode: 200, data };
	}
	if (dedupKey) seenDeliveries.set(dedupKey, Date.now());
	return response;
}

async function apiKey(ctx: SaperlyContext): Promise<string | undefined> {
	if (ctx.options.key) return ctx.options.key;
	return tryGetStoredKey(() => ctx.keys.get_api_key());
}

export const delivery: SaperlyWebhooks['delivery'] = {
	match: (request) =>
		Object.keys(request.headers).some(
			(name) => name.toLowerCase() === 'x-saperly-signature',
		),
	handler: async (ctx, request) => {
		// Hub-verified deliveries skip keyBuilder, so ctx.key is empty. The
		// signing secret is required only when this handler checks the signature.
		if (!request.hubVerified) {
			const secret = ctx.key || ctx.options.webhookSecret;
			if (!secret) {
				console.error(
					'saperly webhook dropped: signing secret is not configured',
				);
				return reject(409, 'Webhook signing secret is not configured');
			}
			const verification = verifySaperlySignature(request, secret);
			if (!verification.valid) {
				return reject(401, verification.error);
			}
		}

		const parsed = DeliveryEnvelopeSchema.safeParse(request.payload);
		if (!parsed.success) {
			return reject(409, 'Webhook envelope did not match the delivery shape');
		}
		const envelope = parsed.data;
		const scope = await accountScope(ctx);
		const dedupKey = scope ? `${scope}:${envelope.deliveryId}` : '';
		if (dedupKey) expireDeliveries(Date.now());
		if (dedupKey && seenDeliveries.has(dedupKey)) {
			// success false keeps after hooks from running again. 200 tells
			// Saperly the delivery is already accepted.
			return {
				success: false,
				statusCode: 200,
				error: 'duplicate delivery',
			};
		}

		const key = await apiKey(ctx);
		if (!key) {
			console.error('saperly webhook dropped: API key is not configured');
			return reject(409, 'API key is not configured');
		}

		try {
			if (CALL_EVENTS.has(envelope.eventType)) {
				const callId = envelope.payload.callId;
				if (!callId) return reject(409, 'Call event is missing callId');
				// Confirmed call JSON is untyped until CallSchema.parse.
				const raw = await makeSaperlyRequest<unknown>('/calls/{id}', key, {
					method: 'GET',
					path: { id: callId },
					baseUrl: ctx.options.baseUrl,
				});
				const call = CallSchema.parse(raw);
				const data = {
					eventType: envelope.eventType,
					deliveryId: envelope.deliveryId,
					resource: call,
				};
				return finishDelivery(ctx, dedupKey, data, {
					eventType: envelope.eventType,
					callId: call.id,
				});
			}

			if (envelope.eventType === 'message.received') {
				const messageId = envelope.payload.messageId;
				const numberId = envelope.payload.numberId;
				if (!messageId || !numberId) {
					return reject(409, 'Message event is missing messageId or numberId');
				}
				// Confirmed message list JSON is untyped until MessageSchema parses it.
				const raw = await makeSaperlyRequest<unknown>('/messages', key, {
					method: 'GET',
					query: { numberId },
					baseUrl: ctx.options.baseUrl,
				});
				const messages = MessageSchema.array().parse(raw);
				const message = messages.find((item) => item.id === messageId);
				if (!message) {
					return reject(409, 'Message was not found on the number');
				}
				const data = {
					eventType: envelope.eventType,
					deliveryId: envelope.deliveryId,
					resource: message,
				};
				return finishDelivery(ctx, dedupKey, data, {
					eventType: envelope.eventType,
					messageId: message.id,
				});
			}

			return reject(409, `Unsupported Saperly event ${envelope.eventType}`);
		} catch {
			return reject(409, 'Confirming the delivery against the API failed');
		}
	},
};
