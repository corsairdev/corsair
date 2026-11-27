import { inspect } from 'node:util';
import { makeNtfyRequest, NtfyAPIError, parseNtfyNdjson } from './client';
import { pollNdjson, publishedMessage, unauthorized } from './test-fixtures';

const API_KEY = 'tk_0123456789abcdefghij0123456789';

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
async function failure(promise: Promise<unknown>): Promise<NtfyAPIError> {
	const error = await promise.catch((caught: unknown) => caught);
	expect(error).toBeInstanceOf(NtfyAPIError);
	if (!(error instanceof NtfyAPIError)) throw error;
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

		const result = await makeNtfyRequest(API_KEY, {
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

		await makeNtfyRequest(API_KEY, {
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

		const result = await makeNtfyRequest(API_KEY, {
			method: 'GET',
			path: '/mytopic/json',
			query: { poll: 1 },
		});

		expect(result).toBe(pollNdjson);
	});

	it('reads the ntfy code and message from an error body', async () => {
		respond(unauthorized, 401);

		const error = await failure(
			makeNtfyRequest(API_KEY, {
				method: 'POST',
				path: '/mytopic',
				body: { topic: 'mytopic' },
			}),
		);
		expect(error.status).toBe(401);
		expect(error.ntfyCode).toBe(40101);
		expect(error.method).toBe('POST');
		expect(error.isRateLimit).toBe(false);
		expect(error.message).toBe('ntfy 401: unauthorized');
	});

	it('treats a 429 as a rate limit and reads Retry-After', async () => {
		respond({ code: 42905, http: 429, error: 'limit exceeded' }, 429, {
			'Retry-After': '2',
		});

		const error = await failure(
			makeNtfyRequest(API_KEY, {
				method: 'GET',
				path: '/mytopic/json',
				query: { poll: 1 },
			}),
		);
		expect(error.isRateLimit).toBe(true);
		expect(error.retryAfter).toBe(2000);
		expect(error.ntfyCode).toBe(42905);
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('treats a 429 without a Retry-After header as a rate limit', async () => {
		respond(
			{ code: 42905, http: 429, error: 'daily bandwidth limit exceeded' },
			429,
		);

		const error = await failure(
			makeNtfyRequest(API_KEY, {
				method: 'GET',
				path: '/mytopic/json',
			}),
		);
		expect(error.isRateLimit).toBe(true);
		expect(error.retryAfter).toBeUndefined();
	});

	it('wraps network failures and keeps the method', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = await failure(
			makeNtfyRequest(API_KEY, {
				method: 'GET',
				path: '/v1/health',
			}),
		);
		expect(error.message).toContain('fetch failed');
		expect(error.status).toBeUndefined();
		expect(error.ntfyCode).toBeUndefined();
		expect(error.method).toBe('GET');
		expect(error.cause).toBeInstanceOf(TypeError);
	});

	it('keeps the API key out of errors', async () => {
		respond(unauthorized, 401);

		const error = await failure(
			makeNtfyRequest(API_KEY, {
				method: 'POST',
				path: '/',
				body: { topic: 'mytopic' },
			}),
		);
		expect(error.message).not.toContain(API_KEY);
		expect(JSON.stringify(error)).not.toContain(API_KEY);
		expect(inspect(error)).not.toContain(API_KEY);
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
		expect(parseNtfyNdjson(123)).toEqual([]);
	});
});
