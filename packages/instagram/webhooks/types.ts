import type { CorsairWebhookMatcher, RawWebhookRequest } from 'corsair/core';
import { z } from 'zod';

// ─────────────────────────────────────────────────────────────
// Webhook Payload
// ─────────────────────────────────────────────────────────────

export const InstagramMessageSchema = z.object({
	mid: z.string().optional(),
	text: z.string().optional(),
	is_echo: z.boolean().optional(),
}).loose();

export const InstagramMessagingSchema = z.object({
	sender: z.object({
		id: z.string(),
	}),
	recipient: z.object({
		id: z.string(),
	}),
	timestamp: z.number(),
	message: InstagramMessageSchema.optional(),
});

export const InstagramEntrySchema = z.object({
	id: z.string(),
	time: z.number(),
	messaging: z.array(InstagramMessagingSchema),
});

export const InstagramWebhookPayloadSchema = z.object({
	object: z.literal('instagram'),
	entry: z.array(InstagramEntrySchema),
});

export type InstagramWebhookPayload = z.infer<
	typeof InstagramWebhookPayloadSchema
>;

// ─────────────────────────────────────────────────────────────
// Event Schema
// ─────────────────────────────────────────────────────────────

export const InstagramMessageReceivedEventSchema = z.object({
	type: z.literal('messageReceived'),
	accountId: z.string().optional(),
	senderId: z.string().optional(),
	recipientId: z.string().optional(),
	messageId: z.string(),
	text: z.string().optional(),
	timestamp: z.number().optional(),
    isEcho: z.boolean().default(false)
});

export type InstagramMessageReceivedEvent = z.infer<
	typeof InstagramMessageReceivedEventSchema
>;

// ─────────────────────────────────────────────────────────────
// Outputs
// ─────────────────────────────────────────────────────────────

export type InstagramWebhookOutputs = {
	messageReceived: InstagramMessageReceivedEvent;
};

export type InstagramEventName = 'messageReceived';

// ─────────────────────────────────────────────────────────────
// Webhook Matcher
// ─────────────────────────────────────────────────────────────

export function createInstagramWebhookMatcher(
	eventType: InstagramEventName,
): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsed =
			InstagramWebhookPayloadSchema.safeParse(
				request.body,
			);
            
		if (!parsed.success) {
			return false;
		}

		return parsed.data.object === 'instagram';
	};
}
