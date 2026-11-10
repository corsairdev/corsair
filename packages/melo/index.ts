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
import { Indicators, Properties, Searches, Webhooks } from './endpoints';
import type {
	MeloEndpointInputs,
	MeloEndpointOutputs,
} from './endpoints/types';
import {
	MeloEndpointInputSchemas,
	MeloEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { MeloSchema } from './schema';

export type MeloPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalMeloPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof meloEndpointsNested>;
};

export type MeloContext = CorsairPluginContext<
	typeof MeloSchema,
	MeloPluginOptions
>;

export type MeloKeyBuilderContext = KeyBuilderContext<MeloPluginOptions>;

export type MeloBoundEndpoints = BindEndpoints<typeof meloEndpointsNested>;

type MeloEndpoint<K extends keyof MeloEndpointOutputs> = CorsairEndpoint<
	MeloContext,
	MeloEndpointInputs[K],
	MeloEndpointOutputs[K]
>;

export type MeloEndpoints = {
	propertiesList: MeloEndpoint<'propertiesList'>;
	propertiesGet: MeloEndpoint<'propertiesGet'>;
	propertiesListSimilar: MeloEndpoint<'propertiesListSimilar'>;
	indicatorsPricePerMeter: MeloEndpoint<'indicatorsPricePerMeter'>;
	indicatorsPointsOfInterest: MeloEndpoint<'indicatorsPointsOfInterest'>;
	indicatorsLocations: MeloEndpoint<'indicatorsLocations'>;
	indicatorsCities: MeloEndpoint<'indicatorsCities'>;
	searchesList: MeloEndpoint<'searchesList'>;
	searchesGet: MeloEndpoint<'searchesGet'>;
	searchesCreate: MeloEndpoint<'searchesCreate'>;
	searchesUpdate: MeloEndpoint<'searchesUpdate'>;
	searchesDelete: MeloEndpoint<'searchesDelete'>;
	webhooksSimulate: MeloEndpoint<'webhooksSimulate'>;
};

const meloEndpointsNested = {
	properties: {
		list: Properties.list,
		get: Properties.get,
		listSimilar: Properties.listSimilar,
	},
	indicators: {
		pricePerMeter: Indicators.pricePerMeter,
		pointsOfInterest: Indicators.pointsOfInterest,
		locations: Indicators.locations,
		cities: Indicators.cities,
	},
	searches: {
		list: Searches.list,
		get: Searches.get,
		create: Searches.create,
		update: Searches.update,
		delete: Searches.remove,
	},
	webhooks: {
		simulate: Webhooks.simulate,
	},
} as const;

export const meloEndpointSchemas = {
	'properties.list': {
		input: MeloEndpointInputSchemas.propertiesList,
		output: MeloEndpointOutputSchemas.propertiesList,
	},
	'properties.get': {
		input: MeloEndpointInputSchemas.propertiesGet,
		output: MeloEndpointOutputSchemas.propertiesGet,
	},
	'properties.listSimilar': {
		input: MeloEndpointInputSchemas.propertiesListSimilar,
		output: MeloEndpointOutputSchemas.propertiesListSimilar,
	},
	'indicators.pricePerMeter': {
		input: MeloEndpointInputSchemas.indicatorsPricePerMeter,
		output: MeloEndpointOutputSchemas.indicatorsPricePerMeter,
	},
	'indicators.pointsOfInterest': {
		input: MeloEndpointInputSchemas.indicatorsPointsOfInterest,
		output: MeloEndpointOutputSchemas.indicatorsPointsOfInterest,
	},
	'indicators.locations': {
		input: MeloEndpointInputSchemas.indicatorsLocations,
		output: MeloEndpointOutputSchemas.indicatorsLocations,
	},
	'indicators.cities': {
		input: MeloEndpointInputSchemas.indicatorsCities,
		output: MeloEndpointOutputSchemas.indicatorsCities,
	},
	'searches.list': {
		input: MeloEndpointInputSchemas.searchesList,
		output: MeloEndpointOutputSchemas.searchesList,
	},
	'searches.get': {
		input: MeloEndpointInputSchemas.searchesGet,
		output: MeloEndpointOutputSchemas.searchesGet,
	},
	'searches.create': {
		input: MeloEndpointInputSchemas.searchesCreate,
		output: MeloEndpointOutputSchemas.searchesCreate,
	},
	'searches.update': {
		input: MeloEndpointInputSchemas.searchesUpdate,
		output: MeloEndpointOutputSchemas.searchesUpdate,
	},
	'searches.delete': {
		input: MeloEndpointInputSchemas.searchesDelete,
		output: MeloEndpointOutputSchemas.searchesDelete,
	},
	'webhooks.simulate': {
		input: MeloEndpointInputSchemas.webhooksSimulate,
		output: MeloEndpointOutputSchemas.webhooksSimulate,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof meloEndpointsNested>;

const defaultAuthType = 'api_key' as const;

const meloEndpointMeta = {
	'properties.list': {
		riskLevel: 'read',
		description:
			'List French real-estate properties matching filters (location, price, surface, rooms, energy class and more), with paging via nextPage',
	},
	'properties.get': {
		riskLevel: 'read',
		description:
			'Get one property by UUID, with its adverts, city, stations and price events',
	},
	'properties.listSimilar': {
		riskLevel: 'read',
		description: 'List properties similar to a given property, with paging',
	},
	'indicators.pricePerMeter': {
		riskLevel: 'read',
		description:
			'Average, median and time series of the price per meter for properties matching the same filters as properties.list',
	},
	'indicators.pointsOfInterest': {
		riskLevel: 'read',
		description:
			'List schools, kindergartens, restaurants, hospitals or parking within a radius of a coordinate',
	},
	'indicators.locations': {
		riskLevel: 'read',
		description:
			'Search cities and departments by name and get the IRIs used in includedCities and includedDepartments filters; needs a key here although the API serves it publicly',
	},
	'indicators.cities': {
		riskLevel: 'read',
		description:
			'List cities by INSEE code, zipcode, name, label, slug or polygon, with paging',
	},
	'searches.list': {
		riskLevel: 'read',
		description: 'List your saved searches, with paging',
	},
	'searches.get': {
		riskLevel: 'read',
		description: 'Get one saved search by UUID',
	},
	'searches.create': {
		riskLevel: 'write',
		description:
			'Create a saved search; with notificationEnabled and a webhook or email recipient, Melo starts sending matches and events there',
	},
	'searches.update': {
		riskLevel: 'write',
		description:
			'Replace a saved search (PUT) with a full definition, including the required title, transactionType and propertyTypes',
	},
	'searches.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Permanently delete a saved search; its notifications stop and it cannot be restored',
	},
	'webhooks.simulate': {
		riskLevel: 'write',
		description:
			'Ask Melo to send a test match or event payload to a URL you give; this is an API call that sends a request to that URL, not an inbound webhook handler',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof meloEndpointsNested>;

export type BaseMeloPlugin<T extends MeloPluginOptions> = CorsairPlugin<
	'melo',
	typeof MeloSchema,
	typeof meloEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalMeloPlugin = BaseMeloPlugin<MeloPluginOptions>;

export type ExternalMeloPlugin<T extends MeloPluginOptions> = BaseMeloPlugin<T>;

export function melo<const T extends MeloPluginOptions>(
	incomingOptions: MeloPluginOptions & T = {} as MeloPluginOptions & T,
): ExternalMeloPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'melo',
		schema: MeloSchema,
		options: options,
		hooks: options.hooks,
		endpoints: meloEndpointsNested,
		webhooks: {},
		endpointMeta: meloEndpointMeta,
		endpointSchemas: meloEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: MeloKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('melo', ctx.authType ?? 'api_key');
		},
	} satisfies InternalMeloPlugin;
}

export { MeloAPIError } from './client';

export type {
	CitiesInput,
	CitiesResponse,
	LocationsInput,
	LocationsResponse,
	MeloEndpointInputs,
	MeloEndpointOutputs,
	PointsOfInterestInput,
	PointsOfInterestResponse,
	PricePerMeterInput,
	PricePerMeterResponse,
	PropertiesGetInput,
	PropertiesGetResponse,
	PropertiesListInput,
	PropertiesListResponse,
	PropertiesListSimilarInput,
	PropertiesListSimilarResponse,
	SearchesCreateInput,
	SearchesCreateResponse,
	SearchesDeleteInput,
	SearchesDeleteResponse,
	SearchesGetInput,
	SearchesGetResponse,
	SearchesListInput,
	SearchesListResponse,
	SearchesUpdateInput,
	SearchesUpdateResponse,
	WebhooksSimulateInput,
	WebhooksSimulateResponse,
} from './endpoints/types';
