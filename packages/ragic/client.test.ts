import {
	describeRagicError,
	isRagicError,
	makeRagicRequest,
	orderParam,
	RAGIC_DEFAULT_SERVER,
	RagicAPIError,
	segment,
	whereFilter,
} from './client';
import { ACCOUNT_EXPIRED, GUEST_106, RECORDS } from './test-fixtures';

const API_KEY = 'ragic-secret-test-key';

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

function respond(
	// unknown: response bodies are arbitrary JSON.
	body: unknown,
	status: number,
	headers: Record<string, string> = {},
) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json', ...headers },
		}),
	);
}

// unknown: a rejection can be any value until the instanceof check narrows it.
async function failure(promise: Promise<unknown>): Promise<RagicAPIError> {
	const error = await promise.catch((e: unknown) => e);
	expect(error).toBeInstanceOf(RagicAPIError);
	if (!(error instanceof RagicAPIError)) throw error;
	return error;
}

describe('Ragic client', () => {
	it('defaults to the www server', () => {
		expect(RAGIC_DEFAULT_SERVER).toBe('www.ragic.com');
	});

	it('builds the account/path/sheet URL and sends the key as Basic', async () => {
		respond(RECORDS, 200);

		await makeRagicRequest(API_KEY, 'www.ragic.com', {
			method: 'GET',
			path: '/demo/sales/1',
			replayable: true,
		});

		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toContain('https://www.ragic.com/demo/sales/1');
		// The key is sent raw, not base64-encoded a second time.
		expect(new Headers(init.headers).get('authorization')).toBe(
			`Basic ${API_KEY}`,
		);
	});

	it('sends the api and version flags on every call', async () => {
		respond(RECORDS, 200);

		await makeRagicRequest(API_KEY, 'www.ragic.com', {
			method: 'GET',
			path: '/demo/sales/1',
			replayable: true,
		});

		const parsed = new URL(fetchMock.mock.calls[0][0] as string);
		// `api` is what switches the route from an HTML page to the API.
		expect(parsed.searchParams.has('api')).toBe(true);
		expect(parsed.searchParams.get('api')).toBe('');
		expect(parsed.searchParams.get('version')).toBe('2025-01-01');
	});

	it('uses the configured server', async () => {
		respond(RECORDS, 200);

		await makeRagicRequest(API_KEY, 'na3.ragic.com', {
			method: 'GET',
			path: '/demo/sales/1',
			replayable: true,
		});

		expect(fetchMock.mock.calls[0][0]).toContain('https://na3.ragic.com');
	});

	it('serialises a body as JSON', async () => {
		respond({ recordId: 1 }, 200);

		await makeRagicRequest(API_KEY, 'www.ragic.com', {
			method: 'POST',
			path: '/demo/sales/1',
			body: { '2000123': 'Dunder Mifflin' },
			replayable: false,
		});

		const init = fetchMock.mock.calls[0][1] as RequestInit;
		expect(new Headers(init.headers).get('content-type')).toContain(
			'application/json',
		);
		expect(JSON.parse(String(init.body))).toEqual({
			'2000123': 'Dunder Mifflin',
		});
	});

	it('throws an error that arrived inside a 200', async () => {
		respond(GUEST_106, 200);

		const error = await failure(
			makeRagicRequest(API_KEY, 'www.ragic.com', {
				method: 'GET',
				path: '/demo/sales/1',
				replayable: true,
			}),
		);

		// Ragic answers a failed call at HTTP 200, so the body is what is read.
		expect(error.code).toBe(106);
		expect(error.message).toContain('access right protected');
		expect(error.isAuthError).toBe(true);
	});

	it('keeps the HTTP status when there is one', async () => {
		respond(ACCOUNT_EXPIRED, 402);

		const error = await failure(
			makeRagicRequest(API_KEY, 'www.ragic.com', {
				method: 'GET',
				path: '/demo/sales/1',
				replayable: true,
			}),
		);

		expect(error.status).toBe(402);
		expect(error.code).toBe(303);
		expect(error.message).toBe('Ragic 303: Your account has expired.');
	});

	it('records whether the failed call may be replayed', async () => {
		respond({ status: 'ERROR', code: 500, msg: 'boom' }, 200);

		const error = await failure(
			makeRagicRequest(API_KEY, 'www.ragic.com', {
				method: 'POST',
				path: '/demo/sales/1',
				replayable: false,
			}),
		);

		expect(error.replayable).toBe(false);
		expect(error.method).toBe('POST');
		expect(error.isServerError).toBe(true);
	});

	it('wraps a transport failure and keeps its cause', async () => {
		const cause = new Error('socket hang up');
		fetchMock.mockRejectedValueOnce(cause);

		const error = await failure(
			makeRagicRequest(API_KEY, 'www.ragic.com', {
				method: 'GET',
				path: '/demo/sales/1',
				replayable: true,
			}),
		);

		expect(error.status).toBeUndefined();
		expect(error.cause).toBe(cause);
	});

	it('drops the cause of an HTTP error, which would retain the API key', async () => {
		respond(GUEST_106, 401);

		const error = await failure(
			makeRagicRequest(API_KEY, 'www.ragic.com', {
				method: 'GET',
				path: '/demo/sales/1',
				replayable: true,
			}),
		);

		expect(error.cause).toBeUndefined();
	});
});

describe('isRagicError', () => {
	it('recognises the error envelope', () => {
		expect(isRagicError(GUEST_106)).toBe(true);
		expect(isRagicError({ status: 'ERROR', code: 101, msg: 'x' })).toBe(true);
	});

	it('recognises a body that only carries a code', () => {
		expect(isRagicError({ code: 403 })).toBe(true);
	});

	it('does not mistake a record set for an error', () => {
		expect(isRagicError(RECORDS)).toBe(false);
	});

	it('does not mistake a record with a status field for an error', () => {
		// A sheet can have a field called status; only the value ERROR is an error.
		expect(isRagicError({ '1': { status: 'Active', _ragicId: 1 } })).toBe(
			false,
		);
	});

	it('does not mistake a task progress body for an error', () => {
		expect(isRagicError({ status: 'RUNNING', progress: 45 })).toBe(false);
	});

	it('returns false for a non-object body', () => {
		expect(isRagicError(null)).toBe(false);
		expect(isRagicError('text')).toBe(false);
	});
});

describe('whereFilter', () => {
	it('joins the three parts', () => {
		expect(whereFilter(2000123, 'eq', 'Alphabet Inc.')).toBe(
			'2000123,eq,Alphabet Inc.',
		);
	});

	it('omits the value, which is how Ragic asks for an empty field', () => {
		expect(whereFilter(2000127, 'eq')).toBe('2000127,eq');
	});

	it('encodes a comma inside the value so it cannot split the filter', () => {
		expect(whereFilter(1000001, 'eq', 'Acme, Inc.')).toBe(
			'1000001,eq,Acme%2C Inc.',
		);
	});

	it('encodes only the value, never the separators', () => {
		const filter = whereFilter(1000001, 'eq', 'a,b');

		// Two separators survive, and the third comma is encoded.
		expect(filter.split(',').length).toBe(3);
		expect(filter.endsWith('a%2Cb')).toBe(true);
	});

	it('keeps a numeric value a number', () => {
		expect(whereFilter(105, 'gte', 20251001)).toBe('105,gte,20251001');
	});

	it('accepts a string field id', () => {
		expect(whereFilter('nps', 'gte', 9)).toBe('nps,gte,9');
	});
});

describe('orderParam', () => {
	it('joins the field and the direction', () => {
		expect(orderParam(800236, 'DESC')).toBe('800236,DESC');
		expect(orderParam(1000001, 'ASC')).toBe('1000001,ASC');
	});
});

describe('segment', () => {
	it('escapes a path segment', () => {
		expect(segment('a/b c')).toBe('a%2Fb%20c');
	});

	it('stringifies a number', () => {
		expect(segment(1)).toBe('1');
	});
});

describe('describeRagicError', () => {
	it('prefixes the body code', () => {
		expect(describeRagicError(GUEST_106, 200, 'x')).toContain('Ragic 106:');
	});

	it('falls back to the HTTP status when the body has no code', () => {
		expect(describeRagicError(null, 500, 'Server error')).toBe(
			'Ragic 500: Server error',
		);
	});

	it('returns the bare message with neither', () => {
		expect(describeRagicError({}, undefined, 'Network error')).toBe(
			'Network error',
		);
	});
});
