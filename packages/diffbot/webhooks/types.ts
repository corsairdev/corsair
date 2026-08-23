import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { z } from 'zod';

export const DiffbotWebhookPayloadSchema = z.object({
	type: z.string(),
	created_at: z.string(),
	data: z.record(z.string(), z.unknown()),
});

export type DiffbotWebhookPayload = z.infer<typeof DiffbotWebhookPayloadSchema>;

export const ExampleEventSchema = DiffbotWebhookPayloadSchema.extend({
	type: z.literal('example'),
	data: z
		.object({
			id: z.string(),
		})
		.loose(),
});

export type ExampleEvent = z.infer<typeof ExampleEventSchema>;

export type DiffbotWebhookOutputs = {
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

export function createDiffbotMatch(eventType: string): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsedBody = parseBody(request.body);
		return parsedBody !== null && parsedBody.type === eventType;
	};
}

export function verifyDiffbotWebhookSignature(
	request: WebhookRequest<DiffbotWebhookPayload>,
	secret: string,
): { valid: boolean; error?: string } {
	// Diffbot does not provide a native webhook signature mechanism.
	// Accept only events that have been verified by Corsair Hub (hubVerified flag).
	// This prevents unauthenticated callers from forging webhook events by
	// setting an x-diffbot-signature header on arbitrary payloads.
	if (request.hubVerified) {
		return { valid: true };
	}
	return {
		valid: false,
		error:
			'Diffbot webhook authentication is not configured. Hub verification is required.',
	};
}
