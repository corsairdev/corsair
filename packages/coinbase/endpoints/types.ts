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
} as const;
