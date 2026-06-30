import type { CorsairWebhookMatcher, RawWebhookRequest, WebhookRequest } from 'corsair/core';
import { readQueryParam } from 'corsair/core';
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
	mode: z.literal('subscribe'),
	verify_token: z.string(),
	challenge: z.string(),
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

export const InstagramCommentEventSchema = CommentsOutputSchema.extend({
	type: z.literal('comments'),
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

export type MetaWebhookChallenge = {
	mode: string;
	verifyToken: string;
	challenge: string;
};

export function extractMetaWebhookChallenge(
	request: Pick<RawWebhookRequest, 'query' | 'body'>,
): MetaWebhookChallenge | null {
	const mode =
		readQueryParam(request, 'hub.mode') ??
		readBodyString(request.body, 'hub.mode') ??
		readBodyString(request.body, 'mode');
	const verifyToken =
		readQueryParam(request, 'hub.verify_token') ??
		readBodyString(request.body, 'hub.verify_token') ??
		readBodyString(request.body, 'verify_token');
	const challenge =
		readQueryParam(request, 'hub.challenge') ??
		readBodyString(request.body, 'hub.challenge') ??
		readBodyString(request.body, 'challenge');

	if (!mode || !verifyToken || !challenge) {
		return null;
	}

	return { mode, verifyToken, challenge };
}

function readBodyString(body: unknown, key: string): string | undefined {
	if (!body || typeof body !== 'object' || Array.isArray(body)) {
		return undefined;
	}

	const value = (body as Record<string, unknown>)[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

// ─────────────────────────────────────────────────────────────
// Challenge Matcher
// ─────────────────────────────────────────────────────────────

export function verifyInstagramWebhookSignature(
	request: WebhookRequest<unknown>,
	appSecret: string | null,
): { valid: boolean; error?: string } {
	if (!appSecret) {
		return { valid: false };
	}

	let rawBody = request.rawBody;

	if (!rawBody) {
		return {
			valid: false,
			error: 'Missing raw body for signature verification',
		};
	}

	const payload = request.payload as any;

	if (payload?.object === 'instagram') {
		const modifiedPayload =
			convertInstagramEmojiFields(payload);

		rawBody = JSON.stringify(modifiedPayload);

		// Match Corsair URL escaping
		rawBody = rawBody.replace(
			/"url":"([^"]+)"/g,
			(_, url) => `"url":"${url.replace(/\//g, '\\/')}"`,
		);

		// Fix double-escaped unicode
		rawBody = rawBody.replace(
			/\\\\u([0-9a-fA-F]{4})/g,
			'\\u$1',
		);

		// Match comment webhook formatting
		if (
			payload?.entry?.[0]?.changes?.[0]?.field ===
			'comments'
		) {
			rawBody = rawBody
				.replace(/:/g, ': ')
				.replace(/,/g, ', ');
		}
	}

	const headers = request.headers;

	const signature = Array.isArray(
		headers['x-hub-signature-256'],
	)
		? headers['x-hub-signature-256'][0]
		: headers['x-hub-signature-256'];

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

function toUnicodeEscape(str: string): string {
	return [...str]
		.map(char => {
			const code = char.codePointAt(0)!;

			if (code > 127) {
				if (code > 0xffff) {
					const high =
						Math.floor(
							(code - 0x10000) / 0x400,
						) + 0xd800;

					const low =
						((code - 0x10000) % 0x400) +
						0xdc00;

					return `\\u${high
						.toString(16)
						.padStart(
							4,
							'0',
						)}\\u${low
						.toString(16)
						.padStart(4, '0')}`;
				}

				return `\\u${code
					.toString(16)
					.padStart(4, '0')}`;
			}

			return char;
		})
		.join('');
}

function convertInstagramEmojiFields<T>(
	body: T,
): T {
	const clonedBody = structuredClone(body);

	for (const entry of (clonedBody as any)?.entry ??
		[]) {
		// Messaging events
		for (const messaging of entry.messaging ??
			[]) {
			// Message text
			if (
				messaging?.message &&
				typeof messaging.message.text ===
					'string'
			) {
				messaging.message.text =
					toUnicodeEscape(
						messaging.message.text,
					);

				messaging.message.text =
					messaging.message.text.replace(
						/\\\\u/g,
						'\\u',
					);
			}

			// Reaction emoji
			if (
				messaging?.reaction &&
				typeof messaging.reaction
					.emoji === 'string'
			) {
				messaging.reaction.emoji =
					toUnicodeEscape(
						messaging.reaction.emoji,
					);
			}
		}

		// Comment webhooks
		for (const change of entry.changes ?? []) {
			if (
				change?.field === 'comments' &&
				typeof change?.value?.text ===
					'string'
			) {
				change.value.text =
					toUnicodeEscape(
						change.value.text,
					);
			}
		}
	}

	return clonedBody;
}

// ─────────────────────────────────────────────────────────────
// Webhook Matcher
// ─────────────────────────────────────────────────────────────

export function createInstagramWebhookMatcher(
	eventType: InstagramEventName,
): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {

		if (eventType === 'url_verification') {
			const challenge = extractMetaWebhookChallenge(request);
			return challenge?.mode === 'subscribe';
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
			const parsed = InstagramCommentsWebhookSchema.safeParse(request.body);

			if(!parsed.success) {
				return false;
			}

			return parsed.data.object === 'instagram';
		}

		return false;
	}
};