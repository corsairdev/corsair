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
	Company,
	Customers,
	Payments,
	Plans,
	Refunds,
	Subscriptions,
	User,
} from './endpoints';
import type {
	PayhereEndpointInputs,
	PayhereEndpointOutputs,
} from './endpoints/types';
import {
	PayhereEndpointInputSchemas,
	PayhereEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { PayhereSchema } from './schema';
import { event } from './webhooks';
import {
	matchPayhereWebhook,
	PayhereWebhookPayloadSchema,
} from './webhooks/types';

export type PayherePluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalPayherePlugin['hooks'];
	webhookHooks?: InternalPayherePlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof payhereEndpointsNested>;
};

export type PayhereContext = CorsairPluginContext<
	typeof PayhereSchema,
	PayherePluginOptions,
	undefined,
	typeof payhereAuthConfig
>;

export type PayhereKeyBuilderContext = KeyBuilderContext<
	PayherePluginOptions,
	typeof payhereAuthConfig
>;

export type PayhereBoundEndpoints = BindEndpoints<
	typeof payhereEndpointsNested
>;

type PayhereEndpoint<K extends keyof PayhereEndpointOutputs> = CorsairEndpoint<
	PayhereContext,
	PayhereEndpointInputs[K],
	PayhereEndpointOutputs[K]
>;

export type PayhereEndpoints = {
	[K in keyof PayhereEndpointOutputs]: PayhereEndpoint<K>;
};

export type PayhereBoundWebhooks = BindWebhooks<typeof payhereWebhooksNested>;

const payhereEndpointsNested = {
	user: {
		get: User.get,
	},
	company: {
		get: Company.get,
		stats: Company.stats,
	},
	customers: {
		list: Customers.list,
		get: Customers.get,
	},
	payments: {
		list: Payments.list,
	},
	plans: {
		list: Plans.list,
	},
	subscriptions: {
		list: Subscriptions.list,
	},
	refunds: {
		create: Refunds.create,
	},
} as const;

export const payhereWebhooksNested = {
	payhere: {
		event,
	},
} as const;

export const payhereEndpointSchemas = {
	'user.get': {
		input: PayhereEndpointInputSchemas.userGet,
		output: PayhereEndpointOutputSchemas.userGet,
	},
	'company.get': {
		input: PayhereEndpointInputSchemas.companyGet,
		output: PayhereEndpointOutputSchemas.companyGet,
	},
	'company.stats': {
		input: PayhereEndpointInputSchemas.companyStats,
		output: PayhereEndpointOutputSchemas.companyStats,
	},
	'customers.list': {
		input: PayhereEndpointInputSchemas.customersList,
		output: PayhereEndpointOutputSchemas.customersList,
	},
	'customers.get': {
		input: PayhereEndpointInputSchemas.customersGet,
		output: PayhereEndpointOutputSchemas.customersGet,
	},
	'payments.list': {
		input: PayhereEndpointInputSchemas.paymentsList,
		output: PayhereEndpointOutputSchemas.paymentsList,
	},
	'plans.list': {
		input: PayhereEndpointInputSchemas.plansList,
		output: PayhereEndpointOutputSchemas.plansList,
	},
	'subscriptions.list': {
		input: PayhereEndpointInputSchemas.subscriptionsList,
		output: PayhereEndpointOutputSchemas.subscriptionsList,
	},
	'refunds.create': {
		input: PayhereEndpointInputSchemas.refundsCreate,
		output: PayhereEndpointOutputSchemas.refundsCreate,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof payhereEndpointsNested
>;

const payhereWebhookSchemas = {
	'payhere.event': {
		description: 'A Payhere payment or subscription event delivery',
		payload: PayhereWebhookPayloadSchema,
		response: PayhereWebhookPayloadSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof payhereWebhooksNested>;

const payhereEndpointMeta = {
	'user.get': {
		riskLevel: 'read',
		description: 'Read the authenticated Payhere user',
	},
	'company.get': {
		riskLevel: 'read',
		description: 'Read the company of the authenticated user',
	},
	'company.stats': {
		riskLevel: 'read',
		description: 'Read the payment stats of the last 30 days with comparisons',
	},
	'customers.list': {
		riskLevel: 'read',
		description: 'List customers, most recent first, paged',
	},
	'customers.get': {
		riskLevel: 'read',
		description:
			'Read one customer with their subscriptions and payment history',
	},
	'payments.list': {
		riskLevel: 'read',
		description: 'List payments, most recent first, paged',
	},
	'plans.list': {
		riskLevel: 'read',
		description: 'List the payment plans, paged',
	},
	'subscriptions.list': {
		riskLevel: 'read',
		description: 'List subscriptions, most recent payment first, paged',
	},
	'refunds.create': {
		riskLevel: 'destructive',
		description:
			'Refund a payment fully or partially; money leaves the account and the refund cannot be undone',
		irreversible: true,
	},
} as const satisfies RequiredPluginEndpointMeta<typeof payhereEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const payhereAuthConfig = {
	api_key: {
		// Payhere issues one API key per merchant account; no account-level
		// field is needed beside it.
		account: [] as const,
	},
} as const satisfies PluginAuthConfig;

export type BasePayherePlugin<T extends PayherePluginOptions> = CorsairPlugin<
	'payhere',
	typeof PayhereSchema,
	typeof payhereEndpointsNested,
	typeof payhereWebhooksNested,
	T,
	typeof defaultAuthType,
	typeof payhereAuthConfig
>;

export type InternalPayherePlugin = BasePayherePlugin<PayherePluginOptions>;

export type ExternalPayherePlugin<T extends PayherePluginOptions> =
	BasePayherePlugin<T>;

export function payhere<const T extends PayherePluginOptions>(
	incomingOptions: PayherePluginOptions & T = {} as PayherePluginOptions & T,
): ExternalPayherePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'payhere',
		authConfig: payhereAuthConfig,
		schema: PayhereSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: payhereEndpointsNested,
		webhooks: payhereWebhooksNested,
		endpointMeta: payhereEndpointMeta,
		endpointSchemas: payhereEndpointSchemas,
		webhookSchemas: payhereWebhookSchemas,
		pluginWebhookMatcher: matchPayhereWebhook,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: PayhereKeyBuilderContext, source) => {
			if (source === 'webhook') {
				// Every Payhere delivery is signed with the account's shared
				// secret, so an empty secret makes the handler reject deliveries
				// with 401 rather than accept them unverified.
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

			throw new AuthMissingError('payhere', ctx.authType ?? 'api_key');
		},
	} satisfies InternalPayherePlugin;
}

export { buildPayhereApiError } from './client';

export type {
	Company,
	CompanyStats,
	Customer,
	PayhereEndpointInputs,
	PayhereEndpointOutputs,
	Payment,
	Plan,
	Subscription,
	User,
} from './endpoints/types';
export type { PayhereWebhookPayload } from './webhooks/types';
export {
	matchPayhereWebhook,
	PAYHERE_SIGNATURE_HEADER,
	verifyPayhereWebhook,
} from './webhooks/types';
