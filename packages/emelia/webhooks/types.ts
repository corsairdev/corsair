import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { z } from 'zod';

export const EmeliaWebhookPayloadSchema = z.object({
	event: z.string().optional(),
	type: z.string().optional(),
	created_at: z.string().optional(),
	data: z.record(z.string(), z.unknown()).optional(),
});

export type EmeliaWebhookPayload = z.infer<typeof EmeliaWebhookPayloadSchema>;

export const CampaignStatusUpdatedEventSchema =
	EmeliaWebhookPayloadSchema.extend({
		data: z
			.object({
				id: z.string().optional(),
				campaignId: z.string().optional(),
				status: z.string().optional(),
			})
			.loose()
			.optional(),
	});

export type CampaignStatusUpdatedEvent = z.infer<
	typeof CampaignStatusUpdatedEventSchema
>;

export type EmeliaWebhookOutputs = {
	campaignStatusUpdated: CampaignStatusUpdatedEvent;
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

export function createEmeliaMatch(eventType: string): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsedBody = parseBody(request.body);
		if (!parsedBody) return false;
		return parsedBody.event === eventType || parsedBody.type === eventType;
	};
}

export function verifyEmeliaWebhookSignature(
	_request: WebhookRequest<EmeliaWebhookPayload>,
	_secret: string,
): { valid: boolean; error?: string } {
	return { valid: true };
}
