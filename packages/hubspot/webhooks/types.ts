import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { verifyHmacSignature } from 'corsair/http';
import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Base payload schema
// ─────────────────────────────────────────────────────────────────────────────

export const HubSpotWebhookPayloadBaseSchema = z.object({
	subscriptionId: z.number(),
	portalId: z.number(),
	occurredAt: z.number(),
	subscriptionType: z.string(),
	attemptNumber: z.number(),
	objectId: z.number().optional(),
	propertyName: z.string().optional(),
	propertyValue: z.string().optional(),
	changeSource: z.string().optional(),
	eventId: z.string().optional(),
});
export type HubSpotWebhookPayload<TEvent = unknown> = z.infer<
	typeof HubSpotWebhookPayloadBaseSchema
> & { event?: TEvent };

// ─────────────────────────────────────────────────────────────────────────────
// Contact event schemas
// ─────────────────────────────────────────────────────────────────────────────

export const ContactCreatedEventSchema = HubSpotWebhookPayloadBaseSchema.extend(
	{
		subscriptionType: z.literal('contact.creation'),
		objectId: z.number(),
	},
);
export type ContactCreatedEvent = z.infer<typeof ContactCreatedEventSchema>;

export const ContactUpdatedEventSchema = HubSpotWebhookPayloadBaseSchema.extend(
	{
		subscriptionType: z.literal('contact.propertyChange'),
		objectId: z.number(),
		propertyName: z.string(),
		propertyValue: z.string(),
	},
);
export type ContactUpdatedEvent = z.infer<typeof ContactUpdatedEventSchema>;

export const ContactDeletedEventSchema = HubSpotWebhookPayloadBaseSchema.extend(
	{
		subscriptionType: z.literal('contact.deletion'),
		objectId: z.number(),
	},
);
export type ContactDeletedEvent = z.infer<typeof ContactDeletedEventSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Company event schemas
// ─────────────────────────────────────────────────────────────────────────────

export const CompanyCreatedEventSchema = HubSpotWebhookPayloadBaseSchema.extend(
	{
		subscriptionType: z.literal('company.creation'),
		objectId: z.number(),
	},
);
export type CompanyCreatedEvent = z.infer<typeof CompanyCreatedEventSchema>;

export const CompanyUpdatedEventSchema = HubSpotWebhookPayloadBaseSchema.extend(
	{
		subscriptionType: z.literal('company.propertyChange'),
		objectId: z.number(),
		propertyName: z.string(),
		propertyValue: z.string(),
	},
);
export type CompanyUpdatedEvent = z.infer<typeof CompanyUpdatedEventSchema>;

export const CompanyDeletedEventSchema = HubSpotWebhookPayloadBaseSchema.extend(
	{
		subscriptionType: z.literal('company.deletion'),
		objectId: z.number(),
	},
);
export type CompanyDeletedEvent = z.infer<typeof CompanyDeletedEventSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Deal event schemas
// ─────────────────────────────────────────────────────────────────────────────

export const DealCreatedEventSchema = HubSpotWebhookPayloadBaseSchema.extend({
	subscriptionType: z.literal('deal.creation'),
	objectId: z.number(),
});
export type DealCreatedEvent = z.infer<typeof DealCreatedEventSchema>;

export const DealUpdatedEventSchema = HubSpotWebhookPayloadBaseSchema.extend({
	subscriptionType: z.literal('deal.propertyChange'),
	objectId: z.number(),
	propertyName: z.string(),
	propertyValue: z.string(),
});
export type DealUpdatedEvent = z.infer<typeof DealUpdatedEventSchema>;

export const DealDeletedEventSchema = HubSpotWebhookPayloadBaseSchema.extend({
	subscriptionType: z.literal('deal.deletion'),
	objectId: z.number(),
});
export type DealDeletedEvent = z.infer<typeof DealDeletedEventSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Ticket event schemas
// ─────────────────────────────────────────────────────────────────────────────

export const TicketCreatedEventSchema = HubSpotWebhookPayloadBaseSchema.extend({
	subscriptionType: z.literal('ticket.creation'),
	objectId: z.number(),
});
export type TicketCreatedEvent = z.infer<typeof TicketCreatedEventSchema>;

export const TicketUpdatedEventSchema = HubSpotWebhookPayloadBaseSchema.extend({
	subscriptionType: z.literal('ticket.propertyChange'),
	objectId: z.number(),
	propertyName: z.string(),
	propertyValue: z.string(),
});
export type TicketUpdatedEvent = z.infer<typeof TicketUpdatedEventSchema>;

export const TicketDeletedEventSchema = HubSpotWebhookPayloadBaseSchema.extend({
	subscriptionType: z.literal('ticket.deletion'),
	objectId: z.number(),
});
export type TicketDeletedEvent = z.infer<typeof TicketDeletedEventSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Union and map types
// ─────────────────────────────────────────────────────────────────────────────

export const HubSpotWebhookEventTypeSchema = z.union([
	ContactCreatedEventSchema,
	ContactUpdatedEventSchema,
	ContactDeletedEventSchema,
	CompanyCreatedEventSchema,
	CompanyUpdatedEventSchema,
	CompanyDeletedEventSchema,
	DealCreatedEventSchema,
	DealUpdatedEventSchema,
	DealDeletedEventSchema,
	TicketCreatedEventSchema,
	TicketUpdatedEventSchema,
	TicketDeletedEventSchema,
]);
export type HubSpotWebhookEventType = z.infer<
	typeof HubSpotWebhookEventTypeSchema
>;

export type HubSpotWebhookPayloadType<
	TEvent extends HubSpotWebhookPayload = HubSpotWebhookPayload,
> = TEvent | Array<TEvent>;

export type HubSpotWebhookOutputs = {
	contactCreated: { success: boolean };
	contactUpdated: { success: boolean };
	contactDeleted: { success: boolean };
	companyCreated: { success: boolean };
	companyUpdated: { success: boolean };
	companyDeleted: { success: boolean };
	dealCreated: { success: boolean };
	dealUpdated: { success: boolean };
	dealDeleted: { success: boolean };
	ticketCreated: { success: boolean };
	ticketUpdated: { success: boolean };
	ticketDeleted: { success: boolean };
};

export type ContactCreatedEventType = ContactCreatedEvent;
export type ContactUpdatedEventType = ContactUpdatedEvent;
export type ContactDeletedEventType = ContactDeletedEvent;
export type CompanyCreatedEventType = CompanyCreatedEvent;
export type CompanyUpdatedEventType = CompanyUpdatedEvent;
export type CompanyDeletedEventType = CompanyDeletedEvent;
export type DealCreatedEventType = DealCreatedEvent;
export type DealUpdatedEventType = DealUpdatedEvent;
export type DealDeletedEventType = DealDeletedEvent;
export type TicketCreatedEventType = TicketCreatedEvent;
export type TicketUpdatedEventType = TicketUpdatedEvent;
export type TicketDeletedEventType = TicketDeletedEvent;

// ─────────────────────────────────────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────────────────────────────────────

function parseBody(body: unknown): unknown {
	return typeof body === 'string' ? JSON.parse(body) : body;
}

export function verifyHubSpotWebhookSignature(
	request: WebhookRequest<unknown>,
	webhookSecret?: string,
): { valid: boolean; error?: string } {
	if (!webhookSecret) {
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
	const signature = Array.isArray(headers['x-hubspot-signature-v3'])
		? headers['x-hubspot-signature-v3'][0]
		: headers['x-hubspot-signature-v3'];

	if (!signature) {
		return {
			valid: false,
			error: 'Missing x-hubspot-signature-v3 header',
		};
	}

	const isValid = verifyHmacSignature(rawBody, webhookSecret, signature);
	if (!isValid) {
		return { valid: false, error: 'Invalid signature' };
	}

	return { valid: true };
}

export function createHubSpotEventMatch(
	subscriptionType: string,
): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsedBody = parseBody(request.body);
		const events = Array.isArray(parsedBody) ? parsedBody : [parsedBody];
		return events.some(
			(event) =>
				typeof event === 'object' &&
				event !== null &&
				'subscriptionType' in event &&
				typeof (event as Record<string, unknown>).subscriptionType ===
					'string' &&
				(event as Record<string, unknown>).subscriptionType ===
					subscriptionType,
		);
	};
}
