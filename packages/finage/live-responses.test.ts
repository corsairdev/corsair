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
});
