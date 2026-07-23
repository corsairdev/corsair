import { z } from 'zod';
import { FilePurposeSchema } from './files';

const UploadPartObjectSchema = z.object({
	id: z.string(),
	object: z.literal('upload.part'),
	created_at: z.number(),
	upload_id: z.string(),
});
export type UploadPartObject = z.infer<typeof UploadPartObjectSchema>;

const UploadedFileObjectSchema = z.object({
	id: z.string(),
	object: z.literal('file'),
	bytes: z.number(),
	created_at: z.number(),
	filename: z.string(),
	purpose: z.string(),
});

const UploadObjectSchema = z.object({
	id: z.string(),
	object: z.literal('upload'),
	bytes: z.number(),
	created_at: z.number(),
	filename: z.string(),
	purpose: z.string(),
	status: z.enum(['pending', 'completed', 'cancelled', 'expired']),
	expires_at: z.number(),
	file: UploadedFileObjectSchema.nullable().optional(),
});
export type UploadObject = z.infer<typeof UploadObjectSchema>;

// --- Create ---

export const UploadsCreateInputSchema = z.object({
	filename: z.string(),
	purpose: FilePurposeSchema,
	bytes: z.number(),
	mimeType: z.string(),
});
export type UploadsCreateInput = z.infer<typeof UploadsCreateInputSchema>;
export const UploadsCreateResponseSchema = UploadObjectSchema;
export type UploadsCreateResponse = z.infer<typeof UploadsCreateResponseSchema>;

// --- Add Part ---

export const UploadsAddPartInputSchema = z.object({
	uploadId: z.string(),
	data: z.union([z.instanceof(Blob), z.string()]),
	fileName: z.string(),
});
export type UploadsAddPartInput = z.infer<typeof UploadsAddPartInputSchema>;
export const UploadsAddPartResponseSchema = UploadPartObjectSchema;
export type UploadsAddPartResponse = z.infer<
	typeof UploadsAddPartResponseSchema
>;

// --- Complete ---

export const UploadsCompleteInputSchema = z.object({
	uploadId: z.string(),
	partIds: z.array(z.string()),
	md5: z.string().optional(),
});
export type UploadsCompleteInput = z.infer<typeof UploadsCompleteInputSchema>;
export const UploadsCompleteResponseSchema = UploadObjectSchema;
export type UploadsCompleteResponse = z.infer<
	typeof UploadsCompleteResponseSchema
>;

// --- Cancel ---

export const UploadsCancelInputSchema = z.object({ uploadId: z.string() });
export type UploadsCancelInput = z.infer<typeof UploadsCancelInputSchema>;
export const UploadsCancelResponseSchema = UploadObjectSchema;
export type UploadsCancelResponse = z.infer<typeof UploadsCancelResponseSchema>;
