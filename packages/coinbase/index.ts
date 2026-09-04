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
} as const satisfies RequiredPluginEndpointMeta<typeof coinbaseEndpointsNested>;

export const coinbaseAuthConfig = {
	api_key: {
		account: ['one'] as const,
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
