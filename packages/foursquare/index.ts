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
import { PlacesEndpoints } from './endpoints';
import type {
	FoursquareEndpointInputs,
	FoursquareEndpointOutputs,
} from './endpoints/types';
import {
	FoursquareEndpointInputSchemas,
	FoursquareEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { FoursquareSchema } from './schema';

export type FoursquarePluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalFoursquarePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof foursquareEndpointsNested>;
};

export type FoursquareContext = CorsairPluginContext<
	typeof FoursquareSchema,
	FoursquarePluginOptions,
	undefined,
	typeof foursquareAuthConfig
>;

export type FoursquareKeyBuilderContext = KeyBuilderContext<
	FoursquarePluginOptions,
	typeof foursquareAuthConfig
>;

export type FoursquareBoundEndpoints = BindEndpoints<
	typeof foursquareEndpointsNested
>;

type FoursquareEndpoint<K extends keyof FoursquareEndpointOutputs> =
	CorsairEndpoint<
		FoursquareContext,
		FoursquareEndpointInputs[K],
		FoursquareEndpointOutputs[K]
	>;

export type FoursquareEndpoints = {
	placesSearch: FoursquareEndpoint<'placesSearch'>;
	placesGet: FoursquareEndpoint<'placesGet'>;
	placesAutocomplete: FoursquareEndpoint<'placesAutocomplete'>;
	placesTips: FoursquareEndpoint<'placesTips'>;
	placesPhotos: FoursquareEndpoint<'placesPhotos'>;
	placesMatch: FoursquareEndpoint<'placesMatch'>;
};

const foursquareEndpointsNested = {
	places: PlacesEndpoints,
} as const;

export const foursquareEndpointSchemas = {
	'places.search': {
		input: FoursquareEndpointInputSchemas.placesSearch,
		output: FoursquareEndpointOutputSchemas.placesSearch,
	},
	'places.get': {
		input: FoursquareEndpointInputSchemas.placesGet,
		output: FoursquareEndpointOutputSchemas.placesGet,
	},
	'places.autocomplete': {
		input: FoursquareEndpointInputSchemas.placesAutocomplete,
		output: FoursquareEndpointOutputSchemas.placesAutocomplete,
	},
	'places.tips': {
		input: FoursquareEndpointInputSchemas.placesTips,
		output: FoursquareEndpointOutputSchemas.placesTips,
	},
	'places.photos': {
		input: FoursquareEndpointInputSchemas.placesPhotos,
		output: FoursquareEndpointOutputSchemas.placesPhotos,
	},
	'places.match': {
		input: FoursquareEndpointInputSchemas.placesMatch,
		output: FoursquareEndpointOutputSchemas.placesMatch,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof foursquareEndpointsNested
>;

const defaultAuthType: 'api_key' = 'api_key';

/**
 * A Service Key is a single static string sent as a Bearer token, so this is
 * `api_key` auth with no extra fields. Managed Users and 3rd-party auth are
 * separate flows and are not wrapped.
 */
export const foursquareAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

const foursquareEndpointMeta = {
	'places.search': {
		riskLevel: 'read',
		description:
			'Search the Foursquare places database by text, category or location',
	},
	'places.get': {
		riskLevel: 'read',
		description: 'Get one place by its fsq_place_id, with all its details',
	},
	'places.autocomplete': {
		riskLevel: 'read',
		description: 'Suggest places, searches or geos for a partial query',
	},
	'places.tips': {
		riskLevel: 'read',
		description: 'List the user tips left on a place',
	},
	'places.photos': {
		riskLevel: 'read',
		description: 'List the photos attached to a place',
	},
	'places.match': {
		riskLevel: 'read',
		description:
			'Resolve a name and address to a Foursquare place, with a match score',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof foursquareEndpointsNested
>;

export type BaseFoursquarePlugin<T extends FoursquarePluginOptions> =
	CorsairPlugin<
		'foursquare',
		typeof FoursquareSchema,
		typeof foursquareEndpointsNested,
		Record<string, never>,
		T,
		typeof defaultAuthType,
		typeof foursquareAuthConfig
	>;

export type InternalFoursquarePlugin =
	BaseFoursquarePlugin<FoursquarePluginOptions>;

export type ExternalFoursquarePlugin<T extends FoursquarePluginOptions> =
	BaseFoursquarePlugin<T>;

export function foursquare<const T extends FoursquarePluginOptions>(
	incomingOptions: FoursquarePluginOptions & T = {} as FoursquarePluginOptions &
		T,
): ExternalFoursquarePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	} as FoursquarePluginOptions & T;
	return {
		id: 'foursquare',
		authConfig: foursquareAuthConfig,
		schema: FoursquareSchema,
		options,
		hooks: options.hooks,
		endpoints: foursquareEndpointsNested,
		webhooks: {},
		endpointMeta: foursquareEndpointMeta,
		endpointSchemas: foursquareEndpointSchemas,
		// Foursquare sends no inbound webhooks for the Places API.
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx, source) => {
			if (source !== 'endpoint') {
				throw new AuthMissingError('foursquare', 'api_key');
			}
			if (options.key) return options.key;
			const stored = await ctx.keys.get_api_key();
			if (stored) return stored;
			throw new AuthMissingError('foursquare', 'api_key');
		},
	} satisfies InternalFoursquarePlugin;
}

export type {
	FoursquareAutocompleteResult,
	FoursquareEndpointInputs,
	FoursquareEndpointOutputs,
	FoursquarePhoto,
	FoursquarePlace,
	FoursquareTip,
	PlacesAutocompleteInput,
	PlacesAutocompleteResponse,
	PlacesGetInput,
	PlacesGetResponse,
	PlacesMatchInput,
	PlacesMatchResponse,
	PlacesPhotosInput,
	PlacesPhotosResponse,
	PlacesSearchInput,
	PlacesSearchResponse,
	PlacesTipsInput,
	PlacesTipsResponse,
} from './endpoints/types';
