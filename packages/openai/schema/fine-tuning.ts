import { z } from 'zod';

const FineTuningJobObjectSchema = z.object({
	id: z.string(),
	object: z.literal('fine_tuning.job'),
	created_at: z.number(),
	model: z.string(),
	fine_tuned_model: z.string().nullable().optional(),
	status: z.enum([
		'validating_files',
		'queued',
		'running',
		'succeeded',
		'failed',
		'cancelled',
	]),
	training_file: z.string(),
	validation_file: z.string().nullable().optional(),
	// Hyperparameter keys/values vary by fine-tuning method (supervised, dpo, reinforcement); kept loose.
	hyperparameters: z.record(z.string(), z.unknown()).optional(),
	result_files: z.array(z.string()).optional(),
	trained_tokens: z.number().nullable().optional(),
	error: z
		.object({ code: z.string(), message: z.string() })
		.nullable()
		.optional(),
	metadata: z.record(z.string(), z.string()).nullable().optional(),
});
export type FineTuningJobObject = z.infer<typeof FineTuningJobObjectSchema>;

// --- Create Job ---

export const FineTuningCreateJobInputSchema = z.object({
	model: z.string(),
	trainingFile: z.string(),
	validationFile: z.string().optional(),
	// Hyperparameter keys/values vary by fine-tuning method; kept loose rather than modeling each method's shape.
	hyperparameters: z.record(z.string(), z.unknown()).optional(),
	suffix: z.string().optional(),
	// Integration config (e.g. wandb) has provider-specific fields; kept loose.
	integrations: z.array(z.record(z.string(), z.unknown())).optional(),
	seed: z.number().optional(),
	// method selects supervised/dpo/reinforcement and each has a different config shape; kept loose.
	method: z.record(z.string(), z.unknown()).optional(),
	metadata: z.record(z.string(), z.string()).optional(),
});
export type FineTuningCreateJobInput = z.infer<
	typeof FineTuningCreateJobInputSchema
>;

export const FineTuningCreateJobResponseSchema = FineTuningJobObjectSchema;
export type FineTuningCreateJobResponse = z.infer<
	typeof FineTuningCreateJobResponseSchema
>;

// --- List Jobs ---

export const FineTuningListJobsInputSchema = z.object({
	after: z.string().optional(),
	limit: z.number().optional(),
	metadata: z.record(z.string(), z.string()).optional(),
});
export type FineTuningListJobsInput = z.infer<
	typeof FineTuningListJobsInputSchema
>;

export const FineTuningListJobsResponseSchema = z.object({
	object: z.literal('list'),
	data: z.array(FineTuningJobObjectSchema),
	has_more: z.boolean(),
});
export type FineTuningListJobsResponse = z.infer<
	typeof FineTuningListJobsResponseSchema
>;

// --- Retrieve Job ---

export const FineTuningRetrieveJobInputSchema = z.object({
	jobId: z.string(),
});
export type FineTuningRetrieveJobInput = z.infer<
	typeof FineTuningRetrieveJobInputSchema
>;

export const FineTuningRetrieveJobResponseSchema = FineTuningJobObjectSchema;
export type FineTuningRetrieveJobResponse = z.infer<
	typeof FineTuningRetrieveJobResponseSchema
>;

// --- List Checkpoints ---

const FineTuningCheckpointObjectSchema = z.object({
	id: z.string(),
	object: z.literal('fine_tuning.job.checkpoint'),
	created_at: z.number(),
	fine_tuned_model_checkpoint: z.string(),
	step_number: z.number(),
	metrics: z.record(z.string(), z.number()).optional(),
});
export type FineTuningCheckpointObject = z.infer<
	typeof FineTuningCheckpointObjectSchema
>;

export const FineTuningListCheckpointsInputSchema = z.object({
	jobId: z.string(),
	after: z.string().optional(),
	limit: z.number().optional(),
});
export type FineTuningListCheckpointsInput = z.infer<
	typeof FineTuningListCheckpointsInputSchema
>;

export const FineTuningListCheckpointsResponseSchema = z.object({
	object: z.literal('list'),
	data: z.array(FineTuningCheckpointObjectSchema),
	first_id: z.string().optional(),
	last_id: z.string().optional(),
	has_more: z.boolean(),
});
export type FineTuningListCheckpointsResponse = z.infer<
	typeof FineTuningListCheckpointsResponseSchema
>;

// --- List Events ---

const FineTuningEventObjectSchema = z.object({
	id: z.string(),
	object: z.literal('fine_tuning.job.event'),
	created_at: z.number(),
	level: z.string(),
	message: z.string(),
	// Event data payload varies by event level/type (metrics, warnings, etc.); kept loose.
	data: z.record(z.string(), z.unknown()).optional(),
});
export type FineTuningEventObject = z.infer<typeof FineTuningEventObjectSchema>;

export const FineTuningListEventsInputSchema = z.object({
	jobId: z.string(),
	after: z.string().optional(),
	limit: z.number().optional(),
});
export type FineTuningListEventsInput = z.infer<
	typeof FineTuningListEventsInputSchema
>;

export const FineTuningListEventsResponseSchema = z.object({
	object: z.literal('list'),
	data: z.array(FineTuningEventObjectSchema),
	has_more: z.boolean(),
});
export type FineTuningListEventsResponse = z.infer<
	typeof FineTuningListEventsResponseSchema
>;

// --- Cancel Job ---

export const FineTuningCancelJobInputSchema = z.object({
	jobId: z.string(),
});
export type FineTuningCancelJobInput = z.infer<
	typeof FineTuningCancelJobInputSchema
>;

export const FineTuningCancelJobResponseSchema = FineTuningJobObjectSchema;
export type FineTuningCancelJobResponse = z.infer<
	typeof FineTuningCancelJobResponseSchema
>;
