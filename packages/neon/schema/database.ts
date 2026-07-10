import { z } from 'zod';

export const NeonProject = z.object({
	id: z.string(),
	name: z.string(),
	region_id: z.string(),
	pg_version: z.number(),
	created_at: z.string(),
	updated_at: z.string().optional(),
});
export type NeonProject = z.infer<typeof NeonProject>;

export const NeonBranch = z.object({
	id: z.string(),
	name: z.string(),
	project_id: z.string(),
	projectId: z.string(),
	parent_id: z.string().optional(),
	created_at: z.string(),
	updated_at: z.string().optional(),
});
export type NeonBranch = z.infer<typeof NeonBranch>;

export const NeonDatabase = z.object({
	id: z.number(),
	name: z.string(),
	owner_name: z.string(),
	projectId: z.string(),
	branchId: z.string(),
	created_at: z.string(),
	updated_at: z.string().optional(),
});
export type NeonDatabase = z.infer<typeof NeonDatabase>;

export const NeonRole = z.object({
	name: z.string(),
	protected: z.boolean(),
	projectId: z.string(),
	branchId: z.string(),
	created_at: z.string(),
	updated_at: z.string().optional(),
});
export type NeonRole = z.infer<typeof NeonRole>;
