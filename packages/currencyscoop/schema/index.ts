import {
	CurrencyScoopCurrencyEntity,
	CurrencyScoopQuoteEntity,
} from './database';

export const CurrencyScoopSchema = {
	version: '1.0.0',
	entities: {
		currencies: CurrencyScoopCurrencyEntity,
		quotes: CurrencyScoopQuoteEntity,
	},
} as const;
