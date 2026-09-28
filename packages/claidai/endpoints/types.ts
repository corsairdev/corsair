import { z } from 'zod';

const AnyObjectSchema = z.record(z.string(), z.unknown());

const ImageResponseSchema = z
	.object({
		data: z.unknown().optional(),
	})
	.passthrough();

const BackgroundRemoveInputSchema = z.object({
	input: z.string().min(1),
	operations: AnyObjectSchema,
});

const ImageEditBatchInputSchema = z.object({
	input: z.union([
		z.string().min(1),
		z.array(z.string().min(1)),
		z.object({
			source: z.string().min(1),
			recursive: z.boolean().optional(),
		}),
	]),
	operations: AnyObjectSchema,
	output: z.union([z.string(), AnyObjectSchema]).optional(),
});

const LicensePlateBlurInputSchema = z.object({
	input: z.string().min(1),
});

const SmartFrameInputSchema = z.object({
	input: z.string().min(1),
	options: AnyObjectSchema,
});

const CreateStorageInputSchema = z.object({
	name: z.string().min(1).max(50),
	type: z.enum(['web_folder', 's3', 'gcs']),
	parameters: AnyObjectSchema,
});

const BackgroundGenerateInputSchema = z.object({
	object: AnyObjectSchema,
	scene: AnyObjectSchema,
	output: AnyObjectSchema.optional(),
});

const ImageGenerateInputSchema = z.object({
	input: z.string().min(1),
	options: AnyObjectSchema.optional(),
	output: z.union([z.string(), AnyObjectSchema]).optional(),
});

const GenerativeResizeInputSchema = z.object({
	input: z.string().min(1),
	operations: AnyObjectSchema,
});

const StorageDetailsInputSchema = z.object({
	storage_id: z.number().int().positive(),
});

const ImageAiEditInputSchema = z.object({
	input: z.string().min(1),
	options: AnyObjectSchema,
	output: z.union([z.string(), AnyObjectSchema]).optional(),
});

const StorageListInputSchema = z.object({});

const PolishImageInputSchema = z.object({
	input: z.string().min(1),
});

const PatchStorageInputSchema = z.object({
	storage_id: z.number().int().positive(),
	name: z.string().min(1).max(50).optional(),
	type: z.enum(['web_folder', 's3', 'gcs']).optional(),
	parameters: AnyObjectSchema.optional(),
});

const StorageTypesInputSchema = z.object({});

export type BackgroundRemoveInput = z.infer<typeof BackgroundRemoveInputSchema>;

export type ImageEditBatchInput = z.infer<typeof ImageEditBatchInputSchema>;

export type LicensePlateBlurInput = z.infer<typeof LicensePlateBlurInputSchema>;

export type SmartFrameInput = z.infer<typeof SmartFrameInputSchema>;

export type CreateStorageInput = z.infer<typeof CreateStorageInputSchema>;

export type BackgroundGenerateInput = z.infer<
	typeof BackgroundGenerateInputSchema
>;

export type ImageGenerateInput = z.infer<typeof ImageGenerateInputSchema>;

export type GenerativeResizeInput = z.infer<typeof GenerativeResizeInputSchema>;

export type StorageDetailsInput = z.infer<typeof StorageDetailsInputSchema>;

export type ImageAiEditInput = z.infer<typeof ImageAiEditInputSchema>;

export type StorageListInput = z.infer<typeof StorageListInputSchema>;

export type PolishImageInput = z.infer<typeof PolishImageInputSchema>;

export type PatchStorageInput = z.infer<typeof PatchStorageInputSchema>;

export type StorageTypesInput = z.infer<typeof StorageTypesInputSchema>;

export type ClaidAiEndpointInputs = {
	backgroundRemove: BackgroundRemoveInput;
	imageEditBatch: ImageEditBatchInput;
	licensePlateBlur: LicensePlateBlurInput;
	smartFrame: SmartFrameInput;
	createStorage: CreateStorageInput;
	backgroundGenerate: BackgroundGenerateInput;
	imageGenerate: ImageGenerateInput;
	generativeResize: GenerativeResizeInput;
	storageDetails: StorageDetailsInput;
	imageAiEdit: ImageAiEditInput;
	storageList: StorageListInput;
	polishImage: PolishImageInput;
	patchStorage: PatchStorageInput;
	storageTypes: StorageTypesInput;
};

export type ClaidAiEndpointOutputs = {
	backgroundRemove: z.infer<typeof ImageResponseSchema>;
	imageEditBatch: z.infer<typeof ImageResponseSchema>;
	licensePlateBlur: z.infer<typeof ImageResponseSchema>;
	smartFrame: z.infer<typeof ImageResponseSchema>;
	createStorage: z.infer<typeof ImageResponseSchema>;
	backgroundGenerate: z.infer<typeof ImageResponseSchema>;
	imageGenerate: z.infer<typeof ImageResponseSchema>;
	generativeResize: z.infer<typeof ImageResponseSchema>;
	storageDetails: z.infer<typeof ImageResponseSchema>;
	imageAiEdit: z.infer<typeof ImageResponseSchema>;
	storageList: z.infer<typeof ImageResponseSchema>;
	polishImage: z.infer<typeof ImageResponseSchema>;
	patchStorage: z.infer<typeof ImageResponseSchema>;
	storageTypes: z.infer<typeof ImageResponseSchema>;
};

export const ClaidAiEndpointInputSchemas = {
	backgroundRemove: BackgroundRemoveInputSchema,
	imageEditBatch: ImageEditBatchInputSchema,
	licensePlateBlur: LicensePlateBlurInputSchema,
	smartFrame: SmartFrameInputSchema,
	createStorage: CreateStorageInputSchema,
	backgroundGenerate: BackgroundGenerateInputSchema,
	imageGenerate: ImageGenerateInputSchema,
	generativeResize: GenerativeResizeInputSchema,
	storageDetails: StorageDetailsInputSchema,
	imageAiEdit: ImageAiEditInputSchema,
	storageList: StorageListInputSchema,
	polishImage: PolishImageInputSchema,
	patchStorage: PatchStorageInputSchema,
	storageTypes: StorageTypesInputSchema,
} as const;

export const ClaidAiEndpointOutputSchemas = {
	backgroundRemove: ImageResponseSchema,
	imageEditBatch: ImageResponseSchema,
	licensePlateBlur: ImageResponseSchema,
	smartFrame: ImageResponseSchema,
	createStorage: ImageResponseSchema,
	backgroundGenerate: ImageResponseSchema,
	imageGenerate: ImageResponseSchema,
	generativeResize: ImageResponseSchema,
	storageDetails: ImageResponseSchema,
	imageAiEdit: ImageResponseSchema,
	storageList: ImageResponseSchema,
	polishImage: ImageResponseSchema,
	patchStorage: ImageResponseSchema,
	storageTypes: ImageResponseSchema,
} as const;
