import {
	accountBaseUrl,
	basicAuthHeader,
	describeQuadernoError,
	makeQuadernoRequest,
	QUADERNO_ROOT_HOST,
	QuadernoAPIError,
	QuadernoError,
	QuadernoTransportError,
	segment,
} from './client';
import {
	missingRecordBody,
	pingFixture,
	validationErrorBody,
	wrongKeyBody,
} from './test-fixtures';

const API_KEY = 'sk_live_test_key';
const ACCOUNT = 'acme-123456';

let fetchMock: jest.SpyInstance;

// unknown: a response body is arbitrary JSON or text until the client reads it.
function respond(
	body: unknown,
	status: number,
	headers: Record<string, string> = {},
) {
	fetchMock.mockResolvedValueOnce(
		new Response(body === undefined ? null : JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json', ...headers },
		}),
	);
}

// unknown: a rejection can be any value until the instanceof check narrows it.
async function failure(promise: Promise<unknown>): Promise<QuadernoAPIError> {
	const error = await promise.catch((e: unknown) => e);
	expect(error).toBeInstanceOf(QuadernoAPIError);
	if (!(error instanceof QuadernoAPIError)) throw error;
	return error;
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
	jest.restoreAllMocks();
});

describe('accountBaseUrl', () => {
	/**
	 * There is no shared host: every account answers on its own subdomain, so
	 * this is the one place the account name becomes a URL.
	 */
	it('builds the per-account host with /api attached', () => {
		expect(accountBaseUrl('acme-123456')).toBe(
			'https://acme-123456.quadernoapp.com/api',
		);
	});

	it('accepts a subdomain with letters, digits and dashes', () => {
		expect(accountBaseUrl('acme-corp-2')).toBe(
			'https://acme-corp-2.quadernoapp.com/api',
		);
	});

	it('refuses a value that would leave the subdomain', () => {
		for (const bad of ['acme.evil.com', 'acme/app', 'acme app', '', '-acme']) {
			expect(() => accountBaseUrl(bad)).toThrow(QuadernoError);
		}
	});

	it('refuses a full URL in place of the account name', () => {
		expect(() => accountBaseUrl('https://acme.quadernoapp.com')).toThrow(
			/account name must be the subdomain/,
		);
	});
});

describe('basicAuthHeader', () => {
	/**
	 * Quaderno documents the key as the Basic username with an **empty**
	 * password. `corsair/http` refuses that pair, so the header is built here.
	 */
	it('puts the key in the username and leaves the password empty', () => {
		expect(basicAuthHeader('sk_live_abc')).toBe(
			`Basic ${Buffer.from('sk_live_abc:').toString('base64')}`,
		);
	});

	it('decodes back to "key:" with nothing after the colon', () => {
		const decoded = Buffer.from(
			basicAuthHeader('sk_live_abc').replace('Basic ', ''),
			'base64',
		).toString();
		expect(decoded).toBe('sk_live_abc:');
	});

	it('refuses an empty key', () => {
		expect(() => basicAuthHeader('  ')).toThrow(QuadernoError);
	});
});

describe('makeQuadernoRequest', () => {
	it('calls the account host and sends Basic auth', async () => {
		respond(pingFixture, 200);

		await makeQuadernoRequest(API_KEY, ACCOUNT, {
			method: 'GET',
			path: '/ping',
		});

		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe('https://acme-123456.quadernoapp.com/api/ping');
		expect(new Headers(init.headers).get('authorization')).toBe(
			basicAuthHeader(API_KEY),
		);
	});

	it('never puts the key in the URL', async () => {
		respond(pingFixture, 200);

		await makeQuadernoRequest(API_KEY, ACCOUNT, {
			method: 'GET',
			path: '/ping',
		});

		const [url] = fetchMock.mock.calls[0] as [string];
		expect(url).not.toContain(API_KEY);
	});

	it('sends query parameters on a GET only', async () => {
		respond([], 200);
		await makeQuadernoRequest(API_KEY, ACCOUNT, {
			method: 'GET',
			path: '/contacts',
			query: { limit: 5, created_before: 10 },
		});
		const [url] = fetchMock.mock.calls[0] as [string];
		const search = new URL(url).searchParams;
		expect(search.get('limit')).toBe('5');
		expect(search.get('created_before')).toBe('10');
	});

	it('drops undefined query values', async () => {
		respond([], 200);
		await makeQuadernoRequest(API_KEY, ACCOUNT, {
			method: 'GET',
			path: '/contacts',
			query: { q: undefined, limit: 2 },
		});
		const [url] = fetchMock.mock.calls[0] as [string];
		expect(new URL(url).searchParams.has('q')).toBe(false);
	});

	it('sends a JSON body with the media type set', async () => {
		respond({ id: 1 }, 201);

		await makeQuadernoRequest(API_KEY, ACCOUNT, {
			method: 'POST',
			path: '/contacts',
			body: { email: 'a@example.com' },
		});

		const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(JSON.parse(String(init.body))).toEqual({ email: 'a@example.com' });
		expect(new Headers(init.headers).get('content-type')).toContain(
			'application/json',
		);
	});

	it('resolves a 204 with no body as undefined', async () => {
		respond(undefined, 204);

		await expect(
			makeQuadernoRequest(API_KEY, ACCOUNT, {
				method: 'DELETE',
				path: '/contacts/1',
			}),
		).resolves.toBeUndefined();
	});

	it('reads the single error envelope with its status', async () => {
		respond(wrongKeyBody, 401);

		const error = await failure(
			makeQuadernoRequest(API_KEY, ACCOUNT, {
				method: 'GET',
				path: '/ping',
			}),
		);

		expect(error.status).toBe(401);
		expect(error.kind).toBe('unauthorized');
		expect(error.message).toContain('Wrong API key');
	});

	/**
	 * The one that matters most: a missing record also answers 401, and only the
	 * message separates it from a bad key.
	 */
	it('tells a missing record apart from a bad key, both 401', async () => {
		respond(missingRecordBody, 401);

		const error = await failure(
			makeQuadernoRequest(API_KEY, ACCOUNT, {
				method: 'GET',
				path: '/contacts/1',
			}),
		);

		expect(error.kind).toBe('not_found_or_denied');
		expect(error.message).toContain('does not exist');
	});

	it('reads the field-map validation envelope on a 422', async () => {
		respond(validationErrorBody, 422);

		const error = await failure(
			makeQuadernoRequest(API_KEY, ACCOUNT, {
				method: 'POST',
				path: '/items',
				body: {},
			}),
		);

		expect(error.kind).toBe('invalid_input');
		expect(error.message).toContain('kind: is not included in the list');
	});

	it('reads the limit on a 429', async () => {
		respond({ error: 'Too many requests' }, 429, { 'Retry-After': '2' });

		const error = await failure(
			makeQuadernoRequest(API_KEY, ACCOUNT, {
				method: 'GET',
				path: '/contacts',
			}),
		);

		expect(error.kind).toBe('rate_limited');
		expect(error.retryAfter).toBe(2000);
	});

	/**
	 * Quaderno sends `X-RateLimit-Reset` as a UTC epoch and no Retry-After, so
	 * without the reset header configured every retry would use the 1s fallback.
	 */
	it('turns x-ratelimit-reset into a wait when Retry-After is absent', async () => {
		const reset = Math.floor(Date.now() / 1000) + 30;
		respond({ error: 'Too many requests' }, 429, {
			'x-ratelimit-reset': String(reset),
		});

		const error = await failure(
			makeQuadernoRequest(API_KEY, ACCOUNT, {
				method: 'GET',
				path: '/contacts',
			}),
		);

		expect(error.retryAfter).toBeGreaterThan(25_000);
		expect(error.retryAfter).toBeLessThanOrEqual(30_000);
	});

	it('reports a 5xx as a server error', async () => {
		respond(undefined, 503);

		const error = await failure(
			makeQuadernoRequest(API_KEY, ACCOUNT, {
				method: 'GET',
				path: '/contacts',
			}),
		);

		expect(error.kind).toBe('server');
	});

	it('reports a transport failure without a response', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = await makeQuadernoRequest(API_KEY, ACCOUNT, {
			method: 'GET',
			path: '/ping',
			// unknown: a rejection can be any value until the instanceof check below
			// narrows it.
		}).catch((e: unknown) => e);

		expect(error).toBeInstanceOf(QuadernoTransportError);
		if (!(error instanceof QuadernoTransportError)) throw error;
		expect(error.kind).toBe('network');
	});

	it('reports a timeout as a timeout', async () => {
		fetchMock.mockRejectedValueOnce(
			new DOMException('The operation timed out.', 'TimeoutError'),
		);

		const error = await makeQuadernoRequest(API_KEY, ACCOUNT, {
			method: 'GET',
			path: '/ping',
			// unknown: a rejection can be any value until the instanceof check below
			// narrows it.
		}).catch((e: unknown) => e);

		expect(error).toBeInstanceOf(QuadernoTransportError);
		if (!(error instanceof QuadernoTransportError)) throw error;
		expect(error.kind).toBe('timeout');
	});

	it('refuses to call out for an invalid account name', async () => {
		await expect(
			makeQuadernoRequest(API_KEY, 'bad/account', {
				method: 'GET',
				path: '/ping',
			}),
		).rejects.toThrow(QuadernoError);
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('describeQuadernoError', () => {
	it('reads the single error field', () => {
		expect(describeQuadernoError(401, wrongKeyBody, 'fallback')).toBe(
			'Quaderno 401: Wrong API key or the user does not exist.',
		);
	});

	it('joins a validation field map', () => {
		expect(
			describeQuadernoError(
				422,
				{ errors: { kind: ['is not included'], email: ['is invalid'] } },
				'fallback',
			),
		).toBe('Quaderno 422: kind: is not included; email: is invalid');
	});

	it('falls back when the body has neither shape', () => {
		expect(describeQuadernoError(500, '<html>nginx</html>', 'Internal')).toBe(
			'Quaderno 500: Internal',
		);
	});

	it('keeps the provider text when the status is unknown', () => {
		expect(describeQuadernoError(undefined, wrongKeyBody, 'fallback')).toBe(
			'Wrong API key or the user does not exist.',
		);
	});
});

describe('segment', () => {
	it('encodes a value so it cannot leave its path segment', () => {
		expect(segment('../contacts')).toBe('..%2Fcontacts');
	});

	it('leaves an id readable', () => {
		expect(segment(78395726)).toBe('78395726');
	});

	it('leaves a string slug readable', () => {
		expect(segment('standard')).toBe('standard');
	});
});

describe('the root host', () => {
	it('is the bare domain, used only to discover an account', () => {
		expect(QUADERNO_ROOT_HOST).toBe('https://quadernoapp.com');
	});
});
