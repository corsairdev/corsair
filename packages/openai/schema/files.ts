import { z } from 'zod';

export const FilePurposeSchema = z.enum([
	'assistants',
	'assistants_output',
	'batch',
	'batch_output',
	'fine-tune',
	'fine-tune-results',
	'vision',
	'user_data',
	'evals',
]);
export type FilePurpose = z.infer<typeof FilePurposeSchema>;

const FileObjectSchema = z.object({
	id: z.string(),
	object: z.literal('file'),
	bytes: z.number(),
	created_at: z.number(),
	expires_at: z.number().optional(),
	filename: z.string(),
	purpose: FilePurposeSchema,
});
export type FileObject = z.infer<typeof FileObjectSchema>;

export const FilesUploadInputSchema = z.object({
	file: z.union([z.instanceof(Blob), z.string()]),
	fileName: z.string(),
	purpose: FilePurposeSchema,
});
export type FilesUploadInput = z.infer<typeof FilesUploadInputSchema>;

export const FilesUploadResponseSchema = FileObjectSchema;
export type FilesUploadResponse = z.infer<typeof FilesUploadResponseSchema>;

export const FilesListInputSchema = z.object({
	purpose: FilePurposeSchema.optional(),
	limit: z.number().optional(),
	order: z.enum(['asc', 'desc']).optional(),
	after: z.string().optional(),
});
export type FilesListInput = z.infer<typeof FilesListInputSchema>;

export const FilesListResponseSchema = z.object({
	object: z.literal('list'),
	data: z.array(FileObjectSchema),
	has_more: z.boolean().optional(),
	first_id: z.string().optional(),
	last_id: z.string().optional(),
});
export type FilesListResponse = z.infer<typeof FilesListResponseSchema>;

export const FilesRetrieveInputSchema = z.object({
	fileId: z.string(),
});
export type FilesRetrieveInput = z.infer<typeof FilesRetrieveInputSchema>;

export const FilesRetrieveResponseSchema = FileObjectSchema;
export type FilesRetrieveResponse = z.infer<typeof FilesRetrieveResponseSchema>;

export const FilesDeleteInputSchema = z.object({
	fileId: z.string(),
});
export type FilesDeleteInput = z.infer<typeof FilesDeleteInputSchema>;

export const FilesDeleteResponseSchema = z.object({
	id: z.string(),
	object: z.literal('file'),
	deleted: z.boolean(),
});
export type FilesDeleteResponse = z.infer<typeof FilesDeleteResponseSchema>;

export const FilesDownloadContentInputSchema = z.object({
	fileId: z.string(),
});
export type FilesDownloadContentInput = z.infer<
	typeof FilesDownloadContentInputSchema
>;

export const FilesDownloadContentResponseSchema = z.object({
	fileId: z.string(),
	contentBase64: z.string(),
});
export type FilesDownloadContentResponse = z.infer<
	typeof FilesDownloadContentResponseSchema
>;
