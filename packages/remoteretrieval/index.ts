import type {
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import * as Orders from './endpoints';
import type {
	RemoteRetrievalEndpointInputs,
	RemoteRetrievalEndpointOutputs,
} from './endpoints/types';
import {
	RemoteRetrievalEndpointInputSchemas,
	RemoteRetrievalEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { RemoteRetrievalSchema } from './schema';

export type RemoteRetrievalPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalRemoteRetrievalPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof remoteRetrievalEndpointsNested>;
};

export type RemoteRetrievalContext = CorsairPluginContext<
	typeof RemoteRetrievalSchema,
	RemoteRetrievalPluginOptions
>;

export type RemoteRetrievalKeyBuilderContext =
	KeyBuilderContext<RemoteRetrievalPluginOptions>;

export type RemoteRetrievalBoundEndpoints = BindEndpoints<
	typeof remoteRetrievalEndpointsNested
>;

type RemoteRetrievalEndpoint<K extends keyof RemoteRetrievalEndpointOutputs> =
	CorsairEndpoint<
		RemoteRetrievalContext,
		RemoteRetrievalEndpointInputs[K],
		RemoteRetrievalEndpointOutputs[K]
	>;

export type RemoteRetrievalEndpoints = {
	validate: RemoteRetrievalEndpoint<'validate'>;
	ordersCreate: RemoteRetrievalEndpoint<'ordersCreate'>;
	pendingOrders: RemoteRetrievalEndpoint<'pendingOrders'>;
	newOrders: RemoteRetrievalEndpoint<'newOrders'>;
	inprogressOrders: RemoteRetrievalEndpoint<'inprogressOrders'>;
	ordersList: RemoteRetrievalEndpoint<'ordersList'>;
	orderGet: RemoteRetrievalEndpoint<'orderGet'>;
	companyGet: RemoteRetrievalEndpoint<'companyGet'>;
	prices: RemoteRetrievalEndpoint<'prices'>;
};

const remoteRetrievalEndpointsNested = {
	validate: Orders.validate,
	orders: {
		create: Orders.create,
		pending: Orders.pending,
		new: Orders.newOrders,
		inprogress: Orders.inprogress,
		list: Orders.list,
		get: Orders.get,
	},
	company: {
		get: Orders.company,
	},
	prices: Orders.prices,
} as const;

export const remoteRetrievalEndpointSchemas = {
	validate: {
		input: RemoteRetrievalEndpointInputSchemas.validate,
		output: RemoteRetrievalEndpointOutputSchemas.validate,
	},
	'orders.create': {
		input: RemoteRetrievalEndpointInputSchemas.ordersCreate,
		output: RemoteRetrievalEndpointOutputSchemas.ordersCreate,
	},
	'orders.pending': {
		input: RemoteRetrievalEndpointInputSchemas.pendingOrders,
		output: RemoteRetrievalEndpointOutputSchemas.pendingOrders,
	},
	'orders.new': {
		input: RemoteRetrievalEndpointInputSchemas.newOrders,
		output: RemoteRetrievalEndpointOutputSchemas.newOrders,
	},
	'orders.inprogress': {
		input: RemoteRetrievalEndpointInputSchemas.inprogressOrders,
		output: RemoteRetrievalEndpointOutputSchemas.inprogressOrders,
	},
	'orders.list': {
		input: RemoteRetrievalEndpointInputSchemas.ordersList,
		output: RemoteRetrievalEndpointOutputSchemas.ordersList,
	},
	'orders.get': {
		input: RemoteRetrievalEndpointInputSchemas.orderGet,
		output: RemoteRetrievalEndpointOutputSchemas.orderGet,
	},
	'company.get': {
		input: RemoteRetrievalEndpointInputSchemas.companyGet,
		output: RemoteRetrievalEndpointOutputSchemas.companyGet,
	},
	prices: {
		input: RemoteRetrievalEndpointInputSchemas.prices,
		output: RemoteRetrievalEndpointOutputSchemas.prices,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof remoteRetrievalEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const remoteRetrievalEndpointMeta = {
	validate: {
		riskLevel: 'read',
		description:
			'Check that the API key works and read the account email it belongs to',
	},
	'orders.create': {
		riskLevel: 'write',
		description:
			'Create one or more equipment-return orders, booking a real box shipment to a named employee at a home address',
	},
	'orders.pending': {
		riskLevel: 'read',
		description:
			'List orders whose payment has not completed; they are on hold until it does',
	},
	'orders.new': {
		riskLevel: 'read',
		description:
			'List orders whose payment completed and which are ready to process',
	},
	'orders.inprogress': {
		riskLevel: 'read',
		description:
			'List orders whose return has started but whose device has not arrived yet, with both shipment legs',
	},
	'orders.list': {
		riskLevel: 'read',
		description:
			"List every order with its payment status and shipping status, paged by the response's own next link",
	},
	'orders.get': {
		riskLevel: 'read',
		description: 'Read one order by ID, taking it as the oid query parameter',
	},
	'company.get': {
		riskLevel: 'read',
		description:
			'Read the company record the key belongs to: name, address and creation date',
	},
	prices: {
		riskLevel: 'read',
		description:
			'Read the live per-device prices, including the Monitor_27 band for 24-to-27-inch displays',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof remoteRetrievalEndpointsNested
>;

export type BaseRemoteRetrievalPlugin<T extends RemoteRetrievalPluginOptions> =
	CorsairPlugin<
		'remoteretrieval',
		typeof RemoteRetrievalSchema,
		typeof remoteRetrievalEndpointsNested,
		{},
		T,
		typeof defaultAuthType
	>;

export type InternalRemoteRetrievalPlugin =
	BaseRemoteRetrievalPlugin<RemoteRetrievalPluginOptions>;

export type ExternalRemoteRetrievalPlugin<
	T extends RemoteRetrievalPluginOptions,
> = BaseRemoteRetrievalPlugin<T>;

export function remoteretrieval<const T extends RemoteRetrievalPluginOptions>(
	incomingOptions: RemoteRetrievalPluginOptions &
		T = {} as RemoteRetrievalPluginOptions & T,
): ExternalRemoteRetrievalPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'remoteretrieval',
		schema: RemoteRetrievalSchema,
		options: options,
		hooks: options.hooks,
		endpoints: remoteRetrievalEndpointsNested,
		webhooks: {},
		endpointMeta: remoteRetrievalEndpointMeta,
		endpointSchemas: remoteRetrievalEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: RemoteRetrievalKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('remoteretrieval', ctx.authType ?? 'api_key');
		},
	} satisfies InternalRemoteRetrievalPlugin;
}

export { RemoteRetrievalAPIError } from './client';

export type {
	CompanyGetResponse,
	OrderArrayResponse,
	OrderGetInput,
	OrderGetResponse,
	OrderListPageInput,
	OrdersCreateInput,
	OrdersCreateResponse,
	OrdersListInput,
	OrdersListResponse,
	PricesResponse,
	RemoteRetrievalCompanyInput,
	RemoteRetrievalEmployeeInput,
	RemoteRetrievalEndpointInputs,
	RemoteRetrievalEndpointOutputs,
	RemoteRetrievalNewEmployeeInput,
	RemoteRetrievalOrderInput,
	RemoteRetrievalOrderView,
	ValidateResponse,
} from './endpoints/types';
