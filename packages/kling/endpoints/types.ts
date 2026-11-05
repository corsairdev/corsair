import { z } from 'zod';

// Endpoint shapes mirror the Kling AI open-platform API documented at
// https://kling.ai/document-api/llms.txt (machine-readable index). Pages used:
// - Auth/base URL: .../api/get-started/authentication
// - Errors:        .../api/get-started/error-codes
// - Concurrency:   .../api/get-started/concurrency-rules
// - Callbacks:     .../api/get-started/callbacks
// - Video:         .../api/video/{2-5-turbo,2-6,3-0-omni,3-0-turbo}/*,
//                  .../api/video/lip-sync, .../api/video/lip-sync/face-detection
// - Image:         .../api/image/2-1/image-generation,
//                  .../api/image/2-1/multi-image-to-image,
//                  .../api/image/o1/image-generation (omni),
//                  .../api/image/common/outpainting
// - Effects:       .../api/effects/video-effects
// - Solutions:     .../api/ecommerce-replication/virtual-try-on
//
// Two documented response styles coexist:
//  1. Versioned "path" API (no /v1 prefix). Job creation lives under a
//     model-specific path such as /text-to-video/kling-2.6, and every such job
//     is queried through the one platform-wide `/tasks` endpoint (GET by id,
//     POST cursor list).
//  2. Legacy /v1 API. Each product exposes its own create path plus its own
//     query endpoints (GET by id, GET page-number list).
// Both wrap their payload in { code, message, request_id, data }. The request
// client only parses 2xx bodies, so the envelope schemas below describe the
// success shape.

// ── Envelope helper ─────────────────────────────────────────────────────────

// Every documented response wraps its payload in this envelope. `code` is 0 on
// success and is the one field guaranteed across all pages; the rest is kept
// optional so a documented-shape tweak cannot break parsing.
function envelope<T extends z.ZodType>(data: T) {
	return z
		.object({
			code: z.number(),
			message: z.string().optional(),
			request_id: z.string().optional(),
			data,
		})
		.passthrough();
}

// ── Shared leaf schemas ─────────────────────────────────────────────────────

export const KlingWatermarkInfoSchema = z
	.object({
		enabled: z.boolean(),
	})
	.passthrough();

export type KlingWatermarkInfo = z.infer<typeof KlingWatermarkInfoSchema>;

// Common output entry. `outputs[]` entries are tagged by `type` (image, video,
// audio, element, voice) and the returned fields vary with it, so only the
// documented fields are modelled and the rest pass through.
export const KlingTaskOutputSchema = z
	.object({
		type: z.string(),
		id: z.string().optional(),
		url: z.string().optional(),
		watermark_url: z.string().optional(),
		duration: z.string().optional(),
		group_id: z.string().optional(),
		mp3_url: z.string().optional(),
		wav_url: z.string().optional(),
		mp3_duration: z.string().optional(),
		wav_duration: z.string().optional(),
		name: z.string().optional(),
		owned_by: z.string().optional(),
		status: z.string().optional(),
	})
	.passthrough();

export type KlingTaskOutput = z.infer<typeof KlingTaskOutputSchema>;

export const KlingBillingSchema = z
	.object({
		charge_type: z.string().optional(),
		cash_type: z.string().optional(),
		amount: z.string().optional(),
		currency: z.string().optional(),
		package_type: z.string().optional(),
		list_price: z.string().optional(),
	})
	.passthrough();

export type KlingBilling = z.infer<typeof KlingBillingSchema>;

export const KlingBalanceDeductionSchema = z
	.object({
		quota: z.string().optional(),
		list_price: z.string().optional(),
	})
	.passthrough();

export const KlingImageOutputSchema = z
	.object({
		index: z.number().optional(),
		url: z.string().optional(),
		watermark_url: z.string().optional(),
	})
	.passthrough();

export const KlingVideoOutputSchema = z
	.object({
		id: z.string().optional(),
		url: z.string().optional(),
		watermark_url: z.string().optional(),
		duration: z.string().optional(),
	})
	.passthrough();

export const KlingTaskInfoSchema = z
	.object({
		external_task_id: z.string().optional(),
	})
	.passthrough();

export const KlingTaskResultSchema = z
	.object({
		images: z.array(KlingImageOutputSchema).optional(),
		videos: z.array(KlingVideoOutputSchema).optional(),
	})
	.passthrough();

// ── Task response shapes ────────────────────────────────────────────────────
//
// The docs spell the two envelopes' fields differently (`id`/`status` versus
// `task_id`/`task_status`) and never publish a closed union, so both spellings
// are accepted on one permissive schema. Nothing is required beyond the
// envelope `code`, which keeps parsing robust across model versions.

export const KlingTaskSchema = z
	.object({
		id: z.string().optional(),
		task_id: z.string().optional(),
		status: z.string().optional(),
		task_status: z.string().optional(),
		message: z.string().optional(),
		task_status_msg: z.string().optional(),
		create_time: z.number().optional(),
		update_time: z.number().optional(),
		created_at: z.number().optional(),
		updated_at: z.number().optional(),
		external_id: z.string().optional(),
		outputs: z.array(KlingTaskOutputSchema).optional(),
		billing: z.array(KlingBillingSchema).optional(),
		final_unit_deduction: z.string().optional(),
		final_balance_deduction: KlingBalanceDeductionSchema.optional(),
		watermark_info: KlingWatermarkInfoSchema.optional(),
		task_info: KlingTaskInfoSchema.optional(),
		task_result: KlingTaskResultSchema.optional(),
	})
	.passthrough();

export type KlingTask = z.infer<typeof KlingTaskSchema>;

// Create responses (both API styles) report the new task id plus a status.
export const KlingCreateTaskDataSchema = z
	.object({
		id: z.string().optional(),
		task_id: z.string().optional(),
		status: z.string().optional(),
		task_status: z.string().optional(),
		create_time: z.number().optional(),
		update_time: z.number().optional(),
		created_at: z.number().optional(),
		updated_at: z.number().optional(),
		external_id: z.string().optional(),
		task_info: KlingTaskInfoSchema.optional(),
	})
	.passthrough();

export type KlingCreateTaskData = z.infer<typeof KlingCreateTaskDataSchema>;

// Cursor-list responses share one `{ result, count, next_cursor, has_more }`
// data object on both `/tasks` and `/solutions`.
export const KlingCursorTaskListDataSchema = z
	.object({
		result: z.array(KlingTaskSchema),
		count: z.number().optional(),
		next_cursor: z.string().optional(),
		has_more: z.boolean().optional(),
	})
	.passthrough();

export type KlingCursorTaskListData = z.infer<
	typeof KlingCursorTaskListDataSchema
>;

export const KlingFaceDataSchema = z
	.object({
		face_id: z.string().optional(),
		face_image: z.string().optional(),
		start_time: z.number().optional(),
		end_time: z.number().optional(),
	})
	.passthrough();

// Face Recognition (identify-face) resolves a session and a face list which the
// lip-sync create call then references by face_id.
export const KlingFaceDetectDataSchema = z
	.object({
		session_id: z.string(),
		final_unit_deduction: z.string().optional(),
		final_balance_deduction: KlingBalanceDeductionSchema.optional(),
		face_data: z.array(KlingFaceDataSchema).optional(),
	})
	.passthrough();

export type KlingFaceDetectData = z.infer<typeof KlingFaceDetectDataSchema>;

export const KlingCreateTaskResponseSchema = envelope(
	KlingCreateTaskDataSchema,
);
export type KlingCreateTaskOutput = z.infer<
	typeof KlingCreateTaskResponseSchema
>;

export const KlingTaskDetailResponseSchema = envelope(KlingTaskSchema);
export type KlingTaskDetailOutput = z.infer<
	typeof KlingTaskDetailResponseSchema
>;

export const KlingTaskListResponseSchema = envelope(z.array(KlingTaskSchema));
export type KlingTaskListOutput = z.infer<typeof KlingTaskListResponseSchema>;

export const KlingCursorTaskListResponseSchema = envelope(
	KlingCursorTaskListDataSchema,
);
export type KlingCursorTaskListOutput = z.infer<
	typeof KlingCursorTaskListResponseSchema
>;

export const KlingFaceDetectResponseSchema = envelope(
	KlingFaceDetectDataSchema,
);
export type KlingFaceDetectOutput = z.infer<
	typeof KlingFaceDetectResponseSchema
>;

// ── Shared request building blocks ──────────────────────────────────────────

// The versioned API addresses a model through a path segment, so the model is
// an enum on the create operation rather than baked into the endpoint tree.
export const KlingVideoModelSchema = z.enum([
	'kling-2.5-turbo',
	'kling-2.6',
	'kling-3.0',
	'kling-3.0-turbo',
]);

export type KlingVideoModel = z.infer<typeof KlingVideoModelSchema>;

export const KlingOmniVideoModelSchema = z.enum(['kling-3.0-omni', 'kling-o1']);

export type KlingOmniVideoModel = z.infer<typeof KlingOmniVideoModelSchema>;

export const KlingMotionControlModelSchema = z.enum(['kling-2.6', 'kling-3.0']);

export type KlingMotionControlModel = z.infer<
	typeof KlingMotionControlModelSchema
>;

export const KlingImageAspectRatioSchema = z.enum([
	'16:9',
	'9:16',
	'1:1',
	'4:3',
	'3:4',
	'3:2',
	'2:3',
	'21:9',
]);

// `contents[]` is a tagged collection (prompt, first/last frame, voice,
// element, reference video). The documented `type` set differs per model
// version, so one permissive item schema with all optional known fields is
// used instead of a strict discriminated union that would reject a valid
// newer model's input.
export const KlingContentItemSchema = z
	.object({
		type: z.string().min(1),
		text: z.string().optional(),
		url: z.string().optional(),
		id: z.string().optional(),
		voice_id: z.string().optional(),
		element_id: z.string().optional(),
	})
	.passthrough();

export type KlingContentItem = z.infer<typeof KlingContentItemSchema>;

// Union of the documented per-model video settings; every field is optional and
// the provider ignores settings a given model does not support.
export const KlingVideoSettingsSchema = z
	.object({
		resolution: z.string().optional(),
		aspect_ratio: z.string().optional(),
		duration: z.number().int().optional(),
		audio: z.string().optional(),
		multi_shot: z.boolean().optional(),
	})
	.passthrough();

export type KlingVideoSettings = z.infer<typeof KlingVideoSettingsSchema>;

// Motion control additionally requires the character orientation.
export const KlingMotionControlSettingsSchema = z
	.object({
		character_orientation: z.enum(['image', 'video']),
		resolution: z.string().optional(),
		aspect_ratio: z.string().optional(),
		duration: z.number().int().optional(),
		audio: z.string().optional(),
		multi_shot: z.boolean().optional(),
	})
	.passthrough();

export type KlingMotionControlSettings = z.infer<
	typeof KlingMotionControlSettingsSchema
>;

// Shared `options` object for the versioned API (callback + watermark).
export const KlingNewApiOptionsSchema = z
	.object({
		callback_url: z.string().optional(),
		external_task_id: z.string().optional(),
		watermark_info: KlingWatermarkInfoSchema.optional(),
	})
	.passthrough();

export type KlingNewApiOptions = z.infer<typeof KlingNewApiOptionsSchema>;

// ── Shared query inputs ─────────────────────────────────────────────────────

// Every get operation takes one platform task id. It maps to the `task_ids`
// query parameter for the versioned/solutions endpoints and to the `{id}` path
// segment for the legacy /v1 endpoints.
export const KlingTaskGetInputSchema = z.object({
	task_id: z.string().min(1, 'task_id cannot be empty'),
});

export type KlingTaskGetInput = z.infer<typeof KlingTaskGetInputSchema>;

export const KlingTaskFilterSchema = z.object({
	key: z.enum(['status', 'product_type']),
	values: z.array(z.string().min(1)).min(1),
});

// Cursor list for `/tasks` (versioned video jobs). Timestamps are documented as
// Unix milliseconds; the docs are inconsistent about string vs number, so both
// are accepted.
export const KlingTaskListInputSchema = z.object({
	start_time: z.union([z.string(), z.number()]).optional(),
	end_time: z.union([z.string(), z.number()]).optional(),
	cursor: z.string().optional(),
	limit: z.number().int().min(1).max(500).optional(),
	filters: z.array(KlingTaskFilterSchema).optional(),
});

export type KlingTaskListInput = z.infer<typeof KlingTaskListInputSchema>;

// Cursor list for `/solutions`; only `status` filtering is documented there.
export const KlingSolutionListInputSchema = z.object({
	start_time: z.union([z.string(), z.number()]).optional(),
	end_time: z.union([z.string(), z.number()]).optional(),
	cursor: z.string().optional(),
	limit: z.number().int().min(1).max(500).optional(),
	filters: z
		.array(
			z.object({
				key: z.literal('status'),
				values: z.array(z.string().min(1)).min(1),
			}),
		)
		.optional(),
});

export type KlingSolutionListInput = z.infer<
	typeof KlingSolutionListInputSchema
>;

// Page-number list shared by the legacy /v1 endpoints.
export const KlingTaskPageListInputSchema = z.object({
	pageNum: z.number().int().min(1).max(1000).optional(),
	pageSize: z.number().int().min(1).max(500).optional(),
});

export type KlingTaskPageListInput = z.infer<
	typeof KlingTaskPageListInputSchema
>;

// ── Text to video (POST /text-to-video/{model}) ─────────────────────────────

export const TextToVideoCreateInputSchema = z.object({
	model: KlingVideoModelSchema,
	prompt: z.string().min(1).max(2500),
	settings: KlingVideoSettingsSchema.optional(),
	options: KlingNewApiOptionsSchema.optional(),
});

export type TextToVideoCreateInput = z.infer<
	typeof TextToVideoCreateInputSchema
>;

// ── Image to video (POST /image-to-video/{model}) ───────────────────────────

export const ImageToVideoCreateInputSchema = z.object({
	model: KlingVideoModelSchema,
	contents: z.array(KlingContentItemSchema).min(1),
	settings: KlingVideoSettingsSchema.optional(),
	options: KlingNewApiOptionsSchema.optional(),
});

export type ImageToVideoCreateInput = z.infer<
	typeof ImageToVideoCreateInputSchema
>;

// ── Omni video (POST /omni-video/{model}) ───────────────────────────────────

export const OmniVideoCreateInputSchema = z.object({
	model: KlingOmniVideoModelSchema,
	contents: z.array(KlingContentItemSchema).min(1),
	settings: KlingVideoSettingsSchema.optional(),
	options: KlingNewApiOptionsSchema.optional(),
});

export type OmniVideoCreateInput = z.infer<typeof OmniVideoCreateInputSchema>;

// ── Motion control (POST /motion-control/{model}) ───────────────────────────

export const MotionControlCreateInputSchema = z.object({
	model: KlingMotionControlModelSchema,
	contents: z.array(KlingContentItemSchema).min(1),
	settings: KlingMotionControlSettingsSchema,
	options: KlingNewApiOptionsSchema.optional(),
});

export type MotionControlCreateInput = z.infer<
	typeof MotionControlCreateInputSchema
>;

// ── Image generation (POST /v1/images/generations) ──────────────────────────
//
// One legacy endpoint covers both text-to-image (omit `image`) and
// image-to-image (supply `image`), so it is modelled as a single operation.
export const ImageGenerationCreateInputSchema = z.object({
	model_name: z.enum(['kling-v2-1', 'kling-v3']).optional(),
	prompt: z.string().min(1).max(2500),
	negative_prompt: z.string().max(2500).optional(),
	image: z.string().min(1).optional(),
	image_reference: z.enum(['subject', 'face']).optional(),
	image_fidelity: z.number().min(0).max(1).optional(),
	human_fidelity: z.number().min(0).max(1).optional(),
	element_list: z.array(z.object({ element_id: z.number().int() })).optional(),
	resolution: z.enum(['1k', '2k']).optional(),
	n: z.number().int().min(1).max(9).optional(),
	aspect_ratio: KlingImageAspectRatioSchema.optional(),
	watermark_info: KlingWatermarkInfoSchema.optional(),
	callback_url: z.string().optional(),
	external_task_id: z.string().optional(),
});

export type ImageGenerationCreateInput = z.infer<
	typeof ImageGenerationCreateInputSchema
>;

// ── Multi-image to image (POST /v1/images/multi-image2image) ────────────────

export const MultiImageToImageCreateInputSchema = z.object({
	model_name: z.enum(['kling-v2-1']).optional(),
	prompt: z.string().max(2500).optional(),
	subject_image_list: z
		.array(z.object({ subject_image: z.string().min(1) }))
		.min(1)
		.max(4),
	scene_image: z.string().min(1).optional(),
	style_image: z.string().min(1).optional(),
	n: z.number().int().min(1).max(9).optional(),
	aspect_ratio: KlingImageAspectRatioSchema.optional(),
	watermark_info: KlingWatermarkInfoSchema.optional(),
	callback_url: z.string().optional(),
	external_task_id: z.string().optional(),
});

export type MultiImageToImageCreateInput = z.infer<
	typeof MultiImageToImageCreateInputSchema
>;

// ── Omni image (POST /v1/images/omni-image) ─────────────────────────────────

export const OmniImageCreateInputSchema = z.object({
	model_name: z.enum(['kling-image-o1', 'kling-v3-omni']).optional(),
	prompt: z.string().min(1).max(2500),
	image_list: z.array(z.object({ image: z.string().min(1) })).optional(),
	element_list: z.array(z.object({ element_id: z.number().int() })).optional(),
	resolution: z.enum(['1k', '2k', '4k']).optional(),
	result_type: z.enum(['single', 'series']).optional(),
	n: z.number().int().min(1).max(9).optional(),
	series_amount: z
		.union([z.number().int().min(2).max(9), z.literal('auto')])
		.optional(),
	aspect_ratio: z
		.enum(['16:9', '9:16', '1:1', '4:3', '3:4', '3:2', '2:3', '21:9', 'auto'])
		.optional(),
	watermark_info: KlingWatermarkInfoSchema.optional(),
	callback_url: z.string().optional(),
	external_task_id: z.string().optional(),
});

export type OmniImageCreateInput = z.infer<typeof OmniImageCreateInputSchema>;

// ── Outpainting (POST /v1/images/editing/expand) ────────────────────────────

export const OutpaintingCreateInputSchema = z.object({
	image: z.string().min(1),
	up_expansion_ratio: z.number().min(0).max(2),
	down_expansion_ratio: z.number().min(0).max(2),
	left_expansion_ratio: z.number().min(0).max(2),
	right_expansion_ratio: z.number().min(0).max(2),
	prompt: z.string().max(2500).optional(),
	n: z.number().int().min(1).max(9).optional(),
	watermark_info: KlingWatermarkInfoSchema.optional(),
	callback_url: z.string().optional(),
	external_task_id: z.string().optional(),
});

export type OutpaintingCreateInput = z.infer<
	typeof OutpaintingCreateInputSchema
>;

// ── Lip sync (POST /v1/videos/identify-face, /v1/videos/advanced-lip-sync) ──

export const LipSyncDetectFaceInputSchema = z
	.object({
		video_id: z.string().min(1).optional(),
		video_url: z.string().min(1).optional(),
	})
	.refine(
		(value) =>
			(value.video_id !== undefined) !== (value.video_url !== undefined),
		{ message: 'Provide exactly one of video_id or video_url' },
	);

export type LipSyncDetectFaceInput = z.infer<
	typeof LipSyncDetectFaceInputSchema
>;

export const LipSyncFaceChooseSchema = z
	.object({
		face_id: z.string().min(1),
		audio_id: z.string().min(1).optional(),
		sound_file: z.string().min(1).optional(),
		sound_start_time: z.number().int().min(0),
		sound_end_time: z.number().int().min(0),
		sound_insert_time: z.number().int().min(0),
		sound_volume: z.number().min(0).max(2).optional(),
		original_audio_volume: z.number().min(0).max(2).optional(),
	})
	.refine(
		(value) =>
			(value.audio_id !== undefined) !== (value.sound_file !== undefined),
		{ message: 'Provide exactly one of audio_id or sound_file' },
	);

export type LipSyncFaceChoose = z.infer<typeof LipSyncFaceChooseSchema>;

export const LipSyncCreateInputSchema = z.object({
	session_id: z.string().min(1),
	face_choose: z.array(LipSyncFaceChooseSchema).min(1),
	watermark_info: KlingWatermarkInfoSchema.optional(),
	callback_url: z.string().optional(),
	external_task_id: z.string().optional(),
});

export type LipSyncCreateInput = z.infer<typeof LipSyncCreateInputSchema>;

// ── Video effects (POST /v1/videos/effects) ─────────────────────────────────

// The docs publish 219 `effect_scene` values and keep growing, so the scene is
// validated only as a non-empty string rather than a brittle closed enum.
export const VideoEffectsInputSchema = z
	.object({
		// Single-image effects use `image`; dual-image effects use `images`.
		image: z.string().min(1).optional(),
		images: z.array(z.string().min(1)).min(1).optional(),
	})
	.refine(
		(value) => (value.image !== undefined) !== (value.images !== undefined),
		{ message: 'Provide exactly one of input.image or input.images' },
	);

export type VideoEffectsInput = z.infer<typeof VideoEffectsInputSchema>;

export const VideoEffectsCreateInputSchema = z.object({
	effect_scene: z.string().min(1),
	input: VideoEffectsInputSchema,
	callback_url: z.string().optional(),
	external_task_id: z.string().optional(),
});

export type VideoEffectsCreateInput = z.infer<
	typeof VideoEffectsCreateInputSchema
>;

// ── Virtual try-on (POST /solutions/virtual_try_on) ─────────────────────────

// The Solution API mandates exactly one product image and one person image.
export const VirtualTryOnContentSchema = z.object({
	type: z.enum(['product_image', 'person_image']),
	url: z.string().min(1),
});

export type VirtualTryOnContent = z.infer<typeof VirtualTryOnContentSchema>;

export const VirtualTryOnCreateInputSchema = z
	.object({
		contents: z.array(VirtualTryOnContentSchema),
		settings: z
			.object({
				keep_face: z.boolean().optional(),
				keep_pose: z.boolean().optional(),
				keep_background: z.boolean().optional(),
			})
			.passthrough()
			.optional(),
		options: z
			.object({
				callback_url: z.string().optional(),
				external_task_id: z.string().optional(),
				watermark: KlingWatermarkInfoSchema.optional(),
			})
			.passthrough()
			.optional(),
	})
	.refine(
		(value) => {
			const types = value.contents.map((item) => item.type);
			return (
				value.contents.length === 2 &&
				types.filter((type) => type === 'product_image').length === 1 &&
				types.filter((type) => type === 'person_image').length === 1
			);
		},
		{
			message:
				'contents must contain exactly 1 product_image and 1 person_image',
		},
	);

export type VirtualTryOnCreateInput = z.infer<
	typeof VirtualTryOnCreateInputSchema
>;

// ── Plugin endpoint input/output collections ────────────────────────────────

export type KlingEndpointInputs = {
	textToVideoCreate: TextToVideoCreateInput;
	textToVideoGet: KlingTaskGetInput;
	textToVideoList: KlingTaskListInput;
	imageToVideoCreate: ImageToVideoCreateInput;
	imageToVideoGet: KlingTaskGetInput;
	imageToVideoList: KlingTaskListInput;
	omniVideoCreate: OmniVideoCreateInput;
	omniVideoGet: KlingTaskGetInput;
	omniVideoList: KlingTaskListInput;
	motionControlCreate: MotionControlCreateInput;
	motionControlGet: KlingTaskGetInput;
	motionControlList: KlingTaskListInput;
	imageGenerationCreate: ImageGenerationCreateInput;
	imageGenerationGet: KlingTaskGetInput;
	imageGenerationList: KlingTaskPageListInput;
	multiImageToImageCreate: MultiImageToImageCreateInput;
	multiImageToImageGet: KlingTaskGetInput;
	multiImageToImageList: KlingTaskPageListInput;
	omniImageCreate: OmniImageCreateInput;
	omniImageGet: KlingTaskGetInput;
	omniImageList: KlingTaskPageListInput;
	outpaintingCreate: OutpaintingCreateInput;
	outpaintingGet: KlingTaskGetInput;
	outpaintingList: KlingTaskPageListInput;
	lipSyncDetectFace: LipSyncDetectFaceInput;
	lipSyncCreate: LipSyncCreateInput;
	lipSyncGet: KlingTaskGetInput;
	lipSyncList: KlingTaskPageListInput;
	videoEffectsCreate: VideoEffectsCreateInput;
	videoEffectsGet: KlingTaskGetInput;
	videoEffectsList: KlingTaskPageListInput;
	virtualTryOnCreate: VirtualTryOnCreateInput;
	virtualTryOnGet: KlingTaskGetInput;
	virtualTryOnList: KlingSolutionListInput;
};

export type KlingEndpointOutputs = {
	textToVideoCreate: KlingCreateTaskOutput;
	textToVideoGet: KlingTaskListOutput;
	textToVideoList: KlingCursorTaskListOutput;
	imageToVideoCreate: KlingCreateTaskOutput;
	imageToVideoGet: KlingTaskListOutput;
	imageToVideoList: KlingCursorTaskListOutput;
	omniVideoCreate: KlingCreateTaskOutput;
	omniVideoGet: KlingTaskListOutput;
	omniVideoList: KlingCursorTaskListOutput;
	motionControlCreate: KlingCreateTaskOutput;
	motionControlGet: KlingTaskListOutput;
	motionControlList: KlingCursorTaskListOutput;
	imageGenerationCreate: KlingCreateTaskOutput;
	imageGenerationGet: KlingTaskDetailOutput;
	imageGenerationList: KlingTaskListOutput;
	multiImageToImageCreate: KlingCreateTaskOutput;
	multiImageToImageGet: KlingTaskDetailOutput;
	multiImageToImageList: KlingTaskListOutput;
	omniImageCreate: KlingCreateTaskOutput;
	omniImageGet: KlingTaskDetailOutput;
	omniImageList: KlingTaskListOutput;
	outpaintingCreate: KlingCreateTaskOutput;
	outpaintingGet: KlingTaskDetailOutput;
	outpaintingList: KlingTaskListOutput;
	lipSyncDetectFace: KlingFaceDetectOutput;
	lipSyncCreate: KlingCreateTaskOutput;
	lipSyncGet: KlingTaskDetailOutput;
	lipSyncList: KlingTaskListOutput;
	videoEffectsCreate: KlingCreateTaskOutput;
	videoEffectsGet: KlingTaskDetailOutput;
	videoEffectsList: KlingTaskListOutput;
	virtualTryOnCreate: KlingCreateTaskOutput;
	virtualTryOnGet: KlingTaskListOutput;
	virtualTryOnList: KlingCursorTaskListOutput;
};

export const KlingEndpointInputSchemas = {
	textToVideoCreate: TextToVideoCreateInputSchema,
	textToVideoGet: KlingTaskGetInputSchema,
	textToVideoList: KlingTaskListInputSchema,
	imageToVideoCreate: ImageToVideoCreateInputSchema,
	imageToVideoGet: KlingTaskGetInputSchema,
	imageToVideoList: KlingTaskListInputSchema,
	omniVideoCreate: OmniVideoCreateInputSchema,
	omniVideoGet: KlingTaskGetInputSchema,
	omniVideoList: KlingTaskListInputSchema,
	motionControlCreate: MotionControlCreateInputSchema,
	motionControlGet: KlingTaskGetInputSchema,
	motionControlList: KlingTaskListInputSchema,
	imageGenerationCreate: ImageGenerationCreateInputSchema,
	imageGenerationGet: KlingTaskGetInputSchema,
	imageGenerationList: KlingTaskPageListInputSchema,
	multiImageToImageCreate: MultiImageToImageCreateInputSchema,
	multiImageToImageGet: KlingTaskGetInputSchema,
	multiImageToImageList: KlingTaskPageListInputSchema,
	omniImageCreate: OmniImageCreateInputSchema,
	omniImageGet: KlingTaskGetInputSchema,
	omniImageList: KlingTaskPageListInputSchema,
	outpaintingCreate: OutpaintingCreateInputSchema,
	outpaintingGet: KlingTaskGetInputSchema,
	outpaintingList: KlingTaskPageListInputSchema,
	lipSyncDetectFace: LipSyncDetectFaceInputSchema,
	lipSyncCreate: LipSyncCreateInputSchema,
	lipSyncGet: KlingTaskGetInputSchema,
	lipSyncList: KlingTaskPageListInputSchema,
	videoEffectsCreate: VideoEffectsCreateInputSchema,
	videoEffectsGet: KlingTaskGetInputSchema,
	videoEffectsList: KlingTaskPageListInputSchema,
	virtualTryOnCreate: VirtualTryOnCreateInputSchema,
	virtualTryOnGet: KlingTaskGetInputSchema,
	virtualTryOnList: KlingSolutionListInputSchema,
} as const;

export const KlingEndpointOutputSchemas = {
	textToVideoCreate: KlingCreateTaskResponseSchema,
	textToVideoGet: KlingTaskListResponseSchema,
	textToVideoList: KlingCursorTaskListResponseSchema,
	imageToVideoCreate: KlingCreateTaskResponseSchema,
	imageToVideoGet: KlingTaskListResponseSchema,
	imageToVideoList: KlingCursorTaskListResponseSchema,
	omniVideoCreate: KlingCreateTaskResponseSchema,
	omniVideoGet: KlingTaskListResponseSchema,
	omniVideoList: KlingCursorTaskListResponseSchema,
	motionControlCreate: KlingCreateTaskResponseSchema,
	motionControlGet: KlingTaskListResponseSchema,
	motionControlList: KlingCursorTaskListResponseSchema,
	imageGenerationCreate: KlingCreateTaskResponseSchema,
	imageGenerationGet: KlingTaskDetailResponseSchema,
	imageGenerationList: KlingTaskListResponseSchema,
	multiImageToImageCreate: KlingCreateTaskResponseSchema,
	multiImageToImageGet: KlingTaskDetailResponseSchema,
	multiImageToImageList: KlingTaskListResponseSchema,
	omniImageCreate: KlingCreateTaskResponseSchema,
	omniImageGet: KlingTaskDetailResponseSchema,
	omniImageList: KlingTaskListResponseSchema,
	outpaintingCreate: KlingCreateTaskResponseSchema,
	outpaintingGet: KlingTaskDetailResponseSchema,
	outpaintingList: KlingTaskListResponseSchema,
	lipSyncDetectFace: KlingFaceDetectResponseSchema,
	lipSyncCreate: KlingCreateTaskResponseSchema,
	lipSyncGet: KlingTaskDetailResponseSchema,
	lipSyncList: KlingTaskListResponseSchema,
	videoEffectsCreate: KlingCreateTaskResponseSchema,
	videoEffectsGet: KlingTaskDetailResponseSchema,
	videoEffectsList: KlingTaskListResponseSchema,
	virtualTryOnCreate: KlingCreateTaskResponseSchema,
	virtualTryOnGet: KlingTaskListResponseSchema,
	virtualTryOnList: KlingCursorTaskListResponseSchema,
} as const;
