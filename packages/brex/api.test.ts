import { AuthMissingError, logEventFromContext } from 'corsair/core';
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
import { resolveBrexOAuthTenantLink } from './oauth-tenant-link';

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
		readBodyRecord: (request: { body?: unknown }) =>
			request.body !== null &&
			typeof request.body === 'object' &&
			!Array.isArray(request.body)
				? request.body
				: null,
	};
});

const mockFetch = jest.fn();

beforeAll(() => {
	globalThis.fetch = mockFetch as typeof fetch;
});

beforeEach(() => {
	mockFetch.mockReset();
	jest.mocked(logEventFromContext).mockReset();
	mockFetch.mockResolvedValue(
		new Response(JSON.stringify({ id: 'ok' }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
});

const ctx = { key: 'test-token', $getAccountId: async () => 'acct' } as never;

function jsonResponse(body: unknown, init?: ResponseInit): Response {
	return new Response(JSON.stringify(body), {
		status: 200,
		...init,
		headers: {
			'Content-Type': 'application/json',
			...(init?.headers as Record<string, string> | undefined),
		},
	});
}

function lastCall() {
	expect(mockFetch).toHaveBeenCalled();
	const [input, init] = mockFetch.mock.calls[0] as [
		string,
		RequestInit | undefined,
	];
	const url = new URL(input);
	return {
		url: `${url.origin}${url.pathname}`,
		path: url.pathname,
		method: init?.method ?? 'GET',
		auth: new Headers(init?.headers).get('Authorization'),
		idempotency: new Headers(init?.headers).get('Idempotency-Key'),
		hasSignal: init?.signal instanceof AbortSignal,
	};
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
				mockFetch.mockResolvedValue(
					jsonResponse({
						items: [{ id: 'id-1', amount: { amount: 1200 } }],
						next_cursor: null,
					}),
				);
			} else if (route.filter === 'transactionAmount') {
				mockFetch.mockResolvedValue(
					jsonResponse({
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
					}),
				);
			} else if (route.filter === 'transactionDescription') {
				mockFetch.mockResolvedValue(
					jsonResponse({
						items: [
							{
								id: 't1',
								merchant: { raw_descriptor: 'UBER TRIP' },
								posted_at_date: '2026-01-02',
							},
						],
						next_cursor: null,
					}),
				);
			}

			const result = await createBrexEndpoint(key)(ctx, input);
			BrexEndpointOutputSchemas[key].parse(result);

			const req = lastCall();
			expect(req.url.startsWith(BREX_API_BASE)).toBe(true);
			expect(req.auth).toBe('Bearer test-token');
			if (route.filter === 'cardStatus') {
				expect(req.path).toBe(cardStatusPath('id-1', 'lock'));
			} else {
				expect(req.path).toBe(resolvePath(route.path, input));
			}
			expect(req.method).toBe(route.method);
		},
	);

	it('encodes path ids as a single segment', () => {
		expect(resolvePath('/v2/cards/{id}', { id: 'a/b?x=1' })).toBe(
			'/v2/cards/a%2Fb%3Fx%3D1',
		);
	});

	it('wraps HTTP 429 as BrexRateLimitError with retry metadata', async () => {
		mockFetch.mockResolvedValue(
			jsonResponse(
				{ message: 'slow down' },
				{
					status: 429,
					statusText: 'Too Many Requests',
					headers: { 'Retry-After': '2' },
				},
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

	it('sends a stable Idempotency-Key for cards.create', async () => {
		await createBrexEndpoint('cardsCreate')(ctx, {
			owner: { type: 'USER', user_id: 'u1' },
			card_name: 'Ops',
			card_type: 'VIRTUAL',
			limit_type: 'CARD',
			idempotency_key: 'card-create-1',
		});
		expect(lastCall().idempotency).toBe('card-create-1');
		expect(lastCall().hasSignal).toBe(true);
	});

	it('keeps the continuation cursor after the transaction scan cap', async () => {
		for (let page = 0; page < 50; page += 1) {
			mockFetch.mockResolvedValueOnce(
				jsonResponse({ items: [], next_cursor: `c${page + 1}` }),
			);
		}
		const result = (await createBrexEndpoint('transactionsByAmountRange')(ctx, {
			min_amount: 10,
			max_amount: 20,
		})) as { next_cursor: string | null };
		expect(result.next_cursor).toBe('c50');
	});

	it('wraps HTTP 401 as BrexAPIError', async () => {
		mockFetch.mockResolvedValue(
			jsonResponse(
				{ message: 'invalid token' },
				{ status: 401, statusText: 'Unauthorized' },
			),
		);
		await expect(makeBrexRequest('/v2/company', 'bad')).rejects.toBeInstanceOf(
			BrexAPIError,
		);
	});
});

describe('Brex OAuth tenant link', () => {
	it('returns null when company lookup fails', async () => {
		mockFetch.mockRejectedValueOnce(new Error('network'));
		await expect(
			resolveBrexOAuthTenantLink({
				access_token: 'token',
			} as never),
		).resolves.toBeNull();
	});
});
