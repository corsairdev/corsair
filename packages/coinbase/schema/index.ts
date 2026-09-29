import {
	CoinbaseAccount,
	CoinbaseCurrency,
	CoinbasePaymentMethod,
	CoinbasePrice,
	CoinbaseTransaction,
	CoinbaseUser,
} from './database';

export const CoinbaseSchema = {
	version: '1.0.0',
	entities: {
		users: CoinbaseUser,
		accounts: CoinbaseAccount,
		transactions: CoinbaseTransaction,
		prices: CoinbasePrice,
		currencies: CoinbaseCurrency,
		paymentMethods: CoinbasePaymentMethod,
	},
} as const;

export {
	CoinbaseAccount,
	CoinbaseAccountCurrency,
	CoinbaseCountry,
	CoinbaseCurrency,
	CoinbaseMoney,
	CoinbaseNetwork,
	CoinbasePagination,
	CoinbasePaymentMethod,
	CoinbasePrice,
	CoinbaseTransaction,
	CoinbaseUser,
} from './database';
