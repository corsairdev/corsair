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
import { Export, Stats, Websites } from './endpoints';
import type {
	SimpleanalyticsEndpointInputs,
	SimpleanalyticsEndpointOutputs,
} from './endpoints/types';
import {
	SimpleanalyticsEndpointInputSchemas,
	SimpleanalyticsEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { SimpleanalyticsSchema } from './schema';

/**
 * The Admin API needs the user id beside the API key, as a `User-Id` header.
 * It is a second account credential, not part of the key: core's key manager
 * only creates accessors for account-level `authConfig` fields, so both live on
 * the account and are read through it.
 */
export const simpleanalyticsAuthConfig = {
	api_key: {
		account: ['user_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type SimpleanalyticsPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalSimpleanalyticsPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof simpleanalyticsEndpointsNested>;
};

export type SimpleanalyticsContext = CorsairPluginContext<
	typeof SimpleanalyticsSchema,
	SimpleanalyticsPluginOptions,
	// The endpoints are not passed here: they reference this context through
	// SimpleanalyticsEndpoint, and passing them back would make the type circular.
	undefined,
	typeof simpleanalyticsAuthConfig
>;

export type SimpleanalyticsKeyBuilderContext = KeyBuilderContext<
	SimpleanalyticsPluginOptions,
	typeof simpleanalyticsAuthConfig
>;

export type SimpleanalyticsBoundEndpoints = BindEndpoints<
	typeof simpleanalyticsEndpointsNested
>;

type SimpleanalyticsEndpoint<K extends keyof SimpleanalyticsEndpointOutputs> =
	CorsairEndpoint<
		SimpleanalyticsContext,
		SimpleanalyticsEndpointInputs[K],
		SimpleanalyticsEndpointOutputs[K]
	>;

export type SimpleanalyticsEndpoints = {
	statsGet: SimpleanalyticsEndpoint<'statsGet'>;
	exportDatapoints: SimpleanalyticsEndpoint<'exportDatapoints'>;
	websitesList: SimpleanalyticsEndpoint<'websitesList'>;
	websitesAdd: SimpleanalyticsEndpoint<'websitesAdd'>;
};

const simpleanalyticsEndpointsNested = {
	stats: {
		get: Stats.get,
	},
	export: {
		datapoints: Export.datapoints,
	},
	websites: {
		list: Websites.list,
		add: Websites.add,
	},
} as const;

export const simpleanalyticsEndpointSchemas = {
	'stats.get': {
		input: SimpleanalyticsEndpointInputSchemas.statsGet,
		output: SimpleanalyticsEndpointOutputSchemas.statsGet,
	},
	'export.datapoints': {
		input: SimpleanalyticsEndpointInputSchemas.exportDatapoints,
		output: SimpleanalyticsEndpointOutputSchemas.exportDatapoints,
	},
	'websites.list': {
		input: SimpleanalyticsEndpointInputSchemas.websitesList,
		output: SimpleanalyticsEndpointOutputSchemas.websitesList,
	},
	'websites.add': {
		input: SimpleanalyticsEndpointInputSchemas.websitesAdd,
		output: SimpleanalyticsEndpointOutputSchemas.websitesAdd,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof simpleanalyticsEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

export const simpleanalyticsEndpointMeta = {
	'stats.get': {
		riskLevel: 'read',
		description:
			'Read aggregated stats for one website: page views, visitors, top pages, countries, referrers, UTM values, browsers, operating systems, devices, time on page and event counts',
	},
	'export.datapoints': {
		riskLevel: 'read',
		description:
			'Export raw page views and events for a date range as JSON datapoints, unsampled, with the fields you name',
	},
	'websites.list': {
		riskLevel: 'read',
		description:
			'List every website on the account with its timezone, visibility, whether the script is installed, and its 30-day page view and event estimates; needs the user id',
	},
	'websites.add': {
		riskLevel: 'write',
		description:
			'Add a website to the default team, optionally public, with a timezone and a label; needs the owner, admin or developer role and the user id',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof simpleanalyticsEndpointsNested
>;

export type BaseSimpleanalyticsPlugin<T extends SimpleanalyticsPluginOptions> =
	CorsairPlugin<
		'simpleanalytics',
		typeof SimpleanalyticsSchema,
		typeof simpleanalyticsEndpointsNested,
		{},
		T,
		typeof defaultAuthType,
		typeof simpleanalyticsAuthConfig
	>;

export type InternalSimpleanalyticsPlugin =
	BaseSimpleanalyticsPlugin<SimpleanalyticsPluginOptions>;

export type ExternalSimpleanalyticsPlugin<
	T extends SimpleanalyticsPluginOptions,
> = BaseSimpleanalyticsPlugin<T>;

export function simpleanalytics<const T extends SimpleanalyticsPluginOptions>(
	incomingOptions: SimpleanalyticsPluginOptions &
		T = {} as SimpleanalyticsPluginOptions & T,
): ExternalSimpleanalyticsPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'simpleanalytics',
		authConfig: simpleanalyticsAuthConfig,
		schema: SimpleanalyticsSchema,
		options: options,
		hooks: options.hooks,
		endpoints: simpleanalyticsEndpointsNested,
		webhooks: {},
		endpointMeta: simpleanalyticsEndpointMeta,
		endpointSchemas: simpleanalyticsEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: SimpleanalyticsKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('simpleanalytics', ctx.authType ?? 'api_key');
		},
	} satisfies InternalSimpleanalyticsPlugin;
}

export { SimpleanalyticsAPIError } from './client';

export type {
	ExportDatapointsInput,
	ExportDatapointsResponse,
	SimpleanalyticsDatapoint,
	SimpleanalyticsEndpointInputs,
	SimpleanalyticsEndpointOutputs,
	SimpleanalyticsWebsite,
	StatsGetInput,
	StatsGetResponse,
	WebsitesAddInput,
	WebsitesAddResponse,
	WebsitesListInput,
	WebsitesListResponse,
} from './endpoints/types';
