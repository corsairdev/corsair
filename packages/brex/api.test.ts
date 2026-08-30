import { createHmac } from 'node:crypto';
import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import {
	BREX_API_BASE,
	BrexAPIError,
	BrexRateLimitError,
	makeBrexRequest,
} from './client';
import {
	cardStatusPath,
	createBrexEndpoint,
	resolvePath,
} from './endpoints/factory';
import type { BrexRouteKey } from './endpoints/routes';
import { BREX_ROUTE_KEYS, BREX_ROUTES, getBrexRoute } from './endpoints/routes';
import type { BrexEndpointInput } from './endpoints/types';
import {
	BrexEndpointInputSchemas,
	BrexEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { brex } from './index';
import { matchBrexTenantWebhook } from './webhooks/tenant-matcher';
import { verifyBrexWebhookSignature } from './webhooks/types';

jest.mock('corsair/core', () => {
	class AuthMissingError extends Error {
		constructor(plugin: string, authType: string) {
			super(`Missing ${authType} for ${plugin}`);
			this.name = 'AuthMissingError';
		}
	}
	return {
		AuthMissingError,
		getOAuthAccessToken: jest.fn(async () => 'oauth-access-token'),
		logEventFromContext: jest.fn(),
		asRecord: (value: unknown) =>
			value !== null && typeof value === 'object'
				? (value as Record<string, unknown>)
				: null,
		firstString: (values: unknown[]) =>
			values.find((value) => typeof value === 'string' && value) as
				| string
				| undefined,
		toExternalId: (value: unknown) =>
			typeof value === 'string' && value ? value : undefined,
	};
});

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return {
		...actual,
		request: jest.fn(),
	};
});

const mockRequest = request as jest.MockedFunction<typeof request>;

beforeEach(() => {
	mockRequest.mockReset();
	jest.mocked(logEventFromContext).mockReset();
	mockRequest.mockResolvedValue({ id: 'ok' } as never);
});

const ctx = { key: 'test-token', $getAccountId: async () => 'acct' } as never;

function lastCall() {
	expect(mockRequest).toHaveBeenCalled();
	const [config, options] = mockRequest.mock.calls[0] as unknown as [
		{ BASE?: string; HEADERS?: Record<string, string> },
		{ method?: string; url?: string; query?: unknown; body?: unknown },
	];
	return { options, config };
}

function sampleInput(key: BrexRouteKey): Record<string, unknown> {
	const route = BREX_ROUTES[key];
	const input: Record<string, unknown> = {};
	for (const param of route.pathParams) input[param] = 'id-1';
	for (const field of route.required) {
		if (field === 'values') input.values = [{ value: 'Engineering' }];
		else if (field === 'event_types') input.event_types = ['USER_UPDATED'];
		else if (field === 'webhook_ids') input.webhook_ids = ['wh_1'];
		else if (field === 'owner') input.owner = { type: 'USER', user_id: 'u1' };
		else if (field === 'authorization_settings') {
			input.authorization_settings = { type: 'LIMIT' };
		} else if (field === 'action') input.action = 'lock';
		else if (field === 'min_amount') input.min_amount = 10;
		else if (field === 'max_amount') input.max_amount = 50;
		else if (field === 'description') input.description = 'uber';
		else if (field === 'email') input.email = 'ada@example.com';
		else if (field === 'first_name') input.first_name = 'Ada';
		else if (field === 'last_name') input.last_name = 'Lovelace';
		else if (field === 'type') input.type = 'ARTICLES_OF_INCORPORATION';
		else if (field === 'url') input.url = 'https://example.com/hook';
		else if (field === 'receipt_name') input.receipt_name = 'receipt.pdf';
		else input[field] = 'sample';
	}
	return input;
}

describe('Brex plugin', () => {
	it('registers official auth, host, and every route', () => {
		const plugin = brex({ key: 'test-token' });
		expect(plugin.id).toBe('brex');
		expect(plugin.authConfig?.api_key?.account).toEqual(['company_id']);
		expect(plugin.authConfig?.oauth_2?.account).toEqual(['company_id']);
		expect(plugin.oauthConfig?.authUrl).toContain('accounts-api.brex.com');
		expect(Object.keys(plugin.endpointSchemas ?? {})).toHaveLength(
			BREX_ROUTE_KEYS.length,
		);
		expect(plugin.pluginWebhookMatcher?.({ headers: {} } as never)).toBe(false);
	});

	it('throws AuthMissingError when no user token is stored', async () => {
		const plugin = brex();
		await expect(
			plugin.keyBuilder?.(
				{
					authType: 'api_key',
					keys: { get_api_key: async () => undefined },
				} as never,
				'endpoint',
			),
		).rejects.toThrow(AuthMissingError);
	});

	it('returns an explicit key from keyBuilder', async () => {
		const plugin = brex({ key: 'explicit-token' });
		await expect(
			plugin.keyBuilder?.(
				{ authType: 'api_key', keys: {} } as never,
				'endpoint',
			),
		).resolves.toBe('explicit-token');
	});

	it.each(BREX_ROUTE_KEYS)(
		'%s hits the official path and validates I/O',
		async (key) => {
			const route = getBrexRoute(key);
			const input = BrexEndpointInputSchemas[key].parse(
				sampleInput(key),
			) as BrexEndpointInput;
			if (route.filter === 'transactionId') {
				mockRequest.mockResolvedValue({
					items: [{ id: 'id-1', amount: { amount: 1200 } }],
					next_cursor: null,
				} as never);
			} else if (route.filter === 'transactionAmount') {
				mockRequest.mockResolvedValue({
					items: [
						{
							id: 't1',
							amount: { amount: 2500 },
							posted_at_date: '2026-01-02',
						},
						{
							id: 't2',
							amount: { amount: 90000 },
							posted_at_date: '2026-01-02',
						},
					],
					next_cursor: null,
				} as never);
			} else if (route.filter === 'transactionDescription') {
				mockRequest.mockResolvedValue({
					items: [
						{
							id: 't1',
							merchant: { raw_descriptor: 'UBER TRIP' },
							posted_at_date: '2026-01-02',
						},
					],
					next_cursor: null,
				} as never);
			}

			const result = await createBrexEndpoint(key)(ctx, input);
			BrexEndpointOutputSchemas[key].parse(result);

			const { options, config } = lastCall();
			expect(config.BASE).toBe(BREX_API_BASE);
			expect(config.HEADERS?.Authorization).toBe('Bearer test-token');
			if (route.filter === 'cardStatus') {
				expect(options.url).toBe(cardStatusPath('id-1', 'lock'));
			} else {
				expect(options.url).toBe(resolvePath(route.path, input));
			}
			expect(options.method).toBe(route.method);
		},
	);

	it('encodes path ids as a single segment', () => {
		expect(resolvePath('/v2/cards/{id}', { id: 'a/b?x=1' })).toBe(
			'/v2/cards/a%2Fb%3Fx%3D1',
		);
	});

	it('wraps HTTP 429 as BrexRateLimitError with retry metadata', async () => {
		mockRequest.mockRejectedValue(
			new ApiError(
				{ method: 'GET', url: '/v2/company' },
				{
					url: 'https://api.brex.com/v2/company',
					ok: false,
					status: 429,
					statusText: 'Too Many Requests',
					body: { message: 'slow down' },
				},
				'Too Many Requests',
				{ retryAfter: 2000 },
			),
		);

		const thrown = await makeBrexRequest('/v2/company', 'token').catch(
			(error: unknown) => error,
		);
		expect(thrown).toBeInstanceOf(BrexRateLimitError);
		expect((thrown as BrexRateLimitError).retryAfterMs).toBe(2000);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(thrown as Error)).toBe(true);
		const handled = await errorHandlers.RATE_LIMIT_ERROR.handler(
			thrown as Error,
		);
		expect(handled.headersRetryAfterMs).toBe(2000);
	});

	it('wraps HTTP 401 as BrexAPIError', async () => {
		mockRequest.mockRejectedValue(
			new ApiError(
				{ method: 'GET', url: '/v2/company' },
				{
					url: 'https://api.brex.com/v2/company',
					ok: false,
					status: 401,
					statusText: 'Unauthorized',
					body: { message: 'invalid token' },
				},
				'Unauthorized',
			),
		);
		await expect(makeBrexRequest('/v2/company', 'bad')).rejects.toBeInstanceOf(
			BrexAPIError,
		);
	});
});

describe('Brex webhooks', () => {
	it('matches company_id from official payloads', () => {
		expect(
			matchBrexTenantWebhook({
				company_id: 'cuacc_123',
				event_type: 'USER_UPDATED',
			}),
		).toEqual({ linkType: 'company_id', externalId: 'cuacc_123' });
	});

	it('rejects unsigned webhook payloads', () => {
		expect(
			verifyBrexWebhookSignature({ headers: {}, rawBody: '{}' }, 'secret')
				.valid,
		).toBe(false);
	});

	it('accepts a valid official HMAC signature', () => {
		const id = 'msg_1';
		const timestamp = String(Math.floor(Date.now() / 1000));
		const rawBody = '{"company_id":"cuacc_123"}';
		const digest = createHmac('sha256', 'whsec')
			.update(`${id}.${timestamp}.${rawBody}`)
			.digest('base64');
		expect(
			verifyBrexWebhookSignature(
				{
					headers: {
						'webhook-id': id,
						'webhook-timestamp': timestamp,
						'webhook-signature': `v1,${digest}`,
					},
					rawBody,
				},
				'whsec',
			),
		).toEqual({ valid: true });
	});
});
