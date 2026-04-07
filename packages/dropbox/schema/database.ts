import { z } from 'zod';

export const DropboxFile = z.object({
	id: z.string(),
	name: z.string().optional(),
	path_lower: z.string().optional(),
	path_display: z.string().optional(),
	size: z.number().optional(),
	is_downloadable: z.boolean().optional(),
	server_modified: z.coerce.date().nullable().optional(),
	client_modified: z.coerce.date().nullable().optional(),
	content_hash: z.string().optional(),
	rev: z.string().optional(),
});

export const DropboxFolder = z.object({
	id: z.string(),
	name: z.string().optional(),
	path_lower: z.string().optional(),
	path_display: z.string().optional(),
});

export type DropboxFile = z.infer<typeof DropboxFile>;
export type DropboxFolder = z.infer<typeof DropboxFolder>;
