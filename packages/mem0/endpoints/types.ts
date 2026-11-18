import { asRecord } from 'corsair/core';
import { z } from 'zod';

// Inputs use Mem0's own snake_case parameter names. Outputs are `.loose()` and
// their documented fields nullish, so a field Mem0 adds or omits cannot fail a
// call that has already happened. Field reference: https://docs.mem0.ai

const EntityIdSchema = z.string().min(1);

// unknown: filters, metadata, payloads and structured attributes carry
// caller-defined keys, so their values pass through as Mem0 sends them.
const JsonRecordSchema = z.record(z.string(), z.unknown());
// unknown: event results are whatever the queued job produced; Mem0 does not
// fix a shape per event type.
const JsonValueSchema = z.unknown();

// The filters object is AND/OR/NOT plus comparison operators, which Mem0 does
// not fully enumerate, so its values are passed through unchanged. Mem0 rejects
// a search or list whose filters carry no entity ID, so that is checked here
// rather than spending a request to learn it.
const ENTITY_KEYS = ['user_id', 'agent_id', 'app_id', 'run_id'] as const;

// unknown: one branch of a nested AND/OR/NOT list.
function carriesEntityId(entry: unknown): boolean {
	const record = asRecord(entry);
	if (!record) return false;
	// A key present with an undefined value is not a filter: the query builder
	// drops it and Mem0 sees no entity scope.
	if (ENTITY_KEYS.some((key) => record[key] !== undefined)) return true;
	return ['AND', 'OR', 'NOT'].some((operator) => {
		const branches = record[operator];
		return Array.isArray(branches) && branches.some(carriesEntityId);
	});
}

const FiltersSchema = JsonRecordSchema.describe(
	'Entity and metadata filters. Must include at least one of user_id, agent_id, app_id or run_id, at the top level or inside AND/OR/NOT. Supports AND, OR, NOT and the operators in, gte, lte, gt, lt, ne, icontains, and * as a wildcard.',
).refine(carriesEntityId, {
	message:
		'filters must include at least one of user_id, agent_id, app_id or run_id.',
});

const DateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD.');

// ── memories.add ──────────────────────────────────────────────────────────

const MessageSchema = z.object({
	role: z.enum(['user', 'assistant', 'system']),
	content: z.string().min(1),
});

export type Mem0Message = z.input<typeof MessageSchema>;

const MemoriesAddInputSchema = z
	.object({
		messages: z
			.array(MessageSchema)
			.min(1)
			.describe('Conversation turns for Mem0 to extract memories from.'),
		user_id: EntityIdSchema.optional().describe('Scope memories to this user.'),
		agent_id: EntityIdSchema.optional().describe(
			'Scope memories to this agent.',
		),
		app_id: EntityIdSchema.optional().describe('Scope memories to this app.'),
		run_id: EntityIdSchema.optional().describe('Scope memories to this run.'),
		metadata: JsonRecordSchema.optional().describe(
			'Custom key/value metadata attached to each memory.',
		),
		infer: z
			.boolean()
			.optional()
			.describe(
				'Defaults to true, which runs extraction. Set false to store each message verbatim, which also makes the response synchronous.',
			),
		expiration_date: DateSchema.optional().describe(
			'Date through which the memory is visible. Expired memories are hidden unless `show_expired` is passed.',
		),
		immutable: z
			.boolean()
			.optional()
			.describe(
				'Defaults to false. Immutable memories are excluded from later update and consolidation.',
			),
		includes: z
			.string()
			.optional()
			.describe('Free-text hint of what to include during extraction.'),
		excludes: z
			.string()
			.optional()
			.describe('Free-text hint of what to exclude during extraction.'),
		enable_graph: z
			.boolean()
			.optional()
			.describe('Enable graph memory extraction for this call.'),
		timestamp: z
			.number()
			.int()
			.optional()
			.describe(
				'Unix epoch seconds used as the created_at of stored memories.',
			),
	})
	.refine(
		(value) =>
			Boolean(value.user_id || value.agent_id || value.app_id || value.run_id),
		{
			message:
				'At least one of user_id, agent_id, app_id or run_id is required.',
		},
	);

export type MemoriesAddInput = z.input<typeof MemoriesAddInputSchema>;

// Unknown because a verbatim add returns memory objects it does not document.
const AddedMemorySchema = z
	.object({
		id: z.string().nullish(),
		data: JsonRecordSchema.nullish(),
		event: z.string().nullish(),
	})
	.loose();

const MemoriesAddResponseSchema = z
	.object({
		event_id: z.string().nullish().describe('Poll this with events.get.'),
		status: z
			.string()
			.nullish()
			.describe(
				'PENDING when extraction is queued, SUCCEEDED when `infer` was false.',
			),
		message: z.string().nullish(),
		results: z.array(AddedMemorySchema).nullish(),
	})
	.loose();

export type MemoriesAddResponse = z.infer<typeof MemoriesAddResponseSchema>;

// ── memories.search ───────────────────────────────────────────────────────

const MemoriesSearchInputSchema = z.object({
	query: z.string().min(1).describe('Natural-language search query.'),
	filters: FiltersSchema,
	top_k: z
		.number()
		.int()
		.min(1)
		.max(1000)
		.optional()
		.describe('Number of results. Defaults to 10.'),
	threshold: z
		.number()
		.min(0)
		.max(1)
		.optional()
		.describe(
			'Minimum relevance score. Defaults to 0.1. Pass 0 to disable filtering.',
		),
	rerank: z
		.boolean()
		.optional()
		.describe(
			'Defaults to false. Apply the managed reranker, which adds latency.',
		),
	show_expired: z
		.boolean()
		.optional()
		.describe(
			'Defaults to false. Include memories past their expiration_date.',
		),
	reference_date: z
		.union([z.number(), z.string()])
		.optional()
		.describe(
			'Date to simulate the search from. Accepts a Unix epoch, YYYY-MM-DD, or an ISO datetime.',
		),
	fields: z
		.array(z.string())
		.optional()
		.describe(
			'Only these fields come back per memory. A memory without them is absent from the result, not null.',
		),
	categories: z
		.array(z.string())
		.optional()
		.describe('Only memories tagged with any of these categories.'),
});

export type MemoriesSearchInput = z.input<typeof MemoriesSearchInputSchema>;

const ScoreBreakdownSchema = z
	.object({
		semantic: z.number().nullish(),
		bm25: z.number().nullish(),
		entity: z.number().nullish(),
	})
	.loose();

const SearchResultSchema = z
	.object({
		id: z.string(),
		memory: z.string(),
		score: z
			.number()
			.nullish()
			.describe('Combined multi-signal relevance score between 0 and 1.'),
		score_breakdown: ScoreBreakdownSchema.nullish(),
		user_id: z.string().nullish(),
		agent_id: z.string().nullish(),
		app_id: z.string().nullish(),
		run_id: z
			.string()
			.nullish()
			.describe(
				'Search returns the run as `run_id`; memories.list returns the same value as `session_id`.',
			),
		metadata: JsonRecordSchema.nullish(),
		categories: z.array(z.string()).nullish(),
		expiration_date: z.string().nullish(),
		created_at: z.string(),
		updated_at: z.string().nullish(),
	})
	.loose();

// A search or list call may pass `fields` to ask for a subset, and Mem0 then
// sends only those keys, so no field here can be required. `memories.get` and
// `memories.update` return the whole record and use the stricter MemorySchema.
export const SearchResultRecordSchema = SearchResultSchema.partial().describe(
	'One search result. Fields you did not request with `fields` are absent.',
);

export type Mem0SearchResult = z.infer<typeof SearchResultRecordSchema>;

const MemoriesSearchResponseSchema = z.object({
	results: z.array(SearchResultRecordSchema),
});

export type MemoriesSearchResponse = z.infer<
	typeof MemoriesSearchResponseSchema
>;

// ── memories.list ─────────────────────────────────────────────────────────

const MemoriesListInputSchema = z.object({
	filters: FiltersSchema,
	page: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe('1-based page. Defaults to 1.'),
	page_size: z
		.number()
		.int()
		.min(1)
		.max(200)
		.optional()
		.describe('Results per page. Defaults to 100.'),
	show_expired: z
		.boolean()
		.optional()
		.describe(
			'Defaults to false. Include memories past their expiration_date.',
		),
	start_date: DateSchema.optional().describe(
		'Only memories created on or after this date.',
	),
	end_date: DateSchema.optional().describe(
		'Only memories created on or before this date.',
	),
	categories: z
		.array(z.string())
		.optional()
		.describe('Only memories tagged with any of these categories.'),
	fields: z
		.array(z.string())
		.optional()
		.describe(
			'Only these fields come back per memory. A memory without them is absent from the result, not null.',
		),
	keywords: z
		.string()
		.optional()
		.describe('Free-text keyword filter applied on top of `filters`.'),
});

export type MemoriesListInput = z.input<typeof MemoriesListInputSchema>;

export const MemorySchema = z
	.object({
		id: z.string(),
		memory: z.string(),
		user_id: z.string().nullish(),
		agent_id: z.string().nullish(),
		app_id: z.string().nullish(),
		session_id: z
			.string()
			.nullish()
			.describe(
				'List returns the run as `session_id`; search returns the same value as `run_id`.',
			),
		metadata: JsonRecordSchema.nullish(),
		categories: z.array(z.string()).nullish(),
		structured_attributes: JsonRecordSchema.nullish().describe(
			'System-derived breakdown of the creation time.',
		),
		replaced_by: z.string().nullish(),
		synthesized: z.boolean().nullish(),
		lifecycle_state: z.string().nullish(),
		expiration_date: z.string().nullish(),
		created_at: z.string(),
		updated_at: z.string().nullish(),
	})
	.loose();

export type Mem0Memory = z.infer<typeof MemorySchema>;

// A list call may pass `fields`, and Mem0 then sends only those keys, so the
// rows cannot require anything. `memories.get` and `memories.update` use the
// stricter MemorySchema.
export const ListedMemorySchema = MemorySchema.partial().describe(
	'One listed memory. Fields you did not request with `fields` are absent.',
);

const MemoriesListResponseSchema = z.object({
	count: z.number().describe('Total number of memories matching the filters.'),
	next: z
		.string()
		.nullable()
		.describe('URL of the next page, or null on the last page.'),
	previous: z.string().nullable(),
	results: z.array(ListedMemorySchema),
});

export type MemoriesListResponse = z.infer<typeof MemoriesListResponseSchema>;

// ── memories.get ──────────────────────────────────────────────────────────

const MemoryIdInputSchema = z.object({
	memory_id: z.string().min(1).describe('The memory to read.'),
});

export type MemoryIdInput = z.input<typeof MemoryIdInputSchema>;

export type MemoriesGetResponse = Mem0Memory;
const MemoriesGetResponseSchema = MemorySchema;

// ── memories.update ───────────────────────────────────────────────────────

const MemoriesUpdateInputSchema = z
	.object({
		memory_id: z.string().min(1).describe('The memory to update.'),
		text: z.string().min(1).optional().describe('The new memory text.'),
		metadata: JsonRecordSchema.optional().describe('Replacement metadata.'),
		expiration_date: z
			.union([DateSchema, z.null()])
			.optional()
			.describe(
				'New expiration date in YYYY-MM-DD form, or null to clear an existing one. null and an omitted field mean different things, so the key is sent whenever this is set.',
			),
	})
	.refine(
		(value) =>
			value.text !== undefined ||
			value.metadata !== undefined ||
			value.expiration_date !== undefined,
		{ message: 'Pass at least one of text, metadata or expiration_date.' },
	);

export type MemoriesUpdateInput = z.input<typeof MemoriesUpdateInputSchema>;

export type MemoriesUpdateResponse = Mem0Memory;
const MemoriesUpdateResponseSchema = MemorySchema;

// ── memories.delete ───────────────────────────────────────────────────────

const MemoriesDeleteInputSchema = z.object({
	memory_id: z.string().min(1).describe('The memory to delete.'),
	delete_linked: z
		.boolean()
		.optional()
		.describe(
			'Defaults to false. Also delete memories linked to this one, and report how many went in `cascade_count`.',
		),
});

export type MemoriesDeleteInput = z.input<typeof MemoriesDeleteInputSchema>;

const MemoriesDeleteResponseSchema = z
	.object({
		success: z.literal(true),
		memory_id: z.string(),
		message: z.string().nullish(),
		cascade_count: z
			.number()
			.nullish()
			.describe('Only present when `delete_linked` was true.'),
	})
	.loose();

export type MemoriesDeleteResponse = z.infer<
	typeof MemoriesDeleteResponseSchema
>;

// ── memories.deleteAll ────────────────────────────────────────────────────

const MemoriesDeleteAllInputSchema = z
	.object({
		user_id: EntityIdSchema.optional().describe(
			'Delete this user\'s memories. Pass "*" for every user.',
		),
		agent_id: EntityIdSchema.optional().describe(
			'Delete this agent\'s memories. Pass "*" for every agent.',
		),
		app_id: EntityIdSchema.optional().describe(
			'Delete this app\'s memories. Pass "*" for every app.',
		),
		run_id: EntityIdSchema.optional().describe(
			'Delete this run\'s memories. Pass "*" for every run.',
		),
		org_id: EntityIdSchema.optional().describe(
			'Only memories in this organization.',
		),
		project_id: EntityIdSchema.optional().describe(
			'Only memories in this project.',
		),
		metadata: JsonRecordSchema.optional().describe(
			'Only memories whose metadata matches these keys. Values must be strings, numbers or booleans, because null and undefined reach the wire as no key at all.',
		),
	})
	.refine(
		(value) =>
			Boolean(
				value.user_id ||
					value.agent_id ||
					value.app_id ||
					value.run_id ||
					value.org_id ||
					value.project_id ||
					// An empty map reaches the wire as no query keys, so it filters
					// nothing. Require at least one entry.
					(value.metadata && Object.keys(value.metadata).length > 0),
			),
		{
			message:
				'At least one filter is required. Mem0 rejects an unfiltered delete.',
		},
	)
	.refine(
		(value) =>
			value.metadata === undefined ||
			Object.values(value.metadata).every(
				(entry) =>
					typeof entry === 'string' ||
					typeof entry === 'number' ||
					typeof entry === 'boolean',
			),
		{
			message:
				'metadata values must be strings, numbers or booleans. null and undefined are dropped from the query, so they match every memory.',
		},
	);

export type MemoriesDeleteAllInput = z.input<
	typeof MemoriesDeleteAllInputSchema
>;

const MemoriesDeleteAllResponseSchema = z
	.object({
		success: z.literal(true),
		message: z.string().nullish(),
		event_id: z
			.string()
			.nullish()
			.describe('Mem0 queues the deletion and answers immediately.'),
	})
	.loose();

export type MemoriesDeleteAllResponse = z.infer<
	typeof MemoriesDeleteAllResponseSchema
>;

// ── memories.history ──────────────────────────────────────────────────────

const HistoryEntrySchema = z
	.object({
		id: z.string(),
		memory_id: z.string(),
		input: z
			.array(
				z
					.object({
						role: z.string().nullish(),
						content: z.string().nullish(),
					})
					.loose(),
			)
			.nullish()
			.describe('The conversation turns that led to this change.'),
		old_memory: z.string().nullish(),
		new_memory: z.string().nullish(),
		user_id: z.string().nullish(),
		agent_id: z.string().nullish(),
		app_id: z.string().nullish(),
		session_id: z.string().nullish(),
		categories: z.array(z.string()).nullish(),
		event: z
			.string()
			.nullish()
			.describe(
				'ADD, UPDATE or DELETE. Kept as a string so a new event kind does not fail a read.',
			),
		metadata: JsonRecordSchema.nullish(),
		created_at: z.string().nullish(),
		updated_at: z.string().nullish(),
	})
	.loose();

export type Mem0HistoryEntry = z.infer<typeof HistoryEntrySchema>;

const MemoriesHistoryResponseSchema = z.object({
	history: z.array(HistoryEntrySchema),
});

export type MemoriesHistoryResponse = z.infer<
	typeof MemoriesHistoryResponseSchema
>;

// ── memories.batchUpdate ──────────────────────────────────────────────────

const BatchUpdateEntrySchema = z.object({
	memory_id: z.string().min(1),
	// Mem0 requires text on every PUT /v1/batch/ entry and answers 400
	// otherwise: "Each memory must include 'text' field for PUT operations".
	text: z.string().min(1).describe('The new memory text. Required by Mem0.'),
	// No metadata here: Mem0 documents it on PUT /v1/batch/ but ignores it, and
	// a live call left the stored metadata unchanged. Use memories.update for
	// metadata.
});

const MemoriesBatchUpdateInputSchema = z.object({
	memories: z
		.array(BatchUpdateEntrySchema)
		.min(1)
		.max(1000)
		.describe(
			'The memories to update, up to 1000 per call. Text is applied; use memories.update when metadata also has to change.',
		),
});

export type MemoriesBatchUpdateInput = z.input<
	typeof MemoriesBatchUpdateInputSchema
>;

const BatchResponseSchema = z
	.object({
		success: z.literal(true),
		message: z.string().nullish(),
		count: z.number().describe('How many memories the request carried.'),
	})
	.loose();

export type MemoriesBatchUpdateResponse = z.infer<typeof BatchResponseSchema>;

// ── memories.batchDelete ──────────────────────────────────────────────────

const MemoriesBatchDeleteInputSchema = z.object({
	memory_ids: z
		.array(z.string().min(1))
		.min(1)
		.max(1000)
		.describe('The memories to delete, up to 1000 per call.'),
});

export type MemoriesBatchDeleteInput = z.input<
	typeof MemoriesBatchDeleteInputSchema
>;

export type MemoriesBatchDeleteResponse = z.infer<typeof BatchResponseSchema>;

// ── events.get ────────────────────────────────────────────────────────────

const EventsGetInputSchema = z.object({
	event_id: z
		.string()
		.min(1)
		.describe('The event_id returned by memories.add or memories.deleteAll.'),
});

export type EventsGetInput = z.input<typeof EventsGetInputSchema>;

export const EventSchema = z
	.object({
		id: z.string(),
		event_type: z
			.string()
			.nullish()
			.describe('ADD, SEARCH, DELETE_ALL and so on.'),
		status: z
			.string()
			.nullish()
			.describe('PENDING, RUNNING, FAILED or SUCCEEDED.'),
		payload: JsonRecordSchema.nullish(),
		metadata: JsonRecordSchema.nullish(),
		// Mem0 sends an array for ADD, SEARCH and GET_ALL, a single memory
		// object for UPDATE, and null for DELETE and DELETE_ALL.
		results: z
			.union([z.array(JsonValueSchema), JsonRecordSchema])
			.nullish()
			.describe(
				'An array for ADD, SEARCH and GET_ALL, one object for UPDATE, and null for a delete.',
			),
		created_at: z.string().nullish(),
		updated_at: z.string().nullish(),
		started_at: z.string().nullish(),
		completed_at: z.string().nullish(),
		latency: z.number().nullish().describe('Processing time in milliseconds.'),
		graph_status: z.string().nullish(),
		error: z.string().nullish(),
	})
	.loose();

export type Mem0Event = z.infer<typeof EventSchema>;

export type EventsGetResponse = Mem0Event;
const EventsGetResponseSchema = EventSchema;

// ── events.list ───────────────────────────────────────────────────────────

const EventsListInputSchema = z.object({
	page: z.number().int().min(1).optional().describe('1-based page.'),
	page_size: z
		.number()
		.int()
		.min(1)
		.max(200)
		.optional()
		.describe('Results per page.'),
});

export type EventsListInput = z.input<typeof EventsListInputSchema>;

const EventsListResponseSchema = z.object({
	count: z.number(),
	next: z.string().nullable(),
	previous: z.string().nullable(),
	results: z.array(EventSchema),
});

export type EventsListResponse = z.infer<typeof EventsListResponseSchema>;

// ── webhooks.list ─────────────────────────────────────────────────────────

// Mem0's docs and its TypeScript SDK place these on /api/v1/webhooks/projects/
// {project_id}/ for create and list, and /api/v1/webhooks/{webhook_id}/ for
// update and delete. The SDK is the reference used here; the docs' own cURL
// samples disagree with each other.
export const MEM0_WEBHOOK_EVENT_TYPES = [
	'memory_add',
	'memory_update',
	'memory_delete',
	'memory_categorize',
	'ingest_job_completed',
	'ingest_job_partially_completed',
	'ingest_job_failed',
	'ingest_job_cancelled',
] as const;

const WebhookEventTypeSchema = z.enum(MEM0_WEBHOOK_EVENT_TYPES);

const ProjectIdInputSchema = z.object({
	project_id: z
		.string()
		.min(1)
		.describe(
			'The project whose webhooks to read. Mem0 scopes webhooks to a project.',
		),
});

export type ProjectIdInput = z.input<typeof ProjectIdInputSchema>;

export const WebhookSchema = z
	.object({
		webhook_id: z.string(),
		name: z.string().nullish(),
		url: z.string().nullish(),
		event_types: z.array(z.string()).nullish(),
		owner: z
			.string()
			.nullish()
			.describe('Username of the account that created the webhook.'),
		is_active: z.boolean().nullish(),
		project: z
			.string()
			.nullish()
			.describe('Name of the project the webhook belongs to.'),
		created_at: z.string().nullish(),
		updated_at: z.string().nullish(),
	})
	.loose();

export type Mem0Webhook = z.infer<typeof WebhookSchema>;

const WebhooksListResponseSchema = z.object({
	webhooks: z.array(WebhookSchema),
});

export type WebhooksListResponse = z.infer<typeof WebhooksListResponseSchema>;

// ── webhooks.create ───────────────────────────────────────────────────────

const WebhooksCreateInputSchema = z.object({
	project_id: z
		.string()
		.min(1)
		.describe('The project to register the webhook on.'),
	name: z.string().min(1).describe('A label for the webhook.'),
	url: z.string().min(1).describe('The HTTPS endpoint Mem0 posts events to.'),
	event_types: z
		.array(WebhookEventTypeSchema)
		.min(1)
		.describe(
			'Events to subscribe to. Mem0 requires this: omitting it does not fall back to a default.',
		),
	is_active: z.boolean().optional().describe('Defaults to true on Mem0 side.'),
});

export type WebhooksCreateInput = z.input<typeof WebhooksCreateInputSchema>;

export type WebhooksCreateResponse = Mem0Webhook;
const WebhooksCreateResponseSchema = WebhookSchema;

// ── webhooks.update ───────────────────────────────────────────────────────

const WebhooksUpdateInputSchema = z
	.object({
		webhook_id: z.string().min(1).describe('The webhook to change.'),
		name: z.string().min(1).optional().describe('The new label.'),
		url: z.string().min(1).optional().describe('The new endpoint URL.'),
		event_types: z
			.array(WebhookEventTypeSchema)
			.min(1)
			.optional()
			.describe('The new event subscription list, replacing the old one.'),
	})
	.refine(
		(value) =>
			value.name !== undefined ||
			value.url !== undefined ||
			value.event_types !== undefined,
		{ message: 'Pass at least one of name, url or event_types.' },
	);

export type WebhooksUpdateInput = z.input<typeof WebhooksUpdateInputSchema>;

const WebhooksUpdateResponseSchema = z
	.object({
		success: z.literal(true),
		webhook_id: z.string(),
		message: z.string().nullish(),
		webhook: WebhookSchema.optional().describe(
			'The webhook as it stands after the change, when Mem0 returns it.',
		),
	})
	.loose();

export type WebhooksUpdateResponse = z.infer<
	typeof WebhooksUpdateResponseSchema
>;

// ── webhooks.delete ───────────────────────────────────────────────────────

const WebhooksDeleteInputSchema = z.object({
	webhook_id: z.string().min(1).describe('The webhook to remove.'),
});

export type WebhooksDeleteInput = z.input<typeof WebhooksDeleteInputSchema>;

const WebhooksDeleteResponseSchema = z
	.object({
		success: z.literal(true),
		webhook_id: z.string(),
		message: z.string().nullish(),
	})
	.loose();

export type WebhooksDeleteResponse = z.infer<
	typeof WebhooksDeleteResponseSchema
>;

// ── Registry ──────────────────────────────────────────────────────────────

export type Mem0EndpointInputs = {
	memoriesAdd: MemoriesAddInput;
	memoriesSearch: MemoriesSearchInput;
	memoriesList: MemoriesListInput;
	memoriesGet: MemoryIdInput;
	memoriesUpdate: MemoriesUpdateInput;
	memoriesDelete: MemoriesDeleteInput;
	memoriesDeleteAll: MemoriesDeleteAllInput;
	memoriesHistory: MemoryIdInput;
	memoriesBatchUpdate: MemoriesBatchUpdateInput;
	memoriesBatchDelete: MemoriesBatchDeleteInput;
	eventsGet: EventsGetInput;
	eventsList: EventsListInput;
	webhooksList: ProjectIdInput;
	webhooksCreate: WebhooksCreateInput;
	webhooksUpdate: WebhooksUpdateInput;
	webhooksDelete: WebhooksDeleteInput;
};

export type Mem0EndpointOutputs = {
	memoriesAdd: MemoriesAddResponse;
	memoriesSearch: MemoriesSearchResponse;
	memoriesList: MemoriesListResponse;
	memoriesGet: MemoriesGetResponse;
	memoriesUpdate: MemoriesUpdateResponse;
	memoriesDelete: MemoriesDeleteResponse;
	memoriesDeleteAll: MemoriesDeleteAllResponse;
	memoriesHistory: MemoriesHistoryResponse;
	memoriesBatchUpdate: MemoriesBatchUpdateResponse;
	memoriesBatchDelete: MemoriesBatchDeleteResponse;
	eventsGet: EventsGetResponse;
	eventsList: EventsListResponse;
	webhooksList: WebhooksListResponse;
	webhooksCreate: WebhooksCreateResponse;
	webhooksUpdate: WebhooksUpdateResponse;
	webhooksDelete: WebhooksDeleteResponse;
};

export const Mem0EndpointInputSchemas = {
	memoriesAdd: MemoriesAddInputSchema,
	memoriesSearch: MemoriesSearchInputSchema,
	memoriesList: MemoriesListInputSchema,
	memoriesGet: MemoryIdInputSchema,
	memoriesUpdate: MemoriesUpdateInputSchema,
	memoriesDelete: MemoriesDeleteInputSchema,
	memoriesDeleteAll: MemoriesDeleteAllInputSchema,
	memoriesHistory: MemoryIdInputSchema,
	memoriesBatchUpdate: MemoriesBatchUpdateInputSchema,
	memoriesBatchDelete: MemoriesBatchDeleteInputSchema,
	eventsGet: EventsGetInputSchema,
	eventsList: EventsListInputSchema,
	webhooksList: ProjectIdInputSchema,
	webhooksCreate: WebhooksCreateInputSchema,
	webhooksUpdate: WebhooksUpdateInputSchema,
	webhooksDelete: WebhooksDeleteInputSchema,
} as const;

export const Mem0EndpointOutputSchemas = {
	memoriesAdd: MemoriesAddResponseSchema,
	memoriesSearch: MemoriesSearchResponseSchema,
	memoriesList: MemoriesListResponseSchema,
	memoriesGet: MemoriesGetResponseSchema,
	memoriesUpdate: MemoriesUpdateResponseSchema,
	memoriesDelete: MemoriesDeleteResponseSchema,
	memoriesDeleteAll: MemoriesDeleteAllResponseSchema,
	memoriesHistory: MemoriesHistoryResponseSchema,
	memoriesBatchUpdate: BatchResponseSchema,
	memoriesBatchDelete: BatchResponseSchema,
	eventsGet: EventsGetResponseSchema,
	eventsList: EventsListResponseSchema,
	webhooksList: WebhooksListResponseSchema,
	webhooksCreate: WebhooksCreateResponseSchema,
	webhooksUpdate: WebhooksUpdateResponseSchema,
	webhooksDelete: WebhooksDeleteResponseSchema,
} as const;
