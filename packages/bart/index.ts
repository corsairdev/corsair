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
import {
	Advisories,
	Etd,
	Fares,
	Routes,
	Schedules,
	Stations,
} from './endpoints';
import type {
	BartEndpointInputs,
	BartEndpointOutputs,
} from './endpoints/types';
import {
	BartEndpointInputSchemas,
	BartEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { BartSchema } from './schema';
import { matchBartTenantWebhook } from './webhooks';

export type BartPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalBartPlugin['hooks'];
	webhookHooks?: InternalBartPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof bartEndpointsNested>;
};

export type BartContext = CorsairPluginContext<
	typeof BartSchema,
	BartPluginOptions
>;

export type BartKeyBuilderContext = KeyBuilderContext<BartPluginOptions>;

type BartEndpoint<K extends keyof BartEndpointOutputs, Input> = CorsairEndpoint<
	BartContext,
	Input,
	BartEndpointOutputs[K]
>;

export type BartEndpoints = {
	advisoriesList: BartEndpoint<
		'advisoriesList',
		BartEndpointInputs['advisoriesList']
	>;
	advisoriesElevators: BartEndpoint<
		'advisoriesElevators',
		BartEndpointInputs['advisoriesElevators']
	>;
	advisoriesTrainCount: BartEndpoint<
		'advisoriesTrainCount',
		BartEndpointInputs['advisoriesTrainCount']
	>;
	etdStation: BartEndpoint<'etdStation', BartEndpointInputs['etdStation']>;
	routesList: BartEndpoint<'routesList', BartEndpointInputs['routesList']>;
	routesInfo: BartEndpoint<'routesInfo', BartEndpointInputs['routesInfo']>;
	stationsList: BartEndpoint<
		'stationsList',
		BartEndpointInputs['stationsList']
	>;
	stationsInfo: BartEndpoint<
		'stationsInfo',
		BartEndpointInputs['stationsInfo']
	>;
	stationsAccess: BartEndpoint<
		'stationsAccess',
		BartEndpointInputs['stationsAccess']
	>;
	schedulesDepartures: BartEndpoint<
		'schedulesDepartures',
		BartEndpointInputs['schedulesDepartures']
	>;
	schedulesArrivals: BartEndpoint<
		'schedulesArrivals',
		BartEndpointInputs['schedulesArrivals']
	>;
	schedulesRoutes: BartEndpoint<
		'schedulesRoutes',
		BartEndpointInputs['schedulesRoutes']
	>;
	faresCalculate: BartEndpoint<
		'faresCalculate',
		BartEndpointInputs['faresCalculate']
	>;
};

export type BartBoundEndpoints = BindEndpoints<typeof bartEndpointsNested>;

const bartEndpointsNested = {
	advisories: {
		list: Advisories.list,
		elevators: Advisories.elevators,
		trainCount: Advisories.trainCount,
	},
	etd: {
		station: Etd.station,
	},
	routes: {
		list: Routes.list,
		info: Routes.info,
	},
	stations: {
		list: Stations.list,
		info: Stations.info,
		access: Stations.access,
	},
	schedules: {
		departures: Schedules.departures,
		arrivals: Schedules.arrivals,
		routes: Schedules.routes,
	},
	fares: {
		calculate: Fares.calculate,
	},
} as const;

// BART has no webhooks
const bartWebhooksNested = {} as const;

export const bartEndpointSchemas = {
	'advisories.list': {
		input: BartEndpointInputSchemas.advisoriesList,
		output: BartEndpointOutputSchemas.advisoriesList,
	},
	'advisories.elevators': {
		input: BartEndpointInputSchemas.advisoriesElevators,
		output: BartEndpointOutputSchemas.advisoriesElevators,
	},
	'advisories.trainCount': {
		input: BartEndpointInputSchemas.advisoriesTrainCount,
		output: BartEndpointOutputSchemas.advisoriesTrainCount,
	},
	'etd.station': {
		input: BartEndpointInputSchemas.etdStation,
		output: BartEndpointOutputSchemas.etdStation,
	},
	'routes.list': {
		input: BartEndpointInputSchemas.routesList,
		output: BartEndpointOutputSchemas.routesList,
	},
	'routes.info': {
		input: BartEndpointInputSchemas.routesInfo,
		output: BartEndpointOutputSchemas.routesInfo,
	},
	'stations.list': {
		input: BartEndpointInputSchemas.stationsList,
		output: BartEndpointOutputSchemas.stationsList,
	},
	'stations.info': {
		input: BartEndpointInputSchemas.stationsInfo,
		output: BartEndpointOutputSchemas.stationsInfo,
	},
	'stations.access': {
		input: BartEndpointInputSchemas.stationsAccess,
		output: BartEndpointOutputSchemas.stationsAccess,
	},
	'schedules.departures': {
		input: BartEndpointInputSchemas.schedulesDepartures,
		output: BartEndpointOutputSchemas.schedulesDepartures,
	},
	'schedules.arrivals': {
		input: BartEndpointInputSchemas.schedulesArrivals,
		output: BartEndpointOutputSchemas.schedulesArrivals,
	},
	'schedules.routes': {
		input: BartEndpointInputSchemas.schedulesRoutes,
		output: BartEndpointOutputSchemas.schedulesRoutes,
	},
	'fares.calculate': {
		input: BartEndpointInputSchemas.faresCalculate,
		output: BartEndpointOutputSchemas.faresCalculate,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof bartEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const bartEndpointMeta = {
	'advisories.list': {
		riskLevel: 'read',
		description: 'Get current BART system advisories and service delays',
	},
	'advisories.elevators': {
		riskLevel: 'read',
		description: 'Get current elevator status and elevator outage advisories',
	},
	'advisories.trainCount': {
		riskLevel: 'read',
		description: 'Get the number of trains currently active in the BART system',
	},
	'etd.station': {
		riskLevel: 'read',
		description: 'Get real-time estimated departure times for a BART station',
	},
	'routes.list': {
		riskLevel: 'read',
		description: 'Get the list of all current BART transit routes',
	},
	'routes.info': {
		riskLevel: 'read',
		description: 'Get detailed information about a specific BART transit route',
	},
	'stations.list': {
		riskLevel: 'read',
		description:
			'Get list of all BART stations with geographic coordinates and addresses',
	},
	'stations.info': {
		riskLevel: 'read',
		description: 'Get detailed station information, connections, and platforms',
	},
	'stations.access': {
		riskLevel: 'read',
		description:
			'Get station access details including parking, lockers, and transit connections',
	},
	'schedules.departures': {
		riskLevel: 'read',
		description:
			'Get scheduled departures and trip itinerary between two BART stations',
	},
	'schedules.arrivals': {
		riskLevel: 'read',
		description:
			'Get scheduled arrivals and trip itinerary between two BART stations',
	},
	'schedules.routes': {
		riskLevel: 'read',
		description:
			'Get the full timetable and stop schedule for a specific BART route',
	},
	'fares.calculate': {
		riskLevel: 'read',
		description:
			'Calculate transit fares and ticket prices between two BART stations',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof bartEndpointsNested>;

export const bartAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseBartPlugin<T extends BartPluginOptions> = CorsairPlugin<
	'bart',
	typeof BartSchema,
	typeof bartEndpointsNested,
	typeof bartWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalBartPlugin = BaseBartPlugin<BartPluginOptions>;

export type ExternalBartPlugin<T extends BartPluginOptions> = BaseBartPlugin<T>;

export function bart<const T extends BartPluginOptions>(
	incomingOptions: BartPluginOptions & T = {} as BartPluginOptions & T,
): ExternalBartPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'bart',
		authConfig: bartAuthConfig,
		schema: BartSchema,
		options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: bartEndpointsNested,
		webhooks: bartWebhooksNested,
		endpointMeta: bartEndpointMeta,
		endpointSchemas: bartEndpointSchemas,
		pluginWebhookMatcher: () => false,
		pluginTenantWebhookMatcher: matchBartTenantWebhook,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: BartKeyBuilderContext, source) => {
			if (
				source === 'endpoint' &&
				options.key &&
				options.key.trim().length > 0
			) {
				return options.key.trim();
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				if (!key || key.trim().length === 0) {
					throw new AuthMissingError('bart', 'api_key');
				}
				return key.trim();
			}

			throw new AuthMissingError('bart', 'api_key');
		},
	} satisfies InternalBartPlugin;
}

export type {
	AdvisoriesElevatorsInput,
	AdvisoriesElevatorsResponse,
	AdvisoriesListInput,
	AdvisoriesListResponse,
	AdvisoriesTrainCountInput,
	AdvisoriesTrainCountResponse,
	BartEndpointInputs,
	BartEndpointOutputs,
	EtdDestination,
	EtdEstimate,
	EtdStationInput,
	EtdStationItem,
	EtdStationResponse,
	FareItem,
	FaresCalculateInput,
	FaresCalculateResponse,
	FareTrip,
	RouteDetail,
	RouteListItem,
	RoutesInfoInput,
	RoutesInfoResponse,
	RoutesListInput,
	RoutesListResponse,
	ScheduleFiles,
	SchedulePlan,
	SchedulesArrivalsInput,
	SchedulesArrivalsResponse,
	SchedulesDeparturesInput,
	SchedulesDeparturesResponse,
	SchedulesRoutesInput,
	SchedulesRoutesResponse,
	ScheduleTripRequest,
	StationAccessDetail,
	StationDetail,
	StationListItem,
	StationsAccessInput,
	StationsAccessResponse,
	StationsInfoInput,
	StationsInfoResponse,
	StationsListInput,
	StationsListResponse,
	TripItem,
	TripLeg,
} from './endpoints/types';

export type { BartWebhookOutputs } from './webhooks/types';
