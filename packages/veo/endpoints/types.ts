import { z } from 'zod';

// Shapes follow the current Veo REST guides on Gemini Enterprise Agent Platform
// (the Vertex AI predictLongRunning API). Gemini API preview model ids were
// shut down on 2026-10-22 and are not sent.
// https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/veo/3-1-generate
// https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/video/generate-videos-from-text
// https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/video/generate-videos-from-an-image
// https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/video/generate-videos-from-first-and-last-frames
// https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/video/generate-videos-from-references
// https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/video/extend-videos

export const VEO_MODELS = [
	'veo-3.1-generate-001',
	'veo-3.1-fast-generate-001',
	'veo-3.1-lite-generate-001',
] as const;

/** GA models. Reference images are documented for these, not for Lite. */
export const VEO_REFERENCE_MODELS = [
	'veo-3.1-generate-001',
	'veo-3.1-fast-generate-001',
] as const;

const projectId = z
	.string()
	.min(1)
	.optional()
	.describe(
		'Google Cloud project id. Falls back to veo({ projectId }) or the stored projectId account field.',
	);

const location = z
	.string()
	.min(1)
	.optional()
	.describe(
		'API location. Defaults to us-central1, the region in the Veo REST samples. Pass global for the global host.',
	);

const generationFields = {
	projectId,
	location,
	aspectRatio: z
		.enum(['16:9', '9:16'])
		.optional()
		.describe('Defaults to 16:9 when omitted.'),
	negativePrompt: z.string().min(1).optional(),
	personGeneration: z
		.enum(['allow_adult', 'disallow'])
		.optional()
		.describe('Defaults to allow_adult when omitted.'),
	resolution: z
		.enum(['720p', '1080p', '4k'])
		.optional()
		.describe('Veo 3 models. Defaults to 720p. 4k is documented for Veo 3.1.'),
	sampleCount: z
		.number()
		.int()
		.min(1)
		.max(4)
		.optional()
		.describe('Number of videos to generate, from 1 to 4.'),
	seed: z.number().int().min(0).max(4_294_967_295).optional(),
	storageUri: z
		.string()
		.startsWith('gs://')
		.optional()
		.describe(
			'Cloud Storage prefix for output. When omitted, the API returns video bytes in the operation response.',
		),
	durationSeconds: z
		.union([z.literal(4), z.literal(6), z.literal(8)])
		.optional()
		.describe('Video length in seconds. Defaults to 8 when omitted.'),
};

export const VeoImageSchema = z
	.object({
		mimeType: z.enum(['image/jpeg', 'image/png']),
		bytesBase64Encoded: z
			.string()
			.min(1)
			.optional()
			.describe('Base64-encoded image bytes, without a data-URL prefix.'),
		gcsUri: z.string().startsWith('gs://').optional(),
	})
	.refine(
		(value) =>
			(value.bytesBase64Encoded !== undefined) !== (value.gcsUri !== undefined),
		{ message: 'Provide exactly one of bytesBase64Encoded or gcsUri' },
	);
export type VeoImage = z.infer<typeof VeoImageSchema>;

export const VeoVideoInputSchema = z.object({
	gcsUri: z.string().startsWith('gs://'),
	mimeType: z.literal('video/mp4'),
});
export type VeoVideoInput = z.infer<typeof VeoVideoInputSchema>;

export const VeoReferenceImageSchema = z.object({
	image: VeoImageSchema,
	referenceType: z.literal('asset'),
});

const TextToVideoCreateInputSchema = z.object({
	...generationFields,
	model: z.enum(VEO_MODELS),
	prompt: z.string().min(1),
});
export type TextToVideoCreateInput = z.infer<
	typeof TextToVideoCreateInputSchema
>;

const ImageToVideoCreateInputSchema = z.object({
	...generationFields,
	model: z.enum(VEO_MODELS),
	prompt: z
		.string()
		.min(1)
		.optional()
		.describe(
			'Optional. The image guide allows an image alone or an image plus text.',
		),
	image: VeoImageSchema,
	resizeMode: z
		.enum(['crop', 'pad'])
		.optional()
		.describe(
			'How to fit an image whose aspect ratio differs from the output. crop fits by cropping; pad fits by padding.',
		),
});
export type ImageToVideoCreateInput = z.infer<
	typeof ImageToVideoCreateInputSchema
>;

const FramesCreateInputSchema = z.object({
	...generationFields,
	model: z.enum(VEO_MODELS),
	prompt: z.string().min(1).optional(),
	image: VeoImageSchema.describe('First frame.'),
	lastFrame: VeoImageSchema.describe(
		'Last frame. Sent with image, as in the first-and-last-frame REST sample.',
	),
});
export type FramesCreateInput = z.infer<typeof FramesCreateInputSchema>;

const ReferencesCreateInputSchema = z.object({
	...generationFields,
	durationSeconds: z
		.literal(8)
		.optional()
		.describe(
			'Reference-image videos are documented at 8 seconds. Other lengths are rejected here.',
		),
	model: z.enum(VEO_REFERENCE_MODELS),
	prompt: z.string().min(1),
	referenceImages: z
		.array(VeoReferenceImageSchema)
		.min(1)
		.max(3)
		.describe('Up to three asset reference images.'),
});
export type ReferencesCreateInput = z.infer<typeof ReferencesCreateInputSchema>;

const ExtendCreateInputSchema = z.object({
	...generationFields,
	model: z.enum(VEO_MODELS),
	prompt: z.string().min(1),
	video: VeoVideoInputSchema,
});
export type ExtendCreateInput = z.infer<typeof ExtendCreateInputSchema>;

const GeneratedVideoSchema = z
	.object({
		gcsUri: z.string().optional(),
		mimeType: z.string().optional(),
		bytesBase64Encoded: z
			.string()
			.optional()
			.describe(
				'Inline video bytes. The guide returns bytes in the response when storageUri is omitted; this is the same field name the predict API uses for inline media.',
			),
	})
	.catchall(z.unknown());

const OperationResponseSchema = z
	.object({
		'@type': z.string().optional(),
		raiMediaFilteredCount: z.number().optional(),
		videos: z.array(GeneratedVideoSchema).optional(),
	})
	.catchall(z.unknown());

export const VeoOperationSchema = z
	.object({
		name: z.string(),
		done: z.boolean().optional(),
		metadata: z.unknown().optional(),
		error: z
			.object({
				code: z.number().optional(),
				message: z.string().optional(),
				status: z.string().optional(),
			})
			.optional(),
		response: OperationResponseSchema.optional(),
	})
	.catchall(z.unknown());
export type VeoOperation = z.infer<typeof VeoOperationSchema>;

const OperationGetInputSchema = z.object({
	operationName: z
		.string()
		.min(1)
		.describe(
			'Full operation name returned by predictLongRunning, projects/.../operations/...',
		),
	model: z.enum(VEO_MODELS).optional(),
	projectId,
	location,
});
export type OperationGetInput = z.infer<typeof OperationGetInputSchema>;

const OperationWaitInputSchema = OperationGetInputSchema.extend({
	pollIntervalMs: z
		.number()
		.int()
		.min(0)
		.optional()
		.describe('Delay between fetchPredictOperation calls. Defaults to 15000.'),
	timeoutMs: z
		.number()
		.int()
		.min(0)
		.optional()
		.describe(
			'Stop polling and return the last operation after this many milliseconds. Defaults to 360000.',
		),
});
export type OperationWaitInput = z.infer<typeof OperationWaitInputSchema>;

export type VeoEndpointInputs = {
	textToVideoCreate: TextToVideoCreateInput;
	imageToVideoCreate: ImageToVideoCreateInput;
	framesCreate: FramesCreateInput;
	referencesCreate: ReferencesCreateInput;
	extendCreate: ExtendCreateInput;
	operationsGet: OperationGetInput;
	operationsWait: OperationWaitInput;
};

export type VeoEndpointOutputs = {
	textToVideoCreate: VeoOperation;
	imageToVideoCreate: VeoOperation;
	framesCreate: VeoOperation;
	referencesCreate: VeoOperation;
	extendCreate: VeoOperation;
	operationsGet: VeoOperation;
	operationsWait: VeoOperation;
};

export const VeoEndpointInputSchemas = {
	textToVideoCreate: TextToVideoCreateInputSchema,
	imageToVideoCreate: ImageToVideoCreateInputSchema,
	framesCreate: FramesCreateInputSchema,
	referencesCreate: ReferencesCreateInputSchema,
	extendCreate: ExtendCreateInputSchema,
	operationsGet: OperationGetInputSchema,
	operationsWait: OperationWaitInputSchema,
} as const;

export const VeoEndpointOutputSchemas = {
	textToVideoCreate: VeoOperationSchema,
	imageToVideoCreate: VeoOperationSchema,
	framesCreate: VeoOperationSchema,
	referencesCreate: VeoOperationSchema,
	extendCreate: VeoOperationSchema,
	operationsGet: VeoOperationSchema,
	operationsWait: VeoOperationSchema,
} as const;
