import 'dotenv/config';
import { MarketstackAPIError, makeMarketstackRequest } from './client';
import { getExchange } from './endpoints/exchanges';
import { getTickerEod, listTickers } from './endpoints/tickers';
import type {
	GetEodResponse,
	ListCurrenciesResponse,
	ListExchangesResponse,
} from './endpoints/types';
import { MarketstackEndpointOutputSchemas } from './endpoints/types';
import type { MarketstackContext } from './index';

const ACCESS_KEY = process.env.MARKETSTACK_API_KEY;

const describeIfKey = ACCESS_KEY ? describe : describe.skip;

function liveCtx(): MarketstackContext {
	return { key: ACCESS_KEY, options: {} } as never;
}

describeIfKey('Marketstack API Type Tests', () => {
	describe('eod', () => {
		it('returns EOD data for a known ticker', async () => {
			const response = await makeMarketstackRequest<GetEodResponse>(
				'eod',
				ACCESS_KEY!,
				{ query: { symbols: 'AAPL', limit: 5 } },
			);

			MarketstackEndpointOutputSchemas.getEod.parse(response);
			expect(response.data.length).toBeGreaterThan(0);
			expect(response.data[0]?.symbol).toBe('AAPL');
		});
	});

	describe('exchanges', () => {
		it('lists exchanges with pagination', async () => {
			const response = await makeMarketstackRequest<ListExchangesResponse>(
				'exchanges',
				ACCESS_KEY!,
				{ query: { limit: 5 } },
			);

			MarketstackEndpointOutputSchemas.listExchanges.parse(response);
			expect(response.data.length).toBeGreaterThan(0);
		});
	});

	describe('tickers.list', () => {
		it('calls /tickerslist and remaps `ticker` onto `symbol`', async () => {
			const result = await listTickers(liveCtx(), {
				search: 'Apple',
				limit: 5,
			});

			MarketstackEndpointOutputSchemas.listTickers.parse(result);
			expect(result.data.length).toBeGreaterThan(0);
			expect(typeof result.data[0]?.symbol).toBe('string');
			expect(result.data[0]).not.toHaveProperty('ticker');
		});
	});

	describe('tickers.getEod', () => {
		it('flattens the v2 `data.eod` nesting for a ticker-scoped lookup', async () => {
			const result = await getTickerEod(liveCtx(), {
				symbol: 'AAPL',
				limit: 3,
			});

			MarketstackEndpointOutputSchemas.getTickerEod.parse(result);
			expect(Array.isArray(result.data)).toBe(true);
			expect(result.data.length).toBeGreaterThan(0);
			expect(result.data[0]?.symbol).toBe('AAPL');
		});
	});

	describe('exchanges.get', () => {
		it('unwraps the v2 `data` envelope for a single exchange lookup', async () => {
			const result = await getExchange(liveCtx(), { mic: 'XNAS' });

			MarketstackEndpointOutputSchemas.getExchange.parse(result);
			expect(result.mic).toBe('XNAS');
		});
	});

	describe('currencies', () => {
		it('lists supported currencies', async () => {
			const response = await makeMarketstackRequest<ListCurrenciesResponse>(
				'currencies',
				ACCESS_KEY!,
			);

			MarketstackEndpointOutputSchemas.listCurrencies.parse(response);
			expect(response.data.length).toBeGreaterThan(0);
		});
	});

	describe('errors', () => {
		it('rejects an invalid access key', async () => {
			await expect(
				makeMarketstackRequest<GetEodResponse>('eod', 'invalid-access-key', {
					query: { symbols: 'AAPL' },
				}),
			).rejects.toBeInstanceOf(MarketstackAPIError);
		});
	});
});
