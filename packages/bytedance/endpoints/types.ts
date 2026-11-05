import { z } from 'zod';

// Shapes follow the BytePlus ModelArk Video Generation API reference:
// https://docs.byteplus.com/en/docs/ModelArk/1520757 (create),
// https://docs.byteplus.com/en/docs/ModelArk/1521309 (retrieve),
// https://docs.byteplus.com/en/docs/ModelArk/1521675 (list),
// https://docs.byteplus.com/en/docs/ModelArk/1521720 (cancel or delete).

/** Model IDs from https://docs.byteplus.com/en/docs/ModelArk/1330310. */
export const SEEDANCE_MODELS = [
	'dreamina-seedance-2-5-260628',
	'dreamina-seedance-2-0-260128',
	'dreamina-seedance-2-0-fast-260128',
	'dreamina-seedance-2-0-mini-260615',
	'seedance-1-5-pro-251215',
	'seedance-1-0-pro-250528',
	'seedance-1-0-pro-fast-251015',
] as const;

// A URL, a data: URI (images and audio), or an asset:// digital character ID.
const MediaSource = z
	.string()
	.regex(
		/^(https?:\/\/|data:|asset:\/\/)\S+$/,
		'Expected a URL, data: URI, or asset:// ID',
	);

const ContentItem = z.discriminatedUnion('type', [
	z.object({ type: z.literal('text'), text: z.string().min(1) }),
	z.object({
		type: z.literal('image_url'),
		image_url: z.object({ url: MediaSource }),
		role: z.enum(['first_frame', 'last_frame', 'reference_image']).optional(),
	}),
	z.object({
		type: z.literal('video_url'),
		video_url: z.object({ url: MediaSource }),
		role: z.literal('reference_video'),
	}),
	z.object({
		type: z.literal('audio_url'),
		audio_url: z.object({ url: MediaSource }),
		role: z.literal('reference_audio'),
	}),
	z.object({
		type: z.literal('draft_task'),
		draft_task: z.object({ id: z.string().min(1) }),
	}),
]);

export type ContentItem = z.infer<typeof ContentItem>;

const Ratio = z.enum(['16:9', '4:3', '1:1', '3:4', '9:16', '21:9', 'adaptive']);
const Resolution = z.enum(['480p', '720p', '1080p', '4k']);
const ServiceTier = z.enum(['default', 'flex']);

const frameRoles = (content: ContentItem[], role: string) =>
	content.filter((item) => item.type === 'image_url' && item.role === role)
		.length;

const VideoCreateInputSchema = z
	.object({
		model: z
			.string()
			.min(1)
			.describe(
				`Model ID (${SEEDANCE_MODELS.join(', ')}) or an inference endpoint ID`,
			),
		content: z.array(ContentItem).min(1),
		omni_reference_task_type: z
			.enum(['auto', 'reference', 'edit', 'extend'])
			.optional(),
		resolution: Resolution.optional(),
		ratio: Ratio.optional(),
		// -1 lets the model pick the length. 2.5 accepts 4-30, 2.0 4-15,
		// 1.5 pro 4-12, 1.0 pro 2-12; the API enforces the per-model range.
		duration: z
			.union([z.literal(-1), z.number().int().min(2).max(30)])
			.optional(),
		frames: z
			.number()
			.int()
			.min(29)
			.max(289)
			.refine((frames) => (frames - 25) % 4 === 0, {
				message: 'frames must be 25 + 4n',
			})
			.optional(),
		generate_audio: z.boolean().optional(),
		watermark: z.boolean().optional(),
		output_format: z.enum(['mp4', 'mov']).optional(),
		seed: z.number().int().min(-1).max(2147483647).optional(),
		camera_fixed: z.boolean().optional(),
		return_last_frame: z.boolean().optional(),
		draft: z.boolean().optional(),
		service_tier: ServiceTier.optional(),
		callback_url: z.url().optional(),
		execution_expires_after: z.number().int().min(3600).max(259200).optional(),
		priority: z.number().int().min(0).max(9).optional(),
		safety_identifier: z.string().min(1).max(64).optional(),
	})
	.refine((input) => frameRoles(input.content, 'first_frame') <= 1, {
		message: 'At most one first_frame image',
	})
	.refine((input) => frameRoles(input.content, 'last_frame') <= 1, {
		message: 'At most one last_frame image',
	})
	.refine(
		(input) =>
			frameRoles(input.content, 'last_frame') === 0 ||
			frameRoles(input.content, 'first_frame') === 1,
		{ message: 'A last_frame image needs a first_frame image' },
	)
	.refine(
		(input) => !(input.priority !== undefined && input.service_tier === 'flex'),
		{
			message: 'priority is not supported with service_tier "flex"',
		},
	)
	.refine(
		(input) => !input.draft || !input.resolution || input.resolution === '480p',
		{
			message: 'Draft videos are 480p only',
		},
	);

const TaskStatus = z.enum([
	'queued',
	'running',
	'cancelled',
	'succeeded',
	'failed',
	'expired',
]);

export const VideoTaskSchema = z.object({
	id: z.string(),
	model: z.string().nullish(),
	status: TaskStatus,
	content: z
		.object({
			video_url: z.string().nullish(),
			last_frame_url: z.string().nullish(),
		})
		.nullish(),
	error: z.object({ code: z.string(), message: z.string() }).nullish(),
	created_at: z.number().nullish(),
	updated_at: z.number().nullish(),
	duration: z.number().nullish(),
	frames: z.number().nullish(),
	framespersecond: z.number().nullish(),
	generate_audio: z.boolean().nullish(),
	output_format: z.string().nullish(),
	priority: z.number().nullish(),
	ratio: z.string().nullish(),
	resolution: z.string().nullish(),
	seed: z.number().nullish(),
	service_tier: z.string().nullish(),
	execution_expires_after: z.number().nullish(),
	draft: z.boolean().nullish(),
	draft_task_id: z.string().nullish(),
	safety_identifier: z.string().nullish(),
	usage: z
		.object({
			completion_tokens: z.number().nullish(),
			total_tokens: z.number().nullish(),
		})
		.nullish(),
});

export type VideoTask = z.infer<typeof VideoTaskSchema>;

const TaskIdInputSchema = z.object({ id: z.string().min(1) });

const TasksListInputSchema = z.object({
	page_num: z.number().int().min(1).max(500).optional(),
	page_size: z.number().int().min(1).max(500).optional(),
	status: TaskStatus.exclude(['expired']).optional(),
	task_ids: z.array(z.string().min(1)).min(1).optional(),
	model: z.string().min(1).optional(),
	service_tier: ServiceTier.optional(),
});

const VideoCreateResponseSchema = z.object({ id: z.string() });

const TasksListResponseSchema = z.object({
	items: z.array(VideoTaskSchema),
	total: z.number(),
});

// The API returns an empty body.
const TaskDeleteResponseSchema = z.object({});

export type VideoCreateInput = z.infer<typeof VideoCreateInputSchema>;
export type VideoCreateResponse = z.infer<typeof VideoCreateResponseSchema>;
export type TaskIdInput = z.infer<typeof TaskIdInputSchema>;
export type TasksListInput = z.infer<typeof TasksListInputSchema>;
export type TasksListResponse = z.infer<typeof TasksListResponseSchema>;
export type TaskDeleteResponse = z.infer<typeof TaskDeleteResponseSchema>;

export type BytedanceEndpointInputs = {
	videoCreate: VideoCreateInput;
	tasksGet: TaskIdInput;
	tasksList: TasksListInput;
	tasksDelete: TaskIdInput;
};

export type BytedanceEndpointOutputs = {
	videoCreate: VideoCreateResponse;
	tasksGet: VideoTask;
	tasksList: TasksListResponse;
	tasksDelete: TaskDeleteResponse;
};

export const BytedanceEndpointInputSchemas = {
	videoCreate: VideoCreateInputSchema,
	tasksGet: TaskIdInputSchema,
	tasksList: TasksListInputSchema,
	tasksDelete: TaskIdInputSchema,
} as const;

export const BytedanceEndpointOutputSchemas = {
	videoCreate: VideoCreateResponseSchema,
	tasksGet: VideoTaskSchema,
	tasksList: TasksListResponseSchema,
	tasksDelete: TaskDeleteResponseSchema,
} as const;
