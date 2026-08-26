import { z } from 'zod';
import { ArynDocSet } from '../schema/database';

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
		include_original_elements: z.boolean().optional(),
	})
	.loose();

export type DocumentGetInput = z.infer<typeof DocumentGetInputSchema>;

export const DocumentGetResponseSchema = z
	.object({
		doc_id: z.string(),
		elements: z.record(z.string(), z.any()).optional(),
		properties: z.record(z.string(), z.any()).optional(),
		binary_data: z.any().optional(),
		original_elements: z.array(z.any()).optional(),
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

export const DocumentGetBinaryResponseSchema = z.any();
export type DocumentGetBinaryResponse = any;

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

export const QueryGeneratePlanResponseSchema = z
	.object({
		logical_plan: z.any().optional(),
		physical_plan: z.any().optional(),
	})
	.loose();

export type QueryGeneratePlanResponse = z.infer<
	typeof QueryGeneratePlanResponseSchema
>;

export const AsyncTasksListInputSchema = z.object({}).loose();
export type AsyncTasksListInput = z.infer<typeof AsyncTasksListInputSchema>;

export const AsyncTasksListResponseSchema = z.record(z.string(), z.any());
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
	.loose();

export type DocumentPartitionInput = z.infer<
	typeof DocumentPartitionInputSchema
>;

export const DocumentPartitionResponseSchema = z.any();
export type DocumentPartitionResponse = any;

export const DocumentSubmitAsyncAddInputSchema = z
	.object({
		docset_id: z.string(),
		file: z.instanceof(Blob).optional(),
		file_url: z.string().optional(),
		options: PartitionOptionsSchema.optional(),
	})
	.loose();

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
