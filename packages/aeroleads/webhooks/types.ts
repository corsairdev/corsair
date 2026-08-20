import type { CorsairWebhookMatcher, RawWebhookRequest, WebhookRequest } from 'corsair/core';
import { z } from 'zod';

export const AeroLeadsWebhookPayloadSchema = z.object({
	type: z.string(),
	created_at: z.string().optional(),
	data: z.record(z.string(), z.unknown()),
});

export type AeroLeadsWebhookPayload = z.infer<
	typeof AeroLeadsWebhookPayloadSchema
>;

export type AeroLeadsWebhookOutputs = Record<string, never>;

function parseBody(body: unknown): Record<string, unknown> | null {
	if (typeof body === 'string') {
		try {
			const parsed = JSON.parse(body);
			return parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed)
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

export function createAeroLeadsMatch(eventType: string): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsedBody = parseBody(request.body);
		return parsedBody !== null && parsedBody.type === eventType;
	};
}

export function verifyAeroLeadsWebhookSignature(
	request: WebhookRequest<AeroLeadsWebhookPayload>,
	_secret: string,
): { valid: boolean; error?: string } {
	// TODO: Implement webhook signature verification when AeroLeads provides webhook docs
	return { valid: true };
}
