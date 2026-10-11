import { z } from 'zod';

// SingleJob from the OpenAPI spec. raw_config is omitted on purpose:
// GET /jobs?exclude_configs=true exists so callers can leave that blob behind.
// studio_link is ParseResponse / ExtractResponse, not SingleJob, but it is the
// only URL the API gives back to the job in Studio.
export const JobStatus = z.enum([
	'Pending',
	'Completed',
	'Failed',
	'Idle',
	'InProgress',
	'Completing',
	'Cancelled',
]);

export const JobType = z.enum([
	'Parse',
	'Extract',
	'Split',
	'Edit',
	'Pipeline',
	'Classify',
	'Chart',
]);

export const Job = z.object({
	jobId: z.string(),
	status: JobStatus.nullable().optional(),
	type: JobType.nullable().optional(),
	// z.unknown() is used because OpenAPI types SingleJob.source as an unconstrained object or null.
	source: z.unknown().nullable().optional(),
	numPages: z.number().nullable().optional(),
	totalPages: z.number().nullable().optional(),
	duration: z.number().nullable().optional(),
	providerCreatedAt: z.string().nullable().optional(),
	// z.unknown() is used because OpenAPI types SingleJob.bucket as an unconstrained object or null.
	bucket: z.unknown().nullable().optional(),
	studioLink: z.string().nullable().optional(),
	updatedAt: z.coerce.date().optional(),
});

export type Job = z.infer<typeof Job>;
