import type {
	AuthTypes,
	BindEndpoints,
	BindWebhooks,
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
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import {
	AerialEndpoints,
	GeocodingEndpoints,
	GeolocationEndpoints,
	PlacesEndpoints,
	RoutesEndpoints,
	TilesEndpoints,
} from './endpoints';
import type {
	GoogleMapsEndpointInputs,
	GoogleMapsEndpointOutputs,
} from './endpoints/types';
import {
	GoogleMapsEndpointInputSchemas,
	GoogleMapsEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { GoogleMapsSchema } from './schema';
import { resolveGoogleMapsOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchGoogleMapsTenantWebhook } from './webhooks/tenant-matcher';

export type GoogleMapsPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	hooks?: InternalGoogleMapsPlugin['hooks'];
	webhookHooks?: InternalGoogleMapsPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof googleMapsEndpointsNested>;
};

export type GoogleMapsContext = CorsairPluginContext<
	typeof GoogleMapsSchema,
	GoogleMapsPluginOptions
>;

export type GoogleMapsKeyBuilderContext =
	KeyBuilderContext<GoogleMapsPluginOptions>;

export type GoogleMapsBoundEndpoints = BindEndpoints<
	typeof googleMapsEndpointsNested
>;

type GoogleMapsEndpoint<K extends keyof GoogleMapsEndpointOutputs> =
	CorsairEndpoint<
		GoogleMapsContext,
		GoogleMapsEndpointInputs[K],
		GoogleMapsEndpointOutputs[K]
	>;

export type GoogleMapsEndpoints = {
	autocomplete: GoogleMapsEndpoint<'autocomplete'>;
	computeRouteMatrix: GoogleMapsEndpoint<'computeRouteMatrix'>;
	createTilesSession: GoogleMapsEndpoint<'createTilesSession'>;
	distanceMatrix: GoogleMapsEndpoint<'distanceMatrix'>;
	embedMap: GoogleMapsEndpoint<'embedMap'>;
	geocodeAddress: GoogleMapsEndpoint<'geocodeAddress'>;
	geocodeAddressWithQuery: GoogleMapsEndpoint<'geocodeAddressWithQuery'>;
	geocodeDestinations: GoogleMapsEndpoint<'geocodeDestinations'>;
	geocodePlace: GoogleMapsEndpoint<'geocodePlace'>;
	geocodingApi: GoogleMapsEndpoint<'geocodingApi'>;
	geolocate: GoogleMapsEndpoint<'geolocate'>;
	get2dTile: GoogleMapsEndpoint<'get2dTile'>;
	get3dTilesRoot: GoogleMapsEndpoint<'get3dTilesRoot'>;
	getDirection: GoogleMapsEndpoint<'getDirection'>;
	getPlaceDetails: GoogleMapsEndpoint<'getPlaceDetails'>;
	getPlacePhoto: GoogleMapsEndpoint<'getPlacePhoto'>;
	getRoute: GoogleMapsEndpoint<'getRoute'>;
	lookupAerialVideo: GoogleMapsEndpoint<'lookupAerialVideo'>;
	nearbySearch: GoogleMapsEndpoint<'nearbySearch'>;
	renderAerialVideo: GoogleMapsEndpoint<'renderAerialVideo'>;
	reverseGeocodeLocation: GoogleMapsEndpoint<'reverseGeocodeLocation'>;
	textSearch: GoogleMapsEndpoint<'textSearch'>;
};

export type GoogleMapsWebhooks = {};

export type GoogleMapsBoundWebhooks = BindWebhooks<GoogleMapsWebhooks>;

const googleMapsEndpointsNested = {
	places: {
		autocomplete: PlacesEndpoints.autocomplete,
		getPlaceDetails: PlacesEndpoints.getPlaceDetails,
		getPlacePhoto: PlacesEndpoints.getPlacePhoto,
		nearbySearch: PlacesEndpoints.nearbySearch,
		textSearch: PlacesEndpoints.textSearch,
	},
	routes: {
		computeRouteMatrix: RoutesEndpoints.computeRouteMatrix,
		distanceMatrix: RoutesEndpoints.distanceMatrix,
		getDirection: RoutesEndpoints.getDirection,
		getRoute: RoutesEndpoints.getRoute,
	},
	geocoding: {
		geocodeAddress: GeocodingEndpoints.geocodeAddress,
		geocodeAddressWithQuery: GeocodingEndpoints.geocodeAddressWithQuery,
		geocodeDestinations: GeocodingEndpoints.geocodeDestinations,
		geocodePlace: GeocodingEndpoints.geocodePlace,
		geocodingApi: GeocodingEndpoints.geocodingApi,
		reverseGeocodeLocation: GeocodingEndpoints.reverseGeocodeLocation,
	},
	tiles: {
		createTilesSession: TilesEndpoints.createTilesSession,
		get2dTile: TilesEndpoints.get2dTile,
		get3dTilesRoot: TilesEndpoints.get3dTilesRoot,
		embedMap: TilesEndpoints.embedMap,
	},
	geolocation: {
		geolocate: GeolocationEndpoints.geolocate,
	},
	aerial: {
		lookupAerialVideo: AerialEndpoints.lookupAerialVideo,
		renderAerialVideo: AerialEndpoints.renderAerialVideo,
	},
} as const;

const googleMapsWebhooksNested = {} as const;

export const googleMapsEndpointSchemas = {
	'places.autocomplete': {
		input: GoogleMapsEndpointInputSchemas.autocomplete,
		output: GoogleMapsEndpointOutputSchemas.autocomplete,
	},
	'places.getPlaceDetails': {
		input: GoogleMapsEndpointInputSchemas.getPlaceDetails,
		output: GoogleMapsEndpointOutputSchemas.getPlaceDetails,
	},
	'places.getPlacePhoto': {
		input: GoogleMapsEndpointInputSchemas.getPlacePhoto,
		output: GoogleMapsEndpointOutputSchemas.getPlacePhoto,
	},
	'places.nearbySearch': {
		input: GoogleMapsEndpointInputSchemas.nearbySearch,
		output: GoogleMapsEndpointOutputSchemas.nearbySearch,
	},
	'places.textSearch': {
		input: GoogleMapsEndpointInputSchemas.textSearch,
		output: GoogleMapsEndpointOutputSchemas.textSearch,
	},
	'routes.computeRouteMatrix': {
		input: GoogleMapsEndpointInputSchemas.computeRouteMatrix,
		output: GoogleMapsEndpointOutputSchemas.computeRouteMatrix,
	},
	'routes.distanceMatrix': {
		input: GoogleMapsEndpointInputSchemas.distanceMatrix,
		output: GoogleMapsEndpointOutputSchemas.distanceMatrix,
	},
	'routes.getDirection': {
		input: GoogleMapsEndpointInputSchemas.getDirection,
		output: GoogleMapsEndpointOutputSchemas.getDirection,
	},
	'routes.getRoute': {
		input: GoogleMapsEndpointInputSchemas.getRoute,
		output: GoogleMapsEndpointOutputSchemas.getRoute,
	},
	'geocoding.geocodeAddress': {
		input: GoogleMapsEndpointInputSchemas.geocodeAddress,
		output: GoogleMapsEndpointOutputSchemas.geocodeAddress,
	},
	'geocoding.geocodeAddressWithQuery': {
		input: GoogleMapsEndpointInputSchemas.geocodeAddressWithQuery,
		output: GoogleMapsEndpointOutputSchemas.geocodeAddressWithQuery,
	},
	'geocoding.geocodeDestinations': {
		input: GoogleMapsEndpointInputSchemas.geocodeDestinations,
		output: GoogleMapsEndpointOutputSchemas.geocodeDestinations,
	},
	'geocoding.geocodePlace': {
		input: GoogleMapsEndpointInputSchemas.geocodePlace,
		output: GoogleMapsEndpointOutputSchemas.geocodePlace,
	},
	'geocoding.geocodingApi': {
		input: GoogleMapsEndpointInputSchemas.geocodingApi,
		output: GoogleMapsEndpointOutputSchemas.geocodingApi,
	},
	'geocoding.reverseGeocodeLocation': {
		input: GoogleMapsEndpointInputSchemas.reverseGeocodeLocation,
		output: GoogleMapsEndpointOutputSchemas.reverseGeocodeLocation,
	},
	'tiles.createTilesSession': {
		input: GoogleMapsEndpointInputSchemas.createTilesSession,
		output: GoogleMapsEndpointOutputSchemas.createTilesSession,
	},
	'tiles.get2dTile': {
		input: GoogleMapsEndpointInputSchemas.get2dTile,
		output: GoogleMapsEndpointOutputSchemas.get2dTile,
	},
	'tiles.get3dTilesRoot': {
		input: GoogleMapsEndpointInputSchemas.get3dTilesRoot,
		output: GoogleMapsEndpointOutputSchemas.get3dTilesRoot,
	},
	'tiles.embedMap': {
		input: GoogleMapsEndpointInputSchemas.embedMap,
		output: GoogleMapsEndpointOutputSchemas.embedMap,
	},
	'geolocation.geolocate': {
		input: GoogleMapsEndpointInputSchemas.geolocate,
		output: GoogleMapsEndpointOutputSchemas.geolocate,
	},
	'aerial.lookupAerialVideo': {
		input: GoogleMapsEndpointInputSchemas.lookupAerialVideo,
		output: GoogleMapsEndpointOutputSchemas.lookupAerialVideo,
	},
	'aerial.renderAerialVideo': {
		input: GoogleMapsEndpointInputSchemas.renderAerialVideo,
		output: GoogleMapsEndpointOutputSchemas.renderAerialVideo,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof googleMapsEndpointsNested
>;

const googleMapsWebhookSchemas =
	{} as const satisfies RequiredPluginWebhookSchemas<
		typeof googleMapsWebhooksNested
	>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const googleMapsEndpointMeta = {
	'places.autocomplete': {
		riskLevel: 'read',
		description:
			'Returns place and query predictions for text input. Use when implementing as-you-type autocomplete functionality for place searches. Returns up to five predictions ordered by relevance.',
	},
	'places.getPlaceDetails': {
		riskLevel: 'read',
		description:
			'Retrieves comprehensive details for a place using its resource name (places/{place_id} format). Use when you need detailed information about a specific place.',
	},
	'places.getPlacePhoto': {
		riskLevel: 'read',
		description:
			'Retrieves high quality photographic content from the Google Maps Places database. Use when you need to download a place photo using a photo_reference obtained from Place Details, Nearby Search, or Text Search requests. Images are scaled proportionally to fit within specified dimensions.',
	},
	'places.nearbySearch': {
		riskLevel: 'read',
		description:
			'Searches for places (e.g., restaurants, parks) within a specified circular area, with options to filter by place types and customize the returned fields and number of results.',
	},
	'places.textSearch': {
		riskLevel: 'read',
		description:
			'Searches for places on Google Maps using a textual query (e.g., "restaurants in London", "Eiffel Tower"). Results may include CLOSED_PERMANENTLY or TEMPORARILY_CLOSED places — filter by businessStatus=OPERATIONAL. Include city/region and business type in textQuery to avoid empty or irrelevant results. Deduplicate using id or formattedAddress, not name alone. Throttle to ~1 req/s; OVER_QUERY_LIMIT (HTTP 429) requires exponential backoff.',
	},
	'routes.computeRouteMatrix': {
		riskLevel: 'read',
		description:
			"Calculates travel distance and duration matrix between multiple origins and destinations using the modern Routes API; supports OAuth2 authentication and various travel modes. Matrix is capped at 625 elements (e.g., 25×25); chunk larger sets to avoid RESOURCE_EXHAUSTED errors. Response elements may be returned out of input order — always use originIndex and destinationIndex to map results. Only use elements where condition='ROUTE_EXISTS'; the matrix may be incomplete.",
	},
	'routes.distanceMatrix': {
		riskLevel: 'read',
		description:
			"DEPRECATED: Legacy API that calculates travel distance and time for a matrix of origins and destinations. This API only works with API keys (no OAuth2 support). Use the modern 'Compute Route Matrix' action instead, which supports OAuth2 authentication. Supports different modes of transportation and options like departure/arrival times. Capped at 100 elements per request (elements = origins × destinations count); split large sets into batches.",
	},
	'routes.getDirection': {
		riskLevel: 'read',
		description:
			'Fetches detailed directions between an origin and a destination, supporting intermediate waypoints and various travel modes. Automatically uses the modern Routes API with OAuth2 when available, falling back to legacy API with API key if provided.',
	},
	'routes.getRoute': {
		riskLevel: 'read',
		description:
			'Calculates one or more routes between two specified locations. Uses various travel modes and preferences; addresses must be resolvable by Google Maps. Response duration is a string with \'s\' suffix (e.g., "4557s"); parse before displaying.',
	},
	'geocoding.geocodeAddress': {
		riskLevel: 'read',
		description:
			"DEPRECATED: Legacy API to convert street addresses into geographic coordinates (latitude and longitude). This API works best with API key authentication. For OAuth connections without an API key, you may need to provide the 'key' parameter or use the newer 'Text Search' action instead. Use when you need to geocode an address or location to get its precise latitude/longitude coordinates.",
	},
	'geocoding.geocodeAddressWithQuery': {
		riskLevel: 'read',
		description:
			'Tool to map addresses to geographic coordinates with query parameter. Use when you need to convert a textual address into latitude/longitude coordinates using the modern v4beta API. Results may match multiple places — always verify formattedAddress, region, and addressComponents in the response before using returned coordinates.',
	},
	'geocoding.geocodeDestinations': {
		riskLevel: 'read',
		description:
			'Tool to perform destination lookup and return detailed destination information including primary place, containing places, sub-destinations, landmarks, entrances, and navigation points. Use when you need comprehensive destination data for an address, place ID, or geographic coordinates.',
	},
	'geocoding.geocodePlace': {
		riskLevel: 'read',
		description:
			'Tool to perform geocode lookup using a place identifier to retrieve address and coordinates. Use when you need to get detailed geographic information for a specific Google Place ID.',
	},
	'geocoding.geocodingApi': {
		riskLevel: 'read',
		description:
			'Convert addresses into geographic coordinates (latitude and longitude) and vice versa (reverse geocoding), or get an address for a Place ID. Uses the Geocoding API v4 (v4beta) which supports OAuth2 authentication. Exactly one of address, latlng, or place_id must be provided per request; omitting all three or mixing incompatible combinations yields no useful results.',
	},
	'geocoding.reverseGeocodeLocation': {
		riskLevel: 'read',
		description:
			'Tool to convert geographic coordinates (latitude and longitude) to human-readable addresses using reverse geocoding. Use when you need to find the address or place name for a given set of coordinates. A single coordinate pair may return multiple results; verify formattedAddress, region, and addressComponents before committing to a result.',
	},
	'tiles.createTilesSession': {
		riskLevel: 'read',
		description:
			'Tool to create a session token required for accessing 2D Tiles and Street View imagery. Use when you need to initialize tile-based map rendering or street view display. The session token is valid for approximately two weeks and must be included in all subsequent tile requests. Each call consumes quota — cache and reuse the returned token across all tile requests within its validity window rather than creating a new session per request.',
	},
	'tiles.get2dTile': {
		riskLevel: 'read',
		description:
			'Tool to retrieve a 2D map tile image at specified coordinates for building custom map visualizations. Use when you need to download individual map tile images for roadmap, satellite, or terrain views. Requires a valid session token from the createSession endpoint.',
	},
	'tiles.get3dTilesRoot': {
		riskLevel: 'read',
		description:
			"Tool to retrieve the 3D Tiles tileset root configuration for photorealistic 3D map rendering. Use when you need to initialize a 3D renderer with Google's photorealistic tiles following the OGC 3D Tiles specification. The Map Tiles API is billable per request; cache the root response client-side and avoid repeated calls.",
	},
	'tiles.embedMap': {
		riskLevel: 'read',
		description:
			'Tool to generate an embeddable Google Map URL and HTML iframe code. Use when you need to display a map (place, view, directions, street view, search) on a webpage without JavaScript. Note: This API only works with API keys (no OAuth2 support). It generates embed URLs and does not make direct API calls. Generated embed URLs are publicly accessible; avoid passing sensitive or internal location queries.',
	},
	'geolocation.geolocate': {
		riskLevel: 'read',
		description:
			'Tool to determine location based on cell towers and WiFi access points. Use when you need to find the geographic location of a device using network infrastructure data.',
	},
	'aerial.lookupAerialVideo': {
		riskLevel: 'read',
		description:
			'Tool to look up an aerial view video by address or video ID. Returns video metadata including state and URIs for playback. Use when you need to retrieve a previously rendered aerial video or check the status of a video render request. Note that receiving a video is a billable event.',
	},
	'aerial.renderAerialVideo': {
		riskLevel: 'write',
		description:
			'Starts rendering an aerial view video for a US postal address. Returns a video ID that can be used with lookupVideo to retrieve the video once rendering completes. Rendering typically takes up to a few hours.',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof googleMapsEndpointsNested
>;

export const googleMapsAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseGoogleMapsPlugin<T extends GoogleMapsPluginOptions> =
	CorsairPlugin<
		'googlemaps',
		typeof GoogleMapsSchema,
		typeof googleMapsEndpointsNested,
		typeof googleMapsWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalGoogleMapsPlugin =
	BaseGoogleMapsPlugin<GoogleMapsPluginOptions>;

export type ExternalGoogleMapsPlugin<T extends GoogleMapsPluginOptions> =
	BaseGoogleMapsPlugin<T>;

export function googlemaps<const T extends GoogleMapsPluginOptions>(
	incomingOptions: GoogleMapsPluginOptions & T = {} as GoogleMapsPluginOptions &
		T,
): ExternalGoogleMapsPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'googlemaps',
		authConfig: googleMapsAuthConfig,
		schema: GoogleMapsSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: googleMapsEndpointsNested,
		webhooks: googleMapsWebhooksNested,
		endpointMeta: googleMapsEndpointMeta,
		endpointSchemas: googleMapsEndpointSchemas,
		webhookSchemas: googleMapsWebhookSchemas,
		pluginWebhookMatcher: () => false,
		pluginTenantWebhookMatcher: matchGoogleMapsTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveGoogleMapsOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: GoogleMapsKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			if (source === 'endpoint' && ctx.authType === 'oauth_2') {
				const res = await ctx.keys.get_access_token();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalGoogleMapsPlugin;
}

export type {
	AutocompleteInput,
	AutocompleteResponse,
	ComputeRouteMatrixInput,
	ComputeRouteMatrixResponse,
	CreateTilesSessionInput,
	CreateTilesSessionResponse,
	DistanceMatrixInput,
	DistanceMatrixResponse,
	EmbedMapInput,
	EmbedMapResponse,
	GeocodeAddressInput,
	GeocodeAddressResponse,
	GeocodeAddressWithQueryInput,
	GeocodeAddressWithQueryResponse,
	GeocodeDestinationsInput,
	GeocodeDestinationsResponse,
	GeocodePlaceInput,
	GeocodePlaceResponse,
	GeocodingApiInput,
	GeocodingApiResponse,
	GeolocateInput,
	GeolocateResponse,
	Get2dTileInput,
	Get2dTileResponse,
	Get3dTilesRootInput,
	Get3dTilesRootResponse,
	GetDirectionInput,
	GetDirectionResponse,
	GetPlaceDetailsInput,
	GetPlaceDetailsResponse,
	GetPlacePhotoInput,
	GetPlacePhotoResponse,
	GetRouteInput,
	GetRouteResponse,
	GoogleMapsEndpointInputs,
	GoogleMapsEndpointOutputs,
	LookupAerialVideoInput,
	LookupAerialVideoResponse,
	NearbySearchInput,
	NearbySearchResponse,
	RenderAerialVideoInput,
	RenderAerialVideoResponse,
	ReverseGeocodeLocationInput,
	ReverseGeocodeLocationResponse,
	TextSearchInput,
	TextSearchResponse,
} from './endpoints/types';
