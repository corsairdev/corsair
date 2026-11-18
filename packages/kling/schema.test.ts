import type { z } from 'zod';
import {
	ImageGenerationCreateInputSchema,
	ImageToVideoCreateInputSchema,
	KlingContentItemSchema,
	KlingCreateTaskResponseSchema,
	KlingCursorTaskListResponseSchema,
	KlingFaceDetectResponseSchema,
	KlingMotionControlSettingsSchema,
	KlingNewApiOptionsSchema,
	KlingSolutionListInputSchema,
	KlingTaskDetailResponseSchema,
	KlingTaskFilterSchema,
	KlingTaskGetInputSchema,
	KlingTaskListInputSchema,
	KlingTaskListResponseSchema,
	KlingTaskPageListInputSchema,
	KlingVideoSettingsSchema,
	KlingWatermarkInfoSchema,
	LipSyncCreateInputSchema,
	LipSyncDetectFaceInputSchema,
	LipSyncFaceChooseSchema,
	MotionControlCreateInputSchema,
	MultiImageToImageCreateInputSchema,
	OmniImageCreateInputSchema,
	OmniVideoCreateInputSchema,
	OutpaintingCreateInputSchema,
	TextToVideoCreateInputSchema,
	VideoEffectsCreateInputSchema,
	VideoEffectsInputSchema,
	VirtualTryOnContentSchema,
	VirtualTryOnCreateInputSchema,
} from './endpoints/types';
import { KlingSchema } from './schema';
import { klingEntities } from './schema/database';

describe('Kling schema', () => {
	it('declares a semver version', () => {
		expect(KlingSchema.version).toBeDefined();
		expect(KlingSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an empty entities map', () => {
		expect(KlingSchema.entities).toBe(klingEntities);
		expect(KlingSchema.entities).toEqual({});
	});
});

// Fixture shapes mirror the envelopes published at
// https://kling.ai/document-api/llms.txt (task create/get/list responses,
// face detection, and the /v1 legacy query responses).
type SchemaCase = {
	name: string;
	schema: z.ZodType;
	// Arbitrary valid fixture; `unknown` because each schema under test has its
	// own shape.
	valid: unknown;
	// Arbitrary invalid fixture; `unknown` for the same reason as `valid`.
	invalid: unknown;
};

const schemaCases: SchemaCase[] = [
	{
		name: 'KlingTaskGetInputSchema',
		schema: KlingTaskGetInputSchema,
		valid: { task_id: 'task-1' },
		invalid: { task_id: '' },
	},
	{
		name: 'KlingTaskFilterSchema',
		schema: KlingTaskFilterSchema,
		valid: { key: 'product_type', values: ['text_to_video'] },
		invalid: { key: 'not_a_filter', values: ['x'] },
	},
	{
		name: 'KlingTaskListInputSchema',
		schema: KlingTaskListInputSchema,
		valid: {
			start_time: 1,
			end_time: '2',
			cursor: 'cursor-1',
			limit: 10,
			filters: [{ key: 'status', values: ['succeeded'] }],
		},
		invalid: { limit: 0 },
	},
	{
		name: 'KlingSolutionListInputSchema',
		schema: KlingSolutionListInputSchema,
		valid: { limit: 5, filters: [{ key: 'status', values: ['succeed'] }] },
		invalid: { filters: [{ key: 'product_type', values: ['x'] }] },
	},
	{
		name: 'KlingTaskPageListInputSchema',
		schema: KlingTaskPageListInputSchema,
		valid: { pageNum: 1, pageSize: 30 },
		invalid: { pageSize: 501 },
	},
	{
		name: 'KlingWatermarkInfoSchema',
		schema: KlingWatermarkInfoSchema,
		valid: { enabled: true },
		invalid: { enabled: 'yes' },
	},
	{
		name: 'KlingContentItemSchema',
		schema: KlingContentItemSchema,
		valid: { type: 'prompt', text: 'a cat' },
		invalid: { type: '' },
	},
	{
		name: 'KlingVideoSettingsSchema',
		schema: KlingVideoSettingsSchema,
		valid: { resolution: '1080p', duration: 5, audio: 'native' },
		invalid: { duration: 'five' },
	},
	{
		name: 'KlingMotionControlSettingsSchema',
		schema: KlingMotionControlSettingsSchema,
		valid: { character_orientation: 'image', duration: 5 },
		invalid: { character_orientation: 'sideways' },
	},
	{
		name: 'KlingNewApiOptionsSchema',
		schema: KlingNewApiOptionsSchema,
		valid: {
			callback_url: 'https://cdn.invalid/cb',
			watermark_info: { enabled: false },
		},
		invalid: { watermark_info: {} },
	},
	{
		name: 'TextToVideoCreateInputSchema',
		schema: TextToVideoCreateInputSchema,
		valid: { model: 'kling-2.6', prompt: 'a calm ocean at sunrise' },
		invalid: { model: 'not-a-model', prompt: 'hi' },
	},
	{
		name: 'ImageToVideoCreateInputSchema',
		schema: ImageToVideoCreateInputSchema,
		valid: {
			model: 'kling-2.5-turbo',
			contents: [{ type: 'prompt', text: 'slow zoom in' }],
		},
		invalid: { model: 'kling-2.6', contents: [] },
	},
	{
		name: 'OmniVideoCreateInputSchema',
		schema: OmniVideoCreateInputSchema,
		valid: {
			model: 'kling-o1',
			contents: [{ type: 'image', url: 'https://cdn.invalid/i.png' }],
		},
		invalid: { model: 'kling-2.6', contents: [{ type: 'prompt' }] },
	},
	{
		name: 'MotionControlCreateInputSchema',
		schema: MotionControlCreateInputSchema,
		valid: {
			model: 'kling-2.6',
			contents: [{ type: 'image', url: 'https://cdn.invalid/i.png' }],
			settings: { character_orientation: 'image' },
		},
		invalid: {
			model: 'kling-2.6',
			contents: [{ type: 'image' }],
			settings: {},
		},
	},
	{
		name: 'ImageGenerationCreateInputSchema',
		schema: ImageGenerationCreateInputSchema,
		valid: { prompt: 'a cat', n: 2, aspect_ratio: '1:1', resolution: '2k' },
		invalid: { prompt: 'a cat', n: 0 },
	},
	{
		name: 'MultiImageToImageCreateInputSchema',
		schema: MultiImageToImageCreateInputSchema,
		valid: {
			subject_image_list: [{ subject_image: 'https://cdn.invalid/s.png' }],
		},
		invalid: { subject_image_list: [] },
	},
	{
		name: 'OmniImageCreateInputSchema',
		schema: OmniImageCreateInputSchema,
		valid: { prompt: 'a cat', series_amount: 'auto', aspect_ratio: 'auto' },
		invalid: { prompt: 'a cat', series_amount: 1 },
	},
	{
		name: 'OutpaintingCreateInputSchema',
		schema: OutpaintingCreateInputSchema,
		valid: {
			image: 'https://cdn.invalid/i.png',
			up_expansion_ratio: 0.5,
			down_expansion_ratio: 0.5,
			left_expansion_ratio: 0.5,
			right_expansion_ratio: 0.5,
		},
		invalid: {
			image: 'https://cdn.invalid/i.png',
			up_expansion_ratio: 3,
			down_expansion_ratio: 0.5,
			left_expansion_ratio: 0.5,
			right_expansion_ratio: 0.5,
		},
	},
	{
		name: 'LipSyncDetectFaceInputSchema',
		schema: LipSyncDetectFaceInputSchema,
		valid: { video_url: 'https://cdn.invalid/v.mp4' },
		invalid: {
			video_id: 'video-1',
			video_url: 'https://cdn.invalid/v.mp4',
		},
	},
	{
		name: 'LipSyncFaceChooseSchema',
		schema: LipSyncFaceChooseSchema,
		valid: {
			face_id: 'face-1',
			sound_file: 'https://cdn.invalid/a.mp3',
			sound_start_time: 0,
			sound_end_time: 1000,
			sound_insert_time: 0,
		},
		invalid: {
			face_id: 'face-1',
			sound_start_time: 0,
			sound_end_time: 1000,
			sound_insert_time: 0,
		},
	},
	{
		name: 'LipSyncCreateInputSchema',
		schema: LipSyncCreateInputSchema,
		valid: {
			session_id: 'session-1',
			face_choose: [
				{
					face_id: 'face-1',
					sound_file: 'https://cdn.invalid/a.mp3',
					sound_start_time: 0,
					sound_end_time: 1000,
					sound_insert_time: 0,
				},
			],
		},
		invalid: { session_id: 'session-1', face_choose: [] },
	},
	{
		name: 'VideoEffectsInputSchema',
		schema: VideoEffectsInputSchema,
		valid: { images: ['https://cdn.invalid/i.png'] },
		invalid: {
			image: 'https://cdn.invalid/i.png',
			images: ['https://cdn.invalid/j.png'],
		},
	},
	{
		name: 'VideoEffectsCreateInputSchema',
		schema: VideoEffectsCreateInputSchema,
		valid: {
			effect_scene: 'net_the_fish',
			input: { image: 'https://cdn.invalid/i.png' },
		},
		invalid: { effect_scene: '', input: { image: 'https://x.invalid/i.png' } },
	},
	{
		name: 'VirtualTryOnContentSchema',
		schema: VirtualTryOnContentSchema,
		valid: { type: 'product_image', url: 'https://cdn.invalid/p.png' },
		invalid: { type: 'background_image', url: 'https://x.invalid/p.png' },
	},
	{
		name: 'VirtualTryOnCreateInputSchema',
		schema: VirtualTryOnCreateInputSchema,
		valid: {
			contents: [
				{ type: 'product_image', url: 'https://cdn.invalid/p.png' },
				{ type: 'person_image', url: 'https://cdn.invalid/m.png' },
			],
		},
		invalid: {
			contents: [
				{ type: 'product_image', url: 'https://cdn.invalid/p.png' },
				{ type: 'product_image', url: 'https://cdn.invalid/q.png' },
			],
		},
	},
	{
		name: 'KlingCreateTaskResponseSchema',
		schema: KlingCreateTaskResponseSchema,
		valid: {
			code: 0,
			message: 'ok',
			request_id: 'req-1',
			data: {
				id: 'task-1',
				task_id: 'legacy-1',
				status: 'submitted',
				created_at: 1_700_000_000,
				task_info: { external_task_id: 'ext-1' },
			},
		},
		invalid: { data: { id: 'task-1' } },
	},
	{
		name: 'KlingTaskDetailResponseSchema',
		schema: KlingTaskDetailResponseSchema,
		valid: {
			code: 0,
			data: {
				task_id: 'task-1',
				task_status: 'succeed',
				task_result: {
					images: [{ index: 0, url: 'https://cdn.invalid/i.png' }],
					videos: [{ id: 'video-1', url: 'https://cdn.invalid/v.mp4' }],
				},
			},
		},
		invalid: { code: '0', data: {} },
	},
	{
		name: 'KlingTaskListResponseSchema',
		schema: KlingTaskListResponseSchema,
		valid: {
			code: 0,
			data: [
				{
					id: 'task-1',
					status: 'succeeded',
					outputs: [{ type: 'video', url: 'https://cdn.invalid/v.mp4' }],
					billing: [{ charge_type: 'cash', amount: '0.5' }],
				},
			],
		},
		invalid: { code: 0, data: {} },
	},
	{
		name: 'KlingCursorTaskListResponseSchema',
		schema: KlingCursorTaskListResponseSchema,
		valid: {
			code: 0,
			data: {
				result: [{ id: 'task-1', status: 'processing' }],
				count: 1,
				next_cursor: 'cursor-2',
				has_more: true,
			},
		},
		invalid: { code: 0, data: { count: 1 } },
	},
	{
		name: 'KlingFaceDetectResponseSchema',
		schema: KlingFaceDetectResponseSchema,
		valid: {
			code: 0,
			data: {
				session_id: 'session-1',
				face_data: [{ face_id: 'face-1', start_time: 0, end_time: 1000 }],
			},
		},
		invalid: { code: 0, data: { face_data: [] } },
	},
];

describe('Kling endpoint schemas', () => {
	it.each(schemaCases)('$name accepts valid input', ({ schema, valid }) => {
		expect(schema.safeParse(valid).success).toBe(true);
	});

	it.each(schemaCases)('$name rejects invalid input', ({ schema, invalid }) => {
		expect(schema.safeParse(invalid).success).toBe(false);
	});
});
