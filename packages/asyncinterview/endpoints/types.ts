import { z } from 'zod';
import {
	AsyncInterviewInterviewEntity,
	AsyncInterviewJobEntity,
} from '../schema/database';

/**
 * Integer job id as string or number.
 */
export const JobIdInput = z.union([
	z.number().int(),
	z
		.string()
		.regex(/^\d+$/)
		.refine((s) => Number.isSafeInteger(Number(s))),
]);

export const JobSchema = AsyncInterviewJobEntity;
export type Job = z.infer<typeof JobSchema>;

export const InterviewSchema = AsyncInterviewInterviewEntity;
export type Interview = z.infer<typeof InterviewSchema>;

/** ASYNC_INTERVIEW_DELETE_JOB — `job_id` required. */
export const DeleteJobInputSchema = z
	.object({
		job_id: JobIdInput.describe(
			'Unique identifier (integer ID) of the interview job to delete.',
		),
	})
	.strict();
export type DeleteJobInput = z.infer<typeof DeleteJobInputSchema>;

/** DELETE /jobs/{id} is 204/empty or a leftover body; we always return job_id. */
export const DeleteJobOutputSchema = z
	.object({
		job_id: z.number().int(),
	})
	.strict();
export type DeleteJobOutput = z.infer<typeof DeleteJobOutputSchema>;

/**
 * ASYNC_INTERVIEW_LIST_INTERVIEW_RESPONSES
 * No required params. Optional `job_id` maps to GET /interviews?job_id=.
 */
export const ListResponsesInputSchema = z
	.object({
		job_id: JobIdInput.optional().describe(
			'Filter interviews by job ID (GET /interviews?job_id=).',
		),
	})
	.strict();
export type ListResponsesInput = z.infer<typeof ListResponsesInputSchema>;

export const ListResponsesOutputSchema = z.array(InterviewSchema);
export type ListResponsesOutput = z.infer<typeof ListResponsesOutputSchema>;

/** ASYNC_INTERVIEW_LIST_JOBS — no params. */
export const ListJobsInputSchema = z.object({}).strict();
export type ListJobsInput = z.infer<typeof ListJobsInputSchema>;

export const ListJobsOutputSchema = z.array(JobSchema);
export type ListJobsOutput = z.infer<typeof ListJobsOutputSchema>;

/** ASYNC_INTERVIEW_UPDATE_JOB — PUT /jobs/{id} with documented body keys. */
export const UpdateJobInputSchema = z
	.object({
		job_id: JobIdInput.describe(
			'Unique identifier of the interview job to update (integer ID).',
		),
		title: z.string().optional().describe('New title for the job'),
		is_public: z
			.boolean()
			.optional()
			.describe(
				'Whether the job is publicly visible (true to make public, false to make private)',
			),
		sub_title: z
			.string()
			.optional()
			.describe('Subtitle or tagline for the job'),
		description: z
			.string()
			.optional()
			.describe('Detailed description of the job role'),
	})
	.strict();
export type UpdateJobInput = z.infer<typeof UpdateJobInputSchema>;

export const UpdateJobOutputSchema = JobSchema;
export type UpdateJobOutput = z.infer<typeof UpdateJobOutputSchema>;

/** PUT /jobs/{id} may return 204/empty; we then echo the requested id. */
export const EmptyUpdateResponseSchema = z.union([
	z.undefined(),
	z.null(),
	z.literal(''),
	z.object({}).strict(),
]);

export type AsyncInterviewEndpointInputs = {
	'jobs.delete': DeleteJobInput;
	'jobs.listResponses': ListResponsesInput;
	'jobs.list': ListJobsInput;
	'jobs.update': UpdateJobInput;
};

export type AsyncInterviewEndpointOutputs = {
	'jobs.delete': DeleteJobOutput;
	'jobs.listResponses': ListResponsesOutput;
	'jobs.list': ListJobsOutput;
	'jobs.update': UpdateJobOutput;
};

export const AsyncInterviewEndpointInputSchemas = {
	'jobs.delete': DeleteJobInputSchema,
	'jobs.listResponses': ListResponsesInputSchema,
	'jobs.list': ListJobsInputSchema,
	'jobs.update': UpdateJobInputSchema,
} as const;

export const AsyncInterviewEndpointOutputSchemas = {
	'jobs.delete': DeleteJobOutputSchema,
	'jobs.listResponses': ListResponsesOutputSchema,
	'jobs.list': ListJobsOutputSchema,
	'jobs.update': UpdateJobOutputSchema,
} as const;
