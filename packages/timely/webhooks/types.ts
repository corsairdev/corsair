import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { z } from 'zod';

export const TimelyWebhookPayloadSchema = z.object({
	type: z.string(),
	created_at: z.string().optional(),
	data: z.record(z.string(), z.unknown()).optional(),
});

export type TimelyWebhookPayload = z.infer<typeof TimelyWebhookPayloadSchema>;

export const TimelyWebhookEventSchema = TimelyWebhookPayloadSchema;
export type TimelyWebhookEvent = z.infer<typeof TimelyWebhookEventSchema>;

export type TimelyWebhookOutputs = {
	event: TimelyWebhookEvent;
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

export function createTimelyMatch(): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsedBody = parseBody(request.body);
		return parsedBody !== null && typeof parsedBody.type === 'string';
	};
}

export function verifyTimelyWebhookSignature(
	request: WebhookRequest<TimelyWebhookPayload>,
	_secret: string,
): { valid: boolean; error?: string } {
	// Fail closed until the real HMAC check is implemented. The Hub verifies
	// the signature before delivery, so accept only hub-verified requests.
	if (request.hubVerified) return { valid: true };
	return { valid: false, error: 'Signature verification failed' };
}
