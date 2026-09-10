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
import { BrightDataEndpointsImpl as Endpoints } from './endpoints';
import type {
	BrightDataEndpointInputs,
	BrightDataEndpointOutputs,
} from './endpoints/types';
import {
	BrightDataEndpointInputSchemas,
	BrightDataEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { BrightDataSchema } from './schema';

export type BrightDataPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalBrightDataPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof brightDataEndpointsNested>;
};

export type BrightDataContext = CorsairPluginContext<
	typeof BrightDataSchema,
	BrightDataPluginOptions
>;

export type BrightDataKeyBuilderContext =
	KeyBuilderContext<BrightDataPluginOptions>;

export type BrightDataBoundEndpoints = BindEndpoints<
	typeof brightDataEndpointsNested
>;

type BrightDataEndpoint<K extends keyof BrightDataEndpointOutputs> =
	CorsairEndpoint<
		BrightDataContext,
		BrightDataEndpointInputs[K],
		BrightDataEndpointOutputs[K]
	>;

export type BrightDataEndpoints = {
	listDatasets: BrightDataEndpoint<'listDatasets'>;
	getSnapshotStatus: BrightDataEndpoint<'getSnapshotStatus'>;
	getSnapshotResults: BrightDataEndpoint<'getSnapshotResults'>;
	filterDataset: BrightDataEndpoint<'filterDataset'>;
	getAvailableCities: BrightDataEndpoint<'getAvailableCities'>;
	getAvailableCountries: BrightDataEndpoint<'getAvailableCountries'>;
	listWebUnlockerZones: BrightDataEndpoint<'listWebUnlockerZones'>;
	serpSearch: BrightDataEndpoint<'serpSearch'>;
	crawlApi: BrightDataEndpoint<'crawlApi'>;
	webUnlocker: BrightDataEndpoint<'webUnlocker'>;
};

const brightDataEndpointsNested = {
	listDatasets: Endpoints.listDatasets,
	getSnapshotStatus: Endpoints.getSnapshotStatus,
	getSnapshotResults: Endpoints.getSnapshotResults,
	filterDataset: Endpoints.filterDataset,
	getAvailableCities: Endpoints.getAvailableCities,
	getAvailableCountries: Endpoints.getAvailableCountries,
	listWebUnlockerZones: Endpoints.listWebUnlockerZones,
	serpSearch: Endpoints.serpSearch,
	crawlApi: Endpoints.crawlApi,
	webUnlocker: Endpoints.webUnlocker,
} as const;

export const brightDataEndpointSchemas = {
	listDatasets: {
		input: BrightDataEndpointInputSchemas.listDatasets,
		output: BrightDataEndpointOutputSchemas.listDatasets,
	},
	getSnapshotStatus: {
		input: BrightDataEndpointInputSchemas.getSnapshotStatus,
		output: BrightDataEndpointOutputSchemas.getSnapshotStatus,
	},
	getSnapshotResults: {
		input: BrightDataEndpointInputSchemas.getSnapshotResults,
		output: BrightDataEndpointOutputSchemas.getSnapshotResults,
	},
	filterDataset: {
		input: BrightDataEndpointInputSchemas.filterDataset,
		output: BrightDataEndpointOutputSchemas.filterDataset,
	},
	getAvailableCities: {
		input: BrightDataEndpointInputSchemas.getAvailableCities,
		output: BrightDataEndpointOutputSchemas.getAvailableCities,
	},
	getAvailableCountries: {
		input: BrightDataEndpointInputSchemas.getAvailableCountries,
		output: BrightDataEndpointOutputSchemas.getAvailableCountries,
	},
	listWebUnlockerZones: {
		input: BrightDataEndpointInputSchemas.listWebUnlockerZones,
		output: BrightDataEndpointOutputSchemas.listWebUnlockerZones,
	},
	serpSearch: {
		input: BrightDataEndpointInputSchemas.serpSearch,
		output: BrightDataEndpointOutputSchemas.serpSearch,
	},
	crawlApi: {
		input: BrightDataEndpointInputSchemas.crawlApi,
		output: BrightDataEndpointOutputSchemas.crawlApi,
	},
	webUnlocker: {
		input: BrightDataEndpointInputSchemas.webUnlocker,
		output: BrightDataEndpointOutputSchemas.webUnlocker,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof brightDataEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const brightDataEndpointMeta = {
	listDatasets: {
		riskLevel: 'read',
		description:
			'Tool to list all available pre-made scrapers (datasets) from Bright Data marketplace. Use when you need to browse available data sources for structured scraping.',
	},
	getSnapshotStatus: {
		riskLevel: 'read',
		description:
			'Tool to check the processing status of a crawl job using snapshot ID. Call before attempting to download results to ensure data collection is complete.',
	},
	getSnapshotResults: {
		riskLevel: 'read',
		description:
			'Tool to retrieve the scraped data from a completed crawl job by snapshot ID. Only call after confirming the job is complete via getSnapshotStatus.',
	},
	filterDataset: {
		riskLevel: 'write',
		description:
			'Tool to apply custom filter criteria to a marketplace dataset (BETA). Use after selecting a dataset to generate a filtered snapshot.',
	},
	getAvailableCities: {
		riskLevel: 'read',
		description:
			'Tool to get available static network cities for a given country. Use when you need to configure static proxy endpoints after selecting a country.',
	},
	getAvailableCountries: {
		riskLevel: 'read',
		description:
			'Tool to list available countries and their ISO 3166-1 alpha-2 codes. Use when you need to configure zones with valid country codes before provisioning proxies.',
	},
	listWebUnlockerZones: {
		riskLevel: 'read',
		description:
			'Tool to list your configured Web Unlocker zones and proxy endpoints. Use to view available zones for web scraping and bot protection bypass.',
	},
	serpSearch: {
		riskLevel: 'read',
		description:
			'Tool to perform SERP searches across search engines using Bright Data SERP API. Use when you need search results, trending topics, or competitive analysis data.',
	},
	crawlApi: {
		riskLevel: 'write',
		description:
			'Tool to trigger an asynchronous site crawl for a dataset and list of URLs. Returns snapshot_id required by getSnapshotStatus and getSnapshotResults.',
	},
	webUnlocker: {
		riskLevel: 'read',
		description:
			'Tool to bypass bot detection, captcha, and other anti-scraping measures to extract content from websites. Use when sites block automated access or require JavaScript rendering.',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof brightDataEndpointsNested
>;

export const brightDataAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseBrightDataPlugin<T extends BrightDataPluginOptions> =
	CorsairPlugin<
		'brightdata',
		typeof BrightDataSchema,
		typeof brightDataEndpointsNested,
		{},
		T,
		typeof defaultAuthType
	>;

export type InternalBrightDataPlugin =
	BaseBrightDataPlugin<BrightDataPluginOptions>;

export type ExternalBrightDataPlugin<T extends BrightDataPluginOptions> =
	BaseBrightDataPlugin<T>;

export function brightdata<const T extends BrightDataPluginOptions>(
	incomingOptions: BrightDataPluginOptions & T = {} as BrightDataPluginOptions &
		T,
): ExternalBrightDataPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'brightdata',
		authConfig: brightDataAuthConfig,
		schema: BrightDataSchema,
		options: options,
		hooks: options.hooks,
		endpoints: brightDataEndpointsNested,
		webhooks: {},
		endpointMeta: brightDataEndpointMeta,
		endpointSchemas: brightDataEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: BrightDataKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				return (await ctx.keys.get_api_key()) ?? '';
			}

			return '';
		},
	} satisfies InternalBrightDataPlugin;
}

export {
	BrightDataAPIError,
	BrightDataRateLimitError,
	makeBrightDataRequest,
} from './client';
export type {
	BrightDataEndpointInputs,
	BrightDataEndpointOutputs,
} from './endpoints/types';
