import type {
	AuthTypes,
	CorsairErrorHandler,
	CorsairPlugin,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import type { NetLicensingContext } from './context';
import { listLicenses, listProducts } from './endpoints';
import {
	ListInputSchema,
	ListLicensesResponseSchema,
	ListProductsResponseSchema,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { NetLicensingSchema } from './schema';

export type { NetLicensingContext };

export type NetLicensingPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalNetLicensingPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof netLicensingEndpointsNested>;
};

export type NetLicensingKeyBuilderContext =
	KeyBuilderContext<NetLicensingPluginOptions>;

const netLicensingEndpointsNested = {
	licenses: { list: listLicenses },
	products: { list: listProducts },
} as const;

const netLicensingWebhooksNested = {} as const;

export const netLicensingEndpointSchemas = {
	'licenses.list': {
		input: ListInputSchema,
		output: ListLicensesResponseSchema,
	},
	'products.list': {
		input: ListInputSchema,
		output: ListProductsResponseSchema,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof netLicensingEndpointsNested
>;

const netLicensingEndpointMeta = {
	'licenses.list': {
		riskLevel: 'read',
		description: 'List NetLicensing licenses for the connected vendor.',
	},
	'products.list': {
		riskLevel: 'read',
		description: 'List NetLicensing products for the connected vendor.',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof netLicensingEndpointsNested
>;

const defaultAuthType = 'api_key' as const satisfies AuthTypes;

export const netLicensingAuthConfig = {
	api_key: {
		account: [] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseNetLicensingPlugin<T extends NetLicensingPluginOptions> =
	CorsairPlugin<
		'labs64netlicensing',
		typeof NetLicensingSchema,
		typeof netLicensingEndpointsNested,
		typeof netLicensingWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalNetLicensingPlugin =
	BaseNetLicensingPlugin<NetLicensingPluginOptions>;

export type ExternalNetLicensingPlugin<T extends NetLicensingPluginOptions> =
	BaseNetLicensingPlugin<T>;

export function labs64netlicensing<const T extends NetLicensingPluginOptions>(
	incomingOptions: NetLicensingPluginOptions &
		T = {} as NetLicensingPluginOptions & T,
): ExternalNetLicensingPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'labs64netlicensing',
		authConfig: netLicensingAuthConfig,
		schema: NetLicensingSchema,
		options,
		hooks: options.hooks,
		endpoints: netLicensingEndpointsNested,
		webhooks: netLicensingWebhooksNested,
		endpointMeta: netLicensingEndpointMeta,
		endpointSchemas: netLicensingEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: NetLicensingKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				return key ?? '';
			}
			return '';
		},
	} satisfies InternalNetLicensingPlugin;
}
