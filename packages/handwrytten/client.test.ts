import { AuthMissingError } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import {
	HANDWRYTTEN_API_BASE,
	HandwryttenAPIError,
	makeHandwryttenRequest,
} from './client';
import { Cards, QrCodes, Signatures } from './endpoints';
import { errorHandlers } from './error-handlers';
import type { HandwryttenContext } from './index';
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

	it('makes unauthenticated requests without Authorization header for public routes with empty or undefined key', async () => {
		mockRequest.mockResolvedValue({ status: 'ok', httpCode: 200 });

		// When key is undefined
		await makeHandwryttenRequest('/fonts/list', undefined, {
			method: 'GET',
		});
		expect(mockRequest).toHaveBeenCalledTimes(1);
		const [config1] = mockRequest.mock.calls[0] ?? [];
		expect(config1?.HEADERS).not.toHaveProperty('Authorization');

		// When key is an empty string (as returned by keyBuilder for public endpoints)
		mockRequest.mockClear();
		mockRequest.mockResolvedValue({ status: 'ok', httpCode: 200 });
		await makeHandwryttenRequest('/cards/list', '', {
			method: 'GET',
		});
		expect(mockRequest).toHaveBeenCalledTimes(1);
		const [config2] = mockRequest.mock.calls[0] ?? [];
		expect(config2?.HEADERS).not.toHaveProperty('Authorization');
	});

	it('throws AuthMissingError for an explicitly empty key on private endpoints without sending a request', async () => {
		mockRequest.mockResolvedValue({ status: 'ok' });

		await expect(
			makeHandwryttenRequest('/orders/details', '', { method: 'GET' }),
		).rejects.toThrow(AuthMissingError);

		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('honors custom baseUrl override when provided', async () => {
		mockRequest.mockResolvedValue({ status: 'ok' });
		const customBase = 'https://api.handwrytten.com/v2';

		await makeHandwryttenRequest('/fonts/list', '', {
			method: 'GET',
			baseUrl: customBase,
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		const [config] = mockRequest.mock.calls[0] ?? [];
		expect(config?.BASE).toBe(customBase);
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

	it('returns stored key when present, even on public endpoints', async () => {
		const plugin = handwrytten();
		if (!plugin.keyBuilder) throw new Error('keyBuilder missing');
		// `unknown` because test context provides only properties used by keyBuilder.
		const ctx = {
			meteredOperationId: 'cards.list',
			keys: {
				get_api_key: async () => 'stored_tenant_key',
			},
		} as unknown as Parameters<NonNullable<typeof plugin.keyBuilder>>[0];
		const key = await plugin.keyBuilder(ctx, 'endpoint');
		expect(key).toBe('stored_tenant_key');
	});

	it('returns empty string for public endpoints when no key is configured or stored', async () => {
		const plugin = handwrytten();
		if (!plugin.keyBuilder) throw new Error('keyBuilder missing');
		// `unknown` because test context provides only properties used by keyBuilder.
		const ctx = {
			meteredOperationId: 'cards.list',
			keys: undefined,
		} as unknown as Parameters<NonNullable<typeof plugin.keyBuilder>>[0];
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

	it('throws AuthMissingError when get_api_key returns empty or null on private endpoints', async () => {
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
});

describe('credential resolution joined with endpoint execution', () => {
	it('executes public endpoint without authentication when no credentials exist', async () => {
		mockRequest.mockResolvedValue({
			status: 'success',
			cards: [{ id: 10, name: 'Thank You' }],
		});

		const plugin = handwrytten();
		if (!plugin.keyBuilder) throw new Error('keyBuilder missing');

		// 1. Resolve key for cards.list via keyBuilder
		// `unknown` because mock context models minimal runtime interface for keyBuilder.
		const kbCtx = {
			meteredOperationId: 'cards.list',
		} as unknown as Parameters<NonNullable<typeof plugin.keyBuilder>>[0];
		const resolvedKey = await plugin.keyBuilder(kbCtx, 'endpoint');
		expect(resolvedKey).toBe('');

		// 2. Pass resolved key into endpoint invocation
		// `unknown` because mock context models minimal runtime interface for endpoint.
		const endpointCtx = {
			key: resolvedKey,
			options: plugin.options,
			$getAccountId: () => 'test-account',
		} as unknown as HandwryttenContext;

		const result = await Cards.list(endpointCtx, {});
		expect(result.status).toBe('success');
		expect(mockRequest).toHaveBeenCalledTimes(1);

		const [config] = mockRequest.mock.calls[0] ?? [];
		expect(config?.HEADERS).not.toHaveProperty('Authorization');
	});

	it('executes public endpoint with Authorization header when tenant key is stored', async () => {
		mockRequest.mockResolvedValue({
			status: 'success',
			cards: [{ id: 10, name: 'Thank You' }],
		});

		const plugin = handwrytten();
		if (!plugin.keyBuilder) throw new Error('keyBuilder missing');

		// 1. Resolve key when tenant has stored credentials
		// `unknown` because mock context models minimal runtime interface for keyBuilder.
		const kbCtx = {
			meteredOperationId: 'cards.list',
			keys: {
				get_api_key: async () => 'tenant_stored_api_key',
			},
		} as unknown as Parameters<NonNullable<typeof plugin.keyBuilder>>[0];
		const resolvedKey = await plugin.keyBuilder(kbCtx, 'endpoint');
		expect(resolvedKey).toBe('tenant_stored_api_key');

		// 2. Pass resolved key into endpoint invocation
		// `unknown` because mock context models minimal runtime interface for endpoint.
		const endpointCtx = {
			key: resolvedKey,
			options: plugin.options,
			$getAccountId: () => 'test-account',
		} as unknown as HandwryttenContext;

		const result = await Cards.list(endpointCtx, {});
		expect(result.status).toBe('success');
		expect(mockRequest).toHaveBeenCalledTimes(1);

		const [config] = mockRequest.mock.calls[0] ?? [];
		expect(config?.HEADERS).toHaveProperty(
			'Authorization',
			'tenant_stored_api_key',
		);
	});

	it('forwards custom baseUrl from plugin options to endpoint request', async () => {
		mockRequest.mockResolvedValue({
			status: 'success',
			cards: [],
		});

		const customBase = 'https://custom-gateway.handwrytten.com/v1';
		const plugin = handwrytten({
			baseUrl: customBase,
		});

		// `unknown` because mock context models minimal runtime interface for endpoint.
		const endpointCtx = {
			key: '',
			options: plugin.options,
			$getAccountId: () => 'test-account',
		} as unknown as HandwryttenContext;

		await Cards.list(endpointCtx, {});
		expect(mockRequest).toHaveBeenCalledTimes(1);

		const [config] = mockRequest.mock.calls[0] ?? [];
		expect(config?.BASE).toBe(customBase);
	});

	it('executes signatures.list and qrCodes.frames without credentials', async () => {
		mockRequest.mockResolvedValue({
			status: 'success',
			signatures: [],
			frames: [],
		});

		const plugin = handwrytten();
		// `unknown` because mock context models minimal runtime interface for endpoint.
		const endpointCtx = {
			key: '',
			options: plugin.options,
			$getAccountId: () => 'test-account',
		} as unknown as HandwryttenContext;

		await Signatures.list(endpointCtx, {});
		await QrCodes.frames(endpointCtx, {});
		expect(mockRequest).toHaveBeenCalledTimes(2);

		const [config1] = mockRequest.mock.calls[0] ?? [];
		const [config2] = mockRequest.mock.calls[1] ?? [];
		expect(config1?.HEADERS).not.toHaveProperty('Authorization');
		expect(config2?.HEADERS).not.toHaveProperty('Authorization');
	});

	it('fails fast on private endpoint when credentials are missing', async () => {
		const plugin = handwrytten();
		if (!plugin.keyBuilder) throw new Error('keyBuilder missing');

		// `unknown` because mock context models minimal runtime interface for keyBuilder.
		const kbCtx = {
			meteredOperationId: 'orders.sendSingle',
		} as unknown as Parameters<NonNullable<typeof plugin.keyBuilder>>[0];

		await expect(plugin.keyBuilder(kbCtx, 'endpoint')).rejects.toThrow(
			AuthMissingError,
		);
		expect(mockRequest).not.toHaveBeenCalled();
	});
});
