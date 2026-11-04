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
import { Licenses, Products, Sales, Subscribers } from './endpoints';
import type {
	GumroadEndpointInputs,
	GumroadEndpointOutputs,
} from './endpoints/types';
import {
	GumroadEndpointInputSchemas,
	GumroadEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { GumroadSchema } from './schema';

export type GumroadPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalGumroadPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof gumroadEndpointsNested>;
};

export type GumroadContext = CorsairPluginContext<
	typeof GumroadSchema,
	GumroadPluginOptions
>;

export type GumroadKeyBuilderContext = KeyBuilderContext<GumroadPluginOptions>;

export type GumroadBoundEndpoints = BindEndpoints<
	typeof gumroadEndpointsNested
>;

type GumroadEndpoint<K extends keyof GumroadEndpointOutputs> = CorsairEndpoint<
	GumroadContext,
	GumroadEndpointInputs[K],
	GumroadEndpointOutputs[K]
>;

export type GumroadEndpoints = {
	productsList: GumroadEndpoint<'productsList'>;
	productsGet: GumroadEndpoint<'productsGet'>;
	salesList: GumroadEndpoint<'salesList'>;
	salesGet: GumroadEndpoint<'salesGet'>;
	subscribersList: GumroadEndpoint<'subscribersList'>;
	licensesVerify: GumroadEndpoint<'licensesVerify'>;
};

const gumroadEndpointsNested = {
	products: {
		list: Products.list,
		get: Products.get,
	},
	sales: {
		list: Sales.list,
		get: Sales.get,
	},
	subscribers: {
		list: Subscribers.list,
	},
	licenses: {
		verify: Licenses.verify,
	},
} as const;

export const gumroadEndpointSchemas = {
	'products.list': {
		input: GumroadEndpointInputSchemas.productsList,
		output: GumroadEndpointOutputSchemas.productsList,
	},
	'products.get': {
		input: GumroadEndpointInputSchemas.productsGet,
		output: GumroadEndpointOutputSchemas.productsGet,
	},
	'sales.list': {
		input: GumroadEndpointInputSchemas.salesList,
		output: GumroadEndpointOutputSchemas.salesList,
	},
	'sales.get': {
		input: GumroadEndpointInputSchemas.salesGet,
		output: GumroadEndpointOutputSchemas.salesGet,
	},
	'subscribers.list': {
		input: GumroadEndpointInputSchemas.subscribersList,
		output: GumroadEndpointOutputSchemas.subscribersList,
	},
	'licenses.verify': {
		input: GumroadEndpointInputSchemas.licensesVerify,
		output: GumroadEndpointOutputSchemas.licensesVerify,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof gumroadEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const gumroadEndpointMeta = {
	'products.list': {
		riskLevel: 'read',
		description:
			"List the authenticated user's Gumroad products with price, publication state and sales counts",
	},
	'products.get': {
		riskLevel: 'read',
		description:
			'Get one product by id, including description, price, tags and purchasing-power-parity prices',
	},
	'sales.list': {
		riskLevel: 'read',
		description:
			'List successful sales, filterable by date range, product, buyer email, order id, name or license key',
	},
	'sales.get': {
		riskLevel: 'read',
		description:
			'Get one sale by id with price, fees, taxes, refund and chargeback state',
	},
	'subscribers.list': {
		riskLevel: 'read',
		description:
			"List one product's subscribers with status, recurrence and license key",
	},
	'licenses.verify': {
		riskLevel: 'write',
		description:
			'Verify a license key against a product and read its purchase; increments the license use counter unless increment_uses_count is "false"',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof gumroadEndpointsNested>;

export type BaseGumroadPlugin<T extends GumroadPluginOptions> = CorsairPlugin<
	'gumroad',
	typeof GumroadSchema,
	typeof gumroadEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalGumroadPlugin = BaseGumroadPlugin<GumroadPluginOptions>;

export type ExternalGumroadPlugin<T extends GumroadPluginOptions> =
	BaseGumroadPlugin<T>;

// Handlers match in key order and DEFAULT matches everything, so it stays
// last even when the caller adds or overrides handlers.
function mergeErrorHandlers(
	builtin: CorsairErrorHandler,
	user: CorsairErrorHandler | undefined,
): CorsairErrorHandler {
	if (!user) return builtin;
	const { DEFAULT: builtinDefault, ...builtinRest } = builtin;
	const { DEFAULT: userDefault, ...userRest } = user;
	const fallback = userDefault ?? builtinDefault;
	return fallback
		? { ...builtinRest, ...userRest, DEFAULT: fallback }
		: { ...builtinRest, ...userRest };
}

export function gumroad<const T extends GumroadPluginOptions>(
	incomingOptions: GumroadPluginOptions & T = {} as GumroadPluginOptions & T,
): ExternalGumroadPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'gumroad',
		schema: GumroadSchema,
		options: options,
		hooks: options.hooks,
		endpoints: gumroadEndpointsNested,
		webhooks: {},
		endpointMeta: gumroadEndpointMeta,
		endpointSchemas: gumroadEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: GumroadKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('gumroad', ctx.authType ?? 'api_key');
		},
	} satisfies InternalGumroadPlugin;
}

export type { GumroadForm, GumroadQuery } from './client';
export { GumroadAPIError } from './client';
export type {
	GumroadEndpointInputs,
	GumroadEndpointOutputs,
	GumroadProduct,
	GumroadPurchase,
	GumroadSale,
	GumroadSubscriber,
	LicensesVerifyInput,
	LicensesVerifyResponse,
	ProductsGetInput,
	ProductsGetResponse,
	ProductsListInput,
	ProductsListResponse,
	SalesGetInput,
	SalesGetResponse,
	SalesListInput,
	SalesListResponse,
	SubscribersListInput,
	SubscribersListResponse,
} from './endpoints/types';
