// HubSpot Webhook Event Types

export interface HubSpotWebhookSubscription {
	eventType: string;
	propertyName?: string;
	active: boolean;
}

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

// Contact Events
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

// Company Events
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

// Deal Events
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

// Ticket Events
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

// Engagement Events
export interface EngagementCreatedEvent extends HubSpotWebhookPayload {
	subscriptionType: 'engagement.creation';
	objectId: number;
}

export interface EngagementUpdatedEvent extends HubSpotWebhookPayload {
	subscriptionType: 'engagement.deletion';
	objectId: number;
}

// Conversation Events
export interface ConversationCreatedEvent extends HubSpotWebhookPayload {
	subscriptionType: 'conversation.creation';
	objectId: number;
}

export interface ConversationNewMessageEvent extends HubSpotWebhookPayload {
	subscriptionType: 'conversation.newMessage';
	objectId: number;
}

export interface ConversationPropertyChangeEvent
	extends HubSpotWebhookPayload {
	subscriptionType: 'conversation.propertyChange';
	objectId: number;
	propertyName: string;
	propertyValue: string;
}

export interface ConversationDeletionEvent extends HubSpotWebhookPayload {
	subscriptionType: 'conversation.deletion';
	objectId: number;
}

export interface ConversationPrivacyDeletionEvent
	extends HubSpotWebhookPayload {
	subscriptionType: 'conversation.privacyDeletion';
	objectId: number;
}

// Contact Privacy Events
export interface ContactPrivacyDeletionEvent extends HubSpotWebhookPayload {
	subscriptionType: 'contact.privacyDeletion';
	objectId: number;
}

// Workflow Events
export interface WorkflowEnrollmentEvent extends HubSpotWebhookPayload {
	subscriptionType: 'workflow.enrollment';
	objectId: number;
}

// Union of all webhook events
export type HubSpotWebhookEvent =
	| ContactCreatedEvent
	| ContactUpdatedEvent
	| ContactDeletedEvent
	| ContactPrivacyDeletionEvent
	| CompanyCreatedEvent
	| CompanyUpdatedEvent
	| CompanyDeletedEvent
	| DealCreatedEvent
	| DealUpdatedEvent
	| DealDeletedEvent
	| TicketCreatedEvent
	| TicketUpdatedEvent
	| TicketDeletedEvent
	| EngagementCreatedEvent
	| EngagementUpdatedEvent
	| ConversationCreatedEvent
	| ConversationNewMessageEvent
	| ConversationPropertyChangeEvent
	| ConversationDeletionEvent
	| ConversationPrivacyDeletionEvent
	| WorkflowEnrollmentEvent;

// Event type names
export type HubSpotEventName =
	| 'contact.creation'
	| 'contact.propertyChange'
	| 'contact.deletion'
	| 'contact.privacyDeletion'
	| 'company.creation'
	| 'company.propertyChange'
	| 'company.deletion'
	| 'deal.creation'
	| 'deal.propertyChange'
	| 'deal.deletion'
	| 'ticket.creation'
	| 'ticket.propertyChange'
	| 'ticket.deletion'
	| 'engagement.creation'
	| 'engagement.deletion'
	| 'conversation.creation'
	| 'conversation.newMessage'
	| 'conversation.propertyChange'
	| 'conversation.deletion'
	| 'conversation.privacyDeletion'
	| 'workflow.enrollment';

export interface HubSpotEventMap {
	'contact.creation': ContactCreatedEvent;
	'contact.propertyChange': ContactUpdatedEvent;
	'contact.deletion': ContactDeletedEvent;
	'contact.privacyDeletion': ContactPrivacyDeletionEvent;
	'company.creation': CompanyCreatedEvent;
	'company.propertyChange': CompanyUpdatedEvent;
	'company.deletion': CompanyDeletedEvent;
	'deal.creation': DealCreatedEvent;
	'deal.propertyChange': DealUpdatedEvent;
	'deal.deletion': DealDeletedEvent;
	'ticket.creation': TicketCreatedEvent;
	'ticket.propertyChange': TicketUpdatedEvent;
	'ticket.deletion': TicketDeletedEvent;
	'engagement.creation': EngagementCreatedEvent;
	'engagement.deletion': EngagementUpdatedEvent;
	'conversation.creation': ConversationCreatedEvent;
	'conversation.newMessage': ConversationNewMessageEvent;
	'conversation.propertyChange': ConversationPropertyChangeEvent;
	'conversation.deletion': ConversationDeletionEvent;
	'conversation.privacyDeletion': ConversationPrivacyDeletionEvent;
	'workflow.enrollment': WorkflowEnrollmentEvent;
}

