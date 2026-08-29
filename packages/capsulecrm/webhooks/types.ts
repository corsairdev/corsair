import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { z } from 'zod';

export const CapsuleCrmWebhookPayloadSchema = z.object({
	type: z.string(),
	created_at: z.string().optional(),
	data: z.record(z.string(), z.unknown()).optional(),
});

export type CapsuleCrmWebhookPayload = z.infer<
	typeof CapsuleCrmWebhookPayloadSchema
>;

export const PartyCreatedEventSchema =
	CapsuleCrmWebhookPayloadSchema.extend({
		type: z.literal('party.created'),
		data: z
			.object({
				id: z.string(),
			})
			.loose(),
	});

export type PartyCreatedEvent = z.infer<typeof PartyCreatedEventSchema>;

export const PartyUpdatedEventSchema =
	CapsuleCrmWebhookPayloadSchema.extend({
		type: z.literal('party.updated'),
		data: z
			.object({
				id: z.string(),
			})
			.loose(),
	});

export type PartyUpdatedEvent = z.infer<typeof PartyUpdatedEventSchema>;

export const PartyDeletedEventSchema =
	CapsuleCrmWebhookPayloadSchema.extend({
		type: z.literal('party.deleted'),
		data: z
			.object({
				id: z.string(),
			})
			.loose(),
	});

export type PartyDeletedEvent = z.infer<typeof PartyDeletedEventSchema>;

export const CapsuleCrmWebhookEventSchema = z.union([
	PartyCreatedEventSchema,
	PartyUpdatedEventSchema,
	PartyDeletedEventSchema,
]);

export type CapsuleCrmWebhookEvent = z.infer<
	typeof CapsuleCrmWebhookEventSchema
>;

export type CapsuleCrmWebhookOutputs = {
	partyCreated: { success: boolean };
	partyUpdated: { success: boolean };
	partyDeleted: { success: boolean };
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

	return body !== null &&
		typeof body === 'object' &&
		!Array.isArray(body)
		? (body as Record<string, unknown>)
		: null;
}

export function createCapsuleCrmMatch(
	eventType: string,
): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsedBody = parseBody(request.body);

		return parsedBody !== null && parsedBody.type === eventType;
	};
}

export function verifyCapsuleCrmWebhookSignature(
	request: WebhookRequest<CapsuleCrmWebhookPayload>,
	secret: string,
): { valid: boolean; error?: string } {
	if (!secret) {
		return {
			valid: false,
			error: 'Missing webhook secret',
		};
	}

	const signatureHeader =
		request.headers['x-capsulecrm-signature'];

	const signature = Array.isArray(signatureHeader)
		? signatureHeader[0]
		: signatureHeader;

	if (!signature) {
		return {
			valid: false,
			error: 'Missing x-capsulecrm-signature header',
		};
	}

	// Signature algorithm needs to match Capsule CRM's
	// documented webhook signing mechanism.
	// Do not mark the request valid until that is implemented.
	return {
		valid: false,
		error: 'Capsule CRM webhook signature verification not implemented',
	};
}