import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { readBodyRecord } from 'corsair/core';
import { z } from 'zod';

// Waboxapp sends webhooks as application/x-www-form-urlencoded (not JSON),
// with no signature header. Confirmed via sandbox capture:
// event=message&token=API_TOKEN&contact[uid]=...&contact[name]=...
// &message[dtm]=...&message[uid]=...&message[cuid]=...&message[dir]=i
// &message[type]=chat&message[body][text]=...&message[ack]=3

export const WaboxappWebhookPayloadSchema = z.object({
	event: z.string(),
	token: z.string(),
	contact: z
		.object({
			uid: z.string(),
			name: z.string().optional(),
			type: z.string().optional(),
		})
		.optional(),
	message: z
		.object({
			dtm: z.string().optional(),
			uid: z.string().optional(),
			cuid: z.string().optional(),
			dir: z.string().optional(),
			type: z.string().optional(),
			body: z.object({ text: z.string().optional() }).loose().optional(),
			ack: z.string().optional(),
		})
		.optional(),
});

export type WaboxappWebhookPayload = z.infer<
	typeof WaboxappWebhookPayloadSchema
>;

export const MessageEventSchema = WaboxappWebhookPayloadSchema.extend({
	event: z.literal('message'),
});

export type MessageEvent = z.infer<typeof MessageEventSchema>;

export type WaboxappWebhookOutputs = {
	message: MessageEvent;
};

export function createWaboxappMatch(eventType: string): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const body = readBodyRecord(request);
		return body !== null && body.event === eventType;
	};
}

// No-op: Waboxapp does not sign webhooks (verified empirically — no
// signature/HMAC header present in the captured request). Tenant identity
// comes from the `token` field instead, handled in tenant-matcher.ts.
export function verifyWaboxappWebhookSignature(
	_request: WebhookRequest<WaboxappWebhookPayload>,
	_secret: string,
): { valid: boolean; error?: string } {
	return { valid: true };
}
