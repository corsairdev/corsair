import 'dotenv/config';
import { MarketstackAPIError, makeMarketstackRequest } from './client';
import { getDividends } from './endpoints/dividends';
import { getExchange } from './endpoints/exchanges';
import { getSplits } from './endpoints/splits';
import {
	getTickerEod,
	getTickerEodLatest,
	getTickerInfo,
	listTickers,
} from './endpoints/tickers';
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
			expect(result.exchange_status).toBeDefined();
		});
	});

	describe('tickers.get', () => {
		it('returns sector, industry, and exchange for a ticker', async () => {
			const result = await getTickerInfo(liveCtx(), { symbol: 'AAPL' });

			MarketstackEndpointOutputSchemas.getTickerInfo.parse(result);
			expect(result.symbol).toBe('AAPL');
			expect(result.sector).toBe('Technology');
			expect(result.industry).toBe('Consumer Electronics');
			expect(result.stock_exchange?.mic).toBe('XNAS');
		});
	});

	describe('tickers.getEodLatest', () => {
		it('returns the latest EOD bar for a ticker', async () => {
			const result = await getTickerEodLatest(liveCtx(), { symbol: 'AAPL' });

			MarketstackEndpointOutputSchemas.getTickerEodLatest.parse(result);
			expect(result.symbol).toBe('AAPL');
			expect(typeof result.close).toBe('number');
		});
	});

	describe('dividends.get', () => {
		it('returns dividend amounts and payment dates', async () => {
			const result = await getDividends(liveCtx(), {
				symbols: ['AAPL'],
				limit: 2,
			});

			MarketstackEndpointOutputSchemas.getDividends.parse(result);
			expect(result.data.length).toBeGreaterThan(0);
			expect(result.data[0]?.symbol).toBe('AAPL');
			expect(result.data[0]?.payment_date).toBeTruthy();
		});
	});

	describe('splits.get', () => {
		it('returns split factors for a ticker', async () => {
			const result = await getSplits(liveCtx(), {
				symbols: ['AAPL'],
				limit: 2,
			});

			MarketstackEndpointOutputSchemas.getSplits.parse(result);
			expect(result.data.length).toBeGreaterThan(0);
			expect(result.data[0]?.symbol).toBe('AAPL');
			expect(result.data[0]?.split_factor).toBeGreaterThan(0);
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
