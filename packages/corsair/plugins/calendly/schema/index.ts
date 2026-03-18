import {
	CalendlyEventType,
	CalendlyInvitee,
	CalendlyScheduledEvent,
	CalendlyUser,
	CalendlyWebhookSubscription,
} from './database';

export const CalendlySchema = {
	version: '1.0.0',
	entities: {
		scheduledEvents: CalendlyScheduledEvent,
		eventTypes: CalendlyEventType,
		invitees: CalendlyInvitee,
		users: CalendlyUser,
		webhookSubscriptions: CalendlyWebhookSubscription,
	},
} as const;
