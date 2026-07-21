import { z } from 'zod';

const MetadataSchema = z.record(z.string(), z.string()).nullable().optional();

const ExpiresAfterSchema = z
	.object({
		anchor: z.literal('last_active_at'),
		days: z.number(),
	})
	.optional();

const ChunkingStrategySchema = z
	.union([
		z.object({ type: z.literal('auto') }),
		z.object({
			type: z.literal('static'),
			static: z.object({
				max_chunk_size_tokens: z.number(),
				chunk_overlap_tokens: z.number(),
			}),
		}),
	])
	.optional();

const FileCountsSchema = z.object({
	in_progress: z.number(),
	completed: z.number(),
	failed: z.number(),
	cancelled: z.number(),
	total: z.number(),
});

const VectorStoreObjectSchema = z.object({
	id: z.string(),
	object: z.literal('vector_store'),
	created_at: z.number(),
	name: z.string().nullable().optional(),
	usage_bytes: z.number(),
	file_counts: FileCountsSchema,
	status: z.enum(['expired', 'in_progress', 'completed']),
	expires_after: ExpiresAfterSchema,
	expires_at: z.number().nullable().optional(),
	last_active_at: z.number().nullable().optional(),
	metadata: z.record(z.string(), z.string()).nullable().optional(),
});
export type VectorStoreObject = z.infer<typeof VectorStoreObjectSchema>;

// --- Vector Stores ---

export const VectorStoresCreateInputSchema = z.object({
	name: z.string().optional(),
	fileIds: z.array(z.string()).optional(),
	expiresAfter: ExpiresAfterSchema,
	chunkingStrategy: ChunkingStrategySchema,
	metadata: MetadataSchema,
});
export type VectorStoresCreateInput = z.infer<
	typeof VectorStoresCreateInputSchema
>;
export const VectorStoresCreateResponseSchema = VectorStoreObjectSchema;
export type VectorStoresCreateResponse = z.infer<
	typeof VectorStoresCreateResponseSchema
>;

export const VectorStoresListInputSchema = z.object({
	limit: z.number().optional(),
	order: z.enum(['asc', 'desc']).optional(),
	after: z.string().optional(),
	before: z.string().optional(),
});
export type VectorStoresListInput = z.infer<typeof VectorStoresListInputSchema>;
export const VectorStoresListResponseSchema = z.object({
	object: z.literal('list'),
	data: z.array(VectorStoreObjectSchema),
	first_id: z.string().optional(),
	last_id: z.string().optional(),
	has_more: z.boolean(),
});
export type VectorStoresListResponse = z.infer<
	typeof VectorStoresListResponseSchema
>;

export const VectorStoresRetrieveInputSchema = z.object({
	vectorStoreId: z.string(),
});
export type VectorStoresRetrieveInput = z.infer<
	typeof VectorStoresRetrieveInputSchema
>;
export const VectorStoresRetrieveResponseSchema = VectorStoreObjectSchema;
export type VectorStoresRetrieveResponse = z.infer<
	typeof VectorStoresRetrieveResponseSchema
>;

export const VectorStoresModifyInputSchema = z.object({
	vectorStoreId: z.string(),
	name: z.string().nullable().optional(),
	expiresAfter: ExpiresAfterSchema,
	metadata: MetadataSchema,
});
export type VectorStoresModifyInput = z.infer<
	typeof VectorStoresModifyInputSchema
>;
export const VectorStoresModifyResponseSchema = VectorStoreObjectSchema;
export type VectorStoresModifyResponse = z.infer<
	typeof VectorStoresModifyResponseSchema
>;

export const VectorStoresDeleteInputSchema = z.object({
	vectorStoreId: z.string(),
});
export type VectorStoresDeleteInput = z.infer<
	typeof VectorStoresDeleteInputSchema
>;
export const VectorStoresDeleteResponseSchema = z.object({
	id: z.string(),
	object: z.literal('vector_store.deleted'),
	deleted: z.boolean(),
});
export type VectorStoresDeleteResponse = z.infer<
	typeof VectorStoresDeleteResponseSchema
>;

const SearchResultContentSchema = z.object({
	type: z.literal('text'),
	text: z.string(),
});

export const VectorStoresSearchInputSchema = z.object({
	vectorStoreId: z.string(),
	query: z.union([z.string(), z.array(z.string())]),
	// Filter shape is a comparison/compound-filter tree whose structure varies by operator; kept loose.
	filters: z.record(z.string(), z.unknown()).optional(),
	maxNumResults: z.number().optional(),
	rankingOptions: z
		.object({
			ranker: z.string().optional(),
			score_threshold: z.number().optional(),
		})
		.optional(),
	rewriteQuery: z.boolean().optional(),
});
export type VectorStoresSearchInput = z.infer<
	typeof VectorStoresSearchInputSchema
>;

export const VectorStoresSearchResponseSchema = z.object({
	object: z.literal('vector_store.search_results.page'),
	search_query: z.array(z.string()),
	data: z.array(
		z.object({
			file_id: z.string(),
			filename: z.string(),
			score: z.number(),
			// See VectorStoreFileObjectSchema below: file attributes are caller-defined key/value metadata, kept loose.
			attributes: z.record(z.string(), z.unknown()).nullable().optional(),
			content: z.array(SearchResultContentSchema),
		}),
	),
	has_more: z.boolean(),
	next_page: z.string().nullable().optional(),
});
export type VectorStoresSearchResponse = z.infer<
	typeof VectorStoresSearchResponseSchema
>;

// --- Vector Store Files ---

const VectorStoreFileObjectSchema = z.object({
	id: z.string(),
	object: z.literal('vector_store.file'),
	usage_bytes: z.number(),
	created_at: z.number(),
	vector_store_id: z.string(),
	status: z.enum(['in_progress', 'completed', 'cancelled', 'failed']),
	last_error: z
		.object({ code: z.string(), message: z.string() })
		.nullable()
		.optional(),
	// File attributes are arbitrary caller-defined key/value metadata used for filtering search results; kept loose.
	attributes: z.record(z.string(), z.unknown()).nullable().optional(),
});
export type VectorStoreFileObject = z.infer<typeof VectorStoreFileObjectSchema>;

export const VectorStoreFilesCreateInputSchema = z.object({
	vectorStoreId: z.string(),
	fileId: z.string(),
	chunkingStrategy: ChunkingStrategySchema,
	// See VectorStoreFileObjectSchema above: caller-defined key/value metadata, kept loose.
	attributes: z.record(z.string(), z.unknown()).nullable().optional(),
});
export type VectorStoreFilesCreateInput = z.infer<
	typeof VectorStoreFilesCreateInputSchema
>;
export const VectorStoreFilesCreateResponseSchema = VectorStoreFileObjectSchema;
export type VectorStoreFilesCreateResponse = z.infer<
	typeof VectorStoreFilesCreateResponseSchema
>;

export const VectorStoreFilesListInputSchema = z.object({
	vectorStoreId: z.string(),
	limit: z.number().optional(),
	order: z.enum(['asc', 'desc']).optional(),
	after: z.string().optional(),
	before: z.string().optional(),
	filter: z
		.enum(['in_progress', 'completed', 'cancelled', 'failed'])
		.optional(),
});
export type VectorStoreFilesListInput = z.infer<
	typeof VectorStoreFilesListInputSchema
>;
export const VectorStoreFilesListResponseSchema = z.object({
	object: z.literal('list'),
	data: z.array(VectorStoreFileObjectSchema),
	first_id: z.string().optional(),
	last_id: z.string().optional(),
	has_more: z.boolean(),
});
export type VectorStoreFilesListResponse = z.infer<
	typeof VectorStoreFilesListResponseSchema
>;

export const VectorStoreFilesRetrieveInputSchema = z.object({
	vectorStoreId: z.string(),
	fileId: z.string(),
});
export type VectorStoreFilesRetrieveInput = z.infer<
	typeof VectorStoreFilesRetrieveInputSchema
>;
export const VectorStoreFilesRetrieveResponseSchema =
	VectorStoreFileObjectSchema;
export type VectorStoreFilesRetrieveResponse = z.infer<
	typeof VectorStoreFilesRetrieveResponseSchema
>;

export const VectorStoreFilesDeleteInputSchema = z.object({
	vectorStoreId: z.string(),
	fileId: z.string(),
});
export type VectorStoreFilesDeleteInput = z.infer<
	typeof VectorStoreFilesDeleteInputSchema
>;
export const VectorStoreFilesDeleteResponseSchema = z.object({
	id: z.string(),
	object: z.literal('vector_store.file.deleted'),
	deleted: z.boolean(),
});
export type VectorStoreFilesDeleteResponse = z.infer<
	typeof VectorStoreFilesDeleteResponseSchema
>;

export const VectorStoreFilesUpdateAttributesInputSchema = z.object({
	vectorStoreId: z.string(),
	fileId: z.string(),
	// See VectorStoreFileObjectSchema above: caller-defined key/value metadata, kept loose.
	attributes: z.record(z.string(), z.unknown()).nullable(),
});
export type VectorStoreFilesUpdateAttributesInput = z.infer<
	typeof VectorStoreFilesUpdateAttributesInputSchema
>;
export const VectorStoreFilesUpdateAttributesResponseSchema =
	VectorStoreFileObjectSchema;
export type VectorStoreFilesUpdateAttributesResponse = z.infer<
	typeof VectorStoreFilesUpdateAttributesResponseSchema
>;

export const VectorStoreFilesRetrieveContentInputSchema = z.object({
	vectorStoreId: z.string(),
	fileId: z.string(),
});
export type VectorStoreFilesRetrieveContentInput = z.infer<
	typeof VectorStoreFilesRetrieveContentInputSchema
>;
export const VectorStoreFilesRetrieveContentResponseSchema = z.object({
	object: z.literal('vector_store.file_content.page'),
	data: z.array(
		z.object({
			type: z.literal('text'),
			text: z.string(),
		}),
	),
	has_more: z.boolean(),
	next_page: z.string().nullable().optional(),
});
export type VectorStoreFilesRetrieveContentResponse = z.infer<
	typeof VectorStoreFilesRetrieveContentResponseSchema
>;

// --- Vector Store File Batches ---

const VectorStoreFileBatchObjectSchema = z.object({
	id: z.string(),
	object: z.literal('vector_store.file_batch'),
	created_at: z.number(),
	vector_store_id: z.string(),
	status: z.enum(['in_progress', 'completed', 'cancelled', 'failed']),
	file_counts: FileCountsSchema,
});
export type VectorStoreFileBatchObject = z.infer<
	typeof VectorStoreFileBatchObjectSchema
>;

export const VectorStoreFileBatchesCreateInputSchema = z.object({
	vectorStoreId: z.string(),
	fileIds: z.array(z.string()),
	chunkingStrategy: ChunkingStrategySchema,
	// See VectorStoreFileObjectSchema above: caller-defined key/value metadata, kept loose.
	attributes: z.record(z.string(), z.unknown()).nullable().optional(),
});
export type VectorStoreFileBatchesCreateInput = z.infer<
	typeof VectorStoreFileBatchesCreateInputSchema
>;
export const VectorStoreFileBatchesCreateResponseSchema =
	VectorStoreFileBatchObjectSchema;
export type VectorStoreFileBatchesCreateResponse = z.infer<
	typeof VectorStoreFileBatchesCreateResponseSchema
>;

export const VectorStoreFileBatchesRetrieveInputSchema = z.object({
	vectorStoreId: z.string(),
	batchId: z.string(),
});
export type VectorStoreFileBatchesRetrieveInput = z.infer<
	typeof VectorStoreFileBatchesRetrieveInputSchema
>;
export const VectorStoreFileBatchesRetrieveResponseSchema =
	VectorStoreFileBatchObjectSchema;
export type VectorStoreFileBatchesRetrieveResponse = z.infer<
	typeof VectorStoreFileBatchesRetrieveResponseSchema
>;

export const VectorStoreFileBatchesListFilesInputSchema = z.object({
	vectorStoreId: z.string(),
	batchId: z.string(),
	limit: z.number().optional(),
	order: z.enum(['asc', 'desc']).optional(),
	after: z.string().optional(),
	before: z.string().optional(),
	filter: z
		.enum(['in_progress', 'completed', 'cancelled', 'failed'])
		.optional(),
});
export type VectorStoreFileBatchesListFilesInput = z.infer<
	typeof VectorStoreFileBatchesListFilesInputSchema
>;
export const VectorStoreFileBatchesListFilesResponseSchema = z.object({
	object: z.literal('list'),
	data: z.array(VectorStoreFileObjectSchema),
	first_id: z.string().optional(),
	last_id: z.string().optional(),
	has_more: z.boolean(),
});
export type VectorStoreFileBatchesListFilesResponse = z.infer<
	typeof VectorStoreFileBatchesListFilesResponseSchema
>;
