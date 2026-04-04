import { z } from 'zod';

export const MondayBoard = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().nullable().optional(),
	board_kind: z.string().optional(),
	state: z.string().optional(),
	workspace_id: z.union([z.string(), z.number()]).nullable().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export const MondayItem = z.object({
	id: z.string(),
	name: z.string(),
	state: z.string().optional(),
	board_id: z.string().optional(),
	group_id: z.string().optional(),
	created_at: z.string().nullable().optional(),
	createdAt: z.coerce.date().nullable().optional(),
	creator_id: z.string().nullable().optional(),
});

export const MondayUpdate = z.object({
	id: z.string(),
	body: z.string().optional(),
	text_body: z.string().nullable().optional(),
	item_id: z.string().optional(),
	created_at: z.string().nullable().optional(),
	createdAt: z.coerce.date().nullable().optional(),
	creator_id: z.string().nullable().optional(),
});

export const MondayUser = z.object({
	id: z.string(),
	name: z.string().optional(),
	email: z.string().optional(),
	photo_thumb: z.string().nullable().optional(),
	title: z.string().nullable().optional(),
	is_admin: z.boolean().optional(),
	is_guest: z.boolean().optional(),
});

export type MondayBoard = z.infer<typeof MondayBoard>;
export type MondayItem = z.infer<typeof MondayItem>;
export type MondayUpdate = z.infer<typeof MondayUpdate>;
export type MondayUser = z.infer<typeof MondayUser>;
