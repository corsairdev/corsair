import { z } from 'zod';

const JsonPrimitiveSchema = z
	.union([z.string(), z.number(), z.boolean(), z.null()])
	.describe('Primitive JSON value');
type JsonPrimitive = z.infer<typeof JsonPrimitiveSchema>;

export type JsonValue =
	| JsonPrimitive
	| { [key: string]: JsonValue }
	| JsonValue[];

const JsonValueSchema: z.ZodType<JsonValue> = z.lazy(() =>
	z
		.union([
			JsonPrimitiveSchema,
			z.array(JsonValueSchema),
			z.record(z.string(), JsonValueSchema),
		])
		.describe('Arbitrary JSON value'),
);

const JsonObjectSchema = z
	.record(z.string(), JsonValueSchema)
	.describe('JSON object mapping string keys to JSON values');

const StorageTypeSchema = z
	.enum(['web_folder', 's3', 'gcs'])
	.describe('Storage connector type');

const ImageFormatSchema = z
	.enum(['jpeg', 'png', 'webp', 'avif', 'tiff'])
	.describe('Output image format');

const OutputSettingsSchema = z
	.object({
		destination: z
			.string()
			.optional()
			.describe('Storage URI to save the result to'),
		format: ImageFormatSchema.optional(),
	})
	.describe('Output settings');

const OutputDestinationSchema = z
	.union([z.string(), OutputSettingsSchema])
	.describe('Output destination: a storage URI or an output settings object');

const DimensionSchema = z
	.union([z.number().int().positive(), z.string()])
	.describe('Size in pixels, or a string such as "150%" or "auto"');

// ─── Responses ───────────────────────────────────────────────────────────────

const ImageObjectSchema = z
	.object({
		ext: z.string().nullish().describe('File extension'),
		mps: z.number().nullish().describe('Image size in megapixels'),
		mime: z.string().nullish().describe('MIME type'),
		format: z.string().nullish().describe('Image format'),
		width: z.number().nullish().describe('Width in pixels'),
		height: z.number().nullish().describe('Height in pixels'),
		tmp_url: z.string().nullish().describe('Temporary download URL'),
		object_key: z.string().nullish().describe('Object key in the storage'),
		object_bucket: z.string().nullish().describe('Bucket of the stored object'),
		object_uri: z.string().nullish().describe('URI of the stored object'),
		claid_storage_uri: z
			.string()
			.nullish()
			.describe('Claid storage URI of the output'),
	})
	.describe('Image metadata returned by Claid.ai');

const ImageEditResponseSchema = z.object({
	data: z.object({
		input: ImageObjectSchema.optional(),
		output: z.union([ImageObjectSchema, z.array(ImageObjectSchema)]).optional(),
	}),
});

const ImageGenerateResponseSchema = z.object({
	data: z.object({
		input: JsonObjectSchema.optional().describe(
			'Echo of the input the image was generated from',
		),
		output: z.array(ImageObjectSchema).optional(),
	}),
});

const AsyncTaskResultSchema = z.object({
	input_object: ImageObjectSchema.optional(),
	output_object: ImageObjectSchema.optional(),
	output_objects: z.array(ImageObjectSchema).optional(),
});

const AsyncTaskErrorSchema = z.object({
	error: z.string().describe('Error message'),
	created_at: z
		.union([z.string(), z.number()])
		.optional()
		.describe('When the error occurred'),
});

const AsyncTaskResponseSchema = z.object({
	data: z.object({
		id: z.number().describe('Task ID'),
		status: z
			.string()
			.describe('Task status: ACCEPTED, PROCESSING, DONE or ERROR'),
		result_url: z.string().optional().describe('URL to poll for the result'),
		created_at: z.string().optional(),
		request: JsonObjectSchema.optional().describe(
			'Echo of the submitted request',
		),
		errors: z.array(AsyncTaskErrorSchema).optional(),
		result: AsyncTaskResultSchema.optional(),
		results: z.array(AsyncTaskResultSchema).optional(),
	}),
});

const StorageParametersOutSchema = z
	.union([
		z.object({
			path: z.string().optional().describe('Path prefix inside the bucket'),
			bucket: z.string().describe('Bucket name'),
			credentials: z
				.object({ access_key: z.string().describe('Access key') })
				.optional(),
		}),
		z.object({ base_url: z.string().describe('Web folder base URL') }),
	])
	.describe('Storage connection parameters (secrets are not returned)');

const StorageItemSchema = z.object({
	id: z.number().describe('Storage ID'),
	name: z.string().describe('Storage name'),
	type: StorageTypeSchema,
	parameters: StorageParametersOutSchema,
	created_at: z.string().describe('Creation time'),
});

const StorageDetailResponseSchema = z.object({
	data: StorageItemSchema,
});

const StorageListResponseSchema = z.object({
	data: z.array(StorageItemSchema),
});

const StorageTypesResponseSchema = z.object({
	data: z.array(StorageTypeSchema),
});

const DeleteStorageResponseSchema = z.object({
	data: JsonValueSchema.optional().describe('Deletion result'),
});

// ─── Inputs ──────────────────────────────────────────────────────────────────

const ImageUrlSchema = z
	.string()
	.min(1)
	.describe('Image URL or storage URI of the input image');

const BackgroundRemoveInputSchema = z.object({
	input: ImageUrlSchema,
	color: z
		.string()
		.optional()
		.describe('Background color, for example "#ffffff" or "transparent"'),
	output: OutputDestinationSchema.optional(),
});

const ImageEditBatchInputSchema = z.object({
	input: z
		.union([
			z.string().min(1),
			z.array(z.string().min(1)),
			z.object({
				source: z.string().min(1).describe('Storage folder URI'),
				recursive: z
					.boolean()
					.optional()
					.describe('Include images from subfolders'),
			}),
		])
		.describe('Storage folder URI, list of image URLs, or a source object'),
	operations: JsonObjectSchema.describe(
		'Image editing operations, for example { resizing: { width: 1000 } }',
	),
	output: OutputDestinationSchema.optional(),
});

const SingleImageInputSchema = z.object({
	input: ImageUrlSchema,
	output: OutputDestinationSchema.optional(),
});

const SmartFrameInputSchema = z.object({
	input: ImageUrlSchema,
	width: DimensionSchema.describe('Canvas width'),
	height: DimensionSchema.describe('Canvas height'),
	padding: z
		.string()
		.optional()
		.describe('Space around the object, for example "10%" or "30px"'),
	background_color: z
		.string()
		.optional()
		.describe('Canvas color, for example "#ffffff"'),
	output: OutputDestinationSchema.optional(),
});

const GenerativeResizeInputSchema = z.object({
	input: ImageUrlSchema,
	width: DimensionSchema.describe('Target width'),
	height: DimensionSchema.describe('Target height'),
	feathering: z
		.string()
		.optional()
		.describe('Transition smoothness, for example "20%"'),
	output: OutputDestinationSchema.optional(),
});

const CloudCredentialsSchema = z.object({
	access_key: z.string().min(1).describe('Access key'),
	secret_access_key: z.string().min(1).describe('Secret access key'),
});

const CloudParametersSchema = z.object({
	path: z.string().optional().describe('Path prefix inside the bucket'),
	bucket: z.string().min(1).describe('Bucket name'),
	credentials: CloudCredentialsSchema,
});

const WebFolderParametersSchema = z.object({
	base_url: z.string().min(1).describe('Web folder base URL'),
});

const StorageNameSchema = z.string().min(1).max(50).describe('Storage name');

const CreateStorageInputSchema = z.discriminatedUnion('type', [
	z.object({
		name: StorageNameSchema,
		type: z.literal('s3'),
		parameters: CloudParametersSchema,
	}),
	z.object({
		name: StorageNameSchema,
		type: z.literal('gcs'),
		parameters: CloudParametersSchema,
	}),
	z.object({
		name: StorageNameSchema,
		type: z.literal('web_folder'),
		parameters: WebFolderParametersSchema,
	}),
]);

const StorageIdSchema = z.number().int().positive().describe('Storage ID');

const StorageIdInputSchema = z.object({
	storage_id: StorageIdSchema,
});

const PatchStorageInputSchema = z.object({
	storage_id: StorageIdSchema,
	name: StorageNameSchema.optional(),
	type: StorageTypeSchema.optional(),
	parameters: z
		.union([
			WebFolderParametersSchema,
			z.object({
				path: z.string().optional().describe('Path prefix inside the bucket'),
				bucket: z.string().min(1).optional().describe('Bucket name'),
				credentials: CloudCredentialsSchema.partial().optional(),
			}),
		])
		.optional()
		.describe('Storage connection parameters to update'),
});

const BackgroundGenerateInputSchema = z.object({
	object: z
		.object({
			image_url: ImageUrlSchema,
			placement_type: z.enum(['absolute', 'original']).optional(),
			rotation_degree: z.number().optional(),
			scale: z.number().optional(),
			position: z
				.object({ x: z.number(), y: z.number() })
				.optional()
				.describe('Relative object position on the scene'),
		})
		.describe('Product object to place on the scene'),
	scene: z
		.object({
			prompt: z
				.union([
					z.string(),
					z.object({
						generate: z.boolean(),
						guidelines: z.string().optional(),
					}),
				])
				.optional()
				.describe('Scene description, or a request to generate one'),
			negative_prompt: z.string().optional(),
			model: z.enum(['v1', 'v2']).optional(),
			template_url: z.string().optional(),
			template_mode: z.enum(['transform', 'adjust', 'lock']).optional(),
			color: z.string().optional(),
			view: z.enum(['top', 'front']).optional(),
			aspect_ratio: z.string().optional().describe('For example "1:1"'),
			preference: z.enum(['fast', 'optimal', 'best']).optional(),
		})
		.describe('Scene settings'),
	output: z
		.object({
			destination: z.string().optional(),
			number_of_images: z.number().int().positive().optional(),
			format: z.enum(['png', 'jpeg', 'webp', 'avif']).optional(),
		})
		.optional()
		.describe('Output settings'),
});

const ImageGenerateInputSchema = z.object({
	input: z.string().min(3).max(1024).describe('Text prompt'),
	options: z
		.object({
			number_of_images: z.number().int().positive().optional(),
			guidance_scale: z.number().optional(),
		})
		.optional()
		.describe('Generation options'),
	output: z.string().optional().describe('Storage folder URI for results'),
});

const ImageAiEditInputSchema = z.object({
	input: ImageUrlSchema,
	options: z
		.object({
			prompt: z.string().min(1).describe('Edit instruction'),
			model: z.enum(['v1', 'v2']).optional(),
			inference_steps: z.number().int().positive().optional(),
			guidance_scale: z.number().optional(),
			aspect_ratio: z.string().optional().describe('For example "1:1"'),
		})
		.describe('AI edit options'),
	output: z
		.object({
			destination: z.string().optional(),
			format: z.enum(['png', 'jpeg']).optional(),
			number_of_images: z.number().int().positive().optional(),
		})
		.optional()
		.describe('Output settings'),
});

const EmptyInputSchema = z.object({});

export type BackgroundRemoveInput = z.infer<typeof BackgroundRemoveInputSchema>;
export type ImageEditBatchInput = z.infer<typeof ImageEditBatchInputSchema>;
export type LicensePlateBlurInput = z.infer<typeof SingleImageInputSchema>;
export type SmartFrameInput = z.infer<typeof SmartFrameInputSchema>;
export type CreateStorageInput = z.infer<typeof CreateStorageInputSchema>;
export type BackgroundGenerateInput = z.infer<
	typeof BackgroundGenerateInputSchema
>;
export type ImageGenerateInput = z.infer<typeof ImageGenerateInputSchema>;
export type GenerativeResizeInput = z.infer<typeof GenerativeResizeInputSchema>;
export type StorageDetailsInput = z.infer<typeof StorageIdInputSchema>;
export type DeleteStorageInput = z.infer<typeof StorageIdInputSchema>;
export type ImageAiEditInput = z.infer<typeof ImageAiEditInputSchema>;
export type StorageListInput = z.infer<typeof EmptyInputSchema>;
export type PolishImageInput = z.infer<typeof SingleImageInputSchema>;
export type PatchStorageInput = z.infer<typeof PatchStorageInputSchema>;
export type StorageTypesInput = z.infer<typeof EmptyInputSchema>;

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

export const ClaidAiEndpointInputSchemas = {
	backgroundRemove: BackgroundRemoveInputSchema,
	imageEditBatch: ImageEditBatchInputSchema,
	licensePlateBlur: SingleImageInputSchema,
	smartFrame: SmartFrameInputSchema,
	createStorage: CreateStorageInputSchema,
	backgroundGenerate: BackgroundGenerateInputSchema,
	imageGenerate: ImageGenerateInputSchema,
	generativeResize: GenerativeResizeInputSchema,
	storageDetails: StorageIdInputSchema,
	deleteStorage: StorageIdInputSchema,
	imageAiEdit: ImageAiEditInputSchema,
	storageList: EmptyInputSchema,
	polishImage: SingleImageInputSchema,
	patchStorage: PatchStorageInputSchema,
	storageTypes: EmptyInputSchema,
} as const;

export const ClaidAiEndpointOutputSchemas = {
	backgroundRemove: ImageEditResponseSchema,
	imageEditBatch: AsyncTaskResponseSchema,
	licensePlateBlur: ImageEditResponseSchema,
	smartFrame: ImageEditResponseSchema,
	createStorage: StorageDetailResponseSchema,
	backgroundGenerate: ImageGenerateResponseSchema,
	imageGenerate: ImageGenerateResponseSchema,
	generativeResize: ImageEditResponseSchema,
	storageDetails: StorageDetailResponseSchema,
	deleteStorage: DeleteStorageResponseSchema,
	imageAiEdit: AsyncTaskResponseSchema,
	storageList: StorageListResponseSchema,
	polishImage: ImageEditResponseSchema,
	patchStorage: StorageDetailResponseSchema,
	storageTypes: StorageTypesResponseSchema,
} as const;

export type ClaidAiEndpointOutputs = {
	[K in keyof typeof ClaidAiEndpointOutputSchemas]: z.infer<
		(typeof ClaidAiEndpointOutputSchemas)[K]
	>;
};
