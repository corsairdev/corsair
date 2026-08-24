import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import {
	AMCARDS_API_BASE,
	AmcardsAPIError,
	compactQuery,
	encodeAmcardsPathId,
	makeAmcardsRequest,
} from './client';
import { errorHandlers } from './error-handlers';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = request as jest.MockedFunction<typeof request>;

function lastCall(): [OpenAPIConfig, ApiRequestOptions] {
	const call = mockRequest.mock.calls.at(-1);
	if (!call) throw new Error('request() was never called');
	return call as unknown as [OpenAPIConfig, ApiRequestOptions];
}

function apiError(status: number, retryAfter?: number): ApiError {
	return new ApiError(
		{ method: 'GET', url: 'cards/' },
		{
			url: `${AMCARDS_API_BASE}/cards/`,
			ok: false,
			status,
			statusText: 'Error',
			body: { detail: 'failed' },
		},
		'AMcards request failed',
		{ retryAfter },
	);
}

beforeEach(() => {
	mockRequest.mockReset();
});

describe('makeAmcardsRequest', () => {
	it('sends Django Token auth and never a Bearer token', async () => {
		mockRequest.mockResolvedValue({ objects: [] });

		await makeAmcardsRequest('cards/', 'secret-token');

		const [config] = lastCall();
		expect(config.BASE).toBe(AMCARDS_API_BASE);
		expect(config.TOKEN).toBeUndefined();
		expect(config.HEADERS).toMatchObject({
			Authorization: 'Token secret-token',
		});
		expect(JSON.stringify(config.HEADERS)).not.toMatch(/Bearer/);
	});

	it('omits the Token header when auth is false', async () => {
		mockRequest.mockResolvedValue([]);

		await makeAmcardsRequest('gifts/', 'secret-token', { auth: false });

		const [config] = lastCall();
		expect(config.HEADERS).not.toHaveProperty('Authorization');
		expect(config.TOKEN).toBeUndefined();
	});

	it('lets public routes through with no key', async () => {
		mockRequest.mockResolvedValue([]);

		await makeAmcardsRequest('gifts/', '', { auth: false });

		expect(lastCall()[0].HEADERS).not.toHaveProperty('Authorization');
	});

	it('throws AuthMissingError when a protected route has no key', async () => {
		await expect(makeAmcardsRequest('cards/', '')).rejects.toBeInstanceOf(
			AuthMissingError,
		);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('drops undefined query keys and maps the path', async () => {
		mockRequest.mockResolvedValue({ objects: [] });

		await makeAmcardsRequest('contacts/', 'k', {
			query: compactQuery({ offset: 0, limit: 10, email: undefined }),
		});

		const [, options] = lastCall();
		expect(options.url).toBe('contacts/');
		expect(options.query).toEqual({ offset: 0, limit: 10 });
	});

	it('preserves ApiError status and retryAfter on AmcardsAPIError', async () => {
		expect.assertions(3);
		mockRequest.mockRejectedValue(apiError(429, 2000));

		try {
			await makeAmcardsRequest('cards/', 'k');
		} catch (error) {
			const wrapped = error as AmcardsAPIError;
			expect(wrapped.status).toBe(429);
			expect(wrapped.retryAfter).toBe(2000);
			expect(wrapped.cause).toBeInstanceOf(ApiError);
		}
	});
});

describe('encodeAmcardsPathId', () => {
	it('encodes reserved characters so they cannot change the path', () => {
		expect(encodeAmcardsPathId(12)).toBe('12');
		expect(encodeAmcardsPathId('a/b')).toBe('a%2Fb');
	});
});

function amcardsError(status: number, retryAfter?: number): AmcardsAPIError {
	const error = new AmcardsAPIError(`Request failed with status ${status}`);
	Object.assign(error, { status, retryAfter });
	return error;
}

function route(error: Error): string {
	const match = Object.entries(errorHandlers).find(([, entry]) =>
		entry.match(error),
	);
	if (!match) throw new Error('no handler matched');
	return match[0];
}

describe('errorHandlers', () => {
	it('routes a 429 to rate-limit and does not stack a second retry budget', async () => {
		const error = amcardsError(429, 2000);
		expect(route(error)).toBe('RATE_LIMIT_ERROR');
		expect(await errorHandlers.RATE_LIMIT_ERROR.handler()).toEqual({
			maxRetries: 0,
		});
	});

	it('treats 401 and 403 as auth failures that must not retry', async () => {
		expect(route(amcardsError(401))).toBe('AUTH_ERROR');
		expect(route(amcardsError(403))).toBe('AUTH_ERROR');
		expect(await errorHandlers.AUTH_ERROR.handler()).toEqual({
			maxRetries: 0,
		});
	});

	it('treats 404 as not-found', () => {
		expect(route(amcardsError(404))).toBe('NOT_FOUND_ERROR');
	});

	it('routes 400 and 422 to validation', () => {
		expect(route(amcardsError(400))).toBe('VALIDATION_ERROR');
		expect(route(amcardsError(422))).toBe('VALIDATION_ERROR');
	});

	it('retries 5xx with exponential backoff', async () => {
		expect(route(amcardsError(503))).toBe('SERVER_ERROR');
		expect(await errorHandlers.SERVER_ERROR.handler()).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('does not let message heuristics override a known status', () => {
		const error = amcardsError(400);
		error.message = 'rate limit exceeded somehow';
		expect(route(error)).toBe('VALIDATION_ERROR');
	});
});
