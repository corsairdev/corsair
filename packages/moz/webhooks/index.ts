import { createHmac, timingSafeEqual } from 'node:crypto';
import type {
	CorsairWebhook,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { getHeader, logEventFromContext, readBodyRecord } from 'corsair/core';
import { z } from 'zod';
import type { MozContext } from '..';

/**
 * Moz Local location events, sent with the Standard Webhooks scheme
 * (https://moz.com/api/docs/guides/webhooks). Moz's team sets the URL and
 * events up for an account and issues a `whsec_` signing secret.
 */
export const MOZ_LOCATION_EVENTS = [
	'local.location.created',
	'local.location.updated',
	'local.location.canceled',
	'local.location.closed',
] as const;

export type MozLocationEventType = (typeof MOZ_LOCATION_EVENTS)[number];

export const MozLocationEventSchema = z
	.object({
		type: z.string(),
		timestamp: z.string().nullish(),
		data: z.object({ location_id: z.number() }).loose(),
	})
	.loose();

export type MozLocationEvent = z.infer<typeof MozLocationEventSchema>;

/** Signatures older or newer than this are refused (Standard Webhooks default). */
export const MOZ_WEBHOOK_TOLERANCE_SECONDS = 5 * 60;

export function isMozDelivery(request: RawWebhookRequest): boolean {
	const body = readBodyRecord(request);
	const data = body?.data as { location_id?: unknown } | undefined;
	return (
		getHeader(request.headers, 'webhook-id') !== undefined &&
		getHeader(request.headers, 'webhook-signature') !== undefined &&
		typeof body?.type === 'string' &&
		body.type.startsWith('local.location.') &&
		typeof data?.location_id === 'number'
	);
}

function safeEqual(left: string, right: string): boolean {
	const a = Buffer.from(left);
	const b = Buffer.from(right);
	return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * Standard Webhooks: base64 HMAC-SHA256 over `id.timestamp.rawBody`, keyed
 * by the base64 secret after `whsec_`; `webhook-signature` holds one or more
 * space-separated `v1,<sig>` entries.
 */
export function verifyMozWebhook(
	// unknown: the signature covers the raw body; the parsed payload is not read.
	request: WebhookRequest<unknown>,
	secret: string | undefined,
	nowSeconds: number = Math.floor(Date.now() / 1000),
): { valid: true } | { valid: false; error: string } {
	if (request.hubVerified) return { valid: true };
	if (!secret) {
		return {
			valid: false,
			error:
				'No Moz webhook secret is set (plugin option webhookSecret or keys.set_webhook_signature)',
		};
	}
	if (request.rawBody === undefined) {
		return { valid: false, error: 'Missing raw body' };
	}
	const id = getHeader(request.headers, 'webhook-id');
	const timestamp = getHeader(request.headers, 'webhook-timestamp');
	const signatures = getHeader(request.headers, 'webhook-signature');
	if (!id || !timestamp || !signatures) {
		return { valid: false, error: 'Missing webhook signature headers' };
	}
	if (!/^\d{1,12}$/.test(timestamp)) {
		return { valid: false, error: 'Malformed webhook-timestamp' };
	}
	if (
		Math.abs(nowSeconds - Number(timestamp)) > MOZ_WEBHOOK_TOLERANCE_SECONDS
	) {
		return { valid: false, error: 'webhook-timestamp outside the tolerance' };
	}
	const key = Buffer.from(secret.replace(/^whsec_/, ''), 'base64');
	const expected = createHmac('sha256', key)
		.update(`${id}.${timestamp}.${request.rawBody}`)
		.digest('base64');
	const matches = signatures
		.split(' ')
		.some(
			(entry) => entry.startsWith('v1,') && safeEqual(entry.slice(3), expected),
		);
	return matches
		? { valid: true }
		: { valid: false, error: 'Invalid webhook signature' };
}

export type MozLocationWebhook = CorsairWebhook<
	MozContext,
	MozLocationEvent,
	MozLocationEvent
>;

function locationWebhook(type: MozLocationEventType): MozLocationWebhook {
	return {
		match: (request) =>
			isMozDelivery(request) && readBodyRecord(request)?.type === type,
		handler: async (ctx, request) => {
			const verification = verifyMozWebhook(request, ctx.key);
			if (!verification.valid) {
				return { success: false, statusCode: 401, error: verification.error };
			}
			const event = MozLocationEventSchema.parse(request.payload);
			await logEventFromContext(
				ctx,
				`moz.webhook.${type}`,
				{ location_id: event.data.location_id },
				'completed',
			);
			return { success: true, data: event };
		},
	};
}

export const LocationWebhooks = {
	created: locationWebhook('local.location.created'),
	updated: locationWebhook('local.location.updated'),
	canceled: locationWebhook('local.location.canceled'),
	closed: locationWebhook('local.location.closed'),
};
