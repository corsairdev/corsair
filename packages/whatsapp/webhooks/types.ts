import crypto from 'node:crypto';
import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { z } from 'zod';

const WhatsAppMetadataSchema = z
	.object({
		display_phone_number: z.string().optional(),
		phone_number_id: z.string().optional(),
	})
	.passthrough();

const WhatsAppContactProfileSchema = z
	.object({
		name: z.string().optional(),
	})
	.passthrough();

const WhatsAppContactSchema = z
	.object({
		profile: WhatsAppContactProfileSchema.optional(),
		wa_id: z.string().optional(),
	})
	.passthrough();

export const WhatsAppIncomingMessageSchema = z
	.object({
		from: z.string(),
		id: z.string(),
		timestamp: z.string(),
		type: z.string(),
		text: z
			.object({
				body: z.string().optional(),
				preview_url: z.boolean().optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();

export const WhatsAppStatusSchema = z
	.object({
		id: z.string(),
		status: z.string(),
		timestamp: z.string(),
		recipient_id: z.string(),
		conversation: z
			.object({
				id: z.string().optional(),
				expiration_timestamp: z.string().optional(),
				origin: z
					.object({
						type: z.string().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough()
			.optional(),
		pricing: z
			.object({
				billable: z.boolean().optional(),
				pricing_model: z.string().optional(),
				category: z.string().optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();

const WhatsAppChangeValueSchema = z
	.object({
		messaging_product: z.string().optional(),
		metadata: WhatsAppMetadataSchema.optional(),
		contacts: z.array(WhatsAppContactSchema).optional(),
		messages: z.array(WhatsAppIncomingMessageSchema).optional(),
		statuses: z.array(WhatsAppStatusSchema).optional(),
		// Meta error objects vary across message types and delivery contexts, so the original payload is preserved without narrowing.
		errors: z.array(z.unknown()).optional(),
	})
	.passthrough();

const WhatsAppChangeSchema = z
	.object({
		field: z.string(),
		value: WhatsAppChangeValueSchema,
	})
	.passthrough();

const WhatsAppEntrySchema = z
	.object({
		id: z.string().optional(),
		changes: z.array(WhatsAppChangeSchema),
	})
	.passthrough();

export const WhatsAppWebhookPayloadSchema = z
	.object({
		object: z.literal('whatsapp_business_account'),
		entry: z.array(WhatsAppEntrySchema),
	})
	.passthrough();

export type WhatsAppWebhookPayload = z.infer<typeof WhatsAppWebhookPayloadSchema>;
export type WhatsAppIncomingMessage = z.infer<typeof WhatsAppIncomingMessageSchema>;
export type WhatsAppStatus = z.infer<typeof WhatsAppStatusSchema>;
export type MessageEvent = WhatsAppWebhookPayload;
export type StatusEvent = WhatsAppWebhookPayload;

function hasExclusiveMessageChanges(payload: WhatsAppWebhookPayload): boolean {
	return payload.entry.some((entry) =>
		entry.changes.some((change) => {
			if (change.field !== 'messages') {
				return false;
			}

			const hasMessages = Boolean(change.value.messages?.length);
			const hasStatuses = Boolean(change.value.statuses?.length);
			return hasMessages && !hasStatuses;
		}),
	);
}

function hasExclusiveStatusChanges(payload: WhatsAppWebhookPayload): boolean {
	return payload.entry.some((entry) =>
		entry.changes.some((change) => {
			if (change.field !== 'messages') {
				return false;
			}

			const hasMessages = Boolean(change.value.messages?.length);
			const hasStatuses = Boolean(change.value.statuses?.length);
			return hasStatuses && !hasMessages;
		}),
	);
}

export const WhatsAppMessageEventSchema: z.ZodType<MessageEvent> =
	WhatsAppWebhookPayloadSchema.refine(hasExclusiveMessageChanges, {
		message: 'Payload does not contain exclusive incoming WhatsApp messages',
	});

export const WhatsAppStatusEventSchema: z.ZodType<StatusEvent> =
	WhatsAppWebhookPayloadSchema.refine(hasExclusiveStatusChanges, {
		message: 'Payload does not contain exclusive WhatsApp status updates',
	});

export type WhatsAppWebhookOutputs = {
	message: MessageEvent;
	status: StatusEvent;
};

function isRecord(value: unknown): value is Record<string, unknown> {
	return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function parseBody(body: unknown): Record<string, unknown> {
	if (typeof body === 'string') {
		const parsed: unknown = JSON.parse(body);
		return isRecord(parsed) ? parsed : {};
	}

	return isRecord(body) ? body : {};
}

function extractMessageChanges(body: Record<string, unknown>) {
	const parsed = WhatsAppWebhookPayloadSchema.safeParse(body);
	if (!parsed.success) {
		return [];
	}

	return parsed.data.entry.flatMap((entry) =>
		entry.changes.filter((change) => change.field === 'messages'),
	);
}

export function createWhatsAppMatch(
	eventType: keyof WhatsAppWebhookOutputs,
): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const changes = extractMessageChanges(parseBody(request.body));
		if (changes.length === 0) {
			return false;
		}

		return changes.some((change) => {
			const hasMessages = Boolean(change.value.messages?.length);
			const hasStatuses = Boolean(change.value.statuses?.length);

			if (eventType === 'message') {
				return hasMessages && !hasStatuses;
			}

			return hasStatuses && !hasMessages;
		});
	};
}

export function verifyWhatsAppWebhookSignature(
	request: WebhookRequest<WhatsAppWebhookPayload>,
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

	const headers = request.headers;
	const signature = Array.isArray(headers['x-hub-signature-256'])
		? headers['x-hub-signature-256'][0]
		: headers['x-hub-signature-256'];

	if (!signature) {
		return {
			valid: false,
			error: 'Missing x-hub-signature-256 header',
		};
	}

	try {
		const expectedSignature = `sha256=${crypto
			.createHmac('sha256', secret)
			.update(rawBody)
			.digest('hex')}`;

		const isValid = crypto.timingSafeEqual(
			Buffer.from(signature),
			Buffer.from(expectedSignature),
		);

		if (!isValid) {
			return { valid: false, error: 'Invalid signature' };
		}

		return { valid: true };
	} catch {
		return { valid: false, error: 'Invalid signature' };
	}
}
