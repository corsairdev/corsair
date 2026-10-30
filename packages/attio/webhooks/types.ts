import crypto from 'node:crypto';
import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { z } from 'zod';

export const AttioWebhookEventIdSchema = z.object({
	workspace_id: z.string(),
	object_id: z.string().optional(),
	record_id: z.string(),
});

export const AttioWebhookPayloadSchema = z.object({
	event_type: z.string(),
	id: AttioWebhookEventIdSchema,
	actor: z.unknown().optional(),
});

export type AttioWebhookPayload = z.infer<typeof AttioWebhookPayloadSchema>;

export const RecordCreatedEventSchema = AttioWebhookPayloadSchema.extend({
	event_type: z.literal('record.created'),
});
export type RecordCreatedEvent = z.infer<typeof RecordCreatedEventSchema>;

export const RecordUpdatedEventSchema = AttioWebhookPayloadSchema.extend({
	event_type: z.literal('record.updated'),
});
export type RecordUpdatedEvent = z.infer<typeof RecordUpdatedEventSchema>;

export const RecordDeletedEventSchema = AttioWebhookPayloadSchema.extend({
	event_type: z.literal('record.deleted'),
});
export type RecordDeletedEvent = z.infer<typeof RecordDeletedEventSchema>;

export type AttioWebhookOutputs = {
	recordCreated: RecordCreatedEvent;
	recordUpdated: RecordUpdatedEvent;
	recordDeleted: RecordDeletedEvent;
};

export function recordEventsFromPayload(
	payload: unknown,
	eventType: string,
): AttioWebhookPayload[] {
	if (payload === null || typeof payload !== 'object') return [];

	const body = payload as Record<string, unknown>;
	const candidates = Array.isArray(body.events) ? body.events : [payload];
	const matched: AttioWebhookPayload[] = [];

	for (const candidate of candidates) {
		const parsed = AttioWebhookPayloadSchema.safeParse(candidate);
		if (parsed.success && parsed.data.event_type === eventType) {
			matched.push(parsed.data);
		}
	}

	return matched;
}

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

function headerValue(
	headers: Record<string, string | string[] | undefined>,
	names: string[],
): string | undefined {
	const entries = Object.entries(headers);
	for (const name of names) {
		const found = entries.find(([key]) => key.toLowerCase() === name);
		if (!found) continue;
		const value = found[1];
		if (Array.isArray(value)) {
			return value[0];
		}
		if (typeof value === 'string' && value.length > 0) {
			return value;
		}
	}
	return undefined;
}

export function hasAttioSignatureHeader(
	headers: Record<string, string | string[] | undefined>,
): boolean {
	return Object.keys(headers).some((key) => {
		const lower = key.toLowerCase();
		return lower === 'attio-signature' || lower === 'x-attio-signature';
	});
}

function eventTypesFrom(body: Record<string, unknown>): string[] {
	const types: string[] = [];
	if (typeof body.event_type === 'string') {
		types.push(body.event_type);
	}
	if (Array.isArray(body.events)) {
		for (const event of body.events) {
			if (
				event !== null &&
				typeof event === 'object' &&
				!Array.isArray(event) &&
				typeof (event as { event_type?: unknown }).event_type === 'string'
			) {
				types.push((event as { event_type: string }).event_type);
			}
		}
	}
	return types;
}

export function createAttioMatch(eventType: string): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsedBody = parseBody(request.body);
		return (
			parsedBody !== null && eventTypesFrom(parsedBody).includes(eventType)
		);
	};
}

export function verifyAttioWebhookSignature(
	request: WebhookRequest<unknown>,
	secret: string,
): { valid: boolean; error?: string } {
	if (!secret) {
		return {
			valid: false,
			error: 'Missing webhook signing secret configuration',
		};
	}

	const rawBody = request.rawBody;
	if (!rawBody) {
		return {
			valid: false,
			error: 'Missing raw body for signature verification',
		};
	}

	const signature = headerValue(request.headers, [
		'attio-signature',
		'x-attio-signature',
	]);
	if (!signature) {
		return { valid: false, error: 'Missing attio-signature header' };
	}

	const expectedSignature = crypto
		.createHmac('sha256', secret)
		.update(rawBody)
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
		return { valid: false, error: 'Signature mismatch' };
	}

	return { valid: true };
}
