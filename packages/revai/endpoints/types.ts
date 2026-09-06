import { z } from 'zod';

export const JobSchema = z.object({
	id: z.string(),
	status: z.string().optional(),
	created_on: z.string().nullable().optional(),
	completed_on: z.string().nullable().optional(),
	name: z.string().optional(),
	type: z.string().optional(),
	metadata: z.string().nullable().optional(),
	language: z.string().nullable().optional(),
	failure: z.string().nullable().optional(),
	duration_seconds: z.number().nullable().optional(),
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

export type SubmitJobInput = z.infer<typeof SubmitJobInputSchema>;
export type GetJobInput = z.infer<typeof GetJobInputSchema>;
export type GetTranscriptInput = z.infer<typeof GetTranscriptInputSchema>;
export type JobResponse = z.infer<typeof JobSchema>;
export type TranscriptResponse = any; // Will be typed based on requested format

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
	getTranscript: z.union([z.record(z.string(), z.any()), z.string()]),
} as const;
