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
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import { Customers, Payments, Refunds, Subscriptions } from './endpoints';
import type {
	CustomersCreateInput,
	CustomersGetInput,
	DodoPaymentsEndpointOutputs,
	PaymentsCreateInput,
	PaymentsGetInput,
	PaymentsListInput,
	RefundsCreateInput,
	SubscriptionsCancelInput,
	SubscriptionsCreateInput,
	SubscriptionsGetInput,
} from './endpoints/types';
import {
	DodoPaymentsEndpointInputSchemas,
	DodoPaymentsEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { DodoPaymentsSchema } from './schema';
import {
	PaymentWebhooks,
	RefundWebhooks,
	SubscriptionWebhooks,
} from './webhooks';
import type {
	DodoPaymentFailedEvent,
	DodoPaymentSucceededEvent,
	DodoPaymentsWebhookOutputs,
	DodoRefundSucceededEvent,
	DodoSubscriptionActiveEvent,
	DodoSubscriptionCancelledEvent,
} from './webhooks/types';
import {
	DodoPaymentFailedEventSchema,
	DodoPaymentSucceededEventSchema,
	DodoRefundSucceededEventSchema,
	DodoSubscriptionActiveEventSchema,
	DodoSubscriptionCancelledEventSchema,
} from './webhooks/types';

export type DodoPaymentsPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalDodoPaymentsPlugin['hooks'];
	webhookHooks?: InternalDodoPaymentsPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof dodoPaymentsEndpointsNested>;
};

export type DodoPaymentsContext = CorsairPluginContext<
	typeof DodoPaymentsSchema,
	DodoPaymentsPluginOptions
>;

export type DodoPaymentsKeyBuilderContext =
	KeyBuilderContext<DodoPaymentsPluginOptions>;

export type DodoPaymentsBoundEndpoints = BindEndpoints<
	typeof dodoPaymentsEndpointsNested
>;

type DodoPaymentsEndpoint<
	K extends keyof DodoPaymentsEndpointOutputs,
	Input,
> = CorsairEndpoint<DodoPaymentsContext, Input, DodoPaymentsEndpointOutputs[K]>;

export type DodoPaymentsEndpoints = {
	paymentsCreate: DodoPaymentsEndpoint<'paymentsCreate', PaymentsCreateInput>;
	paymentsGet: DodoPaymentsEndpoint<'paymentsGet', PaymentsGetInput>;
	paymentsList: DodoPaymentsEndpoint<'paymentsList', PaymentsListInput>;
	refundsCreate: DodoPaymentsEndpoint<'refundsCreate', RefundsCreateInput>;
	customersCreate: DodoPaymentsEndpoint<
		'customersCreate',
		CustomersCreateInput
	>;
	customersGet: DodoPaymentsEndpoint<'customersGet', CustomersGetInput>;
	subscriptionsCreate: DodoPaymentsEndpoint<
		'subscriptionsCreate',
		SubscriptionsCreateInput
	>;
	subscriptionsGet: DodoPaymentsEndpoint<
		'subscriptionsGet',
		SubscriptionsGetInput
	>;
	subscriptionsCancel: DodoPaymentsEndpoint<
		'subscriptionsCancel',
		SubscriptionsCancelInput
	>;
};

type DodoPaymentsWebhook<
	K extends keyof DodoPaymentsWebhookOutputs,
	TEvent,
> = CorsairWebhook<DodoPaymentsContext, TEvent, DodoPaymentsWebhookOutputs[K]>;

export type DodoPaymentsWebhooks = {
	paymentSucceeded: DodoPaymentsWebhook<
		'paymentSucceeded',
		DodoPaymentSucceededEvent
	>;
	paymentFailed: DodoPaymentsWebhook<'paymentFailed', DodoPaymentFailedEvent>;
	subscriptionActive: DodoPaymentsWebhook<
		'subscriptionActive',
		DodoSubscriptionActiveEvent
	>;
	subscriptionCancelled: DodoPaymentsWebhook<
		'subscriptionCancelled',
		DodoSubscriptionCancelledEvent
	>;
	refundSucceeded: DodoPaymentsWebhook<
		'refundSucceeded',
		DodoRefundSucceededEvent
	>;
};

export type DodoPaymentsBoundWebhooks = BindWebhooks<
	typeof dodoPaymentsWebhooksNested
>;

const dodoPaymentsEndpointsNested = {
	payments: {
		create: Payments.create,
		get: Payments.get,
		list: Payments.list,
	},
	refunds: {
		create: Refunds.create,
	},
	customers: {
		create: Customers.create,
		get: Customers.get,
	},
	subscriptions: {
		create: Subscriptions.create,
		get: Subscriptions.get,
		cancel: Subscriptions.cancel,
	},
} as const;

const dodoPaymentsWebhooksNested = {
	payments: {
		succeeded: PaymentWebhooks.succeeded,
		failed: PaymentWebhooks.failed,
	},
	subscriptions: {
		active: SubscriptionWebhooks.active,
		cancelled: SubscriptionWebhooks.cancelled,
	},
	refunds: {
		succeeded: RefundWebhooks.succeeded,
	},
} as const;

export const dodoPaymentsEndpointSchemas = {
	'payments.create': {
		input: DodoPaymentsEndpointInputSchemas.paymentsCreate,
		output: DodoPaymentsEndpointOutputSchemas.paymentsCreate,
	},
	'payments.get': {
		input: DodoPaymentsEndpointInputSchemas.paymentsGet,
		output: DodoPaymentsEndpointOutputSchemas.paymentsGet,
	},
	'payments.list': {
		input: DodoPaymentsEndpointInputSchemas.paymentsList,
		output: DodoPaymentsEndpointOutputSchemas.paymentsList,
	},
	'refunds.create': {
		input: DodoPaymentsEndpointInputSchemas.refundsCreate,
		output: DodoPaymentsEndpointOutputSchemas.refundsCreate,
	},
	'customers.create': {
		input: DodoPaymentsEndpointInputSchemas.customersCreate,
		output: DodoPaymentsEndpointOutputSchemas.customersCreate,
	},
	'customers.get': {
		input: DodoPaymentsEndpointInputSchemas.customersGet,
		output: DodoPaymentsEndpointOutputSchemas.customersGet,
	},
	'subscriptions.create': {
		input: DodoPaymentsEndpointInputSchemas.subscriptionsCreate,
		output: DodoPaymentsEndpointOutputSchemas.subscriptionsCreate,
	},
	'subscriptions.get': {
		input: DodoPaymentsEndpointInputSchemas.subscriptionsGet,
		output: DodoPaymentsEndpointOutputSchemas.subscriptionsGet,
	},
	'subscriptions.cancel': {
		input: DodoPaymentsEndpointInputSchemas.subscriptionsCancel,
		output: DodoPaymentsEndpointOutputSchemas.subscriptionsCancel,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof dodoPaymentsEndpointsNested
>;

const dodoPaymentsWebhookSchemas = {
	'payments.succeeded': {
		description: 'A Dodo payment succeeded',
		payload: DodoPaymentSucceededEventSchema,
		response: DodoPaymentSucceededEventSchema,
	},
	'payments.failed': {
		description: 'A Dodo payment failed',
		payload: DodoPaymentFailedEventSchema,
		response: DodoPaymentFailedEventSchema,
	},
	'subscriptions.active': {
		description: 'A Dodo subscription became active',
		payload: DodoSubscriptionActiveEventSchema,
		response: DodoSubscriptionActiveEventSchema,
	},
	'subscriptions.cancelled': {
		description: 'A Dodo subscription was cancelled',
		payload: DodoSubscriptionCancelledEventSchema,
		response: DodoSubscriptionCancelledEventSchema,
	},
	'refunds.succeeded': {
		description: 'A Dodo refund succeeded',
		payload: DodoRefundSucceededEventSchema,
		response: DodoRefundSucceededEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof dodoPaymentsWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const dodoPaymentsEndpointMeta = {
	'payments.create': {
		riskLevel: 'write',
		description: 'Create a Dodo payment',
	},
	'payments.get': {
		riskLevel: 'read',
		description: 'Fetch a Dodo payment by ID',
	},
	'payments.list': {
		riskLevel: 'read',
		description: 'List Dodo payments',
	},
	'refunds.create': {
		riskLevel: 'write',
		description: 'Create a refund for a Dodo payment',
	},
	'customers.create': {
		riskLevel: 'write',
		description: 'Create a Dodo customer',
	},
	'customers.get': {
		riskLevel: 'read',
		description: 'Fetch a Dodo customer by ID',
	},
	'subscriptions.create': {
		riskLevel: 'write',
		description: 'Create a Dodo subscription',
	},
	'subscriptions.get': {
		riskLevel: 'read',
		description: 'Fetch a Dodo subscription by ID',
	},
	'subscriptions.cancel': {
		riskLevel: 'write',
		description: 'Cancel a Dodo subscription',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof dodoPaymentsEndpointsNested
>;

export const dodoPaymentsAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
} as const;

export type BaseDodoPaymentsPlugin<T extends DodoPaymentsPluginOptions> =
	CorsairPlugin<
		'dodopayments',
		typeof DodoPaymentsSchema,
		typeof dodoPaymentsEndpointsNested,
		typeof dodoPaymentsWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalDodoPaymentsPlugin =
	BaseDodoPaymentsPlugin<DodoPaymentsPluginOptions>;

export type ExternalDodoPaymentsPlugin<T extends DodoPaymentsPluginOptions> =
	BaseDodoPaymentsPlugin<T>;

export function dodopayments<const T extends DodoPaymentsPluginOptions>(
	incomingOptions: DodoPaymentsPluginOptions &
		T = {} as DodoPaymentsPluginOptions & T,
): ExternalDodoPaymentsPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'dodopayments',
		schema: DodoPaymentsSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: dodoPaymentsEndpointsNested,
		webhooks: dodoPaymentsWebhooksNested,
		endpointMeta: dodoPaymentsEndpointMeta,
		endpointSchemas: dodoPaymentsEndpointSchemas,
		webhookSchemas: dodoPaymentsWebhookSchemas,
		// Dodo webhooks include webhook-id/-signature/-timestamp headers and a JSON body
		// with business_id, type, and timestamp fields.
		// https://docs.dodopayments.com/developer-resources/webhooks#request-body
		pluginWebhookMatcher: (request) => {
			if (
				!('webhook-id' in request.headers) ||
				!('webhook-signature' in request.headers) ||
				!('webhook-timestamp' in request.headers)
			)
				return false;

			let body: Record<string, unknown>;
			try {
				body =
					typeof request.body === 'string'
						? JSON.parse(request.body)
						: (request.body ?? {});
			} catch {
				return false;
			}

			return (
				typeof body === 'object' &&
				body !== null &&
				typeof body.business_id === 'string' &&
				typeof body.type === 'string' &&
				typeof body.timestamp === 'string'
			);
		},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: DodoPaymentsKeyBuilderContext, source) => {
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

			return '';
		},
	} satisfies InternalDodoPaymentsPlugin;
}

export type {
	CustomersCreateInput,
	CustomersCreateResponse,
	CustomersGetInput,
	CustomersGetResponse,
	DodoPaymentsEndpointInputs,
	DodoPaymentsEndpointOutputs,
	PaymentsCreateInput,
	PaymentsCreateResponse,
	PaymentsGetInput,
	PaymentsGetResponse,
	PaymentsListInput,
	PaymentsListResponse,
	RefundsCreateInput,
	RefundsCreateResponse,
	SubscriptionsCancelInput,
	SubscriptionsCancelResponse,
	SubscriptionsCreateInput,
	SubscriptionsCreateResponse,
	SubscriptionsGetInput,
	SubscriptionsGetResponse,
} from './endpoints/types';

export type {
	DodoPaymentFailedEvent,
	DodoPaymentSucceededEvent,
	DodoPaymentsWebhookOutputs,
	DodoRefundSucceededEvent,
	DodoSubscriptionActiveEvent,
	DodoSubscriptionCancelledEvent,
} from './webhooks/types';
