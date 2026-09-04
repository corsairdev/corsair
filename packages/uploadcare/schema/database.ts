import { z } from 'zod';

export const UploadcareFile = z
	.object({
		uuid: z.string(),
		original_filename: z.string().nullable().optional(),
		size: z.number().optional(),
		is_ready: z.boolean().optional(),
		is_image: z.boolean().nullable().optional(),
		mime_type: z.string().nullable().optional(),
		datetime_uploaded: z.coerce.date().nullable().optional(),
		datetime_stored: z.coerce.date().nullable().optional(),
		datetime_removed: z.coerce.date().nullable().optional(),
	})
	.catchall(z.unknown());

export const UploadcareGroup = z
	.object({
		id: z.string(),
		datetime_created: z.coerce.date().nullable().optional(),
		datetime_stored: z.coerce.date().nullable().optional(),
		files_count: z.number().optional(),
	})
	.catchall(z.unknown());

export type UploadcareFile = z.infer<typeof UploadcareFile>;
export type UploadcareGroup = z.infer<typeof UploadcareGroup>;

