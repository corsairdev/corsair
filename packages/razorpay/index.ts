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
import { Customers, Orders, Payments, Refunds } from './endpoints';
import type {
	CustomersCreateInput,
	CustomersGetInput,
	OrdersCreateInput,
	OrdersGetInput,
	PaymentsGetInput,
	PaymentsListInput,
	RazorpayEndpointOutputs,
	RefundsCreateInput,
} from './endpoints/types';
import {
	RazorpayEndpointInputSchemas,
	RazorpayEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { RazorpaySchema } from './schema';
import { OrderWebhooks, PaymentWebhooks, RefundWebhooks } from './webhooks';
import type {
	RazorpayOrderPaidEvent,
	RazorpayPaymentCapturedEvent,
	RazorpayPaymentFailedEvent,
	RazorpayRefundProcessedEvent,
	RazorpayWebhookOutputs,
} from './webhooks/types';
import {
	RazorpayOrderPaidEventSchema,
	RazorpayPaymentCapturedEventSchema,
	RazorpayPaymentFailedEventSchema,
	RazorpayRefundProcessedEventSchema,
} from './webhooks/types';

export type RazorpayPluginOptions = {
	authType?: PickAuth<'api_key'>;
	keyId?: string;
	keySecret?: string;
	webhookSecret?: string;
	hooks?: InternalRazorpayPlugin['hooks'];
	webhookHooks?: InternalRazorpayPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof razorpayEndpointsNested>;
};

export type RazorpayContext = CorsairPluginContext<
	typeof RazorpaySchema,
	RazorpayPluginOptions
>;

export type RazorpayKeyBuilderContext =
	KeyBuilderContext<RazorpayPluginOptions>;

export type RazorpayBoundEndpoints = BindEndpoints<
	typeof razorpayEndpointsNested
>;

type RazorpayEndpoint<
	K extends keyof RazorpayEndpointOutputs,
	Input,
> = CorsairEndpoint<RazorpayContext, Input, RazorpayEndpointOutputs[K]>;

export type RazorpayEndpoints = {
	ordersCreate: RazorpayEndpoint<'ordersCreate', OrdersCreateInput>;
	ordersGet: RazorpayEndpoint<'ordersGet', OrdersGetInput>;
	paymentsGet: RazorpayEndpoint<'paymentsGet', PaymentsGetInput>;
	paymentsList: RazorpayEndpoint<'paymentsList', PaymentsListInput>;
	refundsCreate: RazorpayEndpoint<'refundsCreate', RefundsCreateInput>;
	customersCreate: RazorpayEndpoint<'customersCreate', CustomersCreateInput>;
	customersGet: RazorpayEndpoint<'customersGet', CustomersGetInput>;
};

type RazorpayWebhook<
	K extends keyof RazorpayWebhookOutputs,
	TEvent,
> = CorsairWebhook<RazorpayContext, TEvent, RazorpayWebhookOutputs[K]>;

export type RazorpayWebhooks = {
	paymentCaptured: RazorpayWebhook<
		'paymentCaptured',
		RazorpayPaymentCapturedEvent
	>;
	paymentFailed: RazorpayWebhook<'paymentFailed', RazorpayPaymentFailedEvent>;
	orderPaid: RazorpayWebhook<'orderPaid', RazorpayOrderPaidEvent>;
	refundProcessed: RazorpayWebhook<
		'refundProcessed',
		RazorpayRefundProcessedEvent
	>;
};

export type RazorpayBoundWebhooks = BindWebhooks<typeof razorpayWebhooksNested>;

const razorpayEndpointsNested = {
	orders: {
		create: Orders.create,
		get: Orders.get,
	},
	payments: {
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
} as const;

const razorpayWebhooksNested = {
	payments: {
		captured: PaymentWebhooks.captured,
		failed: PaymentWebhooks.failed,
	},
	orders: {
		paid: OrderWebhooks.paid,
	},
	refunds: {
		processed: RefundWebhooks.processed,
	},
} as const;

export const razorpayEndpointSchemas = {
	'orders.create': {
		input: RazorpayEndpointInputSchemas.ordersCreate,
		output: RazorpayEndpointOutputSchemas.ordersCreate,
	},
	'orders.get': {
		input: RazorpayEndpointInputSchemas.ordersGet,
		output: RazorpayEndpointOutputSchemas.ordersGet,
	},
	'payments.get': {
		input: RazorpayEndpointInputSchemas.paymentsGet,
		output: RazorpayEndpointOutputSchemas.paymentsGet,
	},
	'payments.list': {
		input: RazorpayEndpointInputSchemas.paymentsList,
		output: RazorpayEndpointOutputSchemas.paymentsList,
	},
	'refunds.create': {
		input: RazorpayEndpointInputSchemas.refundsCreate,
		output: RazorpayEndpointOutputSchemas.refundsCreate,
	},
	'customers.create': {
		input: RazorpayEndpointInputSchemas.customersCreate,
		output: RazorpayEndpointOutputSchemas.customersCreate,
	},
	'customers.get': {
		input: RazorpayEndpointInputSchemas.customersGet,
		output: RazorpayEndpointOutputSchemas.customersGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof razorpayEndpointsNested
>;

const razorpayWebhookSchemas = {
	'payments.captured': {
		description: 'A Razorpay payment was captured',
		payload: RazorpayPaymentCapturedEventSchema,
		response: RazorpayPaymentCapturedEventSchema,
	},
	'payments.failed': {
		description: 'A Razorpay payment failed',
		payload: RazorpayPaymentFailedEventSchema,
		response: RazorpayPaymentFailedEventSchema,
	},
	'orders.paid': {
		description: 'A Razorpay order was paid',
		payload: RazorpayOrderPaidEventSchema,
		response: RazorpayOrderPaidEventSchema,
	},
	'refunds.processed': {
		description: 'A Razorpay refund was processed',
		payload: RazorpayRefundProcessedEventSchema,
		response: RazorpayRefundProcessedEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof razorpayWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const razorpayEndpointMeta = {
	'orders.create': {
		riskLevel: 'write',
		description: 'Create a Razorpay order',
	},
	'orders.get': {
		riskLevel: 'read',
		description: 'Fetch a Razorpay order by ID',
	},
	'payments.get': {
		riskLevel: 'read',
		description: 'Fetch a Razorpay payment by ID',
	},
	'payments.list': {
		riskLevel: 'read',
		description: 'List Razorpay payments',
	},
	'refunds.create': {
		riskLevel: 'write',
		description: 'Create a refund for a Razorpay payment',
	},
	'customers.create': {
		riskLevel: 'write',
		description: 'Create a Razorpay customer',
	},
	'customers.get': {
		riskLevel: 'read',
		description: 'Fetch a Razorpay customer by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof razorpayEndpointsNested>;

export type BaseRazorpayPlugin<T extends RazorpayPluginOptions> = CorsairPlugin<
	'razorpay',
	typeof RazorpaySchema,
	typeof razorpayEndpointsNested,
	typeof razorpayWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalRazorpayPlugin = BaseRazorpayPlugin<RazorpayPluginOptions>;

export type ExternalRazorpayPlugin<T extends RazorpayPluginOptions> =
	BaseRazorpayPlugin<T>;

export function razorpay<const T extends RazorpayPluginOptions>(
	incomingOptions: RazorpayPluginOptions & T = {} as RazorpayPluginOptions & T,
): ExternalRazorpayPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'razorpay',
		schema: RazorpaySchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: razorpayEndpointsNested,
		webhooks: razorpayWebhooksNested,
		endpointMeta: razorpayEndpointMeta,
		endpointSchemas: razorpayEndpointSchemas,
		webhookSchemas: razorpayWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			return 'x-razorpay-signature' in request.headers;
		},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: RazorpayKeyBuilderContext, source) => {
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature();
				return res ?? '';
			}

			if (source === 'endpoint' && options.keyId && options.keySecret) {
				return `${options.keyId}:${options.keySecret}`;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalRazorpayPlugin;
}

export type {
	CustomersCreateInput,
	CustomersCreateResponse,
	CustomersGetInput,
	CustomersGetResponse,
	OrdersCreateInput,
	OrdersCreateResponse,
	OrdersGetInput,
	OrdersGetResponse,
	PaymentsGetInput,
	PaymentsGetResponse,
	PaymentsListInput,
	PaymentsListResponse,
	RazorpayEndpointInputs,
	RazorpayEndpointOutputs,
	RefundsCreateInput,
	RefundsCreateResponse,
} from './endpoints/types';
export type {
	RazorpayOrderPaidEvent,
	RazorpayPaymentCapturedEvent,
	RazorpayPaymentFailedEvent,
	RazorpayRefundProcessedEvent,
	RazorpayWebhookOutputs,
} from './webhooks/types';
export { createRazorpayMatch } from './webhooks/types';
