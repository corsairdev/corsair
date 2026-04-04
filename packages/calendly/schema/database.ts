import { z } from 'zod';

export const CalendlyScheduledEvent = z.object({
	id: z.string(),
	uri: z.string().optional(),
	name: z.string().optional(),
	status: z.enum(['active', 'canceled']).optional(),
	start_time: z.string().optional(),
	end_time: z.string().optional(),
	event_type: z.string().optional(),
	location: z
		.object({
			type: z.string(),
			location: z.string().optional(),
			join_url: z.string().optional(),
		})
		.optional(),
	created_at: z.coerce.date().nullable().optional(),
	updated_at: z.coerce.date().nullable().optional(),
});

export type CalendlyScheduledEvent = z.infer<typeof CalendlyScheduledEvent>;

export const CalendlyEventType = z.object({
	id: z.string(),
	uri: z.string().optional(),
	name: z.string().optional(),
	active: z.boolean().optional(),
	slug: z.string().optional(),
	scheduling_url: z.string().optional(),
	duration: z.number().optional(),
	kind: z.string().optional(),
	color: z.string().optional(),
	description_plain: z.string().optional(),
	created_at: z.coerce.date().nullable().optional(),
	updated_at: z.coerce.date().nullable().optional(),
});

export type CalendlyEventType = z.infer<typeof CalendlyEventType>;

export const CalendlyInvitee = z.object({
	id: z.string(),
	uri: z.string().optional(),
	email: z.string().optional(),
	name: z.string().optional(),
	status: z.enum(['active', 'canceled']).optional(),
	event: z.string().optional(),
	timezone: z.string().optional(),
	created_at: z.coerce.date().nullable().optional(),
	updated_at: z.coerce.date().nullable().optional(),
});

export type CalendlyInvitee = z.infer<typeof CalendlyInvitee>;

export const CalendlyUser = z.object({
	id: z.string(),
	uri: z.string().optional(),
	name: z.string().optional(),
	slug: z.string().optional(),
	email: z.string().optional(),
	scheduling_url: z.string().optional(),
	timezone: z.string().optional(),
	avatar_url: z.string().optional(),
	created_at: z.coerce.date().nullable().optional(),
	updated_at: z.coerce.date().nullable().optional(),
});

export type CalendlyUser = z.infer<typeof CalendlyUser>;

export const CalendlyWebhookSubscription = z.object({
	id: z.string(),
	uri: z.string().optional(),
	callback_url: z.string().optional(),
	state: z.enum(['active', 'disabled']).optional(),
	scope: z.string().optional(),
	organization: z.string().optional(),
	user: z.string().optional(),
	created_at: z.coerce.date().nullable().optional(),
	updated_at: z.coerce.date().nullable().optional(),
});

export type CalendlyWebhookSubscription = z.infer<
	typeof CalendlyWebhookSubscription
>;

export const CalendlyOrganizationMembership = z.object({
	id: z.string(),
	uri: z.string().optional(),
	role: z.string().optional(),
	user_uri: z.string().optional(),
	user_email: z.string().optional(),
	user_name: z.string().optional(),
	organization: z.string().optional(),
	created_at: z.coerce.date().nullable().optional(),
	updated_at: z.coerce.date().nullable().optional(),
});

export type CalendlyOrganizationMembership = z.infer<
	typeof CalendlyOrganizationMembership
>;

export const CalendlyOrganizationInvitation = z.object({
	id: z.string(),
	uri: z.string().optional(),
	organization: z.string().optional(),
	email: z.string().optional(),
	status: z.string().optional(),
	last_sent_at: z.string().optional(),
	user: z.string().optional(),
	created_at: z.coerce.date().nullable().optional(),
	updated_at: z.coerce.date().nullable().optional(),
});

export type CalendlyOrganizationInvitation = z.infer<
	typeof CalendlyOrganizationInvitation
>;

export const CalendlyGroup = z.object({
	id: z.string(),
	uri: z.string().optional(),
	name: z.string().optional(),
	slug: z.string().optional(),
	organization: z.string().optional(),
	user_count: z.number().optional(),
	scheduling_url: z.string().optional(),
	created_at: z.coerce.date().nullable().optional(),
	updated_at: z.coerce.date().nullable().optional(),
});

export type CalendlyGroup = z.infer<typeof CalendlyGroup>;

export const CalendlyRoutingForm = z.object({
	id: z.string(),
	uri: z.string().optional(),
	name: z.string().optional(),
	organization: z.string().optional(),
	status: z.string().optional(),
	created_at: z.coerce.date().nullable().optional(),
	updated_at: z.coerce.date().nullable().optional(),
});

export type CalendlyRoutingForm = z.infer<typeof CalendlyRoutingForm>;

export const CalendlyActivityLogEntry = z.object({
	id: z.string(),
	uri: z.string().optional(),
	action: z.string().optional(),
	// Actor shape varies by actor type (user, system, API key, etc.)
	actor: z.record(z.unknown()).optional(),
	// Details are action-specific; each action type has a different payload shape
	details: z.record(z.unknown()).optional(),
	organization: z.string().optional(),
	occurred_at: z.string().optional(),
	namespace: z.string().optional(),
});

export type CalendlyActivityLogEntry = z.infer<typeof CalendlyActivityLogEntry>;

export const CalendlyOutgoingCommunication = z.object({
	id: z.string(),
	uri: z.string().optional(),
	channel: z.string().optional(),
	sent_at: z.string().optional(),
	status: z.string().optional(),
	to: z.string().optional(),
});

export type CalendlyOutgoingCommunication = z.infer<
	typeof CalendlyOutgoingCommunication
>;
