import { z } from 'zod';

// z.unknown() below is intentional and narrow: Claid.ai returns free-form
// provider payloads (echoed batch request, per-image results/errors, delete
// wrapper) with no stable schema, so unknown keeps validation open while
// every exported surface stays typed via the named schemas below.
const AnyObjectSchema = z.record(z.string(), z.unknown());

const PipelineImageObjectSchema = z
	.object({
		ext: z.string().optional(),
		mps: z.number().optional(),
		mime: z.string().optional(),
		format: z.string().optional(),
		width: z.number().optional(),
		height: z.number().optional(),
		tmp_url: z.string().optional(),
		object_key: z.string().optional(),
		object_bucket: z.string().optional(),
		object_uri: z.string().optional(),
		claid_storage_uri: z.string().optional(),
	})
	.passthrough();

const ImageEditResponseSchema = z
	.object({
		data: z
			.object({
				input: PipelineImageObjectSchema.optional(),
				output: z
					.union([
						PipelineImageObjectSchema,
						z.array(PipelineImageObjectSchema),
					])
					.optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();

const ImageBatchResponseSchema = z
	.object({
		data: z
			.object({
				id: z.union([z.number(), z.string()]).optional(),
				status: z.string().optional(),
				result_url: z.string().optional(),
				created_at: z.string().optional(),
				// Unknown: echoes the submitted batch/async request verbatim.
				request: z.unknown().optional(),
				// Unknown: per-image result/error items vary by operation.
				results: z.array(z.unknown()).optional(),
				errors: z.array(z.unknown()).optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();

const ImageGenerateResponseSchema = z
	.object({
		data: z
			.object({
				// Unknown: generate/scene echo the prompt input object verbatim.
				input: z.unknown().optional(),
				output: z.array(PipelineImageObjectSchema).optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();

const StorageItemSchema = z
	.object({
		id: z.number(),
		name: z.string(),
		type: z.enum(['web_folder', 's3', 'gcs']),
		parameters: AnyObjectSchema,
		created_at: z.string().optional(),
	})
	.passthrough();

const StorageDetailResponseSchema = z
	.object({
		data: StorageItemSchema.optional(),
	})
	.passthrough();

const StorageListResponseSchema = z
	.object({
		data: z.array(StorageItemSchema).optional(),
	})
	.passthrough();

const StorageTypesResponseSchema = z
	.object({
		data: z.array(z.enum(['web_folder', 's3', 'gcs'])).optional(),
	})
	.passthrough();

const DeleteStorageResponseSchema = z
	.object({
		// Unknown: delete returns an empty/generic wrapper with no stable shape.
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
	input: z.string().min(3).max(1024),
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

const DeleteStorageInputSchema = z.object({
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

export type DeleteStorageInput = z.infer<typeof DeleteStorageInputSchema>;

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
	deleteStorage: DeleteStorageInput;
	imageAiEdit: ImageAiEditInput;
	storageList: StorageListInput;
	polishImage: PolishImageInput;
	patchStorage: PatchStorageInput;
	storageTypes: StorageTypesInput;
};

export type ClaidAiEndpointOutputs = {
	backgroundRemove: z.infer<typeof ImageEditResponseSchema>;
	imageEditBatch: z.infer<typeof ImageBatchResponseSchema>;
	licensePlateBlur: z.infer<typeof ImageEditResponseSchema>;
	smartFrame: z.infer<typeof ImageEditResponseSchema>;
	createStorage: z.infer<typeof StorageDetailResponseSchema>;
	backgroundGenerate: z.infer<typeof ImageGenerateResponseSchema>;
	imageGenerate: z.infer<typeof ImageGenerateResponseSchema>;
	generativeResize: z.infer<typeof ImageEditResponseSchema>;
	storageDetails: z.infer<typeof StorageDetailResponseSchema>;
	deleteStorage: z.infer<typeof DeleteStorageResponseSchema>;
	imageAiEdit: z.infer<typeof ImageBatchResponseSchema>;
	storageList: z.infer<typeof StorageListResponseSchema>;
	polishImage: z.infer<typeof ImageEditResponseSchema>;
	patchStorage: z.infer<typeof StorageDetailResponseSchema>;
	storageTypes: z.infer<typeof StorageTypesResponseSchema>;
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
	deleteStorage: DeleteStorageInputSchema,
	imageAiEdit: ImageAiEditInputSchema,
	storageList: StorageListInputSchema,
	polishImage: PolishImageInputSchema,
	patchStorage: PatchStorageInputSchema,
	storageTypes: StorageTypesInputSchema,
} as const;

export const ClaidAiEndpointOutputSchemas = {
	backgroundRemove: ImageEditResponseSchema,
	imageEditBatch: ImageBatchResponseSchema,
	licensePlateBlur: ImageEditResponseSchema,
	smartFrame: ImageEditResponseSchema,
	createStorage: StorageDetailResponseSchema,
	backgroundGenerate: ImageGenerateResponseSchema,
	imageGenerate: ImageGenerateResponseSchema,
	generativeResize: ImageEditResponseSchema,
	storageDetails: StorageDetailResponseSchema,
	deleteStorage: DeleteStorageResponseSchema,
	imageAiEdit: ImageBatchResponseSchema,
	storageList: StorageListResponseSchema,
	polishImage: ImageEditResponseSchema,
	patchStorage: StorageDetailResponseSchema,
	storageTypes: StorageTypesResponseSchema,
} as const;
