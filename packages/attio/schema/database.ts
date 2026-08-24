import { z } from 'zod';

export const AttioWorkspaceMember = z.object({
	id: z.union([
		z.string(),
		z.object({
			workspace_id: z.string(),
			workspace_member_id: z.string(),
		}),
	]),
	name: z.string().nullable().optional(),
	email_address: z.string().nullable().optional(),
	avatar_url: z.string().nullable().optional(),
	created_at: z.coerce.date().nullable().optional(),
});
export type AttioWorkspaceMember = z.infer<typeof AttioWorkspaceMember>;

export const AttioRecord = z.object({
	id: z.union([
		z.string(),
		z.object({
			workspace_id: z.string(),
			object_id: z.string(),
			record_id: z.string(),
		}),
	]),
	values: z.record(z.string(), z.unknown()).optional(),
	created_at: z.coerce.date().nullable().optional(),
});
export type AttioRecord = z.infer<typeof AttioRecord>;
