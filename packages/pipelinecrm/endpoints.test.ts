import { logEventFromContext } from 'corsair/core';
import { Companies, Deals, Notes, People, Users } from './endpoints';
import {
	companiesList,
	company,
	deal,
	dealsList,
	notesList,
	peopleList,
	person,
	stageTotal,
	unknownApiKey,
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

// unknown: a rejection can be any value until the message check narrows it.
async function rejects(
	endpoint: AnyEndpoint,
	input: unknown,
	match: string,
): Promise<void> {
	await expect(invoke(endpoint, input)).rejects.toThrow(match);
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

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('output parsing', () => {
	it('parses a deals page with pagination', async () => {
		respond(dealsList);
		const page = (await invoke(Deals.list, {})) as {
			entries: Array<{ id?: number; value?: string; deal_stage_name?: string }>;
			pagination: { total?: number };
		};
		expect(page.entries[0]?.id).toBe(4521);
		// Money fields are decimal strings per the docs.
		expect(page.entries[0]?.value).toBe('12000.0');
		expect(page.entries[0]?.deal_stage_name).toBe('Negotiation');
		expect(page.pagination.total).toBe(1);
	});

	it('keeps a null closed_time nullish', async () => {
		respond(dealsList);
		const page = (await invoke(Deals.list, {})) as {
			entries: Array<{ closed_time?: unknown }>;
		};
		expect(page.entries[0]?.closed_time).toBeNull();
	});

	it('parses a deal detail and a created deal', async () => {
		respond(deal);
		const one = (await invoke(Deals.get, { id: 4521 })) as {
			id?: number;
		};
		expect(one.id).toBe(4521);

		respond(deal);
		const created = (await invoke(Deals.create, {
			name: 'Acme renewal',
		})) as { id?: number };
		expect(created.id).toBe(4521);
	});

	it('parses stage totals as an array', async () => {
		respond([stageTotal]);
		const totals = (await invoke(Deals.totalsByStage, {})) as Array<{
			count?: number;
		}>;
		expect(totals[0]?.count).toBe(12);
	});

	it('parses people and companies pages', async () => {
		respond(peopleList);
		const people = (await invoke(People.list, {})) as {
			entries: Array<{ full_name?: string }>;
		};
		expect(people.entries[0]?.full_name).toBe('John Doe');

		respond(companiesList);
		const companies = (await invoke(Companies.list, {})) as {
			entries: Array<{ web?: string }>;
		};
		expect(companies.entries[0]?.web).toBe('https://acme.com');
	});

	it('parses autocomplete answers as bare arrays', async () => {
		respond([person]);
		const matches = (await invoke(People.autocomplete, {
			q: 'john',
		})) as Array<{ id?: number }>;
		expect(matches[0]?.id).toBe(900);

		respond([company]);
		const companies = (await invoke(Companies.autocomplete, {
			q: 'acme',
		})) as Array<{ id?: number }>;
		expect(companies[0]?.id).toBe(77);
	});

	it('parses notes and users pages', async () => {
		respond(notesList);
		const notes = (await invoke(Notes.list, {
			conditions: { 'conditions[deal_id]': 4521 },
		})) as { entries: Array<{ content?: string }> };
		expect(notes.entries[0]?.content).toBe('Discussed renewal terms.');

		respond(usersList);
		const users = (await invoke(Users.list, {})) as {
			entries: Array<{ admin?: boolean }>;
		};
		expect(users.entries[0]?.admin).toBe(true);
	});

	it('raises the provider error message through an endpoint call', async () => {
		respond(unknownApiKey, 401);
		await expect(invoke(Deals.list, {})).rejects.toThrow(
			'Pipeline CRM 401: Unknown api_key',
		);
	});
});

describe('input validation', () => {
	it('rejects a deal create without a name', async () => {
		await rejects(Deals.create, {}, 'name');
	});

	it('rejects a probability outside 0-100', async () => {
		await rejects(Deals.create, { name: 'x', probability: 150 }, 'probability');
	});

	it('rejects a per_page over the documented 200', async () => {
		await rejects(Deals.list, { perPage: 201 }, '200');
		await rejects(People.list, { perPage: 201 }, '200');
		await rejects(Companies.list, { perPage: 201 }, '200');
	});

	it('rejects a company create without a name', async () => {
		await rejects(Companies.create, {}, 'name');
	});

	it('rejects an update without an id', async () => {
		await rejects(Deals.update, {}, 'id');
		await rejects(Notes.update, {}, 'id');
	});
});
