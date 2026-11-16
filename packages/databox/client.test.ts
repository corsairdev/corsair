import {
	DataboxAPIError,
	describeDataboxError,
	makeDataboxRequest,
	segment,
} from './client';
import {
	conflictInProgress,
	dataSourceList,
	unauthorized,
	validationError,
} from './test-fixtures';

const API_KEY = 'dbx-secret-test-key';

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
async function failure(promise: Promise<unknown>): Promise<DataboxAPIError> {
	const error = await promise.catch((e: unknown) => e);
	expect(error).toBeInstanceOf(DataboxAPIError);
	if (!(error instanceof DataboxAPIError)) throw error;
	return error;
}

beforeEach(() => {
	// An unmocked call throws instead of reaching api.databox.com.
	fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(() => {
		throw new Error('unmocked fetch');
	});
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('makeDataboxRequest', () => {
	it('authenticates with x-api-key and no Authorization header', async () => {
		respond(dataSourceList, 200);

		const result = await makeDataboxRequest(API_KEY, {
			method: 'GET',
			path: '/v2/data-sources',
			query: { search: 'sales', page: 0, connectionId: undefined },
		});

		expect(result).toEqual(dataSourceList);
		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe(
			'https://api.databox.com/v2/data-sources?search=sales&page=0',
		);
		const headers = new Headers(init.headers);
		expect(init.method).toBe('GET');
		expect(headers.get('x-api-key')).toBe(API_KEY);
		expect(headers.get('authorization')).toBeNull();
		expect(headers.get('content-type')).toBeNull();
	});

	it('sends no routing or idempotency headers when not asked to', async () => {
		respond(dataSourceList, 200);

		await makeDataboxRequest(API_KEY, { method: 'GET', path: '/v2/datasets' });

		const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		const headers = new Headers(init.headers);
		expect(headers.get('x-account-id')).toBeNull();
		expect(headers.get('idempotency-key')).toBeNull();
	});

	it('sends x-account-id and Idempotency-Key when given', async () => {
		respond(dataSourceList, 200);

		await makeDataboxRequest(API_KEY, {
			method: 'POST',
			path: '/v2/data-sources',
			body: { name: 'Sales' },
			accountId: 4754489,
			idempotencyKey: '0d4e2f3a-1b2c-4d5e-8f9a-6a7b8c9d0e1f',
		});

		const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		const headers = new Headers(init.headers);
		expect(headers.get('x-account-id')).toBe('4754489');
		expect(headers.get('idempotency-key')).toBe(
			'0d4e2f3a-1b2c-4d5e-8f9a-6a7b8c9d0e1f',
		);
	});

	it('POSTs a JSON body with a JSON content type', async () => {
		respond({ requestId: 'r', status: 'success', data: {} }, 200);

		await makeDataboxRequest(API_KEY, {
			method: 'POST',
			path: '/v2/datasets/1234567/data',
			body: { records: [{ transaction_id: 'T-10024' }] },
		});

		const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(new Headers(init.headers).get('content-type')).toBe(
			'application/json',
		);
		expect(JSON.parse(String(init.body))).toEqual({
			records: [{ transaction_id: 'T-10024' }],
		});
	});

	it('sends no body or content type on a bodyless request', async () => {
		respond({ requestId: 'r', status: 'success', data: {} }, 200);

		await makeDataboxRequest(API_KEY, {
			method: 'DELETE',
			path: '/v2/data-sources/1234567',
		});

		const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(init.method).toBe('DELETE');
		expect(init.body).toBeUndefined();
		expect(new Headers(init.headers).get('content-type')).toBeNull();
	});

	it('reads the code, message and field of a validation error', async () => {
		respond(validationError('name'), 400);

		const error = await failure(
			makeDataboxRequest(API_KEY, {
				method: 'POST',
				path: '/v2/data-sources',
				body: { name: '' },
			}),
		);
		expect(error.status).toBe(400);
		expect(error.code).toBe('invalid_input');
		expect(error.field).toBe('name');
		expect(error.method).toBe('POST');
		expect(error.message).toBe(
			'Databox 400 invalid_input: The provided parameter is invalid. (field: name)',
		);
	});

	it('reads Retry-After in milliseconds on a 429', async () => {
		respond(unauthorized, 429, { 'Retry-After': '2' });

		const error = await failure(
			makeDataboxRequest(API_KEY, { method: 'GET', path: '/v2/metrics' }),
		);
		expect(error.status).toBe(429);
		expect(error.retryAfter).toBe(2000);
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('reads Retry-After on a 409', async () => {
		respond(conflictInProgress, 409, { 'Retry-After': '5' });

		const error = await failure(
			makeDataboxRequest(API_KEY, {
				method: 'GET',
				path: '/v2/datasets/1/data',
			}),
		);
		expect(error.status).toBe(409);
		expect(error.code).toBe('modification_in_progress');
		expect(error.retryAfter).toBe(5000);
	});

	it('fails a 2xx body whose envelope still says error', async () => {
		respond(validationError('records'), 200);

		const error = await failure(
			makeDataboxRequest(API_KEY, {
				method: 'POST',
				path: '/v2/datasets/1/data',
				body: { records: [{}] },
				replaySafe: false,
			}),
		);
		// The envelope error must keep its own code and field rather than
		// being re-wrapped with the ApiError's.
		expect(error.code).toBe('invalid_input');
		expect(error.field).toBe('records');
		expect(error.status).toBeUndefined();
		expect(error.message).toContain('invalid_input');
	});

	it('carries replaySafe and the method onto wrapped errors', async () => {
		respond(unauthorized, 502);

		const error = await failure(
			makeDataboxRequest(API_KEY, {
				method: 'POST',
				path: '/v2/metrics/some@metric/data',
				replaySafe: true,
			}),
		);
		expect(error.status).toBe(502);
		expect(error.replaySafe).toBe(true);
		expect(error.method).toBe('POST');
	});

	it('wraps network failures', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = await failure(
			makeDataboxRequest(API_KEY, { method: 'GET', path: '/v2/datasets' }),
		);
		expect(error.message).toContain('fetch failed');
		expect(error.status).toBeUndefined();
		expect(error.method).toBe('GET');
		expect(error.cause).toBeInstanceOf(TypeError);
	});

	it('recognizes a fetch timeout', async () => {
		fetchMock.mockRejectedValueOnce(
			new DOMException('The operation timed out', 'TimeoutError'),
		);

		const error = await failure(
			makeDataboxRequest(API_KEY, { method: 'POST', path: '/v2/datasets' }),
		);
		expect(error.message).toContain('timed out');
		expect(error.status).toBeUndefined();
		expect(error.isTimeout).toBe(true);
	});

	it('marks a 408 as a timeout', async () => {
		respond(unauthorized, 408);

		const error = await failure(
			makeDataboxRequest(API_KEY, { method: 'GET', path: '/v2/datasets' }),
		);
		expect(error.status).toBe(408);
		expect(error.isTimeout).toBe(true);
	});

	it('leaves the API key out of errors', async () => {
		respond(unauthorized, 401);

		const error = await failure(
			makeDataboxRequest(API_KEY, { method: 'GET', path: '/v2/datasets' }),
		);
		expect(error.message).not.toContain(API_KEY);
		expect(JSON.stringify(error)).not.toContain(API_KEY);
		expect(JSON.stringify(error.cause)).not.toContain(API_KEY);
	});
});

describe('describeDataboxError', () => {
	it('reads the first error of the envelope', () => {
		expect(describeDataboxError(403, unauthorized, 'fallback')).toBe(
			'Databox 403 unauthorized: The API key is missing or invalid.',
		);
	});

	it('falls back when the body has no error list', () => {
		expect(describeDataboxError(503, '<html>down</html>', 'Unavailable')).toBe(
			'Databox 503: Unavailable',
		);
		expect(describeDataboxError(undefined, undefined, 'timeout')).toBe(
			'timeout',
		);
	});
});

describe('segment', () => {
	it('encodes a value for one path segment', () => {
		expect(segment('a/b?c')).toBe('a%2Fb%3Fc');
		expect(segment(12)).toBe('12');
	});
});
