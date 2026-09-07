// Mocked transport coverage intentionally runs in Corsair's normal CI lane.

import { makeTokenMetricsRequest } from './client';
import { getPrice, getTopMarketCap } from './endpoints/market';
import { getIndicators } from './endpoints/technical';
import { list } from './endpoints/tokens';
import { getSignals } from './endpoints/trading';

const fetchMock = jest.spyOn(globalThis, 'fetch');
const ctx = {
	key: 'token-metrics-test-key',
	options: {},
	$getAccountId: async () => 'test-account',
} as never;

function json(body: unknown): Response {
	return new Response(JSON.stringify(body), {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
	});
}

describe('Token Metrics API operations', () => {
	beforeEach(() => {
		fetchMock.mockReset();
		fetchMock.mockImplementation(async (input) => {
			const url = String(input);
			if (url.includes('technical-indicators'))
				return json({ data: [{ symbol: 'BTC', indicator: 'rsi', value: 55 }] });
			if (url.includes('trading-signals'))
				return json({ data: [{ symbol: 'BTC', signal: 1 }] });
			return json({ data: [{ token_id: 3375, symbol: 'BTC', price: 60000 }] });
		});
	});
	afterAll(() => fetchMock.mockRestore());

	it('calls and validates all five catalog operations', async () => {
		const price = await getPrice(ctx, { symbol: 'BTC', interval: '1d' });
		const indicators = await getIndicators(ctx, {
			symbol: 'BTC',
			interval: '1d',
			indicator: 'rsi',
		});
		const tokens = await list(ctx, { symbol: 'BTC', limit: 10 });
		const top = await getTopMarketCap(ctx, { top_k: 25 });
		const signals = await getSignals(ctx, { symbol: 'BTC', signal: 1 });

		expect(price.data[0]?.symbol).toBe('BTC');
		expect(indicators.data[0]?.indicator).toBe('rsi');
		expect(tokens.data).toHaveLength(1);
		expect(top.data[0]?.token_id).toBe(3375);
		expect(signals.data[0]?.signal).toBe(1);
		expect(fetchMock).toHaveBeenCalledTimes(5);
		const calls = fetchMock.mock.calls.map(([input]) => String(input));
		expect(calls[0]).toContain('/v2/price?symbol=BTC');
		expect(calls[1]).toContain('/v2/technical-indicators?symbol=BTC');
		expect(calls[2]).toContain('/v2/tokens?symbol=BTC');
		expect(calls[3]).toContain('/v2/top-market-cap-tokens?top_k=25');
		expect(calls[4]).toContain('/v2/trading-signals?symbol=BTC');
		for (const [, init] of fetchMock.mock.calls)
			expect(new Headers(init?.headers).get('api_key')).toBe(
				'token-metrics-test-key',
			);
		for (const [, init] of fetchMock.mock.calls) {
			expect(init?.redirect).toBe('error');
		}
	});

	it('rejects blank token identifiers', async () => {
		await expect(getPrice(ctx, { token_id: '   ' })).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('refuses redirects before forwarding the custom API key', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(null, {
				status: 302,
				headers: { Location: 'http://untrusted.example/collect' },
			}),
		);

		await expect(
			makeTokenMetricsRequest('/tokens', 'token-metrics-test-key'),
		).rejects.toMatchObject({ status: 302 });
		const init = fetchMock.mock.calls[0]?.[1];
		expect(init?.redirect).toBe('error');
		expect(new Headers(init?.headers).get('api_key')).toBe(
			'token-metrics-test-key',
		);
	});

	it('preserves status and retry metadata for malformed JSON errors', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response('{not-json', {
				status: 429,
				statusText: 'Too Many Requests',
				headers: {
					'Content-Type': 'application/json',
					'Retry-After': '2',
				},
			}),
		);

		await expect(
			makeTokenMetricsRequest('/tokens', 'token-metrics-test-key'),
		).rejects.toMatchObject({
			status: 429,
			retryAfter: 2000,
			body: '{not-json',
		});
	});
});
