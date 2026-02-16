export interface HubSpotWebhookPayload {
	subscriptionId: number;
	portalId: number;
	occurredAt: number;
	subscriptionType: string;
	attemptNumber: number;
	objectId?: number;
	propertyName?: string;
	propertyValue?: string;
	changeSource?: string;
	eventId?: string;
}

export interface ContactCreatedEvent extends HubSpotWebhookPayload {
	subscriptionType: 'contact.creation';
	objectId: number;
}

export interface ContactUpdatedEvent extends HubSpotWebhookPayload {
	subscriptionType: 'contact.propertyChange';
	objectId: number;
	propertyName: string;
	propertyValue: string;
}

export interface ContactDeletedEvent extends HubSpotWebhookPayload {
	subscriptionType: 'contact.deletion';
	objectId: number;
}

export interface CompanyCreatedEvent extends HubSpotWebhookPayload {
	subscriptionType: 'company.creation';
	objectId: number;
}

export interface CompanyUpdatedEvent extends HubSpotWebhookPayload {
	subscriptionType: 'company.propertyChange';
	objectId: number;
	propertyName: string;
	propertyValue: string;
}

export interface CompanyDeletedEvent extends HubSpotWebhookPayload {
	subscriptionType: 'company.deletion';
	objectId: number;
}

export interface DealCreatedEvent extends HubSpotWebhookPayload {
	subscriptionType: 'deal.creation';
	objectId: number;
}

export interface DealUpdatedEvent extends HubSpotWebhookPayload {
	subscriptionType: 'deal.propertyChange';
	objectId: number;
	propertyName: string;
	propertyValue: string;
}

export interface DealDeletedEvent extends HubSpotWebhookPayload {
	subscriptionType: 'deal.deletion';
	objectId: number;
}

export interface TicketCreatedEvent extends HubSpotWebhookPayload {
	subscriptionType: 'ticket.creation';
	objectId: number;
}

export interface TicketUpdatedEvent extends HubSpotWebhookPayload {
	subscriptionType: 'ticket.propertyChange';
	objectId: number;
	propertyName: string;
	propertyValue: string;
}

export interface TicketDeletedEvent extends HubSpotWebhookPayload {
	subscriptionType: 'ticket.deletion';
	objectId: number;
}

export type HubSpotWebhookEventType =
	| ContactCreatedEvent
	| ContactUpdatedEvent
	| ContactDeletedEvent
	| CompanyCreatedEvent
	| CompanyUpdatedEvent
	| CompanyDeletedEvent
	| DealCreatedEvent
	| DealUpdatedEvent
	| DealDeletedEvent
	| TicketCreatedEvent
	| TicketUpdatedEvent
	| TicketDeletedEvent;

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

import { verifyHmacSignature } from '../../../async-core/webhook-utils';
import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from '../../../core';

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
