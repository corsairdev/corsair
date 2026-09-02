import {
	CurrenciesGetAllInputSchema,
	CurrenciesGetAllOutputSchema,
	RatesConvertInputSchema,
	RatesConvertOutputSchema,
	RatesHistoricalInputSchema,
	RatesHistoricalOutputSchema,
	RatesLatestInputSchema,
	RatesLatestOutputSchema,
} from './endpoints/types';

describe('Fixer Endpoint Schemas', () => {
	it('validates rates.latest input and output schemas', () => {
		const input = { base: 'USD', symbols: ['EUR', 'GBP'] };
		expect(RatesLatestInputSchema.safeParse(input).success).toBe(true);

		const output = {
			success: true,
			timestamp: 1600000000,
			base: 'USD',
			date: '2026-09-02',
			rates: { EUR: 0.92, GBP: 0.78 },
		};
		expect(RatesLatestOutputSchema.safeParse(output).success).toBe(true);
	});

	it('validates rates.convert input and output schemas', () => {
		const input = { from: 'USD', to: 'EUR', amount: 100 };
		expect(RatesConvertInputSchema.safeParse(input).success).toBe(true);

		const output = {
			success: true,
			query: { from: 'USD', to: 'EUR', amount: 100 },
			info: { timestamp: 1600000000, rate: 0.92 },
			date: '2026-09-02',
			result: 92,
		};
		expect(RatesConvertOutputSchema.safeParse(output).success).toBe(true);
	});

	it('validates rates.historical input and output schemas', () => {
		const input = { date: '2026-01-01', base: 'EUR' };
		expect(RatesHistoricalInputSchema.safeParse(input).success).toBe(true);

		const invalidInput = { date: '01-01-2026' };
		expect(RatesHistoricalInputSchema.safeParse(invalidInput).success).toBe(
			false,
		);

		const output = {
			success: true,
			historical: true,
			date: '2026-01-01',
			base: 'EUR',
			rates: { USD: 1.08 },
		};
		expect(RatesHistoricalOutputSchema.safeParse(output).success).toBe(true);
	});

	it('validates currencies.getAll input and output schemas', () => {
		expect(CurrenciesGetAllInputSchema.safeParse({}).success).toBe(true);

		const output = {
			success: true,
			symbols: { USD: 'United States Dollar', EUR: 'Euro' },
		};
		expect(CurrenciesGetAllOutputSchema.safeParse(output).success).toBe(true);
	});
});
