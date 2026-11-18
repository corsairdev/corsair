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
	Images,
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
	accounts: {
		list: Accounts.list,
		get: Accounts.get,
		usersList: Accounts.usersList,
	},
	images: { list: Images.list, upload: Images.upload, delete: Images.delete },
	campaigns: {
		list: Campaigns.list,
		adSetsList: Campaigns.adSetsList,
		adsList: Campaigns.adsList,
		copiesList: Campaigns.copiesList,
		copy: Campaigns.copy,
		get: Campaigns.get,
		create: Campaigns.create,
		update: Campaigns.update,
		delete: Campaigns.delete,
	},
	adSets: {
		list: AdSets.list,
		adsList: AdSets.adsList,
		adCreativesList: AdSets.adCreativesList,
		copiesList: AdSets.copiesList,
		copy: AdSets.copy,
		get: AdSets.get,
		create: AdSets.create,
		update: AdSets.update,
		delete: AdSets.delete,
	},
	ads: {
		list: Ads.list,
		adCreativesList: Ads.adCreativesList,
		copiesList: Ads.copiesList,
		copy: Ads.copy,
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
		adsList: Audiences.adsList,
		get: Audiences.get,
		create: Audiences.create,
		update: Audiences.update,
		delete: Audiences.delete,
		sessionsList: Audiences.sessionsList,
		usersAdd: Audiences.usersAdd,
		usersRemove: Audiences.usersRemove,
	},
	insights: {
		list: Insights.list,
		listForCampaign: Insights.listForCampaign,
		listForAdSet: Insights.listForAdSet,
		listForAd: Insights.listForAd,
		createAsync: Insights.createAsync,
		getAsyncReport: Insights.getAsyncReport,
		getAsyncResults: Insights.getAsyncResults,
		listFeatures: Insights.listFeatures,
		listEnabledFeatures: Insights.listEnabledFeatures,
		enableFeature: Insights.enableFeature,
	},
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
	'accounts.usersList': {
		input: MetaAdsEndpointInputSchemas.accountsUsersList,
		output: MetaAdsEndpointOutputSchemas.accountsUsersList,
	},
	'images.list': {
		input: MetaAdsEndpointInputSchemas.imagesList,
		output: MetaAdsEndpointOutputSchemas.imagesList,
	},
	'images.upload': {
		input: MetaAdsEndpointInputSchemas.imagesUpload,
		output: MetaAdsEndpointOutputSchemas.imagesUpload,
	},
	'images.delete': {
		input: MetaAdsEndpointInputSchemas.imagesDelete,
		output: MetaAdsEndpointOutputSchemas.imagesDelete,
	},
	'campaigns.list': {
		input: MetaAdsEndpointInputSchemas.campaignsList,
		output: MetaAdsEndpointOutputSchemas.campaignsList,
	},
	'campaigns.adSetsList': {
		input: MetaAdsEndpointInputSchemas.campaignsAdSetsList,
		output: MetaAdsEndpointOutputSchemas.campaignsAdSetsList,
	},
	'campaigns.adsList': {
		input: MetaAdsEndpointInputSchemas.campaignsAdsList,
		output: MetaAdsEndpointOutputSchemas.campaignsAdsList,
	},
	'campaigns.copiesList': {
		input: MetaAdsEndpointInputSchemas.campaignsCopiesList,
		output: MetaAdsEndpointOutputSchemas.campaignsCopiesList,
	},
	'campaigns.copy': {
		input: MetaAdsEndpointInputSchemas.campaignsCopy,
		output: MetaAdsEndpointOutputSchemas.campaignsCopy,
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
	'adSets.adsList': {
		input: MetaAdsEndpointInputSchemas.adSetsAdsList,
		output: MetaAdsEndpointOutputSchemas.adSetsAdsList,
	},
	'adSets.adCreativesList': {
		input: MetaAdsEndpointInputSchemas.adSetsAdCreativesList,
		output: MetaAdsEndpointOutputSchemas.adSetsAdCreativesList,
	},
	'adSets.copiesList': {
		input: MetaAdsEndpointInputSchemas.adSetsCopiesList,
		output: MetaAdsEndpointOutputSchemas.adSetsCopiesList,
	},
	'adSets.copy': {
		input: MetaAdsEndpointInputSchemas.adSetsCopy,
		output: MetaAdsEndpointOutputSchemas.adSetsCopy,
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
	'ads.adCreativesList': {
		input: MetaAdsEndpointInputSchemas.adsAdCreativesList,
		output: MetaAdsEndpointOutputSchemas.adsAdCreativesList,
	},
	'ads.copiesList': {
		input: MetaAdsEndpointInputSchemas.adsCopiesList,
		output: MetaAdsEndpointOutputSchemas.adsCopiesList,
	},
	'ads.copy': {
		input: MetaAdsEndpointInputSchemas.adsCopy,
		output: MetaAdsEndpointOutputSchemas.adsCopy,
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
	'audiences.adsList': {
		input: MetaAdsEndpointInputSchemas.audiencesAdsList,
		output: MetaAdsEndpointOutputSchemas.audiencesAdsList,
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
	'audiences.sessionsList': {
		input: MetaAdsEndpointInputSchemas.audiencesSessionsList,
		output: MetaAdsEndpointOutputSchemas.audiencesSessionsList,
	},
	'audiences.usersAdd': {
		input: MetaAdsEndpointInputSchemas.audiencesUsersAdd,
		output: MetaAdsEndpointOutputSchemas.audiencesUsersAdd,
	},
	'audiences.usersRemove': {
		input: MetaAdsEndpointInputSchemas.audiencesUsersRemove,
		output: MetaAdsEndpointOutputSchemas.audiencesUsersRemove,
	},
	'insights.list': {
		input: MetaAdsEndpointInputSchemas.insightsList,
		output: MetaAdsEndpointOutputSchemas.insightsList,
	},
	'insights.listForCampaign': {
		input: MetaAdsEndpointInputSchemas.insightsListForCampaign,
		output: MetaAdsEndpointOutputSchemas.insightsListForCampaign,
	},
	'insights.listForAdSet': {
		input: MetaAdsEndpointInputSchemas.insightsListForAdSet,
		output: MetaAdsEndpointOutputSchemas.insightsListForAdSet,
	},
	'insights.listForAd': {
		input: MetaAdsEndpointInputSchemas.insightsListForAd,
		output: MetaAdsEndpointOutputSchemas.insightsListForAd,
	},
	'insights.createAsync': {
		input: MetaAdsEndpointInputSchemas.insightsCreateAsync,
		output: MetaAdsEndpointOutputSchemas.insightsCreateAsync,
	},
	'insights.getAsyncReport': {
		input: MetaAdsEndpointInputSchemas.insightsGetAsyncReport,
		output: MetaAdsEndpointOutputSchemas.insightsGetAsyncReport,
	},
	'insights.getAsyncResults': {
		input: MetaAdsEndpointInputSchemas.insightsGetAsyncResults,
		output: MetaAdsEndpointOutputSchemas.insightsGetAsyncResults,
	},
	'insights.listFeatures': {
		input: MetaAdsEndpointInputSchemas.insightsListFeatures,
		output: MetaAdsEndpointOutputSchemas.insightsListFeatures,
	},
	'insights.listEnabledFeatures': {
		input: MetaAdsEndpointInputSchemas.insightsListEnabledFeatures,
		output: MetaAdsEndpointOutputSchemas.insightsListEnabledFeatures,
	},
	'insights.enableFeature': {
		input: MetaAdsEndpointInputSchemas.insightsEnableFeature,
		output: MetaAdsEndpointOutputSchemas.insightsEnableFeature,
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
	'accounts.usersList': {
		riskLevel: 'read',
		description: 'List app-scoped users and task grants on an ad account',
	},
	'images.list': {
		riskLevel: 'read',
		description: 'List images stored in an ad account library',
	},
	'images.upload': {
		riskLevel: 'destructive',
		description:
			'Upload a base64 image or copy an image into an ad account library',
	},
	'images.delete': {
		riskLevel: 'destructive',
		description: 'Dissociate an unused image from an ad account library',
	},
	'campaigns.list': {
		riskLevel: 'read',
		description: 'List campaigns for an ad account',
	},
	'campaigns.adSetsList': {
		riskLevel: 'read',
		description: 'List ad sets belonging to a campaign',
	},
	'campaigns.adsList': {
		riskLevel: 'read',
		description: 'List ads belonging to a campaign',
	},
	'campaigns.copiesList': {
		riskLevel: 'read',
		description: 'List copies of a campaign',
	},
	'campaigns.copy': {
		riskLevel: 'destructive',
		description: 'Create a paused, shallow copy of a campaign',
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
	'adSets.adsList': {
		riskLevel: 'read',
		description: 'List ads belonging to an ad set',
	},
	'adSets.adCreativesList': {
		riskLevel: 'read',
		description: 'List creatives associated with an ad set',
	},
	'adSets.copiesList': {
		riskLevel: 'read',
		description: 'List copies of an ad set',
	},
	'adSets.copy': {
		riskLevel: 'destructive',
		description: 'Create a paused copy of an ad set',
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
	'ads.adCreativesList': {
		riskLevel: 'read',
		description: 'List creatives attached to an ad',
	},
	'ads.copiesList': {
		riskLevel: 'read',
		description: 'List copies of an ad',
	},
	'ads.copy': {
		riskLevel: 'destructive',
		description: 'Create a paused copy of an ad',
	},
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
	'audiences.adsList': {
		riskLevel: 'read',
		description: 'List ads using a custom audience',
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
	'audiences.sessionsList': {
		riskLevel: 'read',
		description: 'List upload sessions for a custom audience',
	},
	'audiences.usersAdd': {
		riskLevel: 'destructive',
		description:
			'Upload a batch of SHA-256 customer hashes to a custom audience',
	},
	'audiences.usersRemove': {
		riskLevel: 'destructive',
		description:
			'Remove a batch of SHA-256 customer hashes from a custom audience',
	},
	'insights.list': {
		riskLevel: 'read',
		description:
			'Read paginated, filtered and broken-down ad reporting metrics',
	},
	'insights.listForCampaign': {
		riskLevel: 'read',
		description: 'Read paginated reporting metrics for one campaign',
	},
	'insights.listForAdSet': {
		riskLevel: 'read',
		description: 'Read paginated reporting metrics for one ad set',
	},
	'insights.listForAd': {
		riskLevel: 'read',
		description: 'Read paginated reporting metrics for one ad',
	},
	'insights.createAsync': {
		riskLevel: 'write',
		description: 'Start a non-idempotent asynchronous Ads Insights report job',
	},
	'insights.getAsyncReport': {
		riskLevel: 'read',
		description:
			'Read the status and completion details of an Insights report job',
	},
	'insights.getAsyncResults': {
		riskLevel: 'read',
		description: 'Read paginated results for a completed Insights report job',
	},
	'insights.listFeatures': {
		riskLevel: 'read',
		description: 'List breakdown features available to an ad account',
	},
	'insights.listEnabledFeatures': {
		riskLevel: 'read',
		description: 'List breakdown features enabled for an ad account',
	},
	'insights.enableFeature': {
		riskLevel: 'destructive',
		description: 'Permanently enable an Insights feature for an ad account',
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
