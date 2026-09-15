import { AuthMissingError } from 'corsair/core';
import { CloseAPIError, CloseRateLimitError, makeCloseRequest } from './client';
import {
	activitiesCreateNote,
	activitiesListCalls,
	activitiesListEmails,
	activitiesListNotes,
	contactsCreate,
	contactsDelete,
	contactsGet,
	contactsList,
	contactsUpdate,
	customFieldsListContact,
	customFieldsListLead,
	leadsCreate,
	leadsDelete,
	leadsGet,
	leadsList,
	leadsUpdate,
	opportunitiesCreate,
	opportunitiesDelete,
	opportunitiesGet,
	opportunitiesList,
	opportunitiesUpdate,
	tasksCreate,
	tasksDelete,
	tasksGet,
	tasksList,
	tasksUpdate,
	usersGetMe,
	usersList,
} from './endpoints';
import { errorHandlers } from './error-handlers';
import { close } from './index';
import { CloseSchema } from './schema';

const originalFetch = globalThis.fetch;

function jsonResponse(
	body: unknown,
	status = 200,
	headers: Record<string, string> = {},
) {
	const h = new Headers({
		'content-type': 'application/json',
		...headers,
	});
	return {
		ok: status >= 200 && status < 300,
		status,
		statusText:
			status === 401
				? 'Unauthorized'
				: status === 429
					? 'Too Many Requests'
					: 'OK',
		headers: h,
		text: async () => (body === undefined ? '' : JSON.stringify(body)),
		json: async () => body,
		arrayBuffer: async () => new ArrayBuffer(0),
	} as unknown as Response;
}

beforeEach(() => {
	globalThis.fetch = jest.fn(async () =>
		jsonResponse({ id: 'test_123', data: [] }),
	);
});

afterEach(() => {
	globalThis.fetch = originalFetch;
});

const ctx = { key: 'test_api_key' } as never;

describe('Close plugin initialization & metadata', () => {
	it('initializes with default options', () => {
		const plugin = close({ key: 'test_api_key' });
		expect(plugin.id).toBe('close');
		expect((plugin.options as { authType?: string }).authType).toBe('api_key');
		expect(plugin.endpoints?.leads).toBeDefined();
		expect(plugin.endpoints?.contacts).toBeDefined();
		expect(plugin.endpoints?.opportunities).toBeDefined();
		expect(plugin.endpoints?.tasks).toBeDefined();
		expect(plugin.endpoints?.activities).toBeDefined();
		expect(plugin.endpoints?.users).toBeDefined();
		expect(plugin.endpoints?.customFields).toBeDefined();
	});

	it('declares semver schema and entities', () => {
		expect(CloseSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(Object.keys(CloseSchema.entities).length).toBeGreaterThan(0);
	});

	it('matches tenant webhook payloads correctly', () => {
		const plugin = close({ key: 'test_api_key' });
		const match = plugin.pluginTenantWebhookMatcher?.({
			headers: {},
			body: JSON.stringify({ organization_id: 'orga_999' }),
		});
		expect(match).toEqual({
			linkType: 'organization_id',
			externalId: 'orga_999',
		});
	});

	it('returns explicit key from keyBuilder', async () => {
		const plugin = close({ key: 'explicit_key' });
		const result = await plugin.keyBuilder?.(
			{
				authType: 'api_key',
				keys: { get_api_key: async () => 'stored_key' },
			} as never,
			'endpoint',
		);
		expect(result).toBe('explicit_key');
	});

	it('throws AuthMissingError when no key is provided', async () => {
		const plugin = close();
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

describe('Close API endpoints behavioral coverage', () => {
	it.each([
		['leads.list', 'GET', 'lead/', leadsList, {}, { data: [{ id: 'lead_1' }] }],
		[
			'leads.get',
			'GET',
			'lead/lead_1/',
			leadsGet,
			{ id: 'lead_1' },
			{ id: 'lead_1' },
		],
		[
			'leads.create',
			'POST',
			'lead/',
			leadsCreate,
			{ name: 'Acme' },
			{ id: 'lead_1', name: 'Acme' },
		],
		[
			'leads.update',
			'PUT',
			'lead/lead_1/',
			leadsUpdate,
			{ id: 'lead_1', name: 'Acme 2' },
			{ id: 'lead_1', name: 'Acme 2' },
		],
		[
			'leads.delete',
			'DELETE',
			'lead/lead_1/',
			leadsDelete,
			{ id: 'lead_1' },
			{ success: true, id: 'lead_1' },
		],
		[
			'contacts.list',
			'GET',
			'contact/',
			contactsList,
			{},
			{ data: [{ id: 'cont_1' }] },
		],
		[
			'contacts.get',
			'GET',
			'contact/cont_1/',
			contactsGet,
			{ id: 'cont_1' },
			{ id: 'cont_1' },
		],
		[
			'contacts.create',
			'POST',
			'contact/',
			contactsCreate,
			{ lead_id: 'lead_1', name: 'John' },
			{ id: 'cont_1', name: 'John' },
		],
		[
			'contacts.update',
			'PUT',
			'contact/cont_1/',
			contactsUpdate,
			{ id: 'cont_1', name: 'Jane' },
			{ id: 'cont_1', name: 'Jane' },
		],
		[
			'contacts.delete',
			'DELETE',
			'contact/cont_1/',
			contactsDelete,
			{ id: 'cont_1' },
			{ success: true, id: 'cont_1' },
		],
		[
			'opportunities.list',
			'GET',
			'opportunity/',
			opportunitiesList,
			{},
			{ data: [{ id: 'opp_1' }] },
		],
		[
			'opportunities.get',
			'GET',
			'opportunity/opp_1/',
			opportunitiesGet,
			{ id: 'opp_1' },
			{ id: 'opp_1' },
		],
		[
			'opportunities.create',
			'POST',
			'opportunity/',
			opportunitiesCreate,
			{ lead_id: 'lead_1', status_id: 'stat_1', value: 1000 },
			{ id: 'opp_1', value: 1000 },
		],
		[
			'opportunities.update',
			'PUT',
			'opportunity/opp_1/',
			opportunitiesUpdate,
			{ id: 'opp_1', value: 2000 },
			{ id: 'opp_1', value: 2000 },
		],
		[
			'opportunities.delete',
			'DELETE',
			'opportunity/opp_1/',
			opportunitiesDelete,
			{ id: 'opp_1' },
			{ success: true, id: 'opp_1' },
		],
		['tasks.list', 'GET', 'task/', tasksList, {}, { data: [{ id: 'task_1' }] }],
		[
			'tasks.get',
			'GET',
			'task/task_1/',
			tasksGet,
			{ id: 'task_1' },
			{ id: 'task_1' },
		],
		[
			'tasks.create',
			'POST',
			'task/',
			tasksCreate,
			{ lead_id: 'lead_1', text: 'Call back' },
			{ id: 'task_1', text: 'Call back' },
		],
		[
			'tasks.update',
			'PUT',
			'task/task_1/',
			tasksUpdate,
			{ id: 'task_1', is_complete: true },
			{ id: 'task_1', is_complete: true },
		],
		[
			'tasks.delete',
			'DELETE',
			'task/task_1/',
			tasksDelete,
			{ id: 'task_1' },
			{ success: true, id: 'task_1' },
		],
		[
			'activities.listNotes',
			'GET',
			'activity/note/',
			activitiesListNotes,
			{},
			{ data: [{ id: 'note_1' }] },
		],
		[
			'activities.createNote',
			'POST',
			'activity/note/',
			activitiesCreateNote,
			{ lead_id: 'lead_1', note: 'Meeting' },
			{ id: 'note_1', note: 'Meeting' },
		],
		[
			'activities.listCalls',
			'GET',
			'activity/call/',
			activitiesListCalls,
			{},
			{ data: [{ id: 'call_1' }] },
		],
		[
			'activities.listEmails',
			'GET',
			'activity/email/',
			activitiesListEmails,
			{},
			{ data: [{ id: 'email_1' }] },
		],
		[
			'users.getMe',
			'GET',
			'me/',
			usersGetMe,
			{},
			{ id: 'user_1', first_name: 'Alice' },
		],
		['users.list', 'GET', 'user/', usersList, {}, { data: [{ id: 'user_1' }] }],
		[
			'customFields.listLead',
			'GET',
			'custom_field/lead/',
			customFieldsListLead,
			{},
			{ data: [{ id: 'cf_1' }] },
		],
		[
			'customFields.listContact',
			'GET',
			'custom_field/contact/',
			customFieldsListContact,
			{},
			{ data: [{ id: 'cf_2' }] },
		],
	] as const)(
		'%s → %s %s',
		async (_name, method, endpoint, handler, input, mockResponse) => {
			globalThis.fetch = jest.fn(async () => jsonResponse(mockResponse));
			const result = await (
				handler as (c: typeof ctx, i: unknown) => Promise<unknown>
			)(ctx, input);
			expect(result).toBeDefined();
			expect(globalThis.fetch).toHaveBeenCalled();
			const [calledUrl, init] = (globalThis.fetch as jest.Mock).mock
				.calls[0] as [string, RequestInit];
			expect(init.method).toBe(method);
			expect(calledUrl).toContain(endpoint);
		},
	);
});

describe('Error handling & rate limits', () => {
	it('preserves 429 Retry-After metadata on CloseRateLimitError', async () => {
		globalThis.fetch = jest.fn(async () =>
			jsonResponse({ error: 'rate_limit_exceeded' }, 429, {
				'retry-after': '5',
			}),
		);
		const err = await makeCloseRequest('lead/', 'key_123').catch((e) => e);
		expect(err).toBeInstanceOf(CloseRateLimitError);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(err as Error)).toBe(true);
		const handled = await errorHandlers.RATE_LIMIT_ERROR.handler(err as Error);
		expect(handled.headersRetryAfterMs).toBe(5000);
	});

	it('maps 401 unauthorized to CloseAPIError', async () => {
		globalThis.fetch = jest.fn(async () =>
			jsonResponse({ error: 'Unauthorized API key' }, 401),
		);
		const err = await makeCloseRequest('lead/', 'bad_key').catch((e) => e);
		expect(err).toBeInstanceOf(CloseAPIError);
		expect(errorHandlers.AUTH_ERROR.match(err as Error)).toBe(true);
	});
});
