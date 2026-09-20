import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { SPOKI_BASE_URL } from './client';
import * as endpoints from './endpoints';
import {
	createOrUpdateContact,
	getAccount,
	getAccountByPhone,
	listAccounts,
	listContacts,
	listTemplates,
	retrieveContact,
	sendMessage,
	triggerAutomation,
} from './endpoints';
import {
	spoki,
	spokiAuthConfig,
	spokiEndpointMeta,
	spokiEndpointSchemas,
} from './index';

const accountResponse = {
	id: 13128334,
	name: 'MyShop',
	current_credit: 8556300,
	status: 'Active',
	default_language: 'it',
	phone: '3933312345678',
	has_official_verification: false,
	daily_limit: 100000,
	phone_status: 'Connected',
	quality_score: 1,
	quality_reasons: null,
	is_active: true,
	country_code: '',
	estimated_available_conversations: 85563,
	account_type: 2,
	default_pricing_delta: 0,
	low_credit_threshold: 15000,
	has_low_credit_alert: false,
	default_prefix: '+39',
	default_country_code: 'IT',
	timezone: 'Europe/Rome',
	contacted_in_24h: 150,
	contacted_in_7d: 602,
};

const ctx = { key: 'test-api-key' } as any;

function mockFetchWith(status: number, body: unknown) {
	const payload = typeof body === 'string' ? body : JSON.stringify(body);
	const contentType =
		typeof body === 'string' ? 'text/plain' : 'application/json';
	return jest.spyOn(globalThis, 'fetch').mockResolvedValue(
		new Response(payload, {
			status,
			headers: { 'Content-Type': contentType },
		}),
	);
}

describe('Spoki plugin', () => {
	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('initializes plugin with id = spoki', () => {
		const instance = spoki({ key: 'test-api-key' });
		expect(instance.id).toBe('spoki');
	});

	it('defaults authType to api_key', () => {
		const instance = spoki();
		expect((instance.options as any)?.authType).toBe('api_key');
	});

	it('authConfig only exposes api_key', () => {
		expect(spokiAuthConfig).toHaveProperty('api_key');
		expect(spokiAuthConfig).not.toHaveProperty('oauth_2');
	});

	it('assigns risk levels to all endpoints', () => {
		expect(spokiEndpointMeta['accounts.listAccounts'].riskLevel).toBe('read');
		expect(spokiEndpointMeta['accounts.getAccount'].riskLevel).toBe('read');
		expect(spokiEndpointMeta['accounts.getAccountByPhone'].riskLevel).toBe(
			'read',
		);
		expect(spokiEndpointMeta['messaging.sendMessage'].riskLevel).toBe('write');
		expect(spokiEndpointMeta['automation.triggerAutomation'].riskLevel).toBe(
			'write',
		);
	});

	it('sends the API key on endpoint calls', async () => {
		const mockFetch = mockFetchWith(200, [accountResponse]);

		await listAccounts(ctx, {});

		const headers = new Headers(mockFetch.mock.calls[0]![1]?.headers);
		expect(headers.get('X-Spoki-Api-Key')).toBe('test-api-key');
	});

	it('listAccounts calls GET /api/1/accounts/ and returns the bare array', async () => {
		const mockFetch = mockFetchWith(200, [accountResponse]);

		const result = await listAccounts(ctx, {});

		const [url, options] = mockFetch.mock.calls[0]!;
		expect(url).toBe(`${SPOKI_BASE_URL}/accounts/`);
		expect(options?.method).toBe('GET');
		expect(result).toEqual([accountResponse]);
	});

	it('getAccount calls GET /api/1/accounts/{id}/', async () => {
		const mockFetch = mockFetchWith(200, accountResponse);

		const result = await getAccount(ctx, { accountId: 13128334 });

		const [url, options] = mockFetch.mock.calls[0]!;
		expect(url).toBe(`${SPOKI_BASE_URL}/accounts/13128334/`);
		expect(options?.method).toBe('GET');
		expect(result).toEqual(accountResponse);
	});

	it('getAccountByPhone URL-encodes the phone number', async () => {
		const mockFetch = mockFetchWith(200, accountResponse);

		await getAccountByPhone(ctx, { phone: '+39 333 12345678' });

		const [url] = mockFetch.mock.calls[0]!;
		expect(url).toBe(
			`${SPOKI_BASE_URL}/accounts/phone/${encodeURIComponent('+39 333 12345678')}/`,
		);
	});

	it('sendMessage posts the documented body to /api/1/messages/send/', async () => {
		const mockFetch = mockFetchWith(200, { uuid: 'msg-1' });

		const result = await sendMessage(ctx, {
			phone: '+3933312345678',
			text: 'Hi how can I help you?',
			metadata: { order_id: '1234' },
		});

		const [url, options] = mockFetch.mock.calls[0]!;
		expect(url).toBe(`${SPOKI_BASE_URL}/messages/send/`);
		expect(options?.method).toBe('POST');
		expect(JSON.parse(options?.body as string)).toEqual({
			type: 'Message',
			content_type: 'Text',
			phone: '+3933312345678',
			text: 'Hi how can I help you?',
			metadata: { order_id: '1234' },
		});
		expect(result).toEqual({ uuid: 'msg-1' });
	});

	it('triggerAutomation posts to the absolute automation URL outside /api/1', async () => {
		const mockFetch = mockFetchWith(200, { ok: true });

		const result = await triggerAutomation(ctx, {
			uuid: 'auto-uuid',
			secret: 'whsec-secret',
			phone: '+3933312345678',
			first_name: 'John',
		});

		const [url, options] = mockFetch.mock.calls[0]!;
		expect(url).toBe('https://api.spoki.com/wh/ap/auto-uuid/');
		expect(options?.method).toBe('POST');
		const headers = new Headers(options?.headers);
		expect(headers.get('X-Spoki-Api-Key')).toBeNull();
		expect(JSON.parse(options?.body as string)).toEqual({
			secret: 'whsec-secret',
			phone: '+3933312345678',
			first_name: 'John',
		});
		expect(result).toEqual({ ok: true });
	});

	it('getAccount validates the documented response including channels', async () => {
		mockFetchWith(200, {
			...accountResponse,
			channels: [
				{
					name: 'Main WhatsApp',
					identifier: '3933312345678',
					platform: 'WhatsApp',
					status: 'Active',
					phone_status: '🟢 Connected',
					quality_score: '🟢 Green',
					is_primary: true,
				},
			],
		});

		const result = await getAccount(ctx, { accountId: 13128334 });

		expect(result.channels?.[0]?.platform).toBe('WhatsApp');
	});

	it('rejects malformed account responses', async () => {
		mockFetchWith(200, { id: 1 });
		await expect(getAccount(ctx, { accountId: 1 })).rejects.toThrow();

		mockFetchWith(200, { id: 1 });
		await expect(
			getAccountByPhone(ctx, { phone: '+3933312345678' }),
		).rejects.toThrow();
	});

	it('rejects malformed listAccounts responses', async () => {
		mockFetchWith(200, { accounts: [] });

		await expect(listAccounts(ctx, {})).rejects.toThrow();
	});

	it('rejects a non-object sendMessage response', async () => {
		mockFetchWith(200, 'nope');

		await expect(
			sendMessage(ctx, { phone: '+3933312345678', text: 'Hi' }),
		).rejects.toThrow();
	});

	it('rejects a non-object triggerAutomation response', async () => {
		mockFetchWith(200, ['unexpected']);

		await expect(
			triggerAutomation(ctx, {
				uuid: 'auto-uuid',
				secret: 'whsec-secret',
				phone: '+3933312345678',
			}),
		).rejects.toThrow();
	});

	it('maps the documented empty 200 body from Start Automation to an empty object', async () => {
		jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValue(new Response('', { status: 200 }));

		const result = await triggerAutomation(ctx, {
			uuid: 'auto-uuid',
			secret: 'whsec-secret',
			phone: '+3933312345678',
		});

		expect(result).toEqual({});
	});

	it('rejects invalid input before making an HTTP call', async () => {
		const mockFetch = mockFetchWith(200, {});

		await expect(
			getAccount(ctx, { accountId: 'not-a-number' } as any),
		).rejects.toThrow();
		await expect(
			sendMessage(ctx, { phone: '+3933312345678' } as any),
		).rejects.toThrow();
		await expect(
			triggerAutomation(ctx, { uuid: 'u', phone: '+393' } as any),
		).rejects.toThrow();

		expect(mockFetch).not.toHaveBeenCalled();
	});

	it('listContacts calls GET /api/1/contacts/', async () => {
		const mockFetch = mockFetchWith(200, { results: [] });
		const result = await listContacts(ctx, { search: 'anna' });
		expect(mockFetch.mock.calls[0]![0]).toBe(
			`${SPOKI_BASE_URL}/contacts/?search=anna`,
		);
		expect(result).toEqual({ results: [] });
	});

	it('retrieveContact calls GET /api/1/contacts/{id}/', async () => {
		const mockFetch = mockFetchWith(200, { id: 9, phone: '+39333' });
		const result = await retrieveContact(ctx, { id: 9 });
		expect(mockFetch.mock.calls[0]![0]).toBe(`${SPOKI_BASE_URL}/contacts/9/`);
		expect(result).toEqual({ id: 9, phone: '+39333' });
	});

	it('createOrUpdateContact posts to /api/1/contacts/sync/', async () => {
		const mockFetch = mockFetchWith(200, { id: 1 });
		await createOrUpdateContact(ctx, { phone: '+3933312345678' });
		expect(mockFetch.mock.calls[0]![0]).toBe(
			`${SPOKI_BASE_URL}/contacts/sync/`,
		);
		expect(mockFetch.mock.calls[0]![1]?.method).toBe('POST');
	});

	it('listTemplates calls GET /api/1/templates/', async () => {
		const mockFetch = mockFetchWith(200, []);
		await listTemplates(ctx, {});
		expect(mockFetch.mock.calls[0]![0]).toBe(`${SPOKI_BASE_URL}/templates/`);
	});

	it('surfaces SpokiApiError with status for failed calls', async () => {
		mockFetchWith(401, { error: 'Unauthorized' });

		await expect(listAccounts(ctx, {})).rejects.toMatchObject({
			name: 'SpokiApiError',
			status: 401,
		});
	});

	it('forwards pagination query params on list endpoints', async () => {
		const mockFetch = mockFetchWith(200, { results: [] });
		await listContacts(ctx, { search: 'anna', page: 2, limit: 10 });
		const url = String(mockFetch.mock.calls[0]![0]);
		expect(url).toContain('search=anna');
		expect(url).toContain('page=2');
		expect(url).toContain('limit=10');
	});

	it('registers a schema and risk level for every nested endpoint', () => {
		const instance = spoki({ key: 'test-api-key' });
		expect(countFns(instance.endpoints)).toBe(60);
		expect(Object.keys(spokiEndpointMeta)).toHaveLength(60);
		expect(Object.keys(spokiEndpointSchemas)).toHaveLength(60);
		for (const key of Object.keys(spokiEndpointMeta) as Array<
			keyof typeof spokiEndpointMeta
		>) {
			expect(spokiEndpointSchemas[key]).toBeDefined();
			expect(['read', 'write', 'destructive']).toContain(
				spokiEndpointMeta[key].riskLevel,
			);
		}
	});
});

function countFns(value: unknown): number {
	if (typeof value === 'function') return 1;
	if (!value || typeof value !== 'object') return 0;
	let total = 0;
	for (const child of Object.values(value as Record<string, unknown>)) {
		total += countFns(child);
	}
	return total;
}

type EndpointCase = {
	name: keyof typeof endpoints;
	input: unknown;
	method: string;
	url: string;
	response?: unknown;
};

const endpointCases: EndpointCase[] = [
	{
		name: 'listAccounts',
		input: {},
		method: 'GET',
		url: `${SPOKI_BASE_URL}/accounts/`,
		response: [accountResponse],
	},
	{
		name: 'getAccount',
		input: { accountId: 8 },
		method: 'GET',
		url: `${SPOKI_BASE_URL}/accounts/8/`,
		response: accountResponse,
	},
	{
		name: 'getAccountByPhone',
		input: { phone: '+39333' },
		method: 'GET',
		url: `${SPOKI_BASE_URL}/accounts/phone/${encodeURIComponent('+39333')}/`,
		response: accountResponse,
	},
	{
		name: 'getAccountCurrentReport',
		input: { accountId: 8 },
		method: 'GET',
		url: `${SPOKI_BASE_URL}/accounts/8/current_report/`,
	},
	{
		name: 'createAccountOnboardingLink',
		input: { accountId: 8 },
		method: 'POST',
		url: `${SPOKI_BASE_URL}/accounts/8/onboarding/`,
	},
	{
		name: 'listAgencies',
		input: {},
		method: 'GET',
		url: `${SPOKI_BASE_URL}/agencies/`,
	},
	{
		name: 'listAutomations',
		input: {},
		method: 'GET',
		url: `${SPOKI_BASE_URL}/automations/`,
	},
	{
		name: 'retrieveAutomation',
		input: { id: 1 },
		method: 'GET',
		url: `${SPOKI_BASE_URL}/automations/1/`,
	},
	{
		name: 'listCampaigns',
		input: {},
		method: 'GET',
		url: `${SPOKI_BASE_URL}/campaigns/`,
	},
	{
		name: 'updateCampaign',
		input: { id: 1, name: 'n' },
		method: 'PATCH',
		url: `${SPOKI_BASE_URL}/campaigns/1/`,
	},
	{
		name: 'listContacts',
		input: {},
		method: 'GET',
		url: `${SPOKI_BASE_URL}/contacts/`,
	},
	{
		name: 'retrieveContact',
		input: { id: 1 },
		method: 'GET',
		url: `${SPOKI_BASE_URL}/contacts/1/`,
	},
	{
		name: 'createOrUpdateContact',
		input: { phone: '+39333' },
		method: 'POST',
		url: `${SPOKI_BASE_URL}/contacts/sync/`,
	},
	{
		name: 'updateContact',
		input: { id: 1, first_name: 'A' },
		method: 'PATCH',
		url: `${SPOKI_BASE_URL}/contacts/1/`,
	},
	{
		name: 'deleteContact',
		input: { id: 1 },
		method: 'DELETE',
		url: `${SPOKI_BASE_URL}/contacts/1/`,
	},
	{
		name: 'syncContactsBulk',
		input: { contacts: [{ phone: '+39333' }] },
		method: 'POST',
		url: `${SPOKI_BASE_URL}/contacts/sync_all/`,
	},
	{
		name: 'addContactOperator',
		input: { id: 1, operator_id: 2 },
		method: 'POST',
		url: `${SPOKI_BASE_URL}/contacts/1/add_operator/`,
	},
	{
		name: 'removeContactOperator',
		input: { id: 1 },
		method: 'POST',
		url: `${SPOKI_BASE_URL}/contacts/1/remove_operator/`,
	},
	{
		name: 'listCustomFields',
		input: {},
		method: 'GET',
		url: `${SPOKI_BASE_URL}/custom-fields/`,
	},
	{
		name: 'retrieveCustomField',
		input: { id: 1 },
		method: 'GET',
		url: `${SPOKI_BASE_URL}/custom-fields/1/`,
	},
	{
		name: 'createCustomField',
		input: { label: 'vip', code: 'vip' },
		method: 'POST',
		url: `${SPOKI_BASE_URL}/custom-fields/`,
	},
	{
		name: 'updateCustomField',
		input: { id: 1, label: 'vip' },
		method: 'PATCH',
		url: `${SPOKI_BASE_URL}/custom-fields/1/`,
	},
	{
		name: 'deleteCustomField',
		input: { id: 1 },
		method: 'DELETE',
		url: `${SPOKI_BASE_URL}/custom-fields/1/`,
	},
	{
		name: 'listLists',
		input: {},
		method: 'GET',
		url: `${SPOKI_BASE_URL}/lists/`,
	},
	{
		name: 'retrieveList',
		input: { id: 1 },
		method: 'GET',
		url: `${SPOKI_BASE_URL}/lists/1/`,
	},
	{
		name: 'createList',
		input: { name: 'vip' },
		method: 'POST',
		url: `${SPOKI_BASE_URL}/lists/`,
	},
	{
		name: 'deleteList',
		input: { id: 1 },
		method: 'DELETE',
		url: `${SPOKI_BASE_URL}/lists/1/`,
	},
	{
		name: 'removeAllListContacts',
		input: { id: 1 },
		method: 'POST',
		url: `${SPOKI_BASE_URL}/lists/1/remove_all_contacts/`,
	},
	{
		name: 'removeListContacts',
		input: { id: 1, contacts: [1] },
		method: 'POST',
		url: `${SPOKI_BASE_URL}/lists/1/remove_contacts/`,
	},
	{
		name: 'syncListContacts',
		input: { id: 1, contacts: [{ phone: '+39333' }] },
		method: 'POST',
		url: `${SPOKI_BASE_URL}/lists/1/sync_contacts/`,
	},
	{
		name: 'listMedia',
		input: {},
		method: 'GET',
		url: `${SPOKI_BASE_URL}/media/`,
	},
	{
		name: 'retrieveMedia',
		input: { id: 1 },
		method: 'GET',
		url: `${SPOKI_BASE_URL}/media/1/`,
	},
	{
		name: 'createMedia',
		input: { title: 'img' },
		method: 'POST',
		url: `${SPOKI_BASE_URL}/media/`,
	},
	{
		name: 'updateMedia',
		input: { id: 1, title: 'img' },
		method: 'PATCH',
		url: `${SPOKI_BASE_URL}/media/1/`,
	},
	{
		name: 'deleteMedia',
		input: { id: 1 },
		method: 'DELETE',
		url: `${SPOKI_BASE_URL}/media/1/`,
	},
	{
		name: 'listPartners',
		input: {},
		method: 'GET',
		url: `${SPOKI_BASE_URL}/partners/`,
	},
	{
		name: 'listReports',
		input: {},
		method: 'GET',
		url: `${SPOKI_BASE_URL}/reports/`,
	},
	{
		name: 'listRoles',
		input: {},
		method: 'GET',
		url: `${SPOKI_BASE_URL}/roles/`,
	},
	{
		name: 'retrieveRole',
		input: { id: 1 },
		method: 'GET',
		url: `${SPOKI_BASE_URL}/roles/1/`,
	},
	{
		name: 'updateRole',
		input: { id: 1, name: 'ops' },
		method: 'POST',
		url: `${SPOKI_BASE_URL}/roles/1/update_role/`,
	},
	{
		name: 'deleteRole',
		input: { id: 1 },
		method: 'DELETE',
		url: `${SPOKI_BASE_URL}/roles/1/`,
	},
	{
		name: 'addServiceUser',
		input: { email: 'a@b.co', role: 'operator' },
		method: 'POST',
		url: `${SPOKI_BASE_URL}/roles/add_service_user/`,
	},
	{
		name: 'checkRolePrivateKey',
		input: { id: 1 },
		method: 'GET',
		url: `${SPOKI_BASE_URL}/roles/1/has_private_key/`,
	},
	{
		name: 'generateRolePrivateKey',
		input: { id: 1 },
		method: 'POST',
		url: `${SPOKI_BASE_URL}/roles/1/generate_private_key/`,
	},
	{
		name: 'listTags',
		input: {},
		method: 'GET',
		url: `${SPOKI_BASE_URL}/tags/`,
	},
	{
		name: 'retrieveTag',
		input: { id: 1 },
		method: 'GET',
		url: `${SPOKI_BASE_URL}/tags/1/`,
	},
	{
		name: 'listTemplates',
		input: {},
		method: 'GET',
		url: `${SPOKI_BASE_URL}/templates/`,
	},
	{
		name: 'retrieveTemplate',
		input: { id: 1 },
		method: 'GET',
		url: `${SPOKI_BASE_URL}/templates/1/`,
	},
	{
		name: 'createTemplate',
		input: {
			name: 'welcome',
			category: 'MARKETING',
			templatelocalization_set: [],
		},
		method: 'POST',
		url: `${SPOKI_BASE_URL}/templates/`,
	},
	{
		name: 'updateTemplate',
		input: { id: 1, name: 'welcome' },
		method: 'PATCH',
		url: `${SPOKI_BASE_URL}/templates/1/`,
	},
	{
		name: 'deleteTemplate',
		input: { id: 1, force_delete: true },
		method: 'DELETE',
		url: `${SPOKI_BASE_URL}/templates/1/?force_delete=true`,
	},
	{
		name: 'cloneTemplate',
		input: { id: 1 },
		method: 'GET',
		url: `${SPOKI_BASE_URL}/templates/1/clone/`,
	},
	{
		name: 'revertTemplateToDraft',
		input: { id: 1 },
		method: 'POST',
		url: `${SPOKI_BASE_URL}/templates/1/back_to_draft/`,
	},
	{
		name: 'listTickets',
		input: {},
		method: 'GET',
		url: `${SPOKI_BASE_URL}/tickets/`,
	},
	{
		name: 'createTicket',
		input: { subject: 'help' },
		method: 'POST',
		url: `${SPOKI_BASE_URL}/tickets/`,
	},
	{
		name: 'deleteTicket',
		input: { id: 1 },
		method: 'DELETE',
		url: `${SPOKI_BASE_URL}/tickets/1/`,
	},
	{
		name: 'resendInvitation',
		input: { id: 1 },
		method: 'POST',
		url: `${SPOKI_BASE_URL}/invitations/1/send/`,
	},
	{
		name: 'updateInvitationRole',
		input: { id: 1, role: 'admin' },
		method: 'POST',
		url: `${SPOKI_BASE_URL}/invitations/1/update_role/`,
	},
	{
		name: 'sendMessage',
		input: { phone: '+39333', text: 'Hi' },
		method: 'POST',
		url: `${SPOKI_BASE_URL}/messages/send/`,
	},
	{
		name: 'triggerAutomation',
		input: { uuid: 'auto-uuid', secret: 'whsec-secret', phone: '+39333' },
		method: 'POST',
		url: 'https://api.spoki.com/wh/ap/auto-uuid/',
	},
];

describe('Spoki OSS endpoints', () => {
	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('covers every implemented endpoint', () => {
		const exported = Object.keys(endpoints).filter(
			(key) =>
				typeof (endpoints as Record<string, unknown>)[key] === 'function',
		);
		const tested = new Set(endpointCases.map((c) => c.name));
		expect(exported.sort()).toEqual([...tested].sort());
		expect(endpointCases).toHaveLength(60);
	});

	it.each(endpointCases)('$name calls $method $url', async (c) => {
		const mockFetch = mockFetchWith(200, c.response ?? { id: 1 });
		const fn = endpoints[c.name] as (
			context: typeof ctx,
			input: unknown,
		) => Promise<unknown>;
		await fn(ctx, c.input);
		expect(mockFetch.mock.calls[0]![0]).toBe(c.url);
		expect(mockFetch.mock.calls[0]![1]?.method).toBe(c.method);
	});
});
