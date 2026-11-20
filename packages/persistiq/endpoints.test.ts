import { logEventFromContext } from 'corsair/core';
import { Leads } from './endpoints';
import { lead } from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'pq-test-key';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant.
// unknown: each endpoint returns its own output type, so the shared return
// has no narrower type.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// unknown: negative cases pass values no schema accepts.
function invoke(endpoint: AnyEndpoint, input: unknown) {
	return endpoint({ key: API_KEY, options: {} } as never, input as never);
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(body === undefined ? null : JSON.stringify(body), {
			status,
			headers: body === undefined ? {} : { 'Content-Type': 'application/json' },
		}),
	);
}

// unknown: a rejection can be any value until the message check narrows it.
async function rejects(
	endpoint: AnyEndpoint,
	input: unknown,
	match: string,
): Promise<void> {
	await expect(invoke(endpoint, input)).rejects.toThrow(match);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('output parsing', () => {
	it('parses a lead page with its pagination block', async () => {
		respond({
			status: 'success',
			data: [lead],
			page: { has_more: true, next_page: 'cur1' },
		});
		const page = (await invoke(Leads.list, {})) as {
			data: Array<{ id?: string }>;
			page: { has_more?: boolean; next_page?: string | null };
		};
		expect(page.data[0]?.id).toBe('l_1');
		expect(page.page.has_more).toBe(true);
		expect(page.page.next_page).toBe('cur1');
	});

	it('keeps the data map as an open record', async () => {
		respond({ status: 'success', data: [lead], page: PAGE_ANY });
		const page = (await invoke(Leads.list, {})) as {
			// unknown: the lead data map is caller-defined, so the cast keeps
			// it open.
			data: Array<{ data?: Record<string, unknown> }>;
		};
		expect(page.data[0]?.data?.['email']).toBe('john@example.com');
	});

	it('rejects a lead with no id', async () => {
		respond({ status: 'success', data: [{ data: {} }], page: PAGE_ANY });
		await rejects(Leads.get, { id: 'x' }, 'id');
	});

	it('rejects a list envelope without the pagination block', async () => {
		respond({ status: 'success', data: [] });
		await rejects(Leads.list, {}, 'page');
	});
});

describe('input validation', () => {
	it('rejects a lead create without a valid email', async () => {
		await rejects(Leads.create, { email: 'not-an-email' }, 'email');
	});

	it('rejects an update with no data map', async () => {
		await rejects(Leads.update, { id: 'l_1' }, 'data');
	});
});

// The pagination block differs per fixture; any object passes the schema.
const PAGE_ANY = { has_more: false, next_page: null };
