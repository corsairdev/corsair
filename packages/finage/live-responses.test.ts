import { FinageOutputSchemas } from './endpoints/types';

// Real responses from the Finage API (free plan, 2026-11-10), trimmed. Each one
// failed the first version of the output schemas.
describe('Finage live responses', () => {
	it('accepts detail responses returned as a bare object', () => {
		// The reference shows these four wrapped in an array; the API returns the
		// object itself.
		const cases = {
			getStockCompanyDetails: {
				symbol: 'AAPL',
				logo: 'https://finage.s3.eu-west-2.amazonaws.com/stock/logo/AAPL.png',
				name: 'Apple Inc. Common Stock',
				url: 'https://www.apple.com/',
				description: 'Apple Inc. designs, manufactures and markets smartphones',
				exchange: 'US Market',
				ceo: 'Tim Cook',
				industry: 'Consumer Electronics',
				state: 'CA',
				address: 'One Apple Park Way, Cupertino, CA 95014',
				employees: 0,
				sector: 'Technology',
				marketcap: 0,
			},
			getCountryDetail: {
				country: 'United Kingdom',
				country_code: 'GB',
				currency: 'Sterling',
				currency_code: 'GBP',
				phone_code: '+44',
				country_flag:
					'https://finage.s3.eu-west-2.amazonaws.com/flags/160x120/gb.png',
			},
			getCurrencyDetail: {
				symbol: 'GBPUSD',
				from: 'Pound sterling',
				to: 'United States dollar',
				from_flag:
					'https://finage.s3.eu-west-2.amazonaws.com/flags/160x120/gb.png',
				to_flag:
					'https://finage.s3.eu-west-2.amazonaws.com/flags/160x120/us.png',
			},
			getCryptoDetailed: {
				symbol: 'BTCUSD',
				name: 'Bitcoin USD',
				price: 74244.09,
				changesPercentage: -1.34182,
				change: -1009.77,
				high: 75317.23,
				open: 75253.86,
				low: 74033.2,
				close: 75253.86,
				yearHigh: 116410.06,
				yearLow: 57717.55,
				marketCap: 1482846769493,
				priceAvg50: 81738.83,
				priceAvg200: 73169.69,
				volume: 22667182080,
				avgVolume: 28931159292,
				exchange: 'CRYPTO',
				sharesOutstanding: 19972590,
				timestamp: 1794313045,
			},
		} as const;
		for (const [operation, body] of Object.entries(cases)) {
			const schema =
				FinageOutputSchemas[operation as keyof typeof FinageOutputSchemas];
			expect(schema.safeParse(body).success).toBe(true);
			// The documented array form keeps working.
			expect(schema.safeParse([body]).success).toBe(true);
		}
	});

	it('accepts the snake_case is_active on cryptocurrency search and detail', () => {
		// Search sends is_active as a string, detail as a boolean; neither sends
		// the documented isActive.
		const search = FinageOutputSchemas.searchCryptocurrency.safeParse({
			limit: 3,
			key: 'bitcoin',
			results: [
				{
					name: '0xBitcoin',
					symbol: '0xBTC',
					type: 'token',
					is_active: 'true',
				},
				{
					name: 'BitCoin One',
					symbol: 'BTCONE',
					type: 'token',
					is_active: 'false',
				},
			],
		});
		expect(search.success).toBe(true);

		const detail = FinageOutputSchemas.getCryptoDetail.safeParse({
			name: 'Bitcoin',
			symbol: 'BTC',
			type: 'coin',
			is_active: false,
			description: 'Bitcoin is a cryptocurrency and worldwide payment system.',
			developers: [{ name: 'Satoshi Nakamoto', position: 'Founder' }],
			open_source: false,
			started_at: '0001-01-01T00:00:00Z',
			hash_algorithm: '',
			links: { website: ['https://bitcoin.org/'] },
			thumbnail:
				'https://finage.s3.eu-west-2.amazonaws.com/cryptocurrency/128x128/bitcoin.png',
			development_status: '',
			hardware_wallet: false,
		});
		expect(detail.success).toBe(true);
		if (detail.success) {
			expect(detail.data.is_active).toBe(false);
			expect(detail.data.open_source).toBe(false);
		}
	});

	it('accepts total_results on the cryptocurrency list', () => {
		const parsed = FinageOutputSchemas.listCryptocurrencies.safeParse({
			total_results: 2,
			results: [
				{
					symbol: 'btc',
					name: 'Bitcoin',
					thumbnail:
						'https://finage.s3.eu-west-2.amazonaws.com/cryptocurrency/128x128/bitcoin.png',
					market_cap: 1494316545621,
					ath: 126080,
					ath_date: '2025-10-06T10:57:42Z',
					order: 1,
				},
				{
					symbol: 'eth',
					name: 'Ethereum',
					thumbnail:
						'https://finage.s3.eu-west-2.amazonaws.com/cryptocurrency/128x128/ethereum.png',
					market_cap: 255577122602,
					ath: 4946.05,
					ath_date: '2025-08-24T11:21:03Z',
					order: 2,
				},
			],
		});
		expect(parsed.success).toBe(true);
	});

	it('accepts null and blank values in response fields', () => {
		// Previous close with no bar for the day.
		expect(
			FinageOutputSchemas.getStockPreviousClose.safeParse({
				symbol: 'AAPL',
				totalResults: 0,
				results: null,
			}).success,
		).toBe(true);
		// Snapshots on the free plan: one blank entry with an empty symbol.
		const blankSnapshot = {
			totalResults: 1,
			lastQuotes: [{ s: '', a: 0, b: 0, asz: 0, bsz: 0, t: 0 }],
			lastTrades: [{ s: '', p: 0, sz: 0, t: 0 }],
		};
		for (const operation of [
			'getStockSnapshot',
			'getForexSnapshot',
			'getCryptoSnapshot',
		] as const) {
			expect(
				FinageOutputSchemas[operation].safeParse(blankSnapshot).success,
			).toBe(true);
		}
		// Market search leaves s_type blank.
		expect(
			FinageOutputSchemas.searchMarket.safeParse({
				key: 'apple',
				market: 'us',
				limit: 2,
				results: [
					{
						symbol: 'APLE',
						description: 'Apple Hospitality REIT, Inc.',
						s_type: '',
					},
					{
						symbol: 'AAPL',
						description: 'Apple Inc. Common Stock',
						s_type: '',
					},
				],
			}).success,
		).toBe(true);
		// A null where the reference shows a value does not fail the response.
		expect(
			FinageOutputSchemas.getStockLastQuote.safeParse({
				symbol: 'AAPL',
				ask: null,
				bid: 351.5828,
				timestamp: 1794312944558,
			}).success,
		).toBe(true);
		expect(
			FinageOutputSchemas.getUkMarketLastPrice.safeParse({
				symbol: 'BP',
				price: null,
				timestamp: 1794312944558,
			}).success,
		).toBe(true);
	});

	it('still fails a response that leaves out a documented field', () => {
		expect(
			FinageOutputSchemas.getStockLastQuote.safeParse({
				symbol: 'AAPL',
				bid: 1,
				timestamp: 1,
			}).success,
		).toBe(false);
	});
});
