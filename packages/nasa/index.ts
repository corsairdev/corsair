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
import { Apod, Donki, Eonet, Epic, Images, Neo } from './endpoints';
import type {
	NasaEndpointInputs,
	NasaEndpointOutputs,
} from './endpoints/types';
import {
	NasaEndpointInputSchemas,
	NasaEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { NasaSchema } from './schema';

export type NasaPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalNasaPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof nasaEndpointsNested>;
};

export type NasaContext = CorsairPluginContext<
	typeof NasaSchema,
	NasaPluginOptions
>;

export type NasaKeyBuilderContext = KeyBuilderContext<NasaPluginOptions>;

export type NasaBoundEndpoints = BindEndpoints<typeof nasaEndpointsNested>;

type NasaEndpoint<K extends keyof NasaEndpointOutputs> = CorsairEndpoint<
	NasaContext,
	NasaEndpointInputs[K],
	NasaEndpointOutputs[K]
>;

export type NasaEndpoints = {
	apodList: NasaEndpoint<'apodList'>;
	apodGet: NasaEndpoint<'apodGet'>;
	neoFeed: NasaEndpoint<'neoFeed'>;
	neoLookup: NasaEndpoint<'neoLookup'>;
	neoBrowse: NasaEndpoint<'neoBrowse'>;
	cmeList: NasaEndpoint<'cmeList'>;
	cmeAnalysisList: NasaEndpoint<'cmeAnalysisList'>;
	geomagneticStormList: NasaEndpoint<'geomagneticStormList'>;
	solarFlareList: NasaEndpoint<'solarFlareList'>;
	solarEnergeticParticleList: NasaEndpoint<'solarEnergeticParticleList'>;
	magnetopauseCrossingList: NasaEndpoint<'magnetopauseCrossingList'>;
	radiationBeltList: NasaEndpoint<'radiationBeltList'>;
	highSpeedStreamList: NasaEndpoint<'highSpeedStreamList'>;
	interplanetaryShockList: NasaEndpoint<'interplanetaryShockList'>;
	enlilSimulationList: NasaEndpoint<'enlilSimulationList'>;
	notificationList: NasaEndpoint<'notificationList'>;
	epicImages: NasaEndpoint<'epicImages'>;
	epicAvailableDates: NasaEndpoint<'epicAvailableDates'>;
	eonetEvents: NasaEndpoint<'eonetEvents'>;
	eonetEvent: NasaEndpoint<'eonetEvent'>;
	eonetCategories: NasaEndpoint<'eonetCategories'>;
	imageSearch: NasaEndpoint<'imageSearch'>;
	imageAsset: NasaEndpoint<'imageAsset'>;
	imageMetadata: NasaEndpoint<'imageMetadata'>;
};

export const nasaEndpointsNested = {
	apod: {
		list: Apod.list,
		get: Apod.get,
	},
	neo: {
		feed: Neo.feed,
		lookup: Neo.lookup,
		browse: Neo.browse,
	},
	donki: {
		cme: Donki.cmeList,
		cmeAnalysis: Donki.cmeAnalysisList,
		geomagneticStorm: Donki.geomagneticStormList,
		solarFlare: Donki.solarFlareList,
		solarEnergeticParticle: Donki.solarEnergeticParticleList,
		magnetopauseCrossing: Donki.magnetopauseCrossingList,
		radiationBelt: Donki.radiationBeltList,
		highSpeedStream: Donki.highSpeedStreamList,
		interplanetaryShock: Donki.interplanetaryShockList,
		enlilSimulation: Donki.enlilSimulationList,
		notification: Donki.notificationList,
	},
	epic: {
		images: Epic.images,
		availableDates: Epic.availableDates,
	},
	eonet: {
		events: Eonet.events,
		event: Eonet.event,
		categories: Eonet.categories,
	},
	images: {
		search: Images.search,
		asset: Images.asset,
		metadata: Images.metadata,
	},
} as const;

export const nasaEndpointSchemas = {
	'apod.list': {
		input: NasaEndpointInputSchemas.apodList,
		output: NasaEndpointOutputSchemas.apodList,
	},
	'apod.get': {
		input: NasaEndpointInputSchemas.apodGet,
		output: NasaEndpointOutputSchemas.apodGet,
	},
	'neo.feed': {
		input: NasaEndpointInputSchemas.neoFeed,
		output: NasaEndpointOutputSchemas.neoFeed,
	},
	'neo.lookup': {
		input: NasaEndpointInputSchemas.neoLookup,
		output: NasaEndpointOutputSchemas.neoLookup,
	},
	'neo.browse': {
		input: NasaEndpointInputSchemas.neoBrowse,
		output: NasaEndpointOutputSchemas.neoBrowse,
	},
	'donki.cme': {
		input: NasaEndpointInputSchemas.cmeList,
		output: NasaEndpointOutputSchemas.cmeList,
	},
	'donki.cmeAnalysis': {
		input: NasaEndpointInputSchemas.cmeAnalysisList,
		output: NasaEndpointOutputSchemas.cmeAnalysisList,
	},
	'donki.geomagneticStorm': {
		input: NasaEndpointInputSchemas.geomagneticStormList,
		output: NasaEndpointOutputSchemas.geomagneticStormList,
	},
	'donki.solarFlare': {
		input: NasaEndpointInputSchemas.solarFlareList,
		output: NasaEndpointOutputSchemas.solarFlareList,
	},
	'donki.solarEnergeticParticle': {
		input: NasaEndpointInputSchemas.solarEnergeticParticleList,
		output: NasaEndpointOutputSchemas.solarEnergeticParticleList,
	},
	'donki.magnetopauseCrossing': {
		input: NasaEndpointInputSchemas.magnetopauseCrossingList,
		output: NasaEndpointOutputSchemas.magnetopauseCrossingList,
	},
	'donki.radiationBelt': {
		input: NasaEndpointInputSchemas.radiationBeltList,
		output: NasaEndpointOutputSchemas.radiationBeltList,
	},
	'donki.highSpeedStream': {
		input: NasaEndpointInputSchemas.highSpeedStreamList,
		output: NasaEndpointOutputSchemas.highSpeedStreamList,
	},
	'donki.interplanetaryShock': {
		input: NasaEndpointInputSchemas.interplanetaryShockList,
		output: NasaEndpointOutputSchemas.interplanetaryShockList,
	},
	'donki.enlilSimulation': {
		input: NasaEndpointInputSchemas.enlilSimulationList,
		output: NasaEndpointOutputSchemas.enlilSimulationList,
	},
	'donki.notification': {
		input: NasaEndpointInputSchemas.notificationList,
		output: NasaEndpointOutputSchemas.notificationList,
	},
	'epic.images': {
		input: NasaEndpointInputSchemas.epicImages,
		output: NasaEndpointOutputSchemas.epicImages,
	},
	'epic.availableDates': {
		input: NasaEndpointInputSchemas.epicAvailableDates,
		output: NasaEndpointOutputSchemas.epicAvailableDates,
	},
	'eonet.events': {
		input: NasaEndpointInputSchemas.eonetEvents,
		output: NasaEndpointOutputSchemas.eonetEvents,
	},
	'eonet.event': {
		input: NasaEndpointInputSchemas.eonetEvent,
		output: NasaEndpointOutputSchemas.eonetEvent,
	},
	'eonet.categories': {
		input: NasaEndpointInputSchemas.eonetCategories,
		output: NasaEndpointOutputSchemas.eonetCategories,
	},
	'images.search': {
		input: NasaEndpointInputSchemas.imageSearch,
		output: NasaEndpointOutputSchemas.imageSearch,
	},
	'images.asset': {
		input: NasaEndpointInputSchemas.imageAsset,
		output: NasaEndpointOutputSchemas.imageAsset,
	},
	'images.metadata': {
		input: NasaEndpointInputSchemas.imageMetadata,
		output: NasaEndpointOutputSchemas.imageMetadata,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof nasaEndpointsNested>;

const defaultAuthType = 'api_key' as const;

const nasaEndpointMeta = {
	'apod.list': {
		riskLevel: 'read',
		description:
			'List Astronomy Picture of the Day entries, newest first, or a date range in the legacy YYMMDD form; NASA serves at most 25 per page',
	},
	'apod.get': {
		riskLevel: 'read',
		description:
			"Read one day's picture by its six-digit date code, with title, explanation, image URLs and the raw HTML page",
	},
	'neo.feed': {
		riskLevel: 'read',
		description:
			'List asteroids making close approaches in a date window of at most seven days, grouped by the day of approach',
	},
	'neo.lookup': {
		riskLevel: 'read',
		description:
			"Read one asteroid's full record, including its orbital elements and every recorded close approach",
	},
	'neo.browse': {
		riskLevel: 'read',
		description:
			'Page through the whole near-Earth asteroid catalogue, with the total page count in the response',
	},
	'donki.cme': {
		riskLevel: 'read',
		description:
			'List coronal mass ejections in a date range, with the analyses and ENLIL model runs attached to each',
	},
	'donki.cmeAnalysis': {
		riskLevel: 'read',
		description:
			"List standalone CME analyses, filterable by speed, half angle, catalog and the provider's most-accurate flag",
	},
	'donki.geomagneticStorm': {
		riskLevel: 'read',
		description:
			'List geomagnetic storms in a date range, with the Kp index readings behind each one',
	},
	'donki.solarFlare': {
		riskLevel: 'read',
		description:
			'List solar flares in a date range, with begin, peak and end times, the class and the active region',
	},
	'donki.solarEnergeticParticle': {
		riskLevel: 'read',
		description: 'List solar energetic particle events in a date range',
	},
	'donki.magnetopauseCrossing': {
		riskLevel: 'read',
		description: 'List magnetopause crossings in a date range',
	},
	'donki.radiationBelt': {
		riskLevel: 'read',
		description: 'List radiation belt enhancements in a date range',
	},
	'donki.highSpeedStream': {
		riskLevel: 'read',
		description:
			'List high speed solar wind streams in a date range, with the events each one is linked to',
	},
	'donki.interplanetaryShock': {
		riskLevel: 'read',
		description:
			'List interplanetary shocks in a date range, filterable by the observing spacecraft and the catalog',
	},
	'donki.enlilSimulation': {
		riskLevel: 'read',
		description:
			'List WSA-ENLIL model runs in a date range, with their CME inputs and the estimated arrival at each spacecraft',
	},
	'donki.notification': {
		riskLevel: 'read',
		description:
			'List space weather notifications in a date window of at most 30 days, readable as text or filtered to one event type',
	},
	'epic.images': {
		riskLevel: 'read',
		description:
			"Read DSCOVR EPIC's full-disc imagery metadata for the most recent day or one given day, in natural or enhanced colour",
	},
	'epic.availableDates': {
		riskLevel: 'read',
		description: 'List every day that has EPIC imagery, oldest first',
	},
	'eonet.events': {
		riskLevel: 'read',
		description:
			"List NASA's curated natural events, such as wildfires and storms, filterable by category, source, date window, magnitude and bounding box",
	},
	'eonet.event': {
		riskLevel: 'read',
		description:
			'Read one EONET event with its categories, sources and the geometry of each observation',
	},
	'eonet.categories': {
		riskLevel: 'read',
		description: 'List the EONET categories events can be filed under',
	},
	'images.search': {
		riskLevel: 'read',
		description:
			'Search the NASA Image and Video Library by text, centre, keywords, media type or year window, with the total hit count and the next page',
	},
	'images.asset': {
		riskLevel: 'read',
		description:
			"List an asset's downloadable file URLs at every size, and the metadata.json entry among them",
	},
	'images.metadata': {
		riskLevel: 'read',
		description:
			"Return the URL of an asset's metadata.json, which holds the raw EXIF and file details",
	},
} as const satisfies RequiredPluginEndpointMeta<typeof nasaEndpointsNested>;

export type BaseNasaPlugin<T extends NasaPluginOptions> = CorsairPlugin<
	'nasa',
	typeof NasaSchema,
	typeof nasaEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalNasaPlugin = BaseNasaPlugin<NasaPluginOptions>;

export type ExternalNasaPlugin<T extends NasaPluginOptions> = BaseNasaPlugin<T>;

export function nasa<const T extends NasaPluginOptions>(
	incomingOptions: NasaPluginOptions & T = {} as NasaPluginOptions & T,
): ExternalNasaPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'nasa',
		schema: NasaSchema,
		options: options,
		hooks: options.hooks,
		endpoints: nasaEndpointsNested,
		webhooks: {},
		endpointMeta: nasaEndpointMeta,
		endpointSchemas: nasaEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: NasaKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('nasa', ctx.authType ?? 'api_key');
		},
	} satisfies InternalNasaPlugin;
}

export { nasaErrorCode } from './client';

export type {
	ApodGetInput,
	ApodGetResponse,
	ApodListInput,
	ApodListResponse,
	CmeAnalysisInput,
	CmeAnalysisListResponse,
	CmeListInput,
	CmeListResponse,
	DateRangeInput,
	DonkiCme,
	DonkiCmeAnalysis,
	DonkiEnlilSimulation,
	DonkiGeomagneticStorm,
	DonkiInterplanetaryShock,
	DonkiNotification,
	DonkiSolarFlare,
	EnlilSimulationInput,
	EnlilSimulationListResponse,
	EonetCategoriesResponse,
	EonetEventInput,
	EonetEventResponse,
	EonetEventsInput,
	EonetEventsResponse,
	EpicAvailableResponse,
	EpicImageListResponse,
	EventTimeActivityListResponse,
	GeomagneticStormListResponse,
	HighSpeedStreamListResponse,
	ImageAssetInput,
	ImageAssetResponse,
	ImageMetadataResponse,
	ImageSearchInput,
	ImageSearchResponse,
	InterplanetaryShockInput,
	InterplanetaryShockListResponse,
	MagnetopauseListResponse,
	NasaApodEntry,
	NasaEonetEvent,
	NasaEpicImage,
	NasaImageItem,
	NasaNearEarthObject,
	NeoBrowseInput,
	NeoBrowseResponse,
	NeoFeedInput,
	NeoFeedResponse,
	NeoLookupInput,
	NeoLookupResponse,
	NotificationInput,
	NotificationListResponse,
	RadiationBeltListResponse,
	SolarEnergeticParticleListResponse,
	SolarFlareListResponse,
} from './endpoints/types';
