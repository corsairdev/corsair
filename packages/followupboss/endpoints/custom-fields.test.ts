import { logEventFromContext } from 'corsair/core';
import * as CustomFields from './custom-fields';

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

const metadata = {
	collection: 'customfields',
	offset: 0,
	limit: 10,
	total: 4,
};

const customField = {
	id: 2,
	label: 'Birthday',
	name: 'customBirthday',
	type: 'date',
	isRecurring: true,
};

const dropdownField = {
	id: 6,
	label: 'Looking for',
	name: 'customLookingFor',
	type: 'dropdown',
	choices: ['Apartment', 'Townhouse', 'Detached House'],
};

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('customFields', () => {
	it('list keeps every field and the _metadata block', async () => {
		respond({
			customfields: [customField, dropdownField],
			_metadata: metadata,
		});

		const result = await invoke(CustomFields.list, {});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/customFields',
			body: undefined,
		});
		expect(lastRequest().query).toEqual({});
		expect(result).toEqual({
			customfields: [customField, dropdownField],
			_metadata: metadata,
		});
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'followupboss.customFields.list',
			{ count: 2 },
			'completed',
		);
	});

	it('list filters by label and sort', async () => {
		respond({ customfields: [] });

		await invoke(CustomFields.list, {
			label: 'Birthday',
			sort: '-id',
			limit: 25,
			offset: 50,
		});

		expect(lastRequest().query).toEqual({
			label: 'Birthday',
			sort: '-id',
			limit: '25',
			offset: '50',
		});
	});

	it('get unwraps the single-field envelope', async () => {
		respond({ customfields: [dropdownField] });

		const result = await invoke(CustomFields.get, { id: 6 });

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/customFields/6',
			body: undefined,
		});
		expect(result).toEqual(dropdownField);
	});

	it('create POSTs the required label and type and keeps the 200 answer', async () => {
		respond(customField, 200);

		const result = await invoke(CustomFields.create, {
			label: 'Birthday',
			type: 'date',
			isRecurring: true,
			hideIfEmpty: false,
		});

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v1/customFields',
			body: {
				label: 'Birthday',
				type: 'date',
				isRecurring: true,
				hideIfEmpty: false,
			},
		});
		expect(lastRequest().headers.get('content-type')).toBe('application/json');
		expect(result).toEqual(customField);
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'followupboss.customFields.create',
			{ customFieldId: 2 },
			'completed',
		);
	});

	it('update PUTs the choices without the id', async () => {
		respond(dropdownField);

		const result = await invoke(CustomFields.update, {
			id: 6,
			choices: ['Condo', 'Townhouse', 'Detached House'],
			dropdownChoiceMap: [2, 0, 1],
		});

		expect(lastRequest()).toMatchObject({
			method: 'PUT',
			path: '/v1/customFields/6',
			body: {
				choices: ['Condo', 'Townhouse', 'Detached House'],
				dropdownChoiceMap: [2, 0, 1],
			},
		});
		expect(result).toEqual(dropdownField);
	});

	it('delete answers the deleted shape from the bodyless 200', async () => {
		respondEmpty(200);

		const result = await invoke(CustomFields.remove, { id: 7 });

		expect(lastRequest()).toMatchObject({
			method: 'DELETE',
			path: '/v1/customFields/7',
			body: undefined,
		});
		// The spec answers 200 with no body, so the resource echo stays null.
		expect(result).toEqual({ id: 7, resource: null });
	});
});

describe('input validation happens before any request', () => {
	// Every endpoint here rejects an empty input at the schema, so no fetch
	// is ever attempted and no queued response is consumed.
	const emptyInputs: [string, AnyEndpoint][] = [
		['customFields.get', CustomFields.get],
		['customFields.create', CustomFields.create],
		['customFields.update', CustomFields.update],
		['customFields.delete', CustomFields.remove],
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
