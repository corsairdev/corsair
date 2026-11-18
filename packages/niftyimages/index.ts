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
import { Account, Widgets } from './endpoints';
import type {
	NiftyimagesEndpointInputs,
	NiftyimagesEndpointOutputs,
} from './endpoints/types';
import {
	NiftyimagesEndpointInputSchemas,
	NiftyimagesEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { NiftyimagesSchema } from './schema';

export type NiftyimagesPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** An NiftyImages API key, from the account settings page. */
	key?: string;
	hooks?: InternalNiftyimagesPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof niftyimagesEndpointsNested>;
};

export type NiftyimagesContext = CorsairPluginContext<
	typeof NiftyimagesSchema,
	NiftyimagesPluginOptions
>;

export type NiftyimagesKeyBuilderContext =
	KeyBuilderContext<NiftyimagesPluginOptions>;

export type NiftyimagesBoundEndpoints = BindEndpoints<
	typeof niftyimagesEndpointsNested
>;

type NiftyimagesEndpoint<K extends keyof NiftyimagesEndpointOutputs> =
	CorsairEndpoint<
		NiftyimagesContext,
		NiftyimagesEndpointInputs[K],
		NiftyimagesEndpointOutputs[K]
	>;

export type NiftyimagesEndpoints = {
	widgetsList: NiftyimagesEndpoint<'widgetsList'>;
	widgetsStats: NiftyimagesEndpoint<'widgetsStats'>;
	widgetsUsers: NiftyimagesEndpoint<'widgetsUsers'>;
	widgetUserStats: NiftyimagesEndpoint<'widgetUserStats'>;
	widgetImages: NiftyimagesEndpoint<'widgetImages'>;
	widgetUserImages: NiftyimagesEndpoint<'widgetUserImages'>;
	storeFields: NiftyimagesEndpoint<'storeFields'>;
	storeAddRecord: NiftyimagesEndpoint<'storeAddRecord'>;
	storeDeleteById: NiftyimagesEndpoint<'storeDeleteById'>;
	storeDeleteRecord: NiftyimagesEndpoint<'storeDeleteRecord'>;
	timerUpdate: NiftyimagesEndpoint<'timerUpdate'>;
	mapsList: NiftyimagesEndpoint<'mapsList'>;
	mapsGet: NiftyimagesEndpoint<'mapsGet'>;
	mapsSearch: NiftyimagesEndpoint<'mapsSearch'>;
	mapsAddLocation: NiftyimagesEndpoint<'mapsAddLocation'>;
	mapsUpdateLocation: NiftyimagesEndpoint<'mapsUpdateLocation'>;
	mapsDeleteLocation: NiftyimagesEndpoint<'mapsDeleteLocation'>;
	beeUsers: NiftyimagesEndpoint<'beeUsers'>;
	beeUserImages: NiftyimagesEndpoint<'beeUserImages'>;
	beeSuspendUser: NiftyimagesEndpoint<'beeSuspendUser'>;
	widgetSuspendUser: NiftyimagesEndpoint<'widgetSuspendUser'>;
	imagesList: NiftyimagesEndpoint<'imagesList'>;
	imagesStats: NiftyimagesEndpoint<'imagesStats'>;
	imagesGet: NiftyimagesEndpoint<'imagesGet'>;
	imagesDelete: NiftyimagesEndpoint<'imagesDelete'>;
	psdGet: NiftyimagesEndpoint<'psdGet'>;
	psdUpdate: NiftyimagesEndpoint<'psdUpdate'>;
};

export const niftyimagesEndpointsNested = {
	widgets: {
		list: Widgets.list,
		stats: Widgets.stats,
		users: Widgets.users,
		userStats: Widgets.userStats,
		images: Widgets.images,
		userImages: Widgets.userImages,
		suspendUser: Account.widgetSuspendUser,
	},
	store: {
		fields: Account.storeFields,
		addRecord: Account.storeAddRecord,
		deleteById: Account.storeDeleteById,
		deleteRecord: Account.storeDeleteRecord,
	},
	timers: {
		updateTargetDate: Account.timerUpdate,
	},
	maps: {
		list: Account.mapsList,
		get: Account.mapsGet,
		searchLocations: Account.mapsSearch,
		addLocation: Account.mapsAddLocation,
		updateLocation: Account.mapsUpdateLocation,
		deleteLocation: Account.mapsDeleteLocation,
	},
	beePlugin: {
		users: Account.beeUsers,
		userImages: Account.beeUserImages,
		suspendUser: Account.beeSuspendUser,
	},
	images: {
		list: Account.imagesList,
		stats: Account.imagesStats,
		get: Account.imagesGet,
		delete: Account.imagesDelete,
	},
	psd: {
		get: Account.psdGet,
		update: Account.psdUpdate,
	},
} as const;

export const niftyimagesEndpointSchemas = {
	'widgets.list': {
		input: NiftyimagesEndpointInputSchemas.widgetsList,
		output: NiftyimagesEndpointOutputSchemas.widgetsList,
	},
	'widgets.stats': {
		input: NiftyimagesEndpointInputSchemas.widgetsStats,
		output: NiftyimagesEndpointOutputSchemas.widgetsStats,
	},
	'widgets.users': {
		input: NiftyimagesEndpointInputSchemas.widgetsUsers,
		output: NiftyimagesEndpointOutputSchemas.widgetsUsers,
	},
	'widgets.userStats': {
		input: NiftyimagesEndpointInputSchemas.widgetUserStats,
		output: NiftyimagesEndpointOutputSchemas.widgetUserStats,
	},
	'widgets.images': {
		input: NiftyimagesEndpointInputSchemas.widgetImages,
		output: NiftyimagesEndpointOutputSchemas.widgetImages,
	},
	'widgets.userImages': {
		input: NiftyimagesEndpointInputSchemas.widgetUserImages,
		output: NiftyimagesEndpointOutputSchemas.widgetUserImages,
	},
	'store.fields': {
		input: NiftyimagesEndpointInputSchemas.storeFields,
		output: NiftyimagesEndpointOutputSchemas.storeFields,
	},
	'store.addRecord': {
		input: NiftyimagesEndpointInputSchemas.storeAddRecord,
		output: NiftyimagesEndpointOutputSchemas.storeAddRecord,
	},
	'store.deleteById': {
		input: NiftyimagesEndpointInputSchemas.storeDeleteById,
		output: NiftyimagesEndpointOutputSchemas.storeDeleteById,
	},
	'store.deleteRecord': {
		input: NiftyimagesEndpointInputSchemas.storeDeleteRecord,
		output: NiftyimagesEndpointOutputSchemas.storeDeleteRecord,
	},
	'timers.updateTargetDate': {
		input: NiftyimagesEndpointInputSchemas.timerUpdate,
		output: NiftyimagesEndpointOutputSchemas.timerUpdate,
	},
	'maps.list': {
		input: NiftyimagesEndpointInputSchemas.mapsList,
		output: NiftyimagesEndpointOutputSchemas.mapsList,
	},
	'maps.get': {
		input: NiftyimagesEndpointInputSchemas.mapsGet,
		output: NiftyimagesEndpointOutputSchemas.mapsGet,
	},
	'maps.searchLocations': {
		input: NiftyimagesEndpointInputSchemas.mapsSearch,
		output: NiftyimagesEndpointOutputSchemas.mapsSearch,
	},
	'maps.addLocation': {
		input: NiftyimagesEndpointInputSchemas.mapsAddLocation,
		output: NiftyimagesEndpointOutputSchemas.mapsAddLocation,
	},
	'maps.updateLocation': {
		input: NiftyimagesEndpointInputSchemas.mapsUpdateLocation,
		output: NiftyimagesEndpointOutputSchemas.mapsUpdateLocation,
	},
	'maps.deleteLocation': {
		input: NiftyimagesEndpointInputSchemas.mapsDeleteLocation,
		output: NiftyimagesEndpointOutputSchemas.mapsDeleteLocation,
	},
	'beePlugin.users': {
		input: NiftyimagesEndpointInputSchemas.beeUsers,
		output: NiftyimagesEndpointOutputSchemas.beeUsers,
	},
	'beePlugin.userImages': {
		input: NiftyimagesEndpointInputSchemas.beeUserImages,
		output: NiftyimagesEndpointOutputSchemas.beeUserImages,
	},
	'beePlugin.suspendUser': {
		input: NiftyimagesEndpointInputSchemas.beeSuspendUser,
		output: NiftyimagesEndpointOutputSchemas.beeSuspendUser,
	},
	'widgets.suspendUser': {
		input: NiftyimagesEndpointInputSchemas.widgetSuspendUser,
		output: NiftyimagesEndpointOutputSchemas.widgetSuspendUser,
	},
	'images.list': {
		input: NiftyimagesEndpointInputSchemas.imagesList,
		output: NiftyimagesEndpointOutputSchemas.imagesList,
	},
	'images.stats': {
		input: NiftyimagesEndpointInputSchemas.imagesStats,
		output: NiftyimagesEndpointOutputSchemas.imagesStats,
	},
	'images.get': {
		input: NiftyimagesEndpointInputSchemas.imagesGet,
		output: NiftyimagesEndpointOutputSchemas.imagesGet,
	},
	'images.delete': {
		input: NiftyimagesEndpointInputSchemas.imagesDelete,
		output: NiftyimagesEndpointOutputSchemas.imagesDelete,
	},
	'psd.get': {
		input: NiftyimagesEndpointInputSchemas.psdGet,
		output: NiftyimagesEndpointOutputSchemas.psdGet,
	},
	'psd.update': {
		input: NiftyimagesEndpointInputSchemas.psdUpdate,
		output: NiftyimagesEndpointOutputSchemas.psdUpdate,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof niftyimagesEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const niftyimagesEndpointMeta = {
	'widgets.list': {
		riskLevel: 'read',
		description:
			'List the account’s widgets with their names and keys, which every other widget call needs',
	},
	'widgets.stats': {
		riskLevel: 'read',
		description:
			'Read per-widget user, image and impression counts for a time window, for every widget at once',
	},
	'widgets.users': {
		riskLevel: 'read',
		description:
			'List the users one widget recorded in a time window, with their image and impression counts and whether they are suspended',
	},
	'widgets.userStats': {
		riskLevel: 'read',
		description: 'Read aggregated stats for one recipient of one widget',
	},
	'widgets.images': {
		riskLevel: 'read',
		description:
			'List the images a widget generated in a time window, with each image’s URL and own counts',
	},
	'widgets.userImages': {
		riskLevel: 'read',
		description: 'List the images a widget generated for one recipient',
	},
	'store.fields': {
		riskLevel: 'read',
		description:
			'List the Data Store fields with their types and which ones are unique',
	},
	'store.addRecord': {
		riskLevel: 'write',
		description:
			'Add a Data Store record, or update the one whose unique fields match',
	},
	'store.deleteById': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a Data Store record by its id (the value of its unique field)',
	},
	'store.deleteRecord': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete the Data Store record whose unique fields match the ones given',
	},
	'timers.updateTargetDate': {
		riskLevel: 'write',
		description:
			'Move a countdown timer to a new target date, optionally shifted by hours, days or months',
	},
	'maps.list': {
		riskLevel: 'read',
		description: 'List the map images in the account with their opens',
	},
	'maps.get': {
		riskLevel: 'read',
		description:
			'Read one map: how many locations are searchable, failed or queued, plus opens and clicks',
	},
	'maps.searchLocations': {
		riskLevel: 'read',
		description:
			'Find locations in a map by address, location id, NiftyID or latitude and longitude',
	},
	'maps.addLocation': {
		riskLevel: 'write',
		description:
			'Add a location to a map by address or coordinates, with custom properties',
	},
	'maps.updateLocation': {
		riskLevel: 'write',
		description: 'Change a map location found by NiftyID or location id',
	},
	'maps.deleteLocation': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Remove a location from a map',
	},
	'beePlugin.users': {
		riskLevel: 'read',
		description:
			'List Bee Plugin users with their image and open counts over a window',
	},
	'beePlugin.userImages': {
		riskLevel: 'read',
		description: 'List the images one Bee Plugin user made over a window',
	},
	'beePlugin.suspendUser': {
		riskLevel: 'write',
		description: 'Suspend or reinstate a Bee Plugin user',
	},
	'widgets.suspendUser': {
		riskLevel: 'write',
		description: 'Suspend or reinstate a widget user',
	},
	'images.list': {
		riskLevel: 'read',
		description:
			'Page through every personalized image and countdown timer in the account',
	},
	'images.stats': {
		riskLevel: 'read',
		description:
			'Opens per image over a date range (the last 30 days by default)',
	},
	'images.get': {
		riskLevel: 'read',
		description:
			'Read one image or timer by its URL: type, opens, dates and whether it is active',
	},
	'images.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete an image or timer by URL; emails that embed it stop showing it',
	},
	'psd.get': {
		riskLevel: 'read',
		description:
			'Read a Photoshop image: its text variables and every layer with its type and settings',
	},
	'psd.update': {
		riskLevel: 'write',
		description:
			'Change a Photoshop image: rename it, set variable defaults, or edit layers by name (text, colours, images, visibility)',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof niftyimagesEndpointsNested
>;

export type BaseNiftyimagesPlugin<T extends NiftyimagesPluginOptions> =
	CorsairPlugin<
		'niftyimages',
		typeof NiftyimagesSchema,
		typeof niftyimagesEndpointsNested,
		{},
		T,
		typeof defaultAuthType
	>;

export type InternalNiftyimagesPlugin =
	BaseNiftyimagesPlugin<NiftyimagesPluginOptions>;

export type ExternalNiftyimagesPlugin<T extends NiftyimagesPluginOptions> =
	BaseNiftyimagesPlugin<T>;

export function niftyimages<const T extends NiftyimagesPluginOptions>(
	// The cast only types the empty default: every option is optional, so `{}`
	// is a valid NiftyimagesPluginOptions, and T is inferred from the caller.
	incomingOptions: NiftyimagesPluginOptions &
		T = {} as NiftyimagesPluginOptions & T,
): ExternalNiftyimagesPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'niftyimages',
		schema: NiftyimagesSchema,
		options: options,
		hooks: options.hooks,
		endpoints: niftyimagesEndpointsNested,
		webhooks: {},
		endpointMeta: niftyimagesEndpointMeta,
		endpointSchemas: niftyimagesEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: NiftyimagesKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('niftyimages', ctx.authType ?? 'api_key');
		},
	} satisfies InternalNiftyimagesPlugin;
}

export { NiftyimagesAPIError } from './client';

export type {
	NiftyimagesEndpointInputs,
	NiftyimagesEndpointOutputs,
	NiftyimagesUserStats,
	NiftyimagesWidget,
	NiftyimagesWidgetImage,
	NiftyimagesWidgetStats,
	NiftyimagesWidgetUser,
	WidgetImagesInput,
	WidgetImagesResponse,
	WidgetsListInput,
	WidgetsListResponse,
	WidgetsStatsInput,
	WidgetsStatsResponse,
	WidgetUserImagesInput,
	WidgetUserImagesResponse,
	WidgetUserStatsInput,
	WidgetUserStatsResponse,
	WidgetUsersInput,
	WidgetUsersResponse,
} from './endpoints/types';
