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
// not fully enumerate. It is passed through unchanged after a shallow check
// that it carries at least one entity key, which every documented filters
// example does at the top level or inside AND/OR.
const FiltersSchema = JsonRecordSchema.describe(
	'Entity and metadata filters. Must include at least one of user_id, agent_id, app_id or run_id. Supports AND, OR, NOT and the operators in, gte, lte, gt, lt, ne, icontains, and * as a wildcard.',
);

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
		.describe('Restrict the fields returned per memory.'),
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

export const SearchResultSchema = z
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

export type Mem0SearchResult = z.infer<typeof SearchResultSchema>;

const MemoriesSearchResponseSchema = z.object({
	results: z.array(SearchResultSchema),
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
		.describe('Restrict the fields returned per memory.'),
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

const MemoriesListResponseSchema = z.object({
	count: z.number().describe('Total number of memories matching the filters.'),
	next: z
		.string()
		.nullable()
		.describe('URL of the next page, or null on the last page.'),
	previous: z.string().nullable(),
	results: z.array(MemorySchema),
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
			'Only memories whose metadata matches these keys.',
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
					value.metadata,
			),
		{
			message:
				'At least one filter is required. Mem0 rejects an unfiltered delete.',
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
	text: z.string().min(1).optional().describe('The new memory text.'),
	metadata: JsonRecordSchema.optional(),
});

const MemoriesBatchUpdateInputSchema = z.object({
	memories: z
		.array(BatchUpdateEntrySchema)
		.min(1)
		.max(1000)
		.describe('The memories to update, up to 1000 per call.'),
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
		results: z.array(JsonValueSchema).nullish(),
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
} as const;
