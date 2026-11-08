import type { FinageOperationName } from './endpoints/types';
import {
	FinageInputSchemas,
	FinageOutputSchemas,
	operationNames,
} from './endpoints/types';
import { finageEndpointMeta, finageEndpointSchemas } from './index';
import { FinageSchema } from './schema';

describe('Finage schema', () => {
	const documentedAdditionalOperations = [
		'getBalanceSheetStatements',
		'getCanadaMarketAggregates',
		'getCanadaMarketLastPrice',
		'getCashFlowStatements',
		'getCfdEtfLastPrice',
		'getCfdEtfMarketAggregates',
		'getCfdEtfPreviousClose',
		'getCfdIndexLastPrice',
		'getCfdIndexMarketAggregates',
		'getCfdIndexPreviousClose',
		'getDelistedCompanies',
		'getDividendsCalendar',
		'getEarningsCalendar',
		'getEconomicCalendar',
		'getFinancialRatios',
		'getForexSignal',
		'getHistoricalDividendsCalendar',
		'getHistoricalStockSplitCalendar',
		'getIncomeStatements',
		'getIndianMarketAggregates',
		'getIndianMarketLastPrice',
		'getInstitutionalHolders',
		'getIpoCalendar',
		'getMutualFundHolders',
		'getRussianMarketAggregates',
		'getRussianMarketLastPrice',
		'getSharesFloat',
		'getStockSplitCalendar',
		'getUkMarketAggregates',
		'getUkMarketLastPrice',
		'getUsStocksSignal',
	];

	it('registers all unique REST operations in the current Finage docs', () => {
		expect(operationNames).toHaveLength(70);
		expect(operationNames).toEqual(
			expect.arrayContaining(documentedAdditionalOperations),
		);
	});

	it('declares a semver version', () => {
		expect(FinageSchema.version).toBeDefined();
		expect(FinageSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof FinageSchema.entities).toBe('object');
		expect(FinageSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(FinageSchema.entities))).toBe(true);
		for (const entity of Object.values(FinageSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});

	it('defines input, output, and metadata contracts for every operation', () => {
		expect(operationNames).toHaveLength(70);
		expect(Object.keys(FinageInputSchemas)).toHaveLength(operationNames.length);
		expect(Object.keys(FinageOutputSchemas)).toHaveLength(
			operationNames.length,
		);
		expect(Object.keys(finageEndpointSchemas)).toHaveLength(
			operationNames.length,
		);
		expect(Object.keys(finageEndpointMeta)).toHaveLength(operationNames.length);
	});

	it('requires every documented mandatory input and permits empty input only where documented', () => {
		const noRequiredInputs: FinageOperationName[] = [
			'getMostActiveStocks',
			'getSecRssFeed',
			'getSectorPerformance',
			'getStockMarketStatus',
			'getTopGainers',
			'getTopLosers',
			'getEarningsCalendar',
			'getDelistedCompanies',
			'listCryptocurrencies',
		];
		const operationsAcceptingEmptyInput = operationNames.filter(
			(name) => FinageInputSchemas[name].safeParse({}).success,
		);
		expect(operationsAcceptingEmptyInput.sort()).toEqual(
			noRequiredInputs.sort(),
		);
	});

	it('enforces the documented inputs for snapshots, balance sheets, and searches', () => {
		const requiredInputs: Array<
			[FinageOperationName, Record<string, boolean | number | string>]
		> = [
			['getCryptoSnapshot', { quotes: true, trades: true, symbols: 'BTCUSD' }],
			['getForexSnapshot', { quotes: true, trades: true, symbols: 'EURUSD' }],
			['getStockSnapshot', { quotes: true, trades: true, symbols: 'AAPL' }],
			[
				'getBalanceSheetStatements',
				{
					symbol: 'AAPL',
					limit: 10,
					period: 'annual',
				},
			],
			['searchCryptocurrency', { query: 'BTC', limit: 10 }],
			['searchMarket', { market: 'stock', query: 'AAPL', limit: 10 }],
		];

		for (const [name, input] of requiredInputs) {
			const schema = FinageInputSchemas[name];
			expect(schema.safeParse({}).success).toBe(false);
			expect(schema.safeParse(input).success).toBe(true);
		}
	});

	it('validates documented financial statement and ratio value types', () => {
		expect(
			FinageOutputSchemas.getBalanceSheetStatements.safeParse([
				{
					symbol: 'AAPL',
					date: '2020-09-26',
					period: 'FY',
					totalAssets: '323888000000',
				},
			]).success,
		).toBe(false);
		expect(
			FinageOutputSchemas.getFinancialRatios.safeParse([
				{
					symbol: 'AAPL',
					date: '2025-09-27',
					fiscalYear: '2025',
					period: 'annual',
					reportedCurrency: 'USD',
					grossProfitMargin: '0.45',
				},
			]).success,
		).toBe(false);
	});

	it('rejects malformed aggregate data with missing required fields', () => {
		const result = FinageOutputSchemas.getStockMarketAggregates.safeParse({
			symbol: 'AAPL',
			totalResults: 1,
			results: [{ o: 1, h: 2, l: 0.5, c: 1.5 }],
		});
		expect(result.success).toBe(false);
	});

	it('keeps crypto aggregate filters to the documented limit and sort', () => {
		const parsed = FinageInputSchemas.getCryptoAggregates.parse({
			symbol: 'BTCUSD',
			multiply: 1,
			time: 'day',
			from: '2025-01-01',
			to: '2025-01-02',
			limit: 10,
			sort: 'desc',
			dbt_filter: true,
			st: '09:30',
			et: '16:00',
			date_format: 'dt',
		});
		expect(parsed).toEqual({
			symbol: 'BTCUSD',
			multiply: 1,
			time: 'day',
			from: '2025-01-01',
			to: '2025-01-02',
			limit: 10,
			sort: 'desc',
		});
	});

	it('requires the documented news envelope fields', () => {
		expect(
			FinageOutputSchemas.getStockMarketNews.safeParse({
				ticker: 'AAPL',
				limit: 5,
				news: [{ title: 'Missing source and URL' }],
			}).success,
		).toBe(false);
		expect(
			FinageOutputSchemas.getSectorPerformance.safeParse({ sector: 'Airlines' })
				.success,
		).toBe(false);
	});

	it('requires documented quote and conversion fields', () => {
		expect(
			FinageOutputSchemas.getStockLastQuote.safeParse({ symbol: 'AAPL' })
				.success,
		).toBe(false);
		expect(
			FinageOutputSchemas.convertCrypto.safeParse({
				from: 'BTC',
				to: 'ETH',
				amount: 1,
			}).success,
		).toBe(false);
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
