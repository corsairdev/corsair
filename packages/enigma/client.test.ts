import {
	describeEnigmaError,
	EnigmaAPIError,
	firstSearchResult,
	makeEnigmaRequest,
} from './client';
import {
	badKeyResponse,
	graphQLErrorResponse,
	searchResponse,
} from './test-fixtures';

const API_KEY = 'eg-secret-test-key';

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON or text.
function respond(
	body: unknown,
	status: number,
	headers: Record<string, string> = {},
) {
	fetchMock.mockResolvedValueOnce(
		new Response(typeof body === 'string' ? body : JSON.stringify(body), {
			status,
			headers: {
				'Content-Type':
					typeof body === 'string' ? 'text/plain' : 'application/json',
				...headers,
			},
		}),
	);
}

// unknown: a rejection can be any value until the instanceof check narrows it.
async function failure(promise: Promise<unknown>): Promise<EnigmaAPIError> {
	const error = await promise.catch((e: unknown) => e);
	expect(error).toBeInstanceOf(EnigmaAPIError);
	if (!(error instanceof EnigmaAPIError)) throw error;
	return error;
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('makeEnigmaRequest', () => {
	it('POSTs the query and variables to the GraphQL endpoint with x-api-key', async () => {
		respond(searchResponse(), 200);

		await makeEnigmaRequest(API_KEY, {
			query: 'query T($s: SearchInput!) { search(searchInput: $s) { id } }',
			variables: { s: { entityType: 'BRAND', name: 'Enigma' } },
		});

		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe('https://api.enigma.com/graphql');
		expect(init.method).toBe('POST');
		const headers = new Headers(init.headers);
		expect(headers.get('x-api-key')).toBe(API_KEY);
		expect(headers.get('authorization')).toBeNull();
		expect(headers.get('content-type')).toBe('application/json');
		expect(JSON.parse(String(init.body))).toEqual({
			query: 'query T($s: SearchInput!) { search(searchInput: $s) { id } }',
			variables: { s: { entityType: 'BRAND', name: 'Enigma' } },
		});
	});

	it('returns the data object of a successful answer', async () => {
		respond(searchResponse(), 200);

		await expect(
			makeEnigmaRequest(API_KEY, { query: '{ search { id } }' }),
		).resolves.toEqual({ search: [] });
	});

	it('fails on a GraphQL errors array even with HTTP 200', async () => {
		respond(graphQLErrorResponse, 200);

		const error = await failure(
			makeEnigmaRequest(API_KEY, { query: '{ nosuch }' }),
		);
		expect(error.status).toBeUndefined();
		expect(error.message).toContain('Cannot query field "nosuch"');
		expect(error.isRateLimit).toBe(false);
	});

	it('fails when the answer carries neither data nor errors', async () => {
		respond({}, 200);

		const error = await failure(
			makeEnigmaRequest(API_KEY, { query: '{ search { id } }' }),
		);
		expect(error.message).toContain('no data field');
	});

	it('reads the message of an HTTP error body', async () => {
		respond(badKeyResponse, 401);

		const error = await failure(
			makeEnigmaRequest(API_KEY, { query: '{ search { id } }' }),
		);
		expect(error.status).toBe(401);
		expect(error.message).toBe('Enigma 401: Missing or invalid API key');
	});

	it('treats a 429 as a rate limit, reads Retry-After and makes one attempt', async () => {
		respond(badKeyResponse, 429, { 'Retry-After': '2' });

		const error = await failure(
			makeEnigmaRequest(API_KEY, { query: '{ search { id } }' }),
		);
		expect(error.isRateLimit).toBe(true);
		expect(error.retryAfter).toBe(2000);
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('wraps network failures', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = await failure(
			makeEnigmaRequest(API_KEY, { query: '{ search { id } }' }),
		);
		expect(error.message).toContain('fetch failed');
		expect(error.status).toBeUndefined();
		expect(error.cause).toBeInstanceOf(TypeError);
	});

	it('leaves the API key out of errors', async () => {
		respond(badKeyResponse, 401);

		const error = await failure(
			makeEnigmaRequest(API_KEY, { query: '{ search { id } }' }),
		);
		expect(error.message).not.toContain(API_KEY);
		expect(JSON.stringify(error)).not.toContain(API_KEY);
		expect(JSON.stringify(error.cause)).not.toContain(API_KEY);
	});
});

describe('describeEnigmaError', () => {
	it('falls back when the body has no error text', () => {
		expect(describeEnigmaError(503, '<html>down</html>', 'Unavailable')).toBe(
			'Enigma 503: Unavailable',
		);
		expect(describeEnigmaError(undefined, undefined, 'timeout')).toBe(
			'Enigma: timeout',
		);
	});

	it('reads the first GraphQL error message', () => {
		expect(describeEnigmaError(200, graphQLErrorResponse, 'x')).toContain(
			'Cannot query field "nosuch"',
		);
	});
});

describe('firstSearchResult', () => {
	it('returns the first non-null union member', () => {
		expect(firstSearchResult({ search: [] })).toBeNull();
		expect(firstSearchResult({ search: [null] })).toBeNull();
		expect(firstSearchResult({ search: [null, { id: 'a' }] })).toEqual({
			id: 'a',
		});
	});

	it.each([
		['missing', {}],
		['null', { search: null }],
		['not a list', { search: { id: 'a' } }],
	])('rejects a search field that is %s', (_name, data) => {
		expect(() => firstSearchResult(data)).toThrow(EnigmaAPIError);
		expect(() => firstSearchResult(data)).toThrow(/not an array/);
	});
});
