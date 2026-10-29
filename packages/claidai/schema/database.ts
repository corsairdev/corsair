import { z } from 'zod';

// Claid image object returned in `data.input` / `data.output` of image edit and generate calls.
// https://docs.claid.ai/image-editing-api/image-editing-api-reference
const ImageFields = {
	ext: z.string().nullish(),
	mps: z.number().nullish(),
	mime: z.string().nullish(),
	format: z.string().nullish(),
	width: z.number().nullish(),
	height: z.number().nullish(),
	tmp_url: z.string().nullish(),
	object_key: z.string().nullish(),
	object_bucket: z.string().nullish(),
	object_uri: z.string().nullish(),
	claid_storage_uri: z.string().nullish(),
};

// Output image of POST /image/edit (one row per output, keyed by its storage URI or temporary URL).
// https://docs.claid.ai/image-editing-api/image-editing-api-reference
export const ClaidAiEditedImage = z.object({
	id: z.string(),
	...ImageFields,
});

// Output image of POST /image/generate and POST /scene/create.
// https://docs.claid.ai/image-generation-api/image-generation-api-reference
export const ClaidAiGeneratedImage = z.object({
	id: z.string(),
	...ImageFields,
});

// Asynchronous task returned by POST /image/edit/batch and POST /image/ai-edit.
// https://docs.claid.ai/image-editing-api/image-editing-api-reference
export const ClaidAiImageTask = z.object({
	id: z.string(),
	status: z.string().optional(),
	result_url: z.string().optional(),
	created_at: z.string().optional(),
});

// Storage connector from /storage/storages. Credentials are never returned by the API.
// https://docs.claid.ai/storage-api/storage-api-reference
export const ClaidAiStorage = z.object({
	id: z.string(),
	name: z.string().optional(),
	type: z.string().optional(),
	created_at: z.string().optional(),
});

// Storage connector type from GET /storage/storage-types (the type name is its id).
// https://docs.claid.ai/storage-api/storage-api-reference
export const ClaidAiStorageType = z.object({
	id: z.string(),
});

export type ClaidAiEditedImage = z.infer<typeof ClaidAiEditedImage>;
export type ClaidAiGeneratedImage = z.infer<typeof ClaidAiGeneratedImage>;
export type ClaidAiImageTask = z.infer<typeof ClaidAiImageTask>;
export type ClaidAiStorage = z.infer<typeof ClaidAiStorage>;
export type ClaidAiStorageType = z.infer<typeof ClaidAiStorageType>;
