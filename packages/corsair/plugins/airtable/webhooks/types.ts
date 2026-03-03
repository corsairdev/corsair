import { z } from 'zod';
import * as crypto from 'crypto';
import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from '../../../core';

// ── Webhook Payload Schemas ──────────────────────────────────────────────────

export const AirtableActionMetadataSchema = z.object({
	source: z.string().optional(),
	sourceMetadata: z
		.object({
			user: z
				.object({
					id: z.string(),
					email: z.string().optional(),
					name: z.string().optional(),
				})
				.optional(),
		})
		.optional(),
});
export type AirtableActionMetadata = z.infer<
	typeof AirtableActionMetadataSchema
>;

export const AirtableWebhookPayloadSchema = z.object({
	base: z.object({
		id: z.string(),
	}),
	webhook: z.object({
		id: z.string(),
	}),
	timestamp: z.string(),
	actionMetadata: AirtableActionMetadataSchema.optional(),
});
export type AirtableWebhookPayload = z.infer<
	typeof AirtableWebhookPayloadSchema
>;

// ── Event Types ──────────────────────────────────────────────────────────────

export const AirtableEventSchema = z.object({
	base: z.object({
		id: z.string(),
	}),
	webhook: z.object({
		id: z.string(),
	}),
	timestamp: z.string(),
	actionMetadata: AirtableActionMetadataSchema.optional(),
});
export type AirtableEvent = z.infer<typeof AirtableEventSchema>;

// ── Webhook Outputs ──────────────────────────────────────────────────────────

export type AirtableWebhookOutputs = {
	event: AirtableEvent;
};

// ── Payload Schemas for webhook schema registration ─────────────────────────

export const AirtableEventPayloadSchema = AirtableWebhookPayloadSchema;

const AirtableWebhookChangeSchema = z
	.object({
		path: z
			.object({
				tableId: z.string().optional(),
				recordId: z.string().optional(),
				fieldId: z.string().optional(),
			})
			.optional(),
		cellValuesByFieldId: z.record(z.unknown()).optional(),
	})
	.passthrough();

const AirtableWebhookPayloadItemSchema = z
	.object({
		timestamp: z.string(),
		baseTransactionNumber: z.number().optional(),
		changes: z.array(AirtableWebhookChangeSchema).optional(),
		changedTablesById: z.record(z.unknown()).optional(),
	})
	.passthrough();

export const AirtableWebhookPayloadsResponseSchema = z.object({
	cursorForNextPayload: z.number().optional(),
	payloads: z.array(AirtableWebhookPayloadItemSchema).default([]),
});

export type AirtableWebhookPayloadsResponse = z.infer<
	typeof AirtableWebhookPayloadsResponseSchema
>;

// ── Utilities ────────────────────────────────────────────────────────────────

function parseBody(body: unknown): unknown {
	return typeof body === 'string' ? JSON.parse(body) : body;
}

export function createAirtableMatch(eventType: string): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsedBody = parseBody(request.body) as Record<string, unknown>;
		return (
			typeof parsedBody === 'object' &&
			parsedBody !== null &&
			'base' in parsedBody &&
			'webhook' in parsedBody
		);
	};
}

export function verifyAirtableWebhookSignature(
	request: WebhookRequest<unknown>,
	secret: string,
): { valid: boolean; error?: string } {
	if (!secret) {
		return { valid: false, error: 'Missing webhook secret' };
	}

	const rawBody = request.rawBody;
	if (!rawBody) {
		return {
			valid: false,
			error: 'Missing raw body for signature verification',
		};
	}

	const headers = request.headers;
	const mac = Array.isArray(headers['x-airtable-content-mac'])
		? headers['x-airtable-content-mac'][0]
		: headers['x-airtable-content-mac'];

	if (!mac) {
		return {
			valid: false,
			error: 'Missing x-airtable-content-mac header',
		};
	}

	try {
		const key = Buffer.from(secret, 'base64');
		const expectedDigest = crypto
			.createHmac('sha256', key)
			.update(rawBody)
			.digest('hex');

		const expectedHeader = `hmac-sha256=${expectedDigest}`;

		const isValid = crypto.timingSafeEqual(
			Buffer.from(mac),
			Buffer.from(expectedHeader),
		);

		if (!isValid) {
			return { valid: false, error: 'Invalid signature' };
		}

		return { valid: true };
	} catch {
		return { valid: false, error: 'Invalid signature' };
	}
}
