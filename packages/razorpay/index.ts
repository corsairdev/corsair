import type {
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
} from 'corsair/core';
import type { AuthTypes } from 'corsair/core';
import { Orders, Payments, Refunds } from './endpoints';
import type {
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
import {
	RazorpayEndpointInputSchemas,
	RazorpayEndpointOutputSchemas,
} from './endpoints/types';
import type { ExampleEvent, RazorpayWebhookOutputs } from './webhooks/types';
import { ExampleWebhooks } from './webhooks';
import { RazorpaySchema } from './schema';
import { errorHandlers } from './error-handlers';

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
        RazorpayPluginOptions,
        undefined,
        typeof razorpayAuthConfig
>;

 export type RazorpayKeyBuilderContext = KeyBuilderContext<
        RazorpayPluginOptions,
	 typeof razorpayAuthConfig
>;

export type RazorpayBoundEndpoints = BindEndpoints<typeof razorpayEndpointsNested>;

type RazorpayEndpoint<K extends keyof RazorpayEndpointOutputs, Input> =
	CorsairEndpoint<RazorpayContext, Input, RazorpayEndpointOutputs[K]>;

export type RazorpayEndpoints = {
	ordersCreate: RazorpayEndpoint<'ordersCreate', OrdersCreateInput>;
	ordersGet: RazorpayEndpoint<'ordersGet', OrdersGetInput>;
	paymentsGet: RazorpayEndpoint<'paymentsGet', PaymentsGetInput>;
	paymentsList: RazorpayEndpoint<'paymentsList', PaymentsListInput>;
	refundsCreate: RazorpayEndpoint<'refundsCreate', RefundsCreateInput>;
};

type RazorpayWebhook<
	K extends keyof RazorpayWebhookOutputs,
	TEvent,
> = CorsairWebhook<RazorpayContext, TEvent, RazorpayWebhookOutputs[K]>;

export type RazorpayWebhooks = {
	example: RazorpayWebhook<'example', ExampleEvent>;
};

export type RazorpayBoundWebhooks = BindWebhooks<RazorpayWebhooks>;

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
} as const;

const razorpayWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
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
} as const satisfies RequiredPluginEndpointSchemas<typeof razorpayEndpointsNested>;

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
} as const satisfies RequiredPluginEndpointMeta<typeof razorpayEndpointsNested>;

export const razorpayAuthConfig = {
	api_key: {
		account: ['key_id', 'key_secret'] as const,
	},
} as const satisfies PluginAuthConfig;

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
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			return 'x-razorpay-signature' in headers;
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
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const keyId = await ctx.keys.get_key_id();
				const keySecret = await ctx.keys.get_key_secret();

				if (!keyId || !keySecret) {
					return '';
				}

				return `${keyId}:${keySecret}`;
			}

			return '';
		},
	} satisfies InternalRazorpayPlugin;
}

export type { ExampleEvent, RazorpayWebhookOutputs } from './webhooks/types';

export type {
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
