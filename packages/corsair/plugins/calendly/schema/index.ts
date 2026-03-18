import {
	CalendlyActivityLogEntry,
	CalendlyEventType,
	CalendlyGroup,
	CalendlyInvitee,
	CalendlyOrganizationInvitation,
	CalendlyOrganizationMembership,
	CalendlyOutgoingCommunication,
	CalendlyRoutingForm,
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
		orgMemberships: CalendlyOrganizationMembership,
		orgInvitations: CalendlyOrganizationInvitation,
		groups: CalendlyGroup,
		routingForms: CalendlyRoutingForm,
		activityLogEntries: CalendlyActivityLogEntry,
		outgoingCommunications: CalendlyOutgoingCommunication,
	},
} as const;
