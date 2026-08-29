import 'dotenv/config';
import { MarketstackAPIError, makeMarketstackRequest } from './client';
import type {
	GetEodResponse,
	ListCurrenciesResponse,
	ListExchangesResponse,
} from './endpoints/types';
import { MarketstackEndpointOutputSchemas } from './endpoints/types';

const ACCESS_KEY = process.env.MARKETSTACK_API_KEY;

const describeIfKey = ACCESS_KEY ? describe : describe.skip;

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
