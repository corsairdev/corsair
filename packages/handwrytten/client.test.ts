import { AuthMissingError } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import {
	HANDWRYTTEN_API_BASE,
	HandwryttenAPIError,
	makeHandwryttenRequest,
} from './client';
import { errorHandlers } from './error-handlers';
import { handwrytten } from './index';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = jest.mocked(request);

function apiError(
	status: number,
	message: string,
	retryAfter?: number,
	requestBody?: unknown,
) {
	return new ApiError(
		{
			method: 'POST',
			url: '/orders/singleStepOrder',
			// `unknown` because request body can be any JSON structure.
			body: requestBody as Record<string, unknown>,
		},
		{
			url: 'https://api.handwrytten.com/v1/orders/singleStepOrder',
			ok: false,
			status,
			statusText: message,
			body: { status: 'error', message },
		},
		message,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

beforeEach(() => {
	mockRequest.mockReset();
});

describe('makeHandwryttenRequest', () => {
	it('sends Authorization: <apiKey> without Bearer prefix and omits TOKEN from config', async () => {
		mockRequest.mockResolvedValue({ status: 'ok', httpCode: 200 });

		await makeHandwryttenRequest('/orders/details', 'secret_key_123', {
			method: 'GET',
			query: { id: 456 },
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		const [config, requestOptions] = mockRequest.mock.calls[0] ?? [];

		expect(config).toMatchObject({
			BASE: HANDWRYTTEN_API_BASE,
			HEADERS: {
				Authorization: 'secret_key_123',
				'Content-Type': 'application/json',
			},
		});
		expect(config).not.toHaveProperty('TOKEN');
		expect(requestOptions).toEqual(
			expect.objectContaining({
				method: 'GET',
				url: '/orders/details',
				query: { id: 456 },
			}),
		);
	});

	it('makes unauthenticated requests without Authorization header for public routes', async () => {
		mockRequest.mockResolvedValue({ status: 'ok', httpCode: 200 });

		await makeHandwryttenRequest('/fonts/list', undefined, {
			method: 'GET',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		const [config] = mockRequest.mock.calls[0] ?? [];
		expect(config?.HEADERS).not.toHaveProperty('Authorization');
	});

	it('throws AuthMissingError for an explicitly empty key without sending a request', async () => {
		mockRequest.mockResolvedValue({ status: 'ok' });

		await expect(
			makeHandwryttenRequest('/orders/details', '', { method: 'GET' }),
		).rejects.toThrow(AuthMissingError);

		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('rethrows ApiError with status and retryAfter intact', async () => {
		const rateLimited = apiError(429, 'Rate limit exceeded', 2500);
		mockRequest.mockRejectedValue(rateLimited);

		// `unknown` because rejection value has no static type; assertion below narrows it.
		const error: unknown = await makeHandwryttenRequest(
			'/orders/details',
			'test-key',
		).catch((caught: unknown) => caught);

		expect(error).toBe(rateLimited);
		expect((error as ApiError).status).toBe(429);
		expect((error as ApiError).retryAfter).toBe(2500);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(rateLimited)).toBe(true);
	});

	it('redacts sensitive credentials in-place without replacing ApiError', async () => {
		const rawBody = {
			card_id: 10,
			message: 'Hello',
			password: 'my-super-secret-password',
			apiKey: 'secret_live_key',
			credit_card_id: 'cc_9999',
		};
		const sensitiveError = apiError(400, 'Bad Request', undefined, rawBody);
		mockRequest.mockRejectedValue(sensitiveError);

		// `unknown` because rejection value has no static type; assertion below narrows it.
		const caught: unknown = await makeHandwryttenRequest(
			'/orders/singleStepOrder',
			'test-key',
			{
				method: 'POST',
				body: rawBody,
			},
		).catch((e: unknown) => e);

		expect(caught).toBe(sensitiveError);
		// `unknown` because request.body is arbitrary object.
		const body = (caught as ApiError).request?.body as Record<string, unknown>;
		expect(body.password).toBe('[REDACTED]');
		expect(body.apiKey).toBe('[REDACTED]');
		expect(body.credit_card_id).toBe('[REDACTED]');
		expect(body.card_id).toBe(10);
		expect(body.message).toBe('Hello');
	});

	it('wraps generic non-ApiError in HandwryttenAPIError', async () => {
		mockRequest.mockRejectedValue('network socket hangup');

		await expect(
			makeHandwryttenRequest('/fonts/list', undefined),
		).rejects.toThrow(HandwryttenAPIError);
	});
});

describe('handwrytten keyBuilder', () => {
	it('returns configured options.key directly', async () => {
		const plugin = handwrytten({ key: 'direct-opt-key' });
		if (!plugin.keyBuilder) throw new Error('keyBuilder missing');
		// `unknown` because test context provides only properties used by keyBuilder.
		const ctx = {
			meteredOperationId: 'orders.sendSingle',
		} as unknown as Parameters<NonNullable<typeof plugin.keyBuilder>>[0];
		const key = await plugin.keyBuilder(ctx, 'endpoint');
		expect(key).toBe('direct-opt-key');
	});

	it('returns empty string for public endpoints without touching ctx.keys', async () => {
		const plugin = handwrytten();
		if (!plugin.keyBuilder) throw new Error('keyBuilder missing');
		// `unknown` because test context provides only properties used by keyBuilder.
		const ctx = { meteredOperationId: 'cards.list' } as unknown as Parameters<
			NonNullable<typeof plugin.keyBuilder>
		>[0];
		const key = await plugin.keyBuilder(ctx, 'endpoint');
		expect(key).toBe('');
	});

	it('throws AuthMissingError when ctx.keys is missing on private endpoints', async () => {
		const plugin = handwrytten();
		if (!plugin.keyBuilder) throw new Error('keyBuilder missing');
		// `unknown` because test context provides only properties used by keyBuilder.
		const ctx = {
			meteredOperationId: 'orders.sendSingle',
			keys: undefined,
		} as unknown as Parameters<NonNullable<typeof plugin.keyBuilder>>[0];
		await expect(plugin.keyBuilder(ctx, 'endpoint')).rejects.toThrow(
			AuthMissingError,
		);
	});

	it('throws AuthMissingError when get_api_key returns empty or null', async () => {
		const plugin = handwrytten();
		if (!plugin.keyBuilder) throw new Error('keyBuilder missing');
		// `unknown` because test context provides only properties used by keyBuilder.
		const ctx = {
			meteredOperationId: 'orders.sendSingle',
			keys: {
				get_api_key: async () => null,
			},
		} as unknown as Parameters<NonNullable<typeof plugin.keyBuilder>>[0];
		await expect(plugin.keyBuilder(ctx, 'endpoint')).rejects.toThrow(
			AuthMissingError,
		);
	});

	it('returns stored key when present', async () => {
		const plugin = handwrytten();
		if (!plugin.keyBuilder) throw new Error('keyBuilder missing');
		// `unknown` because test context provides only properties used by keyBuilder.
		const ctx = {
			meteredOperationId: 'orders.sendSingle',
			keys: {
				get_api_key: async () => 'stored_vault_key',
			},
		} as unknown as Parameters<NonNullable<typeof plugin.keyBuilder>>[0];
		const key = await plugin.keyBuilder(ctx, 'endpoint');
		expect(key).toBe('stored_vault_key');
	});
});
