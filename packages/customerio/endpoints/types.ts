import { z } from 'zod';
import type { CustomerioJsonObject, CustomerioJsonValue } from '../client';

// Recursive free-form JSON schemas without `unknown` or `any`.
// Customer.io traits, properties and Liquid personalization data are
// arbitrary JSON, so inputs/outputs reuse these explicit recursive unions.
// The explicit `ZodType` annotation below is a type annotation (not a type
// assertion): it is required for recursive `z.lazy` schemas to terminate.
const CustomerioJsonPrimitiveSchema = z.union([
	z.string(),
	z.number(),
	z.boolean(),
	z.null(),
]);

export const CustomerioJsonValueSchema: z.ZodType<CustomerioJsonValue> = z.lazy(
	() =>
		z.union([
			CustomerioJsonPrimitiveSchema,
			z.array(CustomerioJsonValueSchema),
			z.record(z.string(), CustomerioJsonValueSchema),
		]),
);

export const CustomerioJsonObjectSchema: z.ZodType<CustomerioJsonObject> =
	z.lazy(() => z.record(z.string(), CustomerioJsonValueSchema));

// ─── Broadcasts (App API) ─────────────────────────────────────────────
// Docs: https://docs.customer.io/integrations/api/app/tag/broadcasts/
// Trigger: https://docs.customer.io/integrations/api/app/tag/send-messages/triggerBroadcast/

const TriggerBroadcastPerUserDataSchema = z
	.object({
		id: z.string().optional(),
		email: z.string().email().optional(),
		data: CustomerioJsonObjectSchema.optional(),
	})
	.refine((entry) => entry.id !== undefined || entry.email !== undefined, {
		message: 'Each per_user_data entry must include an id or an email',
	});

const TriggerBroadcastInputSchema = z
	.object({
		broadcast_id: z.number().int().positive(),
		data: CustomerioJsonObjectSchema.optional(),
		recipients: z
			.object({
				ids: z.array(z.string()).optional(),
				emails: z.array(z.string().email()).optional(),
			})
			.optional(),
		ids: z.array(z.string()).optional(),
		emails: z.array(z.string().email()).optional(),
		per_user_data: z.array(TriggerBroadcastPerUserDataSchema).optional(),
		data_file_url: z.string().url().optional(),
		email_add_duplicates: z.boolean().optional(),
		email_ignore_missing: z.boolean().optional(),
		id_ignore_missing: z.boolean().optional(),
	})
	// The published spec models the audience as oneOf: either the default
	// audience (no audience field at all) or exactly one of recipients, ids,
	// emails, per_user_data, data_file_url. Combinations match no branch, so
	// at most one mode is accepted here — zero modes is the valid default.
	.refine(
		(data) =>
			[
				data.recipients,
				data.ids,
				data.emails,
				data.per_user_data,
				data.data_file_url,
			].filter((mode) => mode !== undefined).length <= 1,
		{
			message:
				'Provide at most one audience mode among recipients, ids, emails, per_user_data and data_file_url',
		},
	);

const TriggerBroadcastResponseSchema = z.object({
	id: z.number().optional(),
	broadcast_id: z.number().optional(),
	trigger_id: z.number().optional(),
	created: z.union([z.number(), z.string()]).optional(),
});

const GetTriggersInputSchema = z.object({
	broadcast_id: z.number().int().positive(),
});

const BroadcastTriggerSchema = z.object({
	id: z.number(),
	broadcast_id: z.number().optional(),
	campaign_id: z.number().optional(),
	state: z.string().optional(),
	data: CustomerioJsonObjectSchema.optional(),
	created: z.union([z.number(), z.string()]).optional(),
	created_at: z.union([z.number(), z.string()]).optional(),
	processed_at: z.union([z.number(), z.string()]).optional(),
});

const GetTriggersResponseSchema = z.object({
	triggers: z.array(BroadcastTriggerSchema),
	next: z.string().optional(),
});

const GetTriggerInputSchema = z.object({
	broadcast_id: z.number().int().positive(),
	trigger_id: z.number().int().positive(),
});

const GetTriggerResponseSchema = BroadcastTriggerSchema;

// ─── Reporting webhooks (App API) ─────────────────────────────────────
// Docs: https://docs.customer.io/integrations/api/app/tag/reporting-webhooks/

const GetWebhooksInputSchema = z.object({});

const ReportingWebhookSchema = z.object({
	id: z.number().optional(),
	name: z.string().optional(),
	endpoint: z.string().optional(),
	events: z.array(z.string()).optional(),
	disabled: z.boolean().optional(),
});

const GetWebhooksResponseSchema = z.object({
	// Verified live: empty workspaces return {"reporting_webhooks": null}.
	reporting_webhooks: z.array(ReportingWebhookSchema).nullable(),
});

// ─── Messages (App API) ───────────────────────────────────────────────
// Docs: https://docs.customer.io/integrations/api/app/tag/messages/

const GetMessagesInputSchema = z.object({
	limit: z.number().int().min(1).max(100).optional(),
	start: z.string().optional(),
	drafts: z.boolean().optional(),
	type: z
		.enum(['email', 'push', 'sms', 'in_app', 'inbox', 'whatsapp'])
		.optional(),
	campaign_id: z.number().int().optional(),
	newsletter_id: z.number().int().optional(),
	action_id: z.number().int().optional(),
});

const MessageSchema = z.object({
	id: z.union([z.string(), z.number()]).optional(),
	type: z.string().optional(),
	customer_id: z.string().optional(),
	campaign_id: z.number().optional(),
	newsletter_id: z.number().optional(),
	action_id: z.number().optional(),
	subject: z.string().optional(),
	created: z.union([z.number(), z.string()]).optional(),
});

const GetMessagesResponseSchema = z.object({
	messages: z.array(MessageSchema),
	next: z.string().optional(),
});

// ─── Segments (App API) ───────────────────────────────────────────────
// Docs: https://docs.customer.io/integrations/api/app/tag/segments/

const GetSegmentsInputSchema = z.object({});

const SegmentSchema = z.object({
	id: z.number(),
	name: z.string().optional(),
	description: z.string().optional(),
	type: z.string().optional(),
	created: z.union([z.number(), z.string()]).optional(),
	updated: z.union([z.number(), z.string()]).optional(),
});

const GetSegmentsResponseSchema = z.object({
	segments: z.array(SegmentSchema),
});

const GetSegmentDetailsInputSchema = z.object({
	segment_id: z.number().int().positive(),
});

const GetSegmentDetailsResponseSchema = z.object({
	segment: SegmentSchema,
});

const GetSegmentMembershipInputSchema = z.object({
	segment_id: z.number().int().positive(),
	limit: z.number().int().min(1).max(100).optional(),
	start: z.string().optional(),
});

const GetSegmentMembershipResponseSchema = z.object({
	customers: z.array(CustomerioJsonObjectSchema).optional(),
	ids: z.array(z.string()).optional(),
	next: z.string().optional(),
});

// ─── Collections (App API) ────────────────────────────────────────────
// Docs: https://docs.customer.io/integrations/api/app/tag/collections/

const ListCollectionsInputSchema = z.object({});

const CollectionSchema = z.object({
	id: z.string().optional(),
	name: z.string().optional(),
	schema: CustomerioJsonObjectSchema.optional(),
	rows: z.number().optional(),
	bytes: z.number().optional(),
	created: z.union([z.number(), z.string()]).optional(),
});

const ListCollectionsResponseSchema = z.object({
	// Verified live: empty workspaces return {"collections": null}.
	collections: z.array(CollectionSchema).nullable(),
});

// ─── Info (App API) ───────────────────────────────────────────────────
// Docs: https://docs.customer.io/integrations/api/app/tag/info/

const ListIpAddressesInputSchema = z.object({});

const ListIpAddressesResponseSchema = z.object({
	ip_addresses: z.array(z.string()),
});

// ─── Newsletters / one-time sends (App API) ───────────────────────────
// Docs: https://docs.customer.io/integrations/api/app/tag/newsletters/

const ListNewslettersInputSchema = z.object({
	limit: z.number().int().min(1).max(100).optional(),
	start: z.string().optional(),
	sort: z.enum(['asc', 'desc']).optional(),
});

const NewsletterSchema = z.object({
	id: z.number().optional(),
	name: z.string().optional(),
	type: z.string().optional(),
	content_ids: z.array(z.number()).optional(),
	sent_at: z.union([z.number(), z.string()]).optional(),
});

const ListNewslettersResponseSchema = z.object({
	newsletters: z.array(NewsletterSchema),
	next: z.string().optional(),
});

// ─── Snippets (App API) ───────────────────────────────────────────────
// Docs: https://docs.customer.io/integrations/api/app/tag/snippets/

const ListSnippetsInputSchema = z.object({});

const SnippetSchema = z.object({
	name: z.string(),
	value: z.string().optional(),
	updated_at: z.union([z.number(), z.string()]).optional(),
});

const ListSnippetsResponseSchema = z.object({
	snippets: z.array(SnippetSchema),
});

// ─── Transactional (App API) ──────────────────────────────────────────
// Docs: https://docs.customer.io/integrations/api/app/tag/transactional/

const ListTransactionalMessagesInputSchema = z.object({});

const TransactionalMessageSchema = z.object({
	id: z.union([z.string(), z.number()]).optional(),
	transactional_id: z.union([z.string(), z.number()]).optional(),
	name: z.string().optional(),
	trigger_name: z.string().optional(),
	description: z.string().optional(),
	created_at: z.union([z.number(), z.string()]).optional(),
	updated_at: z.union([z.number(), z.string()]).optional(),
});

// Verified live against a real workspace: GET /v1/transactional returns
// {"messages": [...]}, not a bare array.
const ListTransactionalMessagesResponseSchema = z.object({
	messages: z.array(TransactionalMessageSchema),
});

// ─── Profiles (Track API) ─────────────────────────────────────────────
// Docs: https://docs.customer.io/integrations/api/track/
// Track calls return HTTP 200 with an empty JSON object on success.

const TrackEmptyResponseSchema = z.object({});

const IdentifyPersonInputSchema = z.object({
	identifier: z.string().min(1),
	email: z.string().email().optional(),
	id: z.union([z.string(), z.number()]).optional(),
	created_at: z.number().int().optional(),
	attributes: CustomerioJsonObjectSchema.optional(),
});

const CustomerIdentifierSchema = z
	.object({
		id: z.union([z.string(), z.number()]).optional(),
		email: z.string().email().optional(),
		cio_id: z.string().optional(),
	})
	.refine(
		(data) =>
			[data.id, data.email, data.cio_id].filter((value) => value !== undefined)
				.length === 1,
		{ message: 'Provide exactly one of id, email or cio_id' },
	);

const CreateAliasInputSchema = z.object({
	primary: CustomerIdentifierSchema,
	secondary: CustomerIdentifierSchema,
});

const SuppressPersonInputSchema = z.object({
	identifier: z.string().min(1),
});

const TrackEventInputSchema = z.object({
	identifier: z.string().min(1),
	name: z.string().min(1),
	data: CustomerioJsonObjectSchema.optional(),
	timestamp: z.number().int().optional(),
	type: z.string().optional(),
	anonymous_id: z.string().optional(),
});

const UnsubscribeDeliveryInputSchema = z.object({
	delivery_id: z.string().min(1),
	unsubscribe: z.boolean().optional(),
});

// Deprecated push-events endpoint mapped to the supported metrics endpoint.
// Docs: POST /api/v1/metrics replaces POST /api/v1/push/events
// (spec marks push/events "deprecated": true). Metric names and the href /
// reason fields below are the docs-listed email metric values.
const ReportPushEventMetricSchema = z.enum([
	'bounced',
	'clicked',
	'converted',
	'deferred',
	'delivered',
	'dropped',
	'opened',
	'spammed',
]);

const ReportPushEventsInputSchema = z
	.object({
		delivery_id: z.string().min(1),
		metric: ReportPushEventMetricSchema.optional(),
		event: ReportPushEventMetricSchema.optional(),
		href: z.string().optional(),
		reason: z.string().optional(),
		timestamp: z.number().int().optional(),
		recipient: z.string().optional(),
	})
	.refine((data) => data.metric !== undefined || data.event !== undefined, {
		message: 'Either metric or event must be provided',
	});

// ─── Groups / objects (CDP API group call) ────────────────────────────
// Docs: https://docs.customer.io/integrations/api/cdp/
// Groups represent companies, accounts or projects people belong to.

const AddPersonToGroupInputSchema = z.object({
	userId: z.string().min(1),
	groupId: z.string().min(1),
	traits: CustomerioJsonObjectSchema.optional(),
});

// ─── CDP batch / page / screen ────────────────────────────────────────
// Docs: https://docs.customer.io/integrations/api/cdp/
// Limits: 64KB per call, 1MB total per batch request.
// See https://docs.customer.io/integrations/api/track-vs-cdp-api

const CdpContextSchema = CustomerioJsonObjectSchema.optional();

// In strict mode (which makeCdpRequest enables), identify, track, page,
// screen and alias calls require userId or anonymousId; group calls require
// groupId (already min(1) below) and alias additionally requires previousId
// (already min(1) below). The batch call schemas participate in a
// discriminatedUnion, which cannot hold refined schemas, so the identity
// rule is enforced once on SendBatchInputSchema instead of per call.
function cdpCallHasIdentity(data: {
	userId?: string;
	anonymousId?: string;
}): boolean {
	return (
		(data.userId !== undefined && data.userId.length > 0) ||
		(data.anonymousId !== undefined && data.anonymousId.length > 0)
	);
}

const CdpIdentifyCallSchema = z.object({
	type: z.literal('identify'),
	userId: z.string().optional(),
	anonymousId: z.string().optional(),
	traits: CustomerioJsonObjectSchema.optional(),
	context: CdpContextSchema,
	timestamp: z.string().optional(),
});

const CdpTrackCallSchema = z.object({
	type: z.literal('track'),
	userId: z.string().optional(),
	anonymousId: z.string().optional(),
	event: z.string().min(1),
	properties: CustomerioJsonObjectSchema.optional(),
	context: CdpContextSchema,
	timestamp: z.string().optional(),
});

const CdpPageCallSchema = z.object({
	type: z.literal('page'),
	userId: z.string().optional(),
	anonymousId: z.string().optional(),
	name: z.string().optional(),
	properties: CustomerioJsonObjectSchema.optional(),
	context: CdpContextSchema,
	timestamp: z.string().optional(),
});

const CdpScreenCallSchema = z.object({
	type: z.literal('screen'),
	userId: z.string().optional(),
	anonymousId: z.string().optional(),
	name: z.string().min(1),
	properties: CustomerioJsonObjectSchema.optional(),
	context: CdpContextSchema,
	timestamp: z.string().optional(),
});

const CdpGroupCallSchema = z.object({
	type: z.literal('group'),
	userId: z.string().optional(),
	anonymousId: z.string().optional(),
	groupId: z.string().min(1),
	traits: CustomerioJsonObjectSchema.optional(),
	context: CdpContextSchema,
	timestamp: z.string().optional(),
});

const CdpAliasCallSchema = z.object({
	type: z.literal('alias'),
	userId: z.string().min(1),
	previousId: z.string().min(1),
	context: CdpContextSchema,
	timestamp: z.string().optional(),
});

const SendBatchInputSchema = z
	.object({
		batch: z
			.array(
				z.discriminatedUnion('type', [
					CdpIdentifyCallSchema,
					CdpTrackCallSchema,
					CdpPageCallSchema,
					CdpScreenCallSchema,
					CdpGroupCallSchema,
					CdpAliasCallSchema,
				]),
			)
			.min(1),
		context: CdpContextSchema,
	})
	.refine(
		(data) =>
			data.batch.every(
				(call) => call.type === 'group' || cdpCallHasIdentity(call),
			),
		{ message: 'CDP calls (except group) require userId or anonymousId' },
	);

const TrackPageInputSchema = z
	.object({
		userId: z.string().optional(),
		anonymousId: z.string().optional(),
		name: z.string().optional(),
		properties: CustomerioJsonObjectSchema.optional(),
		context: CdpContextSchema,
		timestamp: z.string().optional(),
	})
	.refine(cdpCallHasIdentity, {
		message: 'Either userId or anonymousId must be provided',
	});

const TrackScreenInputSchema = z
	.object({
		userId: z.string().optional(),
		anonymousId: z.string().optional(),
		name: z.string().min(1),
		properties: CustomerioJsonObjectSchema.optional(),
		context: CdpContextSchema,
		timestamp: z.string().optional(),
	})
	.refine(cdpCallHasIdentity, {
		message: 'Either userId or anonymousId must be provided',
	});

// ─── Endpoint maps ────────────────────────────────────────────────────

export type CustomerioEndpointInputs = {
	triggerBroadcast: z.infer<typeof TriggerBroadcastInputSchema>;
	getTriggers: z.infer<typeof GetTriggersInputSchema>;
	getTrigger: z.infer<typeof GetTriggerInputSchema>;
	getWebhooks: z.infer<typeof GetWebhooksInputSchema>;
	getMessages: z.infer<typeof GetMessagesInputSchema>;
	getSegments: z.infer<typeof GetSegmentsInputSchema>;
	getSegmentDetails: z.infer<typeof GetSegmentDetailsInputSchema>;
	getSegmentMembership: z.infer<typeof GetSegmentMembershipInputSchema>;
	listCollections: z.infer<typeof ListCollectionsInputSchema>;
	listIpAddresses: z.infer<typeof ListIpAddressesInputSchema>;
	listNewsletters: z.infer<typeof ListNewslettersInputSchema>;
	listSnippets: z.infer<typeof ListSnippetsInputSchema>;
	listTransactionalMessages: z.infer<
		typeof ListTransactionalMessagesInputSchema
	>;
	identifyPerson: z.infer<typeof IdentifyPersonInputSchema>;
	createAlias: z.infer<typeof CreateAliasInputSchema>;
	suppressPerson: z.infer<typeof SuppressPersonInputSchema>;
	trackEvent: z.infer<typeof TrackEventInputSchema>;
	unsubscribeDelivery: z.infer<typeof UnsubscribeDeliveryInputSchema>;
	reportPushEvents: z.infer<typeof ReportPushEventsInputSchema>;
	addPersonToGroup: z.infer<typeof AddPersonToGroupInputSchema>;
	sendBatch: z.infer<typeof SendBatchInputSchema>;
	trackPage: z.infer<typeof TrackPageInputSchema>;
	trackScreen: z.infer<typeof TrackScreenInputSchema>;
};

export type CustomerioEndpointOutputs = {
	triggerBroadcast: z.infer<typeof TriggerBroadcastResponseSchema>;
	getTriggers: z.infer<typeof GetTriggersResponseSchema>;
	getTrigger: z.infer<typeof GetTriggerResponseSchema>;
	getWebhooks: z.infer<typeof GetWebhooksResponseSchema>;
	getMessages: z.infer<typeof GetMessagesResponseSchema>;
	getSegments: z.infer<typeof GetSegmentsResponseSchema>;
	getSegmentDetails: z.infer<typeof GetSegmentDetailsResponseSchema>;
	getSegmentMembership: z.infer<typeof GetSegmentMembershipResponseSchema>;
	listCollections: z.infer<typeof ListCollectionsResponseSchema>;
	listIpAddresses: z.infer<typeof ListIpAddressesResponseSchema>;
	listNewsletters: z.infer<typeof ListNewslettersResponseSchema>;
	listSnippets: z.infer<typeof ListSnippetsResponseSchema>;
	listTransactionalMessages: z.infer<
		typeof ListTransactionalMessagesResponseSchema
	>;
	identifyPerson: z.infer<typeof TrackEmptyResponseSchema>;
	createAlias: z.infer<typeof TrackEmptyResponseSchema>;
	suppressPerson: z.infer<typeof TrackEmptyResponseSchema>;
	trackEvent: z.infer<typeof TrackEmptyResponseSchema>;
	unsubscribeDelivery: z.infer<typeof TrackEmptyResponseSchema>;
	reportPushEvents: z.infer<typeof TrackEmptyResponseSchema>;
	addPersonToGroup: z.infer<typeof TrackEmptyResponseSchema>;
	sendBatch: z.infer<typeof TrackEmptyResponseSchema>;
	trackPage: z.infer<typeof TrackEmptyResponseSchema>;
	trackScreen: z.infer<typeof TrackEmptyResponseSchema>;
};

export const CustomerioEndpointInputSchemas = {
	triggerBroadcast: TriggerBroadcastInputSchema,
	getTriggers: GetTriggersInputSchema,
	getTrigger: GetTriggerInputSchema,
	getWebhooks: GetWebhooksInputSchema,
	getMessages: GetMessagesInputSchema,
	getSegments: GetSegmentsInputSchema,
	getSegmentDetails: GetSegmentDetailsInputSchema,
	getSegmentMembership: GetSegmentMembershipInputSchema,
	listCollections: ListCollectionsInputSchema,
	listIpAddresses: ListIpAddressesInputSchema,
	listNewsletters: ListNewslettersInputSchema,
	listSnippets: ListSnippetsInputSchema,
	listTransactionalMessages: ListTransactionalMessagesInputSchema,
	identifyPerson: IdentifyPersonInputSchema,
	createAlias: CreateAliasInputSchema,
	suppressPerson: SuppressPersonInputSchema,
	trackEvent: TrackEventInputSchema,
	unsubscribeDelivery: UnsubscribeDeliveryInputSchema,
	reportPushEvents: ReportPushEventsInputSchema,
	addPersonToGroup: AddPersonToGroupInputSchema,
	sendBatch: SendBatchInputSchema,
	trackPage: TrackPageInputSchema,
	trackScreen: TrackScreenInputSchema,
} as const;

export const CustomerioEndpointOutputSchemas = {
	triggerBroadcast: TriggerBroadcastResponseSchema,
	getTriggers: GetTriggersResponseSchema,
	getTrigger: GetTriggerResponseSchema,
	getWebhooks: GetWebhooksResponseSchema,
	getMessages: GetMessagesResponseSchema,
	getSegments: GetSegmentsResponseSchema,
	getSegmentDetails: GetSegmentDetailsResponseSchema,
	getSegmentMembership: GetSegmentMembershipResponseSchema,
	listCollections: ListCollectionsResponseSchema,
	listIpAddresses: ListIpAddressesResponseSchema,
	listNewsletters: ListNewslettersResponseSchema,
	listSnippets: ListSnippetsResponseSchema,
	listTransactionalMessages: ListTransactionalMessagesResponseSchema,
	identifyPerson: TrackEmptyResponseSchema,
	createAlias: TrackEmptyResponseSchema,
	suppressPerson: TrackEmptyResponseSchema,
	trackEvent: TrackEmptyResponseSchema,
	unsubscribeDelivery: TrackEmptyResponseSchema,
	reportPushEvents: TrackEmptyResponseSchema,
	addPersonToGroup: TrackEmptyResponseSchema,
	sendBatch: TrackEmptyResponseSchema,
	trackPage: TrackEmptyResponseSchema,
	trackScreen: TrackEmptyResponseSchema,
} as const;

export type TriggerBroadcastInput =
	CustomerioEndpointInputs['triggerBroadcast'];
export type TriggerBroadcastResponse =
	CustomerioEndpointOutputs['triggerBroadcast'];
export type GetTriggersResponse = CustomerioEndpointOutputs['getTriggers'];
export type GetTriggerResponse = CustomerioEndpointOutputs['getTrigger'];
export type GetWebhooksResponse = CustomerioEndpointOutputs['getWebhooks'];
export type GetMessagesResponse = CustomerioEndpointOutputs['getMessages'];
export type GetSegmentsResponse = CustomerioEndpointOutputs['getSegments'];
export type GetSegmentDetailsResponse =
	CustomerioEndpointOutputs['getSegmentDetails'];
export type GetSegmentMembershipResponse =
	CustomerioEndpointOutputs['getSegmentMembership'];
export type ListCollectionsResponse =
	CustomerioEndpointOutputs['listCollections'];
export type ListIpAddressesResponse =
	CustomerioEndpointOutputs['listIpAddresses'];
export type ListNewslettersResponse =
	CustomerioEndpointOutputs['listNewsletters'];
export type ListSnippetsResponse = CustomerioEndpointOutputs['listSnippets'];
export type ListTransactionalMessagesResponse =
	CustomerioEndpointOutputs['listTransactionalMessages'];

// NOTE: GET /v1/integrations does not exist in the App, Track or CDP APIs
// (verified September 2026 against docs.customer.io and the published
// OpenAPI specs). It is intentionally omitted rather than guessed.
