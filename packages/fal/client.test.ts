import { ApiError } from 'corsair/http';
import {
	endpointPath,
	falErrorMessage,
	parseEndpointId,
	requestBasePath,
	waitOnStatusStream,
} from './client';
import { errorHandlers } from './error-handlers';

const REQUEST_ID = '019a1b2c-3d4e-7f80-9a1b-2c3d4e5f6a7b';

describe('parseEndpointId', () => {
	it('splits owner, app and endpoint path', () => {
		expect(
			parseEndpointId('fal-ai/kling-video/v2.1/master/text-to-video'),
		).toEqual({
			owner: 'fal-ai',
			app: 'kling-video',
			path: ['v2.1', 'master', 'text-to-video'],
		});
		expect(parseEndpointId('/fal-ai/flux/')).toEqual({
			owner: 'fal-ai',
			app: 'flux',
			path: [],
		});
	});

	it.each(['flux', 'fal-ai//flux', 'fal-ai/../x', 'fal-ai/flux?x=1', ''])(
		'rejects %p',
		(id) => {
			expect(() => parseEndpointId(id)).toThrow('not a fal endpoint id');
		},
	);

	it('builds the submit path from every segment', () => {
		expect(endpointPath('fal-ai/flux/schnell')).toBe('/fal-ai/flux/schnell');
	});
});

describe('requestBasePath', () => {
	it('uses only owner/app for an endpoint id with a path', () => {
		expect(
			requestBasePath({
				endpointId: 'fal-ai/flux/schnell',
				requestId: REQUEST_ID,
			}),
		).toEqual({
			basePath: `/fal-ai/flux/requests/${REQUEST_ID}`,
			requestId: REQUEST_ID,
		});
	});

	it.each([
		`https://queue.fal.run/fal-ai/flux/requests/${REQUEST_ID}`,
		`https://queue.fal.run/fal-ai/flux/requests/${REQUEST_ID}/status`,
		`https://queue.fal.run/fal-ai/flux/requests/${REQUEST_ID}/cancel`,
		`https://queue.falrun.com/fal-ai/flux/requests/${REQUEST_ID}`,
	])('reads %s', (responseUrl) => {
		expect(requestBasePath({ responseUrl })).toEqual({
			basePath: `/fal-ai/flux/requests/${REQUEST_ID}`,
			requestId: REQUEST_ID,
		});
	});

	it.each([
		`http://queue.fal.run/fal-ai/flux/requests/${REQUEST_ID}`,
		`https://queue.fal.run.evil.com/fal-ai/flux/requests/${REQUEST_ID}`,
		`https://api.fal.ai/fal-ai/flux/requests/${REQUEST_ID}`,
		'https://queue.fal.run/fal-ai/flux',
		'not a url',
	])('refuses %s so the key never leaves fal', (responseUrl) => {
		expect(() => requestBasePath({ responseUrl })).toThrow();
	});

	it('refuses a request id with path characters', () => {
		expect(() =>
			requestBasePath({ endpointId: 'fal-ai/flux', requestId: '../keys' }),
		).toThrow('not a fal request id');
	});

	it('needs a reference', () => {
		expect(() => requestBasePath({ requestId: REQUEST_ID })).toThrow(
			'Pass endpointId and requestId',
		);
	});
});

describe('falErrorMessage', () => {
	// unknown: error bodies are arbitrary JSON.
	const error = (status: number, body: unknown) =>
		new ApiError(
			{ method: 'GET', url: '/x' },
			{ url: 'https://fal.run/x', ok: false, status, statusText: '', body },
			'Request failed',
		);

	it('joins validation details', () => {
		expect(
			falErrorMessage(
				error(422, {
					detail: [
						{ loc: ['body', 'prompt'], msg: 'Field required' },
						{ loc: ['body', 'seed'], msg: 'Input should be an integer' },
					],
				}),
			),
		).toBe(
			'422: body.prompt: Field required; body.seed: Input should be an integer',
		);
	});

	it('reads detail strings and Platform API errors', () => {
		expect(falErrorMessage(error(500, { detail: 'Runner crashed' }))).toBe(
			'500: Runner crashed',
		);
		expect(
			falErrorMessage(
				error(403, {
					error: {
						type: 'authorization_error',
						message: 'This API key is not permitted to perform this action.',
					},
				}),
			),
		).toBe('403: This API key is not permitted to perform this action.');
	});

	it('falls back to the error message', () => {
		expect(falErrorMessage(new Error('boom'))).toBe('boom');
		expect(falErrorMessage(error(502, undefined))).toBe('502: Request failed');
	});
});

describe('error handlers', () => {
	const apiErr = (status: number, message: string) =>
		new ApiError(
			{ method: 'GET', url: '/x' },
			{ url: 'https://fal.run/x', ok: false, status, statusText: '', body: {} },
			message,
		);

	it('retries a 429 and nothing else that mentions a rate limit', () => {
		expect(
			errorHandlers.RATE_LIMIT_ERROR.match(apiErr(429, 'Too Many Requests')),
		).toBe(true);
		expect(
			errorHandlers.RATE_LIMIT_ERROR.match(
				apiErr(422, 'prompt mentions a rate limit'),
			),
		).toBe(false);
		expect(
			errorHandlers.RATE_LIMIT_ERROR.match(new Error('rate limit hit')),
		).toBe(true);
	});

	it('does not retry auth failures', () => {
		expect(errorHandlers.AUTH_ERROR.match(apiErr(401, 'Unauthorized'))).toBe(
			true,
		);
		expect(errorHandlers.AUTH_ERROR.match(apiErr(403, 'Forbidden'))).toBe(true);
		expect(errorHandlers.AUTH_ERROR.match(apiErr(500, 'Server Error'))).toBe(
			false,
		);
	});
});

describe('waitOnStatusStream', () => {
	const realFetch = global.fetch;
	const BASE = `/fal-ai/flux/requests/${REQUEST_ID}`;
	let fetchMock: jest.Mock;

	// A response whose body sends these chunks, then stays open unless `end`.
	const sse = (chunks: string[], end = true) =>
		new Response(
			new ReadableStream({
				start(controller) {
					for (const chunk of chunks) {
						controller.enqueue(new TextEncoder().encode(chunk));
					}
					if (end) controller.close();
				},
			}),
			{ status: 200, headers: { 'content-type': 'text/event-stream' } },
		);

	beforeEach(() => {
		fetchMock = jest.fn();
		global.fetch = fetchMock as unknown as typeof fetch;
	});
	afterEach(() => {
		global.fetch = realFetch;
	});

	it('ends when fal sends COMPLETED, through keep-alive comments and split chunks', async () => {
		fetchMock.mockResolvedValueOnce(
			sse(
				[
					': ping\n\n',
					'data: {"status":"IN_QUEUE","queue_position":1}\n\n',
					'data: {"status":"IN_PRO',
					'GRESS"}\n\ndata: {"status":"COMPLETED","metrics":{}}\n\n',
				],
				false,
			),
		);
		await expect(waitOnStatusStream('k', BASE, 5_000)).resolves.toBe(
			'completed',
		);
		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe(`https://queue.fal.run${BASE}/status/stream`);
		expect(new Headers(init.headers).get('authorization')).toBe('Key k');
	});

	it('answers waiting when the time runs out first', async () => {
		fetchMock.mockImplementationOnce(
			async (_url: string, init: RequestInit) =>
				new Response(
					new ReadableStream({
						start(controller) {
							controller.enqueue(
								new TextEncoder().encode('data: {"status":"IN_PROGRESS"}\n\n'),
							);
							init.signal?.addEventListener('abort', () =>
								controller.error(new Error('aborted')),
							);
						},
					}),
					{ status: 200 },
				),
		);
		await expect(waitOnStatusStream('k', BASE, 200)).resolves.toBe('waiting');
	});

	it('answers unavailable when the stream does not open or ends early', async () => {
		fetchMock.mockResolvedValueOnce(new Response('nope', { status: 405 }));
		await expect(waitOnStatusStream('k', BASE, 5_000)).resolves.toBe(
			'unavailable',
		);
		fetchMock.mockResolvedValueOnce(sse(['data: {"status":"IN_QUEUE"}\n\n']));
		await expect(waitOnStatusStream('k', BASE, 5_000)).resolves.toBe(
			'unavailable',
		);
		fetchMock.mockRejectedValueOnce(new Error('ECONNRESET'));
		await expect(waitOnStatusStream('k', BASE, 5_000)).resolves.toBe(
			'unavailable',
		);
	});

	it('gives up on a line that never ends instead of buffering it', async () => {
		fetchMock.mockResolvedValueOnce(
			sse(
				['data: {"status":"IN_QUEUE","pad":"', 'x'.repeat(1024 * 1024 + 10)],
				false,
			),
		);
		await expect(waitOnStatusStream('k', BASE, 5_000)).resolves.toBe(
			'unavailable',
		);
	});

	it('does not open a stream for a zero wait', async () => {
		await expect(waitOnStatusStream('k', BASE, 0)).resolves.toBe('waiting');
		expect(fetchMock).not.toHaveBeenCalled();
	});
});
