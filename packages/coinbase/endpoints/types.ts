import { z } from 'zod';
import {
	CoinbaseAccount,
	CoinbaseCurrency,
	CoinbasePagination,
	CoinbasePaymentMethod,
	CoinbasePrice,
	CoinbaseTransaction,
	CoinbaseUser,
} from '../schema';

const PaginationInputSchema = z.object({
	limit: z.number().int().min(1).max(100).optional(),
	starting_after: z.string().optional(),
	ending_before: z.string().optional(),
	order: z.enum(['asc', 'desc']).optional(),
});

export const CurrencyPairSchema = z
	.string()
	.min(3)
	.describe('Currency pair such as BTC-USD');

export const PricesGetSpotInputSchema = z.object({
	currency_pair: CurrencyPairSchema,
	date: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/)
		.optional()
		.describe('Historic spot price date (YYYY-MM-DD, UTC)'),
});
export type PricesGetSpotInput = z.infer<typeof PricesGetSpotInputSchema>;
export const PricesGetSpotOutputSchema = CoinbasePrice;
export type PricesGetSpotOutput = z.infer<typeof PricesGetSpotOutputSchema>;

export const PricesGetBuyInputSchema = z.object({
	currency_pair: CurrencyPairSchema,
});
export type PricesGetBuyInput = z.infer<typeof PricesGetBuyInputSchema>;
export const PricesGetBuyOutputSchema = CoinbasePrice;
export type PricesGetBuyOutput = z.infer<typeof PricesGetBuyOutputSchema>;

export const PricesGetSellInputSchema = z.object({
	currency_pair: CurrencyPairSchema,
});
export type PricesGetSellInput = z.infer<typeof PricesGetSellInputSchema>;
export const PricesGetSellOutputSchema = CoinbasePrice;
export type PricesGetSellOutput = z.infer<typeof PricesGetSellOutputSchema>;

export const DataGetExchangeRatesInputSchema = z.object({
	currency: z.string().min(1).optional(),
});
export type DataGetExchangeRatesInput = z.infer<
	typeof DataGetExchangeRatesInputSchema
>;
export const DataGetExchangeRatesOutputSchema = z.object({
	currency: z.string(),
	rates: z.record(z.string(), z.string()),
});
export type DataGetExchangeRatesOutput = z.infer<
	typeof DataGetExchangeRatesOutputSchema
>;

export const DataListCurrenciesInputSchema = z.object({});
export type DataListCurrenciesInput = z.infer<
	typeof DataListCurrenciesInputSchema
>;
export const DataListCurrenciesOutputSchema = z.object({
	data: z.array(CoinbaseCurrency),
});
export type DataListCurrenciesOutput = z.infer<
	typeof DataListCurrenciesOutputSchema
>;

export const DataGetTimeInputSchema = z.object({});
export type DataGetTimeInput = z.infer<typeof DataGetTimeInputSchema>;
export const DataGetTimeOutputSchema = z.object({
	iso: z.string(),
	epoch: z.number(),
});
export type DataGetTimeOutput = z.infer<typeof DataGetTimeOutputSchema>;

export const UserGetInputSchema = z.object({});
export type UserGetInput = z.infer<typeof UserGetInputSchema>;
export const UserGetOutputSchema = CoinbaseUser;
export type UserGetOutput = z.infer<typeof UserGetOutputSchema>;

export const AccountsListInputSchema = PaginationInputSchema;
export type AccountsListInput = z.infer<typeof AccountsListInputSchema>;
export const AccountsListOutputSchema = z.object({
	pagination: CoinbasePagination.optional(),
	data: z.array(CoinbaseAccount),
});
export type AccountsListOutput = z.infer<typeof AccountsListOutputSchema>;

export const AccountsGetInputSchema = z.object({
	account_id: z.string().min(1),
});
export type AccountsGetInput = z.infer<typeof AccountsGetInputSchema>;
export const AccountsGetOutputSchema = CoinbaseAccount;
export type AccountsGetOutput = z.infer<typeof AccountsGetOutputSchema>;

export const TransactionsListInputSchema = PaginationInputSchema.extend({
	account_id: z.string().min(1),
});
export type TransactionsListInput = z.infer<typeof TransactionsListInputSchema>;
export const TransactionsListOutputSchema = z.object({
	pagination: CoinbasePagination.optional(),
	data: z.array(CoinbaseTransaction),
});
export type TransactionsListOutput = z.infer<
	typeof TransactionsListOutputSchema
>;

export const TransactionsGetInputSchema = z.object({
	account_id: z.string().min(1),
	transaction_id: z.string().min(1),
});
export type TransactionsGetInput = z.infer<typeof TransactionsGetInputSchema>;
export const TransactionsGetOutputSchema = CoinbaseTransaction;
export type TransactionsGetOutput = z.infer<typeof TransactionsGetOutputSchema>;

export const PaymentMethodsListInputSchema = PaginationInputSchema;
export type PaymentMethodsListInput = z.infer<
	typeof PaymentMethodsListInputSchema
>;
export const PaymentMethodsListOutputSchema = z.object({
	pagination: CoinbasePagination.optional(),
	data: z.array(CoinbasePaymentMethod),
});
export type PaymentMethodsListOutput = z.infer<
	typeof PaymentMethodsListOutputSchema
>;

export const ProductIdInputSchema = z.object({
	product_id: CurrencyPairSchema,
	limit: z.number().int().min(1).max(1000).optional(),
});
export type ProductIdInput = z.infer<typeof ProductIdInputSchema>;

export const MarketListInputSchema = z.object({
	limit: z.number().int().min(1).max(1000).optional(),
	offset: z.number().int().min(0).optional(),
	product_type: z.string().optional(),
	product_ids: z.string().optional(),
});
export type MarketListInput = z.infer<typeof MarketListInputSchema>;

export const CandlesInputSchema = z.object({
	product_id: CurrencyPairSchema,
	start: z.string().optional(),
	end: z.string().optional(),
	granularity: z.string().optional(),
});
export type CandlesInput = z.infer<typeof CandlesInputSchema>;

export const GetExchangeCurrencyInputSchema = z.object({
	currency_id: z.string().min(1),
});
export type GetExchangeCurrencyInput = z.infer<
	typeof GetExchangeCurrencyInputSchema
>;

export const CoinbaseBrokerageProduct = z
	.object({
		product_id: z.string().optional(),
		price: z.string().optional(),
		base_currency_id: z.string().optional(),
		quote_currency_id: z.string().optional(),
		status: z.string().optional(),
		volume_24h: z.string().optional(),
	})
	.loose();
export type CoinbaseBrokerageProduct = z.infer<typeof CoinbaseBrokerageProduct>;

export const ListMarketProductsOutputSchema = z
	.object({
		products: z.array(CoinbaseBrokerageProduct).optional(),
		num_products: z.number().optional(),
	})
	.loose();
export type ListMarketProductsOutput = z.infer<
	typeof ListMarketProductsOutputSchema
>;

export const GetProductOutputSchema = CoinbaseBrokerageProduct;
export type GetProductOutput = z.infer<typeof GetProductOutputSchema>;

export const ProductBookLevelSchema = z
	.object({
		price: z.string().optional(),
		size: z.string().optional(),
	})
	.loose();

export const ProductBookOutputSchema = z
	.object({
		pricebook: z
			.object({
				product_id: z.string().optional(),
				bids: z.array(ProductBookLevelSchema).optional(),
				asks: z.array(ProductBookLevelSchema).optional(),
				time: z.string().optional(),
			})
			.loose()
			.optional(),
	})
	.loose();
export type ProductBookOutput = z.infer<typeof ProductBookOutputSchema>;

export const MarketTradesOutputSchema = z
	.object({
		// unknown: trade objects vary by Coinbase market type (spot, brokerage); no closed schema.
		trades: z.array(z.record(z.string(), z.unknown())).optional(),
		best_bid: z.string().optional(),
		best_ask: z.string().optional(),
	})
	.loose();
export type MarketTradesOutput = z.infer<typeof MarketTradesOutputSchema>;

export const ProductCandlesOutputSchema = z
	.object({
		candles: z
			.array(
				z
					.object({
						start: z.string().optional(),
						low: z.string().optional(),
						high: z.string().optional(),
						open: z.string().optional(),
						close: z.string().optional(),
						volume: z.string().optional(),
					})
					.loose(),
			)
			.optional(),
	})
	.loose();
export type ProductCandlesOutput = z.infer<typeof ProductCandlesOutputSchema>;

export const BrokerageServerTimeOutputSchema = z
	.object({
		iso: z.string().optional(),
		epochSeconds: z.union([z.string(), z.number()]).optional(),
		epochMillis: z.union([z.string(), z.number()]).optional(),
	})
	.loose();
export type BrokerageServerTimeOutput = z.infer<
	typeof BrokerageServerTimeOutputSchema
>;

export const GetExchangeCurrencyOutputSchema = z
	.object({
		data: CoinbaseCurrency,
	})
	.loose();
export type GetExchangeCurrencyOutput = z.infer<
	typeof GetExchangeCurrencyOutputSchema
>;

export type CoinbaseEndpointInputs = {
	pricesGetSpot: PricesGetSpotInput;
	pricesGetBuy: PricesGetBuyInput;
	pricesGetSell: PricesGetSellInput;
	dataGetExchangeRates: DataGetExchangeRatesInput;
	dataListCurrencies: DataListCurrenciesInput;
	dataGetTime: DataGetTimeInput;
	userGet: UserGetInput;
	accountsList: AccountsListInput;
	accountsGet: AccountsGetInput;
	transactionsList: TransactionsListInput;
	transactionsGet: TransactionsGetInput;
	paymentMethodsList: PaymentMethodsListInput;
	listMarketProducts: MarketListInput;
	listExchangeProducts: MarketListInput;
	getProduct: ProductIdInput;
	getMarketProductBook: ProductIdInput;
	getProductBook: ProductIdInput;
	getProductsTicker: ProductIdInput;
	getPublicMarketTrades: ProductIdInput;
	listProductsTrades: ProductIdInput;
	listProductCandles: CandlesInput;
	listProductsCandles: CandlesInput;
	getProductsVolumeSummary: MarketListInput;
	listProductsStats: ProductIdInput;
	getServerTime: DataGetTimeInput;
	getExchangeCurrency: GetExchangeCurrencyInput;
	listWallets: AccountsListInput;
};

export type CoinbaseEndpointOutputs = {
	pricesGetSpot: PricesGetSpotOutput;
	pricesGetBuy: PricesGetBuyOutput;
	pricesGetSell: PricesGetSellOutput;
	dataGetExchangeRates: DataGetExchangeRatesOutput;
	dataListCurrencies: DataListCurrenciesOutput;
	dataGetTime: DataGetTimeOutput;
	userGet: UserGetOutput;
	accountsList: AccountsListOutput;
	accountsGet: AccountsGetOutput;
	transactionsList: TransactionsListOutput;
	transactionsGet: TransactionsGetOutput;
	paymentMethodsList: PaymentMethodsListOutput;
	listMarketProducts: ListMarketProductsOutput;
	listExchangeProducts: ListMarketProductsOutput;
	getProduct: GetProductOutput;
	getMarketProductBook: ProductBookOutput;
	getProductBook: ProductBookOutput;
	getProductsTicker: MarketTradesOutput;
	getPublicMarketTrades: MarketTradesOutput;
	listProductsTrades: MarketTradesOutput;
	listProductCandles: ProductCandlesOutput;
	listProductsCandles: ProductCandlesOutput;
	getProductsVolumeSummary: ListMarketProductsOutput;
	listProductsStats: GetProductOutput;
	getServerTime: BrokerageServerTimeOutput;
	getExchangeCurrency: GetExchangeCurrencyOutput;
	listWallets: AccountsListOutput;
};

export const CoinbaseEndpointInputSchemas = {
	pricesGetSpot: PricesGetSpotInputSchema,
	pricesGetBuy: PricesGetBuyInputSchema,
	pricesGetSell: PricesGetSellInputSchema,
	dataGetExchangeRates: DataGetExchangeRatesInputSchema,
	dataListCurrencies: DataListCurrenciesInputSchema,
	dataGetTime: DataGetTimeInputSchema,
	userGet: UserGetInputSchema,
	accountsList: AccountsListInputSchema,
	accountsGet: AccountsGetInputSchema,
	transactionsList: TransactionsListInputSchema,
	transactionsGet: TransactionsGetInputSchema,
	paymentMethodsList: PaymentMethodsListInputSchema,
	listMarketProducts: MarketListInputSchema,
	listExchangeProducts: MarketListInputSchema,
	getProduct: ProductIdInputSchema,
	getMarketProductBook: ProductIdInputSchema,
	getProductBook: ProductIdInputSchema,
	getProductsTicker: ProductIdInputSchema,
	getPublicMarketTrades: ProductIdInputSchema,
	listProductsTrades: ProductIdInputSchema,
	listProductCandles: CandlesInputSchema,
	listProductsCandles: CandlesInputSchema,
	getProductsVolumeSummary: MarketListInputSchema,
	listProductsStats: ProductIdInputSchema,
	getServerTime: DataGetTimeInputSchema,
	getExchangeCurrency: GetExchangeCurrencyInputSchema,
	listWallets: AccountsListInputSchema,
} as const;

export const CoinbaseEndpointOutputSchemas = {
	pricesGetSpot: PricesGetSpotOutputSchema,
	pricesGetBuy: PricesGetBuyOutputSchema,
	pricesGetSell: PricesGetSellOutputSchema,
	dataGetExchangeRates: DataGetExchangeRatesOutputSchema,
	dataListCurrencies: DataListCurrenciesOutputSchema,
	dataGetTime: DataGetTimeOutputSchema,
	userGet: UserGetOutputSchema,
	accountsList: AccountsListOutputSchema,
	accountsGet: AccountsGetOutputSchema,
	transactionsList: TransactionsListOutputSchema,
	transactionsGet: TransactionsGetOutputSchema,
	paymentMethodsList: PaymentMethodsListOutputSchema,
	listMarketProducts: ListMarketProductsOutputSchema,
	listExchangeProducts: ListMarketProductsOutputSchema,
	getProduct: GetProductOutputSchema,
	getMarketProductBook: ProductBookOutputSchema,
	getProductBook: ProductBookOutputSchema,
	getProductsTicker: MarketTradesOutputSchema,
	getPublicMarketTrades: MarketTradesOutputSchema,
	listProductsTrades: MarketTradesOutputSchema,
	listProductCandles: ProductCandlesOutputSchema,
	listProductsCandles: ProductCandlesOutputSchema,
	getProductsVolumeSummary: ListMarketProductsOutputSchema,
	listProductsStats: GetProductOutputSchema,
	getServerTime: BrokerageServerTimeOutputSchema,
	getExchangeCurrency: GetExchangeCurrencyOutputSchema,
	listWallets: AccountsListOutputSchema,
} as const;
