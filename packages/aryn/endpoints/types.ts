import { z } from 'zod';
import { ArynDocSet } from '../schema/database';

export const ArynElementSchema = z
	.object({
		type: z.string().optional(),
		bbox: z.array(z.number()).optional(),
		properties: z
			.object({
				score: z.number().optional(),
				page_number: z.number().optional(),
			})
			.loose()
			.nullable()
			.optional(),
		text_representation: z.string().nullable().optional(),
		binary_representation: z.unknown().optional(),
	})
	.loose();
export type ArynElement = z.infer<typeof ArynElementSchema>;

export const ArynAsyncTaskSchema = z
	.object({
		action: z.string(),
		task_status: z.enum(['done', 'abort', 'cancel', 'run', 'queue']),
	})
	.loose();
export type ArynAsyncTask = z.infer<typeof ArynAsyncTaskSchema>;

export const DocsetCreateInputSchema = z
	.object({
		name: z.string(),
		schema: z.unknown().optional(),
		properties: z.record(z.string(), z.unknown()).optional(),
		prompts: z.record(z.string(), z.string()).optional(),
	})
	.loose();

export type DocsetCreateInput = z.infer<typeof DocsetCreateInputSchema>;

export const DocsetCreateResponseSchema = ArynDocSet;
export type DocsetCreateResponse = z.infer<typeof DocsetCreateResponseSchema>;

export const DocsetDeleteInputSchema = z
	.object({
		docset_id: z.string(),
	})
	.loose();

export type DocsetDeleteInput = z.infer<typeof DocsetDeleteInputSchema>;

export const DocsetDeleteResponseSchema = ArynDocSet;
export type DocsetDeleteResponse = z.infer<typeof DocsetDeleteResponseSchema>;

export const DocsetGetInputSchema = z
	.object({
		docset_id: z.string(),
	})
	.loose();

export type DocsetGetInput = z.infer<typeof DocsetGetInputSchema>;

export const DocsetGetResponseSchema = ArynDocSet;
export type DocsetGetResponse = z.infer<typeof DocsetGetResponseSchema>;

export const DocumentGetInputSchema = z
	.object({
		docset_id: z.string(),
		doc_id: z.string(),
		include_elements: z.boolean().optional(),
		include_binary: z.boolean().optional(),
	})
	.loose();

export type DocumentGetInput = z.infer<typeof DocumentGetInputSchema>;

export const DocumentGetResponseSchema = z
	.object({
		id: z.string(),
		elements: z.array(ArynElementSchema).optional(),
		properties: z.record(z.string(), z.unknown()).optional(),
		binary_data: z.string().nullable().optional(),
	})
	.loose();

export type DocumentGetResponse = z.infer<typeof DocumentGetResponseSchema>;

export const DocumentGetBinaryInputSchema = z
	.object({
		docset_id: z.string(),
		doc_id: z.string(),
	})
	.loose();

export type DocumentGetBinaryInput = z.infer<
	typeof DocumentGetBinaryInputSchema
>;

export const DocumentGetBinaryResponseSchema = z
	.object({
		docset_id: z.string(),
		doc_id: z.string(),
		contentBase64: z.string(),
	})
	.loose();
export type DocumentGetBinaryResponse = z.infer<
	typeof DocumentGetBinaryResponseSchema
>;

export const QueryGeneratePlanInputSchema = z
	.object({
		query: z.string(),
		docset_id: z.string().optional(),
		summarize_result: z.boolean().optional(),
		stream: z.boolean().optional(),
	})
	.loose();

export type QueryGeneratePlanInput = z.infer<
	typeof QueryGeneratePlanInputSchema
>;

export const ArynQueryPlanNodeSchema = z
	.object({
		node_id: z.number(),
		node_type: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
		inputs: z.array(z.number()).optional(),
	})
	.loose();

export const QueryGeneratePlanResponseSchema = z
	.object({
		query: z.string(),
		nodes: z.record(z.string(), ArynQueryPlanNodeSchema),
		result_node: z.number(),
		llm_prompt: z.unknown().nullable().optional(),
		llm_plan: z.string().nullable().optional(),
	})
	.loose();

export type QueryGeneratePlanResponse = z.infer<
	typeof QueryGeneratePlanResponseSchema
>;

export const ASYNC_LIST_PATH_FILTER = '^/v1/storage/docsets/{docset_id}/docs$';

export const AsyncTasksListInputSchema = z
	.object({
		path_filter: z
			.string()
			.regex(
				/^\^\/v1\/storage\/docsets\/\{docset_id\}\/docs\$$/,
				'path_filter must be ^/v1/storage/docsets/{docset_id}/docs$ (the only value supported by the Aryn API)',
			)
			.optional(),
	})
	.loose();
export type AsyncTasksListInput = z.infer<typeof AsyncTasksListInputSchema>;

export const AsyncTasksListResponseSchema = z.object({
	tasks: z.record(z.string(), ArynAsyncTaskSchema),
});
export type AsyncTasksListResponse = z.infer<
	typeof AsyncTasksListResponseSchema
>;

export const PartitionOptionsSchema = z
	.object({
		threshold: z.union([z.number(), z.literal('auto')]).optional(),
		text_mode: z.string().optional(),
		table_mode: z.string().optional(),
		extract_images: z.boolean().optional(),
		extract_image_format: z.string().optional(),
		selected_pages: z
			.array(z.union([z.number(), z.array(z.number())]))
			.optional(),
		strategy: z.string().optional(),
		max_tokens: z.number().optional(),
		tokenizer: z.string().optional(),
		merge_across_pages: z.boolean().optional(),
		promote_title: z.boolean().optional(),
		title_candidate_elements: z.array(z.string()).optional(),
		orientation_correction: z.boolean().optional(),
		include_pagenum: z.boolean().optional(),
		include_headers: z.boolean().optional(),
		include_footers: z.boolean().optional(),
		pipeline: z.string().optional(),
		add_to_docset_id: z.string().optional(),
	})
	.loose();

export const DocumentPartitionInputSchema = z
	.object({
		file: z.instanceof(Blob).optional(),
		file_url: z.string().optional(),
		options: PartitionOptionsSchema.optional(),
	})
	.loose()
	.refine((value) => Boolean(value.file) || Boolean(value.file_url), {
		message: 'Provide file or file_url',
	});

export type DocumentPartitionInput = z.infer<
	typeof DocumentPartitionInputSchema
>;

export const DocumentPartitionResponseSchema = z
	.object({
		status: z.array(z.string()),
		status_code: z.number().optional(),
		error: z.string().nullable().optional(),
		elements: z.array(ArynElementSchema).nullable().optional(),
		markdown: z.string().nullable().optional(),
	})
	.loose();
export type DocumentPartitionResponse = z.infer<
	typeof DocumentPartitionResponseSchema
>;

export const DocumentSubmitAsyncAddInputSchema = z
	.object({
		docset_id: z.string(),
		file: z.instanceof(Blob).optional(),
		file_url: z.string().optional(),
		options: PartitionOptionsSchema.optional(),
	})
	.loose()
	.refine((value) => Boolean(value.file) || Boolean(value.file_url), {
		message: 'Provide file or file_url',
	});

export type DocumentSubmitAsyncAddInput = z.infer<
	typeof DocumentSubmitAsyncAddInputSchema
>;

export const DocumentSubmitAsyncAddResponseSchema = z
	.object({
		task_id: z.string(),
	})
	.loose();

export type DocumentSubmitAsyncAddResponse = z.infer<
	typeof DocumentSubmitAsyncAddResponseSchema
>;

export type ArynEndpointInputs = {
	docsetCreate: DocsetCreateInput;
	docsetDelete: DocsetDeleteInput;
	docsetGet: DocsetGetInput;
	documentGet: DocumentGetInput;
	documentGetBinary: DocumentGetBinaryInput;
	queryGeneratePlan: QueryGeneratePlanInput;
	asyncTasksList: AsyncTasksListInput;
	documentPartition: DocumentPartitionInput;
	documentSubmitAsyncAdd: DocumentSubmitAsyncAddInput;
};

export type ArynEndpointOutputs = {
	docsetCreate: DocsetCreateResponse;
	docsetDelete: DocsetDeleteResponse;
	docsetGet: DocsetGetResponse;
	documentGet: DocumentGetResponse;
	documentGetBinary: DocumentGetBinaryResponse;
	queryGeneratePlan: QueryGeneratePlanResponse;
	asyncTasksList: AsyncTasksListResponse;
	documentPartition: DocumentPartitionResponse;
	documentSubmitAsyncAdd: DocumentSubmitAsyncAddResponse;
};

export const ArynEndpointInputSchemas = {
	docsetCreate: DocsetCreateInputSchema,
	docsetDelete: DocsetDeleteInputSchema,
	docsetGet: DocsetGetInputSchema,
	documentGet: DocumentGetInputSchema,
	documentGetBinary: DocumentGetBinaryInputSchema,
	queryGeneratePlan: QueryGeneratePlanInputSchema,
	asyncTasksList: AsyncTasksListInputSchema,
	documentPartition: DocumentPartitionInputSchema,
	documentSubmitAsyncAdd: DocumentSubmitAsyncAddInputSchema,
} as const;

export const ArynEndpointOutputSchemas = {
	docsetCreate: DocsetCreateResponseSchema,
	docsetDelete: DocsetDeleteResponseSchema,
	docsetGet: DocsetGetResponseSchema,
	documentGet: DocumentGetResponseSchema,
	documentGetBinary: DocumentGetBinaryResponseSchema,
	queryGeneratePlan: QueryGeneratePlanResponseSchema,
	asyncTasksList: AsyncTasksListResponseSchema,
	documentPartition: DocumentPartitionResponseSchema,
	documentSubmitAsyncAdd: DocumentSubmitAsyncAddResponseSchema,
} as const;
