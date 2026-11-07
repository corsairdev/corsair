import { makeSalesflareRequest, SalesflareAPIError } from './client';

// Runs the real shared transport (no corsair/http mock) against a stubbed
// fetch, so the Retry-After wiring is checked end to end.
describe('Salesflare transport rate limits', () => {
	const originalFetch = globalThis.fetch;

	afterEach(() => {
		globalThis.fetch = originalFetch;
	});

	it('makes one attempt on 429 and carries Retry-After to the error handler', async () => {
		const fetchMock = jest.fn(
			async () =>
				new Response(JSON.stringify({ message: 'Too Many Requests' }), {
					status: 429,
					headers: {
						'Content-Type': 'application/json',
						'Retry-After': '30',
					},
				}),
		);
		globalThis.fetch = fetchMock as unknown as typeof fetch; // unknown: jest mock narrowed to the fetch signature

		const error = await makeSalesflareRequest({ key: 'secret' }, '/me').catch(
			(caught: unknown) => caught, // unknown: rejection value, narrowed below
		);

		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect(error).toBeInstanceOf(SalesflareAPIError);
		expect((error as SalesflareAPIError).status).toBe(429);
		expect((error as SalesflareAPIError).retryAfter).toBe(30000);
	});
});
