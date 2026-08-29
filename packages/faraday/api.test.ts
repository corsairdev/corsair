import { createHmac } from 'node:crypto';
import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import {
	FaradayAPIError,
	FaradayRateLimitError,
	makeFaradayRequest,
} from './client';
import { FARADAY_OPS, FaradayHandlers, opKey } from './endpoints';
import {
	FaradayEndpointInputSchemas,
	FaradayEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { faraday } from './index';
import { FaradaySchema } from './schema';
import {
	FARADAY_WEBHOOK_TOLERANCE_SECONDS,
	matchFaradayTenantWebhook,
	verifyFaradayWebhookSignature,
} from './webhooks';

jest.mock('corsair/core', () => {
	class AuthMissingError extends Error {
		constructor(plugin: string, authType: string) {
			super(`Missing ${authType} for ${plugin}`);
			this.name = 'AuthMissingError';
		}
	}
	return {
		AuthMissingError,
		logEventFromContext: jest.fn().mockResolvedValue('evt-1'),
		asRecord: (value: unknown) =>
			value && typeof value === 'object' && !Array.isArray(value)
				? value
				: undefined,
		firstString: (values: unknown[]) =>
			values.find((value) => typeof value === 'string' && value) as
				| string
				| undefined,
		readBodyRecord: (request: { body?: unknown }) => {
			if (typeof request.body === 'string') {
				try {
					return JSON.parse(request.body);
				} catch {
					return null;
				}
			}
			return request.body && typeof request.body === 'object'
				? request.body
				: null;
		},
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
	jest.mocked(logEventFromContext).mockResolvedValue('evt-1');
	mockRequest.mockResolvedValue({ id: 'acc-1', name: 'Acme' } as never);
});

const ctx = { key: 'test-api-key' } as never;

function sampleInput(op: (typeof FARADAY_OPS)[number]) {
	switch (op.input) {
		case 'none':
			return {};
		case 'ids':
			return { ids: ['11111111-1111-1111-1111-111111111111'] };
		case 'create':
			return { name: 'Customers' };
		case 'accountCreate':
			return { name: 'Acme Wind Turbines' };
		case 'webhookCreate':
			return {
				url: 'https://example.com/hook',
				enabled_events: ['resource.ready_with_update'],
			};
		case 'webhookUpdate':
			return {
				webhook_endpoint_id: '22222222-2222-2222-2222-222222222222',
				status: 'enabled',
			};
		case 'upload':
			return { directory: 'dir', filename: 'file.csv' };
		case 'preview':
			return { target_id: '33333333-3333-3333-3333-333333333333' };
		default:
			return {
				account_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
				cohort_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
				dataset_id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
				stream_id: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
				outcome_id: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
				persona_set_id: 'ffffffff-ffff-ffff-ffff-ffffffffffff',
				place_id: '11111111-1111-4111-8111-111111111111',
				scope_id: '22222222-2222-4222-8222-222222222222',
				target_id: '33333333-3333-4333-8333-333333333333',
				trait_id: '44444444-4444-4444-8444-444444444444',
				connection_id: '55555555-5555-4555-8555-555555555555',
				webhook_endpoint_id: '66666666-6666-4666-8666-666666666666',
				id: '77777777-7777-4777-8777-777777777777',
				name: 'Updated',
			};
	}
}

describe('Faraday plugin', () => {
	it('registers official Faraday REST ops and api_key auth', () => {
		const plugin = faraday();
		expect(plugin.id).toBe('faraday');
		expect(plugin.authConfig?.api_key?.account).toEqual(['account_id']);
		expect(Object.keys(plugin.endpointSchemas ?? {}).length).toBe(
			FARADAY_OPS.length,
		);
		expect(FARADAY_OPS.length).toBeGreaterThan(100);
	});

	it('declares official Faraday entities', () => {
		expect(FaradaySchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(Object.keys(FaradaySchema.entities)).toEqual(
			expect.arrayContaining([
				'accounts',
				'cohorts',
				'datasets',
				'streams',
				'scopes',
				'targets',
				'traits',
			]),
		);
	});

	it('returns an explicit key from keyBuilder', async () => {
		const plugin = faraday({ key: 'explicit-key' });
		await expect(
			plugin.keyBuilder?.(
				{
					authType: 'api_key',
					keys: { get_api_key: async () => 'stored' },
				} as never,
				'endpoint',
			),
		).resolves.toBe('explicit-key');
	});

	it('throws AuthMissingError when no key is stored', async () => {
		const plugin = faraday();
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
});

function expectedUrl(path: string, input: Record<string, unknown>): string {
	return path.replace(/\{(\w+)\}/g, (_, key: string) =>
		encodeURIComponent(String(input[key] ?? input.id ?? '')),
	);
}

describe('official Faraday REST request mapping', () => {
	it.each(FARADAY_OPS.map((op) => [opKey(op), op]))(
		'%s calls %s %s',
		async (_key, op) => {
			const input = sampleInput(op) as Record<string, unknown>;
			const handler = FaradayHandlers[opKey(op)];
			if (!handler) throw new Error(`missing handler ${opKey(op)}`);
			await handler(ctx, input as never);
			expect(mockRequest).toHaveBeenCalled();
			const options = mockRequest.mock.calls[0]?.[1];
			expect(options?.method).toBe(op.method);
			expect(options?.url).toBe(expectedUrl(op.path, input));
			if (op.input === 'ids') {
				expect(options?.query).toEqual({ ids: input.ids });
			}
			if (op.method === 'GET' || op.method === 'DELETE' || op.input === 'id') {
				expect(options?.body).toBeUndefined();
			}
			if (op.input === 'accountCreate' || op.input === 'create') {
				expect(options?.body).toMatchObject({ name: input.name });
			}
		},
	);

	it('maps accounts.list ids as a repeated query and GET /accounts', async () => {
		const list = FaradayHandlers['accounts.list'];
		if (!list) throw new Error('missing accounts.list');
		const ids = ['aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'];
		await list(ctx, { ids } as never);
		expect(mockRequest.mock.calls[0]?.[1]).toMatchObject({
			method: 'GET',
			url: 'accounts',
			query: { ids },
		});
	});

	it('maps accounts.get to GET /accounts/{account_id}', async () => {
		const get = FaradayHandlers['accounts.get'];
		if (!get) throw new Error('missing accounts.get');
		await get(ctx, {
			account_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
		} as never);
		expect(mockRequest.mock.calls[0]?.[1]).toMatchObject({
			method: 'GET',
			url: 'accounts/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
			body: undefined,
		});
	});

	it('maps accounts.create to POST /accounts with name', async () => {
		const create = FaradayHandlers['accounts.create'];
		if (!create) throw new Error('missing accounts.create');
		await create(ctx, { name: 'Acme Wind Turbines' } as never);
		expect(mockRequest.mock.calls[0]?.[1]).toMatchObject({
			method: 'POST',
			url: 'accounts',
			body: { name: 'Acme Wind Turbines' },
		});
	});

	it('rejects more than 100 list ids', async () => {
		const ids = Array.from({ length: 101 }, (_, i) => String(i));
		const list = FaradayHandlers['accounts.list'];
		if (!list) throw new Error('missing accounts.list');
		await expect(list(ctx, { ids } as never)).rejects.toThrow(
			'Maximum of 100 IDs allowed',
		);
	});

	it('strips api_key from account responses', async () => {
		mockRequest.mockResolvedValueOnce([
			{ id: 'acc-1', name: 'Acme', api_key: 'prod_fdysec_abcd' },
		] as never);
		const list = FaradayHandlers['accounts.list'];
		if (!list) throw new Error('missing accounts.list');
		const result = await list(ctx, {} as never);
		expect(result).toEqual([{ id: 'acc-1', name: 'Acme' }]);
	});
});

describe('makeFaradayRequest errors', () => {
	it('preserves 429 retry metadata', async () => {
		mockRequest.mockRejectedValueOnce(
			new ApiError(
				{ method: 'GET', url: 'accounts' },
				{
					url: 'https://api.faraday.ai/v1/accounts',
					ok: false,
					status: 429,
					statusText: 'Too Many Requests',
					body: { note: 'slow down' },
				},
				'Too Many Requests',
				{ retryAfter: 2000 },
			),
		);
		const err = await makeFaradayRequest('accounts', 'k').catch((e) => e);
		expect(err).toBeInstanceOf(FaradayRateLimitError);
		expect((err as FaradayRateLimitError).retryAfterMs).toBe(2000);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(err as Error)).toBe(true);
	});

	it('preserves 401 status for auth handler', async () => {
		mockRequest.mockRejectedValueOnce(
			new ApiError(
				{ method: 'GET', url: 'accounts' },
				{
					url: 'https://api.faraday.ai/v1/accounts',
					ok: false,
					status: 401,
					statusText: 'Unauthorized',
					body: { error: 'MISSING_API_KEY', note: 'No API key' },
				},
				'Unauthorized',
			),
		);
		const err = await makeFaradayRequest('accounts', 'k').catch((e) => e);
		expect(err).toBeInstanceOf(FaradayAPIError);
		expect((err as FaradayAPIError).status).toBe(401);
		expect(errorHandlers.AUTH_ERROR.match(err as Error)).toBe(true);
	});
});

describe('Faraday webhook signature', () => {
	it('rejects missing Standard Webhooks headers', () => {
		const result = verifyFaradayWebhookSignature(
			{
				headers: {},
				rawBody: '{}',
				payload: {
					timestamp: '2024-01-01T00:00:00Z',
					type: 'resource.ready_with_update',
					data: {
						account_id: 'a',
						resource_id: 'b',
						resource_type: 'cohorts',
					},
				},
			} as never,
			'whsec_dGVzdA==',
		);
		expect(result.valid).toBe(false);
	});

	it('matches tenant from data.account_id', () => {
		expect(
			matchFaradayTenantWebhook({
				body: {
					type: 'resource.ready_with_update',
					data: { account_id: 'acct-1' },
				},
			} as never),
		).toEqual({ linkType: 'account_id', externalId: 'acct-1' });
	});

	it('matches tenant when the raw body is a JSON string', () => {
		expect(
			matchFaradayTenantWebhook({
				body: JSON.stringify({
					type: 'resource.ready_with_update',
					data: { account_id: 'acct-2' },
				}),
			} as never),
		).toEqual({ linkType: 'account_id', externalId: 'acct-2' });
	});

	it('HMACs the exact raw body, not a reconstructed payload', () => {
		const secret = 'whsec_dGVzdA==';
		const now = String(Math.floor(Date.now() / 1000));
		const rawBody =
			'{"type":"resource.ready_with_update","data":{"account_id":"a"}}';
		const reconstructed = JSON.stringify(JSON.parse(rawBody), null, 2);
		const sign = (body: string) =>
			`v1,${createHmac('sha256', Buffer.from('dGVzdA==', 'base64'))
				.update(`msg_raw.${now}.${body}`)
				.digest('base64')}`;
		const payload = {
			timestamp: now,
			type: 'resource.ready_with_update' as const,
			data: { account_id: 'a', resource_id: 'b', resource_type: 'cohorts' },
		};
		expect(
			verifyFaradayWebhookSignature(
				{
					headers: {
						'svix-id': 'msg_raw',
						'svix-timestamp': now,
						'svix-signature': sign(rawBody),
					},
					rawBody,
					payload,
				} as never,
				secret,
			).valid,
		).toBe(true);
		expect(
			verifyFaradayWebhookSignature(
				{
					headers: {
						'svix-id': 'msg_raw',
						'svix-timestamp': now,
						'svix-signature': sign(rawBody),
					},
					rawBody: reconstructed,
					payload,
				} as never,
				secret,
			).valid,
		).toBe(false);
	});

	it('rejects stale timestamps', () => {
		const secret = 'whsec_dGVzdA==';
		const rawBody = '{"type":"resource.ready_with_update"}';
		const now = Math.floor(Date.now() / 1000);
		const sign = (msgId: string, timestamp: string) =>
			`v1,${createHmac('sha256', Buffer.from('dGVzdA==', 'base64'))
				.update(`${msgId}.${timestamp}.${rawBody}`)
				.digest('base64')}`;

		const stale = String(now - FARADAY_WEBHOOK_TOLERANCE_SECONDS - 1);
		const future = String(now + FARADAY_WEBHOOK_TOLERANCE_SECONDS + 1);
		const signedOutOfWindow = (msgId: string, ts: string) =>
			({
				headers: {
					'svix-id': msgId,
					'svix-timestamp': ts,
					'svix-signature': sign(msgId, ts),
				},
				rawBody,
				payload: {
					timestamp: ts,
					type: 'resource.ready_with_update',
					data: {
						account_id: 'a',
						resource_id: 'b',
						resource_type: 'cohorts',
					},
				},
			}) as never;
		expect(
			verifyFaradayWebhookSignature(
				signedOutOfWindow('msg_stale', stale),
				secret,
				now,
			).valid,
		).toBe(false);
		expect(
			verifyFaradayWebhookSignature(
				signedOutOfWindow('msg_future', future),
				secret,
				now,
			).valid,
		).toBe(false);
	});

	it('rejects a svix-id already stored on corsair_events', async () => {
		const { resourceReady } = await import('./webhooks/resource-ready');
		const secret = 'whsec_dGVzdA==';
		const rawBody = '{"type":"resource.ready_with_update"}';
		const now = String(Math.floor(Date.now() / 1000));
		const msgId = 'msg_once';
		const signature = `v1,${createHmac(
			'sha256',
			Buffer.from('dGVzdA==', 'base64'),
		)
			.update(`${msgId}.${now}.${rawBody}`)
			.digest('base64')}`;
		const request = {
			headers: {
				'svix-id': msgId,
				'svix-timestamp': now,
				'svix-signature': signature,
			},
			rawBody,
			payload: {
				timestamp: now,
				type: 'resource.ready_with_update',
				data: {
					account_id: 'a',
					resource_id: 'b',
					resource_type: 'cohorts',
				},
			},
		};
		const seen = new Set<string>([msgId]);
		const ctx = {
			key: secret,
			$getAccountId: async () => 'acct',
			database: {
				db: {
					selectFrom: () => ({
						select: () => ({
							where: (_c: string, _op: string, id: string) => ({
								executeTakeFirst: async () =>
									seen.has(id) ? { id } : undefined,
							}),
						}),
					}),
					insertInto: () => ({
						values: (row: { id: string }) => ({
							execute: async () => {
								if (seen.has(row.id)) throw new Error('unique');
								seen.add(row.id);
							},
						}),
					}),
				},
			},
		};
		const replayed = await resourceReady.handler(
			ctx as never,
			request as never,
		);
		expect(replayed.success).toBe(false);
		expect(replayed.statusCode).toBe(409);
	});

	it('retries after a failed event insert', async () => {
		const { resourceReady } = await import('./webhooks/resource-ready');
		const secret = 'whsec_dGVzdA==';
		const rawBody = '{"type":"resource.ready_with_update"}';
		const now = String(Math.floor(Date.now() / 1000));
		const msgId = 'msg_retry';
		const signature = `v1,${createHmac(
			'sha256',
			Buffer.from('dGVzdA==', 'base64'),
		)
			.update(`${msgId}.${now}.${rawBody}`)
			.digest('base64')}`;
		const request = {
			headers: {
				'svix-id': msgId,
				'svix-timestamp': now,
				'svix-signature': signature,
			},
			rawBody,
			payload: {
				timestamp: now,
				type: 'resource.ready_with_update',
				data: {
					account_id: 'a',
					resource_id: 'b',
					resource_type: 'cohorts',
				},
			},
		};
		jest.mocked(logEventFromContext).mockResolvedValueOnce(null);
		const failed = await resourceReady.handler(
			{ key: secret } as never,
			request as never,
		);
		expect(failed.success).toBe(false);
		jest.mocked(logEventFromContext).mockResolvedValueOnce('evt-2');
		const retried = await resourceReady.handler(
			{ key: secret } as never,
			request as never,
		);
		expect(retried.success).toBe(true);
	});
});

describe('endpoint schemas', () => {
	it('declares input and output schemas for every op', () => {
		for (const op of FARADAY_OPS) {
			expect(FaradayEndpointInputSchemas[opKey(op)]).toBeDefined();
			expect(FaradayEndpointOutputSchemas[opKey(op)]).toBeDefined();
		}
	});

	it('rejects patch inputs without a resource id', () => {
		expect(
			FaradayEndpointInputSchemas['accounts.update'].safeParse({}).success,
		).toBe(false);
		expect(
			FaradayEndpointInputSchemas['accounts.update'].safeParse({
				account_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
				name: 'Acme',
			}).success,
		).toBe(true);
	});
});
