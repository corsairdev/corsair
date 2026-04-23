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
import {
	Customers,
	Orders,
    Payments,
    Payouts,
	Refunds,
	Settlements,
	Subscriptions,
} from './endpoints';
import type {
	CustomersCreateInput,
	CustomersGetInput,
	CustomersListInput,
	CustomersUpdateInput,
	OrdersCreateInput,
	OrdersGetInput,
	OrdersListInput,
	PaymentsCaptureInput,
	PaymentsGetInput,
    PaymentsListInput,
    PayoutsGetInput,
    PayoutsListInput,
    PayoutsCreateInput,
	RazorpayEndpointOutputs,
	RefundsCreateInput,
	RefundsGetInput,
	RefundsListInput,
	SettlementGetInput,
	SettlementsListInput,
	SubscriptionsCancelInput,
	SubscriptionsCreateInput,
	SubscriptionsGetInput,
	SubscriptionsListInput,
	SubscriptionsPauseInput,
	SubscriptionsResumeInput,
	SubscriptionsUpdateInput,
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
	ordersList: RazorpayEndpoint<'ordersList', OrdersListInput>;
	paymentsGet: RazorpayEndpoint<'paymentsGet', PaymentsGetInput>;
	paymentsList: RazorpayEndpoint<'paymentsList', PaymentsListInput>;
	paymentsCapture: RazorpayEndpoint<'paymentsCapture', PaymentsCaptureInput>;
	payoutsGet: RazorpayEndpoint<'payoutsGet', PayoutsGetInput>;
	payoutsList: RazorpayEndpoint<'payoutsList', PayoutsListInput>;
	payoutsCreate: RazorpayEndpoint<'payoutsCreate', PayoutsCreateInput>;
	refundsCreate: RazorpayEndpoint<'refundsCreate', RefundsCreateInput>;
	refundsGet: RazorpayEndpoint<'refundsGet', RefundsGetInput>;
	refundsList: RazorpayEndpoint<'refundsList', RefundsListInput>;
	customersCreate: RazorpayEndpoint<'customersCreate', CustomersCreateInput>;
	customersGet: RazorpayEndpoint<'customersGet', CustomersGetInput>;
	customersList: RazorpayEndpoint<'customersList', CustomersListInput>;
	customersUpdate: RazorpayEndpoint<'customersUpdate', CustomersUpdateInput>;
	settlementsList: RazorpayEndpoint<'settlementsList', SettlementsListInput>;
	settlementsGet: RazorpayEndpoint<'settlementsGet', SettlementGetInput>;
	subscriptionsList: RazorpayEndpoint<
		'subscriptionsList',
		SubscriptionsListInput
	>;
	subscriptionsGet: RazorpayEndpoint<'subscriptionsGet', SubscriptionsGetInput>;
	subscriptionsCreate: RazorpayEndpoint<
		'subscriptionsCreate',
		SubscriptionsCreateInput
	>;
	subscriptionsUpdate: RazorpayEndpoint<
		'subscriptionsUpdate',
		SubscriptionsUpdateInput
	>;
	subscriptionsCancel: RazorpayEndpoint<
		'subscriptionsCancel',
		SubscriptionsCancelInput
	>;
	subscriptionsPause: RazorpayEndpoint<
		'subscriptionsPause',
		SubscriptionsPauseInput
	>;
	subscriptionsResume: RazorpayEndpoint<
		'subscriptionsResume',
		SubscriptionsResumeInput
	>;
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
		list: Orders.list,
	},
	payments: {
		get: Payments.get,
		list: Payments.list,
		capture: Payments.capture,
    },
    payouts: {
		get: Payments.get,
		list: Payments.list,
		create: Payments.capture,
    },
	refunds: {
		create: Refunds.create,
		get: Refunds.get,
		list: Refunds.list,
	},
	customers: {
		create: Customers.create,
		get: Customers.get,
		list: Customers.list,
		update: Customers.update,
	},
	settlements: {
		list: Settlements.list,
		get: Settlements.get,
	},
	subscriptions: {
		list: Subscriptions.list,
		get: Subscriptions.get,
		create: Subscriptions.create,
		update: Subscriptions.update,
		cancel: Subscriptions.cancel,
		pause: Subscriptions.pause,
		resume: Subscriptions.resume,
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
	'orders.list': {
		input: RazorpayEndpointInputSchemas.ordersList,
		output: RazorpayEndpointOutputSchemas.ordersList,
	},
	'payments.get': {
		input: RazorpayEndpointInputSchemas.paymentsGet,
		output: RazorpayEndpointOutputSchemas.paymentsGet,
	},
	'payments.list': {
		input: RazorpayEndpointInputSchemas.paymentsList,
		output: RazorpayEndpointOutputSchemas.paymentsList,
	},
	'payments.capture': {
		input: RazorpayEndpointInputSchemas.paymentsCapture,
		output: RazorpayEndpointOutputSchemas.paymentsCapture,
    },
    'payouts.get': {
		input: RazorpayEndpointInputSchemas.payoutsGet,
		output: RazorpayEndpointOutputSchemas.payoutsGet,
	},
	'payouts.list': {
		input: RazorpayEndpointInputSchemas.payoutsList,
		output: RazorpayEndpointOutputSchemas.payoutsList,
	},
	'payouts.create': {
		input: RazorpayEndpointInputSchemas.payoutsCreate,
		output: RazorpayEndpointOutputSchemas.payoutsCreate,
	},
	'refunds.create': {
		input: RazorpayEndpointInputSchemas.refundsCreate,
		output: RazorpayEndpointOutputSchemas.refundsCreate,
	},
	'refunds.get': {
		input: RazorpayEndpointInputSchemas.refundsGet,
		output: RazorpayEndpointOutputSchemas.refundsGet,
	},
	'refunds.list': {
		input: RazorpayEndpointInputSchemas.refundsList,
		output: RazorpayEndpointOutputSchemas.refundsList,
	},
	'customers.create': {
		input: RazorpayEndpointInputSchemas.customersCreate,
		output: RazorpayEndpointOutputSchemas.customersCreate,
	},
	'customers.get': {
		input: RazorpayEndpointInputSchemas.customersGet,
		output: RazorpayEndpointOutputSchemas.customersGet,
	},
	'customers.list': {
		input: RazorpayEndpointInputSchemas.customersList,
		output: RazorpayEndpointOutputSchemas.customersList,
	},
	'customers.update': {
		input: RazorpayEndpointInputSchemas.customersUpdate,
		output: RazorpayEndpointOutputSchemas.customersUpdate,
	},
	'settlements.list': {
		input: RazorpayEndpointInputSchemas.settlementsList,
		output: RazorpayEndpointOutputSchemas.settlementsList,
	},
	'settlements.get': {
		input: RazorpayEndpointInputSchemas.settlementsGet,
		output: RazorpayEndpointOutputSchemas.settlementsGet,
	},
	'subscriptions.list': {
		input: RazorpayEndpointInputSchemas.subscriptionsList,
		output: RazorpayEndpointOutputSchemas.subscriptionsList,
	},
	'subscriptions.get': {
		input: RazorpayEndpointInputSchemas.subscriptionsGet,
		output: RazorpayEndpointOutputSchemas.subscriptionsGet,
	},
	'subscriptions.create': {
		input: RazorpayEndpointInputSchemas.subscriptionsCreate,
		output: RazorpayEndpointOutputSchemas.subscriptionsCreate,
	},
	'subscriptions.update': {
		input: RazorpayEndpointInputSchemas.subscriptionsUpdate,
		output: RazorpayEndpointOutputSchemas.subscriptionsUpdate,
	},
	'subscriptions.cancel': {
		input: RazorpayEndpointInputSchemas.subscriptionsCancel,
		output: RazorpayEndpointOutputSchemas.subscriptionsCancel,
	},
	'subscriptions.pause': {
		input: RazorpayEndpointInputSchemas.subscriptionsPause,
		output: RazorpayEndpointOutputSchemas.subscriptionsPause,
	},
	'subscriptions.resume': {
		input: RazorpayEndpointInputSchemas.subscriptionsResume,
		output: RazorpayEndpointOutputSchemas.subscriptionsResume,
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
	'orders.list': {
		riskLevel: 'read',
		description: 'List Razorpay orders',
	},
	'payments.get': {
		riskLevel: 'read',
		description: 'Fetch a Razorpay payment by ID',
	},
	'payments.list': {
		riskLevel: 'read',
		description: 'List Razorpay payments',
	},
	'payments.capture': {
		riskLevel: 'write',
		description: 'Capture an authorized Razorpay payment',
	},
	'payouts.get': {
		riskLevel: 'read',
		description: 'Fetch a Razorpay payout by ID',
	},
	'payouts.list': {
		riskLevel: 'read',
		description: 'List Razorpay payouts',
	},
	'payouts.create': {
		riskLevel: 'write',
		description: 'Create a Razorpay payout',
	},
	'refunds.create': {
		riskLevel: 'write',
		description: 'Create a refund for a Razorpay payment',
	},
	'refunds.get': {
		riskLevel: 'read',
		description: 'Fetch a specific refund for a Razorpay payment',
	},
	'refunds.list': {
		riskLevel: 'read',
		description: 'List refunds for a Razorpay payment',
	},
	'customers.create': {
		riskLevel: 'write',
		description: 'Create a Razorpay customer',
	},
	'customers.get': {
		riskLevel: 'read',
		description: 'Fetch a Razorpay customer by ID',
	},
	'customers.list': {
		riskLevel: 'read',
		description: 'List Razorpay customers',
	},
	'customers.update': {
		riskLevel: 'write',
		description: 'Update a Razorpay customer',
	},
	'settlements.list': {
		riskLevel: 'read',
		description: 'List Razorpay settlements',
	},
	'settlements.get': {
		riskLevel: 'read',
		description: 'Fetch a Razorpay settlement by ID',
	},
	'subscriptions.list': {
		riskLevel: 'read',
		description: 'List Razorpay subscriptions',
	},
	'subscriptions.get': {
		riskLevel: 'read',
		description: 'Fetch a Razorpay subscription by ID',
	},
	'subscriptions.create': {
		riskLevel: 'write',
		description: 'Create a Razorpay subscription',
	},
	'subscriptions.update': {
		riskLevel: 'write',
		description: 'Update a Razorpay subscription',
	},
	'subscriptions.cancel': {
		riskLevel: 'destructive',
		description: 'Cancel a Razorpay subscription [DESTRUCTIVE]',
		irreversible: true,
	},
	'subscriptions.pause': {
		riskLevel: 'write',
		description: 'Pause a Razorpay subscription',
	},
	'subscriptions.resume': {
		riskLevel: 'write',
		description: 'Resume a paused Razorpay subscription',
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
	CustomersListInput,
	CustomersListResponse,
	CustomersUpdateInput,
	CustomersUpdateResponse,
	OrdersCreateInput,
	OrdersCreateResponse,
	OrdersGetInput,
	OrdersGetResponse,
	OrdersListInput,
	OrdersListResponse,
	PaymentsCaptureInput,
	PaymentsCaptureResponse,
	PaymentsGetInput,
	PaymentsGetResponse,
	PaymentsListInput,
	PaymentsListResponse,
	PayoutsGetInput,
	PayoutsGetResponse,
	PayoutsListInput,
	PayoutsListResponse,
	PayoutsCreateInput,
	PayoutsCreateResponse,
	RazorpayEndpointInputs,
	RazorpayEndpointOutputs,
	RefundsCreateInput,
	RefundsCreateResponse,
	RefundsGetInput,
	RefundsGetResponse,
	RefundsListInput,
	RefundsListResponse,
	SettlementGetInput,
	SettlementsGetResponse,
	SettlementsListInput,
	SettlementsListResponse,
	SubscriptionsCancelInput,
	SubscriptionsCancelResponse,
	SubscriptionsCreateInput,
	SubscriptionsCreateResponse,
	SubscriptionsGetInput,
	SubscriptionsGetResponse,
	SubscriptionsListInput,
	SubscriptionsListResponse,
	SubscriptionsPauseInput,
	SubscriptionsPauseResponse,
	SubscriptionsResumeInput,
	SubscriptionsResumeResponse,
	SubscriptionsUpdateInput,
	SubscriptionsUpdateResponse,
} from './endpoints/types';
export type {
	RazorpayOrderPaidEvent,
	RazorpayPaymentCapturedEvent,
	RazorpayPaymentFailedEvent,
	RazorpayRefundProcessedEvent,
	RazorpayWebhookOutputs,
} from './webhooks/types';
export { createRazorpayMatch } from './webhooks/types';
