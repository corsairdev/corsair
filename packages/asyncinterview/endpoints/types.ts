import { z } from 'zod';

// Shared Schemas
export const JobSchema = z.object({
	id: z.string(),
	title: z.string().optional(),
	description: z.string().optional(),
	status: z.string().optional(),
	created_at: z.string().optional(),
});
export type Job = z.infer<typeof JobSchema>;

export const ResponseSchema = z.object({
	id: z.string(),
	job_id: z.string().optional(),
	candidate_name: z.string().optional(),
	candidate_email: z.string().optional(),
	status: z.string().optional(),
	submitted_at: z.string().optional(),
});
export type Response = z.infer<typeof ResponseSchema>;

// Delete Job
export const DeleteJobInputSchema = z.object({
	id: z.string().describe('The ID of the job to delete'),
});
export type DeleteJobInput = z.infer<typeof DeleteJobInputSchema>;

export const DeleteJobOutputSchema = z.object({
	success: z.boolean().optional(),
});
export type DeleteJobOutput = z.infer<typeof DeleteJobOutputSchema>;

// List Interview Responses
export const ListResponsesInputSchema = z.object({
	jobId: z.string().describe('The ID of the job to list responses for'),
});
export type ListResponsesInput = z.infer<typeof ListResponsesInputSchema>;

export const ListResponsesOutputSchema = z.array(ResponseSchema);
export type ListResponsesOutput = z.infer<typeof ListResponsesOutputSchema>;

// List Jobs
export const ListJobsInputSchema = z.object({});
export type ListJobsInput = z.infer<typeof ListJobsInputSchema>;

export const ListJobsOutputSchema = z.array(JobSchema);
export type ListJobsOutput = z.infer<typeof ListJobsOutputSchema>;

// Update Job
export const UpdateJobInputSchema = z.object({
	id: z.string().describe('The ID of the job to update'),
	title: z.string().optional().describe('The new title for the job'),
	description: z
		.string()
		.optional()
		.describe('The new description for the job'),
});
export type UpdateJobInput = z.infer<typeof UpdateJobInputSchema>;

export const UpdateJobOutputSchema = JobSchema;
export type UpdateJobOutput = z.infer<typeof UpdateJobOutputSchema>;

// Mappings
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
