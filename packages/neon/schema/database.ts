import { z } from 'zod';

export const NeonProject = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
		org_id: z.string().optional(),
		region_id: z.string().optional(),
		pg_version: z.number().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
	})
	.passthrough();

export const NeonBranch = z
	.object({
		id: z.string().optional(),
		project_id: z.string().optional(),
		name: z.string().optional(),
		parent_id: z.string().optional(),
		default: z.boolean().optional(),
		current_state: z.string().optional(),
		created_at: z.string().optional(),
	})
	.passthrough();

export const NeonDatabase = z
	.object({
		id: z.number().optional(),
		branch_id: z.string().optional(),
		name: z.string().optional(),
		owner_name: z.string().optional(),
		created_at: z.string().optional(),
	})
	.passthrough();

export const NeonRole = z
	.object({
		branch_id: z.string().optional(),
		name: z.string().optional(),
		protected: z.boolean().optional(),
		created_at: z.string().optional(),
	})
	.passthrough();

export const NeonComputeEndpoint = z
	.object({
		id: z.string().optional(),
		project_id: z.string().optional(),
		branch_id: z.string().optional(),
		host: z.string().optional(),
		type: z.string().optional(),
		current_state: z.string().optional(),
	})
	.passthrough();

export const NeonOrganization = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
		handle: z.string().optional(),
		plan: z.string().optional(),
	})
	.passthrough();

export const NeonSnapshot = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
		created_at: z.string().optional(),
	})
	.passthrough();

export const NeonApiKey = z
	.object({
		id: z.number().optional(),
		name: z.string().optional(),
		created_at: z.string().optional(),
		last_used_at: z.string().nullable().optional(),
	})
	.passthrough();

export type NeonProject = z.infer<typeof NeonProject>;
export type NeonBranch = z.infer<typeof NeonBranch>;
export type NeonDatabase = z.infer<typeof NeonDatabase>;
export type NeonRole = z.infer<typeof NeonRole>;
export type NeonComputeEndpoint = z.infer<typeof NeonComputeEndpoint>;
export type NeonOrganization = z.infer<typeof NeonOrganization>;
export type NeonSnapshot = z.infer<typeof NeonSnapshot>;
export type NeonApiKey = z.infer<typeof NeonApiKey>;
