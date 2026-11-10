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
import { Endpoints } from './endpoints';
import type {
	RadarEndpointInputs,
	RadarEndpointOutputs,
} from './endpoints/types';
import {
	RadarEndpointInputSchemas,
	RadarEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { RadarSchema } from './schema';

export type RadarPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalRadarPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof radarEndpointsNested>;
};

export type RadarContext = CorsairPluginContext<
	typeof RadarSchema,
	RadarPluginOptions
>;

export type RadarKeyBuilderContext = KeyBuilderContext<RadarPluginOptions>;

export type RadarBoundEndpoints = BindEndpoints<typeof radarEndpointsNested>;

type RadarEndpoint<K extends keyof RadarEndpointOutputs> = CorsairEndpoint<
	RadarContext,
	RadarEndpointInputs[K],
	RadarEndpointOutputs[K]
>;

export type RadarEndpoints = {
	geocodeForward: RadarEndpoint<'geocodeForward'>;
	geocodeReverse: RadarEndpoint<'geocodeReverse'>;
	searchPlaces: RadarEndpoint<'searchPlaces'>;
	searchGeofences: RadarEndpoint<'searchGeofences'>;
	usersList: RadarEndpoint<'usersList'>;
	usersGet: RadarEndpoint<'usersGet'>;
	geofencesList: RadarEndpoint<'geofencesList'>;
	geofencesGet: RadarEndpoint<'geofencesGet'>;
	geofencesUpsert: RadarEndpoint<'geofencesUpsert'>;
	geofencesDelete: RadarEndpoint<'geofencesDelete'>;
	tripsList: RadarEndpoint<'tripsList'>;
	tripsGet: RadarEndpoint<'tripsGet'>;
	tripsCreate: RadarEndpoint<'tripsCreate'>;
	tripsUpdate: RadarEndpoint<'tripsUpdate'>;
	track: RadarEndpoint<'track'>;
	eventsConversion: RadarEndpoint<'eventsConversion'>;
};

const radarEndpointsNested = {
	geocode: {
		forward: Endpoints.geocodeForward,
		reverse: Endpoints.geocodeReverse,
	},
	search: {
		places: Endpoints.searchPlaces,
		geofences: Endpoints.searchGeofences,
	},
	users: {
		list: Endpoints.usersList,
		get: Endpoints.usersGet,
	},
	geofences: {
		list: Endpoints.geofencesList,
		get: Endpoints.geofencesGet,
		upsert: Endpoints.geofencesUpsert,
		delete: Endpoints.geofencesDelete,
	},
	trips: {
		list: Endpoints.tripsList,
		get: Endpoints.tripsGet,
		create: Endpoints.tripsCreate,
		update: Endpoints.tripsUpdate,
	},
	track: {
		update: Endpoints.track,
	},
	events: {
		conversion: Endpoints.eventsConversion,
	},
} as const;

export const radarEndpointSchemas = {
	'geocode.forward': {
		input: RadarEndpointInputSchemas.geocodeForward,
		output: RadarEndpointOutputSchemas.geocodeForward,
	},
	'geocode.reverse': {
		input: RadarEndpointInputSchemas.geocodeReverse,
		output: RadarEndpointOutputSchemas.geocodeReverse,
	},
	'search.places': {
		input: RadarEndpointInputSchemas.searchPlaces,
		output: RadarEndpointOutputSchemas.searchPlaces,
	},
	'search.geofences': {
		input: RadarEndpointInputSchemas.searchGeofences,
		output: RadarEndpointOutputSchemas.searchGeofences,
	},
	'users.list': {
		input: RadarEndpointInputSchemas.usersList,
		output: RadarEndpointOutputSchemas.usersList,
	},
	'users.get': {
		input: RadarEndpointInputSchemas.usersGet,
		output: RadarEndpointOutputSchemas.usersGet,
	},
	'geofences.list': {
		input: RadarEndpointInputSchemas.geofencesList,
		output: RadarEndpointOutputSchemas.geofencesList,
	},
	'geofences.get': {
		input: RadarEndpointInputSchemas.geofencesGet,
		output: RadarEndpointOutputSchemas.geofencesGet,
	},
	'geofences.upsert': {
		input: RadarEndpointInputSchemas.geofencesUpsert,
		output: RadarEndpointOutputSchemas.geofencesUpsert,
	},
	'geofences.delete': {
		input: RadarEndpointInputSchemas.geofencesDelete,
		output: RadarEndpointOutputSchemas.geofencesDelete,
	},
	'trips.list': {
		input: RadarEndpointInputSchemas.tripsList,
		output: RadarEndpointOutputSchemas.tripsList,
	},
	'trips.get': {
		input: RadarEndpointInputSchemas.tripsGet,
		output: RadarEndpointOutputSchemas.tripsGet,
	},
	'trips.create': {
		input: RadarEndpointInputSchemas.tripsCreate,
		output: RadarEndpointOutputSchemas.tripsCreate,
	},
	'trips.update': {
		input: RadarEndpointInputSchemas.tripsUpdate,
		output: RadarEndpointOutputSchemas.tripsUpdate,
	},
	'track.update': {
		input: RadarEndpointInputSchemas.track,
		output: RadarEndpointOutputSchemas.track,
	},
	'events.conversion': {
		input: RadarEndpointInputSchemas.eventsConversion,
		output: RadarEndpointOutputSchemas.eventsConversion,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof radarEndpointsNested>;

const defaultAuthType = 'api_key' as const;

const radarEndpointMeta = {
	'geocode.forward': {
		riskLevel: 'read',
		description:
			'Turn an address into coordinates, returning every match with its layer and confidence',
	},
	'geocode.reverse': {
		riskLevel: 'read',
		description:
			'Turn `latitude,longitude` into an address, with the admin layers that contain it',
	},
	'search.places': {
		riskLevel: 'read',
		description:
			'Search the places database near a point, filtered by name, chain, category or country',
	},
	'search.geofences': {
		riskLevel: 'read',
		description:
			'Search geofences near a point, filtered by tag or external id',
	},
	'users.list': {
		riskLevel: 'read',
		description:
			'List tracked users with their last location and geofences, paging by update time',
	},
	'users.get': {
		riskLevel: 'read',
		description:
			'Fetch one user by Radar id, user id or device id, including their location and metadata',
	},
	'geofences.list': {
		riskLevel: 'read',
		description:
			'List geofences with tag and external-id filters, paging by update time',
	},
	'geofences.get': {
		riskLevel: 'read',
		description: 'Fetch one geofence with its geometry, radius and metadata',
	},
	'geofences.upsert': {
		riskLevel: 'write',
		description:
			'Create or replace a geofence by tag and external id, or by Radar id: a circle, a polygon or an isochrone',
	},
	'geofences.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a geofence permanently; the API keeps no copy',
	},
	'trips.list': {
		riskLevel: 'read',
		description:
			'List trips by status, user, destination or time window, optionally with their location trace',
	},
	'trips.get': {
		riskLevel: 'read',
		description: 'Fetch one trip with its status, destination and live ETA',
	},
	'trips.create': {
		riskLevel: 'write',
		description:
			'Create a trip for a user with its destination geofence, travel mode and approaching threshold',
	},
	'trips.update': {
		riskLevel: 'write',
		description:
			'Update a trip: its status, mode, destination or approaching threshold',
	},
	'track.update': {
		riskLevel: 'write',
		description:
			'Submit a location update, which creates the user when none matches and may generate geofence events',
	},
	'events.conversion': {
		riskLevel: 'write',
		description:
			'Log a named conversion with optional revenue and metadata against a user, device or install id',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof radarEndpointsNested>;

export type BaseRadarPlugin<T extends RadarPluginOptions> = CorsairPlugin<
	'radar',
	typeof RadarSchema,
	typeof radarEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalRadarPlugin = BaseRadarPlugin<RadarPluginOptions>;

export type ExternalRadarPlugin<T extends RadarPluginOptions> =
	BaseRadarPlugin<T>;

export function radar<const T extends RadarPluginOptions>(
	incomingOptions: RadarPluginOptions & T = {} as RadarPluginOptions & T,
): ExternalRadarPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'radar',
		schema: RadarSchema,
		options: options,
		hooks: options.hooks,
		endpoints: radarEndpointsNested,
		webhooks: {},
		endpointMeta: radarEndpointMeta,
		endpointSchemas: radarEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: RadarKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('radar', ctx.authType ?? 'api_key');
		},
	} satisfies InternalRadarPlugin;
}

export { RadarAPIError } from './client';

export type {
	EventsConversionInput,
	EventsConversionResponse,
	GeocodeForwardInput,
	GeocodeForwardResponse,
	GeocodeReverseInput,
	GeocodeReverseResponse,
	GeofencesDeleteInput,
	GeofencesDeleteResponse,
	GeofencesGetInput,
	GeofencesGetResponse,
	GeofencesListInput,
	GeofencesListResponse,
	GeofencesUpsertInput,
	GeofencesUpsertResponse,
	RadarAddress,
	RadarEndpointInputs,
	RadarEndpointOutputs,
	RadarGeofence,
	RadarPlace,
	RadarTrip,
	RadarUser,
	SearchGeofencesInput,
	SearchGeofencesResponse,
	SearchPlacesInput,
	SearchPlacesResponse,
	TrackInput,
	TrackResponse,
	TripsCreateInput,
	TripsCreateResponse,
	TripsGetInput,
	TripsGetResponse,
	TripsListInput,
	TripsListResponse,
	TripsUpdateInput,
	TripsUpdateResponse,
	UsersGetInput,
	UsersGetResponse,
	UsersListInput,
	UsersListResponse,
} from './endpoints/types';
