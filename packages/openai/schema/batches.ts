import { z } from 'zod';

const BatchErrorSchema = z.object({
	code: z.string(),
	message: z.string(),
	param: z.string().nullable().optional(),
	line: z.number().nullable().optional(),
});

const BatchObjectSchema = z.object({
	id: z.string(),
	object: z.literal('batch'),
	endpoint: z.string(),
	input_file_id: z.string(),
	completion_window: z.string(),
	status: z.enum([
		'validating',
		'failed',
		'in_progress',
		'finalizing',
		'completed',
		'expired',
		'cancelling',
		'cancelled',
	]),
	output_file_id: z.string().optional(),
	error_file_id: z.string().optional(),
	created_at: z.number(),
	in_progress_at: z.number().optional(),
	expires_at: z.number().optional(),
	finalizing_at: z.number().optional(),
	completed_at: z.number().optional(),
	failed_at: z.number().optional(),
	expired_at: z.number().optional(),
	cancelling_at: z.number().optional(),
	cancelled_at: z.number().optional(),
	request_counts: z
		.object({
			total: z.number(),
			completed: z.number(),
			failed: z.number(),
		})
		.optional(),
	errors: z.object({ data: z.array(BatchErrorSchema).optional() }).optional(),
	metadata: z.record(z.string(), z.string()).nullable().optional(),
});
export type BatchObject = z.infer<typeof BatchObjectSchema>;

// --- Create ---

export const BatchesCreateInputSchema = z.object({
	inputFileId: z.string(),
	endpoint: z.enum([
		'/v1/chat/completions',
		'/v1/completions',
		'/v1/embeddings',
		'/v1/responses',
	]),
	completionWindow: z.literal('24h'),
	metadata: z.record(z.string(), z.string()).optional(),
});
export type BatchesCreateInput = z.infer<typeof BatchesCreateInputSchema>;
export const BatchesCreateResponseSchema = BatchObjectSchema;
export type BatchesCreateResponse = z.infer<typeof BatchesCreateResponseSchema>;

// --- Retrieve ---

export const BatchesRetrieveInputSchema = z.object({ batchId: z.string() });
export type BatchesRetrieveInput = z.infer<typeof BatchesRetrieveInputSchema>;
export const BatchesRetrieveResponseSchema = BatchObjectSchema;
export type BatchesRetrieveResponse = z.infer<
	typeof BatchesRetrieveResponseSchema
>;

// --- Cancel ---

export const BatchesCancelInputSchema = z.object({ batchId: z.string() });
export type BatchesCancelInput = z.infer<typeof BatchesCancelInputSchema>;
export const BatchesCancelResponseSchema = BatchObjectSchema;
export type BatchesCancelResponse = z.infer<typeof BatchesCancelResponseSchema>;

// --- List ---

export const BatchesListInputSchema = z.object({
	after: z.string().optional(),
	limit: z.number().optional(),
});
export type BatchesListInput = z.infer<typeof BatchesListInputSchema>;
export const BatchesListResponseSchema = z.object({
	object: z.literal('list'),
	data: z.array(BatchObjectSchema),
	first_id: z.string().optional(),
	last_id: z.string().optional(),
	has_more: z.boolean(),
});
export type BatchesListResponse = z.infer<typeof BatchesListResponseSchema>;
