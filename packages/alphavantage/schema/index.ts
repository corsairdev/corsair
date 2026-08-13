import { AlphaVantageCompany, AlphaVantageSymbolEntity } from './database';

export const AlphaVantageSchema = {
	version: '1.0.0',
	entities: {
		symbols: AlphaVantageSymbolEntity,
		companies: AlphaVantageCompany,
	},
} as const;

export * from './database';
