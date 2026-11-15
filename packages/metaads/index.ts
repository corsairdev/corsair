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
	Accounts,
	AdSets,
	Ads,
	Audiences,
	Campaigns,
	Creatives,
	Insights,
} from './endpoints';
import type {
	MetaAdsEndpointInputs,
	MetaAdsEndpointOutputs,
} from './endpoints/types';
import {
	MetaAdsEndpointInputSchemas,
	MetaAdsEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { MetaAdsSchema } from './schema';

export type MetaAdsPluginOptions = {
	authType?: PickAuth<'oauth_2'>;
	key?: string;
	hooks?: InternalMetaAdsPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof metaAdsEndpointsNested>;
};

export type MetaAdsContext = CorsairPluginContext<
	typeof MetaAdsSchema,
	MetaAdsPluginOptions
>;
export type MetaAdsKeyBuilderContext = KeyBuilderContext<MetaAdsPluginOptions>;
export type MetaAdsBoundEndpoints = BindEndpoints<
	typeof metaAdsEndpointsNested
>;

type Endpoint<K extends keyof MetaAdsEndpointOutputs> = CorsairEndpoint<
	MetaAdsContext,
	MetaAdsEndpointInputs[K],
	MetaAdsEndpointOutputs[K]
>;

export type MetaAdsEndpoints = {
	[K in keyof MetaAdsEndpointOutputs]: Endpoint<K>;
};

const metaAdsEndpointsNested = {
	accounts: { list: Accounts.list, get: Accounts.get },
	campaigns: {
		list: Campaigns.list,
		get: Campaigns.get,
		create: Campaigns.create,
		update: Campaigns.update,
		delete: Campaigns.delete,
	},
	adSets: {
		list: AdSets.list,
		get: AdSets.get,
		create: AdSets.create,
		update: AdSets.update,
		delete: AdSets.delete,
	},
	ads: {
		list: Ads.list,
		get: Ads.get,
		create: Ads.create,
		update: Ads.update,
		delete: Ads.delete,
	},
	creatives: {
		list: Creatives.list,
		get: Creatives.get,
		create: Creatives.create,
		update: Creatives.update,
		delete: Creatives.delete,
	},
	audiences: {
		list: Audiences.list,
		get: Audiences.get,
		create: Audiences.create,
		update: Audiences.update,
		delete: Audiences.delete,
	},
	insights: { list: Insights.list },
} as const;

export const metaAdsEndpointSchemas = {
	'accounts.list': {
		input: MetaAdsEndpointInputSchemas.accountsList,
		output: MetaAdsEndpointOutputSchemas.accountsList,
	},
	'accounts.get': {
		input: MetaAdsEndpointInputSchemas.accountsGet,
		output: MetaAdsEndpointOutputSchemas.accountsGet,
	},
	'campaigns.list': {
		input: MetaAdsEndpointInputSchemas.campaignsList,
		output: MetaAdsEndpointOutputSchemas.campaignsList,
	},
	'campaigns.get': {
		input: MetaAdsEndpointInputSchemas.campaignsGet,
		output: MetaAdsEndpointOutputSchemas.campaignsGet,
	},
	'campaigns.create': {
		input: MetaAdsEndpointInputSchemas.campaignsCreate,
		output: MetaAdsEndpointOutputSchemas.campaignsCreate,
	},
	'campaigns.update': {
		input: MetaAdsEndpointInputSchemas.campaignsUpdate,
		output: MetaAdsEndpointOutputSchemas.campaignsUpdate,
	},
	'campaigns.delete': {
		input: MetaAdsEndpointInputSchemas.campaignsDelete,
		output: MetaAdsEndpointOutputSchemas.campaignsDelete,
	},
	'adSets.list': {
		input: MetaAdsEndpointInputSchemas.adSetsList,
		output: MetaAdsEndpointOutputSchemas.adSetsList,
	},
	'adSets.get': {
		input: MetaAdsEndpointInputSchemas.adSetsGet,
		output: MetaAdsEndpointOutputSchemas.adSetsGet,
	},
	'adSets.create': {
		input: MetaAdsEndpointInputSchemas.adSetsCreate,
		output: MetaAdsEndpointOutputSchemas.adSetsCreate,
	},
	'adSets.update': {
		input: MetaAdsEndpointInputSchemas.adSetsUpdate,
		output: MetaAdsEndpointOutputSchemas.adSetsUpdate,
	},
	'adSets.delete': {
		input: MetaAdsEndpointInputSchemas.adSetsDelete,
		output: MetaAdsEndpointOutputSchemas.adSetsDelete,
	},
	'ads.list': {
		input: MetaAdsEndpointInputSchemas.adsList,
		output: MetaAdsEndpointOutputSchemas.adsList,
	},
	'ads.get': {
		input: MetaAdsEndpointInputSchemas.adsGet,
		output: MetaAdsEndpointOutputSchemas.adsGet,
	},
	'ads.create': {
		input: MetaAdsEndpointInputSchemas.adsCreate,
		output: MetaAdsEndpointOutputSchemas.adsCreate,
	},
	'ads.update': {
		input: MetaAdsEndpointInputSchemas.adsUpdate,
		output: MetaAdsEndpointOutputSchemas.adsUpdate,
	},
	'ads.delete': {
		input: MetaAdsEndpointInputSchemas.adsDelete,
		output: MetaAdsEndpointOutputSchemas.adsDelete,
	},
	'creatives.list': {
		input: MetaAdsEndpointInputSchemas.creativesList,
		output: MetaAdsEndpointOutputSchemas.creativesList,
	},
	'creatives.get': {
		input: MetaAdsEndpointInputSchemas.creativesGet,
		output: MetaAdsEndpointOutputSchemas.creativesGet,
	},
	'creatives.create': {
		input: MetaAdsEndpointInputSchemas.creativesCreate,
		output: MetaAdsEndpointOutputSchemas.creativesCreate,
	},
	'creatives.update': {
		input: MetaAdsEndpointInputSchemas.creativesUpdate,
		output: MetaAdsEndpointOutputSchemas.creativesUpdate,
	},
	'creatives.delete': {
		input: MetaAdsEndpointInputSchemas.creativesDelete,
		output: MetaAdsEndpointOutputSchemas.creativesDelete,
	},
	'audiences.list': {
		input: MetaAdsEndpointInputSchemas.audiencesList,
		output: MetaAdsEndpointOutputSchemas.audiencesList,
	},
	'audiences.get': {
		input: MetaAdsEndpointInputSchemas.audiencesGet,
		output: MetaAdsEndpointOutputSchemas.audiencesGet,
	},
	'audiences.create': {
		input: MetaAdsEndpointInputSchemas.audiencesCreate,
		output: MetaAdsEndpointOutputSchemas.audiencesCreate,
	},
	'audiences.update': {
		input: MetaAdsEndpointInputSchemas.audiencesUpdate,
		output: MetaAdsEndpointOutputSchemas.audiencesUpdate,
	},
	'audiences.delete': {
		input: MetaAdsEndpointInputSchemas.audiencesDelete,
		output: MetaAdsEndpointOutputSchemas.audiencesDelete,
	},
	'insights.list': {
		input: MetaAdsEndpointInputSchemas.insightsList,
		output: MetaAdsEndpointOutputSchemas.insightsList,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof metaAdsEndpointsNested
>;

const defaultAuthType: AuthTypes = 'oauth_2';
const metaAdsEndpointMeta = {
	'accounts.list': {
		riskLevel: 'read',
		description: 'List ad accounts available to the access token',
	},
	'accounts.get': {
		riskLevel: 'read',
		description: 'Retrieve an ad account by ID',
	},
	'campaigns.list': {
		riskLevel: 'read',
		description: 'List campaigns for an ad account',
	},
	'campaigns.get': {
		riskLevel: 'read',
		description: 'Retrieve a campaign by ID',
	},
	'campaigns.create': {
		riskLevel: 'destructive',
		description: 'Create a campaign that can spend an ad account budget',
	},
	'campaigns.update': {
		riskLevel: 'destructive',
		description: 'Change campaign status or its budget and spend cap',
	},
	'campaigns.delete': {
		riskLevel: 'destructive',
		description: 'Delete a campaign and affect its delivery',
	},
	'adSets.list': {
		riskLevel: 'read',
		description: 'List ad sets in an ad account',
	},
	'adSets.get': { riskLevel: 'read', description: 'Retrieve an ad set by ID' },
	'adSets.create': {
		riskLevel: 'destructive',
		description: 'Create a targeted ad set with a budget and schedule',
	},
	'adSets.update': {
		riskLevel: 'destructive',
		description: 'Change an ad set status, budget, or end time',
	},
	'adSets.delete': {
		riskLevel: 'destructive',
		description: 'Delete an ad set and affect ad delivery',
	},
	'ads.list': { riskLevel: 'read', description: 'List ads in an ad account' },
	'ads.get': { riskLevel: 'read', description: 'Retrieve an ad by ID' },
	'ads.create': {
		riskLevel: 'destructive',
		description: 'Create an ad that may be delivered after review',
	},
	'ads.update': {
		riskLevel: 'destructive',
		description: 'Change an ad name or delivery status',
	},
	'ads.delete': { riskLevel: 'destructive', description: 'Delete an ad' },
	'creatives.list': {
		riskLevel: 'read',
		description: 'List ad creatives stored in an ad account',
	},
	'creatives.get': {
		riskLevel: 'read',
		description: 'Retrieve an ad creative by ID',
	},
	'creatives.create': {
		riskLevel: 'destructive',
		description: 'Create a creative from an existing Page post',
	},
	'creatives.update': {
		riskLevel: 'destructive',
		description: 'Change an ad creative name',
	},
	'creatives.delete': {
		riskLevel: 'destructive',
		description: 'Delete an ad creative',
	},
	'audiences.list': {
		riskLevel: 'read',
		description: 'List custom audiences for an ad account',
	},
	'audiences.get': {
		riskLevel: 'read',
		description: 'Retrieve a custom audience by ID',
	},
	'audiences.create': {
		riskLevel: 'destructive',
		description: 'Create a custom audience object',
	},
	'audiences.update': {
		riskLevel: 'destructive',
		description: 'Change custom audience metadata',
	},
	'audiences.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a custom audience',
	},
	'insights.list': {
		riskLevel: 'read',
		description: 'Read paginated reporting metrics for an ad account',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof metaAdsEndpointsNested>;

export const metaAdsAuthConfig = {
	oauth_2: { account: ['tenant_external_id'] as const },
} as const satisfies PluginAuthConfig;

export type BaseMetaAdsPlugin<T extends MetaAdsPluginOptions> = CorsairPlugin<
	'metaads',
	typeof MetaAdsSchema,
	typeof metaAdsEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType
>;
export type InternalMetaAdsPlugin = BaseMetaAdsPlugin<MetaAdsPluginOptions>;
export type ExternalMetaAdsPlugin<T extends MetaAdsPluginOptions> =
	BaseMetaAdsPlugin<T>;

export function metaads<const T extends MetaAdsPluginOptions>(
	incomingOptions: MetaAdsPluginOptions & T = {} as MetaAdsPluginOptions & T,
): ExternalMetaAdsPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'metaads',
		authConfig: metaAdsAuthConfig,
		oauthConfig: {
			providerName: 'Meta Ads',
			authUrl: 'https://www.facebook.com/v27.0/dialog/oauth',
			tokenUrl: 'https://graph.facebook.com/v27.0/oauth/access_token',
			scopes: ['ads_read', 'ads_management'],
		},
		schema: MetaAdsSchema,
		options,
		hooks: options.hooks,
		endpoints: metaAdsEndpointsNested,
		webhooks: {},
		endpointMeta: metaAdsEndpointMeta,
		endpointSchemas: metaAdsEndpointSchemas,
		errorHandlers: { ...errorHandlers, ...options.errorHandlers },
		keyBuilder: async (ctx: MetaAdsKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (options.key) return options.key;
			if (ctx.authType !== 'oauth_2') {
				throw new AuthMissingError('metaads', 'oauth_2');
			}
			const token = await ctx.keys.get_access_token();
			if (!token) throw new AuthMissingError('metaads', 'oauth_2');
			return token;
		},
	} satisfies InternalMetaAdsPlugin;
}

export type {
	MetaAdsEndpointInputs,
	MetaAdsEndpointOutputs,
} from './endpoints/types';
