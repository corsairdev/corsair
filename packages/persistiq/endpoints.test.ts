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
	it('parses a lead page with has_more and next_page beside the leads', async () => {
		respond({
			status: 'success',
			errors: [],
			has_more: true,
			next_page: 'https://api.persistiq.com/v1/leads?page=2',
			leads: [lead],
		});
		const page = (await invoke(Leads.list, {})) as {
			leads: Array<{ id?: string }>;
			has_more?: boolean;
		};
		expect(page.leads[0]?.id).toBe('l_1');
		expect(page.has_more).toBe(true);
	});

	it('keeps the data map as an open record', async () => {
		respond({ status: 'success', error: null, lead });
		const result = (await invoke(Leads.get, { id: 'l_1' })) as {
			// unknown: the lead data map is caller-defined, so the cast keeps
			// it open.
			lead: { data?: Record<string, unknown> };
		};
		expect(result.lead.data?.['email']).toBe('john@example.com');
	});

	it('rejects a lead with no id', async () => {
		respond({ status: 'success', error: null, lead: { data: {} } });
		await rejects(Leads.get, { id: 'x' }, 'id');
	});

	it('rejects a list answer without its named array', async () => {
		respond({ status: 'success', has_more: false, data: [] });
		await rejects(Leads.list, {}, 'leads');
	});
});

describe('input validation', () => {
	it('rejects a lead create without the lead object', async () => {
		await rejects(Leads.create, { email: 'john@example.com' }, 'lead');
	});

	it('rejects an update with nothing to change', async () => {
		await rejects(Leads.update, { id: 'l_1' }, 'at least one field');
	});

	it('rejects a page below 1', async () => {
		await rejects(Leads.list, { page: 0 }, 'page');
	});
});
