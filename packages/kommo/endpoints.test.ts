import { logEventFromContext } from 'corsair/core';
import { KommoAPIError } from './client';
import { Account, Companies, Contacts, Leads, Tasks } from './endpoints';
import {
	account,
	companies,
	contact,
	contacts,
	contactsCreated,
	forbidden,
	invalidPayload,
	lead,
	leads,
	leadsCreated,
	leadsWithNext,
	paymentRequired,
	pipelines,
	rateLimited,
	tasks,
	tasksCreated,
	unauthorized,
	users,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'kommo-test-token';
const SUBDOMAIN = 'acme';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant. Each endpoint returns its own output type, so
// the shared return is unknown.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// unknown: negative cases pass values no schema accepts.
function invoke(endpoint: AnyEndpoint, input: unknown) {
	// The fake context carries what the endpoints read: ctx.key, the subdomain
	// option, and the account key manager.
	const ctx = {
		key: API_KEY,
		options: { subdomain: SUBDOMAIN },
		keys: { get_subdomain: jest.fn().mockResolvedValue(SUBDOMAIN) },
	};
	return endpoint(ctx as never, input as never);
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		host: parsed.host,
		path: parsed.pathname,
		query: Object.fromEntries(parsed.searchParams),
		rawQuery: parsed.searchParams,
		method: init.method,
		headers: new Headers(init.headers),
		// unknown: the request body is whatever the endpoint serialized.
		body: init.body ? (JSON.parse(String(init.body)) as unknown) : undefined,
	};
}

function expectAuthenticated() {
	const sent = lastRequest();
	expect(sent.host).toBe('acme.kommo.com');
	expect(sent.path.startsWith('/api/v4/')).toBe(true);
	expect(sent.headers.get('authorization')).toBe(`Bearer ${API_KEY}`);
}

/** The caught rejection, without a cast at each call site. */
// unknown: a promise can reject with any value, so the rejection reason has no
// static type; each caller asserts only on the fields it checks.
async function caught(promise: Promise<unknown>): Promise<unknown> {
	return promise.catch((error: unknown) => error);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('account.get', () => {
	it('GETs the account with a bearer token', async () => {
		respond(account);

		await expect(invoke(Account.account, {})).resolves.toMatchObject({
			id: 35379952,
			subdomain: 'acme',
		});
		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/api/v4/account',
		});
	});
});

describe('leads.list', () => {
	it('GETs the first page and reports no next page on a short one', async () => {
		respond(leads);

		const result = (await invoke(Leads.list, {})) as typeof leads & {
			next_page: number | null;
		};

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/api/v4/leads',
			query: {},
		});
		expect(result._embedded.leads).toHaveLength(2);
		expect(result.next_page).toBeNull();
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'kommo.leads.list',
			{ count: 2 },
			'completed',
		);
	});

	it('offers the next page when Kommo links to one', async () => {
		respond(leadsWithNext);

		await expect(invoke(Leads.list, { limit: 2 })).resolves.toMatchObject({
			next_page: 2,
		});
	});

	it('sends the bracketed filters and the embed list', async () => {
		respond(leads);

		await invoke(Leads.list, {
			page: 2,
			limit: 100,
			query: 'acme',
			with: ['contacts', 'loss_reason'],
			pipeline_id: 12215168,
			responsible_user_id: 11087123,
			created_from: '2026-01-01',
			created_to: '2026-12-01',
			updated_from: '2026-02-01',
			updated_to: '2026-12-01',
			order_by: 'created_at',
			order_direction: 'desc',
		});

		const sent = lastRequest();
		expect(sent.query.with).toBe('contacts,loss_reason');
		expect(sent.query.page).toBe('2');
		expect(sent.query.limit).toBe('100');
		expect(sent.query.query).toBe('acme');
		expect(sent.query['filter[pipeline_id][]']).toBe('12215168');
		expect(sent.query['filter[responsible_user_id][]']).toBe('11087123');
		expect(sent.query['filter[created_at][from]']).toBe('2026-01-01');
		expect(sent.query['filter[created_at][to]']).toBe('2026-12-01');
		expect(sent.query['order[created_at]']).toBe('desc');
	});

	it('keeps fields and timestamps as Kommo sends them', async () => {
		respond(leads);

		const result = (await invoke(Leads.list, {})) as typeof leads;
		const first = result._embedded.leads[0];

		expect(first?.created_at).toBe(1760976072);
		expect(first?.is_deleted).toBe(false);
	});

	it('rejects a body that is not a lead list', async () => {
		respond({ unexpected: true });

		await expect(invoke(Leads.list, {})).rejects.toMatchObject({
			name: 'ZodError',
		});
		expect(mockLog).not.toHaveBeenCalled();
	});

	it.each([
		[{ page: 0 }],
		[{ limit: 0 }],
		[{ limit: 251 }],
		[{ with: [] }],
		[{ order_direction: 'newest' }],
	])('rejects %j before calling Kommo', async (input) => {
		await expect(invoke(Leads.list, input)).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('leads.get', () => {
	it('GETs one lead with its custom fields', async () => {
		respond(lead);

		const result = (await invoke(Leads.get, {
			leadId: 20024930,
		})) as typeof lead;

		expect(result.id).toBe(20024930);
		expect(result.custom_fields_values?.[0]?.field_id).toBe(1928052);
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/api/v4/leads/20024930',
		});
	});

	it('asks for the contacts to be embedded', async () => {
		respond(lead);

		await invoke(Leads.get, { leadId: 1, with: ['contacts'] });

		expect(lastRequest().query.with).toBe('contacts');
	});

	it('surfaces a missing token as an auth error', async () => {
		respond(unauthorized, 401);

		await expect(invoke(Leads.get, { leadId: 1 })).rejects.toMatchObject({
			status: 401,
			isAuthError: true,
			message: 'Kommo 401: The access token is invalid or expired',
		});
	});
});

describe('leads.create', () => {
	it('POSTs an array of leads', async () => {
		respond(leadsCreated, 200);

		await expect(
			invoke(Leads.create, {
				leads: [
					{ name: 'Acme renewal', price: 5000, pipeline_id: 12215168 },
					{ name: 'Northwind trial' },
				],
			}),
		).resolves.toMatchObject({
			_embedded: { leads: [{ id: 20030001 }, { id: 20030002 }] },
		});
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/api/v4/leads',
			body: [
				{ name: 'Acme renewal', price: 5000, pipeline_id: 12215168 },
				{ name: 'Northwind trial' },
			],
		});
		expect(lastRequest().headers.get('content-type')).toBe('application/json');
	});

	it('sends custom field values', async () => {
		respond(leadsCreated);

		await invoke(Leads.create, {
			leads: [
				{
					name: 'Acme renewal',
					custom_fields_values: [
						{
							field_id: 1928052,
							values: [{ value: 'Diagnostic', enum_id: 1669868 }],
						},
					],
				},
			],
		});

		expect(lastRequest().body).toEqual([
			{
				name: 'Acme renewal',
				custom_fields_values: [
					{
						field_id: 1928052,
						values: [{ value: 'Diagnostic', enum_id: 1669868 }],
					},
				],
			},
		]);
	});

	it('surfaces a custom field Kommo refuses', async () => {
		respond(invalidPayload, 400);

		await expect(
			invoke(Leads.create, {
				leads: [
					{
						name: 'Acme renewal',
						custom_fields_values: [{ field_id: 1, values: [{ value: 'x' }] }],
					},
				],
			}),
		).rejects.toMatchObject({ status: 400, isValidationError: true });
	});

	it.each([
		[{}],
		[{ leads: [] }],
		[{ leads: [{ price: 100 }] }],
		[
			{
				leads: [
					{
						name: 'x',
						custom_fields_values: [{ values: [{ value: 'a' }] }],
					},
				],
			},
		],
	])('rejects %j before calling Kommo', async (input) => {
		await expect(invoke(Leads.create, input)).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('leads.update', () => {
	it('PATCHes an array where each lead carries its id', async () => {
		respond({ _embedded: { leads: [{ ...lead, price: 7000 }] } });

		await invoke(Leads.update, {
			leads: [{ id: 20024930, price: 7000 }],
		});

		expect(lastRequest()).toMatchObject({
			method: 'PATCH',
			path: '/api/v4/leads',
			body: [{ id: 20024930, price: 7000 }],
		});
	});

	it('rejects a lead with no id', async () => {
		await expect(
			invoke(Leads.update, { leads: [{ name: 'No id' }] }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('contacts.list', () => {
	it('GETs a page of contacts', async () => {
		respond(contacts);

		const result = (await invoke(Contacts.list, {})) as typeof contacts & {
			next_page: number | null;
		};

		expect(result._embedded.contacts).toHaveLength(1);
		expect(result.next_page).toBeNull();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/api/v4/contacts',
		});
	});
});

describe('contacts.get', () => {
	it('GETs one contact with its phone field', async () => {
		respond(contact);

		const result = (await invoke(Contacts.get, {
			contactId: 30012345,
		})) as typeof contact;

		expect(result.id).toBe(30012345);
		expect(result.custom_fields_values?.[0]?.field_code).toBe('PHONE');
	});
});

describe('contacts.create', () => {
	it('POSTs the contacts', async () => {
		respond(contactsCreated);

		await expect(
			invoke(Contacts.create, {
				contacts: [{ first_name: 'Jordan', last_name: 'Lee' }],
			}),
		).resolves.toMatchObject({ _embedded: { contacts: [{ id: 30019999 }] } });
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/api/v4/contacts',
			body: [{ first_name: 'Jordan', last_name: 'Lee' }],
		});
	});

	it('rejects a contact with no name at all', async () => {
		await expect(
			invoke(Contacts.create, { contacts: [{ responsible_user_id: 1 }] }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('companies.list', () => {
	it('GETs a page of companies', async () => {
		respond(companies);

		await expect(invoke(Companies.list, {})).resolves.toMatchObject({
			_embedded: { companies: [{ id: 29610174, name: 'Acme Logistics' }] },
		});
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/api/v4/companies',
		});
	});
});

describe('tasks.list', () => {
	it('GETs tasks with their Unix deadline', async () => {
		respond(tasks);

		await expect(
			invoke(Tasks.list, { entity_type: 'leads', is_completed: false }),
		).resolves.toMatchObject({
			_embedded: { tasks: [{ complete_till: 1762000000 }] },
		});
		expect(lastRequest().query).toEqual({
			'filter[entity_type]': 'leads',
			'filter[is_completed]': 'false',
		});
	});
});

describe('tasks.create', () => {
	it('POSTs a task with its deadline', async () => {
		respond(tasksCreated);

		await expect(
			invoke(Tasks.create, {
				tasks: [
					{
						entity_id: 20024930,
						entity_type: 'leads',
						text: 'Call about the quote',
						complete_till: 1762000000,
					},
				],
			}),
		).resolves.toMatchObject({ _embedded: { tasks: [{ id: 40019999 }] } });
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/api/v4/tasks',
		});
	});

	it('rejects a task with no deadline, which Kommo requires', async () => {
		await expect(
			invoke(Tasks.create, {
				tasks: [{ entity_id: 1, entity_type: 'leads', text: 'No deadline' }],
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('pipelines.list', () => {
	it('GETs the pipelines with their stages', async () => {
		respond(pipelines);

		const result = (await invoke(Account.pipelines, {})) as typeof pipelines;
		const first = result._embedded.pipelines[0];

		expect(first?.is_main).toBe(true);
		expect(first?._embedded?.statuses?.[0]?.id).toBe(94386187);
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/api/v4/leads/pipelines',
		});
	});
});

describe('users.list', () => {
	it('GETs the account users', async () => {
		respond(users);

		await expect(invoke(Account.users, {})).resolves.toMatchObject({
			_embedded: { users: [{ id: 11087123, name: 'Priya Raman' }] },
		});
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/api/v4/users',
		});
	});
});

describe('the account subdomain', () => {
	it('falls back to the stored credential', async () => {
		respond(leads);

		const ctx = {
			key: API_KEY,
			options: {},
			keys: { get_subdomain: jest.fn().mockResolvedValue('stored-co') },
		};
		await (Leads.list as never as AnyEndpoint)(ctx as never, {} as never);

		expect(lastRequest().host).toBe('stored-co.kommo.com');
	});

	it('fails before a request when no subdomain is known', async () => {
		const ctx = {
			key: API_KEY,
			options: {},
			keys: { get_subdomain: jest.fn().mockResolvedValue(null) },
		};

		const error = await caught(
			(Leads.list as never as AnyEndpoint)(ctx as never, {} as never),
		);

		expect(error).toBeInstanceOf(KommoAPIError);
		expect((error as Error).message).toContain('subdomain');
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('error envelopes', () => {
	it('reads the detail out of a problem+json body', async () => {
		respond(unauthorized, 401);

		await expect(invoke(Leads.list, {})).rejects.toMatchObject({
			status: 401,
			detail: 'The access token is invalid or expired',
			message: 'Kommo 401: The access token is invalid or expired',
			method: 'GET',
		});
	});

	it('reads a forbidden call as a permission failure', async () => {
		respond(forbidden, 403);

		await expect(invoke(Leads.list, {})).rejects.toMatchObject({
			status: 403,
			isPermissionError: true,
		});
	});

	it('reads a plan block as a quota failure, which no retry fixes', async () => {
		respond(paymentRequired, 402);

		const error = await caught(invoke(Leads.list, {}));

		expect(error).toMatchObject({ status: 402 });
	});

	it('reads a rate limit', async () => {
		respond(rateLimited, 429);

		await expect(invoke(Leads.list, {})).rejects.toMatchObject({
			status: 429,
			isRateLimit: true,
		});
	});

	it('keeps the token out of the error', async () => {
		respond(unauthorized, 401);

		const error = await caught(invoke(Leads.list, {}));

		expect(JSON.stringify(error)).not.toContain(API_KEY);
		expect(String(error)).not.toContain(API_KEY);
	});

	it('keeps no body on the error, so an echoed lead cannot follow it into a log', async () => {
		respond(invalidPayload, 400);

		const error = await caught(invoke(Leads.list, {}));

		expect(error).not.toHaveProperty('body');
	});

	it('marks a transport failure and keeps the method', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		await expect(invoke(Leads.list, {})).rejects.toMatchObject({
			transport: true,
			method: 'GET',
			message: 'fetch failed',
		});
	});
});
