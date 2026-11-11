import { logEventFromContext } from 'corsair/core';
import {
	webhookEventsGet,
	webhooksCreate,
	webhooksDelete,
	webhooksGet,
	webhooksList,
	webhooksUpdate,
} from './webhooks';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'fub-test-key';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant. Each endpoint returns its own output type,
// so the shared return is unknown.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

function invoke(endpoint: AnyEndpoint, input: unknown) {
	// The fake context only carries what call() reads: ctx.key and the
	// systemName/systemKey identification options, which stay unset so the
	// X-System header falls back to 'corsair'.
	return endpoint({ key: API_KEY, options: {} } as never, input as never);
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

function respondEmpty(status: number) {
	fetchMock.mockResolvedValueOnce(new Response(null, { status }));
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

// FUB authenticates with the API key as the Basic username and an empty
// password, and identifies the calling system with X-System.
function expectAuthenticated() {
	const sent = lastRequest();
	expect(sent.origin).toBe('https://api.followupboss.com');
	expect(sent.path).toMatch(/^\/v1\//);
	expect(sent.headers.get('authorization')).toBe(
		`Basic ${Buffer.from(`${API_KEY}:`).toString('base64')}`,
	);
	expect(sent.headers.get('x-system')).toBe('corsair');
	expect(sent.headers.get('x-system-key')).toBeNull();
}

// Fixtures modeled on the response examples in the FUB webhooks docs, with a
// made-up lead provider; they live inline so this suite owns them.
const metadata = {
	collection: 'webhooks',
	offset: 0,
	limit: 10,
	total: 3,
	next: null,
	nextLink: null,
};

const webhook = {
	id: 1001,
	event: 'peopleCreated',
	status: 'Active',
	url: 'https://acmeLeadProvider.com/callbacks/peopleCreated',
};

const webhookEvent = {
	id: 'db36048a6b06d80e7f9d3440233ae915',
	eventCreated: '2016-12-12T18:36:26Z',
	event: 'peopleUpdated',
	resourceIds: [1234, 3422, 4343],
	uri: 'https://api.followupboss.com/v1/people?id=1234,3422,4343',
};

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('webhooks', () => {
	it('list keeps every webhook and the _metadata block', async () => {
		respond({ webhooks: [webhook], _metadata: metadata });

		const result = await invoke(webhooksList, {});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/webhooks',
			body: undefined,
		});
		expect(lastRequest().query).toEqual({});
		expect(result).toEqual({ webhooks: [webhook], _metadata: metadata });
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'followupboss.webhooks.list',
			{ count: 1 },
			'completed',
		);
	});

	it('list sends the sort, status, event filters and paging', async () => {
		respond({ webhooks: [] });

		await invoke(webhooksList, {
			sort: 'updated',
			event: 'peopleUpdated',
			status: 'Disabled',
			limit: 25,
			offset: 50,
		});

		expect(lastRequest().query).toEqual({
			sort: 'updated',
			event: 'peopleUpdated',
			status: 'Disabled',
			limit: '25',
			offset: '50',
		});
	});

	it('create POSTs the event and url and parses the bare 200 webhook', async () => {
		respond(webhook);

		const result = await invoke(webhooksCreate, {
			event: 'peopleCreated',
			url: 'https://acmeLeadProvider.com/callbacks/followupboss/peopleCreated',
		});

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v1/webhooks',
			body: {
				event: 'peopleCreated',
				url: 'https://acmeLeadProvider.com/callbacks/followupboss/peopleCreated',
			},
		});
		expect(lastRequest().headers.get('content-type')).toBe('application/json');
		expect(result).toEqual(webhook);
	});

	it('get fetches one webhook by id', async () => {
		respond(webhook);

		const result = await invoke(webhooksGet, { id: 1001 });

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/webhooks/1001',
			body: undefined,
		});
		expect(result).toEqual(webhook);
	});

	it('update PUTs the fields without the id', async () => {
		respond({ ...webhook, status: 'Disabled' });

		const result = await invoke(webhooksUpdate, {
			id: 1001,
			event: 'peopleCreated',
			url: 'https://acmeLeadProvider.com/callbacks/peopleCreated',
			status: 'Disabled',
		});

		expect(lastRequest()).toMatchObject({
			method: 'PUT',
			path: '/v1/webhooks/1001',
			body: {
				event: 'peopleCreated',
				url: 'https://acmeLeadProvider.com/callbacks/peopleCreated',
				status: 'Disabled',
			},
		});
		expect(result).toEqual({ ...webhook, status: 'Disabled' });
	});

	it('delete answers {id, resource} from the empty 200 body', async () => {
		// The contract documents an empty body for this 200.
		respondEmpty(200);

		const result = await invoke(webhooksDelete, { id: 1001 });

		expect(lastRequest()).toMatchObject({
			method: 'DELETE',
			path: '/v1/webhooks/1001',
			body: undefined,
		});
		expect(result).toEqual({ id: 1001, resource: null });
	});
});

describe('webhookEvents', () => {
	it('get uses the normalized /webhookEvents/{id} path and returns the delivery-event list', async () => {
		respond({
			webhookEvents: [
				webhookEvent,
				{ ...webhookEvent, id: 'ff'.padEnd(32, '0') },
			],
		});

		const result = await invoke(webhookEventsGet, { id: 123 });

		expectAuthenticated();
		// The published spec writes this path as '/webhookEvents/:id'; the
		// handler interpolates it with the `{id}` template semantics instead.
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/webhookEvents/123',
			body: undefined,
		});
		expect(result).toEqual([
			webhookEvent,
			{ ...webhookEvent, id: 'ff'.padEnd(32, '0') },
		]);
	});

	it('get wraps a bare single-event 200 body into the list', async () => {
		respond(webhookEvent);

		const result = await invoke(webhookEventsGet, { id: 123 });

		expect(result).toEqual([webhookEvent]);
	});

	it('get preserves an empty delivery-event list', async () => {
		respond({ webhookEvents: [] });

		const result = await invoke(webhookEventsGet, { id: 123 });

		expect(result).toEqual([]);
	});

	it.each([null, {}, 'oops'])(
		'get rejects a webhookEvents envelope holding %p instead of a list',
		async (webhookEvents) => {
			respond({ webhookEvents });

			await expect(invoke(webhookEventsGet, { id: 123 })).rejects.toMatchObject(
				{
					name: 'ZodError',
				},
			);
		},
	);

	it('get accepts a string id spelling as well', async () => {
		respond(webhookEvent);

		await invoke(webhookEventsGet, { id: 'db36048a6b06d80e7f9d3440233ae915' });

		expect(lastRequest().path).toBe(
			'/v1/webhookEvents/db36048a6b06d80e7f9d3440233ae915',
		);
	});
});

describe('input validation happens before any request', () => {
	// Every endpoint here rejects an empty input at the schema, so no fetch
	// is ever attempted and no queued response is consumed. webhooks.list
	// takes fully optional input and is therefore absent.
	const emptyInputs: [string, AnyEndpoint][] = [
		['webhooks.create', webhooksCreate],
		['webhooks.get', webhooksGet],
		['webhooks.update', webhooksUpdate],
		['webhooks.delete', webhooksDelete],
		['webhookEvents.get', webhookEventsGet],
	];

	it.each(emptyInputs)(
		'rejects an empty input to %s with a ZodError',
		async (_operation, endpoint) => {
			await expect(invoke(endpoint, {})).rejects.toMatchObject({
				name: 'ZodError',
			});
			expect(fetchMock).not.toHaveBeenCalled();
			expect(mockLog).not.toHaveBeenCalled();
		},
	);
});
