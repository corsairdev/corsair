import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import crypto from 'crypto';
import { z } from 'zod';

const AttachmentSchema = z
	.object({
		attachment_id: z.string(),
		size: z.number(),
		filename: z.string().optional(),
		content_type: z.string().optional(),
		content_disposition: z.string().optional(),
		content_id: z.string().optional(),
	})
	.loose();

const MessageSchema = z
	.object({
		inbox_id: z.string(),
		thread_id: z.string(),
		message_id: z.string(),
		labels: z.array(z.string()),
		timestamp: z.string(),
		from: z.string(),
		to: z.array(z.string()),
		size: z.number(),
		updated_at: z.string(),
		created_at: z.string(),
		reply_to: z.array(z.string()).optional(),
		cc: z.array(z.string()).optional(),
		bcc: z.array(z.string()).optional(),
		subject: z.string().optional(),
		preview: z.string().optional(),
		text: z.string().optional(),
		html: z.string().optional(),
		extracted_text: z.string().optional(),
		extracted_html: z.string().optional(),
		attachments: z.array(AttachmentSchema).optional(),
		in_reply_to: z.string().optional(),
		references: z.array(z.string()).optional(),
		headers: z.record(z.string(), z.string()).optional(),
	})
	.loose();

const ThreadSchema = z
	.object({
		inbox_id: z.string(),
		thread_id: z.string(),
		labels: z.array(z.string()),
		timestamp: z.string(),
		senders: z.array(z.string()),
		recipients: z.array(z.string()),
		last_message_id: z.string(),
		message_count: z.number(),
		size: z.number(),
		updated_at: z.string(),
		created_at: z.string(),
		received_timestamp: z.string().optional(),
		sent_timestamp: z.string().optional(),
		subject: z.string().optional(),
		preview: z.string().optional(),
		attachments: z.array(AttachmentSchema).optional(),
	})
	.loose();

export const AgentMailWebhookPayloadSchema = z
	.object({
		type: z.literal('event'),
		event_type: z.string(),
		event_id: z.string(),
	})
	.loose();

export type AgentMailWebhookPayload = z.infer<
	typeof AgentMailWebhookPayloadSchema
>;

export const MessageReceivedEventSchema = AgentMailWebhookPayloadSchema.extend({
	event_type: z.literal('message.received'),
	message: MessageSchema,
	thread: ThreadSchema,
});

export type MessageReceivedEvent = z.infer<typeof MessageReceivedEventSchema>;

export type AgentMailWebhookOutputs = {
	messageReceived: MessageReceivedEvent;
};

// `body` is unknown because webhook transport may deliver a raw JSON string or
// an already-parsed object; neither shape is knowable at the type boundary.
export function parseBody(body: unknown): Record<string, unknown> | null {
	if (typeof body === 'string') {
		try {
			const parsed = JSON.parse(body);
			if (
				parsed === null ||
				typeof parsed !== 'object' ||
				Array.isArray(parsed)
			) {
				return null;
			}
			// JSON.parse returns mixed types; narrowed by typeof/Array checks above.
			return parsed as Record<string, unknown>;
		} catch {
			return null;
		}
	}
	if (body === null || typeof body !== 'object' || Array.isArray(body)) {
		return null;
	}
	// Already-parsed webhook body; narrowed by typeof/Array checks above.
	return body as Record<string, unknown>;
}

export function createAgentMailMatch(eventType: string): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsedBody = parseBody(request.body);
		return parsedBody !== null && parsedBody.event_type === eventType;
	};
}

/** Plugin-level matcher: Svix header + AgentMail event shape (string or object body). */
export function matchAgentMailPluginWebhook(
	request: RawWebhookRequest,
): boolean {
	const hasSvixSignature = Object.keys(request.headers).some(
		(key) => key.toLowerCase() === 'svix-signature',
	);
	if (!hasSvixSignature) return false;

	const payload = parseBody(request.body);
	return (
		payload !== null &&
		payload.type === 'event' &&
		payload.event_type === 'message.received'
	);
}

function getHeader(
	// Header map values are string | string[] | undefined depending on the HTTP
	// adapter; payload typing stays unknown until schema parse in the handler.
	headers: WebhookRequest<unknown>['headers'],
	name: string,
): string | undefined {
	const lower = name.toLowerCase();
	for (const [key, value] of Object.entries(headers)) {
		if (key.toLowerCase() !== lower) continue;
		return Array.isArray(value) ? value[0] : value;
	}
	return undefined;
}

function extractSvixSignatures(signatureHeader: string): string[] {
	return signatureHeader
		.split(' ')
		.map((part) => part.trim())
		.filter(Boolean)
		.flatMap((part) => {
			const [version, signature] = part.split(',', 2);
			return version === 'v1' && signature ? [signature] : [];
		});
}

export function verifyAgentMailWebhookSignature(
	// Request payload remains unknown until MessageReceivedEventSchema.parse;
	// signature verification only needs headers + rawBody.
	request: WebhookRequest<unknown>,
	secret?: string,
): { valid: boolean; error?: string } {
	if (!secret) {
		return { valid: false, error: 'Missing webhook secret' };
	}

	const rawBody = request.rawBody;
	if (!rawBody) {
		return {
			valid: false,
			error: 'Missing raw body for signature verification',
		};
	}

	const svixId = getHeader(request.headers, 'svix-id');
	const svixTimestamp = getHeader(request.headers, 'svix-timestamp');
	const svixSignature = getHeader(request.headers, 'svix-signature');

	if (!svixId) {
		return { valid: false, error: 'Missing svix-id header' };
	}
	if (!svixTimestamp) {
		return { valid: false, error: 'Missing svix-timestamp header' };
	}
	if (!svixSignature) {
		return { valid: false, error: 'Missing svix-signature header' };
	}

	const timestampMs = Number.parseInt(svixTimestamp, 10) * 1000;
	if (
		Number.isNaN(timestampMs) ||
		Math.abs(Date.now() - timestampMs) > 5 * 60 * 1000
	) {
		return { valid: false, error: 'Webhook timestamp is too old or invalid' };
	}

	if (!secret.startsWith('whsec_')) {
		return { valid: false, error: 'Malformed webhook secret' };
	}
	// slice, not split: base64url secrets can contain underscores
	const secretBase64 = secret.slice('whsec_'.length);
	if (!secretBase64) {
		return { valid: false, error: 'Malformed webhook secret' };
	}

	const signatures = extractSvixSignatures(svixSignature);
	if (signatures.length === 0) {
		return { valid: false, error: 'Malformed svix-signature header' };
	}

	const signedContent = `${svixId}.${svixTimestamp}.${rawBody}`;
	const expected = crypto
		.createHmac('sha256', Buffer.from(secretBase64, 'base64'))
		.update(signedContent)
		.digest();

	const isValid = signatures.some((signature) => {
		const received = Buffer.from(signature, 'base64');
		return (
			received.length === expected.length &&
			crypto.timingSafeEqual(received, expected)
		);
	});

	if (!isValid) {
		return { valid: false, error: 'Invalid signature' };
	}

	return { valid: true };
}
