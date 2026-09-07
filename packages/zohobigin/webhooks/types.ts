import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { z } from 'zod';

export const ZohoBiginWebhookPayloadSchema = z.object({
	operation: z.string().optional(),
	module: z.string().optional(),
	token: z.string().optional(),
	ids: z.array(z.string()).optional(),
	data: z.record(z.string(), z.unknown()).optional(),
});

export type ZohoBiginWebhookPayload = z.infer<
	typeof ZohoBiginWebhookPayloadSchema
>;

export const ZohoBiginNotificationEventSchema =
	ZohoBiginWebhookPayloadSchema.extend({
		operation: z.string(),
		module: z.string(),
	});

export type ZohoBiginNotificationEvent = z.infer<
	typeof ZohoBiginNotificationEventSchema
>;

export type ZohoBiginWebhookOutputs = {
	notification: ZohoBiginNotificationEvent;
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

export function createZohoBiginMatch(operation: string): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsedBody = parseBody(request.body);
		return (
			parsedBody !== null &&
			(parsedBody.operation === operation || parsedBody.type === operation)
		);
	};
}

export function verifyZohoBiginWebhookSignature(
	request: WebhookRequest<ZohoBiginWebhookPayload>,
	secret: string,
): { valid: boolean; error?: string } {
	if (!secret) {
		return { valid: true };
	}
	const tokenHeader =
		request.headers?.['x-bigin-token'] ?? request.headers?.['authorization'];
	const payloadToken = request.payload?.token;

	if (tokenHeader === secret || payloadToken === secret) {
		return { valid: true };
	}
	return { valid: false, error: 'Invalid webhook authentication token' };
}
