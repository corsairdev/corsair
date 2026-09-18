import { z } from 'zod';

/**
 * Workable SPI v3 entity shapes for Corsair DB cache (`ctx.db.*`).
 * Loose + catchall - Workable's account-configured custom fields mean
 * responses carry tenant-specific extras beyond what's documented.
 */

/** GET /departments, POST /departments, PUT /departments. */
export const WorkableDepartment = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
		parent_id: z.string().nullable().optional(),
	})
	.catchall(z.unknown());
export type WorkableDepartment = z.infer<typeof WorkableDepartment>;

/** GET /employees, GET /employees/:id, POST /employees, PATCH /employees/:id. */
export const WorkableEmployee = z
	.object({
		id: z.string().optional(),
		firstname: z.string().optional(),
		lastname: z.string().optional(),
		email: z.string().optional(),
		state: z.enum(['draft', 'published']).optional(),
		job_title: z.string().optional(),
		department_id: z.string().nullable().optional(),
		manager_id: z.string().nullable().optional(),
	})
	.catchall(z.unknown());
export type WorkableEmployee = z.infer<typeof WorkableEmployee>;

/** GET /members, PUT /members, POST /members/invite. */
export const WorkableMember = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
		headline: z.string().optional(),
		email: z.string().optional(),
		roles: z.array(z.string()).optional(),
		active: z.boolean().optional(),
		collaboration_rules: z.array(z.unknown()).optional(),
	})
	.catchall(z.unknown());
export type WorkableMember = z.infer<typeof WorkableMember>;

/** GET /jobs. */
export const WorkableJob = z
	.object({
		id: z.string().optional(),
		title: z.string().optional(),
		shortcode: z.string().optional(),
		state: z.enum(['draft', 'published', 'closed', 'archived']).optional(),
		department: z.string().nullable().optional(),
		url: z.string().optional(),
		created_at: z.coerce.date().optional(),
		updated_at: z.coerce.date().optional(),
	})
	.catchall(z.unknown());
export type WorkableJob = z.infer<typeof WorkableJob>;

/** GET /candidates. */
export const WorkableCandidate = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
		firstname: z.string().optional(),
		lastname: z.string().optional(),
		email: z.string().optional(),
		job: z
			.object({
				shortcode: z.string().optional(),
				title: z.string().optional(),
			})
			.catchall(z.unknown())
			.optional(),
		stage: z.string().optional(),
		disqualified: z.boolean().optional(),
		created_at: z.coerce.date().optional(),
		updated_at: z.coerce.date().optional(),
	})
	.catchall(z.unknown());
export type WorkableCandidate = z.infer<typeof WorkableCandidate>;
