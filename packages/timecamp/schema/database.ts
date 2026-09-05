import { z } from 'zod';

/**
 * A TimeCamp project (a root-level task).
 *
 * Cached because the project list is small, changes rarely, and is read on
 * nearly every reporting call — while TimeCamp's `/tasks` endpoint returns the
 * entire task tree on each request, which is the expensive part of this API.
 */
export const TimecampProject = z.object({
	/** TimeCamp task id. */
	id: z.string(),
	name: z.string(),
	archived: z.boolean().optional(),
	color: z.string().optional(),
	billable: z.boolean().optional(),
	budgeted: z.number().optional(),
	budget_unit: z.string().optional(),
	root_group_id: z.string().optional(),
	assigned_users: z.array(z.string()).optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export type TimecampProject = z.infer<typeof TimecampProject>;
