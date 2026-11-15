import type {
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import type { PolygonEnvironment } from './client';
import {
	CashLocations,
	Customers,
	Networks,
	Quotes,
	Transactions,
	Wallets,
	Webhooks,
} from './endpoints';
import type {
	PolygonEndpointInputs,
	PolygonEndpointOutputs,
} from './endpoints/types';
import {
	PolygonEndpointInputSchemas,
	PolygonEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { PolygonSchema } from './schema';

/**
 * OMS authenticates with a key and secret pair and mints a bearer token from
 * them. Both live on the account, because the account key manager only creates
 * accessors for account-level fields, so they are declared here beside api_key.
 */
export const polygonAuthConfig = {
	api_key: {
		account: ['api_secret'] as const,
	},
} as const satisfies PluginAuthConfig;

export type PolygonPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/**
	 * The `sk_live_`/`sk_sdbx_` key. Overrides the stored `api_key`, and is what
	 * the binder resolves into `ctx.key`.
	 */
	apiKey?: string;
	/** The secret shown once at key creation. Overrides the stored `api_secret`. */
	apiSecret?: string;
	/**
	 * Which OMS host to call. Without it the key decides: `sk_sdbx_` keys go to
	 * the sandbox, which simulates every transfer, and other keys go to live.
	 */
	environment?: PolygonEnvironment;
	hooks?: InternalPolygonPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof polygonEndpointsNested>;
};

export type PolygonContext = CorsairPluginContext<
	typeof PolygonSchema,
	PolygonPluginOptions,
	undefined,
	typeof polygonAuthConfig
>;

export type PolygonKeyBuilderContext = KeyBuilderContext<
	PolygonPluginOptions,
	typeof polygonAuthConfig
>;

export type PolygonBoundEndpoints = BindEndpoints<
	typeof polygonEndpointsNested
>;

type PolygonEndpoint<K extends keyof PolygonEndpointOutputs> = CorsairEndpoint<
	PolygonContext,
	PolygonEndpointInputs[K],
	PolygonEndpointOutputs[K]
>;

export type PolygonEndpoints = {
	customersList: PolygonEndpoint<'customersList'>;
	customersGet: PolygonEndpoint<'customersGet'>;
	customersCreate: PolygonEndpoint<'customersCreate'>;
	customersUpdate: PolygonEndpoint<'customersUpdate'>;
	customersDelete: PolygonEndpoint<'customersDelete'>;
	walletsList: PolygonEndpoint<'walletsList'>;
	walletsGet: PolygonEndpoint<'walletsGet'>;
	walletsCreate: PolygonEndpoint<'walletsCreate'>;
	walletsBalance: PolygonEndpoint<'walletsBalance'>;
	networksList: PolygonEndpoint<'networksList'>;
	quotesCreate: PolygonEndpoint<'quotesCreate'>;
	quotesGet: PolygonEndpoint<'quotesGet'>;
	transactionsList: PolygonEndpoint<'transactionsList'>;
	transactionsGet: PolygonEndpoint<'transactionsGet'>;
	transactionsCreate: PolygonEndpoint<'transactionsCreate'>;
	webhooksList: PolygonEndpoint<'webhooksList'>;
	webhooksGet: PolygonEndpoint<'webhooksGet'>;
	webhooksCreate: PolygonEndpoint<'webhooksCreate'>;
	webhooksUpdate: PolygonEndpoint<'webhooksUpdate'>;
	webhooksDelete: PolygonEndpoint<'webhooksDelete'>;
	cashLocationsList: PolygonEndpoint<'cashLocationsList'>;
};

const polygonEndpointsNested = {
	customers: {
		list: Customers.list,
		get: Customers.get,
		create: Customers.create,
		update: Customers.update,
		delete: Customers.remove,
	},
	wallets: {
		list: Wallets.list,
		get: Wallets.get,
		create: Wallets.create,
		balance: Wallets.balance,
	},
	networks: {
		list: Networks.list,
	},
	quotes: {
		create: Quotes.create,
		get: Quotes.get,
	},
	transactions: {
		list: Transactions.list,
		get: Transactions.get,
		create: Transactions.create,
	},
	webhooks: {
		list: Webhooks.list,
		get: Webhooks.get,
		create: Webhooks.create,
		update: Webhooks.update,
		delete: Webhooks.remove,
	},
	cashLocations: {
		list: CashLocations.list,
	},
} as const;

export const polygonEndpointSchemas = {
	'customers.list': {
		input: PolygonEndpointInputSchemas.customersList,
		output: PolygonEndpointOutputSchemas.customersList,
	},
	'customers.get': {
		input: PolygonEndpointInputSchemas.customersGet,
		output: PolygonEndpointOutputSchemas.customersGet,
	},
	'customers.create': {
		input: PolygonEndpointInputSchemas.customersCreate,
		output: PolygonEndpointOutputSchemas.customersCreate,
	},
	'customers.update': {
		input: PolygonEndpointInputSchemas.customersUpdate,
		output: PolygonEndpointOutputSchemas.customersUpdate,
	},
	'customers.delete': {
		input: PolygonEndpointInputSchemas.customersDelete,
		output: PolygonEndpointOutputSchemas.customersDelete,
	},
	'wallets.list': {
		input: PolygonEndpointInputSchemas.walletsList,
		output: PolygonEndpointOutputSchemas.walletsList,
	},
	'wallets.get': {
		input: PolygonEndpointInputSchemas.walletsGet,
		output: PolygonEndpointOutputSchemas.walletsGet,
	},
	'wallets.create': {
		input: PolygonEndpointInputSchemas.walletsCreate,
		output: PolygonEndpointOutputSchemas.walletsCreate,
	},
	'wallets.balance': {
		input: PolygonEndpointInputSchemas.walletsBalance,
		output: PolygonEndpointOutputSchemas.walletsBalance,
	},
	'networks.list': {
		input: PolygonEndpointInputSchemas.networksList,
		output: PolygonEndpointOutputSchemas.networksList,
	},
	'quotes.create': {
		input: PolygonEndpointInputSchemas.quotesCreate,
		output: PolygonEndpointOutputSchemas.quotesCreate,
	},
	'quotes.get': {
		input: PolygonEndpointInputSchemas.quotesGet,
		output: PolygonEndpointOutputSchemas.quotesGet,
	},
	'transactions.list': {
		input: PolygonEndpointInputSchemas.transactionsList,
		output: PolygonEndpointOutputSchemas.transactionsList,
	},
	'transactions.get': {
		input: PolygonEndpointInputSchemas.transactionsGet,
		output: PolygonEndpointOutputSchemas.transactionsGet,
	},
	'transactions.create': {
		input: PolygonEndpointInputSchemas.transactionsCreate,
		output: PolygonEndpointOutputSchemas.transactionsCreate,
	},
	'webhooks.list': {
		input: PolygonEndpointInputSchemas.webhooksList,
		output: PolygonEndpointOutputSchemas.webhooksList,
	},
	'webhooks.get': {
		input: PolygonEndpointInputSchemas.webhooksGet,
		output: PolygonEndpointOutputSchemas.webhooksGet,
	},
	'webhooks.create': {
		input: PolygonEndpointInputSchemas.webhooksCreate,
		output: PolygonEndpointOutputSchemas.webhooksCreate,
	},
	'webhooks.update': {
		input: PolygonEndpointInputSchemas.webhooksUpdate,
		output: PolygonEndpointOutputSchemas.webhooksUpdate,
	},
	'webhooks.delete': {
		input: PolygonEndpointInputSchemas.webhooksDelete,
		output: PolygonEndpointOutputSchemas.webhooksDelete,
	},
	'cashLocations.list': {
		input: PolygonEndpointInputSchemas.cashLocationsList,
		output: PolygonEndpointOutputSchemas.cashLocationsList,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof polygonEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const polygonEndpointMeta = {
	'customers.list': {
		riskLevel: 'read',
		description:
			'List customers, filtered by status, email, external id or creation window, with cursor paging',
	},
	'customers.get': {
		riskLevel: 'read',
		description: 'Read one customer with its onboarding status',
	},
	'customers.create': {
		riskLevel: 'write',
		description:
			'Create a customer. Individuals need a first and last name; businesses need a legal name and email. Identity verification follows the project policy',
	},
	'customers.update': {
		riskLevel: 'write',
		description:
			"Update a customer's details, or request additional endorsements. Personal data fields are write-only",
	},
	'customers.delete': {
		riskLevel: 'destructive',
		description:
			'Delete a customer. OMS returns the record in its offboarded state',
	},
	'wallets.list': {
		riskLevel: 'read',
		description:
			'List wallets, scoped to a customer or type, with balance ordering and cursor paging',
	},
	'wallets.get': {
		riskLevel: 'read',
		description: 'Read one wallet by id',
	},
	'wallets.create': {
		riskLevel: 'destructive',
		description:
			'Create a custodial, noncustodial or fiat wallet for a customer. OMS has no route to delete a wallet, so a live wallet stays on the customer',
	},
	'wallets.balance': {
		riskLevel: 'read',
		description:
			'Read one wallet balance in its asset, with an estimated value. The balance can be negative after a clawback',
	},
	'networks.list': {
		riskLevel: 'read',
		description:
			'List the networks, rails and assets this project can route, with cursor paging',
	},
	'quotes.create': {
		riskLevel: 'write',
		description:
			'Price a transfer: set the amount on one side and OMS calculates the other. Nothing moves until a transaction accepts the quote',
	},
	'quotes.get': {
		riskLevel: 'read',
		description: 'Read one quote with its status and pricing',
	},
	'transactions.list': {
		riskLevel: 'read',
		description:
			'List transactions filtered by status, customer, wallet, precursor or creation window, with cursor paging',
	},
	'transactions.get': {
		riskLevel: 'read',
		description: 'Read one transaction with its status, pricing and transfers',
	},
	'transactions.create': {
		riskLevel: 'destructive',
		description:
			'Accept a quote and move the money. This is the irreversible step: pricing is locked at the quote and the transfer starts as soon as OMS accepts it',
	},
	'webhooks.list': {
		riskLevel: 'read',
		description:
			'List webhook endpoints with their delivery counts and cursor paging',
	},
	'webhooks.get': {
		riskLevel: 'read',
		description: 'Read one webhook endpoint',
	},
	'webhooks.create': {
		riskLevel: 'write',
		description:
			'Register a webhook endpoint. The HMAC signing key is returned only here, so store it when the call returns',
	},
	'webhooks.update': {
		riskLevel: 'write',
		description: "Change a webhook's URL, subscriptions or delivery settings",
	},
	'webhooks.delete': {
		riskLevel: 'destructive',
		description:
			'Delete a webhook endpoint. Deliveries stop immediately and the signing key is discarded',
	},
	'cashLocations.list': {
		riskLevel: 'read',
		description:
			'List the retail cash locations in range, nearest first, with cursor paging',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof polygonEndpointsNested>;

export type BasePolygonPlugin<T extends PolygonPluginOptions> = CorsairPlugin<
	'polygon',
	typeof PolygonSchema,
	typeof polygonEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType,
	typeof polygonAuthConfig
>;

export type InternalPolygonPlugin = BasePolygonPlugin<PolygonPluginOptions>;

export type ExternalPolygonPlugin<T extends PolygonPluginOptions> =
	BasePolygonPlugin<T>;

export function polygon<const T extends PolygonPluginOptions>(
	incomingOptions: PolygonPluginOptions & T = {} as PolygonPluginOptions & T,
): ExternalPolygonPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'polygon',
		authConfig: polygonAuthConfig,
		schema: PolygonSchema,
		options,
		hooks: options.hooks,
		endpoints: polygonEndpointsNested,
		webhooks: {},
		endpointMeta: polygonEndpointMeta,
		endpointSchemas: polygonEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: PolygonKeyBuilderContext, source) => {
			if (source === 'endpoint') {
				// OMS has one key plus a secret; the key is what the binder resolves
				// and the secret is read beside it at call time.
				if (options.apiKey) return options.apiKey;
				if (ctx.authType === 'api_key') {
					const stored = await ctx.keys.get_api_key();
					if (stored) return stored;
				}
			}

			throw new AuthMissingError('polygon', ctx.authType ?? 'api_key');
		},
	} satisfies InternalPolygonPlugin;
}

export type { PolygonEnvironment } from './client';
export { POLYGON_HOSTS, PolygonAPIError } from './client';
export type {
	CashLocationsListInput,
	CashLocationsListOutput,
	CustomersCreateInput,
	CustomersDeleteInput,
	CustomersGetInput,
	CustomersListInput,
	CustomersListOutput,
	CustomersUpdateInput,
	NetworksListInput,
	NetworksListOutput,
	PolygonCashLocation,
	PolygonCustomer,
	PolygonEndpointInputs,
	PolygonEndpointOutputs,
	PolygonPricing,
	PolygonQuote,
	PolygonSupportedNetwork,
	PolygonTransaction,
	PolygonWallet,
	PolygonWalletBalance,
	PolygonWebhook,
	QuotesCreateInput,
	QuotesGetInput,
	TransactionsCreateInput,
	TransactionsGetInput,
	TransactionsListInput,
	TransactionsListOutput,
	WalletsBalanceInput,
	WalletsBalanceOutput,
	WalletsCreateInput,
	WalletsCreateOutput,
	WalletsGetInput,
	WalletsListInput,
	WalletsListOutput,
	WebhooksCreateInput,
	WebhooksCreateOutput,
	WebhooksDeleteInput,
	WebhooksGetInput,
	WebhooksListInput,
	WebhooksListOutput,
	WebhooksUpdateInput,
} from './endpoints/types';
