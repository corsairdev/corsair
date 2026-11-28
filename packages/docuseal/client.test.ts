import util from 'node:util';
import { ApiError } from 'corsair/http';
import {
	DocuSealTransportError,
	describeDocuSealError,
	makeDocuSealRequest,
	normalizeDocuSealBaseUrl,
	segment,
} from './client';
import { notAuthenticated, template } from './test-fixtures';

const API_KEY = 'docuseal-secret-test-key';
const CTX = { key: API_KEY };

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
async function failure(promise: Promise<unknown>): Promise<ApiError> {
	const error = await promise.catch((caught: unknown) => caught);
	expect(error).toBeInstanceOf(ApiError);
	if (!(error instanceof ApiError)) throw error;
	return error;
}

beforeEach(() => {
	// A call no test queued a response for fails here instead of reaching DocuSeal.
	fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(() => {
		throw new Error('unmocked fetch in a unit test');
	});
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('makeDocuSealRequest', () => {
	it('authenticates with X-Auth-Token and no Authorization header', async () => {
		respond(template, 200);

		const result = await makeDocuSealRequest(CTX, {
			method: 'GET',
			path: '/templates/12',
		});

		expect(result).toEqual(template);
		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe('https://api.docuseal.com/templates/12');
		const headers = new Headers(init.headers);
		expect(init.method).toBe('GET');
		expect(headers.get('x-auth-token')).toBe(API_KEY);
		expect(headers.get('authorization')).toBeNull();
		expect(headers.get('accept')).toBe('application/json');
	});

	it('POSTs a JSON body with a JSON content type', async () => {
		respond([], 200);

		await makeDocuSealRequest(CTX, {
			method: 'POST',
			path: '/submissions',
			body: { template_id: 12, submitters: [] },
		});

		const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(new Headers(init.headers).get('content-type')).toBe(
			'application/json',
		);
		expect(JSON.parse(String(init.body))).toEqual({
			template_id: 12,
			submitters: [],
		});
	});

	it('sends no body or content type on a bodyless DELETE', async () => {
		respond({ id: 12, archived_at: null }, 200);

		await makeDocuSealRequest(CTX, {
			method: 'DELETE',
			path: '/templates/12',
		});

		const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(init.body).toBeUndefined();
		expect(new Headers(init.headers).get('content-type')).toBeNull();
	});

	it('drops undefined query values instead of sending empty ones', async () => {
		respond(
			{ data: [], pagination: { count: 0, next: null, prev: null } },
			200,
		);

		await makeDocuSealRequest(CTX, {
			method: 'GET',
			path: '/templates',
			query: { limit: 5, q: undefined, archived: undefined },
		});

		const [url] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe('https://api.docuseal.com/templates?limit=5');
	});

	it('reads the error message out of the {"error"} envelope', async () => {
		respond(notAuthenticated, 401);

		const error = await failure(
			makeDocuSealRequest(CTX, { method: 'GET', path: '/templates' }),
		);
		expect(error.status).toBe(401);
		expect(error.request.method).toBe('GET');
		expect(error.message).toBe('DocuSeal 401: Not authenticated');
	});

	it('treats a 429 as a rate limit and reads Retry-After', async () => {
		// Core retries a 429 three times before it gives up.
		for (let i = 0; i < 4; i++) {
			respond(notAuthenticated, 429, { 'Retry-After': '0' });
		}

		const error = await failure(
			makeDocuSealRequest(CTX, { method: 'GET', path: '/templates' }),
		);
		expect(error.status).toBe(429);
		expect(error.retryAfter).toBe(0);
		expect(fetchMock).toHaveBeenCalledTimes(4);
	});

	it('never copies a response body without an error string into the message', async () => {
		respond({ detail: 'signer@example.com was rejected' }, 418);

		const error = await failure(
			makeDocuSealRequest(CTX, { method: 'GET', path: '/templates' }),
		);
		expect(error.status).toBe(418);
		expect(error.message).not.toContain('signer@example.com');
		expect(JSON.stringify(error.body)).not.toContain('signer@example.com');
	});

	it('falls back to the status when the error body is not JSON', async () => {
		respond('<html>gateway down</html>', 502);

		const error = await failure(
			makeDocuSealRequest(CTX, { method: 'GET', path: '/templates' }),
		);
		expect(error.message).toContain('DocuSeal 502');
	});

	it('keeps the transport cause and method on a network failure', async () => {
		fetchMock.mockRejectedValue(new TypeError('fetch failed'));

		const error = await makeDocuSealRequest(CTX, {
			method: 'GET',
			path: '/templates',
		}).catch((caught: unknown) => caught);
		expect(error).toBeInstanceOf(DocuSealTransportError);
		if (!(error instanceof DocuSealTransportError)) throw error;
		expect(error.message).toContain('fetch failed');
		expect(error.method).toBe('GET');
		expect(error.cause).toBeInstanceOf(TypeError);
	});

	it('keeps signer data and the key out of the ApiError request', async () => {
		respond({ error: 'Template not found' }, 404);

		const error = await failure(
			makeDocuSealRequest(CTX, {
				method: 'POST',
				path: '/submissions',
				body: { template_id: 1, submitters: [{ email: 'a@example.com' }] },
			}),
		);
		expect(error.status).toBe(404);
		expect(error.request.method).toBe('POST');
		expect(error.request.body).toBe('[REDACTED]');
		expect(error.request.headers).toBeUndefined();
		expect(JSON.stringify(error)).not.toContain('a@example.com');
		expect(util.inspect(error, { depth: 10 })).not.toContain('a@example.com');
		expect(error.message).toBe('DocuSeal 404: Template not found');
	});

	it('sends calls to the EU cloud or a self-hosted site when baseUrl is set', async () => {
		respond(template, 200);
		respond(template, 200);

		await makeDocuSealRequest(
			{ key: API_KEY, options: { baseUrl: 'https://api.docuseal.eu' } },
			{ method: 'GET', path: '/templates/1' },
		);
		await makeDocuSealRequest(
			{ key: API_KEY, options: { baseUrl: 'https://sign.example.com/' } },
			{ method: 'GET', path: '/templates/1' },
		);

		expect(fetchMock.mock.calls[0]?.[0]).toBe(
			'https://api.docuseal.eu/templates/1',
		);
		expect(fetchMock.mock.calls[1]?.[0]).toBe(
			'https://sign.example.com/api/templates/1',
		);
	});

	it('keeps the API key out of an API error', async () => {
		respond(notAuthenticated, 401);

		const error = await failure(
			makeDocuSealRequest(CTX, { method: 'GET', path: '/templates' }),
		);
		expect(error.message).not.toContain(API_KEY);
		expect(JSON.stringify(error)).not.toContain(API_KEY);
		expect(util.inspect(error, { depth: 10 })).not.toContain(API_KEY);
	});
});

describe('describeDocuSealError', () => {
	it('uses the envelope message', () => {
		expect(describeDocuSealError(400, { error: 'No such template' }, 'x')).toBe(
			'DocuSeal 400: No such template',
		);
	});

	it('falls back when the body has no error text', () => {
		expect(describeDocuSealError(503, '<html>down</html>', 'Unavailable')).toBe(
			'DocuSeal 503: Unavailable',
		);
		expect(describeDocuSealError(undefined, undefined, 'timeout')).toBe(
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

describe('normalizeDocuSealBaseUrl', () => {
	it('defaults to the global cloud', () => {
		expect(normalizeDocuSealBaseUrl(undefined)).toBe(
			'https://api.docuseal.com',
		);
		expect(normalizeDocuSealBaseUrl('  ')).toBe('https://api.docuseal.com');
	});

	it('keeps the cloud API hosts as they are', () => {
		expect(normalizeDocuSealBaseUrl('https://api.docuseal.eu/')).toBe(
			'https://api.docuseal.eu',
		);
	});

	it('adds /api to a self-hosted site once', () => {
		expect(normalizeDocuSealBaseUrl('http://localhost:3000')).toBe(
			'http://localhost:3000/api',
		);
		expect(normalizeDocuSealBaseUrl('https://example.com/sign/api/')).toBe(
			'https://example.com/sign/api',
		);
	});

	it('refuses URLs that are not plain http(s) roots', () => {
		expect(() => normalizeDocuSealBaseUrl('ftp://example.com')).toThrow();
		expect(() => normalizeDocuSealBaseUrl('not a url')).toThrow();
		expect(() =>
			normalizeDocuSealBaseUrl('https://user:pw@example.com'),
		).toThrow();
		expect(() => normalizeDocuSealBaseUrl('https://example.com?x=1')).toThrow();
	});
});

describe('transport errors and insecure hosts', () => {
	it('refuses plain http for a remote host, allows it for localhost', () => {
		expect(() => normalizeDocuSealBaseUrl('http://sign.example.com')).toThrow(
			/https/,
		);
		expect(normalizeDocuSealBaseUrl('http://127.0.0.1:13100')).toBe(
			'http://127.0.0.1:13100/api',
		);
	});

	it('keeps a key that Headers refuses out of the transport error', () => {
		const key = 'docuseal-key\nINJECTED';
		const error = new DocuSealTransportError(
			'GET',
			new TypeError(`Headers.append: "${key}" is an invalid header value.`),
			key,
		);
		expect(error.message).not.toContain(key);
		expect(error.cause).toBeUndefined();
		expect(util.inspect(error, { depth: 10 })).not.toContain('INJECTED');
	});
});
