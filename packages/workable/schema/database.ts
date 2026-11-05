import { z } from 'zod';

/**
 * An enum read from Workable's responses. The known values document the
 * field, but a value Workable adds later still parses instead of failing
 * the whole call. Inputs keep strict enums.
 */
function openEnum<const T extends readonly [string, ...string[]]>(values: T) {
	return z.union([z.enum(values), z.string()]);
}

/**
 * Workable SPI v3 entity shapes for Corsair DB cache (`ctx.db.*`).
 * Loose + catchall - Workable's account-configured custom fields mean
 * responses carry tenant-specific extras beyond what's documented.
 * Every `z.unknown()` below is that same tenant-specific free-form data,
 * validated by zod before the plugin reads any known field.
 */

/** GET /departments, POST /departments, PUT /departments. */
export const WorkableDepartment = z
	.object({
		id: z.string().optional(),
		name: z.string().nullish(),
		parent_id: z.string().nullable().optional(),
	})
	.catchall(z.unknown());
export type WorkableDepartment = z.infer<typeof WorkableDepartment>;

/** GET /employees, GET /employees/:id, POST /employees, PATCH /employees/:id. */
export const WorkableEmployee = z
	.object({
		id: z.string().optional(),
		firstname: z.string().nullish(),
		lastname: z.string().nullish(),
		email: z.string().nullish(),
		state: openEnum(['draft', 'published']).nullish(),
		job_title: z.string().nullish(),
		department_id: z.string().nullable().optional(),
		manager_id: z.string().nullable().optional(),
	})
	.catchall(z.unknown());
export type WorkableEmployee = z.infer<typeof WorkableEmployee>;

/** GET /members, PUT /members, POST /members/invite. */
export const WorkableMember = z
	.object({
		id: z.string().optional(),
		name: z.string().nullish(),
		headline: z.string().nullish(),
		email: z.string().nullish(),
		roles: z.array(z.string()).nullish(),
		active: z.boolean().nullish(),
		// unknown: collaboration-rule values are account-configured and undocumented.
		collaboration_rules: z.array(z.unknown()).optional(),
	})
	.catchall(z.unknown());
export type WorkableMember = z.infer<typeof WorkableMember>;

/** GET /jobs. */
export const WorkableJob = z
	.object({
		id: z.string().optional(),
		title: z.string().nullish(),
		shortcode: z.string().nullish(),
		state: openEnum(['draft', 'published', 'closed', 'archived']).nullish(),
		department: z.string().nullable().optional(),
		url: z.string().nullish(),
		created_at: z.coerce.date().nullish(),
		updated_at: z.coerce.date().nullish(),
	})
	.catchall(z.unknown());
export type WorkableJob = z.infer<typeof WorkableJob>;

/** GET /candidates. */
export const WorkableCandidate = z
	.object({
		id: z.string().optional(),
		name: z.string().nullish(),
		firstname: z.string().nullish(),
		lastname: z.string().nullish(),
		email: z.string().nullish(),
		job: z
			.object({
				shortcode: z.string().nullish(),
				title: z.string().nullish(),
			})
			.catchall(z.unknown())
			.nullish(),
		stage: z.string().nullish(),
		disqualified: z.boolean().nullish(),
		created_at: z.coerce.date().nullish(),
		updated_at: z.coerce.date().nullish(),
	})
	.catchall(z.unknown());
export type WorkableCandidate = z.infer<typeof WorkableCandidate>;
