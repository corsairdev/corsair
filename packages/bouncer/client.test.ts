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
		global.fetch = realFetch;
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

	it('configures base URL and x-api-key correctly for GET requests', async () => {
		mockFetch(200, { credits: 100 });

		const result = await makeBouncerRequest<{ credits: number }>(
			'credits',
			'test-api-key',
			{ method: 'GET', query: { timeout: 10 } },
		);

		expect(calls.length).toBe(1);
		expect(calls[0]?.url).toContain(`${BOUNCER_API_BASE}/credits?timeout=10`);
		const headers = new Headers(calls[0]?.init?.headers);
		expect(headers.get('x-api-key')).toBe('test-api-key');
		expect(result).toEqual({ credits: 100 });
	});

	it('sends POST body correctly for batch requests', async () => {
		mockFetch(200, { batchId: 'batch-123' });

		const body = [{ email: 'test@example.com' }];
		const result = await makeBouncerRequest<{ batchId: string }>(
			'/email/verify/batch',
			'test-api-key',
			{ method: 'POST', body },
		);

		expect(calls.length).toBe(1);
		expect(calls[0]?.url).toBe(`${BOUNCER_API_BASE}/email/verify/batch`);
		expect(calls[0]?.init?.method).toBe('POST');
		expect(JSON.parse(calls[0]?.init?.body as string)).toEqual(body);
		expect(result).toEqual({ batchId: 'batch-123' });
	});

	it('wraps 400 error in BouncerAPIError preserving status', async () => {
		mockFetch(400, { message: 'Bad Request' });

		await expect(
			makeBouncerRequest('email/verify', 'key', { method: 'GET' }),
		).rejects.toThrow(BouncerAPIError);

		try {
			await makeBouncerRequest('email/verify', 'key', { method: 'GET' });
		} catch (err: any) {
			expect(err).toBeInstanceOf(BouncerAPIError);
			expect(err.status).toBe(400);
		}
	});

	it('wraps generic Network Error in BouncerAPIError', async () => {
		global.fetch = (async () => {
			throw new Error('Network timeout');
		}) as unknown as typeof global.fetch;

		await expect(
			makeBouncerRequest('credits', 'key', { method: 'GET' }),
		).rejects.toThrow(BouncerAPIError);
	});
});
