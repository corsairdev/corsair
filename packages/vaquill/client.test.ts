import { makeVaquillRequest, VaquillAPIError } from './client';

type Captured = {
	url: string;
	method: string;
	headers: Record<string, string>;
	body?: string;
};

let captured: Captured | undefined;

function mockFetch(response: { status?: number; body?: unknown }) {
	captured = undefined;
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

		const status = response.status ?? 200;
		const payload = response.body ?? {};
		return {
			ok: status < 400,
			status,
			statusText: 'OK',
			url: String(url),
			headers: new Headers({
				'Content-Type': 'application/json',
			}),
			json: async () => payload,
			text: async () => JSON.stringify(payload),
			// Partial `Response` stub; only what the shared request helper reads.
		};
	}) as unknown as typeof global.fetch;
}

describe('makeVaquillRequest', () => {
	afterEach(() => {
		mockFetch({ body: {} });
	});

	it('sends the key as a bearer token against the v1 base URL', async () => {
		mockFetch({ body: { section: { actId: 'USC_T42_C21_S1983' } } });

		await makeVaquillRequest(
			'/us/statutes/section/USC_T42_C21_S1983',
			'vq_key_test',
			{
				method: 'GET',
			},
		);

		expect(captured?.url).toBe(
			'https://api.vaquill.ai/api/v1/us/statutes/section/USC_T42_C21_S1983',
		);
		expect(captured?.headers['authorization']).toBe('Bearer vq_key_test');
	});

	it('posts a JSON body for search', async () => {
		mockFetch({ body: { results: [] } });

		await makeVaquillRequest('/us/statutes/search', 'vq_key_test', {
			method: 'POST',
			body: { query: 'insider trading penalties', limit: 2 },
		});

		expect(captured?.method).toBe('POST');
		expect(JSON.parse(captured?.body ?? '{}')).toEqual({
			query: 'insider trading penalties',
			limit: 2,
		});
	});

	it('expands array query params into repeated keys', async () => {
		mockFetch({ body: { changes: [] } });

		await makeVaquillRequest(
			'/us/statutes/section/USC_T42_C21_S1983/changes',
			'vq_key_test',
			{
				method: 'GET',
				query: { limit: 5, changeKind: ['added', 'amended'] },
			},
		);

		const url = new URL(captured?.url ?? '');
		expect(url.searchParams.getAll('changeKind')).toEqual(['added', 'amended']);
		expect(url.searchParams.get('limit')).toBe('5');
	});

	it('wraps non-ok responses in a VaquillAPIError with the status', async () => {
		mockFetch({ status: 401, body: { detail: 'Invalid API key' } });

		await expect(
			makeVaquillRequest('/us/statutes/coverage', 'vq_key_bad', {
				method: 'GET',
			}),
		).rejects.toBeInstanceOf(VaquillAPIError);
	});
});
