import {
	makeSearch1APIRequest,
	requestSearch1APIScreenshot,
	Search1APIError,
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

function captureInit(url: string | URL, init?: RequestInit): void {
	const headers: Record<string, string> = {};
	const raw = init?.headers;
	if (raw instanceof Headers) {
		raw.forEach((value, key) => {
			headers[key.toLowerCase()] = value;
		});
	} else {
		for (const [key, value] of Object.entries(raw ?? {})) {
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
}

// payloads vary per test, so the mock body stays open
function mockFetch(response: { status?: number; body?: unknown }) {
	fetchCount = 0;
	global.fetch = (async (url: string | URL, init?: RequestInit) => {
		captureInit(url, init);

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

function mockBinaryFetch(response: {
	status?: number;
	contentType?: string | null;
	bytes?: Uint8Array;
	retryAfter?: string;
	body?: string;
}) {
	fetchCount = 0;
	global.fetch = (async (url: string | URL, init?: RequestInit) => {
		captureInit(url, init);

		const headers = new Headers();
		if (response.contentType !== null) {
			headers.set('Content-Type', response.contentType ?? 'image/png');
		}
		if (response.retryAfter) {
			headers.set('Retry-After', response.retryAfter);
		}
		const bytes = response.bytes ?? new Uint8Array([1, 2, 3]);
		return {
			ok: (response.status ?? 200) < 400,
			status: response.status ?? 200,
			statusText: 'OK',
			url: String(url),
			headers,
			arrayBuffer: async () => bytes.buffer,
			text: async () => response.body ?? '',
			json: async () => JSON.parse(response.body ?? '{}'),
			// Partial `Response` stub; only what the raw screenshot path reads.
		};
	}) as unknown as typeof global.fetch;
}

describe('makeSearch1APIRequest', () => {
	afterEach(() => {
		mockFetch({ body: {} });
	});

	it('sends the key as a bearer token against the api base URL', async () => {
		mockFetch({ body: { usage: 10, credential_type: 'api_key' } });

		await makeSearch1APIRequest('/usage', 's1_key_test', { method: 'GET' });

		expect(captured?.url).toBe('https://api.search1api.com/usage');
		expect(captured?.headers['authorization']).toBe('Bearer s1_key_test');
	});

	it('posts a JSON body for search', async () => {
		mockFetch({ body: { results: [] } });

		await makeSearch1APIRequest('/search', 's1_key_test', {
			method: 'POST',
			body: { query: 'corsair integrations', max_results: 3 },
		});

		expect(captured?.method).toBe('POST');
		expect(captured?.headers['content-type']).toContain('application/json');
		expect(JSON.parse(captured?.body ?? '{}')).toEqual({
			query: 'corsair integrations',
			max_results: 3,
		});
	});

	it('supports array bodies for batch endpoints', async () => {
		mockFetch({ body: { results: [] } });

		await makeSearch1APIRequest('/search', 's1_key_test', {
			method: 'POST',
			body: [{ query: 'one' }, { query: 'two' }],
		});

		expect(JSON.parse(captured?.body ?? '{}')).toEqual([
			{ query: 'one' },
			{ query: 'two' },
		]);
	});

	it('wraps non-ok responses in a Search1APIError with the status', async () => {
		mockFetch({ status: 401, body: { detail: 'Invalid API key' } });

		await expect(
			makeSearch1APIRequest('/usage', 's1_key_bad', { method: 'GET' }),
		).rejects.toMatchObject({
			name: 'Search1APIError',
			status: 401,
			body: { detail: 'Invalid API key' },
		});
	});

	it('maps 402 (out of credits) without retrying', async () => {
		mockFetch({ status: 402, body: { message: 'Insufficient credits' } });

		await expect(
			makeSearch1APIRequest('/search', 's1_key_test', {
				method: 'POST',
				body: { query: 'x' },
			}),
		).rejects.toMatchObject({ status: 402 });
		expect(fetchCount).toBe(1);
	});

	it('wraps transport failures in a Search1APIError', async () => {
		// the stub only rejects; no Response fields are ever read
		global.fetch = (async () => {
			throw new TypeError('network down');
		}) as unknown as typeof global.fetch;

		await expect(
			makeSearch1APIRequest('/usage', 's1_key_test', { method: 'GET' }),
		).rejects.toBeInstanceOf(Search1APIError);
	});
});

describe('requestSearch1APIScreenshot', () => {
	afterEach(() => {
		mockBinaryFetch({});
	});

	it('returns the rendered image as base64 with its content type', async () => {
		mockBinaryFetch({
			bytes: new Uint8Array([1, 2, 3, 4, 5]),
			contentType: 'image/png',
		});

		const file = await requestSearch1APIScreenshot(
			{ url: 'https://example.com', format: 'png' },
			's1_key_test',
		);

		expect(captured?.url).toBe('https://api.search1api.com/screenshot');
		expect(captured?.method).toBe('POST');
		expect(captured?.headers['authorization']).toBe('Bearer s1_key_test');
		expect(captured?.headers['content-type']).toContain('application/json');
		expect(captured?.headers['accept']).toContain('image/png');
		expect(JSON.parse(captured?.body ?? '{}')).toEqual({
			url: 'https://example.com',
			format: 'png',
		});
		expect(file).toEqual({
			contentType: 'image/png',
			base64: Buffer.from([1, 2, 3, 4, 5]).toString('base64'),
			sizeBytes: 5,
		});
	});

	it('maps a rate-limited screenshot with its Retry-After delay', async () => {
		mockBinaryFetch({
			status: 429,
			retryAfter: '2',
			body: JSON.stringify({ message: 'Too many requests' }),
		});

		await expect(
			requestSearch1APIScreenshot({ url: 'https://example.com' }, 's1_key'),
		).rejects.toMatchObject({
			name: 'Search1APIError',
			status: 429,
			retryAfter: 2000,
		});
		expect(fetchCount).toBe(1);
	});

	it('rejects a 200 response that is not an image', async () => {
		mockBinaryFetch({
			contentType: 'application/json',
			body: JSON.stringify({ detail: 'unexpected' }),
		});

		await expect(
			requestSearch1APIScreenshot({ url: 'https://example.com' }, 's1_key'),
		).rejects.toThrow(/non-image/);
	});
});
