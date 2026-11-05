import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// TimeCamp models projects as root-level *tasks* — a task with no parent is a
// project. The API is loose about types: ids come back as strings for tasks but
// numbers elsewhere, and booleans arrive as "0"/"1". The endpoint normalises all
// of that before it reaches a caller, so the schemas below describe the clean
// shape rather than TimeCamp's raw payload.
// ─────────────────────────────────────────────────────────────────────────────

const GetProjectsListInputSchema = z.object({
	include_archived: z.boolean().optional(),
});

export type GetProjectsListInput = z.infer<typeof GetProjectsListInputSchema>;

const TimecampProjectSchema = z.object({
	/** TimeCamp task id, normalised to a string. */
	task_id: z.string(),
	name: z.string(),
	archived: z.boolean(),
	color: z.string().nullable(),
	/** Hex or named colour as TimeCamp reports it, when set. */
	billable: z.boolean().nullable(),
	/** Budget amount; unit is carried separately in `budget_unit`. */
	budgeted: z.number().nullable(),
	budget_unit: z.string().nullable(),
	note: z.string().nullable(),
	/** TimeCamp date strings (`YYYY-MM-DD HH:MM:SS`), passed through as-is. */
	add_date: z.string().nullable(),
	edit_date: z.string().nullable(),
	root_group_id: z.string().nullable(),
	/** User ids assigned to the project, normalised to strings. */
	assigned_users: z.array(z.string()),
});

export type TimecampProject = z.infer<typeof TimecampProjectSchema>;

const GetProjectsListResponseSchema = z.object({
	projects: z.array(TimecampProjectSchema),
	/** Number of projects returned after filtering. */
	count: z.number(),
});

export type GetProjectsListResponse = z.infer<
	typeof GetProjectsListResponseSchema
>;

export const TimecampEndpointInputSchemas = {
	getProjectsList: GetProjectsListInputSchema,
} as const;

export const TimecampEndpointOutputSchemas = {
	getProjectsList: GetProjectsListResponseSchema,
} as const;

export type TimecampEndpointInputs = {
	[K in keyof typeof TimecampEndpointInputSchemas]: z.infer<
		(typeof TimecampEndpointInputSchemas)[K]
	>;
};

export type TimecampEndpointOutputs = {
	[K in keyof typeof TimecampEndpointOutputSchemas]: z.infer<
		(typeof TimecampEndpointOutputSchemas)[K]
	>;
};

export {
	GetProjectsListInputSchema,
	GetProjectsListResponseSchema,
	TimecampProjectSchema,
};
