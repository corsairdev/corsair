import { z } from 'zod';

export const SupabaseProject = z
	.object({
		id: z.string().optional(),
		ref: z.string().optional(),
		name: z.string().optional(),
		organization_id: z.string().optional(),
		region: z.string().optional(),
		status: z.string().optional(),
		created_at: z.string().optional(),
	})
	.passthrough();

export const SupabaseOrganization = z
	.object({
		id: z.string().optional(),
		slug: z.string().optional(),
		name: z.string().optional(),
	})
	.passthrough();

export const SupabaseFunction = z
	.object({
		id: z.string().optional(),
		slug: z.string().optional(),
		name: z.string().optional(),
		status: z.string().optional(),
		version: z.number().optional(),
	})
	.passthrough();

export const SupabaseBranch = z
	.object({
		id: z.string().optional(),
		ref: z.string().optional(),
		name: z.string().optional(),
		branch_id: z.string().optional(),
		status: z.string().optional(),
	})
	.passthrough();

export const SupabaseBucket = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
		public: z.boolean().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
	})
	.passthrough();

export const SupabaseApiKey = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
		type: z.string().optional(),
		description: z.string().nullable().optional(),
	})
	.passthrough();

export const SupabaseMigration = z
	.object({
		version: z.string().optional(),
		name: z.string().optional(),
		inserted_at: z.string().optional(),
	})
	.passthrough();

export type SupabaseProject = z.infer<typeof SupabaseProject>;
export type SupabaseOrganization = z.infer<typeof SupabaseOrganization>;
export type SupabaseFunction = z.infer<typeof SupabaseFunction>;
export type SupabaseBranch = z.infer<typeof SupabaseBranch>;
export type SupabaseBucket = z.infer<typeof SupabaseBucket>;
export type SupabaseApiKey = z.infer<typeof SupabaseApiKey>;
export type SupabaseMigration = z.infer<typeof SupabaseMigration>;
