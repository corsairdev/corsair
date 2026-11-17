import { z } from 'zod';

// ── Shared pieces ───────────────────────────────────────────────────────────

const ProjectToken = z
	.string()
	.min(1)
	.describe('Project token from projects.list (not the API key).');
const RunToken = z
	.string()
	.min(1)
	.describe('Run token from projects.run or projects.get.');
const IncludeOptions = z
	.boolean()
	.optional()
	.describe('Include options_json and related fields. Sent as 1 or 0.');
const DataFormat = z
	.enum(['json', 'csv'])
	.optional()
	.describe(
		'json (default) returns the extracted data as JSON; csv returns it as CSV text.',
	);

/**
 * Lenient run object. ParseHub documents `data_ready` as "truthy", and adds
 * fields such as `new_run` on retried runs, so extra keys pass through.
 */
export const RunSchema = z
	.object({
		project_token: z.string().nullable().optional(),
		run_token: z.string(),
		// initialized, queued, running, cancelled, complete or error; kept open.
		status: z.string().nullable().optional(),
		data_ready: z.union([z.boolean(), z.number()]).nullable().optional(),
		start_time: z.string().nullable().optional(),
		end_time: z.string().nullable().optional(),
		pages: z.number().nullable().optional(),
		md5sum: z.string().nullable().optional(),
		start_url: z.string().nullable().optional(),
		start_template: z.string().nullable().optional(),
		start_value: z.string().nullable().optional(),
	})
	.passthrough();

export const ProjectSchema = z
	.object({
		token: z.string(),
		title: z.string().nullable().optional(),
		templates_json: z.string().nullable().optional(),
		main_template: z.string().nullable().optional(),
		main_site: z.string().nullable().optional(),
		options_json: z.string().nullable().optional(),
		webhook: z.string().nullable().optional(),
		last_run: RunSchema.nullable().optional(),
		last_ready_run: RunSchema.nullable().optional(),
		run_list: z.array(RunSchema).nullable().optional(),
	})
	.passthrough();

export type ParsehubProject = z.infer<typeof ProjectSchema>;

/**
 * Extracted data. Its shape is whatever the project's templates select, so it
 * stays open: a JSON object (or array) for `json`, a CSV string for `csv`.
 */
const RunDataSchema = z.union([
	z.record(z.string(), z.unknown()),
	z.array(z.unknown()),
	z.string(),
]);

// ── projects ────────────────────────────────────────────────────────────────

export const ListProjectsInputSchema = z.object({
	offset: z
		.number()
		.int()
		.nonnegative()
		.optional()
		.describe('Zero-based start index. Default 0.'),
	limit: z
		.number()
		.int()
		.min(1)
		.max(20)
		.optional()
		.describe('Page size, 1 to 20. Default 20.'),
	include_options: IncludeOptions,
});

export const ListProjectsResponseSchema = z
	.object({
		projects: z.array(ProjectSchema),
		total_projects: z.number().optional(),
	})
	.passthrough();

export const GetProjectInputSchema = z.object({
	project_token: ProjectToken,
	offset: z
		.number()
		.int()
		.nonnegative()
		.optional()
		.describe('Offset into run_list (the 20 most recent runs). Default 0.'),
	include_options: IncludeOptions,
});
export const GetProjectResponseSchema = ProjectSchema;

export const RunProjectInputSchema = z.object({
	project_token: ProjectToken,
	start_url: z
		.string()
		.url()
		.optional()
		.describe('URL to start on. Defaults to the project start site.'),
	start_template: z
		.string()
		.min(1)
		.optional()
		.describe('Template to start with. Defaults to the project main template.'),
	start_value_override: z
		.record(z.string(), z.unknown())
		.optional()
		.describe(
			'Starting global scope for the run, e.g. { "query": "San Francisco" }. Sent as a JSON string.',
		),
	send_email: z
		.boolean()
		.optional()
		.describe(
			'Email the account owner when the run completes or fails. Default false.',
		),
});
export const RunProjectResponseSchema = RunSchema;

export const GetLastReadyDataInputSchema = z.object({
	project_token: ProjectToken,
	format: DataFormat,
});
export const GetLastReadyDataResponseSchema = RunDataSchema;

// ── runs ────────────────────────────────────────────────────────────────────

export const GetRunInputSchema = z.object({ run_token: RunToken });
export const GetRunResponseSchema = RunSchema;

export const GetRunDataInputSchema = z.object({
	run_token: RunToken,
	format: DataFormat,
});
export const GetRunDataResponseSchema = RunDataSchema;

export const CancelRunInputSchema = z.object({ run_token: RunToken });
export const CancelRunResponseSchema = RunSchema;

export const DeleteRunInputSchema = z.object({ run_token: RunToken });
export const DeleteRunResponseSchema = z
	.object({ run_token: z.string() })
	.passthrough();

// ── Types ───────────────────────────────────────────────────────────────────

export type ListProjectsInput = z.infer<typeof ListProjectsInputSchema>;
export type ListProjectsResponse = z.infer<typeof ListProjectsResponseSchema>;
export type GetProjectInput = z.infer<typeof GetProjectInputSchema>;
export type GetProjectResponse = z.infer<typeof GetProjectResponseSchema>;
export type RunProjectInput = z.infer<typeof RunProjectInputSchema>;
export type RunProjectResponse = z.infer<typeof RunProjectResponseSchema>;
export type GetLastReadyDataInput = z.infer<typeof GetLastReadyDataInputSchema>;
export type GetLastReadyDataResponse = z.infer<
	typeof GetLastReadyDataResponseSchema
>;
export type GetRunInput = z.infer<typeof GetRunInputSchema>;
export type GetRunResponse = z.infer<typeof GetRunResponseSchema>;
export type GetRunDataInput = z.infer<typeof GetRunDataInputSchema>;
export type GetRunDataResponse = z.infer<typeof GetRunDataResponseSchema>;
export type CancelRunInput = z.infer<typeof CancelRunInputSchema>;
export type CancelRunResponse = z.infer<typeof CancelRunResponseSchema>;
export type DeleteRunInput = z.infer<typeof DeleteRunInputSchema>;
export type DeleteRunResponse = z.infer<typeof DeleteRunResponseSchema>;

export const ParsehubEndpointInputSchemas = {
	listProjects: ListProjectsInputSchema,
	getProject: GetProjectInputSchema,
	runProject: RunProjectInputSchema,
	getLastReadyData: GetLastReadyDataInputSchema,
	getRun: GetRunInputSchema,
	getRunData: GetRunDataInputSchema,
	cancelRun: CancelRunInputSchema,
	deleteRun: DeleteRunInputSchema,
} as const;

export const ParsehubEndpointOutputSchemas = {
	listProjects: ListProjectsResponseSchema,
	getProject: GetProjectResponseSchema,
	runProject: RunProjectResponseSchema,
	getLastReadyData: GetLastReadyDataResponseSchema,
	getRun: GetRunResponseSchema,
	getRunData: GetRunDataResponseSchema,
	cancelRun: CancelRunResponseSchema,
	deleteRun: DeleteRunResponseSchema,
} as const;
