import * as crypto from 'node:crypto';
import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { z } from 'zod';

export const ZendeskWebhookPayloadSchema = z.object({
	type: z.string(),
	created_at: z.string(),
	data: z.record(z.string(), z.unknown()),
});

export type ZendeskWebhookPayload = z.infer<typeof ZendeskWebhookPayloadSchema>;

export const ExampleEventSchema = ZendeskWebhookPayloadSchema.extend({
	type: z.literal('example'),
	data: z
		.object({
			id: z.string(),
		})
		.loose(),
});

export type ExampleEvent = z.infer<typeof ExampleEventSchema>;

export type ZendeskWebhookOutputs = {
	example: ExampleEvent;
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

export function createZendeskMatch(eventType: string): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsedBody = parseBody(request.body);
		return parsedBody !== null && parsedBody.type === eventType;
	};
}

export function verifyZendeskWebhookSignature(
	request: WebhookRequest<ZendeskWebhookPayload>,
	secret?: string,
): { valid: boolean; error?: string } {
	if (!secret) {
		return { valid: true };
	}

	const rawBody = request.rawBody;
	if (rawBody === undefined || rawBody === null) {
		return {
			valid: false,
			error: 'Missing raw body for signature verification',
		};
	}

	const headers = request.headers;
	const signature = Array.isArray(headers['x-zendesk-webhook-signature'])
		? headers['x-zendesk-webhook-signature'][0]
		: headers['x-zendesk-webhook-signature'];

	const timestamp = Array.isArray(
		headers['x-zendesk-webhook-signature-timestamp'],
	)
		? headers['x-zendesk-webhook-signature-timestamp'][0]
		: headers['x-zendesk-webhook-signature-timestamp'];

	if (!signature) {
		return {
			valid: false,
			error: 'Missing x-zendesk-webhook-signature header',
		};
	}

	if (!timestamp) {
		return {
			valid: false,
			error: 'Missing x-zendesk-webhook-signature-timestamp header',
		};
	}

	// Sign string is TIMESTAMP + BODY
	const signingString = timestamp + rawBody;
	const expectedSignature = crypto
		.createHmac('sha256', secret)
		.update(signingString)
		.digest('base64');

	try {
		const isValid = crypto.timingSafeEqual(
			Buffer.from(signature),
			Buffer.from(expectedSignature),
		);
		if (!isValid) {
			return { valid: false, error: 'Invalid signature' };
		}
	} catch {
		return { valid: false, error: 'Invalid signature' };
	}

	return { valid: true };
}
