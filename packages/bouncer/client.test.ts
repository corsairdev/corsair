import {
	BOUNCER_API_BASE,
	BouncerAPIError,
	makeBouncerRequest,
} from './client';

const realFetch = global.fetch;

describe('Bouncer client', () => {
	let calls: { url: string; init?: RequestInit }[] = [];

	beforeEach(() => {
		calls = [];
	});

	afterEach(() => {
		global.fetch = realFetch;
	});

	function mockFetch(
		status = 200,
		body: unknown = {},
		headers: Record<string, string> = {},
	) {
		global.fetch = (async (url: string, init?: RequestInit) => {
			calls.push({ url, init });
			return {
				ok: status >= 200 && status < 300,
				status,
				statusText: status === 200 ? 'OK' : 'Error',
				url,
				headers: new Headers({
					'Content-Type': 'application/json',
					...headers,
				}),
				json: async () => body,
				text: async () => JSON.stringify(body),
			};
		}) as unknown as typeof global.fetch;
	}

	it('builds a versionless base so callers choose v1 or v1.1', () => {
		expect(BOUNCER_API_BASE).toBe('https://api.usebouncer.com');
	});

	it('authenticates with x-api-key only', async () => {
		mockFetch(200, { credits: 100 });

		const result = await makeBouncerRequest<{ credits: number }>(
			'v1.1/credits',
			'test-api-key',
		);

		expect(calls).toHaveLength(1);
		expect(calls[0]?.url).toBe(`${BOUNCER_API_BASE}/v1.1/credits`);
		const headers = new Headers(calls[0]?.init?.headers);
		expect(headers.get('x-api-key')).toBe('test-api-key');
		// A bearer header would leak the same secret a second time.
		expect(headers.get('authorization')).toBeNull();
		expect(result).toEqual({ credits: 100 });
	});

	it('tolerates a leading slash on the endpoint', async () => {
		mockFetch(200, {});

		await makeBouncerRequest('/v1.1/credits', 'k');

		expect(calls[0]?.url).toBe(`${BOUNCER_API_BASE}/v1.1/credits`);
	});

	it('sends a JSON body on POST', async () => {
		mockFetch(200, { batchId: 'batch-123' });

		const body = [{ email: 'test@example.com' }];
		await makeBouncerRequest('v1.1/email/verify/batch', 'k', {
			method: 'POST',
			body,
		});

		expect(calls[0]?.init?.method).toBe('POST');
		expect(JSON.parse(calls[0]?.init?.body as string)).toEqual(body);
	});

	it('sends query parameters alongside a POST body', async () => {
		mockFetch(200, {});

		await makeBouncerRequest('v1.1/email/verify/batch', 'k', {
			method: 'POST',
			body: [{ email: 'a@b.com' }],
			query: { callback: 'https://example.com/hook' },
		});

		expect(new URL(calls[0]!.url).searchParams.get('callback')).toBe(
			'https://example.com/hook',
		);
	});

	it('drops undefined query parameters', async () => {
		mockFetch(200, {});

		await makeBouncerRequest('v1.1/email/verify', 'k', {
			query: { email: 'a@b.com', timeout: undefined },
		});

		expect(calls[0]?.url).toBe(
			`${BOUNCER_API_BASE}/v1.1/email/verify?email=a%40b.com`,
		);
	});

	it('wraps an HTTP error in BouncerAPIError preserving status', async () => {
		mockFetch(402, { status: '402', error: 'Payment Required' });

		await expect(makeBouncerRequest('v1.1/credits', 'k')).rejects.toThrow(
			BouncerAPIError,
		);

		try {
			await makeBouncerRequest('v1.1/credits', 'k');
			throw new Error('expected a rejection');
		} catch (err) {
			expect(err).toBeInstanceOf(BouncerAPIError);
			expect((err as BouncerAPIError).status).toBe(402);
		}
	});

	it('wraps a network failure in BouncerAPIError', async () => {
		global.fetch = (async () => {
			throw new Error('Network timeout');
		}) as unknown as typeof global.fetch;

		await expect(makeBouncerRequest('v1.1/credits', 'k')).rejects.toThrow(
			BouncerAPIError,
		);
	});
});
