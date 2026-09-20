import type {
	AuthTypes,
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	Accounts,
	Data,
	Markets,
	PaymentMethods,
	Prices,
	Transactions,
	User,
} from './endpoints';
import type {
	CoinbaseEndpointInputs,
	CoinbaseEndpointOutputs,
} from './endpoints/types';
import {
	CoinbaseEndpointInputSchemas,
	CoinbaseEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { CoinbaseSchema } from './schema';
import { NotificationWebhooks } from './webhooks';
import { resolveCoinbaseOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchCoinbaseTenantWebhook } from './webhooks/tenant-matcher';
import type {
	CoinbaseWebhookOutputs,
	PingEvent,
	WalletAddressesNewPaymentEvent,
} from './webhooks/types';
import {
	coinbaseSignatureHeader,
	PingEventSchema,
	WalletAddressesNewPaymentEventSchema,
} from './webhooks/types';

export type CoinbasePluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalCoinbasePlugin['hooks'];
	webhookHooks?: InternalCoinbasePlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof coinbaseEndpointsNested>;
};

export type CoinbaseContext = CorsairPluginContext<
	typeof CoinbaseSchema,
	CoinbasePluginOptions
>;

export type CoinbaseKeyBuilderContext =
	KeyBuilderContext<CoinbasePluginOptions>;

export type CoinbaseBoundEndpoints = BindEndpoints<
	typeof coinbaseEndpointsNested
>;

type CoinbaseEndpoint<K extends keyof CoinbaseEndpointOutputs> =
	CorsairEndpoint<
		CoinbaseContext,
		CoinbaseEndpointInputs[K],
		CoinbaseEndpointOutputs[K]
	>;

export type CoinbaseEndpoints = {
	pricesGetSpot: CoinbaseEndpoint<'pricesGetSpot'>;
	pricesGetBuy: CoinbaseEndpoint<'pricesGetBuy'>;
	pricesGetSell: CoinbaseEndpoint<'pricesGetSell'>;
	dataGetExchangeRates: CoinbaseEndpoint<'dataGetExchangeRates'>;
	dataListCurrencies: CoinbaseEndpoint<'dataListCurrencies'>;
	dataGetTime: CoinbaseEndpoint<'dataGetTime'>;
	userGet: CoinbaseEndpoint<'userGet'>;
	accountsList: CoinbaseEndpoint<'accountsList'>;
	accountsGet: CoinbaseEndpoint<'accountsGet'>;
	transactionsList: CoinbaseEndpoint<'transactionsList'>;
	transactionsGet: CoinbaseEndpoint<'transactionsGet'>;
	paymentMethodsList: CoinbaseEndpoint<'paymentMethodsList'>;
	listMarketProducts: CoinbaseEndpoint<'listMarketProducts'>;
	listExchangeProducts: CoinbaseEndpoint<'listExchangeProducts'>;
	getProduct: CoinbaseEndpoint<'getProduct'>;
	getMarketProductBook: CoinbaseEndpoint<'getMarketProductBook'>;
	getProductBook: CoinbaseEndpoint<'getProductBook'>;
	getProductsTicker: CoinbaseEndpoint<'getProductsTicker'>;
	getPublicMarketTrades: CoinbaseEndpoint<'getPublicMarketTrades'>;
	listProductsTrades: CoinbaseEndpoint<'listProductsTrades'>;
	listProductCandles: CoinbaseEndpoint<'listProductCandles'>;
	listProductsCandles: CoinbaseEndpoint<'listProductsCandles'>;
	getProductsVolumeSummary: CoinbaseEndpoint<'getProductsVolumeSummary'>;
	listProductsStats: CoinbaseEndpoint<'listProductsStats'>;
	getServerTime: CoinbaseEndpoint<'getServerTime'>;
	getExchangeCurrency: CoinbaseEndpoint<'getExchangeCurrency'>;
	listWallets: CoinbaseEndpoint<'listWallets'>;
};

type CoinbaseWebhook<
	K extends keyof CoinbaseWebhookOutputs,
	TEvent,
> = CorsairWebhook<CoinbaseContext, TEvent, CoinbaseWebhookOutputs[K]>;

export type CoinbaseWebhooks = {
	ping: CoinbaseWebhook<'ping', PingEvent>;
	newPayment: CoinbaseWebhook<'newPayment', WalletAddressesNewPaymentEvent>;
};

export type CoinbaseBoundWebhooks = BindWebhooks<CoinbaseWebhooks>;

const coinbaseEndpointsNested = {
	prices: {
		getSpot: Prices.getSpot,
		getBuy: Prices.getBuy,
		getSell: Prices.getSell,
	},
	data: {
		getExchangeRates: Data.getExchangeRates,
		listCurrencies: Data.listCurrencies,
		getTime: Data.getTime,
	},
	user: {
		get: User.get,
	},
	accounts: {
		list: Accounts.list,
		get: Accounts.get,
	},
	transactions: {
		list: Transactions.list,
		get: Transactions.get,
	},
	paymentMethods: {
		list: PaymentMethods.list,
	},
	markets: {
		listProducts: Markets.listMarketProducts,
		listExchangeProducts: Markets.listExchangeProducts,
		getProduct: Markets.getProduct,
		getMarketProductBook: Markets.getMarketProductBook,
		getProductBook: Markets.getProductBook,
		getTicker: Markets.getProductsTicker,
		getPublicTrades: Markets.getPublicMarketTrades,
		listTrades: Markets.listProductsTrades,
		listProductCandles: Markets.listProductCandles,
		listProductsCandles: Markets.listProductsCandles,
		getVolumeSummary: Markets.getProductsVolumeSummary,
		listStats: Markets.listProductsStats,
		getServerTime: Markets.getServerTime,
		getCurrency: Markets.getExchangeCurrency,
		listWallets: Markets.listWallets,
	},
} as const;

const coinbaseWebhooksNested = {
	notifications: {
		ping: NotificationWebhooks.ping,
		newPayment: NotificationWebhooks.newPayment,
	},
} as const;

export const coinbaseEndpointSchemas = {
	'prices.getSpot': {
		input: CoinbaseEndpointInputSchemas.pricesGetSpot,
		output: CoinbaseEndpointOutputSchemas.pricesGetSpot,
	},
	'prices.getBuy': {
		input: CoinbaseEndpointInputSchemas.pricesGetBuy,
		output: CoinbaseEndpointOutputSchemas.pricesGetBuy,
	},
	'prices.getSell': {
		input: CoinbaseEndpointInputSchemas.pricesGetSell,
		output: CoinbaseEndpointOutputSchemas.pricesGetSell,
	},
	'data.getExchangeRates': {
		input: CoinbaseEndpointInputSchemas.dataGetExchangeRates,
		output: CoinbaseEndpointOutputSchemas.dataGetExchangeRates,
	},
	'data.listCurrencies': {
		input: CoinbaseEndpointInputSchemas.dataListCurrencies,
		output: CoinbaseEndpointOutputSchemas.dataListCurrencies,
	},
	'data.getTime': {
		input: CoinbaseEndpointInputSchemas.dataGetTime,
		output: CoinbaseEndpointOutputSchemas.dataGetTime,
	},
	'user.get': {
		input: CoinbaseEndpointInputSchemas.userGet,
		output: CoinbaseEndpointOutputSchemas.userGet,
	},
	'accounts.list': {
		input: CoinbaseEndpointInputSchemas.accountsList,
		output: CoinbaseEndpointOutputSchemas.accountsList,
	},
	'accounts.get': {
		input: CoinbaseEndpointInputSchemas.accountsGet,
		output: CoinbaseEndpointOutputSchemas.accountsGet,
	},
	'transactions.list': {
		input: CoinbaseEndpointInputSchemas.transactionsList,
		output: CoinbaseEndpointOutputSchemas.transactionsList,
	},
	'transactions.get': {
		input: CoinbaseEndpointInputSchemas.transactionsGet,
		output: CoinbaseEndpointOutputSchemas.transactionsGet,
	},
	'paymentMethods.list': {
		input: CoinbaseEndpointInputSchemas.paymentMethodsList,
		output: CoinbaseEndpointOutputSchemas.paymentMethodsList,
	},
	'markets.listProducts': {
		input: CoinbaseEndpointInputSchemas.listMarketProducts,
		output: CoinbaseEndpointOutputSchemas.listMarketProducts,
	},
	'markets.listExchangeProducts': {
		input: CoinbaseEndpointInputSchemas.listExchangeProducts,
		output: CoinbaseEndpointOutputSchemas.listExchangeProducts,
	},
	'markets.getProduct': {
		input: CoinbaseEndpointInputSchemas.getProduct,
		output: CoinbaseEndpointOutputSchemas.getProduct,
	},
	'markets.getMarketProductBook': {
		input: CoinbaseEndpointInputSchemas.getMarketProductBook,
		output: CoinbaseEndpointOutputSchemas.getMarketProductBook,
	},
	'markets.getProductBook': {
		input: CoinbaseEndpointInputSchemas.getProductBook,
		output: CoinbaseEndpointOutputSchemas.getProductBook,
	},
	'markets.getTicker': {
		input: CoinbaseEndpointInputSchemas.getProductsTicker,
		output: CoinbaseEndpointOutputSchemas.getProductsTicker,
	},
	'markets.getPublicTrades': {
		input: CoinbaseEndpointInputSchemas.getPublicMarketTrades,
		output: CoinbaseEndpointOutputSchemas.getPublicMarketTrades,
	},
	'markets.listTrades': {
		input: CoinbaseEndpointInputSchemas.listProductsTrades,
		output: CoinbaseEndpointOutputSchemas.listProductsTrades,
	},
	'markets.listProductCandles': {
		input: CoinbaseEndpointInputSchemas.listProductCandles,
		output: CoinbaseEndpointOutputSchemas.listProductCandles,
	},
	'markets.listProductsCandles': {
		input: CoinbaseEndpointInputSchemas.listProductsCandles,
		output: CoinbaseEndpointOutputSchemas.listProductsCandles,
	},
	'markets.getVolumeSummary': {
		input: CoinbaseEndpointInputSchemas.getProductsVolumeSummary,
		output: CoinbaseEndpointOutputSchemas.getProductsVolumeSummary,
	},
	'markets.listStats': {
		input: CoinbaseEndpointInputSchemas.listProductsStats,
		output: CoinbaseEndpointOutputSchemas.listProductsStats,
	},
	'markets.getServerTime': {
		input: CoinbaseEndpointInputSchemas.getServerTime,
		output: CoinbaseEndpointOutputSchemas.getServerTime,
	},
	'markets.getCurrency': {
		input: CoinbaseEndpointInputSchemas.getExchangeCurrency,
		output: CoinbaseEndpointOutputSchemas.getExchangeCurrency,
	},
	'markets.listWallets': {
		input: CoinbaseEndpointInputSchemas.listWallets,
		output: CoinbaseEndpointOutputSchemas.listWallets,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof coinbaseEndpointsNested
>;

const coinbaseWebhookSchemas = {
	'notifications.ping': {
		description: 'Coinbase webhook ping used to verify a notification URL',
		payload: PingEventSchema,
		response: PingEventSchema,
	},
	'notifications.newPayment': {
		description: 'A new on-chain payment arrived at a watched address',
		payload: WalletAddressesNewPaymentEventSchema,
		response: WalletAddressesNewPaymentEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof coinbaseWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const coinbaseEndpointMeta = {
	'prices.getSpot': {
		riskLevel: 'read',
		description: 'Get the current or historic spot price for a currency pair',
	},
	'prices.getBuy': {
		riskLevel: 'read',
		description: 'Get the Coinbase buy price for a currency pair',
	},
	'prices.getSell': {
		riskLevel: 'read',
		description: 'Get the Coinbase sell price for a currency pair',
	},
	'data.getExchangeRates': {
		riskLevel: 'read',
		description: 'Get exchange rates for a base currency',
	},
	'data.listCurrencies': {
		riskLevel: 'read',
		description: 'List currencies supported by Coinbase',
	},
	'data.getTime': {
		riskLevel: 'read',
		description: 'Get Coinbase API server time',
	},
	'user.get': {
		riskLevel: 'read',
		description: 'Get the authenticated Coinbase user profile',
	},
	'accounts.list': {
		riskLevel: 'read',
		description: 'List Coinbase accounts and balances',
	},
	'accounts.get': {
		riskLevel: 'read',
		description: 'Get a Coinbase account by id or currency code',
	},
	'transactions.list': {
		riskLevel: 'read',
		description: 'List transactions for a Coinbase account',
	},
	'transactions.get': {
		riskLevel: 'read',
		description: 'Get a transaction on a Coinbase account',
	},
	'paymentMethods.list': {
		riskLevel: 'read',
		description: 'List payment methods on the authenticated Coinbase account',
	},
	'markets.listProducts': {
		riskLevel: 'read',
		description: 'List Advanced Trade market products',
	},
	'markets.listExchangeProducts': {
		riskLevel: 'read',
		description: 'List Advanced Trade trading products',
	},
	'markets.getProduct': {
		riskLevel: 'read',
		description: 'Get an Advanced Trade product by id',
	},
	'markets.getMarketProductBook': {
		riskLevel: 'read',
		description: 'Get the Advanced Trade public product book',
	},
	'markets.getProductBook': {
		riskLevel: 'read',
		description: 'Get the Advanced Trade product order book',
	},
	'markets.getTicker': {
		riskLevel: 'read',
		description: 'Get the Advanced Trade public product ticker and trades',
	},
	'markets.getPublicTrades': {
		riskLevel: 'read',
		description: 'Get public Advanced Trade market trades',
	},
	'markets.listTrades': {
		riskLevel: 'read',
		description: 'List recent Advanced Trade market trades',
	},
	'markets.listProductCandles': {
		riskLevel: 'read',
		description: 'List Advanced Trade product candles',
	},
	'markets.listProductsCandles': {
		riskLevel: 'read',
		description: 'List Advanced Trade candlestick history',
	},
	'markets.getVolumeSummary': {
		riskLevel: 'read',
		description: 'List Advanced Trade products including 24h volume',
	},
	'markets.listStats': {
		riskLevel: 'read',
		description: 'Get Advanced Trade product details and 24h stats',
	},
	'markets.getServerTime': {
		riskLevel: 'read',
		description: 'Get Coinbase Advanced Trade server time',
	},
	'markets.getCurrency': {
		riskLevel: 'read',
		description: 'Get a Coinbase App currency by id',
	},
	'markets.listWallets': {
		riskLevel: 'read',
		description: 'List Coinbase App wallets (accounts)',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof coinbaseEndpointsNested>;

export const coinbaseAuthConfig = {
	api_key: {
		account: ['account', 'user_id'] as const,
	},
	oauth_2: {
		account: ['user_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseCoinbasePlugin<T extends CoinbasePluginOptions> = CorsairPlugin<
	'coinbase',
	typeof CoinbaseSchema,
	typeof coinbaseEndpointsNested,
	typeof coinbaseWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalCoinbasePlugin = BaseCoinbasePlugin<CoinbasePluginOptions>;

export type ExternalCoinbasePlugin<T extends CoinbasePluginOptions> =
	BaseCoinbasePlugin<T>;

export function coinbase<const T extends CoinbasePluginOptions>(
	incomingOptions: CoinbasePluginOptions & T = {} as CoinbasePluginOptions & T,
): ExternalCoinbasePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'coinbase',
		authConfig: coinbaseAuthConfig,
		schema: CoinbaseSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: coinbaseEndpointsNested,
		webhooks: coinbaseWebhooksNested,
		endpointMeta: coinbaseEndpointMeta,
		endpointSchemas: coinbaseEndpointSchemas,
		webhookSchemas: coinbaseWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			return Boolean(coinbaseSignatureHeader(request.headers));
		},
		pluginTenantWebhookMatcher: matchCoinbaseTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveCoinbaseOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: CoinbaseKeyBuilderContext, source) => {
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature();
				return res ?? '';
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			if (source === 'endpoint' && ctx.authType === 'oauth_2') {
				const res = await ctx.keys.get_access_token();
				if (!res) {
					throw new AuthMissingError('coinbase', 'oauth_2');
				}
				return res;
			}

			return '';
		},
	} satisfies InternalCoinbasePlugin;
}

export {
	COINBASE_API_BASE,
	COINBASE_API_VERSION,
	CoinbaseAPIError,
	CoinbaseRateLimitError,
	makeCoinbaseRequest,
} from './client';
export type {
	AccountsGetInput,
	AccountsGetOutput,
	AccountsListInput,
	AccountsListOutput,
	CoinbaseEndpointInputs,
	CoinbaseEndpointOutputs,
	DataGetExchangeRatesInput,
	DataGetExchangeRatesOutput,
	DataGetTimeInput,
	DataGetTimeOutput,
	DataListCurrenciesInput,
	DataListCurrenciesOutput,
	PaymentMethodsListInput,
	PaymentMethodsListOutput,
	PricesGetBuyInput,
	PricesGetBuyOutput,
	PricesGetSellInput,
	PricesGetSellOutput,
	PricesGetSpotInput,
	PricesGetSpotOutput,
	TransactionsGetInput,
	TransactionsGetOutput,
	TransactionsListInput,
	TransactionsListOutput,
	UserGetInput,
	UserGetOutput,
} from './endpoints/types';
export type {
	CoinbaseWebhookOutputs,
	PingEvent,
	WalletAddressesNewPaymentEvent,
} from './webhooks/types';
