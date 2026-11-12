import type {
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
import { forwardGeocode, reverseGeocode } from './endpoints';
import type {
	GeokeoEndpointInputs,
	GeokeoEndpointOutputs,
} from './endpoints/types';
import {
	GeokeoEndpointInputSchemas,
	GeokeoEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { GeokeoSchema } from './schema';

export type GeokeoPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** The Geokeo API key. */
	key?: string;
	hooks?: InternalGeokeoPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof geokeoEndpointsNested>;
};

export type GeokeoContext = CorsairPluginContext<
	typeof GeokeoSchema,
	GeokeoPluginOptions
>;

export type GeokeoKeyBuilderContext = KeyBuilderContext<GeokeoPluginOptions>;

export type GeokeoBoundEndpoints = BindEndpoints<typeof geokeoEndpointsNested>;

type GeokeoEndpoint<K extends keyof GeokeoEndpointOutputs> = CorsairEndpoint<
	GeokeoContext,
	GeokeoEndpointInputs[K],
	GeokeoEndpointOutputs[K]
>;

export type GeokeoEndpoints = {
	geocode: {
		forward: GeokeoEndpoint<'forwardGeocode'>;
		reverse: GeokeoEndpoint<'reverseGeocode'>;
	};
};

const geokeoEndpointsNested = {
	geocode: {
		forward: forwardGeocode,
		reverse: reverseGeocode,
	},
} as const;

export const geokeoEndpointSchemas = {
	'geocode.forward': {
		input: GeokeoEndpointInputSchemas.forwardGeocode,
		output: GeokeoEndpointOutputSchemas.forwardGeocode,
	},
	'geocode.reverse': {
		input: GeokeoEndpointInputSchemas.reverseGeocode,
		output: GeokeoEndpointOutputSchemas.reverseGeocode,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof geokeoEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const geokeoEndpointMeta = {
	'geocode.forward': {
		riskLevel: 'read',
		description:
			'Turn an address or place name into coordinates, a formatted address and its components, with the OpenStreetMap class and type of the match',
	},
	'geocode.reverse': {
		riskLevel: 'read',
		description:
			'Turn a latitude and longitude into the places nearest it, each with its address, its components and how far away it is',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof geokeoEndpointsNested>;

/**
 * Geokeo takes its key as the `api` query parameter. There is no keyless mode,
 * so a call with neither an option nor a stored key is refused here rather than
 * sent and answered `INVALID_REQUEST`.
 */
export const geokeoAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseGeokeoPlugin<T extends GeokeoPluginOptions> = CorsairPlugin<
	'geokeo',
	typeof GeokeoSchema,
	typeof geokeoEndpointsNested,
	{},
	T,
	typeof defaultAuthType,
	typeof geokeoAuthConfig
>;

export type InternalGeokeoPlugin = BaseGeokeoPlugin<GeokeoPluginOptions>;

export type ExternalGeokeoPlugin<T extends GeokeoPluginOptions> =
	BaseGeokeoPlugin<T>;

export function geokeo<const T extends GeokeoPluginOptions>(
	incomingOptions: GeokeoPluginOptions & T = {} as GeokeoPluginOptions & T,
): ExternalGeokeoPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'geokeo',
		schema: GeokeoSchema,
		options,
		hooks: options.hooks,
		endpoints: geokeoEndpointsNested,
		webhooks: {},
		authConfig: geokeoAuthConfig,
		endpointMeta: geokeoEndpointMeta,
		endpointSchemas: geokeoEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: GeokeoKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			// There are no webhooks, and Geokeo has no keyless mode.
			throw new AuthMissingError('geokeo', ctx.authType ?? 'api_key');
		},
	} satisfies InternalGeokeoPlugin;
}

export { GEOKEO_STATUS, GeokeoAPIError } from './client';
export type {
	GeokeoAddressComponents,
	GeokeoEndpointInputs,
	GeokeoEndpointOutputs,
	GeokeoForwardGeocodeInput,
	GeokeoGeocodeResponse,
	GeokeoResult,
	GeokeoReverseGeocodeInput,
} from './endpoints/types';
export {
	parseCoordinate,
	parseDistanceKm,
} from './endpoints/types';
