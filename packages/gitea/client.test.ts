import {
	describeGiteaError,
	GiteaAPIError,
	makeGiteaRequest,
	normalizeInstanceUrl,
	segment,
} from './client';
import { errorEnvelope, repoFixture } from './test-fixtures';

const API_KEY = 'gt-secret-test-key';
const INSTANCE = 'https://git.example.com';

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON or plain text; the helper picks
// the content type from that.
function respond(
	body: unknown, // unknown: see note above, one helper for every shape.
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

function respondEmpty(status: number) {
	fetchMock.mockResolvedValueOnce(new Response(null, { status }));
}

// unknown: a rejection can be any value until the instanceof check narrows it.
async function failure(promise: Promise<unknown>): Promise<GiteaAPIError> { // unknown: a rejection can be any value until the instanceof check narrows it.
	const error = await promise.catch((e: unknown) => e); // unknown: see note above, the rejection type is open.
	expect(error).toBeInstanceOf(GiteaAPIError);
	if (!(error instanceof GiteaAPIError)) throw error;
	return error;
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('normalizeInstanceUrl', () => {
	it('appends /api/v1 to a bare instance URL', () => {
		expect(normalizeInstanceUrl('https://git.example.com')).toBe(
			'https://git.example.com/api/v1',
		);
		expect(normalizeInstanceUrl('https://git.example.com/')).toBe(
			'https://git.example.com/api/v1',
		);
	});

	it('collapses an instance URL that already carries /api/v1', () => {
		expect(normalizeInstanceUrl('https://git.example.com/api/v1')).toBe(
			'https://git.example.com/api/v1',
		);
		expect(normalizeInstanceUrl('https://git.example.com/api/v1/')).toBe(
			'https://git.example.com/api/v1',
		);
	});

	it('keeps a subpath install', () => {
		expect(normalizeInstanceUrl('https://git.example.com/gitea/')).toBe(
			'https://git.example.com/gitea/api/v1',
		);
	});

	it('rejects a URL without a scheme, and junk', () => {
		expect(() => normalizeInstanceUrl('git.example.com')).toThrow(
			'absolute http(s) URL',
		);
		expect(() => normalizeInstanceUrl('')).toThrow('required');
		expect(() => normalizeInstanceUrl(undefined)).toThrow('required');
		expect(() => normalizeInstanceUrl('ftp://git.example.com')).toThrow(
			'http or https',
		);
		expect(() =>
			normalizeInstanceUrl('https://user:pw@git.example.com'),
		).toThrow('credentials');
		expect(() => normalizeInstanceUrl('https://git.example.com/?x=1')).toThrow(
			'query or fragment',
		);
	});
});

describe('makeGiteaRequest', () => {
	it('authenticates with a literal token Authorization header', async () => {
		respond(repoFixture, 200);

		const result = await makeGiteaRequest(API_KEY, INSTANCE, {
			method: 'GET',
			path: '/repos/gitea/gitea',
			replayable: true,
		});

		expect(result).toEqual(repoFixture);
		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe(`${INSTANCE}/api/v1/repos/gitea/gitea`);
		expect(init.method).toBe('GET');
		const headers = new Headers(init.headers);
		expect(headers.get('authorization')).toBe(`token ${API_KEY}`);
		expect(headers.get('authorization')).not.toContain('Bearer');
		expect(headers.get('content-type')).toBeNull();
	});

	it('POSTs a JSON body with a JSON content type', async () => {
		respond(repoFixture, 201);

		await makeGiteaRequest(API_KEY, INSTANCE, {
			method: 'POST',
			path: '/user/repos',
			body: { name: 'demo', private: true },
			replayable: false,
		});

		const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(init.method).toBe('POST');
		expect(new Headers(init.headers).get('content-type')).toBe(
			'application/json',
		);
		expect(JSON.parse(String(init.body))).toEqual({
			name: 'demo',
			private: true,
		});
	});

	it('sends query parameters on GET', async () => {
		respond([], 200);

		await makeGiteaRequest(API_KEY, INSTANCE, {
			method: 'GET',
			path: '/user/repos',
			query: { page: 2, limit: 50, private: undefined },
			replayable: true,
		});

		const [url] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe(`${INSTANCE}/api/v1/user/repos?page=2&limit=50`);
	});

	it('resolves a 204 as undefined', async () => {
		respondEmpty(204);

		await expect(
			makeGiteaRequest(API_KEY, INSTANCE, {
				method: 'DELETE',
				path: '/repos/gitea/gitea',
				replayable: false,
			}),
		).resolves.toBeUndefined();
	});

	it('reads the message of the JSON error envelope on 401', async () => {
		respond(errorEnvelope('invalid username, password or token'), 401);

		const error = await failure(
			makeGiteaRequest(API_KEY, INSTANCE, {
				method: 'GET',
				path: '/user',
				replayable: true,
			}),
		);
		expect(error.status).toBe(401);
		expect(error.message).toBe(
			'Gitea 401: invalid username, password or token',
		);
		expect(error.isRateLimit).toBe(false);
	});

	it('reads the same envelope on a resource-missing 404', async () => {
		respond(errorEnvelope('not found'), 404);

		const error = await failure(
			makeGiteaRequest(API_KEY, INSTANCE, {
				method: 'GET',
				path: '/repos/nope/nope',
				replayable: true,
			}),
		);
		expect(error.status).toBe(404);
		expect(error.message).toBe('Gitea 404: not found');
	});

	it('keeps a plain-text 404 body, which means the route itself is missing', async () => {
		respond('404 page not found', 404);

		const error = await failure(
			makeGiteaRequest(API_KEY, INSTANCE, {
				method: 'GET',
				path: '/nosuchroute',
				replayable: true,
			}),
		);
		expect(error.status).toBe(404);
		expect(error.message).toBe('Gitea 404: 404 page not found');
	});

	it('reads retry-after from a 429 and makes exactly one attempt', async () => {
		respond(errorEnvelope('Too many requests'), 429, { 'retry-after': '60' });

		const error = await failure(
			makeGiteaRequest(API_KEY, INSTANCE, {
				method: 'GET',
				path: '/repos/search',
				replayable: true,
			}),
		);
		expect(error.isRateLimit).toBe(true);
		expect(error.retryAfter).toBe(60_000);
		// Retries live in error-handlers.ts; the client never sends twice.
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('leaves retryAfter unset when the 429 carries no header', async () => {
		respond(errorEnvelope('Too many requests'), 429);

		const error = await failure(
			makeGiteaRequest(API_KEY, INSTANCE, {
				method: 'GET',
				path: '/repos/search',
				replayable: true,
			}),
		);
		expect(error.isRateLimit).toBe(true);
		expect(error.retryAfter).toBeUndefined();
	});

	it('flags transport failures and carries the replayable flag', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = await failure(
			makeGiteaRequest(API_KEY, INSTANCE, {
				method: 'GET',
				path: '/user',
				replayable: true,
			}),
		);
		expect(error.isTransportFailure).toBe(true);
		expect(error.replayable).toBe(true);
		expect(error.status).toBeUndefined();
		expect(error.cause).toBeInstanceOf(TypeError);
	});

	it('marks write errors as not replayable even when they are transport failures', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = await failure(
			makeGiteaRequest(API_KEY, INSTANCE, {
				method: 'POST',
				path: '/user/repos',
				body: { name: 'demo' },
				replayable: false,
			}),
		);
		expect(error.isTransportFailure).toBe(true);
		expect(error.replayable).toBe(false);
	});

	it('leaves the API key out of the error and its JSON forms', async () => {
		respond(errorEnvelope('token is required'), 401);

		const error = await failure(
			makeGiteaRequest(API_KEY, INSTANCE, {
				method: 'GET',
				path: '/user',
				replayable: true,
			}),
		);
		expect(error.message).not.toContain(API_KEY);
		expect(JSON.stringify(error)).not.toContain(API_KEY);
		expect(JSON.stringify(error.cause)).not.toContain(API_KEY);
	});
});

describe('describeGiteaError', () => {
	it('surfaces a non-JSON body verbatim and the fallback when there is none', () => {
		// A proxy's HTML page tells the caller more than a generic label.
		expect(describeGiteaError(502, '<html>down</html>', 'Bad gateway')).toBe(
			'Gitea 502: <html>down</html>',
		);
		expect(describeGiteaError(undefined, undefined, 'timeout')).toBe('timeout');
	});
});

describe('segment', () => {
	it('encodes a value for one path segment', () => {
		expect(segment('a/b?c')).toBe('a%2Fb%3Fc');
		expect(segment(12)).toBe('12');
	});
});
