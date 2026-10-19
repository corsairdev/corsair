import {
	makeTinyFishRawRequest,
	makeTinyFishRequest,
	TinyFishError,
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

function captureInit(url: string | URL | Request, init?: RequestInit): void {
	const headers: Record<string, string> = {};
	const raw = init?.headers;
	if (raw instanceof Headers) {
		raw.forEach((value, key) => {
			headers[key.toLowerCase()] = value;
		});
	} else if (raw && !Array.isArray(raw)) {
		for (const [key, value] of Object.entries(raw)) {
			if (typeof value === 'string') headers[key.toLowerCase()] = value;
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
}

function installFetch(
	impl: (url: string | URL | Request, init?: RequestInit) => Promise<object>,
) {
	// The stub only implements the Response fields these tests read, so a
	// full Response is not practical.
	global.fetch = impl as unknown as typeof global.fetch;
}

function mockFetch(response: {
	status?: number;
	// Success and error fixtures are different JSON values, so a stricter
	// body type is not practical.
	body?: unknown;
	retryAfter?: string;
}) {
	fetchCount = 0;
	installFetch(async (url, init) => {
		captureInit(url, init);

		const status = response.status ?? 200;
		const payload = response.body ?? {};
		const headers = new Headers({ 'Content-Type': 'application/json' });
		if (response.retryAfter) {
			headers.set('Retry-After', response.retryAfter);
		}
		return {
			ok: status < 400,
			status,
			statusText: 'OK',
			url: String(url),
			headers,
			json: async () => payload,
			text: async () => JSON.stringify(payload),
		};
	});
}

function mockRawFetch(response: {
	status?: number;
	statusText?: string;
	contentType?: string;
	bytes?: Buffer;
	// Error fixtures are JSON objects; success paths use bytes instead, so a
	// stricter body type is not practical.
	body?: unknown;
	retryAfter?: string;
}) {
	fetchCount = 0;
	installFetch(async (url, init) => {
		captureInit(url, init);

		const status = response.status ?? 200;
		const headers = new Headers(
			response.contentType ? { 'Content-Type': response.contentType } : {},
		);
		if (response.retryAfter) {
			headers.set('Retry-After', response.retryAfter);
		}
		return {
			ok: status < 400,
			status,
			statusText: response.statusText ?? 'OK',
			headers,
			arrayBuffer: async () =>
				new Uint8Array(response.bytes ?? Buffer.alloc(0)),
			text: async () => JSON.stringify(response.body ?? {}),
			json: async () => response.body ?? {},
		};
	});
}

describe('makeTinyFishRequest', () => {
	afterEach(() => {
		mockFetch({ body: {} });
	});

	it('sends the key as an X-API-Key header against the agent host', async () => {
		mockFetch({ body: { run_id: 'r1' } });

		await makeTinyFishRequest('agent', '/v1/runs/r1', 'tf_key_test', {
			method: 'GET',
		});

		expect(captured?.url).toBe('https://agent.tinyfish.ai/v1/runs/r1');
		expect(captured?.headers['x-api-key']).toBe('tf_key_test');
		expect(captured?.headers['authorization']).toBeUndefined();
	});

	it('routes each product to its own host', async () => {
		const hosts = {
			search: 'https://api.search.tinyfish.ai/',
			fetch: 'https://api.fetch.tinyfish.ai/',
			browser: 'https://api.browser.tinyfish.ai/',
		};

		// Const assertion keeps the tuple of host keys. A string[] would be
		// wider, not stricter.
		for (const base of ['search', 'fetch', 'browser'] as const) {
			mockFetch({ body: {} });
			await makeTinyFishRequest(base, '/', 'tf_key_test', { method: 'GET' });
			expect(captured?.url).toBe(hosts[base]);
		}
	});

	it('posts a JSON body for a run', async () => {
		mockFetch({ body: { run_id: 'r1' } });

		await makeTinyFishRequest('agent', '/v1/automation/run', 'tf_key_test', {
			method: 'POST',
			body: { url: 'https://example.com', goal: 'Get the title' },
		});

		expect(captured?.method).toBe('POST');
		expect(captured?.headers['content-type']).toContain('application/json');
		expect(JSON.parse(captured?.body ?? '{}')).toEqual({
			url: 'https://example.com',
			goal: 'Get the title',
		});
	});

	it('serializes defined query parameters and skips undefined ones', async () => {
		mockFetch({ body: { data: [] } });

		await makeTinyFishRequest('agent', '/v1/runs', 'tf_key_test', {
			method: 'GET',
			query: { status: 'COMPLETED', limit: 5, cursor: undefined },
		});

		expect(captured?.url).toBe(
			'https://agent.tinyfish.ai/v1/runs?status=COMPLETED&limit=5',
		);
	});

	it('resolves a 204 No Content response to undefined', async () => {
		mockFetch({ status: 204 });

		const result = await makeTinyFishRequest<undefined>(
			'browser',
			'/session-1',
			'tf_key_test',
			{ method: 'DELETE' },
		);

		expect(captured?.method).toBe('DELETE');
		expect(result).toBeUndefined();
		expect(fetchCount).toBe(1);
	});

	it('wraps non-ok responses in a TinyFishError with status, body and code', async () => {
		mockFetch({
			status: 401,
			body: { error: { code: 'INVALID_API_KEY', message: 'Bad key' } },
		});

		await expect(
			makeTinyFishRequest('agent', '/v1/runs', 'tf_key_bad', { method: 'GET' }),
		).rejects.toMatchObject({
			name: 'TinyFishError',
			status: 401,
			body: { error: { code: 'INVALID_API_KEY', message: 'Bad key' } },
			code: 'INVALID_API_KEY',
		});
		expect(fetchCount).toBe(1);
	});

	it('reads provider codes from non-429 bodies without retrying', async () => {
		mockFetch({
			status: 400,
			body: {
				error: { code: 'DAILY_LIMIT_EXCEEDED', message: 'Done for today' },
			},
		});

		await expect(
			makeTinyFishRequest('search', '/', 'tf_key_test', {
				method: 'GET',
				query: { query: 'x' },
			}),
		).rejects.toMatchObject({ code: 'DAILY_LIMIT_EXCEEDED' });
		expect(fetchCount).toBe(1);
	});

	it('surfaces a 429 from one transport attempt, deferring retries to the handlers', async () => {
		mockFetch({
			status: 429,
			retryAfter: '1',
			body: { error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Slow down' } },
		});

		await expect(
			makeTinyFishRequest('agent', '/v1/automation/run', 'tf_key_test', {
				method: 'POST',
				body: { url: 'https://example.com', goal: 'x' },
			}),
		).rejects.toMatchObject({
			name: 'TinyFishError',
			status: 429,
			retryAfter: 1000,
			code: 'RATE_LIMIT_EXCEEDED',
		});
		// Exactly one call: retry policy lives in error-handlers.ts, so the
		// transport must hand the 429 over instead of sleeping on Retry-After.
		expect(fetchCount).toBe(1);
	});

	it('wraps transport failures in a TinyFishError', async () => {
		installFetch(async () => {
			throw new TypeError('network down');
		});

		await expect(
			makeTinyFishRequest('agent', '/v1/runs', 'tf_key_test', {
				method: 'GET',
			}),
		).rejects.toBeInstanceOf(TinyFishError);
	});
});

describe('makeTinyFishRawRequest', () => {
	afterEach(() => {
		mockFetch({ body: {} });
	});

	it('sends the key and Accept header and returns the raw bytes', async () => {
		const jpeg = Buffer.from([0xff, 0xd8, 0xff, 0xe0]);
		mockRawFetch({ contentType: 'image/jpeg', bytes: jpeg });

		const result = await makeTinyFishRawRequest(
			'agent',
			'/v1/runs/run-1/steps/evt_1/screenshot',
			'tf_key_test',
			'image/jpeg',
		);

		expect(captured?.url).toBe(
			'https://agent.tinyfish.ai/v1/runs/run-1/steps/evt_1/screenshot',
		);
		expect(captured?.method).toBe('GET');
		expect(captured?.headers['x-api-key']).toBe('tf_key_test');
		expect(captured?.headers['accept']).toBe('image/jpeg');
		expect(result.contentType).toBe('image/jpeg');
		expect(result.bytes.equals(jpeg)).toBe(true);
	});

	it('wraps a non-ok response with its status, body and code', async () => {
		mockRawFetch({
			status: 404,
			statusText: 'Not Found',
			body: { error: { code: 'NOT_FOUND', message: 'No such step' } },
			retryAfter: '2',
		});

		await expect(
			makeTinyFishRawRequest(
				'agent',
				'/v1/runs/run-1/steps/evt_1/html',
				'tf_key_test',
				'text/html',
			),
		).rejects.toMatchObject({
			name: 'TinyFishError',
			message:
				'TinyFish request failed (404 Not Found): {"error":{"code":"NOT_FOUND","message":"No such step"}}',
			status: 404,
			retryAfter: 2000,
			code: 'NOT_FOUND',
		});
	});

	it('wraps transport failures in a TinyFishError', async () => {
		installFetch(async () => {
			throw new TypeError('network down');
		});

		await expect(
			makeTinyFishRawRequest(
				'agent',
				'/v1/runs/run-1/steps/evt_1/html',
				'tf_key_test',
				'text/html',
			),
		).rejects.toBeInstanceOf(TinyFishError);
	});
});
