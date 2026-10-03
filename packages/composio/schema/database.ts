import { z } from 'zod';

export const ComposioTool = z.object({
	id: z.string(),
	slug: z.string(),
	name: z.string(),
	toolkit_slug: z.string().nullable().optional(),
	description: z.string().nullable().optional(),
	version: z.string().nullable().optional(),
	created_at: z.coerce.date().nullable().optional(),
	updated_at: z.coerce.date().nullable().optional(),
});
export type ComposioTool = z.infer<typeof ComposioTool>;

export const ComposioConnection = z.object({
	id: z.string(),
	toolkit_slug: z.string(),
	status: z.string(),
	auth_config_id: z.string().nullable().optional(),
	user_id: z.string().nullable().optional(),
	created_at: z.coerce.date().nullable().optional(),
	updated_at: z.coerce.date().nullable().optional(),
	deleted_at: z.coerce.date().nullable().optional(),
});
export type ComposioConnection = z.infer<typeof ComposioConnection>;

export const ComposioToolkit = z.object({
	id: z.string(),
	slug: z.string(),
	name: z.string(),
	description: z.string().nullable().optional(),
	created_at: z.coerce.date().nullable().optional(),
});
export type ComposioToolkit = z.infer<typeof ComposioToolkit>;
