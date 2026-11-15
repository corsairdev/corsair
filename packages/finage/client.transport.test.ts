import { FinageAPIError, makeFinageRequest } from './client';

// Runs the real shared transport (no corsair/http mock) against a stubbed
// fetch, so the Retry-After wiring is checked end to end.
describe('Finage transport rate limits', () => {
	const originalFetch = globalThis.fetch;

	afterEach(() => {
		globalThis.fetch = originalFetch;
	});

	it('makes one attempt on 429 and carries Retry-After to the error handler', async () => {
		const fetchMock = jest.fn(
			async () =>
				new Response(
					JSON.stringify({
						error: { code: 'rate_limited', message: 'Too Many Requests' },
					}),
					{
						status: 429,
						headers: {
							'Content-Type': 'application/json',
							'Retry-After': '30',
						},
					},
				),
		);
		globalThis.fetch = fetchMock as unknown as typeof fetch; // unknown: jest mock narrowed to the fetch signature

		const error = await makeFinageRequest(
			'/last/stock/AAPL',
			'secret-key',
		).catch(
			(caught: unknown) => caught, // unknown: rejection value, narrowed below
		);

		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect(error).toBeInstanceOf(FinageAPIError);
		expect(error).toMatchObject({
			status: 429,
			code: 'rate_limited',
			retryAfter: 30_000,
		});
	});

	it('sends a symbol list with literal commas', async () => {
		// Finage reads symbols=AAPL%2CMSFT as one unknown symbol and answers a
		// blank snapshot entry (seen live on 2026-11-10); AAPL,MSFT returns both.
		const fetchMock = jest.fn(
			async (_url: string) =>
				new Response(JSON.stringify({ totalResults: 0 }), {
					status: 200,
					headers: { 'Content-Type': 'application/json' },
				}),
		);
		globalThis.fetch = fetchMock as unknown as typeof fetch; // unknown: jest mock narrowed to the fetch signature

		await makeFinageRequest('/snapshot/stock', 'secret-key', {
			quotes: true,
			trades: true,
			symbols: 'AAPL,MSFT',
			missing: undefined,
		});

		expect(fetchMock).toHaveBeenCalledTimes(1);
		const url = new URL(String(fetchMock.mock.calls[0]?.[0]));
		expect(url.pathname).toBe('/snapshot/stock');
		expect(url.search).toBe(
			'?quotes=true&trades=true&symbols=AAPL,MSFT&apikey=secret-key',
		);
	});
});
