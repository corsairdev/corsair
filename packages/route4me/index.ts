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
import { Contacts, Dispatch, Optimizations, Routes } from './endpoints';
import type {
	Route4MeEndpointInputs,
	Route4MeEndpointOutputs,
} from './endpoints/types';
import {
	Route4MeEndpointInputSchemas,
	Route4MeEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { Route4meSchema } from './schema';

export type Route4mePluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalRoute4mePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof route4meEndpointsNested>;
};

export type Route4meContext = CorsairPluginContext<
	typeof Route4meSchema,
	Route4mePluginOptions
>;

export type Route4meKeyBuilderContext =
	KeyBuilderContext<Route4mePluginOptions>;

export type Route4meBoundEndpoints = BindEndpoints<
	typeof route4meEndpointsNested
>;

type Route4meEndpoint<K extends keyof Route4MeEndpointOutputs> =
	CorsairEndpoint<
		Route4meContext,
		Route4MeEndpointInputs[K],
		Route4MeEndpointOutputs[K]
	>;

export type Route4meEndpoints = {
	routesList: Route4meEndpoint<'routesList'>;
	routesGet: Route4meEndpoint<'routesGet'>;
	ordersList: Route4meEndpoint<'ordersList'>;
	ordersCreate: Route4meEndpoint<'ordersCreate'>;
	vehiclesList: Route4meEndpoint<'vehiclesList'>;
	vehiclesCreate: Route4meEndpoint<'vehiclesCreate'>;
	addressesList: Route4meEndpoint<'addressesList'>;
	addressesCreate: Route4meEndpoint<'addressesCreate'>;
	teamMe: Route4meEndpoint<'teamMe'>;
	teamList: Route4meEndpoint<'teamList'>;
	optimizationsList: Route4meEndpoint<'optimizationsList'>;
	optimizationsGet: Route4meEndpoint<'optimizationsGet'>;
	optimizationsCreate: Route4meEndpoint<'optimizationsCreate'>;
};

const route4meEndpointsNested = {
	routes: {
		list: Routes.list,
		get: Routes.get,
	},
	orders: {
		list: Dispatch.ordersList,
		create: Dispatch.ordersCreate,
	},
	vehicles: {
		list: Dispatch.vehiclesList,
		create: Dispatch.vehiclesCreate,
	},
	addresses: {
		list: Contacts.addressesList,
		create: Contacts.addressesCreate,
	},
	team: {
		me: Contacts.teamMe,
		list: Contacts.teamList,
	},
	optimizations: {
		list: Optimizations.list,
		get: Optimizations.get,
		create: Optimizations.create,
	},
} as const;

export const route4meEndpointSchemas = {
	'routes.list': {
		input: Route4MeEndpointInputSchemas.routesList,
		output: Route4MeEndpointOutputSchemas.routesList,
	},
	'routes.get': {
		input: Route4MeEndpointInputSchemas.routesGet,
		output: Route4MeEndpointOutputSchemas.routesGet,
	},
	'orders.list': {
		input: Route4MeEndpointInputSchemas.ordersList,
		output: Route4MeEndpointOutputSchemas.ordersList,
	},
	'orders.create': {
		input: Route4MeEndpointInputSchemas.ordersCreate,
		output: Route4MeEndpointOutputSchemas.ordersCreate,
	},
	'vehicles.list': {
		input: Route4MeEndpointInputSchemas.vehiclesList,
		output: Route4MeEndpointOutputSchemas.vehiclesList,
	},
	'vehicles.create': {
		input: Route4MeEndpointInputSchemas.vehiclesCreate,
		output: Route4MeEndpointOutputSchemas.vehiclesCreate,
	},
	'addresses.list': {
		input: Route4MeEndpointInputSchemas.addressesList,
		output: Route4MeEndpointOutputSchemas.addressesList,
	},
	'addresses.create': {
		input: Route4MeEndpointInputSchemas.addressesCreate,
		output: Route4MeEndpointOutputSchemas.addressesCreate,
	},
	'team.me': {
		input: Route4MeEndpointInputSchemas.teamMe,
		output: Route4MeEndpointOutputSchemas.teamMe,
	},
	'team.list': {
		input: Route4MeEndpointInputSchemas.teamList,
		output: Route4MeEndpointOutputSchemas.teamList,
	},
	'optimizations.list': {
		input: Route4MeEndpointInputSchemas.optimizationsList,
		output: Route4MeEndpointOutputSchemas.optimizationsList,
	},
	'optimizations.get': {
		input: Route4MeEndpointInputSchemas.optimizationsGet,
		output: Route4MeEndpointOutputSchemas.optimizationsGet,
	},
	'optimizations.create': {
		input: Route4MeEndpointInputSchemas.optimizationsCreate,
		output: Route4MeEndpointOutputSchemas.optimizationsCreate,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof route4meEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const route4meEndpointMeta = {
	'routes.list': {
		riskLevel: 'read',
		description:
			'List routes with search, facility and id filters plus page paging, from the v5 API',
	},
	'routes.get': {
		riskLevel: 'read',
		description:
			'Fetch one route by its 32-character id, including its sequenced stops and directions',
	},
	'orders.list': {
		riskLevel: 'read',
		description:
			'List delivery orders with search, scheduled-day, status and group filters plus page paging',
	},
	'orders.create': {
		riskLevel: 'write',
		description:
			'Create a delivery order from an address, with its contact, time window, load and facility details',
	},
	'vehicles.list': {
		riskLevel: 'read',
		description:
			'List the fleet with filters for operational state, profile and telematics connection',
	},
	'vehicles.create': {
		riskLevel: 'write',
		description:
			'Add a vehicle to the fleet with its plate, dimensions, capacity profile and skills',
	},
	'addresses.list': {
		riskLevel: 'read',
		description:
			'List address book contacts with a display filter, a search phrase and limit/offset paging',
	},
	'addresses.create': {
		riskLevel: 'write',
		description:
			'Add a contact to the address book; the coordinates are required alongside the street address',
	},
	'team.me': {
		riskLevel: 'read',
		description:
			'Read the account the key belongs to: owner, timezone and optimization profile',
	},
	'team.list': {
		riskLevel: 'read',
		description:
			'List the team members on the account, optionally limited to drivers or to one optimization',
	},
	'optimizations.list': {
		riskLevel: 'read',
		description:
			'List optimization problems by state and date range, or read exactly one when an id is given',
	},
	'optimizations.get': {
		riskLevel: 'read',
		description:
			'Fetch one optimization problem with its state, parameters and its solved routes',
	},
	'optimizations.create': {
		riskLevel: 'write',
		description:
			'Submit addresses for optimization; the solver runs in the background and returns a problem id and state',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof route4meEndpointsNested>;

export type BaseRoute4mePlugin<T extends Route4mePluginOptions> = CorsairPlugin<
	'route4me',
	typeof Route4meSchema,
	typeof route4meEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalRoute4mePlugin = BaseRoute4mePlugin<Route4mePluginOptions>;

export type ExternalRoute4mePlugin<T extends Route4mePluginOptions> =
	BaseRoute4mePlugin<T>;

export function route4me<const T extends Route4mePluginOptions>(
	incomingOptions: Route4mePluginOptions & T = {} as Route4mePluginOptions & T,
): ExternalRoute4mePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'route4me',
		schema: Route4meSchema,
		options: options,
		hooks: options.hooks,
		endpoints: route4meEndpointsNested,
		webhooks: {},
		endpointMeta: route4meEndpointMeta,
		endpointSchemas: route4meEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: Route4meKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('route4me', ctx.authType ?? 'api_key');
		},
	} satisfies InternalRoute4mePlugin;
}

export { Route4MeAPIError } from './client';

export type {
	AddressesCreateInput,
	AddressesCreateResponse,
	AddressesListInput,
	AddressesListResponse,
	OptimizationsCreateInput,
	OptimizationsCreateResponse,
	OptimizationsGetInput,
	OptimizationsGetResponse,
	OptimizationsListInput,
	OptimizationsListResponse,
	OrdersCreateInput,
	OrdersCreateResponse,
	OrdersListInput,
	OrdersListResponse,
	Route4MeAddress,
	Route4MeDestination,
	Route4MeEndpointInputs,
	Route4MeEndpointOutputs,
	Route4MeMember,
	Route4MeOptimization,
	Route4MeOrder,
	Route4MeRouteScout,
	Route4MeVehicle,
	RoutesGetInput,
	RoutesGetResponse,
	RoutesListInput,
	RoutesListResponse,
	TeamListInput,
	TeamListResponse,
	TeamMeInput,
	TeamMeResponse,
	VehiclesCreateInput,
	VehiclesCreateResponse,
	VehiclesListInput,
	VehiclesListResponse,
} from './endpoints/types';
