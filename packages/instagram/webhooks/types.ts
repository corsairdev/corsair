import type { CorsairWebhookMatcher, RawWebhookRequest, WebhookRequest } from 'corsair/core';
import { z } from 'zod';
import { verifyHmacSignatureWithPrefix } from "corsair/http";
import { CommentsOutputSchema } from "../endpoints/types";

// ─────────────────────────────────────────────────────────────
// Webhook Payload
// ─────────────────────────────────────────────────────────────

export const InstagramMessageSchema = z.object({
	mid: z.string().optional(),
	text: z.string().optional(),
	is_echo: z.boolean().optional(),
}).loose();

const InstagramReactionSchema = z.object({
	mid: z.string(),
	action: z.string(),
	reaction: z.string(),
	emoji: z.string(),
});

export const InstagramMessagingSchema = z.object({
	sender: z.object({
		id: z.string(),
	}),
	recipient: z.object({
		id: z.string(),
	}),
	timestamp: z.number(),
	message: InstagramMessageSchema.optional(),
	reaction: InstagramReactionSchema.optional(),
});

export const InstagramEntrySchema = z.object({
	id: z.string(),
	time: z.number(),
	messaging: z.array(InstagramMessagingSchema),
});

// ---------------------------
// input schema
// ---------------------------

export const InstagramWebhookPayloadSchema = z.object({
	object: z.literal('instagram'),
	entry: z.array(InstagramEntrySchema),
});

export const InstagramWebhookUrlVerificationSchema = z.object({
	type: z.literal('url_verification'),
	mode: z.string(),
	verify_token: z.string(),
	challenge: z.string()
});

export const InstagramCommentsWebhookSchema = z.object({
	object: z.literal('instagram'),

	entry: z.array(
		z.object({
			id: z.string(),
			time: z.number(),

			changes: z.array(
				z.object({
					field: z.literal('comments'),

					value: z.object({
						from: z.object({
							id: z.string(),
							username: z.string(),
						}),

						comment_id: z.string().optional(),

						parent_id: z.string().optional(),

						text: z.string().optional(),

						media: z.object({
							id: z.string(),

							ad_id: z.string().optional(),

							ad_title: z.string().optional(),

							original_media_id: z.string().optional(),

							media_product_type: z.string().optional(),
						}),
					}),
				}),
			),
		}),
	),
});


export type InstagramWebhookPayload = z.infer<
	typeof InstagramWebhookPayloadSchema
>;

export type InstagramWebhookUrlVerificationPayload = z.infer<
	typeof InstagramWebhookUrlVerificationSchema
>;

export type InstagramWebhookCommentPayload = z.infer<
	typeof InstagramCommentsWebhookSchema
>;

// ─────────────────────────────────────────────────────────────
// Event Schema(output schema)
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

export const InstagramUrlVerificationEventSchema = z.object({
	type: z.literal('url_verification'),
	challenge: z.string(),
});

export const InstagramCommentEventSchema = z.object({
	type: z.literal('comments'),
	CommentsOutputSchema,
});

export type InstagramMessageReceivedEvent = z.infer<
	typeof InstagramMessageReceivedEventSchema
>;

export type InstagramUrlVerificationEvent = z.infer<
	typeof InstagramUrlVerificationEventSchema
>;

export type InstagramCommentEvent = z.infer<
	typeof InstagramCommentEventSchema
>;

// ─────────────────────────────────────────────────────────────
// Outputs
// ─────────────────────────────────────────────────────────────

export type InstagramWebhookOutputs = {
	messageReceived: InstagramMessageReceivedEvent;
	url_verification: InstagramUrlVerificationEvent;
	comments: InstagramCommentEvent;
};

export type InstagramEventName = 'messageReceived' | 'url_verification' | 'comments';

// ─────────────────────────────────────────────────────────────
// Challenge Matcher
// ─────────────────────────────────────────────────────────────

export function verifyInstagramWebhookSignature(request: WebhookRequest<unknown>, appSecret: string | null): { valid: boolean, error?: string } {

	if (!appSecret) {
		return { valid: false };
	}

	const rawBody = request.rawBody;

	if (!rawBody) {
		return {
			valid: false,
			error: 'Missing raw body for signature verification',
		};
	}

	const headers = request.headers;
	const signature = Array.isArray(headers['x-hub-signature-256'])
		? headers['x-hub-signature-256'][0]
		: headers['x-hub-signature-256'];

	// console.log(rawBody);


	if (!signature) {
		return {
			valid: false,
			error: 'Missing x-hub-signature-256 header',
		};
	}

	const isValid = verifyHmacSignatureWithPrefix(
		rawBody,
		appSecret,
		signature,
		'sha256=',
		'sha256',
	);

	if (!isValid) {
		return {
			valid: false,
			error: 'Invalid signature',
		};
	}


	return {
		valid: true,
	};

}

// ─────────────────────────────────────────────────────────────
// Webhook Matcher
// ─────────────────────────────────────────────────────────────

export function createInstagramWebhookMatcher(
	eventType: InstagramEventName,
): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {

		if (eventType === 'url_verification') {
			const parsed = InstagramWebhookUrlVerificationSchema.safeParse(request.body);

			if (!parsed.success) {
				return false;
			}

			return parsed.data.type === 'url_verification';
		}

		if (eventType === 'messageReceived') {
			const parsed =
				InstagramWebhookPayloadSchema.safeParse(
					request.body,
				);

			if (!parsed.success) {
				return false;
			}

			return parsed.data.object === 'instagram'
		}

		if(eventType === 'comments') {
			console.log(request.body);
			const parsed = InstagramCommentsWebhookSchema.safeParse(request.body);

			if(!parsed.success) {
				return false;
			}

			return parsed.data.object === 'instagram';
		}

		return false;
	}
};