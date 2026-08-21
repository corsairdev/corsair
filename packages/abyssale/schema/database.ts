import { z } from 'zod';

/**
 * Cached entities mirror Abyssale REST responses verbatim, so field names match
 * the wire format. Each is `.loose()` so a newer API response is never rejected.
 *
 * Shapes follow the Abyssale REST reference and were confirmed against the live
 * API (`GET /projects`, `GET /fonts`, `GET /designs`).
 */

/** `POST /projects` and `GET /projects`. */
export const AbyssaleProject = z
	.object({
		id: z.string(),
		name: z.string(),
		created_at_ts: z.number().optional(),
		// Returned by the list endpoint; documented as deprecated.
		category_name: z.string().optional(),
		version: z.string().optional(),
	})
	.loose();

/** `GET /designs`. */
export const AbyssaleDesign = z
	.object({
		id: z.string(),
		template_id: z.string().optional(),
		name: z.string(),
		type: z.string(),
		project_id: z.string().optional(),
		project_name: z.string().optional(),
		category_id: z.string().optional(),
		category_name: z.string().optional(),
		version: z.string().optional(),
		created_at: z.number().optional(),
		updated_at: z.number().optional(),
		preview_url: z.string().optional(),
	})
	.loose();

/** `GET /fonts`. */
export const AbyssaleFont = z
	.object({
		id: z.string(),
		name: z.string(),
		type: z.enum(['google', 'custom']),
		available_weights: z.array(z.union([z.number(), z.string()])),
	})
	.loose();

export type AbyssaleProject = z.infer<typeof AbyssaleProject>;
export type AbyssaleDesign = z.infer<typeof AbyssaleDesign>;
export type AbyssaleFont = z.infer<typeof AbyssaleFont>;
