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
import {
	Account,
	Keywords,
	Mindshare,
	Projects,
	Ranking,
	Sharing,
} from './endpoints';
import type {
	KeywordEndpointInputs,
	KeywordEndpointOutputs,
} from './endpoints/types';
import {
	KeywordEndpointInputSchemas,
	KeywordEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { KeywordSchema } from './schema';

export type KeywordPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalKeywordPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof keywordEndpointsNested>;
};

export type KeywordContext = CorsairPluginContext<
	typeof KeywordSchema,
	KeywordPluginOptions
>;

export type KeywordKeyBuilderContext = KeyBuilderContext<KeywordPluginOptions>;

export type KeywordBoundEndpoints = BindEndpoints<
	typeof keywordEndpointsNested
>;

type KeywordEndpoint<K extends keyof KeywordEndpointOutputs> = CorsairEndpoint<
	KeywordContext,
	KeywordEndpointInputs[K],
	KeywordEndpointOutputs[K]
>;

export type KeywordEndpoints = {
	projectsList: KeywordEndpoint<'projectsList'>;
	projectsGet: KeywordEndpoint<'projectsGet'>;
	projectsCreate: KeywordEndpoint<'projectsCreate'>;
	projectsArchive: KeywordEndpoint<'projectsArchive'>;
	projectsRemove: KeywordEndpoint<'projectsRemove'>;
	projectsRestore: KeywordEndpoint<'projectsRestore'>;
	sharingGet: KeywordEndpoint<'sharingGet'>;
	sharingUpdate: KeywordEndpoint<'sharingUpdate'>;
	keywordsList: KeywordEndpoint<'keywordsList'>;
	keywordsGet: KeywordEndpoint<'keywordsGet'>;
	keywordsAdd: KeywordEndpoint<'keywordsAdd'>;
	keywordsUpdate: KeywordEndpoint<'keywordsUpdate'>;
	keywordsRemove: KeywordEndpoint<'keywordsRemove'>;
	keywordsBulkRemove: KeywordEndpoint<'keywordsBulkRemove'>;
	keywordsBulkUpdate: KeywordEndpoint<'keywordsBulkUpdate'>;
	keywordsRefresh: KeywordEndpoint<'keywordsRefresh'>;
	metricsGet: KeywordEndpoint<'metricsGet'>;
	rankChart: KeywordEndpoint<'rankChart'>;
	competitors: KeywordEndpoint<'competitors'>;
	regionsList: KeywordEndpoint<'regionsList'>;
	rankingUrls: KeywordEndpoint<'rankingUrls'>;
	mindshareHistory: KeywordEndpoint<'mindshareHistory'>;
	accountGet: KeywordEndpoint<'accountGet'>;
};

const keywordEndpointsNested = {
	projects: {
		list: Projects.list,
		get: Projects.get,
		create: Projects.create,
		archive: Projects.archive,
		delete: Projects.remove,
		restore: Projects.restore,
	},
	sharing: {
		get: Sharing.get,
		update: Sharing.update,
	},
	keywords: {
		list: Keywords.list,
		get: Keywords.get,
		add: Keywords.add,
		update: Keywords.update,
		delete: Keywords.remove,
		bulkDelete: Keywords.bulkRemove,
		bulkUpdate: Keywords.bulkUpdate,
		refresh: Keywords.refresh,
	},
	metrics: {
		get: Ranking.metrics,
		competitors: Ranking.competitors,
	},
	rankChart: {
		get: Ranking.rankChart,
	},
	regions: {
		list: Ranking.regions,
	},
	rankingUrls: {
		list: Ranking.rankingUrls,
	},
	mindshare: {
		history: Mindshare.history,
	},
	account: {
		get: Account.account,
	},
} as const;

export const keywordEndpointSchemas = {
	'projects.list': {
		input: KeywordEndpointInputSchemas.projectsList,
		output: KeywordEndpointOutputSchemas.projectsList,
	},
	'projects.get': {
		input: KeywordEndpointInputSchemas.projectsGet,
		output: KeywordEndpointOutputSchemas.projectsGet,
	},
	'projects.create': {
		input: KeywordEndpointInputSchemas.projectsCreate,
		output: KeywordEndpointOutputSchemas.projectsCreate,
	},
	'projects.archive': {
		input: KeywordEndpointInputSchemas.projectsArchive,
		output: KeywordEndpointOutputSchemas.projectsArchive,
	},
	'projects.delete': {
		input: KeywordEndpointInputSchemas.projectsRemove,
		output: KeywordEndpointOutputSchemas.projectsRemove,
	},
	'projects.restore': {
		input: KeywordEndpointInputSchemas.projectsRestore,
		output: KeywordEndpointOutputSchemas.projectsRestore,
	},
	'sharing.get': {
		input: KeywordEndpointInputSchemas.sharingGet,
		output: KeywordEndpointOutputSchemas.sharingGet,
	},
	'sharing.update': {
		input: KeywordEndpointInputSchemas.sharingUpdate,
		output: KeywordEndpointOutputSchemas.sharingUpdate,
	},
	'keywords.list': {
		input: KeywordEndpointInputSchemas.keywordsList,
		output: KeywordEndpointOutputSchemas.keywordsList,
	},
	'keywords.get': {
		input: KeywordEndpointInputSchemas.keywordsGet,
		output: KeywordEndpointOutputSchemas.keywordsGet,
	},
	'keywords.add': {
		input: KeywordEndpointInputSchemas.keywordsAdd,
		output: KeywordEndpointOutputSchemas.keywordsAdd,
	},
	'keywords.update': {
		input: KeywordEndpointInputSchemas.keywordsUpdate,
		output: KeywordEndpointOutputSchemas.keywordsUpdate,
	},
	'keywords.delete': {
		input: KeywordEndpointInputSchemas.keywordsRemove,
		output: KeywordEndpointOutputSchemas.keywordsRemove,
	},
	'keywords.bulkDelete': {
		input: KeywordEndpointInputSchemas.keywordsBulkRemove,
		output: KeywordEndpointOutputSchemas.keywordsBulkRemove,
	},
	'keywords.bulkUpdate': {
		input: KeywordEndpointInputSchemas.keywordsBulkUpdate,
		output: KeywordEndpointOutputSchemas.keywordsBulkUpdate,
	},
	'keywords.refresh': {
		input: KeywordEndpointInputSchemas.keywordsRefresh,
		output: KeywordEndpointOutputSchemas.keywordsRefresh,
	},
	'metrics.get': {
		input: KeywordEndpointInputSchemas.metricsGet,
		output: KeywordEndpointOutputSchemas.metricsGet,
	},
	'metrics.competitors': {
		input: KeywordEndpointInputSchemas.competitors,
		output: KeywordEndpointOutputSchemas.competitors,
	},
	'rankChart.get': {
		input: KeywordEndpointInputSchemas.rankChart,
		output: KeywordEndpointOutputSchemas.rankChart,
	},
	'regions.list': {
		input: KeywordEndpointInputSchemas.regionsList,
		output: KeywordEndpointOutputSchemas.regionsList,
	},
	'rankingUrls.list': {
		input: KeywordEndpointInputSchemas.rankingUrls,
		output: KeywordEndpointOutputSchemas.rankingUrls,
	},
	'mindshare.history': {
		input: KeywordEndpointInputSchemas.mindshareHistory,
		output: KeywordEndpointOutputSchemas.mindshareHistory,
	},
	'account.get': {
		input: KeywordEndpointInputSchemas.accountGet,
		output: KeywordEndpointOutputSchemas.accountGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof keywordEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const keywordEndpointMeta = {
	'projects.list': {
		riskLevel: 'read',
		description:
			'Every project and subproject with its tags and keyword counts; a subproject is named `Parent[sub]Child`',
	},
	'projects.get': {
		riskLevel: 'read',
		description: 'One project or subproject with its tags and counts',
	},
	'projects.create': {
		riskLevel: 'write',
		description:
			'Create a project, or a subproject from a `Parent[sub]Child` name; the parent must exist first',
	},
	'projects.archive': {
		riskLevel: 'write',
		description:
			'Archive a project or subproject: it stops updating until `projects.restore` brings it back. Keyword refuses to archive the account’s only active top-level project',
	},
	'projects.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a project with every keyword and its ranking history; it cannot be restored',
	},
	'projects.restore': {
		riskLevel: 'write',
		description: 'Undo an archive, bringing the project and its keywords back',
	},
	'sharing.get': {
		riskLevel: 'read',
		description:
			'A project’s shared-report settings: whether the share link is on, its hash, whether it needs a password, and what the report shows',
	},
	'sharing.update': {
		riskLevel: 'write',
		description:
			'Turn a project’s share link on or off, set or clear its password, or toggle what the shared report shows. Everything except the on/off switch needs Keyword’s white-label permission',
	},
	'keywords.list': {
		riskLevel: 'read',
		description:
			'Every keyword in a project or group with its rank, best rank, search volume and trend, read as of a given day',
	},
	'keywords.get': {
		riskLevel: 'read',
		description: 'One keyword with its rank, metrics and rank history',
	},
	'keywords.add': {
		riskLevel: 'write',
		description:
			'Add keywords to a project, each with its domain, region and language. Adding a keyword already tracked returns the existing one',
	},
	'keywords.update': {
		riskLevel: 'write',
		description:
			'Change a keyword’s domain, region, tags, status, baseline or favourite flag',
	},
	'keywords.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete one keyword and its ranking history; it cannot be restored',
	},
	'keywords.bulkDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete many keywords from one project in a single call; their history is lost',
	},
	'keywords.bulkUpdate': {
		riskLevel: 'write',
		description:
			'Apply the same domain, region, tags or status to many keywords in one project',
	},
	// Spends the plan's daily refresh quota, which R8 marks destructive.
	'keywords.refresh': {
		riskLevel: 'destructive',
		description:
			'Queue keywords for an on-demand rank check; spends the plan’s daily refresh quota. The whole request is refused if the quota would be exceeded',
	},
	'metrics.get': {
		riskLevel: 'read',
		description:
			'Keyword movement for a project, group or tag: how many sit in each top-N bucket and how that changed day over day',
	},
	'metrics.competitors': {
		riskLevel: 'read',
		description:
			'The top competing URLs for one keyword in a date window, with each result’s type and position',
	},
	'rankChart.get': {
		riskLevel: 'read',
		description:
			'Daily rank history for a set of keywords over a number of days; Keyword refuses a call covering more than 400,000 keyword-days',
	},
	'regions.list': {
		riskLevel: 'read',
		description:
			'The Google regions a project tracks, with each one’s language and keyword count',
	},
	'rankingUrls.list': {
		riskLevel: 'read',
		description:
			'The pages that rank best for a project, with their average position and total search volume, 10 to a page',
	},
	'mindshare.history': {
		riskLevel: 'read',
		description: 'Share of Voice over a date window, read from Keyword’s cache',
	},
	'account.get': {
		riskLevel: 'read',
		description: 'The token’s own user, optionally with the subscription block',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof keywordEndpointsNested>;

export type BaseKeywordPlugin<T extends KeywordPluginOptions> = CorsairPlugin<
	'keyword',
	typeof KeywordSchema,
	typeof keywordEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalKeywordPlugin = BaseKeywordPlugin<KeywordPluginOptions>;

export type ExternalKeywordPlugin<T extends KeywordPluginOptions> =
	BaseKeywordPlugin<T>;

export function keyword<const T extends KeywordPluginOptions>(
	incomingOptions: KeywordPluginOptions & T = {} as KeywordPluginOptions & T,
): ExternalKeywordPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'keyword',
		schema: KeywordSchema,
		options,
		hooks: options.hooks,
		endpoints: keywordEndpointsNested,
		webhooks: {},
		endpointMeta: keywordEndpointMeta,
		endpointSchemas: keywordEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: KeywordKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('keyword', ctx.authType ?? 'api_key');
		},
	} satisfies InternalKeywordPlugin;
}

export {
	isKeywordAuthError,
	isKeywordPermissionError,
	isKeywordQuotaError,
	isKeywordRateLimit,
	KeywordAPIError,
} from './client';

export type {
	AccountGetInput,
	AccountResponse,
	CompetitorsInput,
	CompetitorsResponse,
	Keyword,
	KeywordAttributes,
	KeywordEndpointInputs,
	KeywordEndpointOutputs,
	KeywordProject,
	KeywordResponse,
	KeywordsAddInput,
	KeywordsAddResponse,
	KeywordsBulkRemoveInput,
	KeywordsBulkUpdateInput,
	KeywordsListInput,
	KeywordsListResponse,
	KeywordsRefreshInput,
	KeywordsRefreshResponse,
	KeywordTag,
	KeywordUpdateInput,
	MetaResponse,
	MetricsInput,
	MetricsResponse,
	MindshareHistoryInput,
	MindshareHistoryResponse,
	ProjectArchiveInput,
	ProjectCreateInput,
	ProjectGetInput,
	ProjectRemoveInput,
	ProjectResponse,
	ProjectRestoreInput,
	ProjectsListInput,
	ProjectsListResponse,
	RankChartInput,
	RankChartResponse,
	RankingUrlsInput,
	RankingUrlsResponse,
	RegionsInput,
	RegionsResponse,
	SharingGetInput,
	SharingSettings,
	SharingUpdateInput,
} from './endpoints/types';
