import { AuthMissingError } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import {
	GLEAP_API_BASE,
	GLEAP_API_BASE_US,
	makeGleapRequest,
	redactSensitiveData,
	sanitizeApiError,
} from './client';
import { errorHandlers } from './error-handlers';
import { gleap } from './index';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = jest.mocked(request);

function apiError(
	status: number,
	message: string,
	retryAfter?: number,
	// unknown because ApiError body parameter can accept any parsed JSON or string payload
	body?: unknown,
) {
	return new ApiError(
		{ method: 'POST', url: '/tickets' },
		{
			url: 'https://api.gleap.io/v3/tickets',
			ok: false,
			status,
			statusText: message,
			// unknown because ApiError body matches unknown response types
			body: body ?? {},
		},
		message,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

beforeEach(() => {
	mockRequest.mockReset();
});

describe('makeGleapRequest', () => {
	it('sends Authorization: Bearer <apiKey> and does not set TOKEN in config', async () => {
		mockRequest.mockResolvedValue({ id: 'ticket_123' });

		await makeGleapRequest('/tickets', 'test-api-key', {
			method: 'POST',
			body: { title: 'Bug report' },
			projectId: 'proj_123',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(mockRequest.mock.calls[0]?.[0]).toMatchObject({
			BASE: GLEAP_API_BASE,
			HEADERS: {
				Authorization: 'Bearer test-api-key',
				project: 'proj_123',
				'Content-Type': 'application/json',
			},
		});
		expect(mockRequest.mock.calls[0]?.[0]).not.toHaveProperty('TOKEN');
		expect(mockRequest.mock.calls[0]?.[1]).toEqual(
			expect.objectContaining({
				method: 'POST',
				url: '/tickets',
				body: { title: 'Bug report' },
			}),
		);
	});

	it('makes unauthenticated requests without Authorization header', async () => {
		mockRequest.mockResolvedValue({ status: 'ok' });

		await makeGleapRequest('/users/me', undefined, {
			method: 'GET',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(mockRequest.mock.calls[0]?.[0]).toMatchObject({
			BASE: GLEAP_API_BASE,
		});
		expect(mockRequest.mock.calls[0]?.[0]?.HEADERS).not.toHaveProperty(
			'Authorization',
		);
	});

	it('throws AuthMissingError for an empty key without sending a request', async () => {
		mockRequest.mockResolvedValue({ ok: true });

		await expect(
			makeGleapRequest('/tickets', '', { method: 'GET' }),
		).rejects.toThrow(AuthMissingError);

		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('supports regional custom baseUrl like US endpoint', async () => {
		mockRequest.mockResolvedValue({ id: 'ticket_us' });

		await makeGleapRequest('/tickets', 'us-key', {
			method: 'GET',
			baseUrl: GLEAP_API_BASE_US,
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(mockRequest.mock.calls[0]?.[0]?.BASE).toBe(GLEAP_API_BASE_US);
	});

	it('rethrows a 429 ApiError with retryAfter intact', async () => {
		const rateLimited = apiError(429, 'Too Many Requests', 3000);
		mockRequest.mockRejectedValue(rateLimited);

		// unknown because caught rejection has no static type until inspected
		const err = await makeGleapRequest('/tickets', 'test-key', {
			method: 'GET',
		}).catch((caught: unknown) => caught);

		expect(err).toBeInstanceOf(ApiError);
		expect((err as ApiError).status).toBe(429);
		expect((err as ApiError).retryAfter).toBe(3000);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(err as ApiError)).toBe(true);
		await expect(errorHandlers.RATE_LIMIT_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('redacts sensitive credentials from ApiError payloads', async () => {
		const sensitiveError = new ApiError(
			{
				method: 'POST',
				url: 'https://api.gleap.io/v3/tickets',
				body: { apiKey: 'secret-token-123', title: 'Test' },
			},
			{
				url: 'https://api.gleap.io/v3/tickets',
				ok: false,
				status: 400,
				statusText: 'Bad Request',
				body: { token: 'secret-token-123', message: 'Invalid token' },
			},
			'Failed with token secret-token-123',
		);

		mockRequest.mockRejectedValue(sensitiveError);

		// unknown because caught rejection has no static type until inspected
		const caught: unknown = await makeGleapRequest('/tickets', 'key', {
			method: 'POST',
			body: { apiKey: 'secret-token-123', title: 'Test' },
		}).catch((e: unknown) => e);

		expect(caught).toBeInstanceOf(ApiError);
		const sanitized = caught as ApiError;
		expect(sanitized.request.body).toBeUndefined();
		// unknown because response body is parsed from unknown payload
		const resBody = sanitized.body as Record<string, unknown>;
		expect(resBody.token).toBe('[REDACTED]');
	});

	it('redactSensitiveData redacts strings, arrays and nested object credentials', () => {
		expect(redactSensitiveData('Bearer my-secret-token')).toBe(
			'Bearer [REDACTED]',
		);
		const nested = {
			user: {
				name: 'Alice',
				apiKey: '12345',
				secret: 'xyz',
			},
			tokens: ['a', 'b'],
		};
		// unknown because redacted result contains dynamic payload fields
		const redacted = redactSensitiveData(nested) as {
			user: Record<string, unknown>;
			tokens: string[];
		};
		expect(redacted.user.name).toBe('Alice');
		expect(redacted.user.apiKey).toBe('[REDACTED]');
		expect(redacted.user.secret).toBe('[REDACTED]');
	});

	it('drops the request body and query, which hold customer content', async () => {
		const coreError = new ApiError(
			{
				method: 'POST',
				url: '/messages',
				body: { comment: 'Hi Alice, your refund is approved' },
				query: { email: 'alice@example.com' },
			},
			{
				url: 'https://api.gleap.io/v3/messages',
				ok: false,
				status: 400,
				statusText: 'Bad Request',
				body: { message: 'Invalid ticket' },
			},
			'Bad Request',
		);
		mockRequest.mockRejectedValue(coreError);
		// unknown because caught rejection has no static type until inspected
		const caught: unknown = await makeGleapRequest('/messages', 'key', {
			method: 'POST',
			body: { comment: 'Hi Alice, your refund is approved' },
		}).catch((e: unknown) => e);
		expect(caught).toBe(coreError);
		expect(JSON.stringify(caught)).not.toContain('refund');
		expect(JSON.stringify(caught)).not.toContain('alice@example.com');
		expect((caught as ApiError).status).toBe(400);
	});

	it('sanitizeApiError passes non-ApiError unchanged', () => {
		const regularError = new Error('Regular network error');
		expect(sanitizeApiError(regularError)).toBe(regularError);
	});
});

describe('real-transport rate-limit Retry-After integration', () => {
	it('preserves Retry-After header with single-owner maxRetries: 0', async () => {
		const actualHttp = jest.requireActual('corsair/http');
		const originalFetch = global.fetch;

		const mockFetch = jest.fn().mockResolvedValue({
			ok: false,
			status: 429,
			statusText: 'Too Many Requests',
			headers: new Headers({
				'content-type': 'application/json',
				'retry-after': '4',
			}),
			text: async () => JSON.stringify({ message: 'Rate limit reached' }),
			json: async () => ({ message: 'Rate limit reached' }),
		});

		global.fetch = mockFetch;

		try {
			// unknown because rejection value has no static type until asserted
			const result: unknown = await actualHttp
				.request(
					{
						BASE: 'https://api.gleap.io/v3',
						VERSION: '3.0.0',
						WITH_CREDENTIALS: false,
						CREDENTIALS: 'omit',
						HEADERS: { 'Content-Type': 'application/json' },
					},
					{
						method: 'GET',
						url: '/tickets',
					},
				)
				.catch((err: unknown) => err);

			expect(result).toBeInstanceOf(ApiError);
			const apiErr = result as ApiError;
			expect(apiErr.status).toBe(429);
			// 4 seconds parsed to 4000ms
			expect(apiErr.retryAfter).toBe(4000);
			// Confirms the single-owner rate limit error handler returns maxRetries: 0
			await expect(errorHandlers.RATE_LIMIT_ERROR.handler()).resolves.toEqual({
				maxRetries: 0,
			});
		} finally {
			global.fetch = originalFetch;
		}
	});
});

describe('gleap keyBuilder', () => {
	function keyCtx(apiKey: string | null, projectId: string | null) {
		// The keyBuilder only reads authType and these three key getters. The full
		// KeyBuilderContext also carries core's database-backed key managers and
		// setters, which a unit test can't build, so the stub goes through
		// `unknown` to the keyBuilder's parameter type.
		return {
			authType: 'api_key',
			keys: {
				get_api_key: () => Promise.resolve(apiKey),
				get_project_id: () => Promise.resolve(projectId),
				get_region: () => Promise.resolve(null),
			},
		} as unknown as Parameters<
			NonNullable<ReturnType<typeof gleap>['keyBuilder']>
		>[0];
	}

	it('returns the stored key when the account has a project id', async () => {
		const plugin = gleap();
		await expect(
			plugin.keyBuilder?.(keyCtx('k_1', 'proj_1') as never, 'endpoint'),
		).resolves.toBe('k_1');
	});

	it('asks for a connection when the project id is missing', async () => {
		const plugin = gleap();
		await expect(
			plugin.keyBuilder?.(keyCtx('k_1', null) as never, 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('accepts a project id set in code instead of the account', async () => {
		const plugin = gleap({ projectId: 'proj_1' });
		await expect(
			plugin.keyBuilder?.(keyCtx('k_1', null) as never, 'endpoint'),
		).resolves.toBe('k_1');
	});
});
