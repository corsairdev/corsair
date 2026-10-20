import { FixerConversion, FixerCurrency, FixerRateSnapshot } from './database';

export const FixerSchema = {
	version: '1.0.0',
	entities: {
		rates: FixerRateSnapshot,
		currencies: FixerCurrency,
		conversions: FixerConversion,
	},
} as const;
