import util from 'node:util';
import { ApiError } from 'corsair/http';
import { describeRagieError, makeRagieRequest, segment } from './client';
import {
	connection,
	documentsList,
	tooManyRequests,
	unauthorized,
	validationDetail,
} from './test-fixtures';

const API_KEY = 'ragie-secret-test-key';

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON or text.
function respond(
	body: unknown,
	status = 200,
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

function respondEmpty(status = 200) {
	fetchMock.mockResolvedValueOnce(new Response(null, { status }));
}

// unknown: a rejection can be any value until the instanceof check narrows it.
async function failure(promise: Promise<unknown>): Promise<ApiError> {
	const error = await promise.catch((e: unknown) => e);
	expect(error).toBeInstanceOf(ApiError);
	if (!(error instanceof ApiError)) throw error;
	return error;
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('makeRagieRequest', () => {
	it('authenticates with a Bearer token', async () => {
		respond(documentsList);

		const result = await makeRagieRequest(API_KEY, {
			method: 'GET',
			path: '/documents',
			query: { page_size: 25, partition: undefined },
		});

		expect(result).toEqual(documentsList);
		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe('https://api.ragie.ai/documents?page_size=25');
		const headers = new Headers(init.headers);
		expect(init.method).toBe('GET');
		expect(headers.get('authorization')).toBe(`Bearer ${API_KEY}`);
		expect(headers.get('accept')).toBe('application/json');
	});

	it('POSTs a JSON body with a JSON content type', async () => {
		respond({});

		await makeRagieRequest(API_KEY, {
			method: 'POST',
			path: '/retrievals',
			body: { query: 'refund' },
		});

		const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(new Headers(init.headers).get('content-type')).toBe(
			'application/json',
		);
		expect(JSON.parse(String(init.body))).toEqual({ query: 'refund' });
	});

	it('sends a multipart body when form fields are given', async () => {
		respond({});

		await makeRagieRequest(API_KEY, {
			method: 'POST',
			path: '/documents',
			formData: {
				file: new Blob(['pdf-bytes'], { type: 'application/pdf' }),
				metadata: { department: 'sales' },
				name: 'handbook.pdf',
			},
		});

		const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		const form = init.body as FormData;
		expect(form).toBeInstanceOf(FormData);
		expect(form.get('file')).toBeInstanceOf(Blob);
		// Non-string form values are JSON-stringified, matching the SDK.
		expect(form.get('metadata')).toBe('{"department":"sales"}');
		expect(form.get('name')).toBe('handbook.pdf');
	});

	it('resolves a bodyless 200 as undefined', async () => {
		respondEmpty();

		await expect(
			makeRagieRequest(API_KEY, {
				method: 'DELETE',
				path: '/documents/doc-1',
			}),
		).resolves.toBeUndefined();
	});

	it('reads the detail of an error envelope', async () => {
		respond(unauthorized, 401);

		const error = await failure(
			makeRagieRequest(API_KEY, { method: 'GET', path: '/documents' }),
		);
		expect(error.status).toBe(401);
		expect(error.request.method).toBe('GET');
		expect(describeRagieError(error.status, error.body, '')).toBe(
			'Ragie 401: Invalid request token',
		);
	});

	it('reads FastAPI validation detail from a 422', async () => {
		respond(validationDetail, 422);

		const error = await failure(
			makeRagieRequest(API_KEY, {
				method: 'POST',
				path: '/documents/raw',
				body: {},
			}),
		);
		expect(error.status).toBe(422);
		expect(describeRagieError(error.status, error.body, '')).toContain(
			'field required',
		);
	});

	it('treats a 429 as a rate limit and reads Retry-After', async () => {
		respond(tooManyRequests, 429, { 'Retry-After': '2' });

		const error = await failure(
			makeRagieRequest(API_KEY, {
				method: 'POST',
				path: '/retrievals',
				body: { query: 'x' },
			}),
		);
		expect(error.status).toBe(429);
		expect(error.retryAfter).toBe(2000);
		// The client never retries on its own; error-handlers.ts decides.
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('lets a network failure through as thrown', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = await makeRagieRequest(API_KEY, {
			method: 'GET',
			path: '/documents',
		}).catch((e: unknown) => e);
		expect(String(error)).toContain('fetch failed');
	});

	it('sends partition as a header, never in the query', async () => {
		respond(documentsList);

		await makeRagieRequest(API_KEY, {
			method: 'GET',
			path: '/documents',
			query: { page_size: 5 },
			partition: 'acme',
		});

		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe('https://api.ragie.ai/documents?page_size=5');
		expect(new Headers(init.headers).get('partition')).toBe('acme');
	});

	it('reads a binary answer as bytes', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(new Uint8Array([37, 80, 68, 70]), {
				status: 200,
				headers: { 'Content-Type': 'application/pdf' },
			}),
		);
		const result = (await makeRagieRequest(API_KEY, {
			method: 'GET',
			path: '/documents/d1/source',
			responseType: 'binary',
		})) as { bytes: Uint8Array; contentType: string };
		expect(Buffer.from(result.bytes).toString()).toBe('%PDF');
		expect(result.contentType).toBe('application/pdf');
	});

	it('keeps the API key out of errors', async () => {
		respond(unauthorized, 401);

		const error = await failure(
			makeRagieRequest(API_KEY, { method: 'GET', path: '/documents' }),
		);
		expect(error.message).not.toContain(API_KEY);
		expect(JSON.stringify(error)).not.toContain(API_KEY);
		// The key rides in a header, which no copied error field carries.
		expect(util.inspect(error)).not.toContain(API_KEY);
	});
});

describe('describeRagieError', () => {
	it('falls back when the body has no error text', () => {
		expect(describeRagieError(503, '<html>down</html>', 'Unavailable')).toBe(
			'Ragie 503: Unavailable',
		);
		expect(describeRagieError(undefined, undefined, 'timeout')).toBe('timeout');
	});
});

describe('segment', () => {
	it('encodes a value for one path segment', () => {
		expect(segment('a/b?c')).toBe('a%2Fb%3Fc');
		expect(segment('doc 1')).toBe('doc%201');
	});
});

describe('connection fixture shape', () => {
	it('matches the SDK model fields', () => {
		for (const key of [
			'id',
			'created_at',
			'updated_at',
			'metadata',
			'type',
			'name',
			'source',
			'enabled',
			'disabled_by_system_reason',
			'page_limit',
			'sync_filter',
			'disabled_by_system',
		]) {
			expect(key in connection).toBe(true);
		}
	});
});
