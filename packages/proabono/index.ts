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
import { Billing, Customers, Offers, Subscriptions } from './endpoints';
import type {
	ProabonoEndpointInputs,
	ProabonoEndpointOutputs,
} from './endpoints/types';
import {
	ProabonoEndpointInputSchemas,
	ProabonoEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { ProabonoSchema } from './schema';

/**
 * ProAbono authenticates with HTTP Basic: the agent key is the username and the
 * API key is the password. The account key manager only creates accessors for
 * account-level fields, so the agent key is declared here beside `api_key`.
 * `account` is the number in the account's API endpoint (`42` for
 * `api-42.proabono.com`): each business has its own host, so it is stored with
 * the keys rather than set once in code.
 */
export const proabonoAuthConfig = {
	api_key: {
		account: ['agent_key', 'account'] as const,
	},
} as const satisfies PluginAuthConfig;

export type ProabonoPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** The API key, sent as the Basic password. Overrides the stored `api_key`. */
	apiKey?: string;
	/**
	 * The account number from your API endpoint, such as `42` for
	 * `api-42.proabono.com`. Overrides the stored `account` field. Every call
	 * needs one or the other, since it forms the host.
	 */
	account?: string;
	hooks?: InternalProabonoPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof proabonoEndpointsNested>;
};

export type ProabonoContext = CorsairPluginContext<
	typeof ProabonoSchema,
	ProabonoPluginOptions,
	undefined,
	typeof proabonoAuthConfig
>;

export type ProabonoKeyBuilderContext = KeyBuilderContext<
	ProabonoPluginOptions,
	typeof proabonoAuthConfig
>;

export type ProabonoBoundEndpoints = BindEndpoints<
	typeof proabonoEndpointsNested
>;

type ProabonoEndpoint<K extends keyof ProabonoEndpointOutputs> =
	CorsairEndpoint<
		ProabonoContext,
		ProabonoEndpointInputs[K],
		ProabonoEndpointOutputs[K]
	>;

export type ProabonoEndpoints = {
	customersCreate: ProabonoEndpoint<'customersCreate'>;
	customersGet: ProabonoEndpoint<'customersGet'>;
	customersList: ProabonoEndpoint<'customersList'>;
	customersUpdate: ProabonoEndpoint<'customersUpdate'>;
	customersAnonymize: ProabonoEndpoint<'customersAnonymize'>;
	customersInvalidate: ProabonoEndpoint<'customersInvalidate'>;
	customersSuspend: ProabonoEndpoint<'customersSuspend'>;
	offersList: ProabonoEndpoint<'offersList'>;
	offersGet: ProabonoEndpoint<'offersGet'>;
	featuresList: ProabonoEndpoint<'featuresList'>;
	featuresGet: ProabonoEndpoint<'featuresGet'>;
	subscriptionsCreate: ProabonoEndpoint<'subscriptionsCreate'>;
	subscriptionsGet: ProabonoEndpoint<'subscriptionsGet'>;
	subscriptionsList: ProabonoEndpoint<'subscriptionsList'>;
	subscriptionsStart: ProabonoEndpoint<'subscriptionsStart'>;
	subscriptionsSuspend: ProabonoEndpoint<'subscriptionsSuspend'>;
	subscriptionsTerminate: ProabonoEndpoint<'subscriptionsTerminate'>;
	subscriptionsUpgrade: ProabonoEndpoint<'subscriptionsUpgrade'>;
	subscriptionsUpdateTerm: ProabonoEndpoint<'subscriptionsUpdateTerm'>;
	usagesList: ProabonoEndpoint<'usagesList'>;
	usagesGet: ProabonoEndpoint<'usagesGet'>;
	usagesIncrement: ProabonoEndpoint<'usagesIncrement'>;
	usagesUpdate: ProabonoEndpoint<'usagesUpdate'>;
	balanceLinesCreate: ProabonoEndpoint<'balanceLinesCreate'>;
	balanceLinesList: ProabonoEndpoint<'balanceLinesList'>;
	invoicesList: ProabonoEndpoint<'invoicesList'>;
	invoicesGet: ProabonoEndpoint<'invoicesGet'>;
};

const proabonoEndpointsNested = {
	customers: {
		create: Customers.create,
		get: Customers.get,
		list: Customers.list,
		update: Customers.update,
		anonymize: Customers.anonymize,
		invalidate: Customers.invalidate,
		suspend: Customers.suspend,
	},
	offers: {
		list: Offers.list,
		get: Offers.get,
	},
	features: {
		list: Offers.features,
		get: Offers.feature,
	},
	subscriptions: {
		create: Subscriptions.create,
		get: Subscriptions.get,
		list: Subscriptions.list,
		start: Subscriptions.start,
		suspend: Subscriptions.suspend,
		terminate: Subscriptions.terminate,
		upgrade: Subscriptions.upgrade,
		updateTerm: Subscriptions.updateTerm,
	},
	usages: {
		list: Billing.listUsages,
		get: Billing.getUsage,
		increment: Billing.incrementUsage,
		update: Billing.updateUsages,
	},
	balanceLines: {
		create: Billing.createBalanceLine,
		list: Billing.listBalanceLines,
	},
	invoices: {
		list: Billing.listInvoices,
		get: Billing.getInvoice,
	},
} as const;

export const proabonoEndpointSchemas = {
	'customers.create': {
		input: ProabonoEndpointInputSchemas.customersCreate,
		output: ProabonoEndpointOutputSchemas.customersCreate,
	},
	'customers.get': {
		input: ProabonoEndpointInputSchemas.customersGet,
		output: ProabonoEndpointOutputSchemas.customersGet,
	},
	'customers.list': {
		input: ProabonoEndpointInputSchemas.customersList,
		output: ProabonoEndpointOutputSchemas.customersList,
	},
	'customers.update': {
		input: ProabonoEndpointInputSchemas.customersUpdate,
		output: ProabonoEndpointOutputSchemas.customersUpdate,
	},
	'customers.anonymize': {
		input: ProabonoEndpointInputSchemas.customersAnonymize,
		output: ProabonoEndpointOutputSchemas.customersAnonymize,
	},
	'customers.invalidate': {
		input: ProabonoEndpointInputSchemas.customersInvalidate,
		output: ProabonoEndpointOutputSchemas.customersInvalidate,
	},
	'customers.suspend': {
		input: ProabonoEndpointInputSchemas.customersSuspend,
		output: ProabonoEndpointOutputSchemas.customersSuspend,
	},
	'offers.list': {
		input: ProabonoEndpointInputSchemas.offersList,
		output: ProabonoEndpointOutputSchemas.offersList,
	},
	'offers.get': {
		input: ProabonoEndpointInputSchemas.offersGet,
		output: ProabonoEndpointOutputSchemas.offersGet,
	},
	'features.list': {
		input: ProabonoEndpointInputSchemas.featuresList,
		output: ProabonoEndpointOutputSchemas.featuresList,
	},
	'features.get': {
		input: ProabonoEndpointInputSchemas.featuresGet,
		output: ProabonoEndpointOutputSchemas.featuresGet,
	},
	'subscriptions.create': {
		input: ProabonoEndpointInputSchemas.subscriptionsCreate,
		output: ProabonoEndpointOutputSchemas.subscriptionsCreate,
	},
	'subscriptions.get': {
		input: ProabonoEndpointInputSchemas.subscriptionsGet,
		output: ProabonoEndpointOutputSchemas.subscriptionsGet,
	},
	'subscriptions.list': {
		input: ProabonoEndpointInputSchemas.subscriptionsList,
		output: ProabonoEndpointOutputSchemas.subscriptionsList,
	},
	'subscriptions.start': {
		input: ProabonoEndpointInputSchemas.subscriptionsStart,
		output: ProabonoEndpointOutputSchemas.subscriptionsStart,
	},
	'subscriptions.suspend': {
		input: ProabonoEndpointInputSchemas.subscriptionsSuspend,
		output: ProabonoEndpointOutputSchemas.subscriptionsSuspend,
	},
	'subscriptions.terminate': {
		input: ProabonoEndpointInputSchemas.subscriptionsTerminate,
		output: ProabonoEndpointOutputSchemas.subscriptionsTerminate,
	},
	'subscriptions.upgrade': {
		input: ProabonoEndpointInputSchemas.subscriptionsUpgrade,
		output: ProabonoEndpointOutputSchemas.subscriptionsUpgrade,
	},
	'subscriptions.updateTerm': {
		input: ProabonoEndpointInputSchemas.subscriptionsUpdateTerm,
		output: ProabonoEndpointOutputSchemas.subscriptionsUpdateTerm,
	},
	'usages.list': {
		input: ProabonoEndpointInputSchemas.usagesList,
		output: ProabonoEndpointOutputSchemas.usagesList,
	},
	'usages.get': {
		input: ProabonoEndpointInputSchemas.usagesGet,
		output: ProabonoEndpointOutputSchemas.usagesGet,
	},
	'usages.increment': {
		input: ProabonoEndpointInputSchemas.usagesIncrement,
		output: ProabonoEndpointOutputSchemas.usagesIncrement,
	},
	'usages.update': {
		input: ProabonoEndpointInputSchemas.usagesUpdate,
		output: ProabonoEndpointOutputSchemas.usagesUpdate,
	},
	'balanceLines.create': {
		input: ProabonoEndpointInputSchemas.balanceLinesCreate,
		output: ProabonoEndpointOutputSchemas.balanceLinesCreate,
	},
	'balanceLines.list': {
		input: ProabonoEndpointInputSchemas.balanceLinesList,
		output: ProabonoEndpointOutputSchemas.balanceLinesList,
	},
	'invoices.list': {
		input: ProabonoEndpointInputSchemas.invoicesList,
		output: ProabonoEndpointOutputSchemas.invoicesList,
	},
	'invoices.get': {
		input: ProabonoEndpointInputSchemas.invoicesGet,
		output: ProabonoEndpointOutputSchemas.invoicesGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof proabonoEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const proabonoEndpointMeta = {
	'customers.create': {
		riskLevel: 'write',
		description:
			'Create a customer with your own reference, which subscriptions and usages then identify it by',
	},
	'customers.get': {
		riskLevel: 'read',
		description:
			'Read one customer by your reference, with whether it is billable',
	},
	'customers.list': {
		riskLevel: 'read',
		description: 'List the customers in a segment, one page at a time',
	},
	'customers.update': {
		riskLevel: 'write',
		description:
			"Change a customer's name, email, language, affiliation or metadata. ProAbono creates and updates on the same route, so an unknown reference creates a customer",
	},
	'customers.anonymize': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Erase a customer's personal data. This cannot be undone, and ProAbono keeps the billing record only as it must",
	},
	'customers.invalidate': {
		riskLevel: 'destructive',
		description:
			'Invalidate a customer: ProAbono replaces their reference so it can be reused and revokes their portal links. Subscriptions, invoices and payment methods stay',
	},
	'customers.suspend': {
		riskLevel: 'write',
		description:
			'Suspend a customer without deleting anything, so they can be reactivated',
	},
	'offers.list': {
		riskLevel: 'read',
		description:
			'List the offers in a segment, optionally in a customer language and with their upgrade links',
	},
	'offers.get': {
		riskLevel: 'read',
		description: 'Read one offer by its reference',
	},
	'features.list': {
		riskLevel: 'read',
		description: 'List the features your offers carry',
	},
	'features.get': {
		riskLevel: 'read',
		description: 'Read one feature by its reference',
	},
	'subscriptions.create': {
		riskLevel: 'destructive',
		description:
			'Subscribe a customer to an offer, which starts billing when the offer is paid and the customer is billable. `TryStart: false` creates it without starting so it can be customised first',
	},
	'subscriptions.get': {
		riskLevel: 'read',
		description:
			'Read one subscription with its state, period, next billing date and features. The docs warn against using this to check whether a user is a subscriber',
	},
	'subscriptions.list': {
		riskLevel: 'read',
		description:
			'List subscriptions filtered by customer, offer or segment, one page at a time',
	},
	'subscriptions.start': {
		// Starting a subscription begins billing, and R8 classifies an operation
		// that spends money as destructive.
		riskLevel: 'destructive',
		description:
			'Start a subscription that was created without starting, which begins billing',
	},
	'subscriptions.suspend': {
		riskLevel: 'write',
		description: 'Suspend a subscription without terminating it',
	},
	'subscriptions.terminate': {
		riskLevel: 'destructive',
		description:
			'Terminate a subscription, ending it for good; by default at the end of the current period. A later start cannot revive it',
	},
	'subscriptions.upgrade': {
		riskLevel: 'destructive',
		description:
			'Move a subscription to another offer, which changes what it bills from the next period',
	},
	'subscriptions.updateTerm': {
		riskLevel: 'write',
		description: "Change a subscription's end date",
	},
	'usages.list': {
		riskLevel: 'read',
		description:
			'List feature usages by customer, feature or subscription, one page at a time',
	},
	'usages.get': {
		riskLevel: 'read',
		description:
			"Read one customer's usage of one feature: on/off, or the included and current quantities",
	},
	'usages.increment': {
		// Consumption and over-quota usage is billed, so recording it spends the
		// customer's money (R8).
		riskLevel: 'destructive',
		description:
			'Add to a feature’s usage for a customer, which ProAbono bills when it exceeds the included quantity. A negative increment subtracts, which is how a reversed action is recorded',
	},
	'usages.update': {
		// Same as usages.increment: the rows change what the customer is billed.
		riskLevel: 'destructive',
		description:
			'Update up to 50 usages in one call, each by increment, current quantity or on/off',
	},
	'balanceLines.create': {
		// A balance line is a charge (or credit) on the customer's next invoice.
		riskLevel: 'destructive',
		description:
			"Add a balance line, such as a one-off charge or credit in cents, to a customer's next invoice",
	},
	'balanceLines.list': {
		riskLevel: 'read',
		description:
			'List balance lines by customer, segment, feature or subscription, with their totals',
	},
	'invoices.list': {
		riskLevel: 'read',
		description:
			'List invoices by customer or subscription, one page at a time',
	},
	'invoices.get': {
		riskLevel: 'read',
		description: 'Read one invoice with its totals and links',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof proabonoEndpointsNested>;

export type BaseProabonoPlugin<T extends ProabonoPluginOptions> = CorsairPlugin<
	'proabono',
	typeof ProabonoSchema,
	typeof proabonoEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType,
	typeof proabonoAuthConfig
>;

export type InternalProabonoPlugin = BaseProabonoPlugin<ProabonoPluginOptions>;

export type ExternalProabonoPlugin<T extends ProabonoPluginOptions> =
	BaseProabonoPlugin<T>;

/**
 * The default is `{}` because every field of `ProabonoPluginOptions` is optional,
 * so an empty object is a valid options bag. `T` is the caller's own literal type,
 * inferred only from what they pass: on the no-argument call there is nothing of
 * `T` to construct, so the assertion supplies exactly the empty base half and
 * nothing can be missing. An overload would not remove the cast, because the
 * implementation still needs one default for both call shapes.
 */
export function proabono<const T extends ProabonoPluginOptions>(
	incomingOptions: ProabonoPluginOptions & T = {} as ProabonoPluginOptions & T,
): ExternalProabonoPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'proabono',
		authConfig: proabonoAuthConfig,
		schema: ProabonoSchema,
		options,
		hooks: options.hooks,
		endpoints: proabonoEndpointsNested,
		webhooks: {},
		endpointMeta: proabonoEndpointMeta,
		endpointSchemas: proabonoEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: ProabonoKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.apiKey) {
				return options.apiKey;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				// Every call also needs the agent key (the Basic username) and the
				// account number (the host). A connection missing either must throw
				// here, where core turns it into a connect link, rather than fail later.
				const agentKey = await ctx.keys.get_agent_key();
				const account = options.account ?? (await ctx.keys.get_account());
				if (res && agentKey?.trim() && account?.trim()) return res;
			}

			throw new AuthMissingError('proabono', ctx.authType ?? 'api_key');
		},
	} satisfies InternalProabonoPlugin;
}

export { ProabonoAPIError } from './client';
export type {
	BalanceLinesCreateInput,
	BalanceLinesListInput,
	BalanceLinesListOutput,
	CustomerActionOutput,
	CustomersActionInput,
	CustomersCreateInput,
	CustomersGetInput,
	CustomersListInput,
	CustomersListOutput,
	CustomersUpdateInput,
	FeaturesGetInput,
	FeaturesListInput,
	FeaturesListOutput,
	InvoicesGetInput,
	InvoicesListInput,
	InvoicesListOutput,
	OffersGetInput,
	OffersListInput,
	OffersListOutput,
	ProabonoBalanceLine,
	ProabonoCustomer,
	ProabonoEndpointInputs,
	ProabonoEndpointOutputs,
	ProabonoFeature,
	ProabonoInvoice,
	ProabonoLink,
	ProabonoOffer,
	ProabonoSubscription,
	ProabonoUsage,
	ProabonoUsageUpdateRow,
	SubscriptionIdInput,
	SubscriptionsCreateInput,
	SubscriptionsListInput,
	SubscriptionsListOutput,
	SubscriptionTermInput,
	SubscriptionUpgradeInput,
	UsageIncrementInput,
	UsagesGetInput,
	UsagesListInput,
	UsagesListOutput,
	UsagesUpdateInput,
	UsagesUpdateOutput,
} from './endpoints/types';
