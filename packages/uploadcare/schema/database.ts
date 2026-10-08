import { z } from 'zod';

/** Official REST v0.7 File info — https://uploadcare.com/docs/api/rest/file/info */
export const UploadcareFile = z
	.object({
		uuid: z.string(),
		datetime_uploaded: z.string().nullable().optional(),
		datetime_stored: z.string().nullable().optional(),
		datetime_removed: z.string().nullable().optional(),
		is_image: z.boolean().optional(),
		is_ready: z.boolean().optional(),
		mime_type: z.string().optional(),
		original_filename: z.string().optional(),
		original_file_url: z.string().nullable().optional(),
		size: z.number().optional(),
		url: z.string().optional(),
		variations: z.record(z.string(), z.string()).nullable().optional(),
		content_info: z.record(z.string(), z.json()).optional(),
		metadata: z.record(z.string(), z.string()).optional(),
		appdata: z.record(z.string(), z.json()).optional(),
		tags: z.array(z.string()).optional(),
	})
	.loose();

/** Official REST v0.7 Group info — https://uploadcare.com/docs/api/rest/group/info */
export const UploadcareGroup = z
	.object({
		id: z.string(),
		datetime_created: z.string().nullable().optional(),
		files_count: z.number().optional(),
		cdn_url: z.string().optional(),
		url: z.string().optional(),
		files: z.array(z.json()).nullable().optional(),
	})
	.loose();

export type UploadcareFile = z.infer<typeof UploadcareFile>;
export type UploadcareGroup = z.infer<typeof UploadcareGroup>;
