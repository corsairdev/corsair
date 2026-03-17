import { z } from 'zod';

export const BoxFile = z.object({
	id: z.string(),
	type: z.string().optional(),
	name: z.string().optional(),
	size: z.number().optional(),
	description: z.string().optional(),
	etag: z.string().optional(),
	sha1: z.string().optional(),
	sequence_id: z.string().optional(),
	extension: z.string().optional(),
	is_package: z.boolean().optional(),
	content_created_at: z.string().nullable().optional(),
	content_modified_at: z.string().nullable().optional(),
	created_at: z.string().nullable().optional(),
	modified_at: z.string().nullable().optional(),
	trashed_at: z.string().nullable().optional(),
	purged_at: z.string().nullable().optional(),
	item_status: z.string().optional(),
});

export const BoxFolder = z.object({
	id: z.string(),
	type: z.string().optional(),
	name: z.string().optional(),
	description: z.string().optional(),
	etag: z.string().optional(),
	sequence_id: z.string().nullable().optional(),
	created_at: z.string().nullable().optional(),
	modified_at: z.string().nullable().optional(),
	trashed_at: z.string().nullable().optional(),
	purged_at: z.string().nullable().optional(),
	content_created_at: z.string().nullable().optional(),
	content_modified_at: z.string().nullable().optional(),
	is_externally_owned: z.boolean().optional(),
	has_collaborations: z.boolean().optional(),
	item_status: z.string().optional(),
});

export type BoxFile = z.infer<typeof BoxFile>;
export type BoxFolder = z.infer<typeof BoxFolder>;
