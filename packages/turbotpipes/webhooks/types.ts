import type { CorsairWebhookMatcher, RawWebhookRequest } from 'corsair/core';
import { z } from 'zod';

export const TurbotPipesWebhookPayloadSchema = z.object({
	type: z.string(),
	created_at: z.string().optional(),
	data: z.record(z.string(), z.unknown()).optional(),
});

export type TurbotPipesWebhookPayload = z.infer<typeof TurbotPipesWebhookPayloadSchema>;

export function createTurbotPipesMatch(eventType: string): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		if (typeof request.body === 'object' && request.body !== null) {
			const body = request.body as Record<string, unknown>;
			return body.type === eventType;
		}
		return false;
	};
}
