import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import * as client from './client';
import {
	ImageGeneration,
	ImageToVideo,
	LipSync,
	MotionControl,
	MultiImageToImage,
	OmniImage,
	OmniVideo,
	Outpainting,
	TextToVideo,
	VideoEffects,
	VirtualTryOn,
} from './endpoints';
import type { KlingContext } from './index';
import { kling, klingEndpointSchemas } from './index';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return { ...actual, makeKlingRequest: jest.fn() };
});

const mockedRequest = jest.mocked(client.makeKlingRequest);
const mockedLogEvent = jest.mocked(logEventFromContext);

type Ctx = KlingContext;

function buildCtx(): Ctx {
	const ctx: KlingContext = {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key: 'test-api-key',
		options: {},
		keys: {
			get_dek: () => Promise.resolve('test-dek'),
			issue_new_dek: () => Promise.resolve('test-dek'),
			get_api_key: () => Promise.resolve('test-api-key'),
			set_api_key: () => Promise.resolve(),
			get_webhook_signature: () => Promise.resolve(null),
			set_webhook_signature: () => Promise.resolve(),
		},
		db: {},
	};
	return ctx;
}

const ctx = buildCtx();

beforeEach(() => {
	mockedRequest.mockReset();
	mockedLogEvent.mockReset();
});

// Fixtures mirror the response envelopes documented at
// https://kling.ai/document-api/llms.txt.

const createResponse = { code: 0, data: { id: 'task-1' } };
const listArray = { code: 0, data: [{ id: 'task-1' }] };
const pageEmpty = { code: 0, data: [] };
const cursorEmpty = {
	code: 0,
	data: { result: [], count: 0, has_more: false },
};
const detailResponse = {
	code: 0,
	data: { task_id: 'task-1', task_status: 'succeed' },
};
const faceResponse = {
	code: 0,
	data: { session_id: 'session-1', face_data: [{ face_id: 'face-1' }] },
};

// Each row is one implemented endpoint. `unknown` is not needed here: the
// shared table widens the per-endpoint input/output to JSON records, which the
// bivariant endpoint parameter type accepts.
type Row = {
	name: string;
	event: string;
	op: CorsairEndpoint<Ctx, Record<string, unknown>, Record<string, unknown>>;
	input: Record<string, unknown>;
	response: Record<string, unknown>;
	path: string;
	options: Record<string, unknown>;
	logPayload: Record<string, unknown>;
};

const happyRows: Row[] = [
	{
		name: 'textToVideo.create',
		event: 'kling.textToVideo.create',
		op: TextToVideo.create,
		input: { model: 'kling-2.6', prompt: 'a calm ocean at sunrise' },
		response: createResponse,
		path: '/text-to-video/kling-2.6',
		options: {
			method: 'POST',
			body: { prompt: 'a calm ocean at sunrise' },
		},
		logPayload: { model: 'kling-2.6', taskId: 'task-1' },
	},
	{
		name: 'textToVideo.get',
		event: 'kling.textToVideo.get',
		op: TextToVideo.get,
		input: { task_id: 'task-1' },
		response: listArray,
		path: '/tasks',
		options: { method: 'GET', query: { task_ids: 'task-1' } },
		logPayload: { count: 1 },
	},
	{
		name: 'textToVideo.list',
		event: 'kling.textToVideo.list',
		op: TextToVideo.list,
		input: { limit: 10 },
		response: cursorEmpty,
		path: '/tasks',
		options: { method: 'POST', body: { limit: 10 } },
		logPayload: { count: 0 },
	},
	{
		name: 'imageToVideo.create',
		event: 'kling.imageToVideo.create',
		op: ImageToVideo.create,
		input: {
			model: 'kling-2.6',
			contents: [{ type: 'prompt', text: 'slow zoom in' }],
		},
		response: createResponse,
		path: '/image-to-video/kling-2.6',
		options: {
			method: 'POST',
			body: { contents: [{ type: 'prompt', text: 'slow zoom in' }] },
		},
		logPayload: { model: 'kling-2.6', taskId: 'task-1' },
	},
	{
		name: 'imageToVideo.get',
		event: 'kling.imageToVideo.get',
		op: ImageToVideo.get,
		input: { task_id: 'task-1' },
		response: listArray,
		path: '/tasks',
		options: { method: 'GET', query: { task_ids: 'task-1' } },
		logPayload: { count: 1 },
	},
	{
		name: 'imageToVideo.list',
		event: 'kling.imageToVideo.list',
		op: ImageToVideo.list,
		input: { limit: 10 },
		response: cursorEmpty,
		path: '/tasks',
		options: { method: 'POST', body: { limit: 10 } },
		logPayload: { count: 0 },
	},
	{
		name: 'omniVideo.create',
		event: 'kling.omniVideo.create',
		op: OmniVideo.create,
		input: {
			model: 'kling-3.0-omni',
			contents: [{ type: 'image', url: 'https://cdn.invalid/i.png' }],
		},
		response: createResponse,
		path: '/omni-video/kling-3.0-omni',
		options: {
			method: 'POST',
			body: { contents: [{ type: 'image', url: 'https://cdn.invalid/i.png' }] },
		},
		logPayload: { model: 'kling-3.0-omni', taskId: 'task-1' },
	},
	{
		name: 'omniVideo.get',
		event: 'kling.omniVideo.get',
		op: OmniVideo.get,
		input: { task_id: 'task-1' },
		response: listArray,
		path: '/tasks',
		options: { method: 'GET', query: { task_ids: 'task-1' } },
		logPayload: { count: 1 },
	},
	{
		name: 'omniVideo.list',
		event: 'kling.omniVideo.list',
		op: OmniVideo.list,
		input: { limit: 10 },
		response: cursorEmpty,
		path: '/tasks',
		options: { method: 'POST', body: { limit: 10 } },
		logPayload: { count: 0 },
	},
	{
		name: 'motionControl.create',
		event: 'kling.motionControl.create',
		op: MotionControl.create,
		input: {
			model: 'kling-2.6',
			contents: [{ type: 'image', url: 'https://cdn.invalid/i.png' }],
			settings: { character_orientation: 'image' },
		},
		response: createResponse,
		path: '/motion-control/kling-2.6',
		options: {
			method: 'POST',
			body: {
				contents: [{ type: 'image', url: 'https://cdn.invalid/i.png' }],
				settings: { character_orientation: 'image' },
			},
		},
		logPayload: { model: 'kling-2.6', taskId: 'task-1' },
	},
	{
		name: 'motionControl.get',
		event: 'kling.motionControl.get',
		op: MotionControl.get,
		input: { task_id: 'task-1' },
		response: listArray,
		path: '/tasks',
		options: { method: 'GET', query: { task_ids: 'task-1' } },
		logPayload: { count: 1 },
	},
	{
		name: 'motionControl.list',
		event: 'kling.motionControl.list',
		op: MotionControl.list,
		input: { limit: 10 },
		response: cursorEmpty,
		path: '/tasks',
		options: { method: 'POST', body: { limit: 10 } },
		logPayload: { count: 0 },
	},
	{
		name: 'imageGeneration.create',
		event: 'kling.imageGeneration.create',
		op: ImageGeneration.create,
		input: { prompt: 'a cat' },
		response: createResponse,
		path: '/v1/images/generations',
		options: { method: 'POST', body: { prompt: 'a cat' } },
		logPayload: { modelName: undefined, taskId: 'task-1' },
	},
	{
		name: 'imageGeneration.get',
		event: 'kling.imageGeneration.get',
		op: ImageGeneration.get,
		input: { task_id: 'task-1' },
		response: detailResponse,
		path: '/v1/images/generations/task-1',
		options: { method: 'GET' },
		logPayload: { taskId: 'task-1' },
	},
	{
		name: 'imageGeneration.list',
		event: 'kling.imageGeneration.list',
		op: ImageGeneration.list,
		input: { pageNum: 1, pageSize: 30 },
		response: pageEmpty,
		path: '/v1/images/generations',
		options: { method: 'GET', query: { pageNum: 1, pageSize: 30 } },
		logPayload: { count: 0 },
	},
	{
		name: 'multiImageToImage.create',
		event: 'kling.multiImageToImage.create',
		op: MultiImageToImage.create,
		input: {
			subject_image_list: [{ subject_image: 'https://cdn.invalid/s.png' }],
		},
		response: createResponse,
		path: '/v1/images/multi-image2image',
		options: {
			method: 'POST',
			body: {
				subject_image_list: [{ subject_image: 'https://cdn.invalid/s.png' }],
			},
		},
		logPayload: { modelName: undefined, taskId: 'task-1' },
	},
	{
		name: 'multiImageToImage.get',
		event: 'kling.multiImageToImage.get',
		op: MultiImageToImage.get,
		input: { task_id: 'task-1' },
		response: detailResponse,
		path: '/v1/images/multi-image2image/task-1',
		options: { method: 'GET' },
		logPayload: { taskId: 'task-1' },
	},
	{
		name: 'multiImageToImage.list',
		event: 'kling.multiImageToImage.list',
		op: MultiImageToImage.list,
		input: { pageNum: 1, pageSize: 30 },
		response: pageEmpty,
		path: '/v1/images/multi-image2image',
		options: { method: 'GET', query: { pageNum: 1, pageSize: 30 } },
		logPayload: { count: 0 },
	},
	{
		name: 'omniImage.create',
		event: 'kling.omniImage.create',
		op: OmniImage.create,
		input: { prompt: 'a cat' },
		response: createResponse,
		path: '/v1/images/omni-image',
		options: { method: 'POST', body: { prompt: 'a cat' } },
		logPayload: { modelName: undefined, taskId: 'task-1' },
	},
	{
		name: 'omniImage.get',
		event: 'kling.omniImage.get',
		op: OmniImage.get,
		input: { task_id: 'task-1' },
		response: detailResponse,
		path: '/v1/images/omni-image/task-1',
		options: { method: 'GET' },
		logPayload: { taskId: 'task-1' },
	},
	{
		name: 'omniImage.list',
		event: 'kling.omniImage.list',
		op: OmniImage.list,
		input: { pageNum: 1, pageSize: 30 },
		response: pageEmpty,
		path: '/v1/images/omni-image',
		options: { method: 'GET', query: { pageNum: 1, pageSize: 30 } },
		logPayload: { count: 0 },
	},
	{
		name: 'outpainting.create',
		event: 'kling.outpainting.create',
		op: Outpainting.create,
		input: {
			image: 'https://cdn.invalid/i.png',
			up_expansion_ratio: 0.5,
			down_expansion_ratio: 0.5,
			left_expansion_ratio: 0.5,
			right_expansion_ratio: 0.5,
		},
		response: createResponse,
		path: '/v1/images/editing/expand',
		options: {
			method: 'POST',
			body: {
				image: 'https://cdn.invalid/i.png',
				up_expansion_ratio: 0.5,
				down_expansion_ratio: 0.5,
				left_expansion_ratio: 0.5,
				right_expansion_ratio: 0.5,
			},
		},
		logPayload: { taskId: 'task-1' },
	},
	{
		name: 'outpainting.get',
		event: 'kling.outpainting.get',
		op: Outpainting.get,
		input: { task_id: 'task-1' },
		response: detailResponse,
		path: '/v1/images/editing/expand/task-1',
		options: { method: 'GET' },
		logPayload: { taskId: 'task-1' },
	},
	{
		name: 'outpainting.list',
		event: 'kling.outpainting.list',
		op: Outpainting.list,
		input: { pageNum: 1, pageSize: 30 },
		response: pageEmpty,
		path: '/v1/images/editing/expand',
		options: { method: 'GET', query: { pageNum: 1, pageSize: 30 } },
		logPayload: { count: 0 },
	},
	{
		name: 'lipSync.detectFace',
		event: 'kling.lipSync.detectFace',
		op: LipSync.detectFace,
		input: { video_url: 'https://cdn.invalid/v.mp4' },
		response: faceResponse,
		path: '/v1/videos/identify-face',
		options: {
			method: 'POST',
			body: { video_url: 'https://cdn.invalid/v.mp4' },
		},
		logPayload: { sessionId: 'session-1', faceCount: 1 },
	},
	{
		name: 'lipSync.create',
		event: 'kling.lipSync.create',
		op: LipSync.create,
		input: {
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
		response: createResponse,
		path: '/v1/videos/advanced-lip-sync',
		options: {
			method: 'POST',
			body: {
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
		},
		logPayload: { taskId: 'task-1' },
	},
	{
		name: 'lipSync.get',
		event: 'kling.lipSync.get',
		op: LipSync.get,
		input: { task_id: 'task-1' },
		response: detailResponse,
		path: '/v1/videos/advanced-lip-sync/task-1',
		options: { method: 'GET' },
		logPayload: { taskId: 'task-1' },
	},
	{
		name: 'lipSync.list',
		event: 'kling.lipSync.list',
		op: LipSync.list,
		input: { pageNum: 1, pageSize: 30 },
		response: pageEmpty,
		path: '/v1/videos/advanced-lip-sync',
		options: { method: 'GET', query: { pageNum: 1, pageSize: 30 } },
		logPayload: { count: 0 },
	},
	{
		name: 'videoEffects.create',
		event: 'kling.videoEffects.create',
		op: VideoEffects.create,
		input: {
			effect_scene: 'net_the_fish',
			input: { image: 'https://cdn.invalid/i.png' },
		},
		response: createResponse,
		path: '/v1/videos/effects',
		options: {
			method: 'POST',
			body: {
				effect_scene: 'net_the_fish',
				input: { image: 'https://cdn.invalid/i.png' },
			},
		},
		logPayload: { effectScene: 'net_the_fish', taskId: 'task-1' },
	},
	{
		name: 'videoEffects.get',
		event: 'kling.videoEffects.get',
		op: VideoEffects.get,
		input: { task_id: 'task-1' },
		response: detailResponse,
		path: '/v1/videos/effects/task-1',
		options: { method: 'GET' },
		logPayload: { taskId: 'task-1' },
	},
	{
		name: 'videoEffects.list',
		event: 'kling.videoEffects.list',
		op: VideoEffects.list,
		input: { pageNum: 1, pageSize: 30 },
		response: pageEmpty,
		path: '/v1/videos/effects',
		options: { method: 'GET', query: { pageNum: 1, pageSize: 30 } },
		logPayload: { count: 0 },
	},
	{
		name: 'virtualTryOn.create',
		event: 'kling.virtualTryOn.create',
		op: VirtualTryOn.create,
		input: {
			contents: [
				{ type: 'product_image', url: 'https://cdn.invalid/p.png' },
				{ type: 'person_image', url: 'https://cdn.invalid/m.png' },
			],
		},
		response: createResponse,
		path: '/solutions/virtual_try_on',
		options: {
			method: 'POST',
			body: {
				contents: [
					{ type: 'product_image', url: 'https://cdn.invalid/p.png' },
					{ type: 'person_image', url: 'https://cdn.invalid/m.png' },
				],
			},
		},
		logPayload: { taskId: 'task-1' },
	},
	{
		name: 'virtualTryOn.get',
		event: 'kling.virtualTryOn.get',
		op: VirtualTryOn.get,
		input: { task_id: 'task-1' },
		response: listArray,
		path: '/solutions',
		options: { method: 'GET', query: { task_ids: 'task-1' } },
		logPayload: { count: 1 },
	},
	{
		name: 'virtualTryOn.list',
		event: 'kling.virtualTryOn.list',
		op: VirtualTryOn.list,
		input: { limit: 10 },
		response: cursorEmpty,
		path: '/solutions',
		options: { method: 'POST', body: { limit: 10 } },
		logPayload: { count: 0 },
	},
];

// Same widening as `Row`: `unknown` values are the raw JSON payloads, which
// each endpoint's own zod schema validates at runtime.
type InvalidRow = {
	name: string;
	op: CorsairEndpoint<Ctx, Record<string, unknown>, Record<string, unknown>>;
	input: Record<string, unknown>;
};

const invalidRows: InvalidRow[] = [
	{
		name: 'textToVideo.create',
		op: TextToVideo.create,
		input: { model: 'kling-2.6' },
	},
	{ name: 'textToVideo.get', op: TextToVideo.get, input: { task_id: '' } },
	{ name: 'textToVideo.list', op: TextToVideo.list, input: { limit: 0 } },
	{
		name: 'imageToVideo.create',
		op: ImageToVideo.create,
		input: { model: 'kling-2.6', contents: [] },
	},
	{ name: 'imageToVideo.get', op: ImageToVideo.get, input: { task_id: '' } },
	{ name: 'imageToVideo.list', op: ImageToVideo.list, input: { limit: 0 } },
	{
		name: 'omniVideo.create',
		op: OmniVideo.create,
		input: { model: 'kling-2.6', contents: [{ type: 'prompt' }] },
	},
	{ name: 'omniVideo.get', op: OmniVideo.get, input: { task_id: '' } },
	{ name: 'omniVideo.list', op: OmniVideo.list, input: { limit: 0 } },
	{
		name: 'motionControl.create',
		op: MotionControl.create,
		input: {
			model: 'kling-2.6',
			contents: [{ type: 'image' }],
			settings: {},
		},
	},
	{ name: 'motionControl.get', op: MotionControl.get, input: { task_id: '' } },
	{ name: 'motionControl.list', op: MotionControl.list, input: { limit: 0 } },
	{
		name: 'imageGeneration.create',
		op: ImageGeneration.create,
		input: { prompt: '' },
	},
	{
		name: 'imageGeneration.get',
		op: ImageGeneration.get,
		input: { task_id: '' },
	},
	{
		name: 'imageGeneration.list',
		op: ImageGeneration.list,
		input: { pageNum: 0 },
	},
	{
		name: 'multiImageToImage.create',
		op: MultiImageToImage.create,
		input: { subject_image_list: [] },
	},
	{
		name: 'multiImageToImage.get',
		op: MultiImageToImage.get,
		input: { task_id: '' },
	},
	{
		name: 'multiImageToImage.list',
		op: MultiImageToImage.list,
		input: { pageNum: 0 },
	},
	{ name: 'omniImage.create', op: OmniImage.create, input: {} },
	{ name: 'omniImage.get', op: OmniImage.get, input: { task_id: '' } },
	{ name: 'omniImage.list', op: OmniImage.list, input: { pageNum: 0 } },
	{
		name: 'outpainting.create',
		op: Outpainting.create,
		input: { image: 'https://cdn.invalid/i.png' },
	},
	{ name: 'outpainting.get', op: Outpainting.get, input: { task_id: '' } },
	{ name: 'outpainting.list', op: Outpainting.list, input: { pageNum: 0 } },
	{ name: 'lipSync.detectFace', op: LipSync.detectFace, input: {} },
	{
		name: 'lipSync.create',
		op: LipSync.create,
		input: { session_id: 'session-1', face_choose: [] },
	},
	{ name: 'lipSync.get', op: LipSync.get, input: { task_id: '' } },
	{ name: 'lipSync.list', op: LipSync.list, input: { pageNum: 0 } },
	{
		name: 'videoEffects.create',
		op: VideoEffects.create,
		input: { effect_scene: 'net_the_fish', input: {} },
	},
	{ name: 'videoEffects.get', op: VideoEffects.get, input: { task_id: '' } },
	{ name: 'videoEffects.list', op: VideoEffects.list, input: { pageNum: 0 } },
	{
		name: 'virtualTryOn.create',
		op: VirtualTryOn.create,
		input: { contents: [] },
	},
	{ name: 'virtualTryOn.get', op: VirtualTryOn.get, input: { task_id: '' } },
	{ name: 'virtualTryOn.list', op: VirtualTryOn.list, input: { limit: 9999 } },
];

describe('Kling endpoints', () => {
	it.each(happyRows)(
		'$name sends the request and logs completion',
		async (row) => {
			mockedRequest.mockResolvedValue(row.response);

			const result = await row.op(ctx, row.input);

			expect(result).toEqual(row.response);
			expect(mockedRequest).toHaveBeenCalledWith(
				row.path,
				'test-api-key',
				row.options,
			);
			expect(mockedLogEvent).toHaveBeenCalledWith(
				ctx,
				row.event,
				row.logPayload,
				'completed',
			);
		},
	);

	it.each(invalidRows)(
		'$name rejects invalid input before calling the API',
		async (row) => {
			await expect(row.op(ctx, row.input)).rejects.toThrow();

			expect(mockedRequest).not.toHaveBeenCalled();
			expect(mockedLogEvent).not.toHaveBeenCalled();
		},
	);

	it('covers every implemented endpoint in both tables', () => {
		expect(happyRows).toHaveLength(34);
		expect(invalidRows).toHaveLength(34);
	});
});

describe('kling plugin shape', () => {
	it('exposes every endpoint group and operation', () => {
		const plugin = kling({});

		expect(plugin.endpoints?.textToVideo.create).toBeDefined();
		expect(plugin.endpoints?.imageToVideo.create).toBeDefined();
		expect(plugin.endpoints?.omniVideo.create).toBeDefined();
		expect(plugin.endpoints?.motionControl.create).toBeDefined();
		expect(plugin.endpoints?.imageGeneration.create).toBeDefined();
		expect(plugin.endpoints?.multiImageToImage.create).toBeDefined();
		expect(plugin.endpoints?.omniImage.create).toBeDefined();
		expect(plugin.endpoints?.outpainting.create).toBeDefined();
		expect(plugin.endpoints?.lipSync.detectFace).toBeDefined();
		expect(plugin.endpoints?.lipSync.create).toBeDefined();
		expect(plugin.endpoints?.videoEffects.create).toBeDefined();
		expect(plugin.endpoints?.virtualTryOn.create).toBeDefined();
	});

	it('uses api_key auth and declares no webhooks', () => {
		const plugin = kling({ authType: 'api_key' });

		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.authConfig).toEqual({ api_key: {} });
		expect(plugin.webhooks).toEqual({});
	});

	it('wires zod input and output schemas for every endpoint', () => {
		const entries = Object.entries(klingEndpointSchemas);

		expect(entries).toHaveLength(34);
		for (const [, schema] of entries) {
			expect(schema.input).toBeDefined();
			expect(schema.output).toBeDefined();
		}
	});
});
