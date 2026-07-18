import { z } from 'zod';

const ExpiresAfterSchema = z.object({
	anchor: z.string(),
	minutes: z.number(),
});

const ContainerObjectSchema = z.object({
	id: z.string(),
	object: z.literal('container'),
	created_at: z.number(),
	name: z.string().optional(),
	status: z.string().optional(),
	expires_after: ExpiresAfterSchema.nullable().optional(),
});
export type ContainerObject = z.infer<typeof ContainerObjectSchema>;

const ContainerFileObjectSchema = z.object({
	id: z.string(),
	object: z.literal('container.file'),
	container_id: z.string(),
	created_at: z.number(),
	bytes: z.number().optional(),
	path: z.string().optional(),
	source: z.string().optional(),
});
export type ContainerFileObject = z.infer<typeof ContainerFileObjectSchema>;

// --- Containers ---

export const ContainersCreateInputSchema = z.object({
	name: z.string().optional(),
	fileIds: z.array(z.string()).optional(),
	expiresAfter: ExpiresAfterSchema.optional(),
});
export type ContainersCreateInput = z.infer<typeof ContainersCreateInputSchema>;
export const ContainersCreateResponseSchema = ContainerObjectSchema;
export type ContainersCreateResponse = z.infer<
	typeof ContainersCreateResponseSchema
>;

export const ContainersListInputSchema = z.object({
	limit: z.number().optional(),
	order: z.enum(['asc', 'desc']).optional(),
	after: z.string().optional(),
});
export type ContainersListInput = z.infer<typeof ContainersListInputSchema>;
export const ContainersListResponseSchema = z.object({
	object: z.literal('list'),
	data: z.array(ContainerObjectSchema),
	first_id: z.string().optional(),
	last_id: z.string().optional(),
	has_more: z.boolean(),
});
export type ContainersListResponse = z.infer<
	typeof ContainersListResponseSchema
>;

export const ContainersRetrieveInputSchema = z.object({
	containerId: z.string(),
});
export type ContainersRetrieveInput = z.infer<
	typeof ContainersRetrieveInputSchema
>;
export const ContainersRetrieveResponseSchema = ContainerObjectSchema;
export type ContainersRetrieveResponse = z.infer<
	typeof ContainersRetrieveResponseSchema
>;

export const ContainersDeleteInputSchema = z.object({
	containerId: z.string(),
});
export type ContainersDeleteInput = z.infer<typeof ContainersDeleteInputSchema>;
export const ContainersDeleteResponseSchema = z.object({
	id: z.string(),
	object: z.literal('container.deleted'),
	deleted: z.boolean(),
});
export type ContainersDeleteResponse = z.infer<
	typeof ContainersDeleteResponseSchema
>;

// --- Container Files ---

export const ContainerFilesCreateInputSchema = z
	.object({
		containerId: z.string(),
		file: z.union([z.instanceof(Blob), z.string()]).optional(),
		fileName: z.string().optional(),
		fileId: z.string().optional(),
	})
	.superRefine((value, ctx) => {
		// The OpenAI Containers API requires either a reference to an existing
		// file (fileId) or a new upload (file + fileName together). An empty
		// payload would pass Zod but the API rejects it, so enforce it here.
		const hasFileId = value.fileId !== undefined;
		const hasUpload = value.file !== undefined && value.fileName !== undefined;
		if (!hasFileId && !hasUpload) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Provide either fileId, or both file and fileName',
				path: ['file'],
			});
		}
		// file + fileName must be set together; a half pair would silently drop the upload.
		if (
			(value.file !== undefined || value.fileName !== undefined) &&
			!(value.file !== undefined && value.fileName !== undefined)
		) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'file and fileName must both be provided together',
				path: value.file !== undefined ? ['fileName'] : ['file'],
			});
		}
	});
export type ContainerFilesCreateInput = z.infer<
	typeof ContainerFilesCreateInputSchema
>;
export const ContainerFilesCreateResponseSchema = ContainerFileObjectSchema;
export type ContainerFilesCreateResponse = z.infer<
	typeof ContainerFilesCreateResponseSchema
>;

export const ContainerFilesListInputSchema = z.object({
	containerId: z.string(),
	limit: z.number().optional(),
	order: z.enum(['asc', 'desc']).optional(),
	after: z.string().optional(),
});
export type ContainerFilesListInput = z.infer<
	typeof ContainerFilesListInputSchema
>;
export const ContainerFilesListResponseSchema = z.object({
	object: z.literal('list'),
	data: z.array(ContainerFileObjectSchema),
	first_id: z.string().optional(),
	last_id: z.string().optional(),
	has_more: z.boolean(),
});
export type ContainerFilesListResponse = z.infer<
	typeof ContainerFilesListResponseSchema
>;

export const ContainerFilesRetrieveInputSchema = z.object({
	containerId: z.string(),
	fileId: z.string(),
});
export type ContainerFilesRetrieveInput = z.infer<
	typeof ContainerFilesRetrieveInputSchema
>;
export const ContainerFilesRetrieveResponseSchema = ContainerFileObjectSchema;
export type ContainerFilesRetrieveResponse = z.infer<
	typeof ContainerFilesRetrieveResponseSchema
>;

export const ContainerFilesRetrieveContentInputSchema = z.object({
	containerId: z.string(),
	fileId: z.string(),
});
export type ContainerFilesRetrieveContentInput = z.infer<
	typeof ContainerFilesRetrieveContentInputSchema
>;
export const ContainerFilesRetrieveContentResponseSchema = z.object({
	containerId: z.string(),
	fileId: z.string(),
	contentBase64: z.string(),
});
export type ContainerFilesRetrieveContentResponse = z.infer<
	typeof ContainerFilesRetrieveContentResponseSchema
>;

export const ContainerFilesDeleteInputSchema = z.object({
	containerId: z.string(),
	fileId: z.string(),
});
export type ContainerFilesDeleteInput = z.infer<
	typeof ContainerFilesDeleteInputSchema
>;
export const ContainerFilesDeleteResponseSchema = z.object({
	id: z.string(),
	object: z.literal('container.file.deleted'),
	deleted: z.boolean(),
});
export type ContainerFilesDeleteResponse = z.infer<
	typeof ContainerFilesDeleteResponseSchema
>;
