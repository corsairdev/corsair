import { logEventFromContext } from 'corsair/core';
import { AlibabaAPIError, normalizeBaseUrl } from './client';
import { Image, Tasks, Video } from './endpoints';
import { errorHandlers } from './error-handlers';
import type { AlibabaVideoTask } from './schema';

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn().mockResolvedValue(undefined),
	AuthMissingError: class AuthMissingError extends Error {},
}));

// unknown: tests call endpoints with a stub context, not the full plugin context.
type AnyEndpoint = (ctx: unknown, input: unknown) => Promise<unknown>;

const fetchMock = jest.fn<Promise<Response>, [string, RequestInit]>();

function respond(
	status: number,
	body: object,
	headers: Record<string, string> = {},
) {
	fetchMock.mockImplementation(
		async () =>
			new Response(JSON.stringify(body), {
				status,
				headers: { 'Content-Type': 'application/json', ...headers },
			}),
	);
}

const WORKSPACE = 'https://ws-test.ap-southeast-1.maas.aliyuncs.com';

function createContext(baseUrl?: string) {
	return {
		key: 'sk-test',
		options: { baseUrl },
		db: {
			videoTasks: {
				findByEntityId: jest.fn().mockResolvedValue(null),
				upsertByEntityId: jest.fn().mockResolvedValue(undefined),
			},
			images: { upsertByEntityId: jest.fn().mockResolvedValue(undefined) },
		},
	};
}

function lastCall() {
	const [url, init] = fetchMock.mock.calls[fetchMock.mock.calls.length - 1]!;
	return {
		url: new URL(url),
		method: init.method,
		headers: new Headers(init.headers),
		body: init.body ? JSON.parse(String(init.body)) : undefined,
	};
}

// Response shapes from the Model Studio API reference examples.
const taskCreated = {
	output: { task_status: 'PENDING', task_id: '0385dc79-5ff8-4d82-bcb6-xxxxxx' },
	request_id: '4909100c-7b5a-9f92-bfe5-xxxxxx',
};

const imageResponse = {
	output: {
		choices: [
			{
				finish_reason: 'stop',
				message: {
					role: 'assistant',
					content: [
						{
							image:
								'https://dashscope-result.oss-ap-southeast-1.aliyuncs.com/1.png?Expires=1',
						},
					],
				},
			},
		],
	},
	usage: {
		output_width: 1024,
		output_height: 1024,
		input_image_count: 0,
		input_image_type: 'qima_input_1k',
		output_image_count: 1,
		output_image_type: 'qima_output_1k',
	},
	request_id: 'f7f2a1d0-xxxx',
};

beforeAll(() => {
	// unknown: the jest mock lacks fetch's static members, so it needs a two-step cast.
	global.fetch = fetchMock as unknown as typeof fetch;
});

beforeEach(() => {
	fetchMock.mockReset();
	jest.mocked(logEventFromContext).mockClear();
});

describe('client', () => {
	it('defaults to the international domain and accepts a workspace domain with /api/v1', () => {
		expect(normalizeBaseUrl(undefined)).toBe(
			'https://dashscope-intl.aliyuncs.com',
		);
		expect(normalizeBaseUrl(`${WORKSPACE}/api/v1`)).toBe(WORKSPACE);
		expect(normalizeBaseUrl(`${WORKSPACE}/`)).toBe(WORKSPACE);
	});
});

describe('image.generate', () => {
	it('posts a single-turn message synchronously and caches the images', async () => {
		respond(200, imageResponse);
		const ctx = createContext(`${WORKSPACE}/api/v1`);

		const result = await (Image.generate as AnyEndpoint)(ctx, {
			model: 'qwen-image-3.0-pro',
			prompt: 'A watercolor fox in a snowy forest',
			parameters: { size: '1024*1024', n: 1, prompt_extend: true },
		});

		const call = lastCall();
		expect(call.method).toBe('POST');
		expect(call.url.href).toBe(
			`${WORKSPACE}/api/v1/services/aigc/multimodal-generation/generation`,
		);
		expect(call.headers.get('authorization')).toBe('Bearer sk-test');
		expect(call.headers.get('x-dashscope-async')).toBeNull();
		expect(call.body).toEqual({
			model: 'qwen-image-3.0-pro',
			input: {
				messages: [
					{
						role: 'user',
						content: [{ text: 'A watercolor fox in a snowy forest' }],
					},
				],
			},
			parameters: { size: '1024*1024', n: 1, prompt_extend: true },
		});
		expect(result).toEqual(imageResponse);
		expect(ctx.db.images.upsertByEntityId).toHaveBeenCalledWith(
			imageResponse.output.choices[0]!.message.content[0]!.image,
			expect.objectContaining({ model: 'qwen-image-3.0-pro', width: 1024 }),
		);
	});

	it('puts input images before the prompt for editing', async () => {
		respond(200, imageResponse);

		await (Image.generate as AnyEndpoint)(createContext(), {
			model: 'wan2.7-image',
			prompt: 'Put the hat from image 2 on the person in image 1',
			images: ['https://x.io/1.png', 'https://x.io/2.png'],
			parameters: { size: '2K' },
		});

		expect(lastCall().url.origin).toBe('https://dashscope-intl.aliyuncs.com');
		expect(lastCall().body.input.messages[0].content).toEqual([
			{ image: 'https://x.io/1.png' },
			{ image: 'https://x.io/2.png' },
			{ text: 'Put the hat from image 2 on the person in image 1' },
		]);
	});

	it('enforces per-model limits', async () => {
		await expect(
			(Image.generate as AnyEndpoint)(createContext(), {
				model: 'qwen-image-3.0',
				prompt: 'x',
				images: [
					'https://x.io/1.png',
					'https://x.io/2.png',
					'https://x.io/3.png',
					'https://x.io/4.png',
				],
			}),
		).rejects.toThrow('at most 3 input images');
		await expect(
			(Image.generate as AnyEndpoint)(createContext(), {
				model: 'wan2.7-image',
				prompt: 'x',
				parameters: { n: 5 },
			}),
		).rejects.toThrow('n is 1-6');
		await expect(
			(Image.generate as AnyEndpoint)(createContext(), {
				model: 'qwen-image-3.0',
				prompt: 'x',
				images: ['https://x.io/1.png'],
				parameters: { prompt_extend_mode: 'agent' },
			}),
		).rejects.toThrow('text-to-image only');
		await expect(
			(Image.generate as AnyEndpoint)(createContext(), {
				model: 'qwen-image-3.0',
				prompt: 'x',
				parameters: { size: '1024x1024' },
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('video submissions', () => {
	const cases: [string, AnyEndpoint, object][] = [
		[
			'video.textToVideo',
			Video.textToVideo as AnyEndpoint,
			{
				model: 'wan2.7-t2v',
				prompt: 'A kitten running in the moonlight',
				parameters: { resolution: '720P', ratio: '16:9', duration: 5 },
			},
		],
		[
			'video.imageToVideo',
			Video.imageToVideo as AnyEndpoint,
			{
				model: 'wan2.7-i2v',
				prompt: 'The kitten jumps',
				media: [
					{ type: 'first_frame', url: 'https://x.io/first.png' },
					{ type: 'driving_audio', url: 'https://x.io/voice.mp3' },
				],
			},
		],
		[
			'video.referenceToVideo',
			Video.referenceToVideo as AnyEndpoint,
			{
				model: 'wan2.7-r2v',
				prompt: 'Image 1 walks through the room in Image 2',
				media: [
					{
						type: 'reference_image',
						url: 'https://x.io/girl.jpg',
						reference_voice: 'https://x.io/voice.mp3',
					},
					{ type: 'reference_image', url: 'https://x.io/room.jpg' },
				],
				parameters: { duration: 8 },
			},
		],
		[
			'video.edit',
			Video.edit as AnyEndpoint,
			{
				model: 'wan2.7-videoedit',
				prompt: 'Change the jacket to red',
				media: [
					{ type: 'video', url: 'https://x.io/clip.mp4' },
					{ type: 'reference_image', url: 'https://x.io/jacket.png' },
				],
				parameters: { audio_setting: 'origin', duration: 0 },
			},
		],
	];

	it.each(cases)(
		'%s posts an async video-synthesis task',
		async (event, endpoint, input) => {
			respond(200, taskCreated);
			const ctx = createContext(WORKSPACE);

			const result = await endpoint(ctx, input);

			const call = lastCall();
			const { model, parameters, ...fields } = input as {
				model: string;
				parameters?: object;
			};
			expect(call.url.href).toBe(
				`${WORKSPACE}/api/v1/services/aigc/video-generation/video-synthesis`,
			);
			expect(call.headers.get('x-dashscope-async')).toBe('enable');
			expect(call.body).toEqual({
				model,
				input: fields,
				...(parameters ? { parameters } : {}),
			});
			expect(result).toEqual(taskCreated);
			expect(ctx.db.videoTasks.upsertByEntityId).toHaveBeenCalledWith(
				taskCreated.output.task_id,
				expect.objectContaining({ model, status: 'PENDING' }),
			);
			expect(logEventFromContext).toHaveBeenCalledWith(
				ctx,
				`alibaba.${event}`,
				{ model, taskId: taskCreated.output.task_id },
				'completed',
			);
		},
	);

	it('accepts Wan 3.0 all-in-one media and smart duration', async () => {
		respond(200, taskCreated);

		await (Video.textToVideo as AnyEndpoint)(createContext(), {
			model: 'wan3.0-video',
			prompt: 'A product ad based on the deck',
			media: [{ type: 'file', url: 'https://x.io/deck.pptx' }],
			parameters: {
				resolution: '480P',
				ratio: 'adaptive',
				duration: -1,
				prompt_extend: true,
			},
		});

		expect(lastCall().body.input.media).toEqual([
			{ type: 'file', url: 'https://x.io/deck.pptx' },
		]);
	});

	it('enforces the documented media and parameter rules', async () => {
		const reject = (endpoint: AnyEndpoint, input: object, message?: string) =>
			expect(endpoint(createContext(), input)).rejects.toThrow(message);

		await reject(
			Video.textToVideo as AnyEndpoint,
			{ model: 'wan2.7-t2v', prompt: 'x', parameters: { resolution: '480P' } },
			'wan2.7-t2v needs',
		);
		await reject(
			Video.textToVideo as AnyEndpoint,
			{ model: 'wan3.0-video', audio_url: 'https://x.io/a.mp3', prompt: 'x' },
			'reference_audio',
		);
		await reject(
			Video.textToVideo as AnyEndpoint,
			{
				model: 'wan3.0-video',
				media: [
					{ type: 'file', url: 'https://x.io/a.pdf' },
					{ type: 'link', url: 'https://x.io/page' },
				],
			},
			'one file or link',
		);
		await reject(
			Video.imageToVideo as AnyEndpoint,
			{
				model: 'wan2.7-i2v',
				media: [{ type: 'last_frame', url: 'https://x.io/l.png' }],
			},
			'media must be',
		);
		await reject(
			Video.referenceToVideo as AnyEndpoint,
			{
				model: 'wan2.7-r2v',
				prompt: 'x',
				media: [{ type: 'reference_video', url: 'https://x.io/v.mp4' }],
				parameters: { duration: 12 },
			},
			'duration is 2-10',
		);
		await reject(
			Video.referenceToVideo as AnyEndpoint,
			{
				model: 'wan2.7-r2v',
				prompt: 'x',
				media: [{ type: 'first_frame', url: 'https://x.io/f.png' }],
			},
			'1-5 reference',
		);
		await reject(
			Video.edit as AnyEndpoint,
			{
				model: 'wan2.7-videoedit',
				media: [{ type: 'reference_image', url: 'https://x.io/r.png' }],
			},
			'Exactly one video',
		);
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('tasks.get', () => {
	it('reads the task and records the video URL', async () => {
		const task = {
			request_id: 'caa62a12-xxxx',
			output: {
				task_id: taskCreated.output.task_id,
				task_status: 'SUCCEEDED',
				submit_time: '2026-10-16 17:15:20.381',
				scheduled_time: '2026-10-16 17:15:28.437',
				end_time: '2026-10-16 17:17:05.618',
				orig_prompt: 'A kitten running in the moonlight',
				video_url:
					'https://dashscope-result.oss-ap-southeast-1.aliyuncs.com/1.mp4?Expires=1',
			},
			usage: {
				duration: 5,
				input_video_duration: 0,
				output_video_duration: 5,
				video_count: 1,
				SR: 720,
				ratio: '16:9',
			},
		};
		respond(200, task);
		const ctx = createContext(WORKSPACE);

		const result = await (Tasks.get as AnyEndpoint)(ctx, {
			task_id: task.output.task_id,
		});

		const call = lastCall();
		expect(call.method).toBe('GET');
		expect(call.url.href).toBe(
			`${WORKSPACE}/api/v1/tasks/${task.output.task_id}`,
		);
		expect(call.headers.get('x-dashscope-async')).toBeNull();
		expect(result).toEqual(task);
		expect(ctx.db.videoTasks.upsertByEntityId).toHaveBeenCalledWith(
			task.output.task_id,
			expect.objectContaining({
				status: 'SUCCEEDED',
				videoUrl: task.output.video_url,
				durationSeconds: 5,
			}),
		);
	});

	it('does not move a finished task back when an older poll lands late', async () => {
		respond(200, {
			request_id: 'r7',
			output: { task_id: 't2', task_status: 'RUNNING' },
		});
		const ctx = createContext();
		ctx.db.videoTasks.findByEntityId.mockResolvedValue({
			data: {
				taskId: 't2',
				status: 'SUCCEEDED',
				videoUrl: 'https://x.io/done.mp4',
				durationSeconds: 5,
			},
		});

		await (Tasks.get as AnyEndpoint)(ctx, { task_id: 't2' });

		expect(ctx.db.videoTasks.upsertByEntityId).not.toHaveBeenCalled();
	});

	it('keeps SUCCEEDED when a slower RUNNING poll overlaps it', async () => {
		const store = new Map<string, AlibabaVideoTask>();
		// The RUNNING answer arrives first and its read is slow, so the polls overlap.
		let reads = 0;
		const db = {
			findByEntityId: jest.fn(async (id: string) => {
				const snapshot = store.get(id);
				const delay = reads++ === 0 ? 30 : 0;
				await new Promise((resolve) => setTimeout(resolve, delay));
				return snapshot ? { data: snapshot } : null;
			}),
			upsertByEntityId: jest.fn(async (id: string, data: AlibabaVideoTask) => {
				store.set(id, data);
			}),
		};
		const ctx = { ...createContext(), db: { videoTasks: db } };
		const answers = [
			{ request_id: 'a', output: { task_id: 't3', task_status: 'RUNNING' } },
			{
				request_id: 'b',
				output: {
					task_id: 't3',
					task_status: 'SUCCEEDED',
					video_url: 'https://x.io/done.mp4',
				},
			},
		];
		fetchMock.mockImplementation(
			async () =>
				new Response(JSON.stringify(answers.shift()), {
					status: 200,
					headers: { 'Content-Type': 'application/json' },
				}),
		);

		await Promise.all([
			(Tasks.get as AnyEndpoint)(ctx, { task_id: 't3' }),
			(Tasks.get as AnyEndpoint)(ctx, { task_id: 't3' }),
		]);

		expect(store.get('t3')).toMatchObject({
			status: 'SUCCEEDED',
			videoUrl: 'https://x.io/done.mp4',
		});
	});

	it('parses a failed task with its error code', async () => {
		respond(200, {
			request_id: 'r1',
			output: {
				task_id: 't1',
				task_status: 'FAILED',
				code: 'InvalidParameter',
				message: 'The size is not match the allowed size',
			},
		});

		await expect(
			(Tasks.get as AnyEndpoint)(createContext(), { task_id: 't1' }),
		).resolves.toMatchObject({
			output: { task_status: 'FAILED', code: 'InvalidParameter' },
		});
	});
});

describe('errors', () => {
	it('maps InvalidApiKey to the auth handler', async () => {
		respond(401, {
			request_id: 'r2',
			code: 'InvalidApiKey',
			message: 'Invalid API-key provided.',
		});

		const error = (await (Tasks.get as AnyEndpoint)(createContext(), {
			task_id: 't',
		}).catch((e: Error) => e)) as AlibabaAPIError;

		expect(error).toBeInstanceOf(AlibabaAPIError);
		expect(error.code).toBe('InvalidApiKey');
		expect(error.requestId).toBe('r2');
		expect(error.message).toBe('401 InvalidApiKey: Invalid API-key provided.');
		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
	});

	it('maps content moderation 400 to the validation handler', async () => {
		respond(400, {
			request_id: 'r3',
			code: 'DataInspectionFailed',
			message: 'Input data may contain inappropriate content.',
		});

		const error = (await (Image.generate as AnyEndpoint)(createContext(), {
			model: 'qwen-image-3.0',
			prompt: 'x',
		}).catch((e: Error) => e)) as AlibabaAPIError;

		expect(errorHandlers.VALIDATION_ERROR.match(error)).toBe(true);
	});

	it('hands throttling to the handler after one request', async () => {
		respond(429, {
			request_id: 'r4',
			code: 'Throttling.RateQuota',
			message: 'Requests rate limit exceeded',
		});

		const error = (await (Tasks.get as AnyEndpoint)(createContext(), {
			task_id: 't',
		}).catch((e: Error) => e)) as AlibabaAPIError;

		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect(error.code).toBe('Throttling.RateQuota');
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		expect(await errorHandlers.RATE_LIMIT_ERROR.handler(error)).toMatchObject({
			maxRetries: 3,
		});
	});

	it('does not replay 5xx on submit', async () => {
		respond(500, {
			request_id: 'r5',
			code: 'InternalError',
			message: 'Internal error',
		});

		const error = (await (Video.textToVideo as AnyEndpoint)(createContext(), {
			model: 'wan2.7-t2v',
			prompt: 'x',
		}).catch((e: Error) => e)) as AlibabaAPIError;

		expect(errorHandlers.SERVER_ERROR.match(error)).toBe(true);
		expect(await errorHandlers.SERVER_ERROR.handler()).toEqual({
			maxRetries: 0,
		});
	});

	it('fails zod validation on a malformed task', async () => {
		respond(200, {
			request_id: 'r6',
			output: { task_id: 't', task_status: 'DONE' },
		});

		const error = (await (Tasks.get as AnyEndpoint)(createContext(), {
			task_id: 't',
		}).catch((e: Error) => e)) as Error;

		expect(error.name).toBe('ZodError');
		expect(errorHandlers.VALIDATION_ERROR.match(error)).toBe(true);
	});
});
