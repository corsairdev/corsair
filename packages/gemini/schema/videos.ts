import { z } from 'zod';

export const GEMINI_VIDEO_MODELS = ['veo-2.0-generate-001'] as const;

export const VideoInstanceSchema = z.object({
	prompt: z.string(),
	image: z
		.object({
			bytesBase64Encoded: z.string(),
			mimeType: z.string(),
		})
		.optional(),
});
export type VideoInstance = z.infer<typeof VideoInstanceSchema>;

export const VideoParametersSchema = z
	.object({
		aspectRatio: z.string().optional(),
		personGeneration: z.string().optional(),
		numberOfVideos: z.number().optional(),
		durationSeconds: z.number().optional(),
		negativePrompt: z.string().optional(),
	})
	// Forward-compat: Veo adds new generation parameters independently of this plugin.
	.catchall(z.unknown());
export type VideoParameters = z.infer<typeof VideoParametersSchema>;

export const GeneratedVideoSampleSchema = z
	.object({
		video: z
			.object({
				uri: z.string().optional(),
			})
			.optional(),
	})
	// Forward-compat: Veo sample objects gain extra fields (e.g. raiMediaFilteredReasons)
	// that vary by model version and are not worth fully modeling here.
	.catchall(z.unknown());

export const VideoOperationResponseSchema = z
	.object({
		generateVideoResponse: z
			.object({
				generatedSamples: z.array(GeneratedVideoSampleSchema).optional(),
			})
			.optional(),
	})
	// The operation's `response` payload shape is generic (google.protobuf.Any)
	// and varies across Veo model versions.
	.catchall(z.unknown());
export type VideoOperationResponse = z.infer<
	typeof VideoOperationResponseSchema
>;

export const VideoOperationSchema = z.object({
	name: z.string(),
	done: z.boolean().optional(),
	// Operation-specific metadata (e.g. progress percentage); Google does not
	// document a stable shape for this field.
	metadata: z.unknown().optional(),
	error: z
		.object({
			code: z.number().optional(),
			message: z.string().optional(),
		})
		.optional(),
	response: VideoOperationResponseSchema.optional(),
});
export type VideoOperation = z.infer<typeof VideoOperationSchema>;

export const VideoFileSchema = z.object({
	mimeType: z.string(),
	contentBase64: z.string().describe('Base64-encoded video bytes'),
});
export type VideoFile = z.infer<typeof VideoFileSchema>;
