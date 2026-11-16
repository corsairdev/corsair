import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import {
	HELPWISE_API_BASE,
	HELPWISE_APP_BASE,
	makeHelpwiseRequest,
	splitKeyAndSecret,
} from './client';

jest.mock('corsair/http', () => {
	// `unknown` because jest.requireActual returns untyped module record that is cast to module type.
	const actual = jest.requireActual<Record<string, unknown>>('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = jest.mocked(request);

function makeApiError(status: number, message: string, retryAfter?: number) {
	return new ApiError(
		{ method: 'GET', url: '/conversations' },
		{
			url: 'https://apis.helpwise.io/conversations',
			ok: false,
			status,
			statusText: message,
			body: {},
		},
		message,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

beforeEach(() => {
	mockRequest.mockReset();
});

describe('splitKeyAndSecret', () => {
	it('parses valid colon-separated apiKey:apiSecret', () => {
		const parsed = splitKeyAndSecret('my_key_123:my_secret_456');
		expect(parsed).toEqual({
			apiKey: 'my_key_123',
			apiSecret: 'my_secret_456',
		});
	});

	it('parses JSON format credentials', () => {
		const json = JSON.stringify({
			apiKey: 'json_key_1',
			apiSecret: 'json_sec_2',
		});
		const parsed = splitKeyAndSecret(json);
		expect(parsed).toEqual({
			apiKey: 'json_key_1',
			apiSecret: 'json_sec_2',
		});
	});

	it('returns null for missing colon, empty halves, or invalid JSON', () => {
		expect(splitKeyAndSecret('')).toBeNull();
		expect(splitKeyAndSecret('nokey')).toBeNull();
		expect(splitKeyAndSecret(':secret')).toBeNull();
		expect(splitKeyAndSecret('key:')).toBeNull();
		expect(splitKeyAndSecret('{"apiKey":""}')).toBeNull();
	});
});

describe('makeHelpwiseRequest', () => {
	it('configures USERNAME and PASSWORD for Basic auth on default base URL', async () => {
		mockRequest.mockResolvedValue({ status: 'success' });

		await makeHelpwiseRequest('/conversations', 'my_key:my_secret', {
			method: 'GET',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		const call = mockRequest.mock.calls[0];
		if (call === undefined) throw new Error('Expected request to be called');
		const [config, reqOpts] = call;
		expect(config).toMatchObject({
			BASE: HELPWISE_API_BASE,
			USERNAME: 'my_key',
			PASSWORD: 'my_secret',
			HEADERS: {
				'Content-Type': 'application/json',
			},
		});
		expect(reqOpts).toMatchObject({
			method: 'GET',
			url: '/conversations',
		});
	});

	it('uses overridden baseUrl for V0 app endpoints', async () => {
		mockRequest.mockResolvedValue({ status: 'success' });

		await makeHelpwiseRequest('/dev-apis/users/me', 'my_key:my_secret', {
			method: 'POST',
			baseUrl: HELPWISE_APP_BASE,
			body: {},
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		const call = mockRequest.mock.calls[0];
		if (call === undefined) throw new Error('Expected request to be called');
		const [config, reqOpts] = call;
		expect(config.BASE).toBe(HELPWISE_APP_BASE);
		expect(reqOpts).toMatchObject({
			method: 'POST',
			url: '/dev-apis/users/me',
		});
		// Live: dev-apis answer 401 to Basic auth and accept `key:secret`.
		expect(config.HEADERS).toMatchObject({ Authorization: 'my_key:my_secret' });
		expect(config.USERNAME).toBeUndefined();
		expect(config.PASSWORD).toBeUndefined();
	});

	it('sends repeated inboxIds[] parameters for a multi-inbox list', async () => {
		const fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(JSON.stringify({ threads: [], nextPageToken: '' }), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			}),
		);
		const actualHttp =
			jest.requireActual<typeof import('corsair/http')>('corsair/http');
		mockRequest.mockImplementation(actualHttp.request);
		try {
			await makeHelpwiseRequest('/conversations', 'k:s', {
				query: { 'inboxIds[]': [1, 2] },
			});
			const url = String(fetchMock.mock.calls[0]?.[0]);
			expect(url).toContain('inboxIds%5B%5D=1&inboxIds%5B%5D=2');
		} finally {
			fetchMock.mockRestore();
		}
	});

	it('throws AuthMissingError when key is empty string without issuing request', async () => {
		await expect(
			makeHelpwiseRequest('/conversations', '', { method: 'GET' }),
		).rejects.toThrow(AuthMissingError);

		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('throws AuthMissingError when key format is invalid without colon or secret', async () => {
		await expect(
			makeHelpwiseRequest('/conversations', 'invalid_single_string', {
				method: 'GET',
			}),
		).rejects.toThrow(AuthMissingError);

		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('rethrows ApiError intact', async () => {
		const rateLimited = makeApiError(429, 'Too Many Requests', 2000);
		mockRequest.mockRejectedValue(rateLimited);

		// `unknown` because caught rejection value lacks static type.
		const error: unknown = await makeHelpwiseRequest(
			'/conversations',
			'k:s',
		).catch((caught: unknown) => caught);
		if (!(error instanceof ApiError)) {
			throw new Error('Expected the rate-limit ApiError to propagate');
		}
		expect(error).toBe(rateLimited);
		expect(error.status).toBe(429);
		expect(error.retryAfter).toBe(2000);
	});
});

describe('real transport execution', () => {
	const originalFetch = global.fetch;

	afterEach(() => {
		global.fetch = originalFetch;
	});

	it('executes real transport request honoring Basic auth headers and 429 response', async () => {
		// `unknown` because actual import returns untyped module that needs request signature.
		const { request: realRequest } = jest.requireActual<{
			request: typeof request;
		}>('corsair/http');

		let capturedAuthHeader: string | undefined;

		global.fetch = jest.fn(
			async (_url: Parameters<typeof fetch>[0], init?: RequestInit) => {
				const headers = new Headers(init?.headers);
				capturedAuthHeader = headers.get('authorization') ?? undefined;
				return new Response(JSON.stringify({ status: 'rate_limited' }), {
					status: 429,
					statusText: 'Too Many Requests',
					headers: {
						'Content-Type': 'application/json',
						'retry-after': '3',
					},
				});
			},
		);

		const config: OpenAPIConfig = {
			BASE: HELPWISE_API_BASE,
			VERSION: '1.0.0',
			WITH_CREDENTIALS: false,
			CREDENTIALS: 'omit',
			USERNAME: 'test_key',
			PASSWORD: 'test_secret',
			HEADERS: { 'Content-Type': 'application/json' },
		};

		const options: ApiRequestOptions = {
			method: 'GET',
			url: '/conversations',
		};

		// `unknown` because caught rejection value lacks static type.
		const thrown: unknown = await realRequest(config, options, {
			rateLimitConfig: {
				enabled: true,
				maxRetries: 0,
				initialRetryDelay: 0,
				backoffMultiplier: 1,
				headerNames: { retryAfter: 'retry-after' },
			},
		}).catch((e: unknown) => e);

		if (!(thrown instanceof ApiError)) {
			throw new Error('Expected a rate-limit ApiError from the transport');
		}
		expect(thrown.status).toBe(429);
		expect(thrown.retryAfter).toBe(3000);
		expect(capturedAuthHeader).toBe(
			`Basic ${Buffer.from('test_key:test_secret').toString('base64')}`,
		);
	});
});
