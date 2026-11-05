import { z } from 'zod';

/**
 * Locally persisted Toggl entities.
 *
 * Only the slow-changing structural records are stored: workspaces, clients,
 * projects and tags. These are read constantly to resolve the ids that almost
 * every other call needs, they change rarely, and Toggl paces requests at about
 * one per second — so caching them locally avoids burning the rate limit on
 * lookups.
 *
 * Time entries are deliberately NOT stored. They are high-volume, mutate while
 * a timer runs, and are almost always wanted as a live view rather than a
 * stale local copy.
 */

export const TogglWorkspaceEntity = z.object({
	id: z.number(),
	organization_id: z.number().nullable().optional(),
	name: z.string(),
	premium: z.boolean().nullable().optional(),
	role: z.string().nullable().optional(),
	default_currency: z.string().nullable().optional(),
	at: z.coerce.date().nullable().optional(),
});
export type TogglWorkspaceEntity = z.infer<typeof TogglWorkspaceEntity>;

export const TogglClientEntity = z.object({
	id: z.number(),
	workspace_id: z.number().nullable().optional(),
	name: z.string(),
	archived: z.boolean().nullable().optional(),
	at: z.coerce.date().nullable().optional(),
});
export type TogglClientEntity = z.infer<typeof TogglClientEntity>;

export const TogglProjectEntity = z.object({
	id: z.number(),
	workspace_id: z.number().nullable().optional(),
	client_id: z.number().nullable().optional(),
	name: z.string(),
	active: z.boolean().nullable().optional(),
	billable: z.boolean().nullable().optional(),
	color: z.string().nullable().optional(),
	at: z.coerce.date().nullable().optional(),
});
export type TogglProjectEntity = z.infer<typeof TogglProjectEntity>;

export const TogglTagEntity = z.object({
	id: z.number(),
	workspace_id: z.number().nullable().optional(),
	name: z.string(),
	at: z.coerce.date().nullable().optional(),
});
export type TogglTagEntity = z.infer<typeof TogglTagEntity>;
