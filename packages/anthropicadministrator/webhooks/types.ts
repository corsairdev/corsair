import type { CorsairWebhookMatcher, RawWebhookRequest, WebhookRequest } from 'corsair/core';
import { z } from 'zod';

export const AnthropicAdministratorWebhookPayloadSchema = z.object({
	type: z.string(),
	created_at: z.string(),
	data: z.record(z.string(), z.unknown()),
});

export type AnthropicAdministratorWebhookPayload = z.infer<
	typeof AnthropicAdministratorWebhookPayloadSchema
>;

export const ExampleEventSchema = AnthropicAdministratorWebhookPayloadSchema.extend({
	type: z.literal('example'),
	data: z
		.object({
			id: z.string(),
		})
		.loose(),
});

export type ExampleEvent = z.infer<typeof ExampleEventSchema>;

export type AnthropicAdministratorWebhookOutputs = {
	example: ExampleEvent;
};

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

export function createAnthropicAdministratorMatch(eventType: string): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsedBody = parseBody(request.body);
		return parsedBody !== null && parsedBody.type === eventType;
	};
}

export function verifyAnthropicAdministratorWebhookSignature(
	request: WebhookRequest<AnthropicAdministratorWebhookPayload>,
	secret: string,
): { valid: boolean; error?: string } {
	// TODO: Implement webhook signature verification
	return { valid: true };
}
