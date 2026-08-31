import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import {
	DripcelAPIError,
	DripcelRateLimitError,
	makeDripcelRequest,
} from './client';
import * as Catalog from './endpoints/catalog';
import * as Contacts from './endpoints/contacts';
import * as Messaging from './endpoints/messaging';
import { dripcel } from './index';

jest.mock('corsair/core', () => {
	class AuthMissingError extends Error {
		constructor(plugin: string, authType: string) {
			super(`Missing ${authType} for ${plugin}`);
			this.name = 'AuthMissingError';
		}
	}
	return {
		AuthMissingError,
		logEventFromContext: jest.fn(),
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
	mockRequest.mockResolvedValue({ ok: true, data: {} } as never);
});

const ctx = {
	key: 'test-api-key',
	$getAccountId: async () => 'test-account',
} as never;

function lastCall() {
	expect(mockRequest).toHaveBeenCalled();
	const call = mockRequest.mock.calls[0];
	expect(call).toBeDefined();
	return { config: call?.[0], options: call?.[1] };
}

describe('Dripcel plugin', () => {
	it('instantiates with api_key auth and 18 endpoints', () => {
		const plugin = dripcel();
		expect(plugin.id).toBe('dripcel');
		expect(plugin.authConfig?.api_key?.account).toEqual(['one']);
		expect(Object.keys(plugin.endpointSchemas ?? {})).toHaveLength(18);
		expect(plugin.webhooks).toEqual({});
	});

	it('returns an explicit key from keyBuilder', async () => {
		const plugin = dripcel({ key: 'explicit-key' });
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
		const plugin = dripcel();
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

describe('official Dripcel request mapping', () => {
	it('GET /contacts/:cell', async () => {
		mockRequest.mockResolvedValue({
			ok: true,
			data: { cell: '0821234567', firstname: 'John' },
		} as never);
		const result = await Contacts.get(ctx, { cell: '0821234567' });
		const { config, options } = lastCall();
		expect(config?.BASE).toBe('https://api.dripcel.com');
		expect(options?.method).toBe('GET');
		expect(options?.url).toBe('/contacts/0821234567');
		expect(result.firstname).toBe('John');
	});

	it('POST /contacts', async () => {
		mockRequest.mockResolvedValue({
			ok: true,
			data: { validContact: 1, invalidContacts: [] },
		} as never);
		const result = await Contacts.create(ctx, {
			country: 'ZA',
			contacts: [{ cell: '0821234567', firstname: 'John' }],
		});
		const { options } = lastCall();
		expect(options?.method).toBe('POST');
		expect(options?.url).toBe('/contacts');
		expect(result.validContacts).toBe(1);
	});

	it('PUT /contacts', async () => {
		mockRequest.mockResolvedValue({
			ok: true,
			data: { validContacts: 1, invalidContacts: [] },
		} as never);
		await Contacts.upsert(ctx, {
			contacts: [{ cell: '0821234567' }],
		});
		const { options } = lastCall();
		expect(options?.method).toBe('PUT');
		expect(options?.url).toBe('/contacts');
	});

	it('DELETE /contacts/:cell', async () => {
		mockRequest.mockResolvedValue({ ok: true } as never);
		const result = await Contacts.deleteContact(ctx, { cell: '0821234567' });
		const { options } = lastCall();
		expect(options?.method).toBe('DELETE');
		expect(options?.url).toBe('/contacts/0821234567');
		expect(result).toEqual({ ok: true });
	});

	it('PUT /contacts/:cell/tag/add', async () => {
		mockRequest.mockResolvedValue({
			ok: true,
			data: { matchedCount: 1, modifiedCount: 1 },
		} as never);
		const result = await Contacts.addTags(ctx, {
			cell: '0821234567',
			tag_ids: ['tag1'],
			create_missing_contact: true,
		});
		const { options } = lastCall();
		expect(options?.method).toBe('PUT');
		expect(options?.url).toBe('/contacts/0821234567/tag/add');
		expect(options?.body).toEqual({
			tag_ids: ['tag1'],
			create_missing_contact: true,
		});
		expect(result.modifiedCount).toBe(1);
	});

	it('POST /contacts/:cell/optOut', async () => {
		mockRequest.mockResolvedValue({
			ok: true,
			data: { matchedCount: 1, modifiedCount: 1 },
		} as never);
		await Contacts.optOut(ctx, { cell: '0821234567', all: true });
		const { options } = lastCall();
		expect(options?.method).toBe('POST');
		expect(options?.url).toBe('/contacts/0821234567/optOut');
		expect(options?.body).toEqual({ all: true });
	});

	it('POST /compliance/send', async () => {
		mockRequest.mockResolvedValue({
			ok: true,
			data: {
				credits_used: 0.14,
				results: [{ cell: '0821234567', can_send: true }],
			},
		} as never);
		const result = await Messaging.checkSend(ctx, {
			cells: ['0821234567'],
			country: 'ZA',
			campaign_id: 'c1',
		});
		const { options } = lastCall();
		expect(options?.method).toBe('POST');
		expect(options?.url).toBe('/compliance/send');
		expect(options?.query).toEqual({ campaign_id: 'c1' });
		expect(options?.body).toEqual({
			cells: ['0821234567'],
			country: 'ZA',
		});
		expect(result.credits_used).toBe(0.14);
	});

	it('GET /deliveries', async () => {
		mockRequest.mockResolvedValue({
			ok: true,
			data: [{ cell: '0821234567' }],
		} as never);
		const result = await Messaging.listDeliveries(ctx, {
			cell: '0821234567',
		});
		const { options } = lastCall();
		expect(options?.method).toBe('GET');
		expect(options?.url).toBe('/deliveries');
		expect(options?.query).toEqual({
			cell: '0821234567',
			customerId: undefined,
		});
		expect(result.deliveries).toHaveLength(1);
	});

	it('GET /campaigns', async () => {
		mockRequest.mockResolvedValue({ ok: true, data: [] } as never);
		const result = await Catalog.listCampaigns(ctx, {});
		const { options } = lastCall();
		expect(options?.method).toBe('GET');
		expect(options?.url).toBe('/campaigns');
		expect(result.campaigns).toEqual([]);
	});

	it('GET /balance', async () => {
		mockRequest.mockResolvedValue({ ok: true, data: 35 } as never);
		const result = await Catalog.getBalance(ctx, {});
		const { options } = lastCall();
		expect(options?.method).toBe('GET');
		expect(options?.url).toBe('/balance');
		expect(result.balance).toBe(35);
	});

	it('GET /email/templates', async () => {
		mockRequest.mockResolvedValue({
			ok: true,
			data: { templates: [] },
		} as never);
		const result = await Catalog.listEmailTemplates(ctx, {});
		const { options } = lastCall();
		expect(options?.url).toBe('/email/templates');
		expect(result.templates).toEqual([]);
	});

	it('POST /sales', async () => {
		mockRequest.mockResolvedValue({ ok: true } as never);
		const result = await Catalog.uploadSales(ctx, {
			sales: [{ cell: '0111111111', campaign_id: 'c1' }],
		});
		const { options } = lastCall();
		expect(options?.method).toBe('POST');
		expect(options?.url).toBe('/sales');
		expect(options?.body).toEqual([{ cell: '0111111111', campaign_id: 'c1' }]);
		expect(result).toEqual({ ok: true });
	});

	it('GET /tags', async () => {
		mockRequest.mockResolvedValue({
			ok: true,
			data: [{ _id: 't1', name: 'First Tag' }],
		} as never);
		const result = await Catalog.listTags(ctx, {});
		const { options } = lastCall();
		expect(options?.url).toBe('/tags');
		expect(result.tags[0]?.name).toBe('First Tag');
	});

	it('DELETE /tags/:tag_id', async () => {
		mockRequest.mockResolvedValue({
			ok: true,
			data: { _id: 't1', name: 'First Tag' },
		} as never);
		const result = await Catalog.deleteTag(ctx, { tag_id: 't1' });
		const { options } = lastCall();
		expect(options?.method).toBe('DELETE');
		expect(options?.url).toBe('/tags/t1');
		expect(result._id).toBe('t1');
	});

	it('POST /replies/search', async () => {
		mockRequest.mockResolvedValue({ ok: true, data: [] } as never);
		const result = await Messaging.searchReplies(ctx, { kind: 'optOut' });
		const { options } = lastCall();
		expect(options?.method).toBe('POST');
		expect(options?.url).toBe('/replies/search');
		expect(result.replies).toEqual([]);
	});

	it('POST /send-logs/search', async () => {
		mockRequest.mockResolvedValue({
			ok: true,
			data: { total: 0, send_logs: [], parsed: {} },
		} as never);
		const result = await Messaging.searchSendLogs(ctx, {
			options: { skip: 0, limit: 10 },
		});
		const { options } = lastCall();
		expect(options?.method).toBe('POST');
		expect(options?.url).toBe('/send-logs/search');
		expect(options?.body).toEqual({
			options: { skip: 0, limit: 10 },
			find: {},
		});
		expect(result.total).toBe(0);
	});

	it('POST /send/sms', async () => {
		mockRequest.mockResolvedValue({
			ok: true,
			data: { customerId: 's1', totalCost: 0.1 },
		} as never);
		const result = await Messaging.sms(ctx, {
			content: 'Hello',
			cell: '0821234567',
			skipNonContacts: true,
			country: 'ZA',
			deliveryMethod: 'reverse',
			sendOptions: { testMode: true },
		});
		const { options } = lastCall();
		expect(options?.method).toBe('POST');
		expect(options?.url).toBe('/send/sms');
		expect(result.customerId).toBe('s1');
	});

	it('POST /send/email/bulk', async () => {
		mockRequest.mockResolvedValue({ ok: true, data: {} } as never);
		await Messaging.bulkEmail(ctx, {
			from: 'a@example.com',
			template_id: 'tpl1',
			destinations: ['b@example.com'],
		});
		const { options } = lastCall();
		expect(options?.method).toBe('POST');
		expect(options?.url).toBe('/send/email/bulk');
	});
});

describe('Dripcel client errors', () => {
	it('unwraps ok:false envelopes', async () => {
		mockRequest.mockResolvedValue({
			ok: false,
			error: 'Contact not found',
		} as never);
		await expect(makeDripcelRequest('/contacts/1', 'k')).rejects.toThrow(
			'Contact not found',
		);
	});

	it('preserves 429 retry metadata', async () => {
		mockRequest.mockRejectedValue(
			new ApiError(
				{ method: 'GET', url: '/balance' },
				{
					url: 'https://api.dripcel.com/balance',
					ok: false,
					status: 429,
					statusText: 'Too Many Requests',
					body: { ok: false, error: { resetsAt: 1, remaining: 0 } },
				},
				'Too Many Requests',
				{ retryAfter: 1000 },
			),
		);
		const err = await makeDripcelRequest('/balance', 'k').catch(
			(error: unknown) => error,
		);
		expect(err).toBeInstanceOf(DripcelRateLimitError);
		expect((err as DripcelRateLimitError).status).toBe(429);
		expect((err as DripcelRateLimitError).retryAfterMs).toBe(1000);
	});

	it('maps HTTP errors to DripcelAPIError', async () => {
		mockRequest.mockRejectedValue(
			new ApiError(
				{ method: 'GET', url: '/balance' },
				{
					url: 'https://api.dripcel.com/balance',
					ok: false,
					status: 401,
					statusText: 'Unauthorized',
					body: { ok: false, error: 'Unauthorized' },
				},
				'Unauthorized',
			),
		);
		const err = await makeDripcelRequest('/balance', 'k').catch(
			(error: unknown) => error,
		);
		expect(err).toBeInstanceOf(DripcelAPIError);
		expect((err as DripcelAPIError).status).toBe(401);
	});
});
