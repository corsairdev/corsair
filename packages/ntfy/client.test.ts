import { inspect } from 'node:util';
import { ApiError } from 'corsair/http';
import {
	makeNtfyRequest,
	normalizeNtfyBaseUrl,
	ntfyAuthorization,
	ntfyErrorCode,
	ntfyHeaderValue,
	parseNtfyNdjson,
} from './client';
import { pollNdjson, publishedMessage, unauthorized } from './test-fixtures';

const API_KEY = 'tk_0123456789abcdefghij0123456789';
const TARGET = { baseUrl: 'https://ntfy.sh', key: API_KEY };

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON or NDJSON text.
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
					typeof body === 'string'
						? 'application/x-ndjson; charset=utf-8'
						: 'application/json',
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
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('makeNtfyRequest', () => {
	it('sends the token as a Bearer header on every call', async () => {
		respond(publishedMessage, 200);

		const result = await makeNtfyRequest(TARGET, {
			method: 'POST',
			path: '/',
			body: { topic: 'mytopic' },
		});

		expect(result).toEqual(publishedMessage);
		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe('https://ntfy.sh/');
		expect(init.method).toBe('POST');
		const headers = new Headers(init.headers);
		expect(headers.get('authorization')).toBe(`Bearer ${API_KEY}`);
	});

	it('POSTs a JSON body with a JSON content type', async () => {
		respond(publishedMessage, 200);

		await makeNtfyRequest(TARGET, {
			method: 'POST',
			path: '/',
			body: { topic: 'mytopic', message: 'hi' },
		});

		const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(new Headers(init.headers).get('content-type')).toBe(
			'application/json',
		);
		expect(JSON.parse(String(init.body))).toEqual({
			topic: 'mytopic',
			message: 'hi',
		});
	});

	it('returns an NDJSON poll body as raw text', async () => {
		respond(pollNdjson, 200);

		const result = await makeNtfyRequest(TARGET, {
			method: 'GET',
			path: '/mytopic/json',
			query: { poll: 1 },
		});

		expect(result).toBe(pollNdjson);
	});

	it('lets core ApiError through with the ntfy code in its body', async () => {
		respond(unauthorized, 401);

		const error = await failure(
			makeNtfyRequest(TARGET, {
				method: 'POST',
				path: '/mytopic',
				body: { topic: 'mytopic' },
			}),
		);
		expect(error.status).toBe(401);
		expect(ntfyErrorCode(error)).toBe(40101);
		expect(error.request.method).toBe('POST');
	});

	it('reads Retry-After into the ApiError on a 429, one attempt only', async () => {
		respond({ code: 42901, http: 429, error: 'limit reached' }, 429, {
			'Retry-After': '2',
		});

		const error = await failure(
			makeNtfyRequest(TARGET, {
				method: 'GET',
				path: '/mytopic/json',
				query: { poll: 1 },
			}),
		);
		expect(error.status).toBe(429);
		expect(error.retryAfter).toBe(2000);
		expect(ntfyErrorCode(error)).toBe(42901);
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('lets a network failure through as thrown', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = await makeNtfyRequest(TARGET, {
			method: 'GET',
			path: '/v1/health',
		}).catch((caught: unknown) => caught);
		expect(String(error)).toContain('fetch failed');
		expect(ntfyErrorCode(error)).toBeUndefined();
	});

	it('keeps the API key out of errors', async () => {
		respond(unauthorized, 401);

		const error = await failure(
			makeNtfyRequest(TARGET, {
				method: 'POST',
				path: '/',
				body: { topic: 'mytopic' },
			}),
		);
		expect(error.message).not.toContain(API_KEY);
		expect(JSON.stringify(error)).not.toContain(API_KEY);
		expect(inspect(error)).not.toContain(API_KEY);
	});

	it('goes to a self-hosted server and sends Basic for username:password', async () => {
		respond({ healthy: true }, 200);

		await makeNtfyRequest(
			{ baseUrl: 'https://ntfy.example.com', key: 'phil:secret' },
			{ method: 'GET', path: '/v1/health' },
		);

		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe('https://ntfy.example.com/v1/health');
		expect(new Headers(init.headers).get('authorization')).toBe(
			`Basic ${Buffer.from('phil:secret').toString('base64')}`,
		);
	});

	it('sends no Authorization header without a key', async () => {
		respond({ healthy: true }, 200);

		await makeNtfyRequest(
			{ baseUrl: 'https://ntfy.sh', key: '' },
			{ method: 'GET', path: '/v1/health' },
		);

		const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(new Headers(init.headers).has('authorization')).toBe(false);
	});

	it('sends extra headers and skips empty ones', async () => {
		respond({ success: true }, 200);

		await makeNtfyRequest(TARGET, {
			method: 'DELETE',
			path: '/v1/account/token',
			headers: { 'X-Token': 'tk_other', 'X-Empty': undefined },
		});

		const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		const headers = new Headers(init.headers);
		expect(headers.get('x-token')).toBe('tk_other');
		expect(headers.has('x-empty')).toBe(false);
	});

	it('uploads a raw body and reads a binary answer', async () => {
		respond(publishedMessage, 200);
		await makeNtfyRequest(TARGET, {
			method: 'PUT',
			path: '/mytopic',
			body: new Blob(['hello'], { type: 'text/plain' }),
			rawMediaType: 'text/plain',
			headers: { 'X-Filename': 'hello.txt' },
		});
		const [, put] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(put.body).toBeInstanceOf(Blob);
		expect(new Headers(put.headers).get('x-filename')).toBe('hello.txt');

		fetchMock.mockResolvedValueOnce(
			new Response(new Uint8Array([1, 2, 3]), {
				status: 200,
				headers: { 'Content-Type': 'application/octet-stream' },
			}),
		);
		const file = (await makeNtfyRequest(TARGET, {
			method: 'GET',
			path: '/file/abc',
			responseType: 'binary',
		})) as { bytes: Uint8Array };
		expect(Array.from(file.bytes)).toEqual([1, 2, 3]);
	});
});

describe('safety', () => {
	it('refuses to send credentials over plain http, but allows localhost and anonymous', async () => {
		await expect(
			makeNtfyRequest(
				{ baseUrl: 'http://ntfy.example.com', key: 'phil:secret' },
				{ method: 'GET', path: '/v1/health' },
			),
		).rejects.toThrow(/plain http/);
		expect(fetchMock).not.toHaveBeenCalled();

		respond({ healthy: true }, 200);
		await makeNtfyRequest(
			{ baseUrl: 'http://ntfy.example.com', key: '' },
			{ method: 'GET', path: '/v1/health' },
		);
		respond({ healthy: true }, 200);
		await makeNtfyRequest(
			{ baseUrl: 'http://localhost:8080', key: API_KEY },
			{ method: 'GET', path: '/v1/health' },
		);
		expect(fetchMock).toHaveBeenCalledTimes(2);
	});

	it('drops the request body and query from errors', async () => {
		respond(unauthorized, 403);
		const error = await failure(
			makeNtfyRequest(TARGET, {
				method: 'POST',
				path: '/',
				body: {
					topic: 'mytopic',
					message: 'private text',
					email: 'phil@example.com',
				},
			}),
		);
		expect(error.request).toEqual({ method: 'POST', url: '/' });
		const dump = inspect(error) + JSON.stringify(error);
		expect(dump).not.toContain('private text');
		expect(dump).not.toContain('phil@example.com');
		expect(ntfyErrorCode(error)).toBe(40101);
	});

	it('encodes non-ASCII header text as an RFC 2047 word', () => {
		expect(ntfyHeaderValue('Done')).toBe('Done');
		expect(ntfyHeaderValue('完成')).toBe(
			`=?UTF-8?B?${Buffer.from('完成').toString('base64')}?=`,
		);
		expect(ntfyHeaderValue('line 1\nline 2')).toMatch(/^=\?UTF-8\?B\?/);
		expect(ntfyHeaderValue(undefined)).toBeUndefined();
	});

	it('refuses a poll row that is not an event object', () => {
		expect(() => parseNtfyNdjson('123\n')).toThrow();
		expect(() => parseNtfyNdjson('{"id":"x"}\n')).toThrow();
	});
});

describe('ntfyAuthorization and normalizeNtfyBaseUrl', () => {
	it('uses Bearer for tokens, even a tk_ token with a colon', () => {
		expect(ntfyAuthorization('tk_abc')).toBe('Bearer tk_abc');
		expect(ntfyAuthorization('tk_a:b')).toBe('Bearer tk_a:b');
		expect(ntfyAuthorization('')).toBeUndefined();
	});

	it('trims a trailing slash and refuses non-http schemes', () => {
		expect(normalizeNtfyBaseUrl('https://ntfy.example.com/')).toBe(
			'https://ntfy.example.com',
		);
		expect(() => normalizeNtfyBaseUrl('file:///etc/passwd')).toThrow();
	});
});

describe('parseNtfyNdjson', () => {
	it('parses message lines and drops keepalive and tombstone events', () => {
		const body = [
			JSON.stringify({ id: 'a', event: 'open', topic: 't' }),
			JSON.stringify({ id: 'b', event: 'keepalive', topic: 't' }),
			JSON.stringify({ id: 'c', event: 'message', topic: 't', message: 'hi' }),
			JSON.stringify({
				id: 'd',
				event: 'message_clear',
				topic: 't',
				sequence_id: 's',
			}),
			JSON.stringify({ id: 'e', event: 'message', topic: 't', message: 'ho' }),
		].join('\n');
		const parsed = parseNtfyNdjson(body);
		expect(parsed).toHaveLength(2);
		expect(parsed[0]).toMatchObject({ id: 'c' });
		expect(parsed[1]).toMatchObject({ id: 'e' });
	});

	it('returns an empty list for an empty body', () => {
		expect(parseNtfyNdjson('')).toEqual([]);
		expect(parseNtfyNdjson('\n\n')).toEqual([]);
	});

	it('returns an empty list for a non-string body', () => {
		expect(parseNtfyNdjson(undefined)).toEqual([]);
		expect(() => parseNtfyNdjson(123)).toThrow();
		expect(parseNtfyNdjson(undefined)).toEqual([]);
	});
});
