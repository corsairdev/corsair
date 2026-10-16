import {
	makePDLRequest,
	PDL_API_BASE_URL,
	PDL_SANDBOX_BASE_URL,
	PdlAPIError,
	pdlQuery,
	requestPdlEnrichment,
} from './client';

type Captured = {
	url: string;
	method: string;
	headers: Record<string, string>;
	body?: string;
	fetchCount: number;
};

let captured: Captured | undefined;
let fetchCount = 0;

function mockFetch(response: {
	status?: number;
	body?: unknown;
	headers?: Record<string, string>;
	fail?: Error;
}) {
	fetchCount = 0;
	global.fetch = (async (url: unknown, init?: RequestInit) => {
		if (response.fail) {
			throw response.fail;
		}
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
		fetchCount += 1;
		captured = {
			url: String(url),
			method: init?.method ?? 'GET',
			headers,
			body: typeof init?.body === 'string' ? init.body : undefined,
			fetchCount,
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
				...response.headers,
			}),
			json: async () => payload,
			text: async () => JSON.stringify(payload),
			// Partial `Response` stub; only what the shared request helper reads.
		};
	}) as unknown as typeof global.fetch;
}

afterEach(() => {
	mockFetch({});
});

describe('makePDLRequest', () => {
	it('sends the key as X-Api-Key and no Authorization header', async () => {
		mockFetch({ body: { status: 200, likelihood: 7, data: {} } });

		await makePDLRequest('/v5/person/enrich', 'pdl_key_test', {
			query: { profile: 'linkedin.com/in/gracehopper' },
		});

		expect(captured?.url).toBe(
			`${PDL_API_BASE_URL}/v5/person/enrich?profile=linkedin.com%2Fin%2Fgracehopper`,
		);
		expect(captured?.headers['x-api-key']).toBe('pdl_key_test');
		expect(captured?.headers['authorization']).toBeUndefined();
		expect(captured?.method).toBe('GET');
		expect(captured?.headers['accept']).toBe('application/json');
	});

	it('targets the sandbox host when baseUrl is overridden', async () => {
		mockFetch({ body: { status: 200 } });

		await makePDLRequest('/v5/person/enrich', 'pdl_key_test', {
			query: { profile: 'linkedin.com/in/gracehopper' },
			baseUrl: PDL_SANDBOX_BASE_URL,
		});

		expect(captured?.url).toBe(
			`${PDL_SANDBOX_BASE_URL}/v5/person/enrich?profile=linkedin.com%2Fin%2Fgracehopper`,
		);
	});

	it('joins list params as comma-separated values for GET', async () => {
		mockFetch({ body: { status: 200, likelihood: 7, data: {} } });

		await makePDLRequest('/v5/person/enrich', 'pdl_key_test', {
			query: pdlQuery({
				name: 'grace hopper',
				company: 'us navy',
				required: ['job_company_name', 'skills'],
				data_include: ['names', 'emails'],
				include_if_matched: true,
				min_likelihood: 8,
			}),
		});

		expect(captured?.url).toBe(
			`${PDL_API_BASE_URL}/v5/person/enrich?name=grace%20hopper&company=us%20navy&required=job_company_name%2Cskills&data_include=names%2Cemails&include_if_matched=true&min_likelihood=8`,
		);
	});

	it('posts the search DSL as a JSON body', async () => {
		mockFetch({ body: { status: 200, data: [], total: 0 } });

		await makePDLRequest('/v5/person/search', 'pdl_key_test', {
			method: 'POST',
			body: {
				query: { term: { job_company_name: 'people data labs' } },
				size: 10,
			},
		});

		expect(captured?.method).toBe('POST');
		expect(captured?.headers['content-type']).toContain('application/json');
		expect(JSON.parse(captured?.body ?? '{}')).toEqual({
			query: { term: { job_company_name: 'people data labs' } },
			size: 10,
		});
	});

	it('wraps a PDL error body {status, error: {type, message}} with the status', async () => {
		mockFetch({
			status: 401,
			body: {
				status: 401,
				error: { type: 'authentication_error', message: 'Invalid API key' },
			},
		});

		await expect(
			makePDLRequest('/v5/person/enrich', 'pdl_key_bad', {}),
		).rejects.toMatchObject({
			name: 'PdlAPIError',
			status: 401,
			body: {
				status: 401,
				error: { type: 'authentication_error', message: 'Invalid API key' },
			},
		});
		await expect(
			makePDLRequest('/v5/person/enrich', 'pdl_key_bad', {}),
		).rejects.toThrow(/authentication_error: Invalid API key/);
	});

	it.each([
		[400, 'bad_request_error'],
		[401, 'authentication_error'],
		[402, 'payment_required_error'],
		[500, 'api_error'],
		[503, 'api_error'],
	])('does not retry a %i', async (status, type) => {
		mockFetch({
			status,
			body: { status, error: { type, message: 'nope' } },
		});

		await expect(
			makePDLRequest('/v5/person/enrich', 'pdl_key_test', {}),
		).rejects.toMatchObject({ status });
		expect(fetchCount).toBe(1);
	});

	it('retries a 429 with exponential backoff before failing', async () => {
		jest.useFakeTimers();
		try {
			mockFetch({
				status: 429,
				body: {
					status: 429,
					error: { type: 'rate_limit_error', message: 'Too many requests' },
				},
			});

			const pending = expect(
				makePDLRequest('/v5/person/enrich', 'pdl_key_test', {}),
			).rejects.toMatchObject({ status: 429 });

			// The shared transport backs off 1s + 2s + 4s across three retries.
			await jest.advanceTimersByTimeAsync(7_000);
			await pending;
			expect(fetchCount).toBe(4);
		} finally {
			jest.useRealTimers();
		}
	});

	it('wraps transport failures in a PdlAPIError', async () => {
		mockFetch({ fail: new TypeError('network down') });

		await expect(
			makePDLRequest('/v5/person/enrich', 'pdl_key_test', {}),
		).rejects.toBeInstanceOf(PdlAPIError);
	});
});

describe('requestPdlEnrichment', () => {
	it('returns null on the documented 404 no-match outcome', async () => {
		mockFetch({
			status: 404,
			body: {
				status: 404,
				error: { type: 'not_found_error', message: 'No results found' },
			},
		});

		await expect(
			requestPdlEnrichment('/v5/person/enrich', 'pdl_key_test', {
				query: { profile: 'linkedin.com/in/nobody' },
			}),
		).resolves.toBeNull();
	});

	it('still throws on other errors', async () => {
		mockFetch({
			status: 402,
			body: {
				status: 402,
				error: { type: 'payment_required_error', message: 'Maximum reached' },
			},
		});

		await expect(
			requestPdlEnrichment('/v5/person/enrich', 'pdl_key_test', {}),
		).rejects.toMatchObject({ status: 402 });
	});
});

describe('pdlQuery', () => {
	it('joins array values and passes scalars through', () => {
		expect(
			pdlQuery({
				name: 'grace hopper',
				required: ['job_company_name', 'skills'],
				min_likelihood: 8,
				include_if_matched: true,
			}),
		).toEqual({
			name: 'grace hopper',
			required: 'job_company_name,skills',
			min_likelihood: 8,
			include_if_matched: true,
		});
	});
});
