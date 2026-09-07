import { createHmac, timingSafeEqual } from 'node:crypto';
import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { z } from 'zod';

export const ChatworkBaseWebhookEnvelopeSchema = z.object({
	webhook_setting_id: z.union([z.string(), z.number()]).transform(String),
	webhook_event_type: z.string(),
	webhook_event_time: z.number(),
});

export const MessageCreatedEventSchema = z.object({
	message_id: z.string().describe('The unique message ID'),
	room_id: z.number().describe('The room ID where the message was posted'),
	account_id: z.number().describe('The account ID of the author'),
	body: z.string().describe('The message body'),
	send_time: z
		.number()
		.describe('Timestamp in Unix seconds when message was sent'),
	update_time: z
		.number()
		.optional()
		.describe('Timestamp in Unix seconds when message was updated (0 if not)'),
});

export const MessageCreatedWebhookPayloadSchema =
	ChatworkBaseWebhookEnvelopeSchema.extend({
		webhook_event_type: z.literal('message_created'),
		webhook_event: MessageCreatedEventSchema,
	});

export const MessageUpdatedEventSchema = z.object({
	message_id: z.string().describe('The unique message ID'),
	room_id: z.number().describe('The room ID where the message was posted'),
	account_id: z.number().describe('The account ID of the author'),
	body: z.string().describe('The updated message body'),
	send_time: z
		.number()
		.describe('Timestamp in Unix seconds when message was originally sent'),
	update_time: z
		.number()
		.describe('Timestamp in Unix seconds when message was updated'),
});

export const MessageUpdatedWebhookPayloadSchema =
	ChatworkBaseWebhookEnvelopeSchema.extend({
		webhook_event_type: z.literal('message_updated'),
		webhook_event: MessageUpdatedEventSchema,
	});

export const MentionToMeEventSchema = z.object({
	mention_id: z
		.union([z.string(), z.number()])
		.transform(String)
		.describe('The unique mention ID'),
	message_id: z.string().describe('The message ID containing the mention'),
	room_id: z.number().describe('The room ID where the mention occurred'),
	account_id: z.number().optional().describe('The author account ID'),
	from_account_id: z.number().describe('The account ID of the sender'),
	to_account_id: z.number().describe('The account ID of the mentioned user'),
	body: z.string().describe('The message body'),
	send_time: z
		.number()
		.describe('Timestamp in Unix seconds when message was sent'),
});

export const MentionToMeWebhookPayloadSchema =
	ChatworkBaseWebhookEnvelopeSchema.extend({
		webhook_event_type: z.literal('mention_to_me'),
		webhook_event: MentionToMeEventSchema,
	});

export const ChatworkWebhookPayloadSchema = z.union([
	MessageCreatedWebhookPayloadSchema,
	MessageUpdatedWebhookPayloadSchema,
	MentionToMeWebhookPayloadSchema,
]);

export type MessageCreatedWebhookPayload = z.infer<
	typeof MessageCreatedWebhookPayloadSchema
>;
export type MessageUpdatedWebhookPayload = z.infer<
	typeof MessageUpdatedWebhookPayloadSchema
>;
export type MentionToMeWebhookPayload = z.infer<
	typeof MentionToMeWebhookPayloadSchema
>;
export type ChatworkWebhookPayload = z.infer<
	typeof ChatworkWebhookPayloadSchema
>;

export type ChatworkWebhookOutputs = {
	messageCreated: MessageCreatedWebhookPayload;
	messageUpdated: MessageUpdatedWebhookPayload;
	mentionToMe: MentionToMeWebhookPayload;
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

export function createChatworkMatch(eventType: string): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsedBody = parseBody(request.body);
		return parsedBody !== null && parsedBody.webhook_event_type === eventType;
	};
}

export function verifyChatworkWebhookSignature(
	requestOrBody: WebhookRequest<unknown> | RawWebhookRequest | string | Buffer,
	secretOrSignature: string,
	secretIfBody?: string,
): { valid: boolean; error?: string } {
	let rawBody: string | Buffer;
	let signature: string | undefined;
	let secret: string;

	if (typeof requestOrBody === 'string' || Buffer.isBuffer(requestOrBody)) {
		rawBody = requestOrBody;
		signature = secretOrSignature;
		secret = secretIfBody ?? '';
	} else {
		secret = secretOrSignature;
		const req = requestOrBody as RawWebhookRequest & { rawBody?: string };
		const headers = req.headers ?? {};
		const rawSig =
			headers['x-chatworkwebhooksignature'] ??
			headers['X-ChatWorkWebhookSignature'] ??
			headers['x-chatwork-signature'];
		signature = Array.isArray(rawSig) ? rawSig[0] : rawSig;

		if (req.rawBody) {
			rawBody = req.rawBody;
		} else if (typeof req.body === 'string') {
			rawBody = req.body;
		} else {
			rawBody = JSON.stringify(req.body ?? {});
		}
	}

	if (!signature) {
		return { valid: false, error: 'Missing x-chatworkwebhooksignature header' };
	}
	if (!secret) {
		return { valid: false, error: 'Missing webhook secret' };
	}

	try {
		const key = Buffer.from(secret, 'base64');
		const hmac = createHmac('sha256', key);
		hmac.update(rawBody);
		const expectedSignature = hmac.digest('base64');

		const sigBuf = Buffer.from(signature);
		const expectedBuf = Buffer.from(expectedSignature);

		if (sigBuf.length !== expectedBuf.length) {
			return { valid: false, error: 'Signature length mismatch' };
		}

		const valid = timingSafeEqual(sigBuf, expectedBuf);
		return { valid, error: valid ? undefined : 'Invalid webhook signature' };
	} catch (e) {
		return { valid: false, error: (e as Error).message };
	}
}
