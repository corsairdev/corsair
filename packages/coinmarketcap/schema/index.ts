export const CoinMarketCapSchema = {
	version: '1.0.0',
	// Every operation reads market data. CoinMarketCap has no write API, so
	// there is nothing to sync into the local database and no entity to add.
	entities: {},
} as const;
