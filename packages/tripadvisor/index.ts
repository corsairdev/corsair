import type {
	AuthTypes,
	BindEndpoints,
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
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { Catalog } from './endpoints';
import type {
	TripadvisorEndpointInputs,
	TripadvisorEndpointOutputs,
} from './endpoints/types';
import {
	TripadvisorEndpointInputSchemas,
	TripadvisorEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { TripadvisorSchema } from './schema';

export type TripadvisorPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalTripadvisorPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof tripadvisorEndpointsNested>;
};

export type TripadvisorContext = CorsairPluginContext<
	typeof TripadvisorSchema,
	TripadvisorPluginOptions
>;

export type TripadvisorKeyBuilderContext =
	KeyBuilderContext<TripadvisorPluginOptions>;

export type TripadvisorBoundEndpoints = BindEndpoints<
	typeof tripadvisorEndpointsNested
>;

type TripadvisorEndpoint<K extends keyof TripadvisorEndpointOutputs> =
	CorsairEndpoint<
		TripadvisorContext,
		TripadvisorEndpointInputs[K],
		TripadvisorEndpointOutputs[K]
	>;

export type TripadvisorEndpoints = {
	locationsNearby: TripadvisorEndpoint<'locationsNearby'>;
};

const tripadvisorEndpointsNested = {
	catalog: {
		locationsNearby: Catalog.locationsNearby,
	},
} as const;

const tripadvisorWebhooksNested = {} as const;

export const tripadvisorEndpointSchemas = {
	'catalog.locationsNearby': {
		input: TripadvisorEndpointInputSchemas.locationsNearby,
		output: TripadvisorEndpointOutputSchemas.locationsNearby,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof tripadvisorEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const tripadvisorEndpointMeta = {
	'catalog.locationsNearby': {
		riskLevel: 'read',
		description:
			'Search nearby Tripadvisor catalog locations by coordinates or location ID',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof tripadvisorEndpointsNested
>;

export const tripadvisorAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseTripadvisorPlugin<T extends TripadvisorPluginOptions> =
	CorsairPlugin<
		'tripadvisor',
		typeof TripadvisorSchema,
		typeof tripadvisorEndpointsNested,
		typeof tripadvisorWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalTripadvisorPlugin =
	BaseTripadvisorPlugin<TripadvisorPluginOptions>;

export type ExternalTripadvisorPlugin<T extends TripadvisorPluginOptions> =
	BaseTripadvisorPlugin<T>;

/** Creates a Tripadvisor plugin configured for API-key authentication. */
export function tripadvisor<const T extends TripadvisorPluginOptions>(
	incomingOptions: TripadvisorPluginOptions &
		T = {} as TripadvisorPluginOptions & T,
): ExternalTripadvisorPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'tripadvisor',
		authConfig: tripadvisorAuthConfig,
		schema: TripadvisorSchema,
		options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: tripadvisorEndpointsNested,
		webhooks: tripadvisorWebhooksNested,
		endpointMeta: tripadvisorEndpointMeta,
		endpointSchemas: tripadvisorEndpointSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: TripadvisorKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) return options.key;
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				if (key) return key;
			}
			throw new AuthMissingError('tripadvisor', 'api_key');
		},
	} satisfies InternalTripadvisorPlugin;
}

export type {
	LocationsNearbyInput,
	LocationsNearbyResponse,
	TripadvisorEndpointInputs,
	TripadvisorEndpointOutputs,
} from './endpoints/types';

export {
	LocationsNearbyInputSchema,
	LocationsNearbyResponseSchema,
} from './endpoints/types';
