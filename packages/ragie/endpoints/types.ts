import { FileInputSchema } from 'corsair/http';
import { z } from 'zod';

// An agent sends JSON (a link or base64); a Blob or File still works from
// TypeScript.
const UploadFileSchema = z
	.union([FileInputSchema, z.instanceof(Blob)])
	.describe(
		'The file: a public URL, {url, filename?, contentType?}, or {base64, filename?, contentType?}; or a Blob or File from TypeScript.',
	);

/*
 * Every wire field name here is snake_case exactly as Ragie sends it; nothing
 * is normalised. Response shapes are taken from the official Speakeasy SDK
 * (generated from api.ragie.ai/openapi.json) and are UNVERIFIED against the
 * live API: output objects are `.loose()` and SDK-optional output fields are
 * `.nullish()`, so a field Ragie adds or omits cannot fail a call that has
 * already happened.
 */

/** Metadata values as documents and connections carry them. */
const MetadataValueSchema = z.union([
	z.string(),
	z.number(),
	z.boolean(),
	z.array(z.string()),
]);

// Ragie deletes a metadata key when a patch sets it to null.
const PatchMetadataValueSchema = z.union([
	z.string(),
	z.number(),
	z.boolean(),
	z.array(z.string()),
	z.null(),
]);

export const DOCUMENT_STATUSES = [
	'pending',
	'partitioning',
	'partitioned',
	'refined',
	'chunked',
	'indexed',
	'summary_indexed',
	'keyword_indexed',
	'ready',
	'failed',
] as const;

export const RESPONSE_STATUSES = [
	'in_progress',
	'completed',
	'failed',
	'cancelled',
] as const;

const PageParamsSchema = {
	cursor: z
		.string()
		.optional()
		.describe('The next page cursor from a previous response.'),
	page_size: z
		.number()
		.int()
		.positive()
		.max(100)
		.optional()
		.describe('Page size; Ragie documents 100 as the maximum.'),
};

// ── shared output shapes ───────────────────────────────────────────────────

/**
 * Document fields in Ragie's wire spelling. `status` stays a plain string so
 * a value the schema does not name cannot fail a read; `documents.get` pins
 * the enum because
 * the job runner reads statuses through it.
 */
const DocumentFields = {
	id: z.string(),
	status: z.string().nullish(),
	name: z.string(),
	external_id: z.string().nullish(),
	metadata: z.record(z.string(), MetadataValueSchema),
	partition: z.string(),
	chunk_count: z.number().int().nullish(),
	page_count: z.number().nullish(),
	created_at: z.string(),
	updated_at: z.string(),
};

const DocumentSchema = z.object(DocumentFields).loose();

// unknown: links carry Ragie's own HATEOAS-style objects, whose fields are not
// in the saved SDK models.
const LinksSchema = z.record(z.string(), z.unknown());

const ChunkSchema = z
	.object({
		id: z.string(),
		index: z.number().int().nullish(),
		text: z.string(),
		// unknown: provider-defined key/values.
		metadata: z.record(z.string(), z.unknown()).nullish(),
		links: LinksSchema.nullish(),
	})
	.loose();

const ScoredChunkSchema = z
	.object({
		text: z.string(),
		score: z.number(),
		id: z.string(),
		index: z.number().int(),
		// unknown: provider-defined key/values.
		metadata: z.record(z.string(), z.unknown()).nullish(),
		document_id: z.string(),
		document_name: z.string(),
		document_metadata: z.record(z.string(), MetadataValueSchema),
		links: LinksSchema.nullish(),
	})
	.loose();

// Ragie's response objects (steps, tool calls) are a union of SDK sub-models
// that were not saved with the research; they pass through as sent.
// unknown: reasoning output, tool call outputs and messages.
const OutputStepsSchema = z.array(z.unknown());

const ResponseUsageSchema = z
	.object({
		input_tokens: z.number().nullish(),
		output_tokens: z.number().nullish(),
		total_tokens: z.number().nullish(),
	})
	.loose();

/**
 * The agentic response object. The SDK defaults several fields client-side
 * (`object`, `model`, `store`, …), meaning the wire can omit them, so they are
 * nullish here.
 */
const ResponseFields = {
	id: z.string(),
	object: z.string().nullish(),
	created_at: z.number().int(),
	status: z.enum(RESPONSE_STATUSES),
	error: z.string().nullish(),
	incomplete_details: z.unknown().nullish(), // unknown: SDK types it any.
	instructions: z.string().nullish(),
	max_output_tokens: z.unknown().nullish(), // unknown: SDK types it any.
	model: z.string().nullish(),
	output: OutputStepsSchema,
	output_parsed: z.unknown().nullish(), // unknown: FinalAnswer in the SDK; not in the saved models.
	tools: z.array(z.unknown()).nullish(), // unknown: tool descriptors, SDK shape not saved.
	reasoning: z.unknown().nullish(), // unknown: reasoning settings, SDK shape not saved.
	parallel_tool_calls: z.boolean().nullish(),
	store: z.boolean().nullish(),
	temperature: z.number().nullish(),
	previous_response_id: z.string().nullish(),
	tool_choice: z.string().nullish(),
	top_p: z.number().nullish(),
	truncation: z.string().nullish(),
	usage: ResponseUsageSchema,
	user: z.unknown().nullish(), // unknown: SDK types it any.
	// unknown: provider-defined key/values.
	metadata: z.record(z.string(), z.unknown()).nullish(),
};

const ConnectionFields = {
	id: z.string(),
	created_at: z.string(),
	updated_at: z.string(),
	metadata: z.record(z.string(), MetadataValueSchema),
	type: z.string(),
	name: z.string(),
	source: z
		.union([
			z.string(),
			z.array(z.string()),
			// unknown: source settings vary per connector type.
			z.record(z.string(), z.unknown()),
		])
		.nullish(),
	enabled: z.boolean(),
	disabled_by_system_reason: z.union([
		z.enum([
			'connection_over_total_page_limit',
			'authentication_failed',
			'tenant_account_disabled',
		]),
		z.null(),
	]),
	last_synced_at: z.string().nullish(),
	syncing: z.boolean().nullish(),
	partition: z.string().nullish(),
	page_limit: z.union([z.number().int(), z.null()]),
	// unknown: per-entity sync filters, SDK shape not in the saved models.
	sync_filter: z.record(z.string(), z.unknown()),
	disabled_by_system: z.boolean(),
};

const ConnectionSchema = z.object(ConnectionFields).loose();

// Ragie's `ResponseOK`: the SDK names the type but no model page was saved.
const ResponseOKSchema = z.object({}).loose();

const WebhookEndpointSchema = z
	.object({
		id: z.string(),
		created_at: z.string(),
		updated_at: z.string(),
		name: z.string(),
		url: z.string(),
		partition_pattern: z.union([z.string(), z.null()]),
		active: z.boolean(),
		// The signing secret for deliveries to this endpoint.
		secret: z.string(),
	})
	.loose();

// ── documents ──────────────────────────────────────────────────────────────

const DocumentsListInputSchema = z.object({
	filter: z
		.string()
		.optional()
		.describe(
			'A metadata filter as a JSON string, such as \'{"department":"sales"}\'.',
		),
	partition: z.string().optional(),
	...PageParamsSchema,
});

const DocumentsListResponseSchema = z
	.object({
		documents: z.array(DocumentSchema),
		cursor: z.string().nullish(),
	})
	.loose();

const DocumentsQuery = {
	filter: z.string().optional(),
	partition: z.string().optional(),
	cursor: z.string().optional(),
	page_size: z.number().int().positive().max(100).optional(),
};

const DocumentCreateParams = {
	mode: z
		.enum(['fast', 'hi_res'])
		.optional()
		.describe('How PDFs are processed. Defaults to fast.'),
	metadata: z.record(z.string(), MetadataValueSchema).optional(),
	name: z.string().optional(),
	external_id: z.string().optional(),
	partition: z.string().optional(),
};

const DocumentsCreateInputSchema = z.object({
	file: UploadFileSchema,
	...DocumentCreateParams,
});

const DocumentsRawCreateInputSchema = z.object({
	data: z.string().min(1).describe('The raw text to ingest.'),
	...DocumentCreateParams,
});

const DocumentsUrlCreateInputSchema = z.object({
	url: z.string().url().describe('The URL to fetch and ingest.'),
	...DocumentCreateParams,
});

const DocumentIdInputSchema = z.object({
	document_id: z.string().min(1).describe("The document's `id`."),
});

// `documents.get` is the job status read, so its status is the documented
// enum; every other read keeps the plain string above.
const DocumentGetResponseSchema = z
	.object({
		...DocumentFields,
		status: z.enum(DOCUMENT_STATUSES),
	})
	.loose();

const DocumentDeleteInputSchema = DocumentIdInputSchema;

const DocumentUpdateFileInputSchema = z.object({
	document_id: z.string().min(1),
	file: UploadFileSchema,
	partition: z.string().optional(),
});

const DocumentUpdateRawInputSchema = z.object({
	document_id: z.string().min(1),
	data: z.string().min(1).describe('The replacement raw text.'),
	partition: z.string().optional(),
});

const DocumentUpdateUrlInputSchema = z.object({
	document_id: z.string().min(1),
	url: z
		.string()
		.url()
		.describe('The URL to fetch as the replacement content.'),
	partition: z.string().optional(),
});

const DocumentPatchMetadataInputSchema = z.object({
	document_id: z.string().min(1),
	metadata: z
		.record(z.string(), PatchMetadataValueSchema)
		.describe('Metadata to merge; a null value deletes that key.'),
});

const DocumentChunksInputSchema = z.object({
	document_id: z.string().min(1),
	...PageParamsSchema,
});

const DocumentChunksResponseSchema = z
	.object({
		chunks: z.array(ChunkSchema),
		cursor: z.string().nullish(),
	})
	.loose();

const DocumentContentInputSchema = DocumentIdInputSchema;

// `media_type` is not offered: application/json is the default answer, and the
// audio and video values stream binary, which corsair/http cannot return.
const DocumentContentResponseSchema = z
	.object({
		...DocumentFields,
		content: z.string().nullish(),
	})
	.loose();

const DocumentSummaryInputSchema = DocumentIdInputSchema;

// unknown: the SDK names the type DocumentSummary but its model page was not
// saved; the summary text is the one documented field.
const DocumentSummaryResponseSchema = z
	.object({
		summary: z.string().nullish(),
	})
	.loose();

// ── retrievals ─────────────────────────────────────────────────────────────

const RetrievalsRetrieveInputSchema = z.object({
	query: z.string().min(1).describe('The text to search for.'),
	top_k: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Maximum chunks to return. Defaults to 8.'),
	filter: z
		// unknown: the operator structure is provider-defined.
		.record(z.string(), z.unknown())
		.optional()
		.describe(
			'A metadata filter object using $eq, $ne, $gt, $gte, $lt, $lte, $in or $nin.',
		),
	rerank: z
		.boolean()
		.optional()
		.describe(
			'Rerank chunks for semantic relevancy after retrieval. Slower but sharper.',
		),
	max_chunks_per_document: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Beta. Cap per document to widen the set of documents returned.'),
	partition: z.string().optional(),
	recency_bias: z
		.boolean()
		.optional()
		.describe('Favor more recent documents over older ones.'),
});

const RetrievalsRetrieveResponseSchema = z
	.object({
		scored_chunks: z.array(ScoredChunkSchema),
	})
	.loose();

// ── connections ────────────────────────────────────────────────────────────

const ConnectionsListInputSchema = z.object(PageParamsSchema);

const ConnectionsListResponseSchema = z
	.object({
		connections: z.array(ConnectionSchema),
		cursor: z.string().nullish(),
	})
	.loose();

const ConnectionIdInputSchema = z.object({
	connection_id: z.string().min(1).describe("The connection's `id`."),
});

const ConnectionsGetInputSchema = ConnectionIdInputSchema;

const ConnectionsListSourceTypesInputSchema = z.object({});

// unknown: each element is source-type metadata (name, OAuth flags) whose
// fields the SDK does not spell out in the saved models.
const ConnectionsListSourceTypesResponseSchema = z
	.object({
		source_types: z.array(z.record(z.string(), z.unknown())),
	})
	.loose();

const ConnectionsCreateInputSchema = z.object({
	connection: z
		.object({
			provider: z
				.string()
				.min(1)
				.describe(
					'A non-OAuth connector, such as s3_compatible, gcs, freshdesk, zendesk, intercom or web_crawler; list them with connections.listSourceTypes.',
				),
			data: z
				// unknown: settings vary per provider.
				.record(z.string(), z.unknown())
				.describe('Connection settings; the fields depend on the provider.'),
			credentials: z
				// unknown: credential fields vary per provider.
				.record(z.string(), z.unknown())
				.optional()
				.describe('Provider credentials, such as keys or tokens.'),
		})
		.loose(),
	partition_strategy: z
		// unknown: the strategy shape is provider-defined.
		.record(z.string(), z.unknown())
		.optional()
		.describe('How ingested files land in partitions.'),
	page_limit: z
		.number()
		.int()
		.positive()
		.nullish()
		.describe('Monthly page cap for this connection.'),
});

const ConnectionsCreateOAuthRedirectUrlInputSchema = z.object({
	redirect_uri: z.string().url().describe('Where Ragie sends the user back.'),
	source_type: z
		.string()
		.min(1)
		.describe('An OAuth connector, such as google_drive or notion.'),
	partition: z.string().optional(),
	page_limit: z.number().int().positive().nullish(),
});

const ConnectionsCreateOAuthRedirectUrlResponseSchema = z
	.object({
		url: z.string().describe('The short-lived URL to open the OAuth flow at.'),
	})
	.loose();

const ConnectionsUpdateInputSchema = z.object({
	connection_id: z.string().min(1),
	metadata: z.record(z.string(), MetadataValueSchema).optional(),
	mode: z
		.string()
		.optional()
		.describe(
			'Sync mode; the reachable sources document no value list, so it is sent unchanged.',
		),
	// unknown: the strategy shape is provider-defined.
	partition_strategy: z.record(z.string(), z.unknown()).optional(),
	page_limit: z.number().int().positive().nullish(),
});

const ConnectionsSyncInputSchema = ConnectionIdInputSchema;

const ConnectionsSyncResponseSchema = ResponseOKSchema;

const ConnectionsDeleteInputSchema = z.object({
	connection_id: z.string().min(1),
	keep_files: z
		.boolean()
		.describe(
			'Keep the ingested documents when the connection is removed. With false every document from this connection is deleted and cannot be recovered.',
		),
});

const ConnectionsDeleteResponseSchema = z.record(z.string(), z.string());

const ConnectionsSetEnabledInputSchema = z.object({
	connection_id: z.string().min(1),
	enabled: z.boolean().describe('Whether the connection syncs.'),
});

const ConnectionsSetLimitsInputSchema = z.object({
	connection_id: z.string().min(1),
	page_limit: z
		.union([z.number().int().positive(), z.null()])
		.describe(
			'Monthly pages the connection may sync. Sending null removes the limit.',
		),
});

// ── responses ──────────────────────────────────────────────────────────────

const ResponsesCreateInputSchema = z.object({
	input: z
		.string()
		.min(1)
		.describe('What to answer, grounded in retrieved documents.'),
});

const ResponsesCreateResponseSchema = z.object(ResponseFields).loose();

const ResponsesGetInputSchema = z.object({
	response_id: z.string().min(1).describe("The response's `id`."),
});

const ResponsesGetResponseSchema = ResponsesCreateResponseSchema;

// ── webhook endpoints ──────────────────────────────────────────────────────

const WebhookEndpointsListInputSchema = z.object(PageParamsSchema);

const WebhookEndpointsListResponseSchema = z
	.object({
		webhook_endpoints: z.array(WebhookEndpointSchema),
		cursor: z.string().nullish(),
	})
	.loose();

const WebhookEndpointsCreateInputSchema = z.object({
	name: z.string().optional(),
	url: z.string().url().describe('Where Ragie POSTs tenant events.'),
	partition_pattern: z
		.string()
		.optional()
		.describe(
			'Pattern choosing which partitions a delivery is for; null receives all.',
		),
});

const WebhookEndpointIdInputSchema = z.object({
	endpoint_id: z.string().min(1).describe("The webhook endpoint's `id`."),
});

const WebhookEndpointsGetInputSchema = WebhookEndpointIdInputSchema;

const WebhookEndpointsUpdateInputSchema = z.object({
	endpoint_id: z.string().min(1),
	name: z.string().optional(),
	url: z.string().url().optional(),
	partition_pattern: z.string().nullish(),
	active: z.boolean().optional(),
});

const WebhookEndpointsDeleteInputSchema = WebhookEndpointIdInputSchema;

const WebhookEndpointsDeleteResponseSchema = ResponseOKSchema;

// ── registries ─────────────────────────────────────────────────────────────

export type RagieEndpointInputs = {
	documentsList: z.input<typeof DocumentsListInputSchema>;
	documentsCreate: z.input<typeof DocumentsCreateInputSchema>;
	documentsCreateRaw: z.input<typeof DocumentsRawCreateInputSchema>;
	documentsCreateFromUrl: z.input<typeof DocumentsUrlCreateInputSchema>;
	documentsGet: z.input<typeof DocumentIdInputSchema>;
	documentsDelete: z.input<typeof DocumentDeleteInputSchema>;
	documentsUpdateFile: z.input<typeof DocumentUpdateFileInputSchema>;
	documentsUpdateRaw: z.input<typeof DocumentUpdateRawInputSchema>;
	documentsUpdateFromUrl: z.input<typeof DocumentUpdateUrlInputSchema>;
	documentsPatchMetadata: z.input<typeof DocumentPatchMetadataInputSchema>;
	documentsGetChunks: z.input<typeof DocumentChunksInputSchema>;
	documentsGetContent: z.input<typeof DocumentContentInputSchema>;
	documentsGetSummary: z.input<typeof DocumentSummaryInputSchema>;
	retrievalsRetrieve: z.input<typeof RetrievalsRetrieveInputSchema>;
	connectionsList: z.input<typeof ConnectionsListInputSchema>;
	connectionsGet: z.input<typeof ConnectionsGetInputSchema>;
	connectionsListSourceTypes: z.input<
		typeof ConnectionsListSourceTypesInputSchema
	>;
	connectionsCreate: z.input<typeof ConnectionsCreateInputSchema>;
	connectionsCreateOAuthRedirectUrl: z.input<
		typeof ConnectionsCreateOAuthRedirectUrlInputSchema
	>;
	connectionsUpdate: z.input<typeof ConnectionsUpdateInputSchema>;
	connectionsSync: z.input<typeof ConnectionsSyncInputSchema>;
	connectionsDelete: z.input<typeof ConnectionsDeleteInputSchema>;
	connectionsSetEnabled: z.input<typeof ConnectionsSetEnabledInputSchema>;
	connectionsSetLimits: z.input<typeof ConnectionsSetLimitsInputSchema>;
	responsesCreate: z.input<typeof ResponsesCreateInputSchema>;
	responsesGet: z.input<typeof ResponsesGetInputSchema>;
	webhookEndpointsList: z.input<typeof WebhookEndpointsListInputSchema>;
	webhookEndpointsCreate: z.input<typeof WebhookEndpointsCreateInputSchema>;
	webhookEndpointsGet: z.input<typeof WebhookEndpointsGetInputSchema>;
	webhookEndpointsUpdate: z.input<typeof WebhookEndpointsUpdateInputSchema>;
	webhookEndpointsDelete: z.input<typeof WebhookEndpointsDeleteInputSchema>;
};

export type RagieEndpointOutputs = {
	documentsList: z.output<typeof DocumentsListResponseSchema>;
	documentsCreate: z.output<typeof DocumentSchema>;
	documentsCreateRaw: z.output<typeof DocumentSchema>;
	documentsCreateFromUrl: z.output<typeof DocumentSchema>;
	documentsGet: z.output<typeof DocumentGetResponseSchema>;
	documentsDelete: z.output<typeof ResponseOKSchema>;
	documentsUpdateFile: z.output<typeof DocumentSchema>;
	documentsUpdateRaw: z.output<typeof DocumentSchema>;
	documentsUpdateFromUrl: z.output<typeof DocumentSchema>;
	documentsPatchMetadata: z.output<typeof DocumentSchema>;
	documentsGetChunks: z.output<typeof DocumentChunksResponseSchema>;
	documentsGetContent: z.output<typeof DocumentContentResponseSchema>;
	documentsGetSummary: z.output<typeof DocumentSummaryResponseSchema>;
	retrievalsRetrieve: z.output<typeof RetrievalsRetrieveResponseSchema>;
	connectionsList: z.output<typeof ConnectionsListResponseSchema>;
	connectionsGet: z.output<typeof ConnectionSchema>;
	connectionsListSourceTypes: z.output<
		typeof ConnectionsListSourceTypesResponseSchema
	>;
	connectionsCreate: z.output<typeof ConnectionSchema>;
	connectionsCreateOAuthRedirectUrl: z.output<
		typeof ConnectionsCreateOAuthRedirectUrlResponseSchema
	>;
	connectionsUpdate: z.output<typeof ConnectionSchema>;
	connectionsSync: z.output<typeof ConnectionsSyncResponseSchema>;
	connectionsDelete: z.output<typeof ConnectionsDeleteResponseSchema>;
	connectionsSetEnabled: z.output<typeof ConnectionSchema>;
	connectionsSetLimits: z.output<typeof ConnectionSchema>;
	responsesCreate: z.output<typeof ResponsesCreateResponseSchema>;
	responsesGet: z.output<typeof ResponsesGetResponseSchema>;
	webhookEndpointsList: z.output<typeof WebhookEndpointsListResponseSchema>;
	webhookEndpointsCreate: z.output<typeof WebhookEndpointSchema>;
	webhookEndpointsGet: z.output<typeof WebhookEndpointSchema>;
	webhookEndpointsUpdate: z.output<typeof WebhookEndpointSchema>;
	webhookEndpointsDelete: z.output<typeof WebhookEndpointsDeleteResponseSchema>;
};

export const RagieEndpointInputSchemas = {
	documentsList: DocumentsListInputSchema,
	documentsCreate: DocumentsCreateInputSchema,
	documentsCreateRaw: DocumentsRawCreateInputSchema,
	documentsCreateFromUrl: DocumentsUrlCreateInputSchema,
	documentsGet: DocumentIdInputSchema,
	documentsDelete: DocumentDeleteInputSchema,
	documentsUpdateFile: DocumentUpdateFileInputSchema,
	documentsUpdateRaw: DocumentUpdateRawInputSchema,
	documentsUpdateFromUrl: DocumentUpdateUrlInputSchema,
	documentsPatchMetadata: DocumentPatchMetadataInputSchema,
	documentsGetChunks: DocumentChunksInputSchema,
	documentsGetContent: DocumentContentInputSchema,
	documentsGetSummary: DocumentSummaryInputSchema,
	retrievalsRetrieve: RetrievalsRetrieveInputSchema,
	connectionsList: ConnectionsListInputSchema,
	connectionsGet: ConnectionsGetInputSchema,
	connectionsListSourceTypes: ConnectionsListSourceTypesInputSchema,
	connectionsCreate: ConnectionsCreateInputSchema,
	connectionsCreateOAuthRedirectUrl:
		ConnectionsCreateOAuthRedirectUrlInputSchema,
	connectionsUpdate: ConnectionsUpdateInputSchema,
	connectionsSync: ConnectionsSyncInputSchema,
	connectionsDelete: ConnectionsDeleteInputSchema,
	connectionsSetEnabled: ConnectionsSetEnabledInputSchema,
	connectionsSetLimits: ConnectionsSetLimitsInputSchema,
	responsesCreate: ResponsesCreateInputSchema,
	responsesGet: ResponsesGetInputSchema,
	webhookEndpointsList: WebhookEndpointsListInputSchema,
	webhookEndpointsCreate: WebhookEndpointsCreateInputSchema,
	webhookEndpointsGet: WebhookEndpointsGetInputSchema,
	webhookEndpointsUpdate: WebhookEndpointsUpdateInputSchema,
	webhookEndpointsDelete: WebhookEndpointsDeleteInputSchema,
} as const;

export const RagieEndpointOutputSchemas = {
	documentsList: DocumentsListResponseSchema,
	documentsCreate: DocumentSchema,
	documentsCreateRaw: DocumentSchema,
	documentsCreateFromUrl: DocumentSchema,
	documentsGet: DocumentGetResponseSchema,
	documentsDelete: ResponseOKSchema,
	documentsUpdateFile: DocumentSchema,
	documentsUpdateRaw: DocumentSchema,
	documentsUpdateFromUrl: DocumentSchema,
	documentsPatchMetadata: DocumentSchema,
	documentsGetChunks: DocumentChunksResponseSchema,
	documentsGetContent: DocumentContentResponseSchema,
	documentsGetSummary: DocumentSummaryResponseSchema,
	retrievalsRetrieve: RetrievalsRetrieveResponseSchema,
	connectionsList: ConnectionsListResponseSchema,
	connectionsGet: ConnectionSchema,
	connectionsListSourceTypes: ConnectionsListSourceTypesResponseSchema,
	connectionsCreate: ConnectionSchema,
	connectionsCreateOAuthRedirectUrl:
		ConnectionsCreateOAuthRedirectUrlResponseSchema,
	connectionsUpdate: ConnectionSchema,
	connectionsSync: ConnectionsSyncResponseSchema,
	connectionsDelete: ConnectionsDeleteResponseSchema,
	connectionsSetEnabled: ConnectionSchema,
	connectionsSetLimits: ConnectionSchema,
	responsesCreate: ResponsesCreateResponseSchema,
	responsesGet: ResponsesGetResponseSchema,
	webhookEndpointsList: WebhookEndpointsListResponseSchema,
	webhookEndpointsCreate: WebhookEndpointSchema,
	webhookEndpointsGet: WebhookEndpointSchema,
	webhookEndpointsUpdate: WebhookEndpointSchema,
	webhookEndpointsDelete: WebhookEndpointsDeleteResponseSchema,
} as const;

export {
	DocumentSchema,
	ConnectionSchema,
	WebhookEndpointSchema,
	ScoredChunkSchema,
	ChunkSchema,
	ResponseOKSchema,
	DocumentsQuery,
};
