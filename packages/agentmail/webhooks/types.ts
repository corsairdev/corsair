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

export function createAgentMailMatch(eventType: string): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsedBody = parseBody(request.body);
		return parsedBody !== null && parsedBody.event_type === eventType;
	};
}

function getHeader(
	headers: WebhookRequest<unknown>['headers'],
	name: string,
): string | undefined {
	const value = headers[name];
	return Array.isArray(value) ? value[0] : value;
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

	const [, secretBase64] = secret.split('_', 2);
	if (!secret.startsWith('whsec_') || !secretBase64) {
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
