import { logEventFromContext } from 'corsair/core';
import { Companies, Deals, Notes, People, Users } from './endpoints';
import {
	company,
	deal,
	dealsList,
	note,
	notesList,
	peopleList,
	person,
	pipelineUser,
	stageTotal,
	usersList,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const TOKEN = 'pcrm_live_testtoken';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant.
// unknown: each endpoint returns its own output type, so the shared return
// has no narrower type.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// unknown: negative cases pass values no schema accepts.
function invoke(endpoint: AnyEndpoint, input: unknown) {
	return endpoint({ key: TOKEN, options: {} } as never, input as never);
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
		origin: parsed.origin,
		path: parsed.pathname,
		query: Object.fromEntries(parsed.searchParams),
		method: init.method,
		headers: new Headers(init.headers),
		body: typeof init.body === 'string' ? JSON.parse(init.body) : undefined,
	};
}

function expectCall(expected: Partial<ReturnType<typeof lastRequest>>) {
	const sent = lastRequest();
	for (const [key, value] of Object.entries(expected)) {
		expect(sent[key as keyof typeof sent]).toEqual(value);
	}
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('deals', () => {
	it('list sends conditions, sort and paging', async () => {
		respond(dealsList);
		await invoke(Deals.list, {
			conditions: {
				'conditions[deal_stage][]': '3',
				'conditions[deal_created][selection]': 'last_30',
			},
			sort: '-deal_value',
			page: 2,
			perPage: 50,
		});
		expectCall({
			origin: 'https://api.pipelinecrm.com',
			path: '/api/v3/deals',
			query: {
				'conditions[deal_stage][]': '3',
				'conditions[deal_created][selection]': 'last_30',
				sort: '-deal_value',
				page: '2',
				per_page: '50',
			},
			method: 'GET',
		});
		expect(lastRequest().headers.get('authorization')).toBe(`Bearer ${TOKEN}`);
	});

	it('create wraps the fields in a deal body', async () => {
		respond(deal);
		await invoke(Deals.create, {
			name: 'Acme renewal',
			value: 12000,
			dealStageId: 3,
			companyName: 'Acme Corporation',
			primaryContactId: 900,
		});
		expectCall({
			path: '/api/v3/deals',
			method: 'POST',
			body: {
				deal: {
					name: 'Acme renewal',
					value: 12000,
					deal_stage_id: 3,
					company_name: 'Acme Corporation',
					primary_contact_id: 900,
				},
			},
		});
	});

	it('update PUTs the wrapped body with reassignment email off', async () => {
		respond(deal);
		await invoke(Deals.update, {
			id: 4521,
			name: 'Renamed',
			deliverReassignmentEmail: false,
		});
		expectCall({
			path: '/api/v3/deals/4521',
			method: 'PUT',
			body: { deal: { name: 'Renamed' } },
			query: { deliver_reassignment_email: 'false' },
		});
	});

	it('get, delete and totals hang off their routes', async () => {
		respond(deal);
		await invoke(Deals.get, { id: 4521 });
		expectCall({ path: '/api/v3/deals/4521', method: 'GET' });

		respond({ deleted: true });
		await invoke(Deals.deleteDeal, { id: 4521 });
		expectCall({ path: '/api/v3/deals/4521', method: 'DELETE' });

		respond([stageTotal]);
		const totals = (await invoke(Deals.totalsByStage, {})) as Array<{
			deal_stage_id?: number;
		}>;
		expect(totals[0]?.deal_stage_id).toBe(3);
		expectCall({ path: '/api/v3/deals/totals_by_stage' });

		respond(notesList);
		await invoke(Deals.listNotes, { id: 4521 });
		expectCall({ path: '/api/v3/deals/4521/notes' });
	});
});

describe('people', () => {
	it('create wraps the fields in a person body', async () => {
		respond(person);
		await invoke(People.create, {
			fullName: 'John Doe',
			email: 'john@acme.com',
			companyName: 'Acme Corporation',
		});
		expectCall({
			path: '/api/v3/people',
			method: 'POST',
			body: {
				person: {
					full_name: 'John Doe',
					email: 'john@acme.com',
					company_name: 'Acme Corporation',
				},
			},
		});
	});

	it('autocomplete sends q and the optional scopes', async () => {
		respond([person]);
		await invoke(People.autocomplete, { q: 'john', companyId: 77 });
		expectCall({
			path: '/api/v3/people/autocomplete',
			query: { q: 'john', company_id: '77' },
		});
	});

	it('listDeals and listNotes hang off the person id', async () => {
		respond(dealsList);
		await invoke(People.listDeals, { id: 900 });
		expectCall({ path: '/api/v3/people/900/deals' });

		respond(notesList);
		await invoke(People.listNotes, { id: 900 });
		expectCall({ path: '/api/v3/people/900/notes' });
	});

	it('list sends conditions and paging', async () => {
		respond(peopleList);
		await invoke(People.list, {
			conditions: { 'conditions[lead_status_id]': 1 },
			perPage: 25,
		});
		expectCall({
			query: { 'conditions[lead_status_id]': '1', per_page: '25' },
		});
	});
});

describe('companies', () => {
	it('create wraps the fields and passes the duplicate check', async () => {
		respond(company);
		await invoke(Companies.create, {
			name: 'Acme Corporation',
			web: 'https://acme.com',
			checkForDuplicates: true,
		});
		expectCall({
			path: '/api/v3/companies',
			method: 'POST',
			body: { company: { name: 'Acme Corporation', web: 'https://acme.com' } },
			query: { check_for_duplicates: 'true' },
		});
	});

	it('autocomplete and listPeople hang off their routes', async () => {
		respond([company]);
		await invoke(Companies.autocomplete, { q: 'acme' });
		expectCall({
			path: '/api/v3/companies/autocomplete',
			query: { q: 'acme' },
		});

		respond(peopleList);
		await invoke(Companies.listPeople, { id: 77 });
		expectCall({ path: '/api/v3/companies/77/people' });
	});
});

describe('notes', () => {
	it('create wraps the fields in a note body and logs without content', async () => {
		respond(note);
		await invoke(Notes.create, {
			content: 'Discussed renewal terms.',
			dealId: 4521,
		});
		expectCall({
			path: '/api/v3/notes',
			method: 'POST',
			body: {
				note: {
					content: 'Discussed renewal terms.',
					deal_id: 4521,
				},
			},
		});
		const logged = JSON.stringify(mockLog.mock.calls);
		expect(logged).not.toContain('Discussed renewal terms');
	});

	it('list requires conditions and sends paging', async () => {
		respond(notesList);
		await invoke(Notes.list, {
			conditions: { 'conditions[person_id]': 900 },
			page: 1,
		});
		expectCall({
			path: '/api/v3/notes',
			query: { 'conditions[person_id]': '900', page: '1' },
		});
	});

	it('update, get and delete hang off the note id', async () => {
		respond(note);
		await invoke(Notes.get, { id: 5001 });
		expectCall({ path: '/api/v3/notes/5001' });

		respond(note);
		await invoke(Notes.update, { id: 5001, title: 'New title' });
		expectCall({
			path: '/api/v3/notes/5001',
			method: 'PUT',
			body: { note: { title: 'New title' } },
		});

		respond({ deleted: true });
		await invoke(Notes.deleteNote, { id: 5001 });
		expectCall({ path: '/api/v3/notes/5001', method: 'DELETE' });
	});
});

describe('users', () => {
	it('list sends the admin filter and get hangs off the id', async () => {
		respond(usersList);
		const page = (await invoke(Users.list, {
			conditions: { 'conditions[admin]': 'true' },
		})) as { entries: Array<{ id?: number }> };
		expect(page.entries[0]?.id).toBe(13);
		expectCall({
			query: { 'conditions[admin]': 'true' },
		});

		respond(pipelineUser);
		await invoke(Users.get, { id: 13 });
		expectCall({ path: '/api/v3/users/13' });
	});
});
