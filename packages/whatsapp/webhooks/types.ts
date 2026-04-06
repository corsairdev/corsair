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
export type MessageEvent = WhatsAppWebhookPayload;
export type StatusEvent = WhatsAppWebhookPayload;

export const WhatsAppMessageEventSchema: z.ZodType<MessageEvent> =
	WhatsAppWebhookPayloadSchema.refine(
		(payload) =>
			payload.entry.some((entry) =>
				entry.changes.some(
					(change) =>
						change.field === 'messages' &&
						Array.isArray(change.value.messages) &&
						change.value.messages.length > 0,
				),
			),
		{
			message: 'Payload does not contain incoming WhatsApp messages',
		},
	);

export const WhatsAppStatusEventSchema: z.ZodType<StatusEvent> =
	WhatsAppWebhookPayloadSchema.refine(
		(payload) =>
			payload.entry.some((entry) =>
				entry.changes.some(
					(change) =>
						change.field === 'messages' &&
						Array.isArray(change.value.statuses) &&
						change.value.statuses.length > 0,
				),
			),
		{
			message: 'Payload does not contain WhatsApp status updates',
		},
	);
export type WhatsAppIncomingMessage = z.infer<typeof WhatsAppIncomingMessageSchema>;
export type WhatsAppStatus = z.infer<typeof WhatsAppStatusSchema>;

export type WhatsAppWebhookOutputs = {
	message: MessageEvent;
	status: StatusEvent;
};

function parseBody(body: unknown): Record<string, unknown> {
	if (typeof body === 'string') {
		return JSON.parse(body) as Record<string, unknown>;
	}
	return (body ?? {}) as Record<string, unknown>;
}

function hasMessagesPayload(body: Record<string, unknown>): boolean {
	if (body.object !== 'whatsapp_business_account' || !Array.isArray(body.entry)) {
		return false;
	}

	return body.entry.some((entry: unknown) => {
		if (!entry || typeof entry !== 'object' || !('changes' in entry)) {
			return false;
		}

		const changes = (entry as { changes?: unknown }).changes;
		if (!Array.isArray(changes)) {
			return false;
		}

		return changes.some((change: unknown) => {
			if (!change || typeof change !== 'object' || !('field' in change)) {
				return false;
			}

			if ((change as { field?: unknown }).field !== 'messages') {
				return false;
			}

			const value = (change as { value?: unknown }).value;
			return !!value && typeof value === 'object';
		});
	});
}

export function createWhatsAppMatch(
	eventType: keyof WhatsAppWebhookOutputs,
): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsedBody = parseBody(request.body);
		if (!hasMessagesPayload(parsedBody)) {
			return false;
		}

		const body = parsedBody as WhatsAppWebhookPayload;
		return body.entry.some((entry) =>
			entry.changes.some((change) => {
				if (change.field !== 'messages') {
					return false;
				}
				if (eventType === 'message') {
					return !!change.value.messages?.length;
				}
				return !!change.value.statuses?.length;
			}),
		);
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
