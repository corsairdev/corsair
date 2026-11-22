import type {
	AuthTypes,
	BindEndpoints,
	BindWebhooks,
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
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	Customers,
	Plans,
	Refunds,
	Subscriptions,
	Transactions,
} from './endpoints';
import type {
	PaystackEndpointInputs,
	PaystackEndpointOutputs,
} from './endpoints/types';
import {
	PaystackEndpointInputSchemas,
	PaystackEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { PaystackSchema } from './schema';
import { event } from './webhooks';
import { matchPaystackWebhook, PaystackEventSchema } from './webhooks/types';

export type PaystackPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalPaystackPlugin['hooks'];
	webhookHooks?: InternalPaystackPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof paystackEndpointsNested>;
};

export type PaystackContext = CorsairPluginContext<
	typeof PaystackSchema,
	PaystackPluginOptions,
	undefined,
	typeof paystackAuthConfig
>;

export type PaystackKeyBuilderContext = KeyBuilderContext<
	PaystackPluginOptions,
	typeof paystackAuthConfig
>;

export type PaystackBoundEndpoints = BindEndpoints<
	typeof paystackEndpointsNested
>;

type PaystackEndpoint<K extends keyof PaystackEndpointOutputs> =
	CorsairEndpoint<
		PaystackContext,
		PaystackEndpointInputs[K],
		PaystackEndpointOutputs[K]
	>;

export type PaystackEndpoints = {
	[K in keyof PaystackEndpointOutputs]: PaystackEndpoint<K>;
};

export type PaystackBoundWebhooks = BindWebhooks<typeof paystackWebhooksNested>;

const paystackEndpointsNested = {
	transactions: {
		initialize: Transactions.initialize,
		verify: Transactions.verify,
		list: Transactions.list,
		get: Transactions.get,
	},
	customers: {
		create: Customers.create,
		list: Customers.list,
		get: Customers.get,
		update: Customers.update,
		setRiskAction: Customers.setRiskAction,
	},
	plans: {
		create: Plans.create,
		list: Plans.list,
		get: Plans.get,
		update: Plans.update,
	},
	subscriptions: {
		create: Subscriptions.create,
		list: Subscriptions.list,
		get: Subscriptions.get,
		enable: Subscriptions.enable,
		disable: Subscriptions.disable,
	},
	refunds: {
		create: Refunds.create,
		list: Refunds.list,
		get: Refunds.get,
	},
} as const;

export const paystackWebhooksNested = {
	paystack: {
		event,
	},
} as const;

export const paystackEndpointSchemas = {
	'transactions.initialize': {
		input: PaystackEndpointInputSchemas.transactionsInitialize,
		output: PaystackEndpointOutputSchemas.transactionsInitialize,
	},
	'transactions.verify': {
		input: PaystackEndpointInputSchemas.transactionsVerify,
		output: PaystackEndpointOutputSchemas.transactionsVerify,
	},
	'transactions.list': {
		input: PaystackEndpointInputSchemas.transactionsList,
		output: PaystackEndpointOutputSchemas.transactionsList,
	},
	'transactions.get': {
		input: PaystackEndpointInputSchemas.transactionsGet,
		output: PaystackEndpointOutputSchemas.transactionsGet,
	},
	'customers.create': {
		input: PaystackEndpointInputSchemas.customersCreate,
		output: PaystackEndpointOutputSchemas.customersCreate,
	},
	'customers.list': {
		input: PaystackEndpointInputSchemas.customersList,
		output: PaystackEndpointOutputSchemas.customersList,
	},
	'customers.get': {
		input: PaystackEndpointInputSchemas.customersGet,
		output: PaystackEndpointOutputSchemas.customersGet,
	},
	'customers.update': {
		input: PaystackEndpointInputSchemas.customersUpdate,
		output: PaystackEndpointOutputSchemas.customersUpdate,
	},
	'customers.setRiskAction': {
		input: PaystackEndpointInputSchemas.customersSetRiskAction,
		output: PaystackEndpointOutputSchemas.customersSetRiskAction,
	},
	'plans.create': {
		input: PaystackEndpointInputSchemas.plansCreate,
		output: PaystackEndpointOutputSchemas.plansCreate,
	},
	'plans.list': {
		input: PaystackEndpointInputSchemas.plansList,
		output: PaystackEndpointOutputSchemas.plansList,
	},
	'plans.get': {
		input: PaystackEndpointInputSchemas.plansGet,
		output: PaystackEndpointOutputSchemas.plansGet,
	},
	'plans.update': {
		input: PaystackEndpointInputSchemas.plansUpdate,
		output: PaystackEndpointOutputSchemas.plansUpdate,
	},
	'subscriptions.create': {
		input: PaystackEndpointInputSchemas.subscriptionsCreate,
		output: PaystackEndpointOutputSchemas.subscriptionsCreate,
	},
	'subscriptions.list': {
		input: PaystackEndpointInputSchemas.subscriptionsList,
		output: PaystackEndpointOutputSchemas.subscriptionsList,
	},
	'subscriptions.get': {
		input: PaystackEndpointInputSchemas.subscriptionsGet,
		output: PaystackEndpointOutputSchemas.subscriptionsGet,
	},
	'subscriptions.enable': {
		input: PaystackEndpointInputSchemas.subscriptionsEnable,
		output: PaystackEndpointOutputSchemas.subscriptionsEnable,
	},
	'subscriptions.disable': {
		input: PaystackEndpointInputSchemas.subscriptionsDisable,
		output: PaystackEndpointOutputSchemas.subscriptionsDisable,
	},
	'refunds.create': {
		input: PaystackEndpointInputSchemas.refundsCreate,
		output: PaystackEndpointOutputSchemas.refundsCreate,
	},
	'refunds.list': {
		input: PaystackEndpointInputSchemas.refundsList,
		output: PaystackEndpointOutputSchemas.refundsList,
	},
	'refunds.get': {
		input: PaystackEndpointInputSchemas.refundsGet,
		output: PaystackEndpointOutputSchemas.refundsGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof paystackEndpointsNested
>;

const paystackWebhookSchemas = {
	'paystack.event': {
		description:
			'A Paystack webhook delivery: charge, transfer or refund events',
		payload: PaystackEventSchema,
		response: PaystackEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof paystackWebhooksNested
>;

const paystackEndpointMeta = {
	'transactions.initialize': {
		riskLevel: 'write',
		description:
			'Start a checkout and get the authorization_url to redirect the customer to',
	},
	'transactions.verify': {
		riskLevel: 'read',
		description:
			'Verify a transaction by its reference and read its final status',
	},
	'transactions.list': {
		riskLevel: 'read',
		description: 'List transactions, filtered by customer, status and dates',
	},
	'transactions.get': {
		riskLevel: 'read',
		description: 'Read one transaction by id',
	},
	'customers.create': {
		riskLevel: 'write',
		description: 'Create a customer',
	},
	'customers.list': {
		riskLevel: 'read',
		description: 'List customers, paged and filtered by creation date',
	},
	'customers.get': {
		riskLevel: 'read',
		description: 'Read one customer by email address or code',
	},
	'customers.update': {
		riskLevel: 'write',
		description: 'Update a customer name and contact details',
	},
	'customers.setRiskAction': {
		riskLevel: 'write',
		description: 'Whitelist, blacklist or reset a customer',
	},
	'plans.create': {
		riskLevel: 'write',
		description: 'Create a payment plan',
	},
	'plans.list': {
		riskLevel: 'read',
		description: 'List payment plans, filtered by interval and amount',
	},
	'plans.get': {
		riskLevel: 'read',
		description: 'Read one plan by id or code',
	},
	'plans.update': {
		riskLevel: 'write',
		description:
			'Update a plan, optionally applying the changes to existing subscriptions',
	},
	'subscriptions.create': {
		riskLevel: 'destructive',
		description:
			"Subscribe a customer to a plan; Paystack then debits the customer's saved card on every interval",
	},
	'subscriptions.list': {
		riskLevel: 'read',
		description: 'List subscriptions, filtered by customer and plan',
	},
	'subscriptions.get': {
		riskLevel: 'read',
		description: 'Read one subscription by id or code',
	},
	'subscriptions.enable': {
		riskLevel: 'destructive',
		description:
			"Enable a subscription with its email token; debits of the customer's card resume",
	},
	'subscriptions.disable': {
		riskLevel: 'write',
		description:
			'Disable a subscription with its email token; debits stop until it is enabled again',
	},
	'refunds.create': {
		riskLevel: 'destructive',
		description:
			'Refund a transaction fully or partially; money leaves the account and refunds cannot be undone',
		irreversible: true,
	},
	'refunds.list': {
		riskLevel: 'read',
		description: 'List refunds, filtered by transaction, currency and dates',
	},
	'refunds.get': {
		riskLevel: 'read',
		description: 'Read one refund by id',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof paystackEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const paystackAuthConfig = {
	api_key: {
		// Paystack issues one secret key pair per account; no account-level
		// field is needed beside it.
		account: [] as const,
	},
} as const satisfies PluginAuthConfig;

export type BasePaystackPlugin<T extends PaystackPluginOptions> = CorsairPlugin<
	'paystack',
	typeof PaystackSchema,
	typeof paystackEndpointsNested,
	typeof paystackWebhooksNested,
	T,
	typeof defaultAuthType,
	typeof paystackAuthConfig
>;

export type InternalPaystackPlugin = BasePaystackPlugin<PaystackPluginOptions>;

export type ExternalPaystackPlugin<T extends PaystackPluginOptions> =
	BasePaystackPlugin<T>;

export function paystack<const T extends PaystackPluginOptions>(
	incomingOptions: PaystackPluginOptions & T = {} as PaystackPluginOptions & T,
): ExternalPaystackPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'paystack',
		authConfig: paystackAuthConfig,
		schema: PaystackSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: paystackEndpointsNested,
		webhooks: paystackWebhooksNested,
		endpointMeta: paystackEndpointMeta,
		endpointSchemas: paystackEndpointSchemas,
		webhookSchemas: paystackWebhookSchemas,
		pluginWebhookMatcher: matchPaystackWebhook,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: PaystackKeyBuilderContext, source) => {
			if (source === 'webhook') {
				// Deliveries are signed with the secret key (legacy scheme) or
				// the whsec_ signing secret (current scheme); an empty secret
				// makes the handler reject deliveries with 401 rather than
				// accept them unverified.
				if (options.webhookSecret) return options.webhookSecret;
				const stored = await ctx.keys.get_webhook_signature();
				return stored ?? '';
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('paystack', ctx.authType ?? 'api_key');
		},
	} satisfies InternalPaystackPlugin;
}

export { buildPaystackApiError } from './client';

export type {
	Customer,
	PaystackEndpointInputs,
	PaystackEndpointOutputs,
	Plan,
	Refund,
	Subscription,
	Transaction,
} from './endpoints/types';
export type { PaystackWebhookPayload } from './webhooks/types';
export {
	matchPaystackWebhook,
	parseCurrentSignature,
	verifyPaystackWebhook,
} from './webhooks/types';
