import { z } from 'zod';

// Generated from Svix OpenAPI 1.960.0 at svix-webhooks commit 5103d75d.
// Svix leaves payloads, transformation parameters, MCP arguments, imported
// OpenAPI documents, event schemas, and EmptyResponse properties open-ended.
// Their contents are caller/provider-defined, so a fixed value schema would
// reject valid data. This shared record preserves Svix's additionalProperties.
const OpenEndedObjectSchema = z.record(z.string(), z.unknown());

export const ApplicationInSchema = z
	.object({
		name: z.string().min(1).max(512),
		throttleRate: z.number().int().min(1).max(65535).nullable().optional(),
		uid: z
			.string()
			.min(1)
			.max(256)
			.regex(new RegExp('^[a-zA-Z0-9\\-_.]+$'))
			.nullable()
			.optional(),
		metadata: z.record(z.string(), z.string()).optional(),
	})
	.passthrough();
export const ApplicationOutSchema = z
	.object({
		uid: z
			.string()
			.min(1)
			.max(256)
			.regex(new RegExp('^[a-zA-Z0-9\\-_.]+$'))
			.nullable()
			.optional(),
		name: z.string(),
		throttleRate: z.number().int().min(0).max(65535).nullable().optional(),
		id: z.string().min(31).max(31).regex(new RegExp('^app_[A-Za-z0-9]{27}$')),
		createdAt: z.string(),
		updatedAt: z.string(),
		metadata: z.record(z.string(), z.string()),
	})
	.passthrough();
export const ApplicationPatchSchema = z
	.object({
		name: z.string().min(1).max(512).optional(),
		throttleRate: z.number().int().min(0).max(65535).nullable().optional(),
		uid: z
			.string()
			.min(1)
			.max(256)
			.regex(new RegExp('^[a-zA-Z0-9\\-_.]+$'))
			.nullable()
			.optional(),
		metadata: z.record(z.string(), z.string()).optional(),
	})
	.passthrough();
export const ArchiveStatusSchema = z.enum(['active', 'archived', 'all']);
export const BackgroundTaskStatusSchema = z.enum([
	'running',
	'finished',
	'failed',
]);
export const BackgroundTaskTypeSchema = z.enum([
	'endpoint.replay',
	'endpoint.recover',
	'application.stats',
	'message.broadcast',
	'sdk.generate',
	'event-type.aggregate',
	'application.purge_content',
	'endpoint.bulk-replay',
]);
export const BatchMessageInSchema = z
	.object({
		eventId: z
			.string()
			.min(1)
			.max(256)
			.regex(new RegExp('^[a-zA-Z0-9\\-_.]+$'))
			.nullable()
			.optional(),
		eventType: z.string().max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		payload: OpenEndedObjectSchema,
		channels: z
			.array(z.string().max(128).regex(new RegExp('^[a-zA-Z0-9\\-_.:+]+$')))
			.min(1)
			.max(10)
			.nullable()
			.optional(),
		tags: z
			.array(z.string().max(128).regex(new RegExp('^[a-zA-Z0-9\\-_./\\\\#]+$')))
			.min(1)
			.max(5)
			.nullable()
			.optional(),
		transformationsParams: OpenEndedObjectSchema.nullable().optional(),
		deliverAt: z.string().nullable().optional(),
		payloadRetentionPeriod: z
			.number()
			.int()
			.min(1)
			.max(90)
			.nullable()
			.optional(),
		payloadRetentionHours: z
			.number()
			.int()
			.min(1)
			.max(2160)
			.nullable()
			.optional(),
	})
	.passthrough();
export const BatchCreateMessagesInSchema = z
	.object({ messages: z.array(BatchMessageInSchema).min(1).max(50) })
	.passthrough();
export const BulkExpungeContentsInSchema = z
	.object({
		ids: z
			.array(
				z.string().min(1).max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
			)
			.optional(),
	})
	.passthrough();
export const BulkExpungeStatusSchema = z.enum(['expunged', 'not-found']);
export const BulkExpungeContentsOutSchema = z
	.object({ results: z.record(z.string(), BulkExpungeStatusSchema) })
	.passthrough();
export const MessageStatusSchema = z.union([
	z.literal(0),
	z.literal(1),
	z.literal(2),
	z.literal(3),
	z.literal(4),
]);
export const StatusCodeClassSchema = z.union([
	z.literal(0),
	z.literal(100),
	z.literal(200),
	z.literal(300),
	z.literal(400),
	z.literal(500),
]);
export const BulkReplayInSchema = z
	.object({
		since: z.string(),
		until: z.string().nullable().optional(),
		eventTypes: z
			.array(z.string().max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')))
			.nullable()
			.optional(),
		channel: z
			.string()
			.max(128)
			.regex(new RegExp('^[a-zA-Z0-9\\-_.:+]+$'))
			.nullable()
			.optional(),
		tag: z
			.string()
			.max(128)
			.regex(new RegExp('^[a-zA-Z0-9\\-_./\\\\#]+$'))
			.nullable()
			.optional(),
		status: MessageStatusSchema.nullable().optional(),
		statusCodeClass: StatusCodeClassSchema.nullable().optional(),
	})
	.passthrough();
export const EmptyResponseSchema = OpenEndedObjectSchema;
export const EndpointAttemptStatsSchema = z
	.object({
		success: z.number().int().min(0),
		fail: z.number().int().min(0),
		canceled: z.number().int().min(0),
	})
	.passthrough();
export const EndpointChallengeModeSchema = z.enum([
	'challenge-response',
	'echo',
]);
export const EndpointHeadersInSchema = z
	.object({ headers: z.record(z.string(), z.string()) })
	.passthrough();
export const EndpointHeadersOutSchema = z
	.object({
		headers: z.record(z.string(), z.string()),
		sensitive: z.array(z.string()),
	})
	.passthrough();
export const EndpointHeadersPatchInSchema = z
	.object({
		headers: z.record(z.string(), z.string().nullable()),
		deleteHeaders: z.array(z.string()).optional(),
	})
	.passthrough();
export const EndpointInSchema = z
	.object({
		url: z.string().min(1).max(65536),
		description: z.string().max(4096).optional(),
		throttleRate: z.number().int().min(1).max(65535).nullable().optional(),
		uid: z
			.string()
			.min(1)
			.max(256)
			.regex(new RegExp('^[a-zA-Z0-9\\-_.]+$'))
			.nullable()
			.optional(),
		disabled: z.boolean().optional(),
		eventTypes: z
			.array(z.string().max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')))
			.min(1)
			.nullable()
			.optional(),
		channels: z
			.array(z.string().max(128).regex(new RegExp('^[a-zA-Z0-9\\-_.:+]+$')))
			.min(1)
			.max(10)
			.nullable()
			.optional(),
		secret: z
			.string()
			.regex(
				new RegExp(
					'^(whsec_|whsk_|whsk1_|whpk_|whpk1_)?[a-zA-Z0-9+/=]{32,100}$',
				),
			)
			.nullable()
			.optional(),
		metadata: z.record(z.string(), z.string()).optional(),
		headers: z.record(z.string(), z.string()).nullable().optional(),
	})
	.passthrough();
export const MessageStatusTextSchema = z.enum([
	'success',
	'pending',
	'fail',
	'sending',
	'canceled',
]);
export const EndpointMessageOutSchema = z
	.object({
		status: MessageStatusSchema,
		statusText: MessageStatusTextSchema,
		nextAttempt: z.string().nullable().optional(),
		eventId: z
			.string()
			.min(1)
			.max(256)
			.regex(new RegExp('^[a-zA-Z0-9\\-_.]+$'))
			.nullable()
			.optional(),
		eventType: z.string().max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		payload: OpenEndedObjectSchema,
		channels: z
			.array(z.string().max(128).regex(new RegExp('^[a-zA-Z0-9\\-_.:+]+$')))
			.min(1)
			.max(10)
			.nullable()
			.optional(),
		id: z.string().min(31).max(31).regex(new RegExp('^msg_[A-Za-z0-9]{27}$')),
		timestamp: z.string(),
		tags: z
			.array(z.string().max(128).regex(new RegExp('^[a-zA-Z0-9\\-_./\\\\#]+$')))
			.nullable()
			.optional(),
		deliverAt: z.string().nullable().optional(),
	})
	.passthrough();
export const EndpointOutSchema = z
	.object({
		id: z.string().min(30).max(30).regex(new RegExp('^ep_[A-Za-z0-9]{27}$')),
		metadata: z.record(z.string(), z.string()),
		url: z.string().min(1).max(65536),
		description: z.string(),
		throttleRate: z.number().int().min(0).max(65535).nullable().optional(),
		uid: z
			.string()
			.min(1)
			.max(256)
			.regex(new RegExp('^[a-zA-Z0-9\\-_.]+$'))
			.nullable()
			.optional(),
		disabled: z.boolean().optional(),
		eventTypes: z
			.array(z.string().max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')))
			.min(1)
			.nullable()
			.optional(),
		channels: z
			.array(z.string().max(128).regex(new RegExp('^[a-zA-Z0-9\\-_.:+]+$')))
			.min(1)
			.max(10)
			.nullable()
			.optional(),
		createdAt: z.string(),
		updatedAt: z.string(),
		expiry: z.string().nullable().optional(),
	})
	.passthrough();
export const EndpointPatchSchema = z
	.object({
		description: z.string().max(4096).optional(),
		throttleRate: z.number().int().min(0).max(65535).nullable().optional(),
		uid: z
			.string()
			.min(1)
			.max(256)
			.regex(new RegExp('^[a-zA-Z0-9\\-_.]+$'))
			.nullable()
			.optional(),
		url: z.string().optional(),
		disabled: z.boolean().optional(),
		eventTypes: z
			.array(z.string().max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')))
			.min(1)
			.nullable()
			.optional(),
		channels: z
			.array(z.string().max(128).regex(new RegExp('^[a-zA-Z0-9\\-_.:+]+$')))
			.min(1)
			.max(10)
			.nullable()
			.optional(),
		metadata: z.record(z.string(), z.string()).optional(),
	})
	.passthrough();
export const EndpointSecretOutSchema = z
	.object({
		key: z
			.string()
			.regex(
				new RegExp(
					'^(whsec_|whsk_|whsk1_|whpk_|whpk1_)?[a-zA-Z0-9+/=]{32,100}$',
				),
			),
	})
	.passthrough();
export const EndpointSecretRotateInSchema = z
	.object({
		key: z
			.string()
			.regex(
				new RegExp(
					'^(whsec_|whsk_|whsk1_|whpk_|whpk1_)?[a-zA-Z0-9+/=]{32,100}$',
				),
			)
			.nullable()
			.optional(),
		gracePeriodSeconds: z
			.number()
			.int()
			.min(0)
			.max(604800)
			.nullable()
			.optional(),
	})
	.passthrough();
export const EndpointStatsSchema = z
	.object({
		success: z.number().int(),
		pending: z.number().int(),
		sending: z.number().int(),
		fail: z.number().int(),
		canceled: z.number().int(),
	})
	.passthrough();
export const EndpointTransformationOutSchema = z
	.object({
		code: z.string().min(10).max(51200).nullable().optional(),
		enabled: z.boolean().optional(),
		variables: z.record(z.string(), z.string()).nullable().optional(),
		updatedAt: z.string().nullable().optional(),
	})
	.passthrough();
export const EndpointTransformationPatchSchema = z
	.object({
		code: z.string().min(10).max(51200).nullable().optional(),
		enabled: z.boolean().optional(),
		variables: z.record(z.string(), z.string()).nullable().optional(),
	})
	.passthrough();
export const EndpointUpsertInSchema = z
	.object({
		url: z.string().min(1).max(65536),
		description: z.string().max(4096).optional(),
		throttleRate: z.number().int().min(1).max(65535).nullable().optional(),
		uid: z
			.string()
			.min(1)
			.max(256)
			.regex(new RegExp('^[a-zA-Z0-9\\-_.]+$'))
			.nullable()
			.optional(),
		disabled: z.boolean().optional(),
		eventTypes: z
			.array(z.string().max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')))
			.min(1)
			.nullable()
			.optional(),
		channels: z
			.array(z.string().max(128).regex(new RegExp('^[a-zA-Z0-9\\-_.:+]+$')))
			.min(1)
			.max(10)
			.nullable()
			.optional(),
		metadata: z.record(z.string(), z.string()).optional(),
	})
	.passthrough();
export const EventExampleInSchema = z
	.object({
		eventType: z.string().max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		exampleIndex: z.number().int().min(0).optional(),
		payload: OpenEndedObjectSchema.nullable().optional(),
	})
	.passthrough();
export const EventTypeFromOpenApiSchema = z
	.object({
		name: z.string().max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		description: z.string(),
		schemas: OpenEndedObjectSchema.nullable().optional(),
		deprecated: z.boolean(),
		groupName: z
			.string()
			.max(256)
			.regex(new RegExp('^[a-zA-Z0-9\\-_.]+$'))
			.nullable()
			.optional(),
		featureFlags: z
			.array(z.string().max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')))
			.nullable()
			.optional(),
	})
	.passthrough();
export const EventTypeImportOpenApiInSchema = z
	.object({
		dryRun: z.boolean().optional(),
		replaceAll: z.boolean().optional(),
		spec: OpenEndedObjectSchema.nullable().optional(),
		specRaw: z.string().nullable().optional(),
	})
	.passthrough();
export const EventTypeImportOpenApiOutDataSchema = z
	.object({
		modified: z.array(
			z.string().max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		),
		to_modify: z.array(EventTypeFromOpenApiSchema).nullable().optional(),
	})
	.passthrough();
export const EventTypeImportOpenApiOutSchema = z
	.object({ data: EventTypeImportOpenApiOutDataSchema })
	.passthrough();
export const EventTypeInSchema = z
	.object({
		name: z.string().max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		description: z.string().max(4096),
		descriptionTranslations: z
			.record(z.string(), z.string())
			.nullable()
			.optional(),
		archived: z.boolean().optional(),
		deprecated: z.boolean().optional(),
		schemas: OpenEndedObjectSchema.nullable().optional(),
		groupName: z
			.string()
			.max(256)
			.regex(new RegExp('^[a-zA-Z0-9\\-_.]+$'))
			.nullable()
			.optional(),
		featureFlags: z
			.array(z.string().max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')))
			.min(1)
			.nullable()
			.optional(),
	})
	.passthrough();
export const EventTypeOutSchema = z
	.object({
		name: z.string().max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		description: z.string(),
		descriptionTranslations: z
			.record(z.string(), z.string())
			.nullable()
			.optional(),
		archived: z.boolean().optional(),
		deprecated: z.boolean(),
		schemas: OpenEndedObjectSchema.nullable().optional(),
		createdAt: z.string(),
		updatedAt: z.string(),
		groupName: z
			.string()
			.max(256)
			.regex(new RegExp('^[a-zA-Z0-9\\-_.]+$'))
			.nullable()
			.optional(),
		featureFlags: z
			.array(z.string().max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')))
			.nullable()
			.optional(),
		featureFlag: z
			.string()
			.max(256)
			.regex(new RegExp('^[a-zA-Z0-9\\-_.]+$'))
			.nullable()
			.optional(),
	})
	.passthrough();
export const EventTypePatchSchema = z
	.object({
		description: z.string().max(4096).optional(),
		descriptionTranslations: z
			.record(z.string(), z.string())
			.nullable()
			.optional(),
		archived: z.boolean().optional(),
		deprecated: z.boolean().optional(),
		schemas: OpenEndedObjectSchema.nullable().optional(),
		featureFlags: z
			.array(z.string().max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')))
			.min(1)
			.nullable()
			.optional(),
		groupName: z
			.string()
			.max(256)
			.regex(new RegExp('^[a-zA-Z0-9\\-_.]+$'))
			.nullable()
			.optional(),
	})
	.passthrough();
export const EventTypeUpsertInSchema = z
	.object({
		description: z.string().max(4096),
		descriptionTranslations: z
			.record(z.string(), z.string())
			.nullable()
			.optional(),
		archived: z.boolean().optional(),
		deprecated: z.boolean().optional(),
		schemas: OpenEndedObjectSchema.nullable().optional(),
		featureFlags: z
			.array(z.string().max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')))
			.min(1)
			.nullable()
			.optional(),
		groupName: z
			.string()
			.max(256)
			.regex(new RegExp('^[a-zA-Z0-9\\-_.]+$'))
			.nullable()
			.optional(),
	})
	.passthrough();
export const ExpungeAllContentsOutSchema = z
	.object({
		id: z.string().min(33).max(33).regex(new RegExp('^qtask_[A-Za-z0-9]{27}$')),
		status: BackgroundTaskStatusSchema,
		task: BackgroundTaskTypeSchema,
		updatedAt: z.string(),
	})
	.passthrough();
export const ListResponse_ApplicationOut_Schema = z
	.object({
		data: z.array(ApplicationOutSchema),
		iterator: z.string().nullable(),
		prevIterator: z.string().nullable().optional(),
		done: z.boolean(),
	})
	.passthrough();
export const ListResponse_EndpointMessageOut_Schema = z
	.object({
		data: z.array(EndpointMessageOutSchema),
		iterator: z.string().nullable(),
		prevIterator: z.string().nullable().optional(),
		done: z.boolean(),
	})
	.passthrough();
export const ListResponse_EndpointOut_Schema = z
	.object({
		data: z.array(EndpointOutSchema),
		iterator: z.string().nullable(),
		prevIterator: z.string().nullable().optional(),
		done: z.boolean(),
	})
	.passthrough();
export const ListResponse_EventTypeOut_Schema = z
	.object({
		data: z.array(EventTypeOutSchema),
		iterator: z.string().nullable(),
		prevIterator: z.string().nullable().optional(),
		done: z.boolean(),
	})
	.passthrough();
export const MessageAttemptTriggerTypeSchema = z.union([
	z.literal(0),
	z.literal(1),
]);
export const MessageOutSchema = z
	.object({
		eventId: z
			.string()
			.min(1)
			.max(256)
			.regex(new RegExp('^[a-zA-Z0-9\\-_.]+$'))
			.nullable()
			.optional(),
		eventType: z.string().max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		payload: OpenEndedObjectSchema,
		channels: z
			.array(z.string().max(128).regex(new RegExp('^[a-zA-Z0-9\\-_.:+]+$')))
			.min(1)
			.max(10)
			.nullable()
			.optional(),
		id: z.string().min(31).max(31).regex(new RegExp('^msg_[A-Za-z0-9]{27}$')),
		timestamp: z.string(),
		tags: z
			.array(z.string().max(128).regex(new RegExp('^[a-zA-Z0-9\\-_./\\\\#]+$')))
			.nullable()
			.optional(),
		deliverAt: z.string().nullable().optional(),
	})
	.passthrough();
export const MessageAttemptOutSchema = z
	.object({
		url: z.string().min(1).max(65536),
		response: z.string(),
		responseStatusCode: z.number().int().min(-32768).max(32767),
		responseDurationMs: z.number().int(),
		status: MessageStatusSchema,
		statusText: MessageStatusTextSchema,
		triggerType: MessageAttemptTriggerTypeSchema,
		msgId: z
			.string()
			.min(31)
			.max(31)
			.regex(new RegExp('^msg_[A-Za-z0-9]{27}$')),
		endpointId: z
			.string()
			.min(30)
			.max(30)
			.regex(new RegExp('^ep_[A-Za-z0-9]{27}$')),
		id: z.string().min(33).max(33).regex(new RegExp('^atmpt_[A-Za-z0-9]{27}$')),
		timestamp: z.string(),
		msg: MessageOutSchema.nullable().optional(),
	})
	.passthrough();
export const ListResponse_MessageAttemptOut_Schema = z
	.object({
		data: z.array(MessageAttemptOutSchema),
		iterator: z.string().nullable(),
		prevIterator: z.string().nullable().optional(),
		done: z.boolean(),
	})
	.passthrough();
export const MessageEndpointOutSchema = z
	.object({
		id: z.string().min(30).max(30).regex(new RegExp('^ep_[A-Za-z0-9]{27}$')),
		status: MessageStatusSchema,
		statusText: MessageStatusTextSchema,
		nextAttempt: z.string().nullable().optional(),
		url: z.string().min(1).max(65536),
		description: z.string(),
		throttleRate: z.number().int().min(0).max(65535).nullable().optional(),
		uid: z
			.string()
			.min(1)
			.max(256)
			.regex(new RegExp('^[a-zA-Z0-9\\-_.]+$'))
			.nullable()
			.optional(),
		disabled: z.boolean().optional(),
		eventTypes: z
			.array(z.string().max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')))
			.min(1)
			.nullable()
			.optional(),
		channels: z
			.array(z.string().max(128).regex(new RegExp('^[a-zA-Z0-9\\-_.:+]+$')))
			.min(1)
			.max(10)
			.nullable()
			.optional(),
		createdAt: z.string(),
		updatedAt: z.string(),
		expiry: z.string().nullable().optional(),
	})
	.passthrough();
export const ListResponse_MessageEndpointOut_Schema = z
	.object({
		data: z.array(MessageEndpointOutSchema),
		iterator: z.string().nullable(),
		prevIterator: z.string().nullable().optional(),
		done: z.boolean(),
	})
	.passthrough();
export const ListResponse_MessageOut_Schema = z
	.object({
		data: z.array(MessageOutSchema),
		iterator: z.string().nullable(),
		prevIterator: z.string().nullable().optional(),
		done: z.boolean(),
	})
	.passthrough();
export const OperationalWebhookEndpointOutSchema = z
	.object({
		id: z.string().min(30).max(30).regex(new RegExp('^ep_[A-Za-z0-9]{27}$')),
		url: z.string().min(1).max(65536),
		description: z.string(),
		throttleRate: z.number().int().min(0).max(65535).nullable().optional(),
		uid: z
			.string()
			.min(1)
			.max(256)
			.regex(new RegExp('^[a-zA-Z0-9\\-_.]+$'))
			.nullable()
			.optional(),
		disabled: z.boolean().optional(),
		eventTypes: z
			.array(z.string().max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')))
			.min(1)
			.nullable()
			.optional(),
		createdAt: z.string(),
		updatedAt: z.string(),
		metadata: z.record(z.string(), z.string()),
	})
	.passthrough();
export const ListResponse_OperationalWebhookEndpointOut_Schema = z
	.object({
		data: z.array(OperationalWebhookEndpointOutSchema),
		iterator: z.string().nullable(),
		prevIterator: z.string().nullable().optional(),
		done: z.boolean(),
	})
	.passthrough();
export const McpEventsDeliveryModeSchema = z.literal('webhook');
export const McpEventsSubscribeDeliveryInSchema = z
	.object({
		mode: McpEventsDeliveryModeSchema,
		url: z.string().min(1).max(4096),
		secret: z
			.string()
			.regex(
				new RegExp(
					'^(whsec_|whsk_|whsk1_|whpk_|whpk1_)?[a-zA-Z0-9+/=]{32,100}$',
				),
			),
	})
	.passthrough();
export const McpEventsSubscribeInSchema = z
	.object({
		name: z.string().max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		arguments: OpenEndedObjectSchema.optional(),
		delivery: McpEventsSubscribeDeliveryInSchema,
		ttlMs: z.number().int().min(0).nullable().optional(),
		secretGracePeriodSeconds: z
			.number()
			.int()
			.min(0)
			.max(604800)
			.nullable()
			.optional(),
		challengeMode: EndpointChallengeModeSchema.optional(),
		channels: z
			.array(z.string().max(128).regex(new RegExp('^[a-zA-Z0-9\\-_.:+]+$')))
			.min(1)
			.max(10)
			.nullable()
			.optional(),
	})
	.passthrough();
export const McpEventsSubscribeOutSchema = z
	.object({
		id: z.string().min(1).max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		endpointId: z
			.string()
			.min(30)
			.max(30)
			.regex(new RegExp('^ep_[A-Za-z0-9]{27}$')),
		refreshBefore: z.string().nullable().optional(),
		cursor: z.string().nullable().optional(),
		truncated: z.boolean(),
	})
	.passthrough();
export const McpEventsUnsubscribeDeliveryInSchema = z
	.object({
		mode: McpEventsDeliveryModeSchema,
		url: z.string().min(1).max(4096),
	})
	.passthrough();
export const McpEventsUnsubscribeInSchema = z
	.object({
		name: z.string().max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		arguments: OpenEndedObjectSchema.optional(),
		delivery: McpEventsUnsubscribeDeliveryInSchema,
	})
	.passthrough();
export const MessageInSchema = z
	.object({
		eventId: z
			.string()
			.min(1)
			.max(256)
			.regex(new RegExp('^[a-zA-Z0-9\\-_.]+$'))
			.nullable()
			.optional(),
		eventType: z.string().max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		payload: OpenEndedObjectSchema,
		channels: z
			.array(z.string().max(128).regex(new RegExp('^[a-zA-Z0-9\\-_.:+]+$')))
			.min(1)
			.max(10)
			.nullable()
			.optional(),
		application: ApplicationInSchema.nullable().optional(),
		tags: z
			.array(z.string().max(128).regex(new RegExp('^[a-zA-Z0-9\\-_./\\\\#]+$')))
			.min(1)
			.max(5)
			.nullable()
			.optional(),
		transformationsParams: OpenEndedObjectSchema.nullable().optional(),
		deliverAt: z.string().nullable().optional(),
		payloadRetentionPeriod: z
			.number()
			.int()
			.min(1)
			.max(90)
			.nullable()
			.optional(),
		payloadRetentionHours: z
			.number()
			.int()
			.min(1)
			.max(2160)
			.nullable()
			.optional(),
	})
	.passthrough();
export const MessagePrecheckInSchema = z
	.object({
		eventType: z.string().max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		channels: z
			.array(z.string().max(128).regex(new RegExp('^[a-zA-Z0-9\\-_.:+]+$')))
			.min(1)
			.max(10)
			.nullable()
			.optional(),
	})
	.passthrough();
export const MessagePrecheckOutSchema = z
	.object({ active: z.boolean() })
	.passthrough();
export const OperationalWebhookEndpointHeadersInSchema = z
	.object({ headers: z.record(z.string(), z.string()) })
	.passthrough();
export const OperationalWebhookEndpointHeadersOutSchema = z
	.object({
		headers: z.record(z.string(), z.string()),
		sensitive: z.array(z.string()),
	})
	.passthrough();
export const OperationalWebhookEndpointInSchema = z
	.object({
		url: z.string().min(1).max(65536),
		description: z.string().max(4096).optional(),
		throttleRate: z.number().int().min(1).max(65535).nullable().optional(),
		uid: z
			.string()
			.min(1)
			.max(256)
			.regex(new RegExp('^[a-zA-Z0-9\\-_.]+$'))
			.nullable()
			.optional(),
		disabled: z.boolean().optional(),
		eventTypes: z
			.array(z.string().max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')))
			.min(1)
			.nullable()
			.optional(),
		secret: z
			.string()
			.regex(
				new RegExp(
					'^(whsec_|whsk_|whsk1_|whpk_|whpk1_)?[a-zA-Z0-9+/=]{32,100}$',
				),
			)
			.nullable()
			.optional(),
		metadata: z.record(z.string(), z.string()).optional(),
		headers: z.record(z.string(), z.string()).nullable().optional(),
	})
	.passthrough();
export const OperationalWebhookEndpointSecretInSchema = z
	.object({
		key: z
			.string()
			.regex(
				new RegExp(
					'^(whsec_|whsk_|whsk1_|whpk_|whpk1_)?[a-zA-Z0-9+/=]{32,100}$',
				),
			)
			.nullable()
			.optional(),
		gracePeriodSeconds: z
			.number()
			.int()
			.min(0)
			.max(604800)
			.nullable()
			.optional(),
	})
	.passthrough();
export const OperationalWebhookEndpointSecretOutSchema = z
	.object({
		key: z
			.string()
			.regex(
				new RegExp(
					'^(whsec_|whsk_|whsk1_|whpk_|whpk1_)?[a-zA-Z0-9+/=]{32,100}$',
				),
			),
	})
	.passthrough();
export const OperationalWebhookEndpointUpsertInSchema = z
	.object({
		url: z.string().min(1).max(65536),
		description: z.string().max(4096).optional(),
		throttleRate: z.number().int().min(1).max(65535).nullable().optional(),
		uid: z
			.string()
			.min(1)
			.max(256)
			.regex(new RegExp('^[a-zA-Z0-9\\-_.]+$'))
			.nullable()
			.optional(),
		disabled: z.boolean().optional(),
		eventTypes: z
			.array(z.string().max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')))
			.min(1)
			.nullable()
			.optional(),
		metadata: z.record(z.string(), z.string()).optional(),
	})
	.passthrough();
export const OrderingSchema = z.enum(['ascending', 'descending']);
export const PollingEndpointConsumerSeekInSchema = z
	.object({ after: z.string() })
	.passthrough();
export const PollingEndpointConsumerSeekOutSchema = z
	.object({ iterator: z.string() })
	.passthrough();
export const PollingEndpointMessageOutSchema = z
	.object({
		headers: z.record(z.string(), z.string()).nullable().optional(),
		eventId: z
			.string()
			.min(1)
			.max(256)
			.regex(new RegExp('^[a-zA-Z0-9\\-_.]+$'))
			.nullable()
			.optional(),
		eventType: z.string().max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		payload: OpenEndedObjectSchema,
		channels: z
			.array(z.string().max(128).regex(new RegExp('^[a-zA-Z0-9\\-_.:+]+$')))
			.min(1)
			.max(10)
			.nullable()
			.optional(),
		id: z.string().min(31).max(31).regex(new RegExp('^msg_[A-Za-z0-9]{27}$')),
		timestamp: z.string(),
		tags: z
			.array(z.string().max(128).regex(new RegExp('^[a-zA-Z0-9\\-_./\\\\#]+$')))
			.nullable()
			.optional(),
		deliverAt: z.string().nullable().optional(),
	})
	.passthrough();
export const PollingEndpointOutSchema = z
	.object({
		data: z.array(PollingEndpointMessageOutSchema),
		iterator: z.string(),
		done: z.boolean(),
	})
	.passthrough();
export const RecoverInSchema = z
	.object({ since: z.string(), until: z.string().nullable().optional() })
	.passthrough();
export const RecoverOutSchema = z
	.object({
		id: z.string().min(33).max(33).regex(new RegExp('^qtask_[A-Za-z0-9]{27}$')),
		status: BackgroundTaskStatusSchema,
		task: BackgroundTaskTypeSchema,
		updatedAt: z.string(),
	})
	.passthrough();
export const ReplayInSchema = z
	.object({ since: z.string(), until: z.string().nullable().optional() })
	.passthrough();
export const ReplayOutSchema = z
	.object({
		id: z.string().min(33).max(33).regex(new RegExp('^qtask_[A-Za-z0-9]{27}$')),
		status: BackgroundTaskStatusSchema,
		task: BackgroundTaskTypeSchema,
		updatedAt: z.string(),
	})
	.passthrough();

const pathSegment = z
	.string()
	.min(1)
	.refine(
		(value) => value !== '.' && value !== '..' && !/[\\/"'?#]/.test(value),
		'Invalid path segment',
	);

export const SvixEndpointInputSchemas = {
	applicationsList: z.object({
		exclude_apps_with_no_endpoints: z.boolean().optional(),
		exclude_apps_with_disabled_endpoints: z.boolean().optional(),
		exclude_apps_with_svix_play_endpoints: z.boolean().optional(),
		limit: z.number().int().min(1).max(250).optional(),
		iterator: z
			.string()
			.min(31)
			.max(31)
			.regex(new RegExp('^app_[A-Za-z0-9]{27}$'))
			.nullable()
			.optional(),
		order: OrderingSchema.nullable().optional(),
	}),
	applicationsCreate: z.object({
		get_if_exists: z.boolean().optional(),
		idempotencyKey: z
			.string()
			.min(1)
			.refine((v) => !v.startsWith('auto_'), 'Reserved idempotency key')
			.optional(),
		body: ApplicationInSchema,
	}),
	applicationsGet: z.object({
		app_id: pathSegment.and(
			z.string().min(1).max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		),
	}),
	applicationsUpsert: z.object({
		app_id: pathSegment.and(
			z.string().min(1).max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		),
		body: ApplicationInSchema,
	}),
	applicationsDelete: z.object({
		app_id: pathSegment.and(
			z.string().min(1).max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		),
	}),
	applicationsPatch: z.object({
		app_id: pathSegment.and(
			z.string().min(1).max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		),
		body: ApplicationPatchSchema,
	}),
	endpointsList: z.object({
		app_id: pathSegment.and(
			z.string().min(1).max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		),
		limit: z.number().int().min(1).max(250).optional(),
		iterator: z
			.string()
			.min(30)
			.max(30)
			.regex(new RegExp('^ep_[A-Za-z0-9]{27}$'))
			.nullable()
			.optional(),
		order: OrderingSchema.nullable().optional(),
	}),
	endpointsCreate: z.object({
		app_id: pathSegment.and(
			z.string().min(1).max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		),
		idempotencyKey: z
			.string()
			.min(1)
			.refine((v) => !v.startsWith('auto_'), 'Reserved idempotency key')
			.optional(),
		body: EndpointInSchema,
	}),
	endpointsGet: z.object({
		app_id: pathSegment.and(
			z.string().min(1).max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		),
		endpoint_id: pathSegment.and(
			z.string().min(1).max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		),
	}),
	endpointsUpsert: z.object({
		app_id: pathSegment.and(
			z.string().min(1).max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		),
		endpoint_id: pathSegment.and(
			z.string().min(1).max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		),
		body: EndpointUpsertInSchema,
	}),
	endpointsDelete: z.object({
		app_id: pathSegment.and(
			z.string().min(1).max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		),
		endpoint_id: pathSegment.and(
			z.string().min(1).max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		),
	}),
	endpointsPatch: z.object({
		app_id: pathSegment.and(
			z.string().min(1).max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		),
		endpoint_id: pathSegment.and(
			z.string().min(1).max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		),
		body: EndpointPatchSchema,
	}),
	endpointsMcpEventsSubscribe: z.object({
		app_id: pathSegment.and(
			z.string().min(1).max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		),
		idempotencyKey: z
			.string()
			.min(1)
			.refine((v) => !v.startsWith('auto_'), 'Reserved idempotency key')
			.optional(),
		body: McpEventsSubscribeInSchema,
	}),
	endpointsMcpEventsUnsubscribe: z.object({
		app_id: pathSegment.and(
			z.string().min(1).max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		),
		idempotencyKey: z
			.string()
			.min(1)
			.refine((v) => !v.startsWith('auto_'), 'Reserved idempotency key')
			.optional(),
		body: McpEventsUnsubscribeInSchema,
	}),
	endpointsGetSecret: z.object({
		app_id: pathSegment.and(
			z.string().min(1).max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		),
		endpoint_id: pathSegment.and(
			z.string().min(1).max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		),
	}),
	endpointsRotateSecret: z.object({
		app_id: pathSegment.and(
			z.string().min(1).max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		),
		endpoint_id: pathSegment.and(
			z.string().min(1).max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		),
		idempotencyKey: z
			.string()
			.min(1)
			.refine((v) => !v.startsWith('auto_'), 'Reserved idempotency key')
			.optional(),
		body: EndpointSecretRotateInSchema,
	}),
	endpointsGetHeaders: z.object({
		app_id: pathSegment.and(
			z.string().min(1).max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		),
		endpoint_id: pathSegment.and(
			z.string().min(1).max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		),
	}),
	endpointsSetHeaders: z.object({
		app_id: pathSegment.and(
			z.string().min(1).max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		),
		endpoint_id: pathSegment.and(
			z.string().min(1).max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		),
		body: EndpointHeadersInSchema,
	}),
	endpointsPatchHeaders: z.object({
		app_id: pathSegment.and(
			z.string().min(1).max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		),
		endpoint_id: pathSegment.and(
			z.string().min(1).max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		),
		body: EndpointHeadersPatchInSchema,
	}),
	endpointsTransformationGet: z.object({
		app_id: pathSegment.and(
			z.string().min(1).max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		),
		endpoint_id: pathSegment.and(
			z.string().min(1).max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		),
	}),
	endpointsTransformationPatch: z.object({
		app_id: pathSegment.and(
			z.string().min(1).max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		),
		endpoint_id: pathSegment.and(
			z.string().min(1).max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		),
		body: EndpointTransformationPatchSchema,
	}),
	endpointsReplayMissing: z.object({
		app_id: pathSegment.and(
			z.string().min(1).max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		),
		endpoint_id: pathSegment.and(
			z.string().min(1).max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		),
		idempotencyKey: z
			.string()
			.min(1)
			.refine((v) => !v.startsWith('auto_'), 'Reserved idempotency key')
			.optional(),
		body: ReplayInSchema,
	}),
	endpointsBulkReplay: z.object({
		app_id: pathSegment.and(
			z.string().min(1).max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		),
		endpoint_id: pathSegment.and(
			z.string().min(1).max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		),
		idempotencyKey: z
			.string()
			.min(1)
			.refine((v) => !v.startsWith('auto_'), 'Reserved idempotency key')
			.optional(),
		body: BulkReplayInSchema,
	}),
	endpointsGetStats: z.object({
		app_id: pathSegment.and(
			z.string().min(1).max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		),
		endpoint_id: pathSegment.and(
			z.string().min(1).max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		),
		since: z.string().nullable().optional(),
		until: z.string().nullable().optional(),
	}),
	endpointsGetAttemptStats: z.object({
		app_id: pathSegment.and(
			z.string().min(1).max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		),
		endpoint_id: pathSegment.and(
			z.string().min(1).max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		),
		since: z.string().nullable().optional(),
		until: z.string().nullable().optional(),
	}),
	endpointsRecover: z.object({
		app_id: pathSegment.and(
			z.string().min(1).max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		),
		endpoint_id: pathSegment.and(
			z.string().min(1).max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		),
		idempotencyKey: z
			.string()
			.min(1)
			.refine((v) => !v.startsWith('auto_'), 'Reserved idempotency key')
			.optional(),
		body: RecoverInSchema,
	}),
	endpointsSendExample: z.object({
		app_id: pathSegment.and(
			z.string().min(1).max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		),
		endpoint_id: pathSegment.and(
			z.string().min(1).max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		),
		idempotencyKey: z
			.string()
			.min(1)
			.refine((v) => !v.startsWith('auto_'), 'Reserved idempotency key')
			.optional(),
		body: EventExampleInSchema,
	}),
	eventTypesList: z.object({
		limit: z.number().int().min(1).max(250).optional(),
		iterator: z
			.string()
			.max(256)
			.regex(new RegExp('^[a-zA-Z0-9\\-_.]+$'))
			.nullable()
			.optional(),
		order: OrderingSchema.nullable().optional(),
		include_archived: z.boolean().optional(),
		archive_status: ArchiveStatusSchema.nullable().optional(),
		with_content: z.boolean().optional(),
	}),
	eventTypesCreate: z.object({
		idempotencyKey: z
			.string()
			.min(1)
			.refine((v) => !v.startsWith('auto_'), 'Reserved idempotency key')
			.optional(),
		body: EventTypeInSchema,
	}),
	eventTypesImportOpenapi: z.object({
		idempotencyKey: z
			.string()
			.min(1)
			.refine((v) => !v.startsWith('auto_'), 'Reserved idempotency key')
			.optional(),
		body: EventTypeImportOpenApiInSchema,
	}),
	eventTypesGet: z.object({
		event_type_name: pathSegment.and(
			z.string().max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		),
	}),
	eventTypesUpsert: z.object({
		event_type_name: pathSegment.and(
			z.string().max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		),
		body: EventTypeUpsertInSchema,
	}),
	eventTypesDelete: z.object({
		event_type_name: pathSegment.and(
			z.string().max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		),
		expunge: z.boolean().optional(),
	}),
	eventTypesPatch: z.object({
		event_type_name: pathSegment.and(
			z.string().max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		),
		body: EventTypePatchSchema,
	}),
	messagesList: z.object({
		app_id: pathSegment.and(
			z.string().min(1).max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		),
		limit: z.number().int().min(1).max(250).optional(),
		iterator: z
			.string()
			.min(31)
			.max(31)
			.regex(new RegExp('^msg_[A-Za-z0-9]{27}$'))
			.nullable()
			.optional(),
		channel: z
			.string()
			.max(128)
			.regex(new RegExp('^[a-zA-Z0-9\\-_.:+]+$'))
			.nullable()
			.optional(),
		before: z.string().nullable().optional(),
		after: z.string().nullable().optional(),
		with_content: z.boolean().optional(),
		tag: z
			.string()
			.max(128)
			.regex(new RegExp('^[a-zA-Z0-9\\-_./\\\\#]+$'))
			.nullable()
			.optional(),
		event_types: z
			.array(z.string().max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')))
			.nullable()
			.optional(),
	}),
	messagesCreate: z.object({
		app_id: pathSegment.and(
			z.string().min(1).max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		),
		with_content: z.boolean().optional(),
		idempotencyKey: z
			.string()
			.min(1)
			.refine((v) => !v.startsWith('auto_'), 'Reserved idempotency key')
			.optional(),
		body: MessageInSchema,
	}),
	messagesCreateBatch: z.object({
		app_id: pathSegment.and(
			z.string().min(1).max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		),
		idempotencyKey: z
			.string()
			.min(1)
			.refine((v) => !v.startsWith('auto_'), 'Reserved idempotency key')
			.optional(),
		body: BatchCreateMessagesInSchema,
	}),
	messagesPrecheck: z.object({
		app_id: pathSegment.and(
			z.string().min(1).max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		),
		idempotencyKey: z
			.string()
			.min(1)
			.refine((v) => !v.startsWith('auto_'), 'Reserved idempotency key')
			.optional(),
		body: MessagePrecheckInSchema,
	}),
	messagesGet: z.object({
		app_id: pathSegment.and(
			z.string().min(1).max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		),
		msg_id: pathSegment.and(
			z.string().min(1).max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		),
		with_content: z.boolean().optional(),
	}),
	messagesExpungeContent: z.object({
		app_id: pathSegment.and(
			z.string().min(1).max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		),
		msg_id: pathSegment.and(
			z.string().min(1).max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		),
	}),
	messagesBulkExpungeContent: z.object({
		app_id: pathSegment.and(
			z.string().min(1).max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		),
		idempotencyKey: z
			.string()
			.min(1)
			.refine((v) => !v.startsWith('auto_'), 'Reserved idempotency key')
			.optional(),
		body: BulkExpungeContentsInSchema,
	}),
	messagesExpungeAllContents: z.object({
		app_id: pathSegment.and(
			z.string().min(1).max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		),
		idempotencyKey: z
			.string()
			.min(1)
			.refine((v) => !v.startsWith('auto_'), 'Reserved idempotency key')
			.optional(),
	}),
	attemptsListByEndpoint: z.object({
		limit: z.number().int().min(1).max(250).optional(),
		iterator: z
			.string()
			.min(33)
			.max(33)
			.regex(new RegExp('^atmpt_[A-Za-z0-9]{27}$'))
			.nullable()
			.optional(),
		status: MessageStatusSchema.nullable().optional(),
		status_code_class: StatusCodeClassSchema.nullable().optional(),
		channel: z
			.string()
			.max(128)
			.regex(new RegExp('^[a-zA-Z0-9\\-_.:+]+$'))
			.nullable()
			.optional(),
		tag: z
			.string()
			.max(128)
			.regex(new RegExp('^[a-zA-Z0-9\\-_./\\\\#]+$'))
			.nullable()
			.optional(),
		before: z.string().nullable().optional(),
		after: z.string().nullable().optional(),
		with_content: z.boolean().optional(),
		with_msg: z.boolean().optional(),
		expanded_statuses: z.boolean().optional(),
		event_types: z
			.array(z.string().max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')))
			.nullable()
			.optional(),
		app_id: pathSegment.and(
			z.string().min(1).max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		),
		endpoint_id: pathSegment.and(
			z.string().min(1).max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		),
	}),
	attemptsListByMsg: z.object({
		limit: z.number().int().min(1).max(250).optional(),
		iterator: z
			.string()
			.min(33)
			.max(33)
			.regex(new RegExp('^atmpt_[A-Za-z0-9]{27}$'))
			.nullable()
			.optional(),
		status: MessageStatusSchema.nullable().optional(),
		status_code_class: StatusCodeClassSchema.nullable().optional(),
		channel: z
			.string()
			.max(128)
			.regex(new RegExp('^[a-zA-Z0-9\\-_.:+]+$'))
			.nullable()
			.optional(),
		tag: z
			.string()
			.max(128)
			.regex(new RegExp('^[a-zA-Z0-9\\-_./\\\\#]+$'))
			.nullable()
			.optional(),
		endpoint_id: z
			.string()
			.min(1)
			.max(256)
			.regex(new RegExp('^[a-zA-Z0-9\\-_.]+$'))
			.nullable()
			.optional(),
		before: z.string().nullable().optional(),
		after: z.string().nullable().optional(),
		with_content: z.boolean().optional(),
		expanded_statuses: z.boolean().optional(),
		app_id: pathSegment.and(
			z.string().min(1).max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		),
		msg_id: pathSegment.and(
			z.string().min(1).max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		),
		event_types: z
			.array(z.string().max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')))
			.nullable()
			.optional(),
	}),
	attemptsListAttemptedMessages: z.object({
		limit: z.number().int().min(1).max(250).optional(),
		iterator: z
			.string()
			.min(31)
			.max(31)
			.regex(new RegExp('^msg_[A-Za-z0-9]{27}$'))
			.nullable()
			.optional(),
		channel: z
			.string()
			.max(128)
			.regex(new RegExp('^[a-zA-Z0-9\\-_.:+]+$'))
			.nullable()
			.optional(),
		tag: z
			.string()
			.max(128)
			.regex(new RegExp('^[a-zA-Z0-9\\-_./\\\\#]+$'))
			.nullable()
			.optional(),
		status: MessageStatusSchema.nullable().optional(),
		before: z.string().nullable().optional(),
		after: z.string().nullable().optional(),
		with_content: z.boolean().optional(),
		expanded_statuses: z.boolean().optional(),
		app_id: pathSegment.and(
			z.string().min(1).max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		),
		endpoint_id: pathSegment.and(
			z.string().min(1).max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		),
		event_types: z
			.array(z.string().max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')))
			.nullable()
			.optional(),
	}),
	attemptsListAttemptedDestinations: z.object({
		limit: z.number().int().min(1).max(250).optional(),
		iterator: z
			.string()
			.min(30)
			.max(30)
			.regex(new RegExp('^ep_[A-Za-z0-9]{27}$'))
			.nullable()
			.optional(),
		app_id: pathSegment.and(
			z.string().min(1).max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		),
		msg_id: pathSegment.and(
			z.string().min(1).max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		),
	}),
	attemptsGet: z.object({
		app_id: pathSegment.and(
			z.string().min(1).max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		),
		msg_id: pathSegment.and(
			z.string().min(1).max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		),
		attempt_id: pathSegment.and(
			z.string().min(33).max(33).regex(new RegExp('^atmpt_[A-Za-z0-9]{27}$')),
		),
		expanded_statuses: z.boolean().optional(),
	}),
	attemptsExpungeContent: z.object({
		app_id: pathSegment.and(
			z.string().min(1).max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		),
		msg_id: pathSegment.and(
			z.string().min(1).max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		),
		attempt_id: pathSegment.and(
			z.string().min(33).max(33).regex(new RegExp('^atmpt_[A-Za-z0-9]{27}$')),
		),
	}),
	attemptsResend: z.object({
		app_id: pathSegment.and(
			z.string().min(1).max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		),
		msg_id: pathSegment.and(
			z.string().min(1).max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		),
		endpoint_id: pathSegment.and(
			z.string().min(1).max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		),
		idempotencyKey: z
			.string()
			.min(1)
			.refine((v) => !v.startsWith('auto_'), 'Reserved idempotency key')
			.optional(),
	}),
	messagesPollerPoll: z.object({
		app_id: pathSegment.and(
			z.string().min(1).max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		),
		sink_id: pathSegment.and(
			z.string().min(1).max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		),
		limit: z.number().int().min(1).max(250).optional(),
		iterator: z.string().nullable().optional(),
		event_type: z
			.string()
			.max(256)
			.regex(new RegExp('^[a-zA-Z0-9\\-_.]+$'))
			.nullable()
			.optional(),
		channel: z
			.string()
			.max(128)
			.regex(new RegExp('^[a-zA-Z0-9\\-_.:+]+$'))
			.nullable()
			.optional(),
		after: z.string().nullable().optional(),
	}),
	messagesPollerConsumerSeek: z.object({
		app_id: pathSegment.and(
			z.string().min(1).max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		),
		sink_id: pathSegment.and(
			z.string().min(1).max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		),
		consumer_id: pathSegment.and(z.string()),
		idempotencyKey: z
			.string()
			.min(1)
			.refine((v) => !v.startsWith('auto_'), 'Reserved idempotency key')
			.optional(),
		body: PollingEndpointConsumerSeekInSchema,
	}),
	messagesPollerConsumerPoll: z.object({
		app_id: pathSegment.and(
			z.string().min(1).max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		),
		sink_id: pathSegment.and(
			z.string().min(1).max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		),
		consumer_id: pathSegment.and(z.string()),
		limit: z.number().int().min(1).max(250).optional(),
		iterator: z.string().nullable().optional(),
	}),
	operationalWebhooksList: z.object({
		limit: z.number().int().min(1).max(250).optional(),
		iterator: z
			.string()
			.min(30)
			.max(30)
			.regex(new RegExp('^ep_[A-Za-z0-9]{27}$'))
			.nullable()
			.optional(),
		order: OrderingSchema.nullable().optional(),
	}),
	operationalWebhooksCreate: z.object({
		idempotencyKey: z
			.string()
			.min(1)
			.refine((v) => !v.startsWith('auto_'), 'Reserved idempotency key')
			.optional(),
		body: OperationalWebhookEndpointInSchema,
	}),
	operationalWebhooksGet: z.object({
		endpoint_id: pathSegment.and(
			z.string().min(1).max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		),
	}),
	operationalWebhooksUpsert: z.object({
		endpoint_id: pathSegment.and(
			z.string().min(1).max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		),
		body: OperationalWebhookEndpointUpsertInSchema,
	}),
	operationalWebhooksDelete: z.object({
		endpoint_id: pathSegment.and(
			z.string().min(1).max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		),
	}),
	operationalWebhooksGetSecret: z.object({
		endpoint_id: pathSegment.and(
			z.string().min(1).max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		),
	}),
	operationalWebhooksRotateSecret: z.object({
		endpoint_id: pathSegment.and(
			z.string().min(1).max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		),
		idempotencyKey: z
			.string()
			.min(1)
			.refine((v) => !v.startsWith('auto_'), 'Reserved idempotency key')
			.optional(),
		body: OperationalWebhookEndpointSecretInSchema,
	}),
	operationalWebhooksGetHeaders: z.object({
		endpoint_id: pathSegment.and(
			z.string().min(1).max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		),
	}),
	operationalWebhooksSetHeaders: z.object({
		endpoint_id: pathSegment.and(
			z.string().min(1).max(256).regex(new RegExp('^[a-zA-Z0-9\\-_.]+$')),
		),
		body: OperationalWebhookEndpointHeadersInSchema,
	}),
} as const;

export const SvixEndpointOutputSchemas = {
	applicationsList: ListResponse_ApplicationOut_Schema,
	applicationsCreate: ApplicationOutSchema,
	applicationsGet: ApplicationOutSchema,
	applicationsUpsert: ApplicationOutSchema,
	applicationsDelete: z.void(),
	applicationsPatch: ApplicationOutSchema,
	endpointsList: ListResponse_EndpointOut_Schema,
	endpointsCreate: EndpointOutSchema,
	endpointsGet: EndpointOutSchema,
	endpointsUpsert: EndpointOutSchema,
	endpointsDelete: z.void(),
	endpointsPatch: EndpointOutSchema,
	endpointsMcpEventsSubscribe: McpEventsSubscribeOutSchema,
	endpointsMcpEventsUnsubscribe: z.void(),
	endpointsGetSecret: EndpointSecretOutSchema,
	endpointsRotateSecret: EndpointSecretOutSchema,
	endpointsGetHeaders: EndpointHeadersOutSchema,
	endpointsSetHeaders: z.void(),
	endpointsPatchHeaders: z.void(),
	endpointsTransformationGet: EndpointTransformationOutSchema,
	endpointsTransformationPatch: z.void(),
	endpointsReplayMissing: ReplayOutSchema,
	endpointsBulkReplay: ReplayOutSchema,
	endpointsGetStats: EndpointStatsSchema,
	endpointsGetAttemptStats: EndpointAttemptStatsSchema,
	endpointsRecover: RecoverOutSchema,
	endpointsSendExample: MessageOutSchema,
	eventTypesList: ListResponse_EventTypeOut_Schema,
	eventTypesCreate: EventTypeOutSchema,
	eventTypesImportOpenapi: EventTypeImportOpenApiOutSchema,
	eventTypesGet: EventTypeOutSchema,
	eventTypesUpsert: EventTypeOutSchema,
	eventTypesDelete: z.void(),
	eventTypesPatch: EventTypeOutSchema,
	messagesList: ListResponse_MessageOut_Schema,
	messagesCreate: MessageOutSchema,
	messagesCreateBatch: EmptyResponseSchema,
	messagesPrecheck: MessagePrecheckOutSchema,
	messagesGet: MessageOutSchema,
	messagesExpungeContent: z.void(),
	messagesBulkExpungeContent: BulkExpungeContentsOutSchema,
	messagesExpungeAllContents: ExpungeAllContentsOutSchema,
	attemptsListByEndpoint: ListResponse_MessageAttemptOut_Schema,
	attemptsListByMsg: ListResponse_MessageAttemptOut_Schema,
	attemptsListAttemptedMessages: ListResponse_EndpointMessageOut_Schema,
	attemptsListAttemptedDestinations: ListResponse_MessageEndpointOut_Schema,
	attemptsGet: MessageAttemptOutSchema,
	attemptsExpungeContent: z.void(),
	attemptsResend: EmptyResponseSchema,
	messagesPollerPoll: PollingEndpointOutSchema,
	messagesPollerConsumerSeek: PollingEndpointConsumerSeekOutSchema,
	messagesPollerConsumerPoll: PollingEndpointOutSchema,
	operationalWebhooksList: ListResponse_OperationalWebhookEndpointOut_Schema,
	operationalWebhooksCreate: OperationalWebhookEndpointOutSchema,
	operationalWebhooksGet: OperationalWebhookEndpointOutSchema,
	operationalWebhooksUpsert: OperationalWebhookEndpointOutSchema,
	operationalWebhooksDelete: z.void(),
	operationalWebhooksGetSecret: OperationalWebhookEndpointSecretOutSchema,
	operationalWebhooksRotateSecret: z.void(),
	operationalWebhooksGetHeaders: OperationalWebhookEndpointHeadersOutSchema,
	operationalWebhooksSetHeaders: z.void(),
} as const;

export type SvixOperationName = keyof typeof SvixEndpointInputSchemas;
export type SvixEndpointInputs = {
	[K in SvixOperationName]: z.input<(typeof SvixEndpointInputSchemas)[K]>;
};
export type SvixEndpointOutputs = {
	[K in SvixOperationName]: z.output<(typeof SvixEndpointOutputSchemas)[K]>;
};

export const svixRoutes = {
	applicationsList: {
		method: 'GET',
		path: '/api/v1/app',
		query: [
			'exclude_apps_with_no_endpoints',
			'exclude_apps_with_disabled_endpoints',
			'exclude_apps_with_svix_play_endpoints',
			'limit',
			'iterator',
			'order',
		],
		hasBody: false,
	},
	applicationsCreate: {
		method: 'POST',
		path: '/api/v1/app',
		query: ['get_if_exists'],
		hasBody: true,
	},
	applicationsGet: {
		method: 'GET',
		path: '/api/v1/app/{app_id}',
		query: [],
		hasBody: false,
	},
	applicationsUpsert: {
		method: 'PUT',
		path: '/api/v1/app/{app_id}',
		query: [],
		hasBody: true,
	},
	applicationsDelete: {
		method: 'DELETE',
		path: '/api/v1/app/{app_id}',
		query: [],
		hasBody: false,
	},
	applicationsPatch: {
		method: 'PATCH',
		path: '/api/v1/app/{app_id}',
		query: [],
		hasBody: true,
	},
	endpointsList: {
		method: 'GET',
		path: '/api/v1/app/{app_id}/endpoint',
		query: ['limit', 'iterator', 'order'],
		hasBody: false,
	},
	endpointsCreate: {
		method: 'POST',
		path: '/api/v1/app/{app_id}/endpoint',
		query: [],
		hasBody: true,
	},
	endpointsGet: {
		method: 'GET',
		path: '/api/v1/app/{app_id}/endpoint/{endpoint_id}',
		query: [],
		hasBody: false,
	},
	endpointsUpsert: {
		method: 'PUT',
		path: '/api/v1/app/{app_id}/endpoint/{endpoint_id}',
		query: [],
		hasBody: true,
	},
	endpointsDelete: {
		method: 'DELETE',
		path: '/api/v1/app/{app_id}/endpoint/{endpoint_id}',
		query: [],
		hasBody: false,
	},
	endpointsPatch: {
		method: 'PATCH',
		path: '/api/v1/app/{app_id}/endpoint/{endpoint_id}',
		query: [],
		hasBody: true,
	},
	endpointsMcpEventsSubscribe: {
		method: 'POST',
		path: '/api/v1/app/{app_id}/mcp-events/subscribe',
		query: [],
		hasBody: true,
	},
	endpointsMcpEventsUnsubscribe: {
		method: 'POST',
		path: '/api/v1/app/{app_id}/mcp-events/unsubscribe',
		query: [],
		hasBody: true,
	},
	endpointsGetSecret: {
		method: 'GET',
		path: '/api/v1/app/{app_id}/endpoint/{endpoint_id}/secret',
		query: [],
		hasBody: false,
	},
	endpointsRotateSecret: {
		method: 'POST',
		path: '/api/v1/app/{app_id}/endpoint/{endpoint_id}/secret/rotate',
		query: [],
		hasBody: true,
	},
	endpointsGetHeaders: {
		method: 'GET',
		path: '/api/v1/app/{app_id}/endpoint/{endpoint_id}/headers',
		query: [],
		hasBody: false,
	},
	endpointsSetHeaders: {
		method: 'PUT',
		path: '/api/v1/app/{app_id}/endpoint/{endpoint_id}/headers',
		query: [],
		hasBody: true,
	},
	endpointsPatchHeaders: {
		method: 'PATCH',
		path: '/api/v1/app/{app_id}/endpoint/{endpoint_id}/headers',
		query: [],
		hasBody: true,
	},
	endpointsTransformationGet: {
		method: 'GET',
		path: '/api/v1/app/{app_id}/endpoint/{endpoint_id}/transformation',
		query: [],
		hasBody: false,
	},
	endpointsTransformationPatch: {
		method: 'PATCH',
		path: '/api/v1/app/{app_id}/endpoint/{endpoint_id}/transformation',
		query: [],
		hasBody: true,
	},
	endpointsReplayMissing: {
		method: 'POST',
		path: '/api/v1/app/{app_id}/endpoint/{endpoint_id}/replay-missing',
		query: [],
		hasBody: true,
	},
	endpointsBulkReplay: {
		method: 'POST',
		path: '/api/v1/app/{app_id}/endpoint/{endpoint_id}/bulk-replay',
		query: [],
		hasBody: true,
	},
	endpointsGetStats: {
		method: 'GET',
		path: '/api/v1/app/{app_id}/endpoint/{endpoint_id}/stats',
		query: ['since', 'until'],
		hasBody: false,
	},
	endpointsGetAttemptStats: {
		method: 'GET',
		path: '/api/v1/app/{app_id}/endpoint/{endpoint_id}/attempt-stats',
		query: ['since', 'until'],
		hasBody: false,
	},
	endpointsRecover: {
		method: 'POST',
		path: '/api/v1/app/{app_id}/endpoint/{endpoint_id}/recover',
		query: [],
		hasBody: true,
	},
	endpointsSendExample: {
		method: 'POST',
		path: '/api/v1/app/{app_id}/endpoint/{endpoint_id}/send-example',
		query: [],
		hasBody: true,
	},
	eventTypesList: {
		method: 'GET',
		path: '/api/v1/event-type',
		query: [
			'limit',
			'iterator',
			'order',
			'include_archived',
			'archive_status',
			'with_content',
		],
		hasBody: false,
	},
	eventTypesCreate: {
		method: 'POST',
		path: '/api/v1/event-type',
		query: [],
		hasBody: true,
	},
	eventTypesImportOpenapi: {
		method: 'POST',
		path: '/api/v1/event-type/import/openapi',
		query: [],
		hasBody: true,
	},
	eventTypesGet: {
		method: 'GET',
		path: '/api/v1/event-type/{event_type_name}',
		query: [],
		hasBody: false,
	},
	eventTypesUpsert: {
		method: 'PUT',
		path: '/api/v1/event-type/{event_type_name}',
		query: [],
		hasBody: true,
	},
	eventTypesDelete: {
		method: 'DELETE',
		path: '/api/v1/event-type/{event_type_name}',
		query: ['expunge'],
		hasBody: false,
	},
	eventTypesPatch: {
		method: 'PATCH',
		path: '/api/v1/event-type/{event_type_name}',
		query: [],
		hasBody: true,
	},
	messagesList: {
		method: 'GET',
		path: '/api/v1/app/{app_id}/msg',
		query: [
			'limit',
			'iterator',
			'channel',
			'before',
			'after',
			'with_content',
			'tag',
			'event_types',
		],
		hasBody: false,
	},
	messagesCreate: {
		method: 'POST',
		path: '/api/v1/app/{app_id}/msg',
		query: ['with_content'],
		hasBody: true,
	},
	messagesCreateBatch: {
		method: 'POST',
		path: '/api/v1/app/{app_id}/msg/batch',
		query: [],
		hasBody: true,
	},
	messagesPrecheck: {
		method: 'POST',
		path: '/api/v1/app/{app_id}/msg/precheck/active',
		query: [],
		hasBody: true,
	},
	messagesGet: {
		method: 'GET',
		path: '/api/v1/app/{app_id}/msg/{msg_id}',
		query: ['with_content'],
		hasBody: false,
	},
	messagesExpungeContent: {
		method: 'DELETE',
		path: '/api/v1/app/{app_id}/msg/{msg_id}/content',
		query: [],
		hasBody: false,
	},
	messagesBulkExpungeContent: {
		method: 'POST',
		path: '/api/v1/app/{app_id}/msg/bulk-expunge',
		query: [],
		hasBody: true,
	},
	messagesExpungeAllContents: {
		method: 'POST',
		path: '/api/v1/app/{app_id}/msg/expunge-all-contents',
		query: [],
		hasBody: false,
	},
	attemptsListByEndpoint: {
		method: 'GET',
		path: '/api/v1/app/{app_id}/attempt/endpoint/{endpoint_id}',
		query: [
			'limit',
			'iterator',
			'status',
			'status_code_class',
			'channel',
			'tag',
			'before',
			'after',
			'with_content',
			'with_msg',
			'expanded_statuses',
			'event_types',
		],
		hasBody: false,
	},
	attemptsListByMsg: {
		method: 'GET',
		path: '/api/v1/app/{app_id}/attempt/msg/{msg_id}',
		query: [
			'limit',
			'iterator',
			'status',
			'status_code_class',
			'channel',
			'tag',
			'endpoint_id',
			'before',
			'after',
			'with_content',
			'expanded_statuses',
			'event_types',
		],
		hasBody: false,
	},
	attemptsListAttemptedMessages: {
		method: 'GET',
		path: '/api/v1/app/{app_id}/endpoint/{endpoint_id}/msg',
		query: [
			'limit',
			'iterator',
			'channel',
			'tag',
			'status',
			'before',
			'after',
			'with_content',
			'expanded_statuses',
			'event_types',
		],
		hasBody: false,
	},
	attemptsListAttemptedDestinations: {
		method: 'GET',
		path: '/api/v1/app/{app_id}/msg/{msg_id}/endpoint',
		query: ['limit', 'iterator'],
		hasBody: false,
	},
	attemptsGet: {
		method: 'GET',
		path: '/api/v1/app/{app_id}/msg/{msg_id}/attempt/{attempt_id}',
		query: ['expanded_statuses'],
		hasBody: false,
	},
	attemptsExpungeContent: {
		method: 'DELETE',
		path: '/api/v1/app/{app_id}/msg/{msg_id}/attempt/{attempt_id}/content',
		query: [],
		hasBody: false,
	},
	attemptsResend: {
		method: 'POST',
		path: '/api/v1/app/{app_id}/msg/{msg_id}/endpoint/{endpoint_id}/resend',
		query: [],
		hasBody: false,
	},
	messagesPollerPoll: {
		method: 'GET',
		path: '/api/v1/app/{app_id}/poller/{sink_id}',
		query: ['limit', 'iterator', 'event_type', 'channel', 'after'],
		hasBody: false,
	},
	messagesPollerConsumerSeek: {
		method: 'POST',
		path: '/api/v1/app/{app_id}/poller/{sink_id}/consumer/{consumer_id}/seek',
		query: [],
		hasBody: true,
	},
	messagesPollerConsumerPoll: {
		method: 'GET',
		path: '/api/v1/app/{app_id}/poller/{sink_id}/consumer/{consumer_id}',
		query: ['limit', 'iterator'],
		hasBody: false,
	},
	operationalWebhooksList: {
		method: 'GET',
		path: '/api/v1/operational-webhook/endpoint',
		query: ['limit', 'iterator', 'order'],
		hasBody: false,
	},
	operationalWebhooksCreate: {
		method: 'POST',
		path: '/api/v1/operational-webhook/endpoint',
		query: [],
		hasBody: true,
	},
	operationalWebhooksGet: {
		method: 'GET',
		path: '/api/v1/operational-webhook/endpoint/{endpoint_id}',
		query: [],
		hasBody: false,
	},
	operationalWebhooksUpsert: {
		method: 'PUT',
		path: '/api/v1/operational-webhook/endpoint/{endpoint_id}',
		query: [],
		hasBody: true,
	},
	operationalWebhooksDelete: {
		method: 'DELETE',
		path: '/api/v1/operational-webhook/endpoint/{endpoint_id}',
		query: [],
		hasBody: false,
	},
	operationalWebhooksGetSecret: {
		method: 'GET',
		path: '/api/v1/operational-webhook/endpoint/{endpoint_id}/secret',
		query: [],
		hasBody: false,
	},
	operationalWebhooksRotateSecret: {
		method: 'POST',
		path: '/api/v1/operational-webhook/endpoint/{endpoint_id}/secret/rotate',
		query: [],
		hasBody: true,
	},
	operationalWebhooksGetHeaders: {
		method: 'GET',
		path: '/api/v1/operational-webhook/endpoint/{endpoint_id}/headers',
		query: [],
		hasBody: false,
	},
	operationalWebhooksSetHeaders: {
		method: 'PUT',
		path: '/api/v1/operational-webhook/endpoint/{endpoint_id}/headers',
		query: [],
		hasBody: true,
	},
} as const;
