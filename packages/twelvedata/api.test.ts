import { twelvedata, twelvedataEndpointSchemas } from './index';

/**
 * Live smoke test. It runs only when `TWELVEDATA_API_KEY` is set.
 *
 * The free plan allows 8 requests a minute and 800 a day, so the calls here stay
 * few. Two of them need no key at all (the stock, forex, crypto and exchange
 * lists answer openly), which is what the keyless probes used.
 *
 * Every answer goes through its output schema before asserting.
 */
const API_KEY = process.env.TWELVEDATA_API_KEY;
const describeIfKey = API_KEY ? describe : describe.skip;

if (!API_KEY) {
	// Say so out loud: a skipped suite reads as a pass in the summary otherwise.
	console.warn(
		'TWELVEDATA_API_KEY is not set, skipping the live Twelve Data tests',
	);
}

describeIfKey('Twelve Data live API', () => {
	const price = twelvedataEndpointSchemas['market.price'];
	const quote = twelvedataEndpointSchemas['market.quote'];
	const timeSeries = twelvedataEndpointSchemas['market.timeSeries'];
	const rsi = twelvedataEndpointSchemas['indicators.rsi'];
	const usage = twelvedataEndpointSchemas['market.apiUsage'];
	const stocks = twelvedataEndpointSchemas['reference.stocks'];

	// The raw client, built the way the plugin builds it.
	async function get(path: string, query?: Record<string, string | number>) {
		const { makeTwelveDataRequest } = await import('./client');
		return makeTwelveDataRequest(API_KEY ?? '', { method: 'GET', path, query });
	}

	it('reads a price through the output schema', async () => {
		const parsed = price.output.parse(await get('price', { symbol: 'AAPL' }));
		expect(typeof parsed.price).toBe('string');
	});

	it('reads a quote through the output schema', async () => {
		const parsed = quote.output.parse(await get('quote', { symbol: 'AAPL' }));
		expect(parsed.symbol).toBeDefined();
	});

	it('reads a daily time series through the output schema', async () => {
		const parsed = timeSeries.output.parse(
			await get('time_series', {
				symbol: 'AAPL',
				interval: '1day',
				outputsize: 2,
			}),
		);
		expect(parsed.values.length).toBeLessThanOrEqual(2);
		if (parsed.values.length > 0) {
			expect(typeof parsed.values[0]?.close).toBe('string');
		}
	});

	it('reads RSI through the output schema', async () => {
		const parsed = rsi.output.parse(
			await get('rsi', { symbol: 'AAPL', interval: '1day', time_period: 14 }),
		);
		expect(Array.isArray(parsed.values)).toBe(true);
	});

	it('reads the API usage through the output schema', async () => {
		const parsed = usage.output.parse(await get('api_usage'));
		expect(parsed).toBeDefined();
	});

	it('reads the stock reference list through the output schema', async () => {
		// This route answers without a key, which is how its shape was captured.
		const parsed = stocks.output.parse(await get('stocks', { symbol: 'AAPL' }));
		expect(parsed.data.length).toBeGreaterThan(0);
	});

	it('is wired with the key it was given', () => {
		expect(twelvedata({ key: API_KEY }).id).toBe('twelvedata');
	});
});
