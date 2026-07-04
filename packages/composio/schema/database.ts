import { z } from 'zod';

export const ComposioTool = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().nullable().optional(),
	category: z.string().nullable().optional(),
	enabled: z.boolean().nullable().optional(),
	created_at: z.coerce.date().nullable().optional(),
	updated_at: z.coerce.date().nullable().optional(),
});
export type ComposioTool = z.infer<typeof ComposioTool>;

export const ComposioConnection = z.object({
	id: z.string(),
	app_name: z.string(),
	status: z.string(),
	integration_id: z.string().nullable().optional(),
	created_at: z.coerce.date().nullable().optional(),
	updated_at: z.coerce.date().nullable().optional(),
	deleted_at: z.coerce.date().nullable().optional(),
});
export type ComposioConnection = z.infer<typeof ComposioConnection>;

export const ComposioAction = z.object({
	id: z.string(),
	name: z.string(),
	app_name: z.string(),
	display_name: z.string().nullable().optional(),
	enabled: z.boolean().nullable().optional(),
	created_at: z.coerce.date().nullable().optional(),
});
export type ComposioAction = z.infer<typeof ComposioAction>;
