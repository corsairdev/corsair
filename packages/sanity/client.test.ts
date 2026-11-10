import { ApiError } from 'corsair/http';
import {
	authorizationHeader,
	isValidDataset,
	makeSanityRequest,
	readErrorDetail,
	SanityAPIError,
	SanityError,
} from './client';
import { errorHandlers, isRead } from './error-handlers';
import { jsonResponse, PROJECT_ID, TOKEN } from './test-fixtures';

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('makeSanityRequest', () => {
	it('calls the project host with the pinned version, no redirects and a timeout', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse({ ok: 1 }));
		await makeSanityRequest(TOKEN, { projectId: PROJECT_ID }, '/datasets', {
			query: { a: 'x', list: ['1', '2'], skip: undefined },
		});
		const [url, init] = fetchMock.mock.calls[0];
		expect(String(url)).toBe(
			`https://${PROJECT_ID}.api.sanity.io/v2025-02-19/datasets?a=x&list=1&list=2`,
		);
		expect(init.redirect).toBe('error');
		expect(init.signal).toBeInstanceOf(AbortSignal);
		expect(init.headers).toEqual({
			Accept: 'application/json',
			Authorization: `Bearer ${TOKEN}`,
		});
	});

	it('calls the global host for project-independent routes', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse([]));
		await makeSanityRequest(TOKEN, 'global', '/projects');
		expect(String(fetchMock.mock.calls[0][0])).toBe(
			'https://api.sanity.io/v2025-02-19/projects',
		);
	});

	it('keeps a path that looks like another host on the Sanity host', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse({}));
		await makeSanityRequest(
			TOKEN,
			{ projectId: PROJECT_ID },
			'//evil.example/steal',
		);
		expect(new URL(String(fetchMock.mock.calls[0][0])).origin).toBe(
			`https://${PROJECT_ID}.api.sanity.io`,
		);
	});

	it('refuses an empty token without calling Sanity', async () => {
		await expect(
			makeSanityRequest('  ', { projectId: PROJECT_ID }, '/datasets'),
		).rejects.toMatchObject({ code: 'invalid_key' });
		expect(() => authorizationHeader('two words')).toThrow(SanityError);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('reports a timeout and a network failure with the call that failed', async () => {
		const timeout = new Error('timed out');
		timeout.name = 'TimeoutError';
		fetchMock.mockRejectedValueOnce(timeout);
		const timedOut = await makeSanityRequest(
			TOKEN,
			{ projectId: PROJECT_ID },
			'/datasets',
		).catch((e) => e);
		expect(timedOut).toMatchObject({
			code: 'timeout',
			request: { method: 'GET', path: '/datasets' },
		});

		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));
		const offline = await makeSanityRequest<never>(
			TOKEN,
			{ projectId: PROJECT_ID },
			'/x',
			{
				method: 'POST',
				body: {},
			},
		).catch((e: SanityError) => e);
		expect(offline).toMatchObject({
			code: 'network',
			request: { method: 'POST' },
		});
		expect(offline.message).not.toContain(TOKEN);
	});

	it('sends the Retry-After it got back on a 429', async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse({ error: { description: 'slow down' } }, 429, {
				'retry-after': '3',
			}),
		);
		const error = await makeSanityRequest<never>(
			TOKEN,
			{ projectId: PROJECT_ID },
			'/x',
		).catch((e: SanityAPIError) => e);
		expect(error).toBeInstanceOf(SanityAPIError);
		expect(error.retryAfter).toBe(3000);
		expect(error.message).toContain('Retry after 3 s.');
	});

	it('refuses a body that cannot be JSON', async () => {
		// unknown: a circular object, to check that serialization refuses it.
		const circular: Record<string, unknown> = {};
		circular.self = circular;
		await expect(
			makeSanityRequest(TOKEN, { projectId: PROJECT_ID }, '/x', {
				method: 'POST',
				body: circular,
			}),
		).rejects.toMatchObject({ code: 'invalid_input' });
	});

	it('sends another API version when a call asks for one', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse({}));
		await makeSanityRequest(
			TOKEN,
			{ projectId: PROJECT_ID },
			'/agent/action/prompt/production',
			{
				method: 'POST',
				body: {},
				apiVersion: 'vX',
			},
		);
		expect(String(fetchMock.mock.calls[0][0])).toContain(
			'.api.sanity.io/vX/agent/',
		);
	});
});

describe('dataset names', () => {
	it("follow Sanity's rule", () => {
		for (const valid of [
			'production',
			'a',
			'blog_staging-2',
			'~addon',
			'a'.repeat(64),
		]) {
			expect(isValidDataset(valid)).toBe(true);
		}
		for (const invalid of [
			'',
			'Production',
			'staging-',
			'-staging',
			'blog.staging',
			'a'.repeat(65),
			'~',
		]) {
			expect(isValidDataset(invalid)).toBe(false);
		}
	});
});

describe('readErrorDetail', () => {
	it('reads a mutation error with its items', () => {
		expect(
			readErrorDetail({
				error: {
					description: 'transaction failed',
					type: 'mutationError',
					items: [{ error: { description: 'Insufficient permissions' } }],
				},
			}),
		).toEqual({
			text: 'transaction failed Insufficient permissions',
			type: 'mutationError',
		});
	});

	it('reads the management API shape and plain text', () => {
		expect(
			readErrorDetail({ statusCode: 400, error: 'Bad Request', message: 'no' }),
		).toEqual({ text: 'no' });
		expect(readErrorDetail({ error: 'Unauthorized' })).toEqual({
			text: 'Unauthorized',
		});
		expect(readErrorDetail('  gateway timeout ')).toEqual({
			text: 'gateway timeout',
		});
		expect(readErrorDetail(undefined)).toEqual({ text: '' });
	});
});

describe('error handlers', () => {
	const apiError = (
		status: number,
		method: 'GET' | 'POST',
		url: string,
		retryAfter?: number,
	) =>
		new SanityAPIError({
			method,
			path: url,
			status,
			statusText: '',
			body: null,
			message: '',
			retryAfterMs: retryAfter,
		});

	const pick = (error: Error) =>
		Object.entries(errorHandlers).find(([, handler]) =>
			handler.match(error),
		)?.[0];

	it('retries a refused 429 for reads and writes, with its wait', async () => {
		const write = apiError(429, 'POST', '/data/mutate/production', 2000);
		expect(pick(write)).toBe('RATE_LIMIT_ERROR');
		expect(await errorHandlers.RATE_LIMIT_ERROR.handler(write)).toMatchObject({
			maxRetries: 3,
			headersRetryAfterMs: 2000,
		});
	});

	it('does not sleep through a long Retry-After', async () => {
		const error = apiError(429, 'GET', '/datasets', 60_000);
		expect(await errorHandlers.RATE_LIMIT_ERROR.handler(error)).toEqual({
			maxRetries: 0,
		});
	});

	it('does not retry the Agent Actions budget 429', () => {
		expect(
			pick(apiError(429, 'POST', '/agent/action/generate/production')),
		).toBeUndefined();
	});

	it('retries 5xx on reads only', () => {
		expect(pick(apiError(502, 'GET', '/data/doc/production/a'))).toBe(
			'SERVER_ERROR',
		);
		expect(pick(apiError(502, 'POST', '/data/query/production'))).toBe(
			'SERVER_ERROR',
		);
		expect(
			pick(apiError(502, 'POST', '/data/mutate/production')),
		).toBeUndefined();
		expect(
			pick(apiError(502, 'POST', '/data/actions/production')),
		).toBeUndefined();
	});

	it('retries network failures and timeouts on reads only', () => {
		const read = new SanityError('x', 'network', {
			method: 'GET',
			path: '/datasets',
		});
		const write = new SanityError('x', 'network', {
			method: 'POST',
			path: '/data/mutate/p',
		});
		expect(pick(read)).toBe('NETWORK_ERROR');
		expect(pick(write)).toBeUndefined();
		expect(
			pick(
				new SanityError('x', 'timeout', {
					method: 'POST',
					path: '/data/query/p',
				}),
			),
		).toBe('TIMEOUT_ERROR');
		expect(isRead(new Error('plain'))).toBe(false);
	});

	it('never retries auth failures', async () => {
		expect(pick(apiError(401, 'GET', '/x'))).toBe('AUTH_ERROR');
		expect(pick(apiError(403, 'POST', '/x'))).toBe('AUTH_ERROR');
		expect(pick(new SanityError('x', 'missing_project'))).toBe('AUTH_ERROR');
		expect(await errorHandlers.AUTH_ERROR.handler()).toEqual({ maxRetries: 0 });
	});

	it('keeps DEFAULT from matching, so it cannot hide another handler', async () => {
		expect(errorHandlers.DEFAULT.match()).toBe(false);
		expect(await errorHandlers.DEFAULT.handler()).toEqual({ maxRetries: 0 });
		expect(apiError(400, 'GET', '/x')).toBeInstanceOf(ApiError);
	});
});
