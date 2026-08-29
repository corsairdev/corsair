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
	AccountEndpoints,
	ScraperEndpoints,
	SerpEndpoints,
	WebUnlockerEndpoints,
} from './endpoints';
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
	webUnlockerUnlock: BrightDataEndpoint<'webUnlocker.unlock'>;
	webUnlockerUnlockAsync: BrightDataEndpoint<'webUnlocker.unlockAsync'>;
	webUnlockerGetAsyncResult: BrightDataEndpoint<'webUnlocker.getAsyncResult'>;
	serpSearch: BrightDataEndpoint<'serp.search'>;
	serpQuery: BrightDataEndpoint<'serp.query'>;
	scraperTrigger: BrightDataEndpoint<'scraper.trigger'>;
	scraperGetProgress: BrightDataEndpoint<'scraper.getProgress'>;
	scraperGetSnapshot: BrightDataEndpoint<'scraper.getSnapshot'>;
	scraperGetSnapshotMetadata: BrightDataEndpoint<'scraper.getSnapshotMetadata'>;
	scraperDeliverSnapshot: BrightDataEndpoint<'scraper.deliverSnapshot'>;
	scraperListDatasets: BrightDataEndpoint<'scraper.listDatasets'>;
	accountGetBalance: BrightDataEndpoint<'account.getBalance'>;
	accountListZones: BrightDataEndpoint<'account.listZones'>;
};

const brightDataEndpointsNested = {
	webUnlocker: {
		unlock: WebUnlockerEndpoints.unlock,
		unlockAsync: WebUnlockerEndpoints.unlockAsync,
		getAsyncResult: WebUnlockerEndpoints.getAsyncResult,
	},
	serp: {
		search: SerpEndpoints.search,
		query: SerpEndpoints.query,
	},
	scraper: {
		trigger: ScraperEndpoints.trigger,
		getProgress: ScraperEndpoints.getProgress,
		getSnapshot: ScraperEndpoints.getSnapshot,
		getSnapshotMetadata: ScraperEndpoints.getSnapshotMetadata,
		deliverSnapshot: ScraperEndpoints.deliverSnapshot,
		listDatasets: ScraperEndpoints.listDatasets,
	},
	account: {
		getBalance: AccountEndpoints.getBalance,
		listZones: AccountEndpoints.listZones,
	},
} as const;

export const brightDataEndpointSchemas = {
	'webUnlocker.unlock': {
		input: BrightDataEndpointInputSchemas['webUnlocker.unlock'],
		output: BrightDataEndpointOutputSchemas['webUnlocker.unlock'],
	},
	'webUnlocker.unlockAsync': {
		input: BrightDataEndpointInputSchemas['webUnlocker.unlockAsync'],
		output: BrightDataEndpointOutputSchemas['webUnlocker.unlockAsync'],
	},
	'webUnlocker.getAsyncResult': {
		input: BrightDataEndpointInputSchemas['webUnlocker.getAsyncResult'],
		output: BrightDataEndpointOutputSchemas['webUnlocker.getAsyncResult'],
	},
	'serp.search': {
		input: BrightDataEndpointInputSchemas['serp.search'],
		output: BrightDataEndpointOutputSchemas['serp.search'],
	},
	'serp.query': {
		input: BrightDataEndpointInputSchemas['serp.query'],
		output: BrightDataEndpointOutputSchemas['serp.query'],
	},
	'scraper.trigger': {
		input: BrightDataEndpointInputSchemas['scraper.trigger'],
		output: BrightDataEndpointOutputSchemas['scraper.trigger'],
	},
	'scraper.getProgress': {
		input: BrightDataEndpointInputSchemas['scraper.getProgress'],
		output: BrightDataEndpointOutputSchemas['scraper.getProgress'],
	},
	'scraper.getSnapshot': {
		input: BrightDataEndpointInputSchemas['scraper.getSnapshot'],
		output: BrightDataEndpointOutputSchemas['scraper.getSnapshot'],
	},
	'scraper.getSnapshotMetadata': {
		input: BrightDataEndpointInputSchemas['scraper.getSnapshotMetadata'],
		output: BrightDataEndpointOutputSchemas['scraper.getSnapshotMetadata'],
	},
	'scraper.deliverSnapshot': {
		input: BrightDataEndpointInputSchemas['scraper.deliverSnapshot'],
		output: BrightDataEndpointOutputSchemas['scraper.deliverSnapshot'],
	},
	'scraper.listDatasets': {
		input: BrightDataEndpointInputSchemas['scraper.listDatasets'],
		output: BrightDataEndpointOutputSchemas['scraper.listDatasets'],
	},
	'account.getBalance': {
		input: BrightDataEndpointInputSchemas['account.getBalance'],
		output: BrightDataEndpointOutputSchemas['account.getBalance'],
	},
	'account.listZones': {
		input: BrightDataEndpointInputSchemas['account.listZones'],
		output: BrightDataEndpointOutputSchemas['account.listZones'],
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof brightDataEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const brightDataEndpointMeta = {
	'webUnlocker.unlock': {
		riskLevel: 'read',
		description:
			'Unlock and scrape target website with automated bot detection bypass',
	},
	'webUnlocker.unlockAsync': {
		riskLevel: 'write',
		description: 'Submit an asynchronous unlocking request',
	},
	'webUnlocker.getAsyncResult': {
		riskLevel: 'read',
		description: 'Retrieve the results of an asynchronous unlock request',
	},
	'serp.search': {
		riskLevel: 'read',
		description: 'Search using Bright Data SERP API with full search URL',
	},
	'serp.query': {
		riskLevel: 'read',
		description:
			'Execute structured search query across Google, Bing, Yandex, or DuckDuckGo',
	},
	'scraper.trigger': {
		riskLevel: 'write',
		description: 'Trigger data collection job for a Bright Data dataset',
	},
	'scraper.getProgress': {
		riskLevel: 'read',
		description: 'Get progress and status of a dataset snapshot collection',
	},
	'scraper.getSnapshot': {
		riskLevel: 'read',
		description:
			'Download collected records from a completed dataset snapshot',
	},
	'scraper.getSnapshotMetadata': {
		riskLevel: 'read',
		description: 'Get metadata and status of a dataset snapshot',
	},
	'scraper.deliverSnapshot': {
		riskLevel: 'write',
		description:
			'Deliver dataset snapshot results to webhook, S3, GCS, or Azure',
	},
	'scraper.listDatasets': {
		riskLevel: 'read',
		description: 'List available Bright Data datasets',
	},
	'account.getBalance': {
		riskLevel: 'read',
		description: 'Get Bright Data customer account balance',
	},
	'account.listZones': {
		riskLevel: 'read',
		description: 'List configured Bright Data proxy and scraper zones',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof brightDataEndpointsNested
>;

export const brightDataAuthConfig = {
	api_key: {},
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
		webhookSchemas: {},
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
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('brightdata', 'api_key');
		},
	} satisfies InternalBrightDataPlugin;
}

export type {
	AccountGetBalanceInput,
	AccountGetBalanceOutput,
	AccountListZonesInput,
	AccountListZonesOutput,
	BrightDataEndpointInputs,
	BrightDataEndpointOutputs,
	ScraperDeliverSnapshotInput,
	ScraperDeliverSnapshotOutput,
	ScraperGetProgressInput,
	ScraperGetProgressOutput,
	ScraperGetSnapshotInput,
	ScraperGetSnapshotMetadataInput,
	ScraperGetSnapshotMetadataOutput,
	ScraperGetSnapshotOutput,
	ScraperListDatasetsInput,
	ScraperListDatasetsOutput,
	ScraperTriggerInput,
	ScraperTriggerOutput,
	SerpOrganicResultSchema,
	SerpQueryInput,
	SerpQueryOutput,
	SerpSearchInput,
	SerpSearchOutput,
	WebUnlockerGetAsyncResultInput,
	WebUnlockerGetAsyncResultOutput,
	WebUnlockerUnlockAsyncInput,
	WebUnlockerUnlockAsyncOutput,
	WebUnlockerUnlockInput,
	WebUnlockerUnlockOutput,
} from './endpoints/types';

export {
	BrightDataEndpointInputSchemas,
	BrightDataEndpointOutputSchemas,
} from './endpoints/types';
