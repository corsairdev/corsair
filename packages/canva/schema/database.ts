import { z } from 'zod';

export const CanvaDesign = z.object({
	id: z.string(),
	title: z.string().optional(),
	owner_user_id: z.string().optional(),
	owner_team_id: z.string().optional(),
	created_at: z.coerce.date().nullable().optional(),
	updated_at: z.coerce.date().nullable().optional(),
	page_count: z.number().optional(),
	edit_url: z.string().optional(),
	view_url: z.string().optional(),
	url: z.string().optional(),
});

export const CanvaAsset = z.object({
	id: z.string(),
	type: z.enum(['image', 'video']).optional(),
	name: z.string().optional(),
	tags: z.array(z.string()).optional(),
	created_at: z.coerce.date().nullable().optional(),
	updated_at: z.coerce.date().nullable().optional(),
});

export const CanvaFolder = z.object({
	id: z.string(),
	name: z.string().optional(),
	created_at: z.coerce.date().nullable().optional(),
	updated_at: z.coerce.date().nullable().optional(),
});

export const CanvaBrandTemplate = z.object({
	id: z.string(),
	title: z.string().optional(),
	view_url: z.string().optional(),
	create_url: z.string().optional(),
	created_at: z.coerce.date().nullable().optional(),
	updated_at: z.coerce.date().nullable().optional(),
});

export type CanvaDesign = z.infer<typeof CanvaDesign>;
export type CanvaAsset = z.infer<typeof CanvaAsset>;
export type CanvaFolder = z.infer<typeof CanvaFolder>;
export type CanvaBrandTemplate = z.infer<typeof CanvaBrandTemplate>;
