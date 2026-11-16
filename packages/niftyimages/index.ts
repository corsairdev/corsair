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
import { Widgets } from './endpoints';
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
};

export const niftyimagesEndpointsNested = {
	widgets: {
		list: Widgets.list,
		stats: Widgets.stats,
		users: Widgets.users,
		userStats: Widgets.userStats,
		images: Widgets.images,
		userImages: Widgets.userImages,
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
			'Read per-widget view and click counts for a time window, for every widget at once',
	},
	'widgets.users': {
		riskLevel: 'read',
		description:
			'List the recipients one widget recorded in a time window, with their view and click counts',
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
