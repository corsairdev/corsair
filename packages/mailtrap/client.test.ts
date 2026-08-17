/**
 * Covers the transport: the Bearer token, the single-host base URL, and how
 * account discovery behaves. Network access is mocked, so this runs in CI.
 */
import {
	discoverMailtrapAccountId,
	MailtrapAccountIdMissingError,
	makeMailtrapRequest,
} from './client';

type Captured = {
	url: string;
	method: string;
	headers: Record<string, string>;
	body?: string;
};

type MockResponse = {
	ok?: boolean;
	status?: number;
	// `unknown`, not a narrower type: different tests hand this a JSON object,
	// an array, or a raw string (the non-JSON-response case), and it is only
	// ever handed straight to `json()`/`text()`, never inspected here.
	body?: unknown;
	headers?: Record<string, string>;
};

let captured: Captured | undefined;
let attempts = 0;

/**
 * Installs a fetch stub that answers each call with the next response in the
 * list, repeating the last one once the list is exhausted.
 */
function mockFetchSequence(responses: MockResponse[]) {
	captured = undefined;
	attempts = 0;
	// `url` is `unknown` rather than `RequestInfo | URL` because the stub only
	// ever needs `String(url)` — accepting the real fetch signature here would
	// require importing types this test has no other use for.
	global.fetch = (async (url: unknown, init?: RequestInit) => {
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
			ok: response.ok ?? status < 400,
			status,
			statusText: 'OK',
			url: String(url),
			headers: new Headers({
				'Content-Type': 'application/json',
				...response.headers,
			}),
			json: async () => payload,
			text: async () =>
				typeof payload === 'string' ? payload : JSON.stringify(payload),
		};
		// The stub only implements the subset of `Response` the shared request
		// helper actually reads (`ok`, `status`, `headers`, `json`, `text`), so
		// it is not assignable to the full `Response` type `typeof fetch`
		// declares without this cast.
	}) as unknown as typeof global.fetch;
}

function mockFetch(response: MockResponse) {
	mockFetchSequence([response]);
}

describe('makeMailtrapRequest', () => {
	it('sends the bearer token', async () => {
		mockFetch({ body: [{ id: 1 }] });

		await makeMailtrapRequest('/api/accounts', 'test-token');

		expect(captured?.headers.authorization).toBe('Bearer test-token');
	});

	it('targets the single mailtrap.io host', async () => {
		mockFetch({ body: {} });

		await makeMailtrapRequest('/api/accounts/123/contacts/lists', 'test-token');

		expect(captured?.url).toContain('https://mailtrap.io/');
		expect(captured?.url).toContain('/api/accounts/123/contacts/lists');
	});

	it('sends a body on POST, PUT and PATCH but not on GET or DELETE', async () => {
		mockFetch({ body: {} });
		await makeMailtrapRequest('/api/accounts/123/contacts', 'test-token', {
			method: 'POST',
			body: { contact: { email: 'a@example.com' } },
		});
		expect(captured?.method).toBe('POST');
		expect(captured?.body).toContain('a@example.com');

		mockFetch({ body: {} });
		await makeMailtrapRequest(
			'/api/accounts/123/contacts/lists/1',
			'test-token',
			{
				method: 'DELETE',
				// Cast, not a body shape assertion: the point of this call is
				// that a DELETE never sends a body at all (asserted below), so
				// the value only needs to satisfy `MailtrapRequestOptions.body`.
				body: { name: 'ignored' } as Record<string, unknown>,
			},
		);
		expect(captured?.method).toBe('DELETE');
		expect(captured?.body).toBeUndefined();
	});

	it('retries once Mailtrap answers 429 and honours Retry-After', async () => {
		mockFetchSequence([
			{ status: 429, body: {}, headers: { 'Retry-After': '1' } },
			{ status: 200, body: [] },
		]);

		// `unknown[]` rather than a real entity type: this test is about the
		// retry loop, not a response shape, so the type param is left generic.
		const result = await makeMailtrapRequest<unknown[]>(
			'/api/accounts/123/contacts/lists',
			'test-token',
		);

		expect(attempts).toBe(2);
		expect(result).toEqual([]);
	});

	it('returns a raw string for a non-JSON response', async () => {
		mockFetch({ body: '<p>hi</p>', headers: { 'Content-Type': 'text/html' } });

		const result = await makeMailtrapRequest<string>(
			'/api/accounts/123/inboxes/1/messages/1/body.html',
			'test-token',
		);

		expect(result).toBe('<p>hi</p>');
	});
});

describe('discoverMailtrapAccountId', () => {
	it('returns the single account a token can reach', async () => {
		mockFetch({ body: [{ id: 1234567, name: 'Acme' }] });

		await expect(discoverMailtrapAccountId('test-token')).resolves.toBe(
			'1234567',
		);
		expect(captured?.url).toContain('/api/accounts');
	});

	it('refuses to guess when several accounts are reachable', async () => {
		mockFetch({
			body: [
				{ id: 1, name: 'Acme' },
				{ id: 2, name: 'Beta' },
			],
		});

		await expect(
			discoverMailtrapAccountId('test-token'),
		).rejects.toBeInstanceOf(MailtrapAccountIdMissingError);
	});

	it('reports a missing account when the token reaches none', async () => {
		mockFetch({ body: [] });

		await expect(
			discoverMailtrapAccountId('test-token'),
		).rejects.toBeInstanceOf(MailtrapAccountIdMissingError);
	});
});
