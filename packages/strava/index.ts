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
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import {
	Activities,
	Athletes,
	Clubs,
	Gear,
	Routes,
	SegmentEfforts,
	Segments,
	Uploads,
} from './endpoints';
import type {
	StravaEndpointInputs,
	StravaEndpointOutputs,
} from './endpoints/types';
import {
	StravaEndpointInputSchemas,
	StravaEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { StravaSchema } from './schema';
import type { StravaWebhookOutputs } from './webhooks/types';

export type StravaPluginOptions = {
	authType?: PickAuth<'oauth_2'>;
	key?: string;
	hooks?: InternalStravaPlugin['hooks'];
	webhookHooks?: InternalStravaPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof stravaEndpointsNested>;
};

export type StravaContext = CorsairPluginContext<
	typeof StravaSchema,
	StravaPluginOptions
>;

export type StravaKeyBuilderContext = KeyBuilderContext<StravaPluginOptions>;

export type StravaBoundEndpoints = BindEndpoints<typeof stravaEndpointsNested>;

type StravaEndpoint<K extends keyof StravaEndpointOutputs> = CorsairEndpoint<
	StravaContext,
	StravaEndpointInputs[K],
	StravaEndpointOutputs[K]
>;

export type StravaEndpoints = {
	activitiesCreate: StravaEndpoint<'activitiesCreate'>;
	activitiesGet: StravaEndpoint<'activitiesGet'>;
	activitiesList: StravaEndpoint<'activitiesList'>;
	activitiesGetStreams: StravaEndpoint<'activitiesGetStreams'>;
	activitiesGetZones: StravaEndpoint<'activitiesGetZones'>;
	activitiesListComments: StravaEndpoint<'activitiesListComments'>;
	activitiesListKudoers: StravaEndpoint<'activitiesListKudoers'>;
	activitiesListLaps: StravaEndpoint<'activitiesListLaps'>;
	athleteGet: StravaEndpoint<'athleteGet'>;
	athleteUpdate: StravaEndpoint<'athleteUpdate'>;
	athleteGetStats: StravaEndpoint<'athleteGetStats'>;
	athleteGetZones: StravaEndpoint<'athleteGetZones'>;
	segmentsExplore: StravaEndpoint<'segmentsExplore'>;
	segmentsGet: StravaEndpoint<'segmentsGet'>;
	segmentsGetStreams: StravaEndpoint<'segmentsGetStreams'>;
	segmentsList: StravaEndpoint<'segmentsList'>;
	segmentsStar: StravaEndpoint<'segmentsStar'>;
	segmentEffortsGet: StravaEndpoint<'segmentEffortsGet'>;
	segmentEffortsGetStreams: StravaEndpoint<'segmentEffortsGetStreams'>;
	routesGet: StravaEndpoint<'routesGet'>;
	routesGetStreams: StravaEndpoint<'routesGetStreams'>;
	routesExportGpx: StravaEndpoint<'routesExportGpx'>;
	routesExportTcx: StravaEndpoint<'routesExportTcx'>;
	gearGet: StravaEndpoint<'gearGet'>;
	clubsGet: StravaEndpoint<'clubsGet'>;
	uploadsCreate: StravaEndpoint<'uploadsCreate'>;
	uploadsGet: StravaEndpoint<'uploadsGet'>;
};

type StravaWebhook<
	K extends keyof StravaWebhookOutputs,
	TEvent,
> = CorsairWebhook<StravaContext, TEvent, StravaWebhookOutputs[K]>;

export type StravaWebhooks = {};

export type StravaBoundWebhooks = BindWebhooks<StravaWebhooks>;

const stravaEndpointsNested = {
	activities: {
		create: Activities.create,
		get: Activities.get,
		list: Activities.list,
		getStreams: Activities.getStreams,
		getZones: Activities.getZones,
		listComments: Activities.listComments,
		listKudoers: Activities.listKudoers,
		listLaps: Activities.listLaps,
	},
	athletes: {
		get: Athletes.get,
		update: Athletes.update,
		getStats: Athletes.getStats,
		getZones: Athletes.getZones,
	},
	segments: {
		explore: Segments.explore,
		get: Segments.get,
		getStreams: Segments.getStreams,
		list: Segments.list,
		star: Segments.star,
	},
	segmentEfforts: {
		get: SegmentEfforts.get,
		getStreams: SegmentEfforts.getStreams,
	},
	routes: {
		get: Routes.get,
		getStreams: Routes.getStreams,
		exportGpx: Routes.exportGpx,
		exportTcx: Routes.exportTcx,
	},
	gear: {
		get: Gear.get,
	},
	clubs: {
		get: Clubs.get,
	},
	uploads: {
		create: Uploads.create,
		get: Uploads.get,
	},
} as const;

const stravaWebhooksNested = {} as const;

export const stravaEndpointSchemas = {
	'activities.create': {
		input: StravaEndpointInputSchemas.activitiesCreate,
		output: StravaEndpointOutputSchemas.activitiesCreate,
	},
	'activities.get': {
		input: StravaEndpointInputSchemas.activitiesGet,
		output: StravaEndpointOutputSchemas.activitiesGet,
	},
	'activities.list': {
		input: StravaEndpointInputSchemas.activitiesList,
		output: StravaEndpointOutputSchemas.activitiesList,
	},
	'activities.getStreams': {
		input: StravaEndpointInputSchemas.activitiesGetStreams,
		output: StravaEndpointOutputSchemas.activitiesGetStreams,
	},
	'activities.getZones': {
		input: StravaEndpointInputSchemas.activitiesGetZones,
		output: StravaEndpointOutputSchemas.activitiesGetZones,
	},
	'activities.listComments': {
		input: StravaEndpointInputSchemas.activitiesListComments,
		output: StravaEndpointOutputSchemas.activitiesListComments,
	},
	'activities.listKudoers': {
		input: StravaEndpointInputSchemas.activitiesListKudoers,
		output: StravaEndpointOutputSchemas.activitiesListKudoers,
	},
	'activities.listLaps': {
		input: StravaEndpointInputSchemas.activitiesListLaps,
		output: StravaEndpointOutputSchemas.activitiesListLaps,
	},
	'athletes.get': {
		input: StravaEndpointInputSchemas.athleteGet,
		output: StravaEndpointOutputSchemas.athleteGet,
	},
	'athletes.update': {
		input: StravaEndpointInputSchemas.athleteUpdate,
		output: StravaEndpointOutputSchemas.athleteUpdate,
	},
	'athletes.getStats': {
		input: StravaEndpointInputSchemas.athleteGetStats,
		output: StravaEndpointOutputSchemas.athleteGetStats,
	},
	'athletes.getZones': {
		input: StravaEndpointInputSchemas.athleteGetZones,
		output: StravaEndpointOutputSchemas.athleteGetZones,
	},
	'segments.explore': {
		input: StravaEndpointInputSchemas.segmentsExplore,
		output: StravaEndpointOutputSchemas.segmentsExplore,
	},
	'segments.get': {
		input: StravaEndpointInputSchemas.segmentsGet,
		output: StravaEndpointOutputSchemas.segmentsGet,
	},
	'segments.getStreams': {
		input: StravaEndpointInputSchemas.segmentsGetStreams,
		output: StravaEndpointOutputSchemas.segmentsGetStreams,
	},
	'segments.list': {
		input: StravaEndpointInputSchemas.segmentsList,
		output: StravaEndpointOutputSchemas.segmentsList,
	},
	'segments.star': {
		input: StravaEndpointInputSchemas.segmentsStar,
		output: StravaEndpointOutputSchemas.segmentsStar,
	},
	'segmentEfforts.get': {
		input: StravaEndpointInputSchemas.segmentEffortsGet,
		output: StravaEndpointOutputSchemas.segmentEffortsGet,
	},
	'segmentEfforts.getStreams': {
		input: StravaEndpointInputSchemas.segmentEffortsGetStreams,
		output: StravaEndpointOutputSchemas.segmentEffortsGetStreams,
	},
	'routes.get': {
		input: StravaEndpointInputSchemas.routesGet,
		output: StravaEndpointOutputSchemas.routesGet,
	},
	'routes.getStreams': {
		input: StravaEndpointInputSchemas.routesGetStreams,
		output: StravaEndpointOutputSchemas.routesGetStreams,
	},
	'routes.exportGpx': {
		input: StravaEndpointInputSchemas.routesExportGpx,
		output: StravaEndpointOutputSchemas.routesExportGpx,
	},
	'routes.exportTcx': {
		input: StravaEndpointInputSchemas.routesExportTcx,
		output: StravaEndpointOutputSchemas.routesExportTcx,
	},
	'gear.get': {
		input: StravaEndpointInputSchemas.gearGet,
		output: StravaEndpointOutputSchemas.gearGet,
	},
	'clubs.get': {
		input: StravaEndpointInputSchemas.clubsGet,
		output: StravaEndpointOutputSchemas.clubsGet,
	},
	'uploads.create': {
		input: StravaEndpointInputSchemas.uploadsCreate,
		output: StravaEndpointOutputSchemas.uploadsCreate,
	},
	'uploads.get': {
		input: StravaEndpointInputSchemas.uploadsGet,
		output: StravaEndpointOutputSchemas.uploadsGet,
	},
} satisfies RequiredPluginEndpointSchemas<typeof stravaEndpointsNested>;

const defaultAuthType = 'oauth_2' as const;

const stravaEndpointMeta = {
	'activities.create': {
		riskLevel: 'write',
		description: 'Create a manual activity',
	},
	'activities.get': {
		riskLevel: 'read',
		description: 'Get details of an activity by ID',
	},
	'activities.list': {
		riskLevel: 'read',
		description: "List the authenticated athlete's activities",
	},
	'activities.getStreams': {
		riskLevel: 'read',
		description: 'Get stream data for an activity',
	},
	'activities.getZones': {
		riskLevel: 'read',
		description: 'Get heart rate and power zones for an activity',
	},
	'activities.listComments': {
		riskLevel: 'read',
		description: 'List comments on an activity',
	},
	'activities.listKudoers': {
		riskLevel: 'read',
		description: 'List athletes who kudoed an activity',
	},
	'activities.listLaps': {
		riskLevel: 'read',
		description: 'List laps of an activity',
	},
	'athletes.get': {
		riskLevel: 'read',
		description: 'Get the authenticated athlete profile',
	},
	'athletes.update': {
		riskLevel: 'write',
		description: "Update the authenticated athlete's profile",
	},
	'athletes.getStats': {
		riskLevel: 'read',
		description: "Get an athlete's activity statistics",
	},
	'athletes.getZones': {
		riskLevel: 'read',
		description: "Get the authenticated athlete's heart rate and power zones",
	},
	'segments.explore': {
		riskLevel: 'read',
		description: 'Find popular segments within a bounding box',
	},
	'segments.get': {
		riskLevel: 'read',
		description: 'Get details of a segment by ID',
	},
	'segments.getStreams': {
		riskLevel: 'read',
		description: 'Get stream data for a segment',
	},
	'segments.list': {
		riskLevel: 'read',
		description: "List the authenticated athlete's starred segments",
	},
	'segments.star': {
		riskLevel: 'write',
		description: 'Star or unstar a segment',
	},
	'segmentEfforts.get': {
		riskLevel: 'read',
		description: 'Get details of a segment effort by ID',
	},
	'segmentEfforts.getStreams': {
		riskLevel: 'read',
		description: 'Get stream data for a segment effort',
	},
	'routes.get': {
		riskLevel: 'read',
		description: 'Get details of a route by ID',
	},
	'routes.getStreams': {
		riskLevel: 'read',
		description: 'Get stream data for a route',
	},
	'routes.exportGpx': {
		riskLevel: 'read',
		description: 'Export a route as GPX',
	},
	'routes.exportTcx': {
		riskLevel: 'read',
		description: 'Export a route as TCX',
	},
	'gear.get': {
		riskLevel: 'read',
		description: 'Get details of a gear item by ID',
	},
	'clubs.get': {
		riskLevel: 'read',
		description: 'Get details of a club by ID',
	},
	'uploads.create': {
		riskLevel: 'write',
		description: 'Upload an activity file (FIT, TCX, GPX)',
	},
	'uploads.get': {
		riskLevel: 'read',
		description: 'Get the status of an upload by ID',
	},
} satisfies RequiredPluginEndpointMeta<typeof stravaEndpointsNested>;

export const stravaAuthConfig = {
	oauth_2: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

const stravaWebhookSchemas = {} satisfies RequiredPluginWebhookSchemas<
	typeof stravaWebhooksNested
>;

export type BaseStravaPlugin<T extends StravaPluginOptions> = CorsairPlugin<
	'strava',
	typeof StravaSchema,
	typeof stravaEndpointsNested,
	typeof stravaWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalStravaPlugin = BaseStravaPlugin<StravaPluginOptions>;

export type ExternalStravaPlugin<T extends StravaPluginOptions> =
	BaseStravaPlugin<T>;

export function strava<const T extends StravaPluginOptions>(
	// Default empty object cast to satisfy the generic constraint when no options are provided
	incomingOptions: StravaPluginOptions & T = {} as StravaPluginOptions & T,
): ExternalStravaPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'strava',
		schema: StravaSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: stravaEndpointsNested,
		webhooks: stravaWebhooksNested,
		endpointMeta: stravaEndpointMeta,
		endpointSchemas: stravaEndpointSchemas,
		webhookSchemas: stravaWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			// Webhooks are not implemented yet
			return false;
		},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: StravaKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (ctx.authType === 'oauth_2') {
				const res = await ctx.keys.get_access_token();

				if (!res) {
					return '';
				}

				return res;
			}

			return '';
		},
	} satisfies InternalStravaPlugin;
}

// ─────────────────────────────────────────────────────────────────────────────
// Webhook Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type { StravaWebhookOutputs } from './webhooks/types';

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	ActivitiesCreateInput,
	ActivitiesGetInput,
	ActivitiesGetStreamsInput,
	ActivitiesGetZonesInput,
	ActivitiesListCommentsInput,
	ActivitiesListCommentsResponse,
	ActivitiesListInput,
	ActivitiesListKudoersInput,
	ActivitiesListKudoersResponse,
	ActivitiesListLapsInput,
	ActivitiesListLapsResponse,
	ActivitiesListResponse,
	ActivityResponse,
	ActivityZonesResponse,
	AthleteGetInput,
	AthleteGetStatsInput,
	AthleteGetZonesInput,
	AthleteResponse,
	AthleteStatsResponse,
	AthleteUpdateInput,
	AthleteZonesResponse,
	ClubResponse,
	ClubsGetInput,
	ExploreSegmentsResponse,
	GearGetInput,
	GearResponse,
	LapResponse,
	RouteResponse,
	RoutesExportGpxInput,
	RoutesExportTcxInput,
	RoutesGetInput,
	RoutesGetStreamsInput,
	SegmentEffortResponse,
	SegmentEffortsGetInput,
	SegmentEffortsGetStreamsInput,
	SegmentResponse,
	SegmentsExploreInput,
	SegmentsGetInput,
	SegmentsGetStreamsInput,
	SegmentsListInput,
	SegmentsListResponse,
	SegmentsStarInput,
	StravaEndpointInputs,
	StravaEndpointOutputs,
	StreamSetResponse,
	UploadResponse,
	UploadsCreateInput,
	UploadsGetInput,
} from './endpoints/types';
