import { CurrencyScoopSchema } from './schema';
import {
	CurrencyScoopCurrencyEntity,
	CurrencyScoopQuoteEntity,
} from './schema/database';

describe('CurrencyScoop schema', () => {
	it('declares currencies and quotes', () => {
		expect(CurrencyScoopSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(Object.keys(CurrencyScoopSchema.entities).sort()).toEqual([
			'currencies',
			'quotes',
		]);
	});

	it('rejects a quote with no rate', () => {
		expect(
			CurrencyScoopCurrencyEntity.parse({ id: 'USD', name: 'US Dollar' }).id,
		).toBe('USD');
		expect(
			CurrencyScoopQuoteEntity.safeParse({
				id: '2024-01-01:USD:EUR',
				date: '2024-01-01',
				base: 'USD',
				code: 'EUR',
			}).success,
		).toBe(false);
	});
});
