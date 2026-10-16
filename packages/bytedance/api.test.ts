import { logEventFromContext } from 'corsair/core';
import { BytedanceAPIError } from './client';
import { Video } from './endpoints';
import { errorHandlers } from './error-handlers';

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn().mockResolvedValue(undefined),
	AuthMissingError: class AuthMissingError extends Error {},
}));

// unknown: tests call endpoints with a stub context, not the full plugin context.
type AnyEndpoint = (ctx: unknown, input: unknown) => Promise<unknown>;

const fetchMock = jest.fn<Promise<Response>, [string, RequestInit]>();

function respond(
	status: number,
	body?: object,
	headers: Record<string, string> = {},
) {
	fetchMock.mockImplementation(
		async () =>
			new Response(body === undefined ? null : JSON.stringify(body), {
				status,
				headers:
					body === undefined
						? headers
						: { 'Content-Type': 'application/json', ...headers },
			}),
	);
}

function createContext(options: { baseUrl?: string } = {}) {
	return {
		key: 'ark-key',
		options,
		db: {
			videoTasks: {
				findByEntityId: jest.fn().mockResolvedValue(null),
				upsertByEntityId: jest.fn().mockResolvedValue(undefined),
				deleteByEntityId: jest.fn().mockResolvedValue(true),
			},
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

const TASKS = '/api/v3/contents/generations/tasks';

// Field set from https://docs.byteplus.com/en/docs/ModelArk/1521309
const succeededTask = {
	id: 'cgt-20261016123456-abcde',
	model: 'dreamina-seedance-2-0-mini-260615',
	status: 'succeeded',
	content: {
		video_url:
			'https://ark-content-generation.tos-ap-southeast-1.bytepluses.com/video.mp4',
	},
	error: null,
	created_at: 1792166706,
	updated_at: 1792166766,
	seed: 10423,
	resolution: '480p',
	ratio: '16:9',
	duration: 4,
	framespersecond: 24,
	generate_audio: false,
	service_tier: 'default',
	execution_expires_after: 172800,
	priority: 0,
	usage: { completion_tokens: 40800, total_tokens: 40800 },
};

const textToVideo = {
	model: 'dreamina-seedance-2-0-mini-260615',
	content: [
		{ type: 'text', text: 'A paper boat floating on a calm pond at sunrise' },
	],
	resolution: '480p',
	duration: 4,
	generate_audio: false,
};

beforeAll(() => {
	global.fetch = fetchMock as unknown as typeof fetch;
});

beforeEach(() => {
	fetchMock.mockReset();
	jest.mocked(logEventFromContext).mockClear();
});

describe('video.create', () => {
	it('posts the task with bearer auth and caches it as queued', async () => {
		respond(200, { id: 'cgt-20261016123456-abcde' });
		const ctx = createContext();

		const result = await (Video.create as AnyEndpoint)(ctx, textToVideo);

		const call = lastCall();
		expect(call.method).toBe('POST');
		expect(call.url.href).toBe(
			`https://ark.ap-southeast.bytepluses.com${TASKS}`,
		);
		expect(call.headers.get('authorization')).toBe('Bearer ark-key');
		expect(call.body).toEqual(textToVideo);
		expect(result).toEqual({ id: 'cgt-20261016123456-abcde' });
		expect(ctx.db.videoTasks.upsertByEntityId).toHaveBeenCalledWith(
			'cgt-20261016123456-abcde',
			expect.objectContaining({ status: 'queued', model: textToVideo.model }),
		);
		expect(logEventFromContext).toHaveBeenCalledWith(
			ctx,
			'bytedance.video.create',
			{ taskId: 'cgt-20261016123456-abcde', model: textToVideo.model },
			'completed',
		);
	});

	it('uses the baseUrl option for other regions', async () => {
		respond(200, { id: 't1' });

		await (Video.create as AnyEndpoint)(
			createContext({ baseUrl: 'https://ark.eu-west.bytepluses.com' }),
			textToVideo,
		);

		expect(lastCall().url.origin).toBe('https://ark.eu-west.bytepluses.com');
	});

	it('accepts first and last frames, reference media, and asset ids', async () => {
		respond(200, { id: 't2' });
		const input = {
			model: 'dreamina-seedance-2-5-260628',
			content: [
				{ type: 'text', text: '@Image1 walks toward the camera' },
				{
					type: 'image_url',
					image_url: { url: 'https://example.com/a.png' },
					role: 'first_frame',
				},
				{
					type: 'image_url',
					image_url: { url: 'https://example.com/b.png' },
					role: 'last_frame',
				},
			],
			ratio: 'adaptive',
			duration: -1,
		};

		await (Video.create as AnyEndpoint)(createContext(), input);
		expect(lastCall().body).toEqual(input);

		await (Video.create as AnyEndpoint)(createContext(), {
			model: 'dreamina-seedance-2-5-260628',
			content: [
				{
					type: 'image_url',
					image_url: { url: 'asset://char-123' },
					role: 'reference_image',
				},
				{
					type: 'video_url',
					video_url: { url: 'https://example.com/clip.mp4' },
					role: 'reference_video',
				},
				{
					type: 'audio_url',
					audio_url: { url: 'data:audio/wav;base64,UklGRg==' },
					role: 'reference_audio',
				},
			],
			omni_reference_task_type: 'reference',
		});
		expect(lastCall().body.omni_reference_task_type).toBe('reference');
	});

	it('enforces the documented content and parameter rules', async () => {
		const reject = (input: object, message?: string) =>
			expect(
				(Video.create as AnyEndpoint)(createContext(), {
					model: 'm',
					...input,
				}),
			).rejects.toThrow(message);

		await reject(
			{
				content: [
					{
						type: 'image_url',
						image_url: { url: 'https://x.io/b.png' },
						role: 'last_frame',
					},
				],
			},
			'A last_frame image needs a first_frame image',
		);
		await reject(
			{
				content: [
					{
						type: 'image_url',
						image_url: { url: 'https://x.io/a.png' },
						role: 'first_frame',
					},
					{
						type: 'image_url',
						image_url: { url: 'https://x.io/b.png' },
						role: 'first_frame',
					},
				],
			},
			'At most one first_frame image',
		);
		await reject(
			{ content: [{ type: 'text', text: 'x' }], frames: 30 },
			'frames must be 25 + 4n',
		);
		await reject(
			{
				content: [{ type: 'text', text: 'x' }],
				service_tier: 'flex',
				priority: 5,
			},
			'priority is not supported',
		);
		await reject(
			{
				content: [{ type: 'text', text: 'x' }],
				draft: true,
				resolution: '720p',
			},
			'Draft videos are 480p only',
		);
		await reject({
			content: [{ type: 'text', text: 'x' }],
			execution_expires_after: 60,
		});
		await reject({
			content: [{ type: 'image_url', image_url: { url: 'ftp://x/y.png' } }],
		});
		await reject({ content: [] });
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('tasks', () => {
	it('get reads the task and caches its result', async () => {
		respond(200, succeededTask);
		const ctx = createContext();

		const task = await (Video.get as AnyEndpoint)(ctx, {
			id: succeededTask.id,
		});

		const call = lastCall();
		expect(call.method).toBe('GET');
		expect(call.url.pathname).toBe(`${TASKS}/${succeededTask.id}`);
		expect(task).toEqual(succeededTask);
		expect(ctx.db.videoTasks.upsertByEntityId).toHaveBeenCalledWith(
			succeededTask.id,
			expect.objectContaining({
				status: 'succeeded',
				videoUrl: succeededTask.content.video_url,
				totalTokens: 40800,
				createdAt: new Date(1792166706 * 1000),
			}),
		);
	});

	it('get parses a failed task with its error', async () => {
		respond(200, {
			id: 't3',
			model: 'dreamina-seedance-2-5-260628',
			status: 'failed',
			error: {
				code: 'InputImageSensitiveContentDetected.PrivacyInformation',
				message:
					'The request failed because the input image may contain real person.',
			},
			created_at: 1792166706,
			updated_at: 1792166710,
		});

		await expect(
			(Video.get as AnyEndpoint)(createContext(), { id: 't3' }),
		).resolves.toMatchObject({
			status: 'failed',
			error: { code: expect.any(String) },
		});
	});

	it('list pages with page_num/page_size and filter.* query parameters', async () => {
		respond(200, { items: [succeededTask], total: 1 });
		const ctx = createContext();

		const result = await (Video.list as AnyEndpoint)(ctx, {
			page_num: 2,
			page_size: 10,
			status: 'succeeded',
			task_ids: ['a', 'b'],
			model: 'dreamina-seedance-2-0-mini-260615',
		});

		const { url } = lastCall();
		expect(url.pathname).toBe(TASKS);
		expect(url.searchParams.get('page_num')).toBe('2');
		expect(url.searchParams.get('page_size')).toBe('10');
		expect(url.searchParams.get('filter.status')).toBe('succeeded');
		expect(url.searchParams.getAll('filter.task_ids')).toEqual(['a', 'b']);
		expect(url.searchParams.get('filter.model')).toBe(
			'dreamina-seedance-2-0-mini-260615',
		);
		expect(result).toEqual({ items: [succeededTask], total: 1 });
		expect(ctx.db.videoTasks.upsertByEntityId).toHaveBeenCalledTimes(1);
	});

	it('list caps page_size at 500', async () => {
		await expect(
			(Video.list as AnyEndpoint)(createContext(), { page_size: 501 }),
		).rejects.toThrow();
	});

	it('delete cancels a queued task in the cache', async () => {
		respond(200);
		const ctx = createContext();
		ctx.db.videoTasks.findByEntityId.mockResolvedValue({
			data: { id: 't4', status: 'queued', updatedAt: new Date() },
		});

		await expect(
			(Video.remove as AnyEndpoint)(ctx, { id: 't4' }),
		).resolves.toEqual({});

		expect(lastCall().method).toBe('DELETE');
		expect(lastCall().url.pathname).toBe(`${TASKS}/t4`);
		expect(ctx.db.videoTasks.upsertByEntityId).toHaveBeenCalledWith(
			't4',
			expect.objectContaining({ status: 'cancelled' }),
		);
		expect(ctx.db.videoTasks.deleteByEntityId).not.toHaveBeenCalled();
	});

	it('delete removes a finished task from the cache', async () => {
		respond(200, {});
		const ctx = createContext();
		ctx.db.videoTasks.findByEntityId.mockResolvedValue({
			data: { id: 't5', status: 'succeeded', updatedAt: new Date() },
		});

		await (Video.remove as AnyEndpoint)(ctx, { id: 't5' });

		expect(ctx.db.videoTasks.deleteByEntityId).toHaveBeenCalledWith('t5');
	});
});

describe('errors', () => {
	it('maps ModelNotOpen to the not-found handler', async () => {
		respond(404, {
			error: {
				code: 'ModelNotOpen',
				message:
					'Your account has not activated the model dreamina-seedance-2-0-mini-260615.',
			},
		});

		const error = (await (Video.create as AnyEndpoint)(
			createContext(),
			textToVideo,
		).catch((e: Error) => e)) as BytedanceAPIError;

		expect(error).toBeInstanceOf(BytedanceAPIError);
		expect(error.code).toBe('ModelNotOpen');
		expect(error.message).toBe(
			'404 ModelNotOpen: Your account has not activated the model dreamina-seedance-2-0-mini-260615.',
		);
		expect(errorHandlers.NOT_FOUND_ERROR.match(error)).toBe(true);
	});

	it('maps 401 to the auth handler', async () => {
		respond(401, {
			error: {
				code: 'AuthenticationError',
				message: 'The API key is invalid.',
			},
		});

		const error = (await (Video.list as AnyEndpoint)(createContext(), {}).catch(
			(e: Error) => e,
		)) as BytedanceAPIError;

		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
	});

	it('retries rate limits with Retry-After', async () => {
		respond(
			429,
			{
				error: {
					code: 'RateLimitExceeded.EndpointRPMExceeded',
					message: 'RPM exceeded',
				},
			},
			{ 'Retry-After': '2' },
		);
		jest.useFakeTimers({ advanceTimers: true });

		const pending = (Video.list as AnyEndpoint)(createContext(), {}).catch(
			(e: Error) => e,
		);
		await jest.runAllTimersAsync();
		const error = (await pending) as BytedanceAPIError;
		jest.useRealTimers();

		expect(error.retryAfter).toBe(2000);
		expect(errorHandlers.QUOTA_ERROR.match(error)).toBe(false);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		expect(await errorHandlers.RATE_LIMIT_ERROR.handler(error)).toMatchObject({
			maxRetries: 3,
			headersRetryAfterMs: 2000,
		});
	});

	it('does not retry quota exhaustion', async () => {
		const quota = new BytedanceAPIError('429 QuotaExceeded');
		Object.assign(quota, { status: 429, code: 'QuotaExceeded' });

		expect(errorHandlers.QUOTA_ERROR.match(quota)).toBe(true);
		expect(await errorHandlers.QUOTA_ERROR.handler()).toEqual({
			maxRetries: 0,
		});
	});

	it('does not replay 5xx on create', async () => {
		respond(500, {
			error: { code: 'InternalServiceError', message: 'Retry later.' },
		});

		const error = (await (Video.create as AnyEndpoint)(
			createContext(),
			textToVideo,
		).catch((e: Error) => e)) as BytedanceAPIError;

		expect(errorHandlers.SERVER_ERROR.match(error)).toBe(true);
		expect(await errorHandlers.SERVER_ERROR.handler()).toEqual({
			maxRetries: 0,
		});
	});

	it('fails zod validation on a malformed task', async () => {
		respond(200, { id: 't6', status: 'exploded' });

		const error = (await (Video.get as AnyEndpoint)(createContext(), {
			id: 't6',
		}).catch((e: Error) => e)) as Error;

		expect(error.name).toBe('ZodError');
		expect(errorHandlers.VALIDATION_ERROR.match(error)).toBe(true);
	});
});
