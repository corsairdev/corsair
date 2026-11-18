import {
	CoinmarketcalCategory,
	CoinmarketcalCoin,
	CoinmarketcalEvent,
} from './database';

export const CoinmarketcalSchema = {
	version: '1.0.0',
	entities: {
		coins: CoinmarketcalCoin,
		events: CoinmarketcalEvent,
		categories: CoinmarketcalCategory,
	},
} as const;

export * from './database';
