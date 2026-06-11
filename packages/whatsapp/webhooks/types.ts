import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { verifyHmacSignatureWithPrefix } from 'corsair/http';
import { z } from 'zod';

const WhatsappContactSchema = z.object({
	wa_id: z.string(),
	profile: z
		.object({
			name: z.string().optional(),
		})
		.optional(),
});

export const WhatsappIncomingMessageSchema = z
	.object({
		id: z.string(),
		from: z.string(),
		timestamp: z.string(),
		type: z.string(),
		context: z
			.object({
				from: z.string().optional(),
				id: z.string().optional(),
				referred_product: z.record(z.string(), z.unknown()).optional(),
			})
			.optional(),
		text: z.object({ body: z.string() }).optional(),
		image: z.record(z.string(), z.unknown()).optional(),
		audio: z.record(z.string(), z.unknown()).optional(),
		document: z.record(z.string(), z.unknown()).optional(),
		video: z.record(z.string(), z.unknown()).optional(),
		sticker: z.record(z.string(), z.unknown()).optional(),
		location: z.record(z.string(), z.unknown()).optional(),
		contacts: z.array(z.record(z.string(), z.unknown())).optional(),
		interactive: z.record(z.string(), z.unknown()).optional(),
		button: z.record(z.string(), z.unknown()).optional(),
		order: z.record(z.string(), z.unknown()).optional(),
		referral: z.record(z.string(), z.unknown()).optional(),
		errors: z.array(z.record(z.string(), z.unknown())).optional(),
	})
	.loose();

export const WhatsappStatusSchema = z
	.object({
		id: z.string(),
		status: z.enum(['sent', 'delivered', 'read', 'failed', 'deleted']),
		timestamp: z.string(),
		recipient_id: z.string().optional(),
		conversation: z.record(z.string(), z.unknown()).optional(),
		pricing: z.record(z.string(), z.unknown()).optional(),
		errors: z
			.array(
				z
					.object({
						code: z.number().optional(),
						title: z.string().optional(),
						message: z.string().optional(),
						error_data: z
							.object({
								details: z.string().optional(),
							})
							.loose()
							.optional(),
					})
					.loose(),
			)
			.optional(),
	})
	.loose();

const WhatsappChangeValueSchema = z
	.object({
		messaging_product: z.literal('whatsapp'),
		metadata: z.object({
			display_phone_number: z.string(),
			phone_number_id: z.string(),
		}),
		contacts: z.array(WhatsappContactSchema).optional(),
		messages: z.array(WhatsappIncomingMessageSchema).optional(),
		statuses: z.array(WhatsappStatusSchema).optional(),
		errors: z.array(z.record(z.string(), z.unknown())).optional(),
	})
	.loose();

export const WhatsappWebhookPayloadSchema = z.object({
	object: z.literal('whatsapp_business_account'),
	entry: z.array(
		z.object({
			id: z.string(),
			changes: z.array(
				z.object({
					field: z.literal('messages'),
					value: WhatsappChangeValueSchema,
				}),
			),
		}),
	),
});

export type WhatsappWebhookPayload = z.infer<
	typeof WhatsappWebhookPayloadSchema
>;

export const WhatsappMessageEventSchema = z.object({
	businessAccountId: z.string(),
	phoneNumberId: z.string(),
	displayPhoneNumber: z.string(),
	contacts: z.array(WhatsappContactSchema),
	messages: z.array(WhatsappIncomingMessageSchema),
});

export const WhatsappStatusEventSchema = z.object({
	businessAccountId: z.string(),
	phoneNumberId: z.string(),
	displayPhoneNumber: z.string(),
	statuses: z.array(WhatsappStatusSchema),
	errors: z.array(z.record(z.string(), z.unknown())),
});

export type WhatsappMessageEvent = z.infer<typeof WhatsappMessageEventSchema>;
export type WhatsappStatusEvent = z.infer<typeof WhatsappStatusEventSchema>;

export type WhatsappWebhookOutputs = {
	messages: WhatsappMessageEvent;
	statuses: WhatsappStatusEvent;
};

function parsePayload(body: unknown): WhatsappWebhookPayload | null {
	const value =
		typeof body === 'string'
			? (() => {
					try {
						return JSON.parse(body);
					} catch {
						return null;
					}
				})()
			: body;
	const parsed = WhatsappWebhookPayloadSchema.safeParse(value);
	return parsed.success ? parsed.data : null;
}

export function createWhatsappMatch(
	type: 'messages' | 'statuses',
): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const payload = parsePayload(request.body);
		if (!payload) return false;
		return payload.entry.some((entry) =>
			entry.changes.some((change) =>
				type === 'messages'
					? (change.value.messages?.length ?? 0) > 0
					: (change.value.statuses?.length ?? 0) > 0 ||
						(change.value.errors?.length ?? 0) > 0,
			),
		);
	};
}

export function verifyWhatsappWebhookSignature(
	request: WebhookRequest<unknown>,
	appSecret: string,
): { valid: boolean; error?: string } {
	if (!appSecret) {
		return { valid: false, error: 'WhatsApp app secret is not configured' };
	}
	if (!request.rawBody) {
		return {
			valid: false,
			error: 'Missing raw body for signature verification',
		};
	}
	const rawSignature = request.headers['x-hub-signature-256'];
	const signature = Array.isArray(rawSignature)
		? rawSignature[0]
		: rawSignature;
	if (!signature) {
		return { valid: false, error: 'Missing x-hub-signature-256 header' };
	}
	return verifyHmacSignatureWithPrefix(
		request.rawBody,
		appSecret,
		signature,
		'sha256=',
		'sha256',
	)
		? { valid: true }
		: { valid: false, error: 'Invalid x-hub-signature-256 signature' };
}

export function verifyWhatsappWebhookChallenge(
	query: Record<string, string | string[] | undefined>,
	verifyToken: string,
): { valid: true; challenge: string } | { valid: false; statusCode: number } {
	const value = (name: string) => {
		const raw = query[name];
		return Array.isArray(raw) ? raw[0] : raw;
	};
	const mode = value('hub.mode');
	const token = value('hub.verify_token');
	const challenge = value('hub.challenge');
	if (
		mode !== 'subscribe' ||
		!verifyToken ||
		token !== verifyToken ||
		!challenge
	) {
		return { valid: false, statusCode: 403 };
	}
	return { valid: true, challenge };
}

export function extractWhatsappMessageEvents(
	payload: WhatsappWebhookPayload,
): WhatsappMessageEvent[] {
	const events: WhatsappMessageEvent[] = [];
	for (const entry of payload.entry) {
		for (const change of entry.changes) {
			if (!change.value.messages?.length) continue;
			events.push({
				businessAccountId: entry.id,
				phoneNumberId: change.value.metadata.phone_number_id,
				displayPhoneNumber: change.value.metadata.display_phone_number,
				contacts: change.value.contacts ?? [],
				messages: change.value.messages,
			});
		}
	}
	return events;
}

export function extractWhatsappStatusEvents(
	payload: WhatsappWebhookPayload,
): WhatsappStatusEvent[] {
	const events: WhatsappStatusEvent[] = [];
	for (const entry of payload.entry) {
		for (const change of entry.changes) {
			if (!change.value.statuses?.length && !change.value.errors?.length) {
				continue;
			}
			events.push({
				businessAccountId: entry.id,
				phoneNumberId: change.value.metadata.phone_number_id,
				displayPhoneNumber: change.value.metadata.display_phone_number,
				statuses: change.value.statuses ?? [],
				errors: change.value.errors ?? [],
			});
		}
	}
	return events;
}
