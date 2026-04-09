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
} from 'corsair/core';
import {
	Balance,
	Charges,
	Coupons,
	Customers,
	PaymentIntents,
	Prices,
	Sources,
	Tokens,
} from './endpoints';
import type {
	StripeEndpointInputs,
	StripeEndpointOutputs,
} from './endpoints/types';
import {
	StripeEndpointInputSchemas,
	StripeEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { StripeSchema } from './schema';
import {
	ChargeWebhooks,
	CouponWebhooks,
	CustomerWebhooks,
	PaymentIntentWebhooks,
	PingWebhooks,
} from './webhooks';
import type {
	StripeChargeFailedEvent,
	StripeChargeRefundedEvent,
	StripeChargeSucceededEvent,
	StripeCouponCreatedEvent,
	StripeCouponDeletedEvent,
	StripeCustomerCreatedEvent,
	StripeCustomerDeletedEvent,
	StripeCustomerUpdatedEvent,
	StripePaymentIntentFailedEvent,
	StripePaymentIntentSucceededEvent,
	StripePingEvent,
	StripeWebhookOutputs,
} from './webhooks/types';
import {
	StripeChargeFailedEventSchema,
	StripeChargeRefundedEventSchema,
	StripeChargeSucceededEventSchema,
	StripeCouponCreatedEventSchema,
	StripeCouponDeletedEventSchema,
	StripeCustomerCreatedEventSchema,
	StripeCustomerDeletedEventSchema,
	StripeCustomerUpdatedEventSchema,
	StripePaymentIntentFailedEventSchema,
	StripePaymentIntentSucceededEventSchema,
	StripePingEventSchema,
} from './webhooks/types';

export type StripePluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalStripePlugin['hooks'];
	webhookHooks?: InternalStripePlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	/**
	 * Permission configuration for the Stripe plugin.
	 * Controls what the AI agent is allowed to do.
	 * Overrides use dot-notation paths from the Stripe endpoint tree — invalid paths are type errors.
	 */
	permissions?: PluginPermissionsConfig<typeof stripeEndpointsNested>;
};

export type StripeContext = CorsairPluginContext<
	typeof StripeSchema,
	StripePluginOptions
>;

export type StripeKeyBuilderContext = KeyBuilderContext<StripePluginOptions>;

export type StripeBoundEndpoints = BindEndpoints<typeof stripeEndpointsNested>;

type StripeEndpoint<K extends keyof StripeEndpointOutputs> = CorsairEndpoint<
	StripeContext,
	StripeEndpointInputs[K],
	StripeEndpointOutputs[K]
>;

export type StripeEndpoints = {
	balanceGet: StripeEndpoint<'balanceGet'>;
	chargesCreate: StripeEndpoint<'chargesCreate'>;
	chargesGet: StripeEndpoint<'chargesGet'>;
	chargesList: StripeEndpoint<'chargesList'>;
	chargesUpdate: StripeEndpoint<'chargesUpdate'>;
	couponsCreate: StripeEndpoint<'couponsCreate'>;
	couponsList: StripeEndpoint<'couponsList'>;
	customersCreate: StripeEndpoint<'customersCreate'>;
	customersDelete: StripeEndpoint<'customersDelete'>;
	customersGet: StripeEndpoint<'customersGet'>;
	customersList: StripeEndpoint<'customersList'>;
	paymentIntentsCreate: StripeEndpoint<'paymentIntentsCreate'>;
	paymentIntentsGet: StripeEndpoint<'paymentIntentsGet'>;
	paymentIntentsList: StripeEndpoint<'paymentIntentsList'>;
	paymentIntentsUpdate: StripeEndpoint<'paymentIntentsUpdate'>;
	pricesCreate: StripeEndpoint<'pricesCreate'>;
	pricesList: StripeEndpoint<'pricesList'>;
	sourcesCreate: StripeEndpoint<'sourcesCreate'>;
	sourcesGet: StripeEndpoint<'sourcesGet'>;
	tokensCreate: StripeEndpoint<'tokensCreate'>;
};

type StripeWebhook<
	K extends keyof StripeWebhookOutputs,
	TEvent,
> = CorsairWebhook<StripeContext, TEvent, StripeWebhookOutputs[K]>;

export type StripeWebhooks = {
	chargeSucceeded: StripeWebhook<'chargeSucceeded', StripeChargeSucceededEvent>;
	chargeFailed: StripeWebhook<'chargeFailed', StripeChargeFailedEvent>;
	chargeRefunded: StripeWebhook<'chargeRefunded', StripeChargeRefundedEvent>;
	customerCreated: StripeWebhook<'customerCreated', StripeCustomerCreatedEvent>;
	customerDeleted: StripeWebhook<'customerDeleted', StripeCustomerDeletedEvent>;
	customerUpdated: StripeWebhook<'customerUpdated', StripeCustomerUpdatedEvent>;
	paymentIntentSucceeded: StripeWebhook<
		'paymentIntentSucceeded',
		StripePaymentIntentSucceededEvent
	>;
	paymentIntentFailed: StripeWebhook<
		'paymentIntentFailed',
		StripePaymentIntentFailedEvent
	>;
	couponCreated: StripeWebhook<'couponCreated', StripeCouponCreatedEvent>;
	couponDeleted: StripeWebhook<'couponDeleted', StripeCouponDeletedEvent>;
	ping: StripeWebhook<'ping', StripePingEvent>;
};

export type StripeBoundWebhooks = BindWebhooks<StripeWebhooks>;

const stripeEndpointsNested = {
	balance: { get: Balance.get },
	charges: {
		create: Charges.create,
		get: Charges.get,
		list: Charges.list,
		update: Charges.update,
	},
	coupons: { create: Coupons.create, list: Coupons.list },
	customers: {
		create: Customers.create,
		delete: Customers.delete,
		get: Customers.get,
		list: Customers.list,
	},
	paymentIntents: {
		create: PaymentIntents.create,
		get: PaymentIntents.get,
		list: PaymentIntents.list,
		update: PaymentIntents.update,
	},
	prices: { create: Prices.create, list: Prices.list },
	sources: { create: Sources.create, get: Sources.get },
	tokens: { create: Tokens.create },
} as const;

const stripeWebhooksNested = {
	charge: {
		succeeded: ChargeWebhooks.succeeded,
		failed: ChargeWebhooks.failed,
		refunded: ChargeWebhooks.refunded,
	},
	customer: {
		created: CustomerWebhooks.created,
		deleted: CustomerWebhooks.deleted,
		updated: CustomerWebhooks.updated,
	},
	paymentIntent: {
		succeeded: PaymentIntentWebhooks.succeeded,
		failed: PaymentIntentWebhooks.failed,
	},
	coupon: { created: CouponWebhooks.created, deleted: CouponWebhooks.deleted },
	ping: { ping: PingWebhooks.ping },
} as const;

export const stripeEndpointSchemas = {
	'balance.get': {
		input: StripeEndpointInputSchemas.balanceGet,
		output: StripeEndpointOutputSchemas.balanceGet,
	},
	'charges.create': {
		input: StripeEndpointInputSchemas.chargesCreate,
		output: StripeEndpointOutputSchemas.chargesCreate,
	},
	'charges.get': {
		input: StripeEndpointInputSchemas.chargesGet,
		output: StripeEndpointOutputSchemas.chargesGet,
	},
	'charges.list': {
		input: StripeEndpointInputSchemas.chargesList,
		output: StripeEndpointOutputSchemas.chargesList,
	},
	'charges.update': {
		input: StripeEndpointInputSchemas.chargesUpdate,
		output: StripeEndpointOutputSchemas.chargesUpdate,
	},
	'coupons.create': {
		input: StripeEndpointInputSchemas.couponsCreate,
		output: StripeEndpointOutputSchemas.couponsCreate,
	},
	'coupons.list': {
		input: StripeEndpointInputSchemas.couponsList,
		output: StripeEndpointOutputSchemas.couponsList,
	},
	'customers.create': {
		input: StripeEndpointInputSchemas.customersCreate,
		output: StripeEndpointOutputSchemas.customersCreate,
	},
	'customers.delete': {
		input: StripeEndpointInputSchemas.customersDelete,
		output: StripeEndpointOutputSchemas.customersDelete,
	},
	'customers.get': {
		input: StripeEndpointInputSchemas.customersGet,
		output: StripeEndpointOutputSchemas.customersGet,
	},
	'customers.list': {
		input: StripeEndpointInputSchemas.customersList,
		output: StripeEndpointOutputSchemas.customersList,
	},
	'paymentIntents.create': {
		input: StripeEndpointInputSchemas.paymentIntentsCreate,
		output: StripeEndpointOutputSchemas.paymentIntentsCreate,
	},
	'paymentIntents.get': {
		input: StripeEndpointInputSchemas.paymentIntentsGet,
		output: StripeEndpointOutputSchemas.paymentIntentsGet,
	},
	'paymentIntents.list': {
		input: StripeEndpointInputSchemas.paymentIntentsList,
		output: StripeEndpointOutputSchemas.paymentIntentsList,
	},
	'paymentIntents.update': {
		input: StripeEndpointInputSchemas.paymentIntentsUpdate,
		output: StripeEndpointOutputSchemas.paymentIntentsUpdate,
	},
	'prices.create': {
		input: StripeEndpointInputSchemas.pricesCreate,
		output: StripeEndpointOutputSchemas.pricesCreate,
	},
	'prices.list': {
		input: StripeEndpointInputSchemas.pricesList,
		output: StripeEndpointOutputSchemas.pricesList,
	},
	'sources.create': {
		input: StripeEndpointInputSchemas.sourcesCreate,
		output: StripeEndpointOutputSchemas.sourcesCreate,
	},
	'sources.get': {
		input: StripeEndpointInputSchemas.sourcesGet,
		output: StripeEndpointOutputSchemas.sourcesGet,
	},
	'tokens.create': {
		input: StripeEndpointInputSchemas.tokensCreate,
		output: StripeEndpointOutputSchemas.tokensCreate,
	},
} as const;

const defaultAuthType: AuthTypes = 'api_key' as const;

const stripeEndpointMeta = {
	'balance.get': {
		riskLevel: 'read',
		description: 'Retrieve the current account balance',
	},
	'charges.create': {
		riskLevel: 'write',
		description: 'Create a new Stripe charge',
	},
	'charges.get': {
		riskLevel: 'read',
		description: 'Retrieve a Stripe charge by ID',
	},
	'charges.list': {
		riskLevel: 'read',
		description: 'List Stripe charges with optional filters',
	},
	'charges.update': {
		riskLevel: 'write',
		description: 'Update a Stripe charge',
	},
	'coupons.create': {
		riskLevel: 'write',
		description: 'Create a new Stripe coupon',
	},
	'coupons.list': {
		riskLevel: 'read',
		description: 'List Stripe coupons',
	},
	'customers.create': {
		riskLevel: 'write',
		description: 'Create a new Stripe customer',
	},
	'customers.delete': {
		riskLevel: 'destructive',
		description: 'Delete a Stripe customer [DESTRUCTIVE]',
	},
	'customers.get': {
		riskLevel: 'read',
		description: 'Retrieve a Stripe customer by ID',
	},
	'customers.list': {
		riskLevel: 'read',
		description: 'List Stripe customers with optional filters',
	},
	'paymentIntents.create': {
		riskLevel: 'write',
		description: 'Create a new Stripe payment intent',
	},
	'paymentIntents.get': {
		riskLevel: 'read',
		description: 'Retrieve a Stripe payment intent by ID',
	},
	'paymentIntents.list': {
		riskLevel: 'read',
		description: 'List Stripe payment intents with optional filters',
	},
	'paymentIntents.update': {
		riskLevel: 'write',
		description: 'Update a Stripe payment intent',
	},
	'prices.create': {
		riskLevel: 'write',
		description: 'Create a new Stripe price',
	},
	'prices.list': {
		riskLevel: 'read',
		description: 'List Stripe prices',
	},
	'sources.create': {
		riskLevel: 'write',
		description: 'Create a new Stripe source',
	},
	'sources.get': {
		riskLevel: 'read',
		description: 'Retrieve a Stripe source by ID',
	},
	'tokens.create': {
		riskLevel: 'write',
		description: 'Create a Stripe token',
	},
} satisfies RequiredPluginEndpointMeta<typeof stripeEndpointsNested>;

const stripeWebhookSchemas = {
	'charge.succeeded': {
		description: 'A charge was successfully completed',
		payload: StripeChargeSucceededEventSchema,
		response: StripeChargeSucceededEventSchema,
	},
	'charge.failed': {
		description: 'A charge attempt failed',
		payload: StripeChargeFailedEventSchema,
		response: StripeChargeFailedEventSchema,
	},
	'charge.refunded': {
		description: 'A charge was refunded',
		payload: StripeChargeRefundedEventSchema,
		response: StripeChargeRefundedEventSchema,
	},
	'customer.created': {
		description: 'A new customer was created',
		payload: StripeCustomerCreatedEventSchema,
		response: StripeCustomerCreatedEventSchema,
	},
	'customer.deleted': {
		description: 'A customer was deleted',
		payload: StripeCustomerDeletedEventSchema,
		response: StripeCustomerDeletedEventSchema,
	},
	'customer.updated': {
		description: 'A customer was updated',
		payload: StripeCustomerUpdatedEventSchema,
		response: StripeCustomerUpdatedEventSchema,
	},
	'paymentIntent.succeeded': {
		description: 'A payment intent succeeded',
		payload: StripePaymentIntentSucceededEventSchema,
		response: StripePaymentIntentSucceededEventSchema,
	},
	'paymentIntent.failed': {
		description: 'A payment intent payment failed',
		payload: StripePaymentIntentFailedEventSchema,
		response: StripePaymentIntentFailedEventSchema,
	},
	'coupon.created': {
		description: 'A coupon was created',
		payload: StripeCouponCreatedEventSchema,
		response: StripeCouponCreatedEventSchema,
	},
	'coupon.deleted': {
		description: 'A coupon was deleted',
		payload: StripeCouponDeletedEventSchema,
		response: StripeCouponDeletedEventSchema,
	},
	'ping.ping': {
		description: 'Stripe webhook endpoint connectivity test',
		payload: StripePingEventSchema,
		response: StripePingEventSchema,
	},
} as const;

export const stripeAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseStripePlugin<T extends StripePluginOptions> = CorsairPlugin<
	'stripe',
	typeof StripeSchema,
	typeof stripeEndpointsNested,
	typeof stripeWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalStripePlugin = BaseStripePlugin<StripePluginOptions>;

export type ExternalStripePlugin<T extends StripePluginOptions> =
	BaseStripePlugin<T>;

export function stripe<const T extends StripePluginOptions>(
	// Type assertion: empty object is a safe default because all StripePluginOptions fields are optional
	incomingOptions: StripePluginOptions & T = {} as StripePluginOptions & T,
): ExternalStripePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'stripe',
		schema: StripeSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: stripeEndpointsNested,
		webhooks: stripeWebhooksNested,
		endpointMeta: stripeEndpointMeta,
		endpointSchemas: stripeEndpointSchemas,
		webhookSchemas: stripeWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			return 'stripe-signature' in request.headers;
		},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: StripeKeyBuilderContext, source) => {
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature();

				if (!res) {
					return '';
				}

				return res;
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();

				if (!res) {
					return '';
				}

				return res;
			}

			return '';
		},
	} satisfies InternalStripePlugin;
}

// ─────────────────────────────────────────────────────────────────────────────
// Webhook Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	StripeChargeFailedEvent,
	StripeChargeRefundedEvent,
	StripeChargeSucceededEvent,
	StripeCouponCreatedEvent,
	StripeCouponDeletedEvent,
	StripeCustomerCreatedEvent,
	StripeCustomerDeletedEvent,
	StripeCustomerUpdatedEvent,
	StripePaymentIntentFailedEvent,
	StripePaymentIntentSucceededEvent,
	StripePingEvent,
	StripeWebhookOutputs,
} from './webhooks/types';

export { createStripeEventMatch } from './webhooks/types';

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	BalanceGetInput,
	BalanceGetResponse,
	ChargesCreateInput,
	ChargesCreateResponse,
	ChargesGetInput,
	ChargesGetResponse,
	ChargesListInput,
	ChargesListResponse,
	ChargesUpdateInput,
	ChargesUpdateResponse,
	CouponsCreateInput,
	CouponsCreateResponse,
	CouponsListInput,
	CouponsListResponse,
	CustomersCreateInput,
	CustomersCreateResponse,
	CustomersDeleteInput,
	CustomersDeleteResponse,
	CustomersGetInput,
	CustomersGetResponse,
	CustomersListInput,
	CustomersListResponse,
	PaymentIntentsCreateInput,
	PaymentIntentsCreateResponse,
	PaymentIntentsGetInput,
	PaymentIntentsGetResponse,
	PaymentIntentsListInput,
	PaymentIntentsListResponse,
	PaymentIntentsUpdateInput,
	PaymentIntentsUpdateResponse,
	PricesCreateInput,
	PricesCreateResponse,
	PricesListInput,
	PricesListResponse,
	SourcesCreateInput,
	SourcesCreateResponse,
	SourcesGetInput,
	SourcesGetResponse,
	StripeEndpointInputs,
	StripeEndpointOutputs,
	TokensCreateInput,
	TokensCreateResponse,
} from './endpoints/types';
