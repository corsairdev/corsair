import type { CorsairWebhook } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type { StoreganiseContext } from '..';
import type { StoreganiseWebhookEventPayload } from './types';
import {
	SG_SIGNATURE_HEADER,
	StoreganiseEventSchema,
	verifyStoreganiseWebhook,
} from './types';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Storeganise expects a 200 answer within 30 seconds and retries twice more
 * before marking the related job failed, so logging must not hold the
 * acknowledgment past that deadline. A late insert still lands; the handler
 * just stops waiting for it.
 */
const LOG_WAIT_MS = 5_000;

/** Resolves after LOG_WAIT_MS; `clear` stops the timer once the race ends. */
function logWait(): { done: Promise<void>; clear: () => void } {
	let timer: ReturnType<typeof setTimeout> | undefined;
	const done = new Promise<void>((resolve) => {
		timer = setTimeout(resolve, LOG_WAIT_MS);
	});
	return { done, clear: () => clearTimeout(timer) };
}

// A logging failure does not fail the delivery.
async function safeLog(
	ctx: StoreganiseContext,
	event: string,
	fields: LogFields,
) {
	try {
		await logEventFromContext(ctx, event, fields, 'completed');
	} catch (error) {
		console.warn(`Failed to log ${event}:`, error);
	}
}

/**
 * Storeganise sends every event type to the one endpoint configured in the
 * admin portal, so this plugin registers a single webhook and reports the
 * event type in its result. Deliveries expect a 200 within 30 seconds, and
 * a failed delivery is retried twice more before the related job is marked
 * failed.
 * https://help.storeganise.com/article/19-webhooks
 */
export const event: CorsairWebhook<
	StoreganiseContext,
	StoreganiseWebhookEventPayload,
	StoreganiseWebhookEventPayload
> = {
	match: (request) => {
		// The signature header is the strongest signal, but a webhook whose
		// secret is unset still has a body that identifies itself.
		const headers = Object.keys(request.headers ?? {}).map((key) =>
			key.toLowerCase(),
		);
		if (headers.includes(SG_SIGNATURE_HEADER)) return true;
		const body = request.body;
		// unknown: the delivery body is untyped until the schema parses it;
		// the matcher only needs the event type.
		return (
			body !== null &&
			typeof body === 'object' &&
			typeof (body as Record<string, unknown>).type === 'string'
		);
	},
	handler: async (ctx, request) => {
		const verification = verifyStoreganiseWebhook(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error ?? 'Webhook verification failed',
			};
		}

		const parsed = StoreganiseEventSchema.safeParse(request.payload);
		if (!parsed.success) {
			return {
				success: false,
				statusCode: 400,
				error: 'Invalid Storeganise webhook payload',
			};
		}

		const wait = logWait();
		try {
			await Promise.race([
				safeLog(ctx, 'storeganise.webhook.event', {
					type: parsed.data.type,
					deliveryId: parsed.data.id,
					created: parsed.data.created,
				}),
				wait.done,
			]);
		} finally {
			// A finished log must not leave the timer holding the process open.
			wait.clear();
		}

		return { success: true, data: parsed.data };
	},
};
