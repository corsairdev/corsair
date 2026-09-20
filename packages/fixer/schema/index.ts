import { FixerRate, FixerSymbol } from './database';

export const FixerSchema = {
	version: '1.0.0',
	entities: {
		rate: FixerRate,
		symbol: FixerSymbol,
	},
} as const;

export * from './database';
