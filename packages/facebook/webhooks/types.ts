import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import crypto from 'crypto';
import { z } from 'zod';

const FacebookParticipantSchema = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
		email: z.string().optional(),
		username: z.string().optional(),
	})
	.passthrough();

const FacebookMessageAttachmentSchema = z
	.object({
		type: z.string().optional(),
		// unknown: Messenger attachment payloads vary across media, template, and fallback payload shapes.
		payload: z.unknown().optional(),
	})
	.passthrough();

export const FacebookMessageEventSchema = z
	.object({
		mid: z.string().optional(),
		text: z.string().optional(),
		is_echo: z.boolean().optional(),
		app_id: z.number().optional(),
		metadata: z.string().optional(),
		// unknown: quick reply payloads are application-defined and may carry arbitrary nested metadata.
		quick_reply: z.unknown().optional(),
		// unknown: reply metadata differs across Messenger reply surfaces and is passed through verbatim.
		reply_to: z.unknown().optional(),
		attachments: z.array(FacebookMessageAttachmentSchema).optional(),
	})
	.passthrough();

export const FacebookDeliveryEventSchema = z
	.object({
		mids: z.array(z.string()).optional(),
		watermark: z.number().optional(),
		seq: z.number().optional(),
	})
	.passthrough();

export const FacebookReadEventSchema = z
	.object({
		watermark: z.number().optional(),
		seq: z.number().optional(),
	})
	.passthrough();

export const FacebookMessagingEventSchema = z
	.object({
		sender: FacebookParticipantSchema.optional(),
		recipient: FacebookParticipantSchema.optional(),
		timestamp: z.number().optional(),
		message: FacebookMessageEventSchema.optional(),
		delivery: FacebookDeliveryEventSchema.optional(),
		read: FacebookReadEventSchema.optional(),
		// unknown: postback payloads are page-defined and may contain arbitrary nested fields.
		postback: z.unknown().optional(),
		// unknown: referral payloads vary by entry surface and campaign configuration.
		referral: z.unknown().optional(),
		// unknown: opt-in payloads differ by plugin and integration flow.
		optin: z.unknown().optional(),
	})
	.passthrough();

export const FacebookWebhookEntrySchema = z
	.object({
		id: z.string(),
		time: z.number().optional(),
		messaging: z.array(FacebookMessagingEventSchema).optional(),
		standby: z.array(FacebookMessagingEventSchema).optional(),
	})
	.passthrough();

export const FacebookWebhookPayloadSchema = z
	.object({
		object: z.string(),
		entry: z.array(FacebookWebhookEntrySchema),
	})
	.passthrough();

export const FacebookChallengePayloadSchema = z
	.object({
		'hub.mode': z.string().optional(),
		'hub.verify_token': z.string().optional(),
		'hub.challenge': z.string().optional(),
		hub: z
			.object({
				mode: z.string().optional(),
				verify_token: z.string().optional(),
				challenge: z.string().optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();

export const FacebookChallengeResponseSchema = z.object({
	challenge: z.string(),
});

export const FacebookInboundMessageSchema = z
	.object({
		pageId: z.string(),
		senderId: z.string().optional(),
		recipientId: z.string().optional(),
		timestamp: z.number().optional(),
		message: FacebookMessageEventSchema,
	})
	.passthrough();

export const FacebookDeliveryWebhookResponseSchema = z
	.object({
		pageId: z.string(),
		delivery: FacebookDeliveryEventSchema.optional(),
		read: FacebookReadEventSchema.optional(),
	})
	.passthrough();

export type FacebookWebhookPayload = z.infer<
	typeof FacebookWebhookPayloadSchema
>;
export type FacebookChallengePayload = z.infer<
	typeof FacebookChallengePayloadSchema
>;
export type FacebookChallengeResponse = z.infer<
	typeof FacebookChallengeResponseSchema
>;
export type FacebookInboundMessage = z.infer<
	typeof FacebookInboundMessageSchema
>;
export type FacebookDeliveryWebhookResponse = z.infer<
	typeof FacebookDeliveryWebhookResponseSchema
>;

export type FacebookWebhookOutputs = {
	challenge: FacebookChallengeResponse;
	message: FacebookWebhookPayload;
	delivery: FacebookWebhookPayload;
};

function parseBody(body: unknown): unknown {
	if (typeof body !== 'string') {
		return body;
	}

	try {
		return JSON.parse(body);
	} catch {
		return null;
	}
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null;
}

function getHubFields(body: unknown): {
	mode?: string;
	verifyToken?: string;
	challenge?: string;
} {
	if (!isRecord(body)) {
		return {};
	}

	const nestedHub = isRecord(body.hub) ? body.hub : undefined;

	const mode =
		typeof body['hub.mode'] === 'string'
			? body['hub.mode']
			: typeof nestedHub?.mode === 'string'
				? nestedHub.mode
				: undefined;
	const verifyToken =
		typeof body['hub.verify_token'] === 'string'
			? body['hub.verify_token']
			: typeof nestedHub?.verify_token === 'string'
				? nestedHub.verify_token
				: undefined;
	const challenge =
		typeof body['hub.challenge'] === 'string'
			? body['hub.challenge']
			: typeof nestedHub?.challenge === 'string'
				? nestedHub.challenge
				: undefined;

	return { mode, verifyToken, challenge };
}

export function createFacebookChallengeMatch(): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsed = parseBody(request.body);
		const { mode, challenge } = getHubFields(parsed);
		return mode === 'subscribe' && typeof challenge === 'string';
	};
}

export function createFacebookMessagingMatch(
	eventType: 'message' | 'delivery',
): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsed = parseBody(request.body);
		if (!isRecord(parsed) || parsed.object !== 'page') {
			return false;
		}

		const entries = parsed.entry;
		if (!Array.isArray(entries)) {
			return false;
		}

		return entries.some((entry: unknown) => {
			if (!isRecord(entry)) {
				return false;
			}

			const events = Array.isArray(entry.messaging)
				? entry.messaging
				: Array.isArray(entry.standby)
					? entry.standby
					: [];

			return events.some((event: unknown) => {
				if (!isRecord(event)) {
					return false;
				}

				if (eventType === 'message') {
					return isRecord(event.message);
				}

				return isRecord(event.delivery) || isRecord(event.read);
			});
		});
	};
}

export function verifyFacebookWebhookSignature(
	request: WebhookRequest<unknown>,
	secret: string,
): { valid: boolean; error?: string } {
	if (!secret) {
		return { valid: false, error: 'Missing app secret' };
	}

	const rawBody = request.rawBody;
	if (!rawBody) {
		return {
			valid: false,
			error: 'Missing raw body for signature verification',
		};
	}

	const signatureHeader = Array.isArray(request.headers['x-hub-signature-256'])
		? request.headers['x-hub-signature-256'][0]
		: request.headers['x-hub-signature-256'];

	if (!signatureHeader) {
		return { valid: false, error: 'Missing x-hub-signature-256 header' };
	}

	try {
		const expected = `sha256=${crypto
			.createHmac('sha256', secret)
			.update(rawBody)
			.digest('hex')}`;

		const valid = crypto.timingSafeEqual(
			Buffer.from(signatureHeader),
			Buffer.from(expected),
		);

		return valid
			? { valid: true }
			: { valid: false, error: 'Invalid signature' };
	} catch {
		return { valid: false, error: 'Signature comparison failed' };
	}
}

export function extractFacebookChallenge(
	body: unknown,
): FacebookChallengeResponse | null {
	const { challenge } = getHubFields(body);
	if (!challenge) {
		return null;
	}

	return { challenge };
}
