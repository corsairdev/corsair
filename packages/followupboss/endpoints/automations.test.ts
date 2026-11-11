import { logEventFromContext } from 'corsair/core';
import {
	ActionPlans,
	ActionPlansPeople,
	Automations,
	AutomationsPeople,
} from './automations';

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

function lastUrl() {
	const [url] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	return url;
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

function metadata(collection: string) {
	return {
		collection,
		offset: 0,
		limit: 10,
		total: 1,
		next: null,
		nextLink: null,
	};
}

// Fixtures follow the harvested official examples.
const automation = {
	id: 1,
	created: '2023-08-09T21:30:00Z',
	updated: '2023-08-09T21:30:00Z',
	name: 'Test Automation',
	status: 'Active',
};

const pairing = {
	id: 2,
	created: '2023-08-09T21:36:05Z',
	updated: '2023-08-09T21:36:05Z',
	createdById: -1,
	updatedById: -1,
	createdBy: 'Follow Up Boss',
	updatedBy: 'Follow Up Boss',
	personId: 2,
	automationId: 1,
	status: 'Completed',
	automationName: 'Test Automation',
};

const actionPlan = {
	id: 6,
	created: '2014-08-24T22:12:53Z',
	updated: '2014-08-24T22:12:53Z',
	name: 'Qualify buyer leads',
	status: 'Active',
};

const actionPlanPerson = {
	id: 2,
	created: '2014-08-19T18:31:43Z',
	updated: '2014-08-19T18:31:43Z',
	personId: 10810,
	actionPlanId: 2,
	status: 'Running',
};

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('automations', () => {
	it('list sends the status and boolean flags', async () => {
		respond({ automations: [automation], _metadata: metadata('automations') });

		const result = await invoke(Automations.list, {
			status: 'Active',
			enabledOnly: true,
			manualOnly: false,
			limit: 20,
			offset: 40,
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/automations',
			body: undefined,
		});
		expect(lastRequest().query).toEqual({
			status: 'Active',
			enabledOnly: 'true',
			manualOnly: 'false',
			limit: '20',
			offset: '40',
		});
		expect(result).toEqual({
			automations: [automation],
			_metadata: metadata('automations'),
		});
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'followupboss.automations.list',
			{ count: 1 },
			'completed',
		);
	});

	it('get unwraps the single-automation envelope', async () => {
		respond({ automations: [automation] });

		const result = await invoke(Automations.get, { id: 1 });

		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/automations/1',
		});
		expect(result).toEqual(automation);
	});
});

describe('automationsPeople', () => {
	it('list filters by person, automation and status', async () => {
		respond({
			automationsPeople: [pairing],
			_metadata: metadata('automationsPeople'),
		});

		const result = await invoke(AutomationsPeople.list, {
			personId: 2,
			automationId: 1,
			status: 'Completed',
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/automationsPeople',
		});
		expect(lastRequest().query).toEqual({
			personId: '2',
			automationId: '1',
			status: 'Completed',
		});
		expect(result).toEqual({
			automationsPeople: [pairing],
			_metadata: metadata('automationsPeople'),
		});
	});

	it('create triggers an automation for a person and unwraps the 201 pairing', async () => {
		respond(pairing, 201);

		const result = await invoke(AutomationsPeople.create, {
			automationId: 1,
			personId: 2,
		});

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v1/automationsPeople',
			body: { automationId: 1, personId: 2 },
		});
		expect(lastRequest().headers.get('content-type')).toBe('application/json');
		expect(result).toEqual(pairing);
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'followupboss.automationsPeople.create',
			{ automationPersonId: 2 },
			'completed',
		);
	});

	it('update pauses the pairing with the status body', async () => {
		const paused = { ...pairing, status: 'Paused' };
		respond(paused);

		const result = await invoke(AutomationsPeople.update, {
			id: 2,
			status: 'Paused',
		});

		expect(lastRequest()).toMatchObject({
			method: 'PUT',
			path: '/v1/automationsPeople/2',
			body: { status: 'Paused' },
		});
		expect(result).toEqual(paused);
	});

	it('get unwraps the single pairing', async () => {
		respond(pairing);

		const result = await invoke(AutomationsPeople.get, { id: 2 });

		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/automationsPeople/2',
		});
		expect(result).toEqual(pairing);
	});
});

describe('actionPlans', () => {
	it('list sends the names[] array filter next to the scalar filters', async () => {
		respond({ actionPlans: [actionPlan], _metadata: metadata('actionPlans') });

		const result = await invoke(ActionPlans.list, {
			names: ['Qualify buyer leads'],
			ids: '287564,67484',
			status: 'Active,Deleted',
			sort: 'name',
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/actionPlans',
		});
		expect(lastRequest().query).toEqual({
			'names[]': 'Qualify buyer leads',
			ids: '287564,67484',
			status: 'Active,Deleted',
			sort: 'name',
		});
		expect(result).toEqual({
			actionPlans: [actionPlan],
			_metadata: metadata('actionPlans'),
		});
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'followupboss.actionPlans.list',
			{ count: 1 },
			'completed',
		);
	});

	it('list repeats the names[] key for every requested name', async () => {
		respond({ actionPlans: [] });

		await invoke(ActionPlans.list, { names: ['Buyers', 'Sellers'] });

		// Array filters are PHP style, so each name gets its own names[] param.
		expect(lastUrl()).toBe(
			'https://api.followupboss.com/v1/actionPlans?names%5B%5D=Buyers&names%5B%5D=Sellers',
		);
	});
});

describe('actionPlansPeople', () => {
	it('list filters by person and action plan', async () => {
		respond({
			actionPlansPeople: [actionPlanPerson],
			_metadata: metadata('actionPlansPeople'),
		});

		const result = await invoke(ActionPlansPeople.list, {
			personId: 10810,
			actionPlanId: 2,
			limit: 5,
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/actionPlansPeople',
		});
		expect(lastRequest().query).toEqual({
			personId: '10810',
			actionPlanId: '2',
			limit: '5',
		});
		expect(result).toEqual({
			actionPlansPeople: [actionPlanPerson],
			_metadata: metadata('actionPlansPeople'),
		});
	});

	it('create accepts a truly empty 200 body', async () => {
		respondEmpty(200);

		const result = await invoke(ActionPlansPeople.create, {
			personId: 10810,
			actionPlanId: 2,
		});

		expect(result).toEqual({});
	});

	it('update accepts a truly empty 200 body', async () => {
		respondEmpty(200);

		const result = await invoke(ActionPlansPeople.update, {
			id: 41,
			status: 'Paused',
		});

		expect(result).toEqual({});
	});

	it('create applies an action plan to a person and answers the bare 200 body', async () => {
		// The published example answers 200 with an empty body.
		respond({});

		const result = await invoke(ActionPlansPeople.create, {
			personId: 10810,
			actionPlanId: 2,
		});

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v1/actionPlansPeople',
			body: { personId: 10810, actionPlanId: 2 },
		});
		expect(lastRequest().headers.get('content-type')).toBe('application/json');
		expect(result).toEqual({});
	});

	it('update pauses the applied plan and keeps the pairing FUB echoes', async () => {
		const paused = { ...actionPlanPerson, status: 'Paused' };
		respond(paused);

		const result = await invoke(ActionPlansPeople.update, {
			id: 2,
			status: 'Paused',
		});

		expect(lastRequest()).toMatchObject({
			method: 'PUT',
			path: '/v1/actionPlansPeople/2',
			body: { status: 'Paused' },
		});
		expect(result).toEqual(paused);
	});
});

describe('input validation happens before any request', () => {
	// Every endpoint here rejects an empty input at the schema, so no fetch
	// is ever attempted and no queued response is consumed.
	const emptyInputs: [string, AnyEndpoint][] = [
		['automations.get', Automations.get],
		['automationsPeople.get', AutomationsPeople.get],
		['automationsPeople.update', AutomationsPeople.update],
		['actionPlansPeople.create', ActionPlansPeople.create],
		['actionPlansPeople.update', ActionPlansPeople.update],
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
