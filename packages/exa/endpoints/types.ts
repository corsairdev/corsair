import { z } from 'zod';

// ── Shared Sub-schemas ────────────────────────────────────────────────────────

const ContentsTextOptionsSchema = z.object({
	maxCharacters: z.number().optional(),
	includeHtmlTags: z.boolean().optional(),
});

const ContentsHighlightsOptionsSchema = z.object({
	numSentences: z.number().optional(),
	highlightsPerUrl: z.number().optional(),
	query: z.string().optional(),
});

const ContentsSummaryOptionsSchema = z.object({
	query: z.string().optional(),
});

const ContentsOptionsSchema = z.object({
	text: z.union([ContentsTextOptionsSchema, z.boolean()]).optional(),
	highlights: z
		.union([ContentsHighlightsOptionsSchema, z.boolean()])
		.optional(),
	summary: z.union([ContentsSummaryOptionsSchema, z.boolean()]).optional(),
});

const SearchResultSchema = z.object({
	id: z.string(),
	url: z.string(),
	title: z.string().nullable().optional(),
	publishedDate: z.string().nullable().optional(),
	author: z.string().nullable().optional(),
	score: z.number().optional(),
	text: z.string().optional(),
	highlights: z.array(z.string()).optional(),
	highlightScores: z.array(z.number()).optional(),
	summary: z.string().optional(),
});

// ── Webset Shared Schemas ─────────────────────────────────────────────────────

const WebsetEntitySchema = z.object({
	type: z
		.enum([
			'company',
			'person',
			'article',
			'research paper',
			'repository',
			'event',
			'product',
			'video',
			'job',
			'podcast',
		])
		.optional(),
});

const WebsetCriterionSchema = z.object({
	description: z.string(),
	successRate: z.string().optional(),
});

const WebsetSearchConfigSchema = z.object({
	query: z.string(),
	count: z.number().optional(),
	entity: WebsetEntitySchema.optional(),
	criteria: z.array(WebsetCriterionSchema).optional(),
});

const WebsetEnrichmentConfigSchema = z.object({
	description: z.string(),
	format: z.enum(['text', 'date', 'number', 'options', 'boolean']).optional(),
	options: z.array(z.string()).optional(),
});

const WebsetEnrichmentSchema = z.object({
	id: z.string(),
	description: z.string(),
	format: z.enum(['text', 'date', 'number', 'options', 'boolean']),
	options: z.array(z.string()).optional(),
	createdAt: z.string(),
	updatedAt: z.string(),
});

const WebsetImportSchema = z.object({
	id: z.string(),
	object: z.literal('import'),
	websetId: z.string(),
	urls: z.array(z.string()).optional(),
	status: z.enum(['pending', 'processing', 'completed', 'failed']).optional(),
	createdAt: z.string(),
	updatedAt: z.string().optional(),
});

const MonitorCadenceSchema = z.object({
	type: z.enum(['realtime', 'hourly', 'daily', 'weekly']),
});

const WebsetMonitorSchema = z.object({
	id: z.string(),
	object: z.literal('monitor'),
	websetId: z.string(),
	cadence: MonitorCadenceSchema,
	createdAt: z.string(),
	updatedAt: z.string().optional(),
});

export const WebsetSchema = z.object({
	id: z.string(),
	object: z.literal('webset'),
	status: z.enum(['idle', 'running', 'paused', 'done']),
	externalId: z.string().optional(),
	searches: z.array(WebsetSearchConfigSchema).optional(),
	enrichments: z.array(WebsetEnrichmentSchema).optional(),
	imports: z.array(WebsetImportSchema).optional(),
	monitors: z.array(WebsetMonitorSchema).optional(),
	createdAt: z.string(),
	updatedAt: z.string(),
});

const WebsetEventSchema = z.object({
	id: z.string(),
	object: z.literal('event'),
	type: z.string(),
	createdAt: z.string(),
	// Event data shape varies by type
	// unknown is appropriate here since Exa event payloads are heterogeneous
	data: z.unknown().optional(),
});

const WebhookApiSchema = z.object({
	id: z.string(),
	object: z.literal('webhook'),
	url: z.string(),
	events: z.array(z.string()).optional(),
	status: z.enum(['active', 'inactive']).optional(),
	createdAt: z.string(),
	updatedAt: z.string().optional(),
});

const PaginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
	z.object({
		data: z.array(itemSchema),
		hasMore: z.boolean().optional(),
		nextCursor: z.string().optional(),
	});

// ── Input Schemas ────────────────────────────────────────────────────────────

const SearchInputSchema = z.object({
	query: z.string(),
	numResults: z.number().optional(),
	includeDomains: z.array(z.string()).optional(),
	excludeDomains: z.array(z.string()).optional(),
	startCrawlDate: z.string().optional(),
	endCrawlDate: z.string().optional(),
	startPublishedDate: z.string().optional(),
	endPublishedDate: z.string().optional(),
	useAutoprompt: z.boolean().optional(),
	type: z.enum(['keyword', 'neural', 'auto']).optional(),
	category: z.string().optional(),
	contents: ContentsOptionsSchema.optional(),
});

const FindSimilarInputSchema = z.object({
	url: z.string(),
	numResults: z.number().optional(),
	includeDomains: z.array(z.string()).optional(),
	excludeDomains: z.array(z.string()).optional(),
	startCrawlDate: z.string().optional(),
	endCrawlDate: z.string().optional(),
	startPublishedDate: z.string().optional(),
	endPublishedDate: z.string().optional(),
	excludeSourceDomain: z.boolean().optional(),
	category: z.string().optional(),
	contents: ContentsOptionsSchema.optional(),
});

const GetContentsInputSchema = z.object({
	ids: z.array(z.string()),
	text: z.union([ContentsTextOptionsSchema, z.boolean()]).optional(),
	highlights: z
		.union([ContentsHighlightsOptionsSchema, z.boolean()])
		.optional(),
	summary: z.union([ContentsSummaryOptionsSchema, z.boolean()]).optional(),
});

const GetAnswerInputSchema = z.object({
	query: z.string(),
	text: z.boolean().optional(),
	stream: z.boolean().optional(),
});

const WebsetsCreateInputSchema = z.object({
	searches: z.array(WebsetSearchConfigSchema).optional(),
	enrichments: z.array(WebsetEnrichmentConfigSchema).optional(),
	externalId: z.string().optional(),
});

const WebsetsGetInputSchema = z.object({
	id: z.string(),
});

const WebsetsDeleteInputSchema = z.object({
	id: z.string(),
});

const ImportsCreateInputSchema = z.object({
	websetId: z.string(),
	urls: z.array(z.string()),
});

const ImportsListInputSchema = z.object({
	websetId: z.string(),
	cursor: z.string().optional(),
	limit: z.number().optional(),
});

const ImportsDeleteInputSchema = z.object({
	websetId: z.string(),
	importId: z.string(),
});

const MonitorsCreateInputSchema = z.object({
	websetId: z.string(),
	cadence: MonitorCadenceSchema,
});

const EventsListInputSchema = z.object({
	websetId: z.string(),
	cursor: z.string().optional(),
	limit: z.number().optional(),
});

const EventsGetInputSchema = z.object({
	websetId: z.string(),
	eventId: z.string(),
});

const WebhooksApiListInputSchema = z.object({
	cursor: z.string().optional(),
	limit: z.number().optional(),
});

// ── Output Schemas ───────────────────────────────────────────────────────────

const SearchResponseSchema = z.object({
	results: z.array(SearchResultSchema),
	autopromptString: z.string().optional(),
	requestId: z.string().optional(),
});

const FindSimilarResponseSchema = z.object({
	results: z.array(SearchResultSchema),
	requestId: z.string().optional(),
});

const GetContentsResponseSchema = z.object({
	results: z.array(SearchResultSchema),
	requestId: z.string().optional(),
});

const GetAnswerResponseSchema = z.object({
	answer: z.string(),
	citations: z.array(SearchResultSchema).optional(),
	requestId: z.string().optional(),
});

const WebsetsDeleteResponseSchema = z.object({
	id: z.string(),
	object: z.literal('webset'),
	deleted: z.boolean(),
});

const ImportsDeleteResponseSchema = z.object({
	id: z.string(),
	deleted: z.boolean(),
});

const ImportsListResponseSchema = PaginatedResponseSchema(WebsetImportSchema);
const EventsListResponseSchema = PaginatedResponseSchema(WebsetEventSchema);
const WebhooksApiListResponseSchema = PaginatedResponseSchema(WebhookApiSchema);

// ── Type Exports ─────────────────────────────────────────────────────────────

export type SearchInput = z.infer<typeof SearchInputSchema>;
export type FindSimilarInput = z.infer<typeof FindSimilarInputSchema>;
export type GetContentsInput = z.infer<typeof GetContentsInputSchema>;
export type GetAnswerInput = z.infer<typeof GetAnswerInputSchema>;
export type WebsetsCreateInput = z.infer<typeof WebsetsCreateInputSchema>;
export type WebsetsGetInput = z.infer<typeof WebsetsGetInputSchema>;
export type WebsetsDeleteInput = z.infer<typeof WebsetsDeleteInputSchema>;
export type ImportsCreateInput = z.infer<typeof ImportsCreateInputSchema>;
export type ImportsListInput = z.infer<typeof ImportsListInputSchema>;
export type ImportsDeleteInput = z.infer<typeof ImportsDeleteInputSchema>;
export type MonitorsCreateInput = z.infer<typeof MonitorsCreateInputSchema>;
export type EventsListInput = z.infer<typeof EventsListInputSchema>;
export type EventsGetInput = z.infer<typeof EventsGetInputSchema>;
export type WebhooksApiListInput = z.infer<typeof WebhooksApiListInputSchema>;

export type SearchResult = z.infer<typeof SearchResultSchema>;
export type SearchResponse = z.infer<typeof SearchResponseSchema>;
export type FindSimilarResponse = z.infer<typeof FindSimilarResponseSchema>;
export type GetContentsResponse = z.infer<typeof GetContentsResponseSchema>;
export type GetAnswerResponse = z.infer<typeof GetAnswerResponseSchema>;
export type Webset = z.infer<typeof WebsetSchema>;
export type WebsetImport = z.infer<typeof WebsetImportSchema>;
export type WebsetMonitor = z.infer<typeof WebsetMonitorSchema>;
export type WebsetEvent = z.infer<typeof WebsetEventSchema>;
export type WebhookApi = z.infer<typeof WebhookApiSchema>;
export type WebsetsDeleteResponse = z.infer<typeof WebsetsDeleteResponseSchema>;
export type ImportsDeleteResponse = z.infer<typeof ImportsDeleteResponseSchema>;
export type ImportsListResponse = z.infer<typeof ImportsListResponseSchema>;
export type EventsListResponse = z.infer<typeof EventsListResponseSchema>;
export type WebhooksApiListResponse = z.infer<
	typeof WebhooksApiListResponseSchema
>;

// ── Endpoint I/O Maps ─────────────────────────────────────────────────────────

export type ExaEndpointInputs = {
	searchSearch: SearchInput;
	searchFindSimilar: FindSimilarInput;
	contentsGet: GetContentsInput;
	answerGet: GetAnswerInput;
	websetsCreate: WebsetsCreateInput;
	websetsGet: WebsetsGetInput;
	websetsDelete: WebsetsDeleteInput;
	importsCreate: ImportsCreateInput;
	importsList: ImportsListInput;
	importsDelete: ImportsDeleteInput;
	monitorsCreate: MonitorsCreateInput;
	eventsList: EventsListInput;
	eventsGet: EventsGetInput;
	webhooksApiList: WebhooksApiListInput;
};

export type ExaEndpointOutputs = {
	searchSearch: SearchResponse;
	searchFindSimilar: FindSimilarResponse;
	contentsGet: GetContentsResponse;
	answerGet: GetAnswerResponse;
	websetsCreate: Webset;
	websetsGet: Webset;
	websetsDelete: WebsetsDeleteResponse;
	importsCreate: WebsetImport;
	importsList: ImportsListResponse;
	importsDelete: ImportsDeleteResponse;
	monitorsCreate: WebsetMonitor;
	eventsList: EventsListResponse;
	eventsGet: WebsetEvent;
	webhooksApiList: WebhooksApiListResponse;
};

export const ExaEndpointInputSchemas = {
	searchSearch: SearchInputSchema,
	searchFindSimilar: FindSimilarInputSchema,
	contentsGet: GetContentsInputSchema,
	answerGet: GetAnswerInputSchema,
	websetsCreate: WebsetsCreateInputSchema,
	websetsGet: WebsetsGetInputSchema,
	websetsDelete: WebsetsDeleteInputSchema,
	importsCreate: ImportsCreateInputSchema,
	importsList: ImportsListInputSchema,
	importsDelete: ImportsDeleteInputSchema,
	monitorsCreate: MonitorsCreateInputSchema,
	eventsList: EventsListInputSchema,
	eventsGet: EventsGetInputSchema,
	webhooksApiList: WebhooksApiListInputSchema,
} as const;

export const ExaEndpointOutputSchemas = {
	searchSearch: SearchResponseSchema,
	searchFindSimilar: FindSimilarResponseSchema,
	contentsGet: GetContentsResponseSchema,
	answerGet: GetAnswerResponseSchema,
	websetsCreate: WebsetSchema,
	websetsGet: WebsetSchema,
	websetsDelete: WebsetsDeleteResponseSchema,
	importsCreate: WebsetImportSchema,
	importsList: ImportsListResponseSchema,
	importsDelete: ImportsDeleteResponseSchema,
	monitorsCreate: WebsetMonitorSchema,
	eventsList: EventsListResponseSchema,
	eventsGet: WebsetEventSchema,
	webhooksApiList: WebhooksApiListResponseSchema,
} as const;
