import { z } from 'zod';

// https://docs.rev.ai/api/asynchronous/reference/#operation/GetJobById
// Rev AI omits properties whose value is null, so every field but `id` is optional.
export const JobSchema = z.object({
	id: z.string(),
	status: z.enum(['in_progress', 'transcribed', 'failed']).optional(),
	created_on: z.string().nullable().optional(),
	completed_on: z.string().nullable().optional(),
	name: z.string().nullable().optional(),
	type: z.enum(['async', 'human_tc', 'stream']).optional(),
	metadata: z.string().nullable().optional(),
	media_url: z.string().nullable().optional(),
	callback_url: z.string().nullable().optional(),
	language: z.string().nullable().optional(),
	transcriber: z.string().nullable().optional(),
	failure: z.string().nullable().optional(),
	failure_detail: z.string().nullable().optional(),
	duration_seconds: z.number().nullable().optional(),
	stream_duration_seconds: z.number().nullable().optional(),
	delete_after_seconds: z.number().nullable().optional(),
	skip_diarization: z.boolean().nullable().optional(),
	skip_postprocessing: z.boolean().nullable().optional(),
	skip_punctuation: z.boolean().nullable().optional(),
	remove_disfluencies: z.boolean().nullable().optional(),
	remove_atmospherics: z.boolean().nullable().optional(),
	filter_profanity: z.boolean().nullable().optional(),
	custom_vocabulary_id: z.string().nullable().optional(),
	speaker_channels_count: z.number().nullable().optional(),
	enable_multilingual: z.boolean().nullable().optional(),
});

export const SubmitJobInputSchema = z.object({
	media_url: z.string().url(),
	metadata: z.string().optional(),
	language: z.string().optional(),
	notification_config: z
		.object({
			url: z.string().url(),
			auth_headers: z
				.object({
					Authorization: z.string(),
				})
				.optional(),
		})
		.optional(),
});

export const GetJobInputSchema = z.object({
	id: z.string(),
});

export const GetTranscriptInputSchema = z.object({
	id: z.string(),
	accept: z
		.enum(['application/vnd.rev.transcript.v1.0+json', 'text/plain'])
		.default('application/vnd.rev.transcript.v1.0+json'),
});

// https://docs.rev.ai/api/asynchronous/reference/#operation/GetTranscriptById
const TranscriptElementSchema = z
	.object({
		type: z.string(),
		value: z.string(),
		ts: z.number().nullable().optional(),
		end_ts: z.number().nullable().optional(),
		confidence: z.number().nullable().optional(),
	})
	.passthrough();

const MonologueSchema = z
	.object({
		speaker: z.number().optional(),
		elements: z.array(TranscriptElementSchema),
	})
	.passthrough();

export const TranscriptJsonSchema = z
	.object({
		monologues: z.array(MonologueSchema),
	})
	.passthrough();

export const TranscriptTextSchema = z.string();

export type SubmitJobInput = z.infer<typeof SubmitJobInputSchema>;
export type GetJobInput = z.infer<typeof GetJobInputSchema>;
export type GetTranscriptInput = z.infer<typeof GetTranscriptInputSchema>;
export type JobResponse = z.infer<typeof JobSchema>;
export type TranscriptJsonResponse = z.infer<typeof TranscriptJsonSchema>;
export type TranscriptResponse = TranscriptJsonResponse | string;

export type RevAIEndpointInputs = {
	submitJob: SubmitJobInput;
	getJob: GetJobInput;
	getTranscript: GetTranscriptInput;
};

export type RevAIEndpointOutputs = {
	submitJob: JobResponse;
	getJob: JobResponse;
	getTranscript: TranscriptResponse;
};

export const RevAIEndpointInputSchemas = {
	submitJob: SubmitJobInputSchema,
	getJob: GetJobInputSchema,
	getTranscript: GetTranscriptInputSchema,
} as const;

export const RevAIEndpointOutputSchemas = {
	submitJob: JobSchema,
	getJob: JobSchema,
	getTranscript: z.union([TranscriptJsonSchema, TranscriptTextSchema]),
} as const;
