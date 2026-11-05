import { z } from 'zod';

// Shapes follow the Alibaba Cloud Model Studio API references:
// https://www.alibabacloud.com/help/en/model-studio/qwen-image-generation-and-editing-api-reference
// https://www.alibabacloud.com/help/en/model-studio/wan-image-generation-and-editing-api-reference
// https://www.alibabacloud.com/help/en/model-studio/text-to-video-api-reference
// https://www.alibabacloud.com/help/en/model-studio/wan3-video-generation-api-reference
// https://www.alibabacloud.com/help/en/model-studio/image-to-video-general-api-reference
// https://www.alibabacloud.com/help/en/model-studio/wan-video-to-video-api-reference
// https://www.alibabacloud.com/help/en/model-studio/wan-video-editing-api-reference

// A public http(s) URL, or a data: URI where the reference accepts Base64.
const MediaUrl = z
	.string()
	.regex(/^(https?:\/\/|data:)\S+$/, 'Expected an http(s) URL or a data: URI');

const Seed = z.number().int().min(0).max(2147483647);
const NegativePrompt = z.string().min(1).max(500);
const VideoPrompt = z.string().min(1).max(5000);
const VideoResolution = z.enum(['720P', '1080P']);
const WanRatio = z.enum(['16:9', '9:16', '1:1', '4:3', '3:4']);

const VideoParameters = {
	prompt_extend: z.boolean().optional(),
	watermark: z.boolean().optional(),
	seed: Seed.optional(),
};

const countOf = (media: { type: string }[], type: string) =>
	media.filter((item) => item.type === type).length;

// Image generation (synchronous)

export const IMAGE_MODELS = [
	'qwen-image-3.0-pro',
	'qwen-image-3.0',
	'wan2.7-image-pro',
	'wan2.7-image',
] as const;

const ImageGenerateInputSchema = z
	.object({
		model: z.enum(IMAGE_MODELS),
		prompt: z.string().min(1).max(5000),
		images: z.array(MediaUrl).max(9).optional(),
		parameters: z
			.object({
				// "1024*1024" for both families; Wan 2.7 also accepts "1K", "2K", "4K".
				size: z
					.string()
					.regex(/^(\d+\*\d+|[124]K)$/, 'Expected "width*height" or 1K, 2K, 4K')
					.optional(),
				n: z.number().int().min(1).max(12).optional(),
				seed: Seed.optional(),
				watermark: z.boolean().optional(),
				negative_prompt: z.string().min(1).optional(),
				prompt_extend: z.boolean().optional(),
				prompt_extend_mode: z.enum(['direct', 'agent']).optional(),
				enable_thinking: z.boolean().optional(),
				thinking_mode: z.boolean().optional(),
				enable_sequential: z.boolean().optional(),
				bbox_list: z
					.array(
						z
							.array(z.tuple([z.number(), z.number(), z.number(), z.number()]))
							.max(2),
					)
					.optional(),
				color_palette: z
					.array(
						z.object({
							hex: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
							ratio: z.string().regex(/^\d{1,3}\.\d{2}%$/),
						}),
					)
					.min(3)
					.max(10)
					.optional(),
			})
			.optional(),
	})
	.refine(
		(input) =>
			!input.model.startsWith('qwen') || (input.images?.length ?? 0) <= 3,
		{ message: 'qwen-image-3.0 takes at most 3 input images' },
	)
	.refine(
		(input) =>
			input.parameters?.n === undefined ||
			input.parameters.enable_sequential ||
			input.parameters.n <= (input.model.startsWith('qwen') ? 6 : 4),
		{
			message:
				'n is 1-6 for qwen-image-3.0 and 1-4 for wan2.7-image (up to 12 in image set mode)',
		},
	)
	.refine(
		(input) =>
			input.parameters?.prompt_extend_mode !== 'agent' || !input.images?.length,
		{ message: 'prompt_extend_mode "agent" is text-to-image only' },
	);

const ImageGenerateResponseSchema = z.object({
	output: z.object({
		rewrite_status: z.string().nullish(),
		choices: z.array(
			z.object({
				finish_reason: z.string().nullish(),
				message: z.object({
					role: z.string(),
					content: z.array(z.object({ image: z.string() })),
				}),
			}),
		),
	}),
	usage: z
		.object({
			output_width: z.number().nullish(),
			output_height: z.number().nullish(),
			input_image_count: z.number().nullish(),
			output_image_count: z.number().nullish(),
			input_image_type: z.string().nullish(),
			output_image_type: z.string().nullish(),
			width: z.number().nullish(),
			height: z.number().nullish(),
			image_count: z.number().nullish(),
		})
		.nullish(),
	request_id: z.string(),
});

// Video generation (asynchronous)

const TextToVideoInputSchema = z
	.object({
		model: z.enum(['wan2.7-t2v', 'wan3.0-video', 'wan3.0-video-prime']),
		prompt: z.string().min(1).max(20000).optional(),
		negative_prompt: NegativePrompt.optional(),
		audio_url: MediaUrl.optional(),
		// Wan 3.0 only: reference media in the order the prompt names them.
		media: z
			.array(
				z.object({
					type: z.enum([
						'first_frame',
						'last_frame',
						'reference_image',
						'reference_video',
						'reference_audio',
						'file',
						'link',
					]),
					url: MediaUrl,
				}),
			)
			.min(1)
			.optional(),
		parameters: z
			.object({
				resolution: z.enum(['480P', '720P', '1080P']).optional(),
				ratio: z.union([WanRatio, z.enum(['21:9', 'adaptive'])]).optional(),
				duration: z
					.union([z.literal(-1), z.number().int().min(2).max(30)])
					.optional(),
				audio: z.boolean().optional(),
				...VideoParameters,
			})
			.optional(),
	})
	.refine((input) => input.prompt !== undefined || input.media !== undefined, {
		message: 'Provide prompt or media',
	})
	.refine(
		(input) =>
			input.model !== 'wan2.7-t2v' ||
			(input.prompt !== undefined &&
				input.prompt.length <= 5000 &&
				input.media === undefined &&
				(input.parameters?.resolution ?? '720P') !== '480P' &&
				input.parameters?.audio === undefined &&
				(input.parameters?.duration === undefined ||
					(input.parameters.duration >= 2 &&
						input.parameters.duration <= 15)) &&
				!['21:9', 'adaptive'].includes(input.parameters?.ratio ?? '16:9')),
		{
			message:
				'wan2.7-t2v needs a prompt (up to 5000 characters), no media, 720P or 1080P, a 2-15s duration, and a 16:9, 9:16, 1:1, 4:3, or 3:4 ratio',
		},
	)
	.refine(
		(input) => input.model === 'wan2.7-t2v' || input.audio_url === undefined,
		{ message: 'Wan 3.0 takes audio as a reference_audio media item' },
	)
	.refine(
		(input) =>
			!input.media ||
			(countOf(input.media, 'first_frame') <= 1 &&
				countOf(input.media, 'last_frame') <= 1 &&
				countOf(input.media, 'reference_image') <= 10 &&
				countOf(input.media, 'reference_video') <= 5 &&
				countOf(input.media, 'reference_audio') <= 5 &&
				countOf(input.media, 'file') + countOf(input.media, 'link') <= 1),
		{
			message:
				'At most 1 first_frame, 1 last_frame, 10 reference images, 5 reference videos, 5 reference audio clips, and one file or link',
		},
	);

const ImageToVideoInputSchema = z
	.object({
		model: z.literal('wan2.7-i2v'),
		prompt: VideoPrompt.optional(),
		negative_prompt: NegativePrompt.optional(),
		media: z
			.array(
				z.object({
					type: z.enum([
						'first_frame',
						'last_frame',
						'driving_audio',
						'first_clip',
					]),
					url: MediaUrl,
				}),
			)
			.min(1),
		parameters: z
			.object({
				resolution: VideoResolution.optional(),
				duration: z.number().int().min(2).max(15).optional(),
				...VideoParameters,
			})
			.optional(),
	})
	.refine(
		(input) => {
			const types = input.media
				.map((item) => item.type)
				.sort()
				.join('+');
			return [
				'first_frame',
				'driving_audio+first_frame',
				'first_frame+last_frame',
				'driving_audio+first_frame+last_frame',
				'first_clip',
				'first_clip+last_frame',
			].includes(types);
		},
		{
			message:
				'media must be first_frame, first_frame+driving_audio, first_frame+last_frame(+driving_audio), first_clip, or first_clip+last_frame',
		},
	);

const ReferenceToVideoInputSchema = z
	.object({
		model: z.literal('wan2.7-r2v'),
		prompt: VideoPrompt,
		negative_prompt: NegativePrompt.optional(),
		media: z
			.array(
				z.object({
					type: z.enum(['reference_image', 'reference_video', 'first_frame']),
					url: MediaUrl,
					reference_voice: MediaUrl.optional(),
				}),
			)
			.min(1),
		parameters: z
			.object({
				resolution: VideoResolution.optional(),
				ratio: WanRatio.optional(),
				duration: z.number().int().min(2).max(15).optional(),
				...VideoParameters,
			})
			.optional(),
	})
	.refine((input) => countOf(input.media, 'first_frame') <= 1, {
		message: 'At most one first_frame',
	})
	.refine(
		(input) => {
			const references =
				countOf(input.media, 'reference_image') +
				countOf(input.media, 'reference_video');
			return references >= 1 && references <= 5;
		},
		{ message: 'Use 1-5 reference images and videos in total' },
	)
	.refine(
		(input) =>
			countOf(input.media, 'reference_video') === 0 ||
			(input.parameters?.duration ?? 5) <= 10,
		{ message: 'duration is 2-10 when a reference video is included' },
	);

const VideoEditInputSchema = z
	.object({
		model: z.literal('wan2.7-videoedit'),
		prompt: VideoPrompt.optional(),
		negative_prompt: NegativePrompt.optional(),
		media: z
			.array(
				z.object({
					type: z.enum(['video', 'reference_image']),
					// Also accepts Asset Center ids (ark_asset_vid_..., ark_asset_img_...).
					url: z.union([
						MediaUrl,
						z.string().regex(/^ark_asset_(vid|img)_\w+$/),
					]),
				}),
			)
			.min(1),
		parameters: z
			.object({
				resolution: VideoResolution.optional(),
				ratio: WanRatio.optional(),
				// 0 keeps the input video's length; 2-10 truncates it.
				duration: z
					.union([z.literal(0), z.number().int().min(2).max(10)])
					.optional(),
				audio_setting: z.enum(['auto', 'origin']).optional(),
				prompt_extend: z.boolean().optional(),
				watermark: z.boolean().optional(),
			})
			.optional(),
	})
	.refine((input) => countOf(input.media, 'video') === 1, {
		message: 'Exactly one video to edit',
	})
	.refine((input) => countOf(input.media, 'reference_image') <= 4, {
		message: 'At most four reference images',
	});

const TaskStatus = z.enum([
	'PENDING',
	'RUNNING',
	'SUCCEEDED',
	'FAILED',
	'CANCELED',
	'UNKNOWN',
]);

const VideoTaskCreatedSchema = z.object({
	output: z.object({ task_id: z.string(), task_status: TaskStatus }),
	request_id: z.string(),
});

const TaskGetInputSchema = z.object({ task_id: z.string().min(1) });

export const TaskSchema = z.object({
	output: z.object({
		task_id: z.string(),
		task_status: TaskStatus,
		submit_time: z.string().nullish(),
		scheduled_time: z.string().nullish(),
		end_time: z.string().nullish(),
		video_url: z.string().nullish(),
		orig_prompt: z.string().nullish(),
		code: z.string().nullish(),
		message: z.string().nullish(),
	}),
	usage: z
		.object({
			duration: z.number().nullish(),
			input_video_duration: z.number().nullish(),
			output_video_duration: z.number().nullish(),
			SR: z.number().nullish(),
			ratio: z.string().nullish(),
			video_count: z.number().nullish(),
		})
		.nullish(),
	request_id: z.string(),
});

export type Task = z.infer<typeof TaskSchema>;

export type ImageGenerateInput = z.infer<typeof ImageGenerateInputSchema>;
export type ImageGenerateResponse = z.infer<typeof ImageGenerateResponseSchema>;
export type TextToVideoInput = z.infer<typeof TextToVideoInputSchema>;
export type ImageToVideoInput = z.infer<typeof ImageToVideoInputSchema>;
export type ReferenceToVideoInput = z.infer<typeof ReferenceToVideoInputSchema>;
export type VideoEditInput = z.infer<typeof VideoEditInputSchema>;
export type VideoTaskCreated = z.infer<typeof VideoTaskCreatedSchema>;
export type TaskGetInput = z.infer<typeof TaskGetInputSchema>;

export type AlibabaEndpointInputs = {
	imageGenerate: ImageGenerateInput;
	videoTextToVideo: TextToVideoInput;
	videoImageToVideo: ImageToVideoInput;
	videoReferenceToVideo: ReferenceToVideoInput;
	videoEdit: VideoEditInput;
	tasksGet: TaskGetInput;
};

export type AlibabaEndpointOutputs = {
	imageGenerate: ImageGenerateResponse;
	videoTextToVideo: VideoTaskCreated;
	videoImageToVideo: VideoTaskCreated;
	videoReferenceToVideo: VideoTaskCreated;
	videoEdit: VideoTaskCreated;
	tasksGet: Task;
};

export const AlibabaEndpointInputSchemas = {
	imageGenerate: ImageGenerateInputSchema,
	videoTextToVideo: TextToVideoInputSchema,
	videoImageToVideo: ImageToVideoInputSchema,
	videoReferenceToVideo: ReferenceToVideoInputSchema,
	videoEdit: VideoEditInputSchema,
	tasksGet: TaskGetInputSchema,
} as const;

export const AlibabaEndpointOutputSchemas = {
	imageGenerate: ImageGenerateResponseSchema,
	videoTextToVideo: VideoTaskCreatedSchema,
	videoImageToVideo: VideoTaskCreatedSchema,
	videoReferenceToVideo: VideoTaskCreatedSchema,
	videoEdit: VideoTaskCreatedSchema,
	tasksGet: TaskSchema,
} as const;
