import { z } from 'zod';

export const TurbotPipesActorSchema = z.object({
	id: z.string(),
	handle: z.string(),
	display_name: z.string().nullable().optional(),
	email: z.string().nullable().optional(),
	type: z.string(),
	created_at: z.string().optional(),
	updated_at: z.string().optional(),
});
export type TurbotPipesActor = z.infer<typeof TurbotPipesActorSchema>;

export const TurbotPipesUserSchema = z.object({
	id: z.string(),
	handle: z.string(),
	display_name: z.string().nullable().optional(),
	email: z.string().nullable().optional(),
	avatar_url: z.string().nullable().optional(),
	created_at: z.string().optional(),
	updated_at: z.string().optional(),
});
export type TurbotPipesUser = z.infer<typeof TurbotPipesUserSchema>;

export const TurbotPipesOrgSchema = z.object({
	id: z.string(),
	handle: z.string(),
	display_name: z.string().nullable().optional(),
	avatar_url: z.string().nullable().optional(),
	role: z.string().nullable().optional(),
	created_at: z.string().optional(),
	updated_at: z.string().optional(),
});
export type TurbotPipesOrg = z.infer<typeof TurbotPipesOrgSchema>;

export const TurbotPipesWorkspaceSchema = z.object({
	id: z.string(),
	handle: z.string(),
	title: z.string().nullable().optional(),
	state: z.string().nullable().optional(),
	instance_type: z.string().nullable().optional(),
	created_at: z.string().optional(),
	updated_at: z.string().optional(),
});
export type TurbotPipesWorkspace = z.infer<typeof TurbotPipesWorkspaceSchema>;

export const TurbotPipesConnectionSchema = z.object({
	id: z.string(),
	handle: z.string(),
	plugin: z.string().nullable().optional(),
	state: z.string().nullable().optional(),
	created_at: z.string().optional(),
	updated_at: z.string().optional(),
});
export type TurbotPipesConnection = z.infer<typeof TurbotPipesConnectionSchema>;

export const TurbotPipesQuerySchema = z.object({
	id: z.string(),
	sql: z.string(),
	state: z.string().nullable().optional(),
	rows_returned: z.number().optional(),
	execution_time_ms: z.number().optional(),
	created_at: z.string().optional(),
});
export type TurbotPipesQuery = z.infer<typeof TurbotPipesQuerySchema>;

export const TurbotPipesDatatankSchema = z.object({
	id: z.string(),
	handle: z.string(),
	title: z.string().nullable().optional(),
	state: z.string().nullable().optional(),
	created_at: z.string().optional(),
	updated_at: z.string().optional(),
});
export type TurbotPipesDatatank = z.infer<typeof TurbotPipesDatatankSchema>;

export const TurbotPipesProcessSchema = z.object({
	id: z.string(),
	state: z.string().nullable().optional(),
	type: z.string().nullable().optional(),
	created_at: z.string().optional(),
	updated_at: z.string().optional(),
});
export type TurbotPipesProcess = z.infer<typeof TurbotPipesProcessSchema>;
