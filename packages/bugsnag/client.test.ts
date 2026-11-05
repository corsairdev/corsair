/**
 * Covers the transport: the token scheme, the version header, offset paging and the
 * rate-limit headers BugSnag publishes. Network access is mocked, so this runs in
 * CI.
 *
 * Every value here is fictional.
 */
import { ApiError } from 'corsair/http';
import { BUGSNAG_API_BASE, makeBugsnagRequest, readRateLimit } from './client';

const TOKEN = 'test-token';

type Captured = {
	url: string;
	method: string;
	headers: Record<string, string>;
	body?: string;
};

type MockResponse = {
	status?: number;
	body?: unknown;
	headers?: Record<string, string>;
};

let captured: Captured | undefined;
let attempts = 0;

/**
 * Installs a fetch stub answering each call with the next response in the list,
 * repeating the last once exhausted. The cast is the usual one for replacing a
 * global: the stub implements only the slice of `fetch` that `request` reads.
 */
/**
 * The real `fetch`, captured before any stub replaces it.
 *
 * Restored in `afterAll` so this file cannot leave a stub installed for whatever runs
 * next. Jest gives each suite its own module registry but not its own globals, so a
 * replaced `global.fetch` is a side effect on the environment rather than on this file.
 */
const originalFetch = global.fetch;

afterAll(() => {
	global.fetch = originalFetch;
});

function mockFetchSequence(responses: MockResponse[]) {
	captured = undefined;
	attempts = 0;
	global.fetch = (async (url: unknown, init?: RequestInit) => {
		// `request` may hand fetch a plain object or a `Headers` instance; both are
		// normalised to lower-cased keys, because asserting against one shape would
		// silently pass on the other.
		const headers: Record<string, string> = {};
		const raw = init?.headers;
		if (raw instanceof Headers) {
			raw.forEach((value, key) => {
				headers[key.toLowerCase()] = value;
			});
		} else {
			for (const [key, value] of Object.entries(
				(raw ?? {}) as Record<string, string>,
			)) {
				headers[key.toLowerCase()] = value;
			}
		}
		captured = {
			url: String(url),
			method: init?.method ?? 'GET',
			headers,
			body: typeof init?.body === 'string' ? init.body : undefined,
		};

		const response =
			responses[Math.min(attempts, responses.length - 1)] ??
			({} as MockResponse);
		attempts++;
		const status = response.status ?? 200;
		const payload = response.body ?? {};
		return {
			ok: status < 400,
			status,
			statusText: 'OK',
			url: String(url),
			headers: new Headers({
				'Content-Type': 'application/json',
				...response.headers,
			}),
			json: async () => payload,
			text: async () => JSON.stringify(payload),
		};
	}) as unknown as typeof global.fetch;
}

const mockFetch = (r: MockResponse) => mockFetchSequence([r]);

describe('makeBugsnagRequest', () => {
	/**
	 * The scheme is the literal word `token`. Sending `Bearer` is rejected, and it
	 * is the single easiest thing to get wrong on this API.
	 */
	it('authenticates with the token scheme, not Bearer', async () => {
		mockFetch({ body: { id: 'org-1' } });

		await makeBugsnagRequest('user/organizations', TOKEN);

		expect(captured?.headers.authorization).toBe(`token ${TOKEN}`);
		expect(captured?.headers.authorization).not.toContain('Bearer');
	});

	it('pins the Data Access API version', async () => {
		mockFetch({ body: [] });

		await makeBugsnagRequest('user/organizations', TOKEN);

		expect(captured?.headers['x-version']).toBe('2');
	});

	it('targets the documented base URL', async () => {
		mockFetch({ body: [] });

		await makeBugsnagRequest('user/organizations', TOKEN);

		expect(BUGSNAG_API_BASE).toBe('https://api.bugsnag.com');
		expect(captured?.url).toBe(`${BUGSNAG_API_BASE}/user/organizations`);
	});

	it('sends offset paging parameters as a query string', async () => {
		mockFetch({ body: [] });

		await makeBugsnagRequest('projects/project-1/errors', TOKEN, {
			query: { per_page: 30, offset: 60 },
		});

		expect(captured?.url).toContain('per_page=30');
		expect(captured?.url).toContain('offset=60');
	});

	it('serialises a body on a POST and omits one on a GET', async () => {
		mockFetch({ body: { id: 'project-1' } });
		await makeBugsnagRequest('organizations/org-1/projects', TOKEN, {
			method: 'POST',
			body: { name: 'Example', type: 'android' },
		});
		expect(captured?.method).toBe('POST');
		expect(captured?.body).toBe(
			JSON.stringify({ name: 'Example', type: 'android' }),
		);

		mockFetch({ body: [] });
		await makeBugsnagRequest('projects/project-1', TOKEN, {
			method: 'GET',
			body: { ignored: true },
		});
		expect(captured?.body).toBeUndefined();
	});

	it('sends no body on a DELETE', async () => {
		mockFetch({ status: 204 });

		await makeBugsnagRequest('projects/project-1', TOKEN, {
			method: 'DELETE',
		});

		expect(captured?.method).toBe('DELETE');
		expect(captured?.body).toBeUndefined();
	});

	it('surfaces a failure as an ApiError carrying the status', async () => {
		mockFetch({ status: 404, body: { status: 404, error: 'Not Found' } });

		await expect(
			makeBugsnagRequest('projects/nope', TOKEN),
		).rejects.toBeInstanceOf(ApiError);
	});

	it('retries a 429 and succeeds on the following attempt', async () => {
		mockFetchSequence([
			{
				status: 429,
				headers: { 'Retry-After': '1' },
				body: { errors: ['rate'] },
			},
			{ status: 200, body: [{ id: 'org-1' }] },
		]);

		const result = await makeBugsnagRequest<{ id: string }[]>(
			'user/organizations',
			TOKEN,
		);

		expect(result).toEqual([{ id: 'org-1' }]);
		expect(attempts).toBe(2);
	});
});

describe('readRateLimit', () => {
	/**
	 * BugSnag publishes its budget on every successful response, and the budget is
	 * per-endpoint rather than global - `/user` reports 100 while
	 * `/projects/{id}/errors` reports 30. Exposing it lets a caller sweeping many
	 * projects slow down before being throttled rather than after.
	 */
	it('reads the limit and remaining headers', () => {
		const headers = new Headers({
			'x-ratelimit-limit': '30',
			'x-ratelimit-remaining': '29',
		});

		expect(readRateLimit(headers)).toEqual({ limit: 30, remaining: 29 });
	});

	it('returns an empty result rather than throwing when the headers are absent', () => {
		expect(readRateLimit(new Headers())).toEqual({
			limit: undefined,
			remaining: undefined,
		});
	});

	it('ignores a non-numeric header instead of returning NaN', () => {
		const headers = new Headers({
			'x-ratelimit-limit': 'unlimited',
			'x-ratelimit-remaining': '5',
		});

		const result = readRateLimit(headers);
		expect(result.limit).toBeUndefined();
		expect(result.remaining).toBe(5);
	});
});
