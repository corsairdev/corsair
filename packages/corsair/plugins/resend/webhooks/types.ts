export interface ResendWebhookPayload {
	type: string;
	created_at: string;
	data: {
		email_id?: string;
		domain_id?: string;
		from?: string;
		to?: string[];
		subject?: string;
		created_at: string;
		name?: string;
		status?: string;
		bounce_type?: string;
		link?: string;
		error?: string;
		[key: string]: any;
	};
}

export interface EmailBouncedEvent extends ResendWebhookPayload {
	type: 'email.bounced';
	data: {
		email_id: string;
		from: string;
		to: string[];
		subject?: string;
		created_at: string;
		bounce_type?: string;
		[key: string]: any;
	};
}

export interface EmailClickedEvent extends ResendWebhookPayload {
	type: 'email.clicked';
	data: {
		email_id: string;
		from: string;
		to: string[];
		subject?: string;
		created_at: string;
		link?: string;
		[key: string]: any;
	};
}

export interface EmailComplainedEvent extends ResendWebhookPayload {
	type: 'email.complained';
	data: {
		email_id: string;
		from: string;
		to: string[];
		subject?: string;
		created_at: string;
		[key: string]: any;
	};
}

export interface EmailDeliveredEvent extends ResendWebhookPayload {
	type: 'email.delivered';
	data: {
		email_id: string;
		from: string;
		to: string[];
		subject?: string;
		created_at: string;
		[key: string]: any;
	};
}

export interface EmailFailedEvent extends ResendWebhookPayload {
	type: 'email.failed';
	data: {
		email_id: string;
		from: string;
		to: string[];
		subject?: string;
		created_at: string;
		error?: string;
		[key: string]: any;
	};
}

export interface EmailOpenedEvent extends ResendWebhookPayload {
	type: 'email.opened';
	data: {
		email_id: string;
		from: string;
		to: string[];
		subject?: string;
		created_at: string;
		[key: string]: any;
	};
}

export interface EmailReceivedEvent extends ResendWebhookPayload {
	type: 'email.received';
	data: {
		email_id: string;
		from: string;
		to: string[];
		subject?: string;
		created_at: string;
		[key: string]: any;
	};
}

export interface EmailSentEvent extends ResendWebhookPayload {
	type: 'email.sent';
	data: {
		email_id: string;
		from: string;
		to: string[];
		subject?: string;
		created_at: string;
		[key: string]: any;
	};
}

export interface DomainCreatedEvent extends ResendWebhookPayload {
	type: 'domain.created';
	data: {
		domain_id: string;
		name: string;
		status: 'not_started' | 'validation' | 'scheduled' | 'ready' | 'error';
		created_at: string;
		[key: string]: any;
	};
}

export interface DomainUpdatedEvent extends ResendWebhookPayload {
	type: 'domain.updated';
	data: {
		domain_id: string;
		name: string;
		status: 'not_started' | 'validation' | 'scheduled' | 'ready' | 'error';
		created_at: string;
		[key: string]: any;
	};
}

export type ResendWebhookEvent =
	| EmailBouncedEvent
	| EmailClickedEvent
	| EmailComplainedEvent
	| EmailDeliveredEvent
	| EmailFailedEvent
	| EmailOpenedEvent
	| EmailReceivedEvent
	| EmailSentEvent
	| DomainCreatedEvent
	| DomainUpdatedEvent;

export type ResendEventName =
	| 'email.bounced'
	| 'email.clicked'
	| 'email.complained'
	| 'email.delivered'
	| 'email.failed'
	| 'email.opened'
	| 'email.received'
	| 'email.sent'
	| 'domain.created'
	| 'domain.updated';

export interface ResendEventMap {
	'email.bounced': EmailBouncedEvent;
	'email.clicked': EmailClickedEvent;
	'email.complained': EmailComplainedEvent;
	'email.delivered': EmailDeliveredEvent;
	'email.failed': EmailFailedEvent;
	'email.opened': EmailOpenedEvent;
	'email.received': EmailReceivedEvent;
	'email.sent': EmailSentEvent;
	'domain.created': DomainCreatedEvent;
	'domain.updated': DomainUpdatedEvent;
}

export type ResendWebhookOutputs = {
	emailBounced: EmailBouncedEvent;
	emailClicked: EmailClickedEvent;
	emailComplained: EmailComplainedEvent;
	emailDelivered: EmailDeliveredEvent;
	emailFailed: EmailFailedEvent;
	emailOpened: EmailOpenedEvent;
	emailReceived: EmailReceivedEvent;
	emailSent: EmailSentEvent;
	domainCreated: DomainCreatedEvent;
	domainUpdated: DomainUpdatedEvent;
};

import type { CorsairWebhookMatcher, RawWebhookRequest } from '../../../core';

function parseBody(body: unknown): unknown {
	return typeof body === 'string' ? JSON.parse(body) : body;
}

export function createResendMatch(type: string): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsedBody = parseBody(request.body) as Record<string, unknown>;
		return typeof parsedBody.type === 'string' && parsedBody.type === type;
	};
}
