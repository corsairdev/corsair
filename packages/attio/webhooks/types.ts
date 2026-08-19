import crypto from 'node:crypto';
import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { z } from 'zod';
import { AttioRecord } from '../schema/database';

export const AttioWebhookPayloadSchema = z.object({
	event_type: z.string(),
	created_at: z.string(),
	data: z.any(),
});

export type AttioWebhookPayload = z.infer<typeof AttioWebhookPayloadSchema>;

export const RecordCreatedEventSchema = AttioWebhookPayloadSchema.extend({
	event_type: z.literal('record.created'),
	data: AttioRecord,
});
export type RecordCreatedEvent = z.infer<typeof RecordCreatedEventSchema>;

export const RecordUpdatedEventSchema = AttioWebhookPayloadSchema.extend({
	event_type: z.literal('record.updated'),
	data: AttioRecord,
});
export type RecordUpdatedEvent = z.infer<typeof RecordUpdatedEventSchema>;

export const RecordDeletedEventSchema = AttioWebhookPayloadSchema.extend({
	event_type: z.literal('record.deleted'),
	data: AttioRecord,
});
export type RecordDeletedEvent = z.infer<typeof RecordDeletedEventSchema>;

export type AttioWebhookOutputs = {
	recordCreated: RecordCreatedEvent;
	recordUpdated: RecordUpdatedEvent;
	recordDeleted: RecordDeletedEvent;
};

function parseBody(body: unknown): Record<string, unknown> | null {
	if (typeof body === 'string') {
		try {
			const parsed = JSON.parse(body);
			return parsed !== null &&
				typeof parsed === 'object' &&
				!Array.isArray(parsed)
				? (parsed as Record<string, unknown>)
				: null;
		} catch {
			return null;
		}
	}
	return body !== null && typeof body === 'object' && !Array.isArray(body)
		? (body as Record<string, unknown>)
		: null;
}

export function createAttioMatch(eventType: string): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsedBody = parseBody(request.body);
		return parsedBody !== null && parsedBody.event_type === eventType;
	};
}

export function verifyAttioWebhookSignature(
	request: WebhookRequest<AttioWebhookPayload>,
	secret: string,
): { valid: boolean; error?: string } {
	if (!secret) {
		return {
			valid: false,
			error: 'Missing webhook signing secret configuration',
		};
	}

	const signatureHeader = (request.headers['attio-signature'] ||
		request.headers['Attio-Signature']) as string | undefined;
	if (!signatureHeader) {
		return { valid: false, error: 'Missing attio-signature header' };
	}

	const parts = signatureHeader.split(',');
	let timestamp: string | undefined;
	let signature: string | undefined;

	for (const part of parts) {
		const [key, val] = part.split('=');
		if (key === 't') timestamp = val;
		if (key === 'v1') signature = val;
	}

	if (!timestamp || !signature) {
		return { valid: false, error: 'Invalid attio-signature format' };
	}

	const now = Math.floor(Date.now() / 1000);
	const ts = parseInt(timestamp, 10);
	if (Number.isNaN(ts) || Math.abs(now - ts) > 300) {
		return { valid: false, error: 'Webhook timestamp too old or invalid' };
	}

	const rawBody =
		typeof request.rawBody === 'string'
			? request.rawBody
			: JSON.stringify(request.payload);
	const signaturePayload = `${timestamp}.${rawBody}`;

	const expectedSignature = crypto
		.createHmac('sha256', secret)
		.update(signaturePayload)
		.digest('hex');

	try {
		const expectedBuffer = Buffer.from(expectedSignature, 'hex');
		const signatureBuffer = Buffer.from(signature, 'hex');
		if (
			expectedBuffer.length !== signatureBuffer.length ||
			!crypto.timingSafeEqual(expectedBuffer, signatureBuffer)
		) {
			return { valid: false, error: 'Signature mismatch' };
		}
	} catch {
		return { valid: false, error: 'Signature verification failed' };
	}

	return { valid: true };
}
