import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import crypto from 'crypto';
import { z } from 'zod';
import {
	AbyssaleBanner,
	AbyssaleBannerFile,
	AbyssaleBannerFormat,
	AbyssaleBannerTemplate,
} from '../schema/database';

/**
 * Abyssale webhook payloads all carry a top-level `event_type`; dispatch on it
 * and ignore unknown values rather than failing, so a new provider event never
 * breaks the receiver.
 */
const AbyssaleWebhookPayloadSchema = z
	.object({
		event_type: z.string(),
	})
	.loose();

export type AbyssaleWebhookPayload = z.infer<
	typeof AbyssaleWebhookPayloadSchema
>;

const BannerEventFields = {
	id: z.string().uuid(),
	version: z.number().optional(),
	sharing_id: z.string().uuid().optional(),
	file: AbyssaleBannerFile.optional(),
	format: AbyssaleBannerFormat.optional(),
	template: AbyssaleBannerTemplate.optional(),
};

/** `NEW_BANNER` — a single visual was generated or saved (never for sync API renders). */
export const NewBannerEventSchema = AbyssaleWebhookPayloadSchema.extend({
	event_type: z.literal('NEW_BANNER'),
	...BannerEventFields,
});
export type NewBannerEvent = z.infer<typeof NewBannerEventSchema>;

/** `NEW_BANNER_BATCH` — an asynchronous batch generation request completed. */
export const NewBannerBatchEventSchema = AbyssaleWebhookPayloadSchema.extend({
	event_type: z.literal('NEW_BANNER_BATCH'),
	generation_request_id: z.string().uuid(),
	banners: z.array(AbyssaleBanner),
	errors: z.array(
		z
			.object({
				template_format_name: z.string(),
				reason: z.string(),
			})
			.loose(),
	),
});
export type NewBannerBatchEvent = z.infer<typeof NewBannerBatchEventSchema>;

/** `NEW_EXPORT` — a workspace-wide export (ZIP) finished processing. */
export const NewExportEventSchema = AbyssaleWebhookPayloadSchema.extend({
	event_type: z.literal('NEW_EXPORT'),
	export_id: z.string().uuid(),
	archive_url: z.string(),
	requested_at: z.number().optional(),
	generated_at: z.number().optional(),
});
export type NewExportEvent = z.infer<typeof NewExportEventSchema>;

/**
 * `TEMPLATE_STATUS` — a design moved through its review workflow. The status
 * stays an open string: Abyssale may introduce workflow states beyond the six
 * documented values, and rejecting those deliveries would drop real updates.
 */
export const TemplateStatusEventSchema = AbyssaleWebhookPayloadSchema.extend({
	event_type: z.literal('TEMPLATE_STATUS'),
	id: z.string().uuid(),
	name: z.string().optional(),
	status: z.string(),
	created_at: z.number().optional(),
	updated_at: z.number().optional(),
	status_updated_at: z.number().optional(),
});
export type TemplateStatusEvent = z.infer<typeof TemplateStatusEventSchema>;

export type AbyssaleWebhookOutputs = {
	newBanner: NewBannerEvent;
	newBannerBatch: NewBannerBatchEvent;
	newExport: NewExportEvent;
	templateStatus: TemplateStatusEvent;
};

/** Event types this plugin handles; anything else is ignored by the matcher. */
export const HANDLED_EVENT_TYPES = [
	'NEW_BANNER',
	'NEW_BANNER_BATCH',
	'NEW_EXPORT',
	'TEMPLATE_STATUS',
] as const;

// `body` is unknown because the transport may deliver a raw JSON string or an
// already-parsed object; neither shape is knowable at the type boundary.
export function parseBody(body: unknown): Record<string, unknown> | null {
	if (typeof body === 'string') {
		try {
			const parsed = JSON.parse(body);
			if (
				parsed === null ||
				typeof parsed !== 'object' ||
				Array.isArray(parsed)
			) {
				return null;
			}
			return parsed as Record<string, unknown>;
		} catch {
			return null;
		}
	}
	if (body === null || typeof body !== 'object' || Array.isArray(body)) {
		return null;
	}
	return body as Record<string, unknown>;
}

export function createAbyssaleMatch(eventType: string): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsedBody = parseBody(request.body);
		return (
			parsedBody !== null &&
			parsedBody.event_type === eventType &&
			HANDLED_EVENT_TYPES.includes(
				eventType as (typeof HANDLED_EVENT_TYPES)[number],
			)
		);
	};
}

/** Plugin-level matcher: an Abyssale event payload with a handled `event_type`. */
export function matchAbyssalePluginWebhook(
	request: RawWebhookRequest,
): boolean {
	const payload = parseBody(request.body);
	return (
		payload !== null &&
		HANDLED_EVENT_TYPES.some((type) => payload.event_type === type)
	);
}

function getHeader(
	headers: WebhookRequest<unknown>['headers'],
	name: string,
): string | undefined {
	const lower = name.toLowerCase();
	for (const [key, value] of Object.entries(headers)) {
		if (key.toLowerCase() !== lower) continue;
		return Array.isArray(value) ? value[0] : value;
	}
	return undefined;
}

/** Deliveries older than this are rejected as replays. */
const TIMESTAMP_TOLERANCE_SECONDS = 300;

function parseSignatureHeader(header: string): {
	timestamp?: string;
	signatures: string[];
} {
	let timestamp: string | undefined;
	const signatures: string[] = [];

	for (const part of header.split(',')) {
		const trimmed = part.trim();
		const separator = trimmed.indexOf('=');
		if (separator <= 0) continue;
		const tag = trimmed.slice(0, separator);
		const value = trimmed.slice(separator + 1);
		if (!tag || !value) continue;
		if (tag === 't') {
			timestamp = value;
		} else if (tag === 'v1') {
			signatures.push(value);
		}
	}

	return { timestamp, signatures };
}

export function verifyAbyssaleWebhookSignature(
	request: WebhookRequest<unknown>,
	secret?: string,
): { valid: boolean; error?: string } {
	// The Hub already verified the provider signature on this delivery.
	if (request.hubVerified === true) {
		return { valid: true };
	}

	const signatureHeader = getHeader(request.headers, 'x-abyssale-signature');

	// Signing is opt-in provider-side: a workspace that never created a signing
	// secret keeps receiving unsigned deliveries. When no secret is configured
	// and the delivery is unsigned there is nothing to check; when one exists
	// but the delivery carries no header we cannot prove authenticity.
	if (!signatureHeader) {
		if (!secret) return { valid: true };
		return {
			valid: false,
			error:
				'Missing x-abyssale-signature header but a webhook secret is configured',
		};
	}
	if (!secret) {
		return {
			valid: false,
			error:
				'Signed delivery received but no webhook secret is configured (set options.webhookSecret or the webhook_signature key)',
		};
	}

	const rawBody = request.rawBody;
	if (!rawBody) {
		return {
			valid: false,
			error: 'Missing raw body for signature verification',
		};
	}

	const { timestamp, signatures } = parseSignatureHeader(signatureHeader);
	if (!timestamp || !/^\d+$/.test(timestamp)) {
		return { valid: false, error: 'Malformed signature timestamp' };
	}

	const age = Math.abs(Math.floor(Date.now() / 1000) - Number(timestamp));
	if (age > TIMESTAMP_TOLERANCE_SECONDS) {
		return { valid: false, error: 'Signature timestamp outside tolerance' };
	}

	if (signatures.length === 0) {
		return { valid: false, error: 'Malformed signature header: no v1 value' };
	}

	// During a rotation the header carries two v1 hashes, one per secret, so
	// every candidate must be checked — never just the first.
	const signedContent = `v1:webhook:${timestamp}.${rawBody}`;
	const expected = crypto
		.createHmac('sha256', secret)
		.update(signedContent)
		.digest('hex');

	for (const signature of signatures) {
		// timingSafeEqual throws on length mismatch, so guard before comparing;
		// a forged header must yield `valid: false`, never a thrown error.
		const received = Buffer.from(signature, 'utf8');
		const expectedBuffer = Buffer.from(expected, 'utf8');
		if (
			received.length === expectedBuffer.length &&
			crypto.timingSafeEqual(received, expectedBuffer)
		) {
			return { valid: true };
		}
	}

	return { valid: false, error: 'Invalid signature' };
}
