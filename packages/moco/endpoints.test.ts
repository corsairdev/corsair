import { logEventFromContext } from 'corsair/core';
import {
	Activities,
	Companies,
	Contacts,
	Deals,
	Invoices,
	Profile,
	Projects,
	Session,
	Users,
} from './endpoints';
import type { MocoEndpointOutputSchemas as Outputs } from './endpoints/types';
import {
	activity,
	company,
	contact,
	deal,
	invoice,
	invoiceDetail,
	mocoUser,
	profile,
	project,
	projectReport,
	sessionVerify,
	validationErrors,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'moco-key-123';

const ctx = {
	key: API_KEY,
	options: { subdomain: 'beachy' },
	keys: { get_subdomain: jest.fn().mockResolvedValue(null) },
};

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant. Each endpoint returns its own output type,
// so the shared return is unknown.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// unknown: negative cases pass values no schema accepts.
function invoke(endpoint: AnyEndpoint, input: unknown) {
	// The fake context only carries what the endpoints read.
	return endpoint(ctx as never, input as never);
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON or an empty delete answer.
function respond(body: unknown, status = 200) {
	const payload = typeof body === 'string' ? body : JSON.stringify(body);
	fetchMock.mockResolvedValueOnce(
		new Response(payload, {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		origin: parsed.origin,
		path: parsed.pathname,
		query: Object.fromEntries(parsed.searchParams),
		method: init.method,
		headers: new Headers(init.headers),
		// unknown: the request body is whatever the endpoint serialized.
		body: init.body ? (JSON.parse(String(init.body)) as unknown) : undefined,
	};
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('session.verify', () => {
	it('GETs /session with the Token header', async () => {
		respond(sessionVerify);

		const result = await invoke(Session.verify, {});

		expect(lastRequest()).toMatchObject({
			origin: 'https://beachy.mocoapp.com',
			method: 'GET',
			path: '/api/v1/session',
		});
		expect(new Headers(lastRequest().headers).get('authorization')).toBe(
			`Token token=${API_KEY}`,
		);
		expect(result).toEqual(sessionVerify);
	});
});

describe('profile.get', () => {
	it('GETs /profile', async () => {
		respond(profile);

		const result = await invoke(Profile.get, {});

		expect(lastRequest().path).toBe('/api/v1/profile');
		expect(result).toEqual(profile);
	});
});

describe('activities', () => {
	it('lists with filters and derives next_page on a full page', async () => {
		respond(Array(100).fill(activity));

		const result = (await invoke(Activities.list, {
			project_id: 1234567,
			billable: true,
			term: 'kickoff',
			page: 2,
		})) as ReturnType<typeof Outputs.activitiesList.parse>;

		expect(lastRequest().query).toEqual({
			project_id: '1234567',
			billable: 'true',
			term: 'kickoff',
			page: '2',
		});
		expect(result).toMatchObject({ next_page: 3 });
		expect(result.items).toHaveLength(100);
	});

	it('returns a null next_page on a short page', async () => {
		respond([activity]);

		const result = await invoke(Activities.list, {});

		expect(result).toEqual({ items: [activity], next_page: null });
	});

	it('creates with hours and the ids', async () => {
		respond(activity);

		const result = await invoke(Activities.create, {
			date: '2026-04-09',
			project_id: 1234567,
			task_id: 7536,
			seconds: 5400,
			description: 'Kickoff call',
			billable: true,
		});

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/api/v1/activities',
		});
		expect(lastRequest().body).toEqual({
			date: '2026-04-09',
			project_id: 1234567,
			task_id: 7536,
			company_id: undefined,
			hours: undefined,
			seconds: 5400,
			description: 'Kickoff call',
			tag: undefined,
			billable: true,
			remote_service: undefined,
			remote_url: undefined,
			remote_id: undefined,
			stop_timer: undefined,
		});
		expect(result).toEqual(activity);
	});

	it('rejects hours together with seconds', async () => {
		await expect(
			invoke(Activities.create, {
				date: '2026-04-09',
				project_id: 1,
				task_id: 2,
				hours: 1,
				seconds: 3600,
			}),
		).rejects.toThrow('hours or seconds');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects an unknown remote_service', async () => {
		await expect(
			invoke(Activities.create, { remote_service: 'slack' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('updates with PATCH', async () => {
		respond(activity);

		await invoke(Activities.update, {
			id: 654321,
			description: 'Updated note',
		});

		expect(lastRequest()).toMatchObject({
			method: 'PATCH',
			path: '/api/v1/activities/654321',
		});
	});

	it('deletes and accepts an empty body', async () => {
		respond('');

		await expect(invoke(Activities.remove, { id: 654321 })).resolves.toEqual({
			success: true,
			id: 654321,
		});
		expect(lastRequest().method).toBe('DELETE');
	});

	it('fails loudly when a delete answers a real body', async () => {
		respond({ unexpected: 'payload' });

		await expect(invoke(Activities.remove, { id: 654321 })).rejects.toThrow(
			'unexpected body',
		);
	});
});

describe('projects', () => {
	it('lists with filters', async () => {
		respond([project]);

		const result = await invoke(Projects.list, {
			include_archived: true,
			company_id: 889,
		});

		expect(lastRequest().query).toEqual({
			include_archived: 'true',
			company_id: '889',
		});
		expect(result).toEqual({ items: [project], next_page: null });
	});

	it('gets with include_company', async () => {
		respond(project);

		await invoke(Projects.get, { id: 1234567, include_company: true });

		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/api/v1/projects/1234567',
		});
		expect(lastRequest().query).toEqual({ include_company: 'true' });
	});

	it('creates and updates', async () => {
		respond(project);

		await invoke(Projects.create, {
			name: 'Website Relaunch',
			company_id: 889,
			currency: 'EUR',
		});

		expect(lastRequest().method).toBe('POST');
		expect(lastRequest().body).toMatchObject({
			name: 'Website Relaunch',
			company_id: 889,
		});

		respond(project);
		await invoke(Projects.update, { id: 1234567, name: 'Renamed' });

		expect(lastRequest()).toMatchObject({
			method: 'PATCH',
			path: '/api/v1/projects/1234567',
		});
	});

	it('archives and unarchives', async () => {
		respond(project);
		await invoke(Projects.archive, { id: 1234567 });
		expect(lastRequest()).toMatchObject({
			method: 'PUT',
			path: '/api/v1/projects/1234567/archive',
		});

		respond(project);
		await invoke(Projects.unarchive, { id: 1234567 });
		expect(lastRequest()).toMatchObject({
			method: 'PUT',
			path: '/api/v1/projects/1234567/unarchive',
		});
	});

	it('reads the report as a free-form object', async () => {
		respond(projectReport);

		const result = await invoke(Projects.report, { id: 1234567 });

		expect(lastRequest().path).toBe('/api/v1/projects/1234567/report');
		expect(result).toEqual({ report: projectReport });
	});
});

describe('companies', () => {
	it('lists with a type filter and rejects an unknown type', async () => {
		respond([company]);

		const result = await invoke(Companies.list, { type: 'customer' });

		expect(lastRequest().query).toEqual({ type: 'customer' });
		expect(result).toEqual({ items: [company], next_page: null });

		await expect(invoke(Companies.list, { type: 'partner' })).rejects.toThrow();
		// Only the first (successful) call reached fetch.
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('creates a company', async () => {
		respond(company);

		await invoke(Companies.create, {
			name: 'Beachy',
			type: 'customer',
			country_code: 'DE',
		});

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/api/v1/companies',
		});
		expect(lastRequest().body).toMatchObject({ name: 'Beachy' });
	});

	it('archives and unarchives', async () => {
		respond(company);
		await invoke(Companies.archive, { id: 889 });
		expect(lastRequest().path).toBe('/api/v1/companies/889/archive');

		respond(company);
		await invoke(Companies.unarchive, { id: 889 });
		expect(lastRequest().path).toBe('/api/v1/companies/889/unarchive');
	});
});

describe('contacts', () => {
	it('lists, creates, updates and deletes', async () => {
		respond([contact]);
		const result = await invoke(Contacts.list, { term: 'Jana' });
		expect(lastRequest().query).toEqual({ term: 'Jana' });
		expect(result).toEqual({ items: [contact], next_page: null });

		respond(contact);
		await invoke(Contacts.create, {
			firstname: 'Jana',
			lastname: 'Berger',
			gender: 'F',
			company_id: 889,
		});
		expect(lastRequest().method).toBe('POST');
		expect(lastRequest().body).toMatchObject({ firstname: 'Jana' });

		respond(contact);
		await invoke(Contacts.update, { id: 4471, job_position: 'CEO' });
		expect(lastRequest()).toMatchObject({
			method: 'PATCH',
			path: '/api/v1/contacts/people/4471',
		});

		respond('');
		await expect(invoke(Contacts.remove, { id: 4471 })).resolves.toEqual({
			success: true,
			id: 4471,
		});
		expect(lastRequest().method).toBe('DELETE');
	});

	it('rejects an unknown gender', async () => {
		await expect(invoke(Contacts.create, { gender: 'X' })).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('deals', () => {
	it('lists with a status filter and rejects an unknown status', async () => {
		respond([deal]);

		const result = await invoke(Deals.list, { status: 'pending' });

		expect(lastRequest().query).toEqual({ status: 'pending' });
		expect(result).toEqual({ items: [deal], next_page: null });

		await expect(invoke(Deals.list, { status: 'archived' })).rejects.toThrow();
		// Only the first (successful) call reached fetch.
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('creates a deal', async () => {
		respond(deal);

		await invoke(Deals.create, {
			name: 'Website Relaunch',
			deal_category_id: 12,
			money: 50000,
			currency: 'EUR',
			status: 'pending',
		});

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/api/v1/deals',
		});
		expect(lastRequest().body).toMatchObject({ deal_category_id: 12 });
	});

	it('deletes and accepts an empty body', async () => {
		respond('');
		await expect(invoke(Deals.remove, { id: 991 })).resolves.toEqual({
			success: true,
			id: 991,
		});
	});
});

describe('invoices', () => {
	it('lists with filters', async () => {
		respond([invoice]);

		const result = await invoke(Invoices.list, {
			status: 'created',
			date_from: '2026-01-01',
		});

		expect(lastRequest().query).toEqual({
			status: 'created',
			date_from: '2026-01-01',
		});
		expect(result).toEqual({ items: [invoice], next_page: null });
	});

	it('gets the detail with line items', async () => {
		respond(invoiceDetail);

		const result = await invoke(Invoices.get, { id: 777001 });

		expect(lastRequest().path).toBe('/api/v1/invoices/777001');
		expect(result).toEqual(invoiceDetail);
	});

	it('updates the status and rejects one the API does not accept', async () => {
		respond('');
		await expect(
			invoke(Invoices.updateStatus, { id: 777001, status: 'sent' }),
		).resolves.toEqual({ success: true, id: 777001 });
		expect(lastRequest()).toMatchObject({
			method: 'PUT',
			path: '/api/v1/invoices/777001/update_status',
		});
		expect(lastRequest().body).toEqual({ status: 'sent' });

		await expect(
			invoke(Invoices.updateStatus, { id: 777001, status: 'paid' }),
		).rejects.toThrow();
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});
});

describe('users', () => {
	it('lists and gets', async () => {
		respond([mocoUser]);
		const result = await invoke(Users.list, { email: 'michael@example.com' });
		expect(lastRequest().query).toEqual({
			email: 'michael@example.com',
		});
		expect(result).toEqual({ items: [mocoUser], next_page: null });

		respond(mocoUser);
		await expect(invoke(Users.get, { id: 933590696 })).resolves.toEqual(
			mocoUser,
		);
	});
});

describe('error handling', () => {
	it('rejects a malformed list body instead of returning an empty page', async () => {
		respond('<html>nope</html>');

		await expect(invoke(Activities.list, {})).rejects.toThrow('no array');
	});

	it('surfaces the API validation errors on the error object', async () => {
		respond(validationErrors, 422);

		// unknown: a promise can reject with any value, so the rejection reason
		// has no static type; the assertions narrow it.
		const error = await invoke(Companies.create, {}).catch(
			(caught: unknown) => caught,
		);

		expect(error).toMatchObject({ status: 422 });
		expect((error as { message: string }).message).toContain("can't be blank");
	});
});
