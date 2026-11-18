import { z } from 'zod';
import {
	DeletedResponseSchema,
	FubMetadataSchema,
	IdSchema,
	ListQuerySchema,
} from './types';

// The webhooks family: webhook subscriptions and the webhook delivery events.
// Inputs use Follow Up Boss's own parameter names; outputs are `.loose()` and
// their documented fields nullish, so a field FUB adds or omits cannot fail a
// call that has already happened. Field reference:
// https://docs.followupboss.com/reference
//
// Contract quirks kept verbatim (see also the handlers):
// - GET /webhookEvents/:id is the one published path using the `:name` colon
//   style instead of `{name}`; the `{id}` template semantics are used here so
//   the segment is interpolated and encoded like every other path parameter.
// - The published spec declares no type for that path `id`; it identifies the
//   webhook (an integer) while the returned event's `id` is a hex string, so
//   both spellings are accepted on input.
// - POST /webhooks documents 36 event types including the three stage events;
//   PUT /webhooks/{id} narrows the same enum to 33 by dropping the stage
//   events, so the narrower list is enforced on update.
// - DELETE /webhooks/{id} answers 200 with an empty body, and POST /webhooks
//   answers 200 (not 201) with the bare webhook.

// ── entities ───────────────────────────────────────────────────────────────

export const WEBHOOK_EVENT_TYPES = [
	'peopleCreated',
	'peopleUpdated',
	'peopleDeleted',
	'peopleTagsCreated',
	'peopleStageUpdated',
	'peopleRelationshipCreated',
	'peopleRelationshipUpdated',
	'peopleRelationshipDeleted',
	'notesCreated',
	'notesUpdated',
	'notesDeleted',
	'emEventsOpened',
	'emEventsClicked',
	'emEventsUnsubscribed',
	'tasksCreated',
	'tasksUpdated',
	'tasksDeleted',
	'appointmentsCreated',
	'appointmentsUpdated',
	'appointmentsDeleted',
	'textMessagesCreated',
	'textMessagesUpdated',
	'textMessagesDeleted',
	'callsCreated',
	'callsUpdated',
	'callsDeleted',
	'dealsCreated',
	'dealsUpdated',
	'dealsDeleted',
	'emailsCreated',
	'emailsUpdated',
	'emailsDeleted',
	'eventsCreated',
	'stageCreated',
	'stageUpdated',
	'stageDeleted',
] as const;

// The PUT contract drops the three stage events from the create enum.
export const WEBHOOK_UPDATE_EVENT_TYPES = [
	'peopleCreated',
	'peopleUpdated',
	'peopleDeleted',
	'peopleTagsCreated',
	'peopleStageUpdated',
	'peopleRelationshipCreated',
	'peopleRelationshipUpdated',
	'peopleRelationshipDeleted',
	'notesCreated',
	'notesUpdated',
	'notesDeleted',
	'emEventsOpened',
	'emEventsClicked',
	'emEventsUnsubscribed',
	'tasksCreated',
	'tasksUpdated',
	'tasksDeleted',
	'appointmentsCreated',
	'appointmentsUpdated',
	'appointmentsDeleted',
	'textMessagesCreated',
	'textMessagesUpdated',
	'textMessagesDeleted',
	'callsCreated',
	'callsUpdated',
	'callsDeleted',
	'dealsCreated',
	'dealsUpdated',
	'dealsDeleted',
	'emailsCreated',
	'emailsUpdated',
	'emailsDeleted',
	'eventsCreated',
] as const;

export const WEBHOOK_STATUSES = ['Active', 'Disabled'] as const;

export const WebhookSchema = z
	.object({
		id: IdSchema.nullish(),
		event: z.string().nullish(),
		status: z.string().nullish(),
		url: z.string().nullish(),
	})
	.loose();

export type FollowUpBossWebhook = z.infer<typeof WebhookSchema>;

const WebhookEnvelopeSchema = z
	.object({
		webhooks: z.array(WebhookSchema),
		_metadata: FubMetadataSchema.nullish(),
	})
	.loose();

// The webhook delivery event. Its `id` is a hex string, unlike the numeric
// resource ids everywhere else.
export const WebhookEventSchema = z
	.object({
		id: z.string().nullish(),
		eventCreated: z.string().nullish(),
		event: z.string().nullish(),
		resourceIds: z.array(IdSchema).nullish(),
		uri: z.string().nullish(),
	})
	.loose();

export type FollowUpBossWebhookEvent = z.infer<typeof WebhookEventSchema>;

// ── webhooks ───────────────────────────────────────────────────────────────

const WebhooksListInputSchema = ListQuerySchema.extend({
	sort: z
		.string()
		.optional()
		.describe(
			'Sort order: `id`, `created`, `updated`, `status` or `event`; defaults to `created`.',
		),
	event: z
		.string()
		.optional()
		.describe('Search for webhooks by event, e.g. `peopleCreated`.'),
	status: z
		.enum(WEBHOOK_STATUSES)
		.optional()
		.describe('Search for webhooks by status, `Active` or `Disabled`.'),
});

export type WebhooksListInput = z.infer<typeof WebhooksListInputSchema>;

const WebhooksListResponseSchema = WebhookEnvelopeSchema;

export type WebhooksListResponse = z.infer<typeof WebhooksListResponseSchema>;

const WebhooksCreateInputSchema = z.object({
	event: z
		.enum(WEBHOOK_EVENT_TYPES)
		.describe('The event the webhook responds to.'),
	url: z
		.string()
		.url()
		.refine((value) => value.startsWith('https://'), {
			message: 'The webhook endpoint must use https.',
		}),
});

export type WebhooksCreateInput = z.infer<typeof WebhooksCreateInputSchema>;

// POST /webhooks answers 200 with the bare webhook, not 201.
const WebhooksCreateResponseSchema = WebhookSchema;

export type WebhooksCreateResponse = z.infer<
	typeof WebhooksCreateResponseSchema
>;

const WebhooksGetInputSchema = z.object({
	id: IdSchema.describe('The webhook ID.'),
});

export type WebhooksGetInput = z.infer<typeof WebhooksGetInputSchema>;

const WebhooksGetResponseSchema = WebhookSchema;

export type WebhooksGetResponse = z.infer<typeof WebhooksGetResponseSchema>;

const WebhooksUpdateInputSchema = z.object({
	id: IdSchema.describe('The webhook ID.'),
	event: z
		.enum(WEBHOOK_UPDATE_EVENT_TYPES)
		.optional()
		.describe('The event the webhook responds to.'),
	url: z.string().optional(),
	status: z
		.enum(WEBHOOK_STATUSES)
		.optional()
		.describe('`Active` or `Disabled`.'),
});

export type WebhooksUpdateInput = z.infer<typeof WebhooksUpdateInputSchema>;

const WebhooksUpdateResponseSchema = WebhookSchema;

export type WebhooksUpdateResponse = z.infer<
	typeof WebhooksUpdateResponseSchema
>;

const WebhooksDeleteInputSchema = z.object({
	id: IdSchema.describe('The webhook ID to delete.'),
});

export type WebhooksDeleteInput = z.infer<typeof WebhooksDeleteInputSchema>;

// DELETE /webhooks/{id} answers 200 with an empty body.
const WebhooksDeleteResponseSchema = DeletedResponseSchema;

export type WebhooksDeleteResponse = z.infer<
	typeof WebhooksDeleteResponseSchema
>;

// ── webhook events ─────────────────────────────────────────────────────────

// GET /webhookEvents/:id: the published path uses the `:id` colon style and
// declares no parameter for it; the `{id}` template semantics are used here
// and the id accepts the webhook's integer ID or a string spelling of it.
const WebhookEventsGetInputSchema = z.object({
	id: z
		.union([IdSchema, z.string().min(1)])
		.describe('The ID of the webhook whose delivery events are listed.'),
});

export type WebhookEventsGetInput = z.infer<typeof WebhookEventsGetInputSchema>;

// GET /webhookEvents/:id returns the delivery-event list for the webhook,
// possibly empty; the full list is preserved instead of unwrapping one event.
const WebhookEventsGetResponseSchema = z.array(WebhookEventSchema);

export type WebhookEventsGetResponse = z.infer<
	typeof WebhookEventsGetResponseSchema
>;

// ── type maps ──────────────────────────────────────────────────────────────

export const WebhooksInputSchemas = {
	webhooksList: WebhooksListInputSchema,
	webhooksCreate: WebhooksCreateInputSchema,
	webhooksGet: WebhooksGetInputSchema,
	webhooksUpdate: WebhooksUpdateInputSchema,
	webhooksDelete: WebhooksDeleteInputSchema,
	webhookEventsGet: WebhookEventsGetInputSchema,
} as const;

export const WebhooksOutputSchemas = {
	webhooksList: WebhooksListResponseSchema,
	webhooksCreate: WebhooksCreateResponseSchema,
	webhooksGet: WebhooksGetResponseSchema,
	webhooksUpdate: WebhooksUpdateResponseSchema,
	webhooksDelete: WebhooksDeleteResponseSchema,
	webhookEventsGet: WebhookEventsGetResponseSchema,
} as const;
