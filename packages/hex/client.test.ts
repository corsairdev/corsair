import { AuthMissingError } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import {
	compactQuery,
	HEX_API_BASE,
	HEX_NO_TRANSPORT_RETRIES,
	makeHexRequest,
} from './client';
import { errorHandlers } from './error-handlers';
import { hex } from './index';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockedRequest = jest.mocked(request);

function apiError(status: number, message: string, retryAfter?: number) {
	return new ApiError(
		{ method: 'GET', url: '/v1/users/me' },
		{
			url: `${HEX_API_BASE}/v1/users/me`,
			ok: false,
			status,
			statusText: message,
			body: { message, status },
		},
		message,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

beforeEach(() => {
	mockedRequest.mockReset();
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('makeHexRequest', () => {
	it('uses the Hex base URL and Authorization: Bearer header', async () => {
		mockedRequest.mockResolvedValue({ id: 'user-1' });

		await makeHexRequest('/v1/users/me', 'test-api-key', {
			method: 'GET',
		});

		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest.mock.calls[0]?.[0]).toMatchObject({
			BASE: HEX_API_BASE,
			VERSION: '1.0.0',
			HEADERS: {
				Authorization: 'Bearer test-api-key',
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		});
		expect(mockedRequest.mock.calls[0]?.[0]).not.toHaveProperty('TOKEN');
		expect(mockedRequest.mock.calls[0]?.[1]).toEqual(
			expect.objectContaining({ method: 'GET', url: '/v1/users/me' }),
		);
		expect(mockedRequest.mock.calls[0]?.[2]).toMatchObject({
			rateLimitConfig: HEX_NO_TRANSPORT_RETRIES,
		});
	});

	it('sends a body on POST, PUT, and PATCH, and passes query parameters', async () => {
		mockedRequest.mockResolvedValue({ id: 'proj-1' });

		await makeHexRequest('/v1/projects', 'test-api-key', {
			method: 'POST',
			body: { name: 'Test Project' },
			query: { limit: 10 },
		});

		expect(mockedRequest.mock.calls[0]?.[1]).toEqual(
			expect.objectContaining({
				method: 'POST',
				url: '/v1/projects',
				body: { name: 'Test Project' },
				query: { limit: 10 },
			}),
		);
	});

	it('compactQuery drops undefined and null query values', () => {
		expect(
			compactQuery({
				projectId: 'proj-1',
				cursor: undefined,
				before: null,
				limit: 20,
			}),
		).toEqual({
			projectId: 'proj-1',
			limit: 20,
		});
		expect(compactQuery(undefined)).toBeUndefined();
		expect(compactQuery({ a: undefined, b: null })).toBeUndefined();
	});

	it('throws AuthMissingError for an empty or missing key without sending a request', async () => {
		await expect(makeHexRequest('/v1/users/me', '')).rejects.toThrow(
			AuthMissingError,
		);
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('keeps Retry-After on the ApiError from the real transport (single fetch attempt)', async () => {
		const actualRequest =
			jest.requireActual<typeof import('corsair/http')>('corsair/http').request;
		mockedRequest.mockImplementation((config, options, requestOptions) =>
			actualRequest(config, options, requestOptions),
		);
		const fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(JSON.stringify({ message: 'Too Many Requests' }), {
				status: 429,
				statusText: 'Too Many Requests',
				headers: {
					'Content-Type': 'application/json',
					'Retry-After': '4',
				},
			}),
		);

		// unknown because a rejection value has no static type; assertions below narrow it.
		const error = await makeHexRequest('/v1/projects', 'test-api-key').catch(
			// unknown because rejection reason has no static type
			(caught: unknown) => caught,
		);

		expect(error).toBeInstanceOf(ApiError);
		if (!(error instanceof ApiError)) {
			throw new Error('Expected the transport to throw ApiError');
		}
		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect(error.retryAfter).toBe(4000);
		expect(error.isRateLimitError()).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({ maxRetries: 3, headersRetryAfterMs: 4000 });
	});

	it('rethrows an ApiError intact preserving status and retryAfter', async () => {
		const rateLimited = apiError(429, 'Too Many Requests', 3000);
		mockedRequest.mockRejectedValue(rateLimited);

		await expect(makeHexRequest('/v1/users/me', 'test-api-key')).rejects.toBe(
			rateLimited,
		);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(rateLimited)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(rateLimited),
		).resolves.toEqual({ maxRetries: 3, headersRetryAfterMs: 3000 });
	});
});

// The keyBuilder tests cast partial contexts with `as never`: the keyBuilder reads only
// authType, options and keys, and a full CorsairContext would add nothing these tests check.
describe('Hex keyBuilder', () => {
	it('returns an explicitly configured key from plugin options', async () => {
		const plugin = hex({ key: 'configured-hex-key' });
		if (!plugin.keyBuilder) throw new Error('keyBuilder missing');

		const key = await plugin.keyBuilder(
			{ authType: 'api_key' } as never,
			'endpoint',
		);
		expect(key).toBe('configured-hex-key');
	});

	it('returns the stored key when available via ctx.keys', async () => {
		const plugin = hex();
		if (!plugin.keyBuilder) throw new Error('keyBuilder missing');

		const context = {
			authType: 'api_key',
			keys: { get_api_key: jest.fn().mockResolvedValue('stored-hex-key') },
		};
		const key = await plugin.keyBuilder(context as never, 'endpoint');
		expect(key).toBe('stored-hex-key');
		expect(context.keys.get_api_key).toHaveBeenCalledTimes(1);
	});

	it('throws AuthMissingError when ctx.keys is missing or returns null', async () => {
		const plugin = hex();
		if (!plugin.keyBuilder) throw new Error('keyBuilder missing');

		await expect(
			plugin.keyBuilder({ authType: 'api_key' } as never, 'endpoint'),
		).rejects.toThrow(AuthMissingError);

		const context = {
			authType: 'api_key',
			keys: { get_api_key: jest.fn().mockResolvedValue(null) },
		};
		await expect(
			plugin.keyBuilder(context as never, 'endpoint'),
		).rejects.toThrow(AuthMissingError);
	});

	it('returns an empty string when source is not endpoint', async () => {
		const plugin = hex({ key: 'configured-hex-key' });
		if (!plugin.keyBuilder) throw new Error('keyBuilder missing');

		const key = await plugin.keyBuilder(
			{ authType: 'api_key' } as never,
			'webhook',
		);
		expect(key).toBe('');
	});
});
