import { AuthMissingError, logEventFromContext } from 'corsair/core';
import {
	DripcelAPIError,
	DripcelRateLimitError,
	makeDripcelRequest,
} from './client';
import * as Catalog from './endpoints/catalog';
import * as Contacts from './endpoints/contacts';
import * as Messaging from './endpoints/messaging';
import {
	CreateContactsInputSchema,
	UploadSalesInputSchema,
} from './endpoints/types';
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

const mockFetch = jest.fn();

beforeAll(() => {
	globalThis.fetch = mockFetch as typeof fetch;
});

beforeEach(() => {
	mockFetch.mockReset();
	jest.mocked(logEventFromContext).mockReset();
	mockFetch.mockResolvedValue(jsonResponse({ ok: true, data: {} }));
});

const ctx = {
	key: 'test-api-key',
	$getAccountId: async () => 'test-account',
} as never;

function jsonResponse(body: unknown, init?: ResponseInit): Response {
	const headers = new Headers({
		'Content-Type': 'application/json',
		...(init?.headers as Record<string, string>),
	});
	return new Response(JSON.stringify(body), {
		status: 200,
		...init,
		headers,
	});
}

function lastCall() {
	expect(mockFetch).toHaveBeenCalled();
	const [input, init] = mockFetch.mock.calls[0] as [
		string | URL | Request,
		RequestInit | undefined,
	];
	const url =
		typeof input === 'string'
			? input
			: input instanceof URL
				? input.toString()
				: input.url;
	const parsed = new URL(url);
	return {
		url,
		path: parsed.pathname,
		query: Object.fromEntries(parsed.searchParams.entries()),
		method: init?.method,
		body: init?.body ? JSON.parse(String(init.body)) : undefined,
		auth: new Headers(init?.headers).get('Authorization'),
	};
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

	it('requires cell on contact upload and campaign_id plus cell on sales', () => {
		expect(() => CreateContactsInputSchema.parse({ contacts: [{}] })).toThrow();
		expect(
			CreateContactsInputSchema.parse({
				contacts: [{ cell: '0821234567', firstname: 'Jane' }],
			}).contacts[0]?.firstname,
		).toBe('Jane');
		expect(() => UploadSalesInputSchema.parse({ sales: [{}] })).toThrow();
	});
});

describe('official Dripcel request mapping', () => {
	it('GET /contacts/:cell', async () => {
		mockFetch.mockResolvedValue(
			jsonResponse({
				ok: true,
				data: { cell: '0821234567', firstname: 'John' },
			}),
		);
		const result = await Contacts.get(ctx, { cell: '0821234567' });
		const call = lastCall();
		const parsed = new URL(call.url);
		expect(parsed.protocol).toBe('https:');
		expect(parsed.hostname).toBe('api.dripcel.com');
		expect(call.method).toBe('GET');
		expect(call.path).toBe('/contacts/0821234567');
		expect(result.firstname).toBe('John');
	});

	it('POST /contacts', async () => {
		mockFetch.mockResolvedValue(
			jsonResponse({
				ok: true,
				data: { validContact: 1, invalidContacts: [] },
			}),
		);
		const result = await Contacts.create(ctx, {
			country: 'ZA',
			contacts: [{ cell: '0821234567', firstname: 'John' }],
		});
		const call = lastCall();
		expect(call.method).toBe('POST');
		expect(call.path).toBe('/contacts');
		expect(result.validContacts).toBe(1);
	});

	it('PUT /contacts', async () => {
		mockFetch.mockResolvedValue(
			jsonResponse({
				ok: true,
				data: { validContacts: 1, invalidContacts: [] },
			}),
		);
		await Contacts.upsert(ctx, {
			contacts: [{ cell: '0821234567' }],
		});
		const call = lastCall();
		expect(call.method).toBe('PUT');
		expect(call.path).toBe('/contacts');
	});

	it('DELETE /contacts/:cell', async () => {
		mockFetch.mockResolvedValue(jsonResponse({ ok: true }));
		const result = await Contacts.deleteContact(ctx, { cell: '0821234567' });
		const call = lastCall();
		expect(call.method).toBe('DELETE');
		expect(call.path).toBe('/contacts/0821234567');
		expect(result).toEqual({ ok: true });
	});

	it('PUT /contacts/:cell/tag/add', async () => {
		mockFetch.mockResolvedValue(
			jsonResponse({
				ok: true,
				data: { matchedCount: 1, modifiedCount: 1 },
			}),
		);
		const result = await Contacts.addTags(ctx, {
			cell: '0821234567',
			tag_ids: ['tag1'],
			create_missing_contact: true,
		});
		const call = lastCall();
		expect(call.method).toBe('PUT');
		expect(call.path).toBe('/contacts/0821234567/tag/add');
		expect(call.body).toEqual({
			tag_ids: ['tag1'],
			create_missing_contact: true,
		});
		expect(result.modifiedCount).toBe(1);
	});

	it('POST /contacts/:cell/optOut', async () => {
		mockFetch.mockResolvedValue(
			jsonResponse({
				ok: true,
				data: { matchedCount: 1, modifiedCount: 1 },
			}),
		);
		await Contacts.optOut(ctx, { cell: '0821234567', all: true });
		const call = lastCall();
		expect(call.method).toBe('POST');
		expect(call.path).toBe('/contacts/0821234567/optOut');
		expect(call.body).toEqual({ all: true });
	});

	it('POST /compliance/send', async () => {
		mockFetch.mockResolvedValue(
			jsonResponse({
				ok: true,
				data: {
					credits_used: 0.14,
					results: [{ cell: '0821234567', can_send: true }],
				},
			}),
		);
		const result = await Messaging.checkSend(ctx, {
			cells: ['0821234567'],
			country: 'ZA',
			campaign_id: 'c1',
		});
		const call = lastCall();
		expect(call.method).toBe('POST');
		expect(call.path).toBe('/compliance/send');
		expect(call.query).toEqual({ campaign_id: 'c1' });
		expect(call.body).toEqual({
			cells: ['0821234567'],
			country: 'ZA',
		});
		expect(result.credits_used).toBe(0.14);
	});

	it('GET /deliveries', async () => {
		mockFetch.mockResolvedValue(
			jsonResponse({
				ok: true,
				data: [{ cell: '0821234567' }],
			}),
		);
		const result = await Messaging.listDeliveries(ctx, {
			cell: '0821234567',
		});
		const call = lastCall();
		expect(call.method).toBe('GET');
		expect(call.path).toBe('/deliveries');
		expect(call.query).toEqual({ cell: '0821234567' });
		expect(result.deliveries).toHaveLength(1);
	});

	it('GET /campaigns', async () => {
		mockFetch.mockResolvedValue(jsonResponse({ ok: true, data: [] }));
		const result = await Catalog.listCampaigns(ctx, {});
		const call = lastCall();
		expect(call.method).toBe('GET');
		expect(call.path).toBe('/campaigns');
		expect(result.campaigns).toEqual([]);
	});

	it('GET /balance', async () => {
		mockFetch.mockResolvedValue(jsonResponse({ ok: true, data: 35 }));
		const result = await Catalog.getBalance(ctx, {});
		const call = lastCall();
		expect(call.method).toBe('GET');
		expect(call.path).toBe('/balance');
		expect(result.balance).toBe(35);
	});

	it('GET /email/templates', async () => {
		mockFetch.mockResolvedValue(
			jsonResponse({
				ok: true,
				data: { templates: [] },
			}),
		);
		const result = await Catalog.listEmailTemplates(ctx, {});
		const call = lastCall();
		expect(call.path).toBe('/email/templates');
		expect(result.templates).toEqual([]);
	});

	it('POST /sales', async () => {
		mockFetch.mockResolvedValue(jsonResponse({ ok: true }));
		const result = await Catalog.uploadSales(ctx, {
			sales: [{ cell: '0111111111', campaign_id: 'c1' }],
		});
		const call = lastCall();
		expect(call.method).toBe('POST');
		expect(call.path).toBe('/sales');
		expect(call.body).toEqual([{ cell: '0111111111', campaign_id: 'c1' }]);
		expect(result).toEqual({ ok: true });
	});

	it('GET /tags', async () => {
		mockFetch.mockResolvedValue(
			jsonResponse({
				ok: true,
				data: [{ _id: 't1', name: 'First Tag' }],
			}),
		);
		const result = await Catalog.listTags(ctx, {});
		const call = lastCall();
		expect(call.path).toBe('/tags');
		expect(result.tags[0]?.name).toBe('First Tag');
	});

	it('DELETE /tags/:tag_id', async () => {
		mockFetch.mockResolvedValue(
			jsonResponse({
				ok: true,
				data: { _id: 't1', name: 'First Tag' },
			}),
		);
		const result = await Catalog.deleteTag(ctx, { tag_id: 't1' });
		const call = lastCall();
		expect(call.method).toBe('DELETE');
		expect(call.path).toBe('/tags/t1');
		expect(result._id).toBe('t1');
	});

	it('POST /replies/search', async () => {
		mockFetch.mockResolvedValue(jsonResponse({ ok: true, data: [] }));
		const result = await Messaging.searchReplies(ctx, { kind: 'optOut' });
		const call = lastCall();
		expect(call.method).toBe('POST');
		expect(call.path).toBe('/replies/search');
		expect(result.replies).toEqual([]);
	});

	it('POST /send-logs/search', async () => {
		mockFetch.mockResolvedValue(
			jsonResponse({
				ok: true,
				data: { total: 0, send_logs: [], parsed: {} },
			}),
		);
		const result = await Messaging.searchSendLogs(ctx, {
			options: { skip: 0, limit: 10 },
		});
		const call = lastCall();
		expect(call.method).toBe('POST');
		expect(call.path).toBe('/send-logs/search');
		expect(call.body).toEqual({
			options: { skip: 0, limit: 10 },
			find: {},
		});
		expect(result.total).toBe(0);
	});

	it('POST /send/sms', async () => {
		mockFetch.mockResolvedValue(
			jsonResponse({
				ok: true,
				data: { customerId: 's1', totalCost: 0.1 },
			}),
		);
		const result = await Messaging.sms(ctx, {
			content: 'Hello',
			cell: '0821234567',
			skipNonContacts: true,
			country: 'ZA',
			deliveryMethod: 'reverse',
			sendOptions: { testMode: true },
		});
		const call = lastCall();
		expect(call.method).toBe('POST');
		expect(call.path).toBe('/send/sms');
		expect(result.customerId).toBe('s1');
	});

	it('POST /send/email/bulk', async () => {
		mockFetch.mockResolvedValue(jsonResponse({ ok: true, data: {} }));
		await Messaging.bulkEmail(ctx, {
			from: 'a@example.com',
			template_id: 'tpl1',
			destinations: ['b@example.com'],
		});
		const call = lastCall();
		expect(call.method).toBe('POST');
		expect(call.path).toBe('/send/email/bulk');
	});
});

describe('Dripcel client errors', () => {
	it('unwraps ok:false envelopes', async () => {
		mockFetch.mockResolvedValue(
			jsonResponse({
				ok: false,
				error: 'Contact not found',
			}),
		);
		await expect(makeDripcelRequest('/contacts/1', 'k')).rejects.toThrow(
			'Contact not found',
		);
	});

	it('preserves 429 retry metadata', async () => {
		mockFetch.mockResolvedValue(
			jsonResponse(
				{ ok: false, error: { resetsAt: 1, remaining: 0 } },
				{
					status: 429,
					headers: { 'Retry-After': '1' },
				},
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
		mockFetch.mockResolvedValue(
			jsonResponse({ ok: false, error: 'Unauthorized' }, { status: 401 }),
		);
		const err = await makeDripcelRequest('/balance', 'k').catch(
			(error: unknown) => error,
		);
		expect(err).toBeInstanceOf(DripcelAPIError);
		expect((err as DripcelAPIError).status).toBe(401);
	});
});
