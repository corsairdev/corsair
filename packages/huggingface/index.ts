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
import {
	AccountEndpoints,
	CollectionsEndpoints,
	DatasetsEndpoints,
	DiscussionsEndpoints,
	DocsEndpoints,
	EndpointsEndpoints,
	InferenceEndpoints,
	JobsEndpoints,
	ModelsEndpoints,
	OrganizationsEndpoints,
	PapersEndpoints,
	ReposEndpoints,
	SettingsEndpoints,
	SpacesEndpoints,
	TrendingEndpoints,
	UsersEndpoints,
} from './endpoints';
import type {
	HuggingFaceEndpointInputs,
	HuggingFaceEndpointOutputs,
} from './endpoints/types';
import {
	HuggingFaceEndpointInputSchemas,
	HuggingFaceEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { HuggingFaceSchema } from './schema';

export type HuggingFacePluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	/** Access token override for tests / local calls (hf_... or OAuth token). */
	key?: string;
	hooks?: InternalHuggingFacePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof huggingFaceEndpointsNested>;
};

export type HuggingFaceContext = CorsairPluginContext<
	typeof HuggingFaceSchema,
	HuggingFacePluginOptions
>;

export type HuggingFaceKeyBuilderContext =
	KeyBuilderContext<HuggingFacePluginOptions>;

export type HuggingFaceBoundEndpoints = BindEndpoints<
	typeof huggingFaceEndpointsNested
>;

type HuggingFaceEndpoint<K extends keyof HuggingFaceEndpointOutputs> =
	CorsairEndpoint<
		HuggingFaceContext,
		HuggingFaceEndpointInputs[K],
		HuggingFaceEndpointOutputs[K]
	>;

export type HuggingFaceEndpoints = {
	getWhoami: HuggingFaceEndpoint<'getWhoami'>;
	listNotifications: HuggingFaceEndpoint<'listNotifications'>;
	deleteNotifications: HuggingFaceEndpoint<'deleteNotifications'>;
	updateNotificationSettings: HuggingFaceEndpoint<'updateNotificationSettings'>;
	updateWatchSettings: HuggingFaceEndpoint<'updateWatchSettings'>;
	getMcpSettings: HuggingFaceEndpoint<'getMcpSettings'>;
	getBillingUsageV2: HuggingFaceEndpoint<'getBillingUsageV2'>;
	getJobsUsage: HuggingFaceEndpoint<'getJobsUsage'>;
	getLiveBillingUsage: HuggingFaceEndpoint<'getLiveBillingUsage'>;
	listWebhooks: HuggingFaceEndpoint<'listWebhooks'>;
	getWebhook: HuggingFaceEndpoint<'getWebhook'>;
	createWebhook: HuggingFaceEndpoint<'createWebhook'>;
	updateWebhook: HuggingFaceEndpoint<'updateWebhook'>;
	deleteWebhook: HuggingFaceEndpoint<'deleteWebhook'>;
	updateWebhookStatus: HuggingFaceEndpoint<'updateWebhookStatus'>;
	modelsList: HuggingFaceEndpoint<'modelsList'>;
	modelsGet: HuggingFaceEndpoint<'modelsGet'>;
	modelsGetScan: HuggingFaceEndpoint<'modelsGetScan'>;
	modelsGetCompare: HuggingFaceEndpoint<'modelsGetCompare'>;
	modelsListCommits: HuggingFaceEndpoint<'modelsListCommits'>;
	modelsListRefs: HuggingFaceEndpoint<'modelsListRefs'>;
	modelsListPathsInfo: HuggingFaceEndpoint<'modelsListPathsInfo'>;
	modelsGetTreeSize: HuggingFaceEndpoint<'modelsGetTreeSize'>;
	modelsGetJwt: HuggingFaceEndpoint<'modelsGetJwt'>;
	modelsGetXetReadToken: HuggingFaceEndpoint<'modelsGetXetReadToken'>;
	modelsGetNotebook: HuggingFaceEndpoint<'modelsGetNotebook'>;
	modelsGetResolve: HuggingFaceEndpoint<'modelsGetResolve'>;
	modelsGetResolveCache: HuggingFaceEndpoint<'modelsGetResolveCache'>;
	modelsCreateBranch: HuggingFaceEndpoint<'modelsCreateBranch'>;
	modelsDeleteBranch: HuggingFaceEndpoint<'modelsDeleteBranch'>;
	modelsCreateCommit: HuggingFaceEndpoint<'modelsCreateCommit'>;
	modelsCreateTag: HuggingFaceEndpoint<'modelsCreateTag'>;
	modelsDeleteTag: HuggingFaceEndpoint<'modelsDeleteTag'>;
	modelsCheckUploadMethod: HuggingFaceEndpoint<'modelsCheckUploadMethod'>;
	modelsUpdateSettings: HuggingFaceEndpoint<'modelsUpdateSettings'>;
	datasetsList: HuggingFaceEndpoint<'datasetsList'>;
	datasetsGet: HuggingFaceEndpoint<'datasetsGet'>;
	datasetsGetScan: HuggingFaceEndpoint<'datasetsGetScan'>;
	datasetsGetCompare: HuggingFaceEndpoint<'datasetsGetCompare'>;
	datasetsListCommits: HuggingFaceEndpoint<'datasetsListCommits'>;
	datasetsListRefs: HuggingFaceEndpoint<'datasetsListRefs'>;
	datasetsListPathsInfo: HuggingFaceEndpoint<'datasetsListPathsInfo'>;
	datasetsGetTreeSize: HuggingFaceEndpoint<'datasetsGetTreeSize'>;
	datasetsGetJwt: HuggingFaceEndpoint<'datasetsGetJwt'>;
	datasetsGetXetReadToken: HuggingFaceEndpoint<'datasetsGetXetReadToken'>;
	datasetsGetNotebook: HuggingFaceEndpoint<'datasetsGetNotebook'>;
	datasetsGetResolve: HuggingFaceEndpoint<'datasetsGetResolve'>;
	datasetsGetResolveCache: HuggingFaceEndpoint<'datasetsGetResolveCache'>;
	datasetsCreateBranch: HuggingFaceEndpoint<'datasetsCreateBranch'>;
	datasetsDeleteBranch: HuggingFaceEndpoint<'datasetsDeleteBranch'>;
	datasetsCreateCommit: HuggingFaceEndpoint<'datasetsCreateCommit'>;
	datasetsCreateTag: HuggingFaceEndpoint<'datasetsCreateTag'>;
	datasetsDeleteTag: HuggingFaceEndpoint<'datasetsDeleteTag'>;
	datasetsCheckUploadMethod: HuggingFaceEndpoint<'datasetsCheckUploadMethod'>;
	datasetsUpdateSettings: HuggingFaceEndpoint<'datasetsUpdateSettings'>;
	spacesList: HuggingFaceEndpoint<'spacesList'>;
	spacesGet: HuggingFaceEndpoint<'spacesGet'>;
	spacesGetScan: HuggingFaceEndpoint<'spacesGetScan'>;
	spacesGetCompare: HuggingFaceEndpoint<'spacesGetCompare'>;
	spacesListCommits: HuggingFaceEndpoint<'spacesListCommits'>;
	spacesListRefs: HuggingFaceEndpoint<'spacesListRefs'>;
	spacesListPathsInfo: HuggingFaceEndpoint<'spacesListPathsInfo'>;
	spacesGetTreeSize: HuggingFaceEndpoint<'spacesGetTreeSize'>;
	spacesGetJwt: HuggingFaceEndpoint<'spacesGetJwt'>;
	spacesGetXetReadToken: HuggingFaceEndpoint<'spacesGetXetReadToken'>;
	spacesGetNotebook: HuggingFaceEndpoint<'spacesGetNotebook'>;
	spacesGetResolve: HuggingFaceEndpoint<'spacesGetResolve'>;
	spacesGetResolveCache: HuggingFaceEndpoint<'spacesGetResolveCache'>;
	spacesCreateBranch: HuggingFaceEndpoint<'spacesCreateBranch'>;
	spacesDeleteBranch: HuggingFaceEndpoint<'spacesDeleteBranch'>;
	spacesCreateCommit: HuggingFaceEndpoint<'spacesCreateCommit'>;
	spacesCreateTag: HuggingFaceEndpoint<'spacesCreateTag'>;
	spacesDeleteTag: HuggingFaceEndpoint<'spacesDeleteTag'>;
	spacesCheckUploadMethod: HuggingFaceEndpoint<'spacesCheckUploadMethod'>;
	spacesUpdateSettings: HuggingFaceEndpoint<'spacesUpdateSettings'>;
	modelsGetTagsByType: HuggingFaceEndpoint<'modelsGetTagsByType'>;
	datasetsGetTagsByType: HuggingFaceEndpoint<'datasetsGetTagsByType'>;
	datasetsGetLeaderboard: HuggingFaceEndpoint<'datasetsGetLeaderboard'>;
	datasetsSquashCommits: HuggingFaceEndpoint<'datasetsSquashCommits'>;
	datasetsListAccessRequests: HuggingFaceEndpoint<'datasetsListAccessRequests'>;
	datasetsHandleAccessRequest: HuggingFaceEndpoint<'datasetsHandleAccessRequest'>;
	datasetsCheckValidity: HuggingFaceEndpoint<'datasetsCheckValidity'>;
	datasetsGetCroissant: HuggingFaceEndpoint<'datasetsGetCroissant'>;
	datasetsGetInfo: HuggingFaceEndpoint<'datasetsGetInfo'>;
	datasetsGetSize: HuggingFaceEndpoint<'datasetsGetSize'>;
	datasetsListSplits: HuggingFaceEndpoint<'datasetsListSplits'>;
	datasetsListParquetFiles: HuggingFaceEndpoint<'datasetsListParquetFiles'>;
	datasetsGetFirstRows: HuggingFaceEndpoint<'datasetsGetFirstRows'>;
	datasetsGetRows: HuggingFaceEndpoint<'datasetsGetRows'>;
	datasetsGetStatistics: HuggingFaceEndpoint<'datasetsGetStatistics'>;
	datasetsFilterRows: HuggingFaceEndpoint<'datasetsFilterRows'>;
	datasetsSearch: HuggingFaceEndpoint<'datasetsSearch'>;
	datasetsCreateSqlConsoleEmbed: HuggingFaceEndpoint<'datasetsCreateSqlConsoleEmbed'>;
	datasetsUpdateSqlConsoleEmbed: HuggingFaceEndpoint<'datasetsUpdateSqlConsoleEmbed'>;
	spacesListHardware: HuggingFaceEndpoint<'spacesListHardware'>;
	spacesGetMetrics: HuggingFaceEndpoint<'spacesGetMetrics'>;
	spacesGetEvents: HuggingFaceEndpoint<'spacesGetEvents'>;
	spacesListLfsFiles: HuggingFaceEndpoint<'spacesListLfsFiles'>;
	spacesGetXetWriteToken: HuggingFaceEndpoint<'spacesGetXetWriteToken'>;
	spacesSquashCommits: HuggingFaceEndpoint<'spacesSquashCommits'>;
	spacesCreateSecret: HuggingFaceEndpoint<'spacesCreateSecret'>;
	spacesDeleteSecret: HuggingFaceEndpoint<'spacesDeleteSecret'>;
	spacesCreateVariable: HuggingFaceEndpoint<'spacesCreateVariable'>;
	spacesDeleteVariable: HuggingFaceEndpoint<'spacesDeleteVariable'>;
	collectionsCreate: HuggingFaceEndpoint<'collectionsCreate'>;
	collectionsList: HuggingFaceEndpoint<'collectionsList'>;
	discussionsList: HuggingFaceEndpoint<'discussionsList'>;
	discussionsGet: HuggingFaceEndpoint<'discussionsGet'>;
	discussionsCreate: HuggingFaceEndpoint<'discussionsCreate'>;
	discussionsCreateComment: HuggingFaceEndpoint<'discussionsCreateComment'>;
	discussionsChangeStatus: HuggingFaceEndpoint<'discussionsChangeStatus'>;
	discussionsUpdateTitle: HuggingFaceEndpoint<'discussionsUpdateTitle'>;
	discussionsPin: HuggingFaceEndpoint<'discussionsPin'>;
	discussionsDelete: HuggingFaceEndpoint<'discussionsDelete'>;
	papersGetDaily: HuggingFaceEndpoint<'papersGetDaily'>;
	papersSearch: HuggingFaceEndpoint<'papersSearch'>;
	papersCreateIndex: HuggingFaceEndpoint<'papersCreateIndex'>;
	papersClaimAuthorship: HuggingFaceEndpoint<'papersClaimAuthorship'>;
	papersCreateComment: HuggingFaceEndpoint<'papersCreateComment'>;
	papersCreateCommentReply: HuggingFaceEndpoint<'papersCreateCommentReply'>;
	docsList: HuggingFaceEndpoint<'docsList'>;
	docsSearch: HuggingFaceEndpoint<'docsSearch'>;
	reposCreate: HuggingFaceEndpoint<'reposCreate'>;
	reposListFiles: HuggingFaceEndpoint<'reposListFiles'>;
	reposGetResolve: HuggingFaceEndpoint<'reposGetResolve'>;
	reposRequestAccess: HuggingFaceEndpoint<'reposRequestAccess'>;
	usersGetAvatar: HuggingFaceEndpoint<'usersGetAvatar'>;
	usersGetOverview: HuggingFaceEndpoint<'usersGetOverview'>;
	usersGetSocials: HuggingFaceEndpoint<'usersGetSocials'>;
	organizationsGetAvatar: HuggingFaceEndpoint<'organizationsGetAvatar'>;
	organizationsGetMembers: HuggingFaceEndpoint<'organizationsGetMembers'>;
	organizationsGetSocials: HuggingFaceEndpoint<'organizationsGetSocials'>;
	trendingGet: HuggingFaceEndpoint<'trendingGet'>;
	inferenceChatCompletion: HuggingFaceEndpoint<'inferenceChatCompletion'>;
	inferenceEmbeddings: HuggingFaceEndpoint<'inferenceEmbeddings'>;
	jobsGetHardware: HuggingFaceEndpoint<'jobsGetHardware'>;
	endpointsList: HuggingFaceEndpoint<'endpointsList'>;
	endpointsListVendors: HuggingFaceEndpoint<'endpointsListVendors'>;
	endpointsDeleteNetworkCidr: HuggingFaceEndpoint<'endpointsDeleteNetworkCidr'>;
};

const huggingFaceEndpointsNested = {
	account: {
		getWhoami: AccountEndpoints.getWhoami,
		listNotifications: AccountEndpoints.listNotifications,
		deleteNotifications: AccountEndpoints.deleteNotifications,
	},
	settings: {
		updateNotifications: SettingsEndpoints.updateNotifications,
		updateWatch: SettingsEndpoints.updateWatch,
		getMcp: SettingsEndpoints.getMcp,
		getBillingUsageV2: SettingsEndpoints.getBillingUsageV2,
		getJobsUsage: SettingsEndpoints.getJobsUsage,
		getLiveBillingUsage: SettingsEndpoints.getLiveBillingUsage,
		listWebhooks: SettingsEndpoints.listWebhooks,
		getWebhook: SettingsEndpoints.getWebhook,
		createWebhook: SettingsEndpoints.createWebhook,
		updateWebhook: SettingsEndpoints.updateWebhook,
		deleteWebhook: SettingsEndpoints.deleteWebhook,
		updateWebhookStatus: SettingsEndpoints.updateWebhookStatus,
	},
	models: {
		list: ModelsEndpoints.list,
		get: ModelsEndpoints.get,
		getScan: ModelsEndpoints.getScan,
		getCompare: ModelsEndpoints.getCompare,
		listCommits: ModelsEndpoints.listCommits,
		listRefs: ModelsEndpoints.listRefs,
		listPathsInfo: ModelsEndpoints.listPathsInfo,
		getTreeSize: ModelsEndpoints.getTreeSize,
		getJwt: ModelsEndpoints.getJwt,
		getXetReadToken: ModelsEndpoints.getXetReadToken,
		getNotebook: ModelsEndpoints.getNotebook,
		getResolve: ModelsEndpoints.getResolve,
		getResolveCache: ModelsEndpoints.getResolveCache,
		createBranch: ModelsEndpoints.createBranch,
		deleteBranch: ModelsEndpoints.deleteBranch,
		createCommit: ModelsEndpoints.createCommit,
		createTag: ModelsEndpoints.createTag,
		deleteTag: ModelsEndpoints.deleteTag,
		checkUploadMethod: ModelsEndpoints.checkUploadMethod,
		updateSettings: ModelsEndpoints.updateSettings,
		getTagsByType: ModelsEndpoints.getTagsByType,
	},
	datasets: {
		list: DatasetsEndpoints.list,
		get: DatasetsEndpoints.get,
		getScan: DatasetsEndpoints.getScan,
		getCompare: DatasetsEndpoints.getCompare,
		listCommits: DatasetsEndpoints.listCommits,
		listRefs: DatasetsEndpoints.listRefs,
		listPathsInfo: DatasetsEndpoints.listPathsInfo,
		getTreeSize: DatasetsEndpoints.getTreeSize,
		getJwt: DatasetsEndpoints.getJwt,
		getXetReadToken: DatasetsEndpoints.getXetReadToken,
		getNotebook: DatasetsEndpoints.getNotebook,
		getResolve: DatasetsEndpoints.getResolve,
		getResolveCache: DatasetsEndpoints.getResolveCache,
		createBranch: DatasetsEndpoints.createBranch,
		deleteBranch: DatasetsEndpoints.deleteBranch,
		createCommit: DatasetsEndpoints.createCommit,
		createTag: DatasetsEndpoints.createTag,
		deleteTag: DatasetsEndpoints.deleteTag,
		checkUploadMethod: DatasetsEndpoints.checkUploadMethod,
		updateSettings: DatasetsEndpoints.updateSettings,
		getTagsByType: DatasetsEndpoints.getTagsByType,
		getLeaderboard: DatasetsEndpoints.getLeaderboard,
		squashCommits: DatasetsEndpoints.squashCommits,
		listAccessRequests: DatasetsEndpoints.listAccessRequests,
		handleAccessRequest: DatasetsEndpoints.handleAccessRequest,
		checkValidity: DatasetsEndpoints.checkValidity,
		getCroissant: DatasetsEndpoints.getCroissant,
		getInfo: DatasetsEndpoints.getInfo,
		getSize: DatasetsEndpoints.getSize,
		listSplits: DatasetsEndpoints.listSplits,
		listParquetFiles: DatasetsEndpoints.listParquetFiles,
		getFirstRows: DatasetsEndpoints.getFirstRows,
		getRows: DatasetsEndpoints.getRows,
		getStatistics: DatasetsEndpoints.getStatistics,
		filterRows: DatasetsEndpoints.filterRows,
		search: DatasetsEndpoints.search,
		createSqlConsoleEmbed: DatasetsEndpoints.createSqlConsoleEmbed,
		updateSqlConsoleEmbed: DatasetsEndpoints.updateSqlConsoleEmbed,
	},
	spaces: {
		list: SpacesEndpoints.list,
		get: SpacesEndpoints.get,
		getScan: SpacesEndpoints.getScan,
		getCompare: SpacesEndpoints.getCompare,
		listCommits: SpacesEndpoints.listCommits,
		listRefs: SpacesEndpoints.listRefs,
		listPathsInfo: SpacesEndpoints.listPathsInfo,
		getTreeSize: SpacesEndpoints.getTreeSize,
		getJwt: SpacesEndpoints.getJwt,
		getXetReadToken: SpacesEndpoints.getXetReadToken,
		getNotebook: SpacesEndpoints.getNotebook,
		getResolve: SpacesEndpoints.getResolve,
		getResolveCache: SpacesEndpoints.getResolveCache,
		createBranch: SpacesEndpoints.createBranch,
		deleteBranch: SpacesEndpoints.deleteBranch,
		createCommit: SpacesEndpoints.createCommit,
		createTag: SpacesEndpoints.createTag,
		deleteTag: SpacesEndpoints.deleteTag,
		checkUploadMethod: SpacesEndpoints.checkUploadMethod,
		updateSettings: SpacesEndpoints.updateSettings,
		listHardware: SpacesEndpoints.listHardware,
		getMetrics: SpacesEndpoints.getMetrics,
		getEvents: SpacesEndpoints.getEvents,
		listLfsFiles: SpacesEndpoints.listLfsFiles,
		getXetWriteToken: SpacesEndpoints.getXetWriteToken,
		squashCommits: SpacesEndpoints.squashCommits,
		createSecret: SpacesEndpoints.createSecret,
		deleteSecret: SpacesEndpoints.deleteSecret,
		createVariable: SpacesEndpoints.createVariable,
		deleteVariable: SpacesEndpoints.deleteVariable,
	},
	collections: {
		create: CollectionsEndpoints.create,
		list: CollectionsEndpoints.list,
	},
	discussions: {
		list: DiscussionsEndpoints.list,
		get: DiscussionsEndpoints.get,
		create: DiscussionsEndpoints.create,
		createComment: DiscussionsEndpoints.createComment,
		changeStatus: DiscussionsEndpoints.changeStatus,
		updateTitle: DiscussionsEndpoints.updateTitle,
		pin: DiscussionsEndpoints.pin,
		delete: DiscussionsEndpoints.delete,
	},
	papers: {
		getDaily: PapersEndpoints.getDaily,
		search: PapersEndpoints.search,
		createIndex: PapersEndpoints.createIndex,
		claimAuthorship: PapersEndpoints.claimAuthorship,
		createComment: PapersEndpoints.createComment,
		createCommentReply: PapersEndpoints.createCommentReply,
	},
	docs: {
		list: DocsEndpoints.list,
		search: DocsEndpoints.search,
	},
	repos: {
		create: ReposEndpoints.create,
		listFiles: ReposEndpoints.listFiles,
		getResolve: ReposEndpoints.getResolve,
		requestAccess: ReposEndpoints.requestAccess,
	},
	users: {
		getAvatar: UsersEndpoints.getAvatar,
		getOverview: UsersEndpoints.getOverview,
		getSocials: UsersEndpoints.getSocials,
	},
	organizations: {
		getAvatar: OrganizationsEndpoints.getAvatar,
		getMembers: OrganizationsEndpoints.getMembers,
		getSocials: OrganizationsEndpoints.getSocials,
	},
	trending: {
		get: TrendingEndpoints.get,
	},
	inference: {
		chatCompletion: InferenceEndpoints.chatCompletion,
		embeddings: InferenceEndpoints.embeddings,
	},
	jobs: {
		getHardware: JobsEndpoints.getHardware,
	},
	endpoints: {
		list: EndpointsEndpoints.list,
		listVendors: EndpointsEndpoints.listVendors,
		deleteNetworkCidr: EndpointsEndpoints.deleteNetworkCidr,
	},
} as const;

export const huggingFaceEndpointSchemas = {
	'account.getWhoami': {
		input: HuggingFaceEndpointInputSchemas.getWhoami,
		output: HuggingFaceEndpointOutputSchemas.getWhoami,
	},
	'account.listNotifications': {
		input: HuggingFaceEndpointInputSchemas.listNotifications,
		output: HuggingFaceEndpointOutputSchemas.listNotifications,
	},
	'account.deleteNotifications': {
		input: HuggingFaceEndpointInputSchemas.deleteNotifications,
		output: HuggingFaceEndpointOutputSchemas.deleteNotifications,
	},
	'settings.updateNotifications': {
		input: HuggingFaceEndpointInputSchemas.updateNotificationSettings,
		output: HuggingFaceEndpointOutputSchemas.updateNotificationSettings,
	},
	'settings.updateWatch': {
		input: HuggingFaceEndpointInputSchemas.updateWatchSettings,
		output: HuggingFaceEndpointOutputSchemas.updateWatchSettings,
	},
	'settings.getMcp': {
		input: HuggingFaceEndpointInputSchemas.getMcpSettings,
		output: HuggingFaceEndpointOutputSchemas.getMcpSettings,
	},
	'settings.getBillingUsageV2': {
		input: HuggingFaceEndpointInputSchemas.getBillingUsageV2,
		output: HuggingFaceEndpointOutputSchemas.getBillingUsageV2,
	},
	'settings.getJobsUsage': {
		input: HuggingFaceEndpointInputSchemas.getJobsUsage,
		output: HuggingFaceEndpointOutputSchemas.getJobsUsage,
	},
	'settings.getLiveBillingUsage': {
		input: HuggingFaceEndpointInputSchemas.getLiveBillingUsage,
		output: HuggingFaceEndpointOutputSchemas.getLiveBillingUsage,
	},
	'settings.listWebhooks': {
		input: HuggingFaceEndpointInputSchemas.listWebhooks,
		output: HuggingFaceEndpointOutputSchemas.listWebhooks,
	},
	'settings.getWebhook': {
		input: HuggingFaceEndpointInputSchemas.getWebhook,
		output: HuggingFaceEndpointOutputSchemas.getWebhook,
	},
	'settings.createWebhook': {
		input: HuggingFaceEndpointInputSchemas.createWebhook,
		output: HuggingFaceEndpointOutputSchemas.createWebhook,
	},
	'settings.updateWebhook': {
		input: HuggingFaceEndpointInputSchemas.updateWebhook,
		output: HuggingFaceEndpointOutputSchemas.updateWebhook,
	},
	'settings.deleteWebhook': {
		input: HuggingFaceEndpointInputSchemas.deleteWebhook,
		output: HuggingFaceEndpointOutputSchemas.deleteWebhook,
	},
	'settings.updateWebhookStatus': {
		input: HuggingFaceEndpointInputSchemas.updateWebhookStatus,
		output: HuggingFaceEndpointOutputSchemas.updateWebhookStatus,
	},
	'models.list': {
		input: HuggingFaceEndpointInputSchemas.modelsList,
		output: HuggingFaceEndpointOutputSchemas.modelsList,
	},
	'models.get': {
		input: HuggingFaceEndpointInputSchemas.modelsGet,
		output: HuggingFaceEndpointOutputSchemas.modelsGet,
	},
	'models.getScan': {
		input: HuggingFaceEndpointInputSchemas.modelsGetScan,
		output: HuggingFaceEndpointOutputSchemas.modelsGetScan,
	},
	'models.getCompare': {
		input: HuggingFaceEndpointInputSchemas.modelsGetCompare,
		output: HuggingFaceEndpointOutputSchemas.modelsGetCompare,
	},
	'models.listCommits': {
		input: HuggingFaceEndpointInputSchemas.modelsListCommits,
		output: HuggingFaceEndpointOutputSchemas.modelsListCommits,
	},
	'models.listRefs': {
		input: HuggingFaceEndpointInputSchemas.modelsListRefs,
		output: HuggingFaceEndpointOutputSchemas.modelsListRefs,
	},
	'models.listPathsInfo': {
		input: HuggingFaceEndpointInputSchemas.modelsListPathsInfo,
		output: HuggingFaceEndpointOutputSchemas.modelsListPathsInfo,
	},
	'models.getTreeSize': {
		input: HuggingFaceEndpointInputSchemas.modelsGetTreeSize,
		output: HuggingFaceEndpointOutputSchemas.modelsGetTreeSize,
	},
	'models.getJwt': {
		input: HuggingFaceEndpointInputSchemas.modelsGetJwt,
		output: HuggingFaceEndpointOutputSchemas.modelsGetJwt,
	},
	'models.getXetReadToken': {
		input: HuggingFaceEndpointInputSchemas.modelsGetXetReadToken,
		output: HuggingFaceEndpointOutputSchemas.modelsGetXetReadToken,
	},
	'models.getNotebook': {
		input: HuggingFaceEndpointInputSchemas.modelsGetNotebook,
		output: HuggingFaceEndpointOutputSchemas.modelsGetNotebook,
	},
	'models.getResolve': {
		input: HuggingFaceEndpointInputSchemas.modelsGetResolve,
		output: HuggingFaceEndpointOutputSchemas.modelsGetResolve,
	},
	'models.getResolveCache': {
		input: HuggingFaceEndpointInputSchemas.modelsGetResolveCache,
		output: HuggingFaceEndpointOutputSchemas.modelsGetResolveCache,
	},
	'models.createBranch': {
		input: HuggingFaceEndpointInputSchemas.modelsCreateBranch,
		output: HuggingFaceEndpointOutputSchemas.modelsCreateBranch,
	},
	'models.deleteBranch': {
		input: HuggingFaceEndpointInputSchemas.modelsDeleteBranch,
		output: HuggingFaceEndpointOutputSchemas.modelsDeleteBranch,
	},
	'models.createCommit': {
		input: HuggingFaceEndpointInputSchemas.modelsCreateCommit,
		output: HuggingFaceEndpointOutputSchemas.modelsCreateCommit,
	},
	'models.createTag': {
		input: HuggingFaceEndpointInputSchemas.modelsCreateTag,
		output: HuggingFaceEndpointOutputSchemas.modelsCreateTag,
	},
	'models.deleteTag': {
		input: HuggingFaceEndpointInputSchemas.modelsDeleteTag,
		output: HuggingFaceEndpointOutputSchemas.modelsDeleteTag,
	},
	'models.checkUploadMethod': {
		input: HuggingFaceEndpointInputSchemas.modelsCheckUploadMethod,
		output: HuggingFaceEndpointOutputSchemas.modelsCheckUploadMethod,
	},
	'models.updateSettings': {
		input: HuggingFaceEndpointInputSchemas.modelsUpdateSettings,
		output: HuggingFaceEndpointOutputSchemas.modelsUpdateSettings,
	},
	'datasets.list': {
		input: HuggingFaceEndpointInputSchemas.datasetsList,
		output: HuggingFaceEndpointOutputSchemas.datasetsList,
	},
	'datasets.get': {
		input: HuggingFaceEndpointInputSchemas.datasetsGet,
		output: HuggingFaceEndpointOutputSchemas.datasetsGet,
	},
	'datasets.getScan': {
		input: HuggingFaceEndpointInputSchemas.datasetsGetScan,
		output: HuggingFaceEndpointOutputSchemas.datasetsGetScan,
	},
	'datasets.getCompare': {
		input: HuggingFaceEndpointInputSchemas.datasetsGetCompare,
		output: HuggingFaceEndpointOutputSchemas.datasetsGetCompare,
	},
	'datasets.listCommits': {
		input: HuggingFaceEndpointInputSchemas.datasetsListCommits,
		output: HuggingFaceEndpointOutputSchemas.datasetsListCommits,
	},
	'datasets.listRefs': {
		input: HuggingFaceEndpointInputSchemas.datasetsListRefs,
		output: HuggingFaceEndpointOutputSchemas.datasetsListRefs,
	},
	'datasets.listPathsInfo': {
		input: HuggingFaceEndpointInputSchemas.datasetsListPathsInfo,
		output: HuggingFaceEndpointOutputSchemas.datasetsListPathsInfo,
	},
	'datasets.getTreeSize': {
		input: HuggingFaceEndpointInputSchemas.datasetsGetTreeSize,
		output: HuggingFaceEndpointOutputSchemas.datasetsGetTreeSize,
	},
	'datasets.getJwt': {
		input: HuggingFaceEndpointInputSchemas.datasetsGetJwt,
		output: HuggingFaceEndpointOutputSchemas.datasetsGetJwt,
	},
	'datasets.getXetReadToken': {
		input: HuggingFaceEndpointInputSchemas.datasetsGetXetReadToken,
		output: HuggingFaceEndpointOutputSchemas.datasetsGetXetReadToken,
	},
	'datasets.getNotebook': {
		input: HuggingFaceEndpointInputSchemas.datasetsGetNotebook,
		output: HuggingFaceEndpointOutputSchemas.datasetsGetNotebook,
	},
	'datasets.getResolve': {
		input: HuggingFaceEndpointInputSchemas.datasetsGetResolve,
		output: HuggingFaceEndpointOutputSchemas.datasetsGetResolve,
	},
	'datasets.getResolveCache': {
		input: HuggingFaceEndpointInputSchemas.datasetsGetResolveCache,
		output: HuggingFaceEndpointOutputSchemas.datasetsGetResolveCache,
	},
	'datasets.createBranch': {
		input: HuggingFaceEndpointInputSchemas.datasetsCreateBranch,
		output: HuggingFaceEndpointOutputSchemas.datasetsCreateBranch,
	},
	'datasets.deleteBranch': {
		input: HuggingFaceEndpointInputSchemas.datasetsDeleteBranch,
		output: HuggingFaceEndpointOutputSchemas.datasetsDeleteBranch,
	},
	'datasets.createCommit': {
		input: HuggingFaceEndpointInputSchemas.datasetsCreateCommit,
		output: HuggingFaceEndpointOutputSchemas.datasetsCreateCommit,
	},
	'datasets.createTag': {
		input: HuggingFaceEndpointInputSchemas.datasetsCreateTag,
		output: HuggingFaceEndpointOutputSchemas.datasetsCreateTag,
	},
	'datasets.deleteTag': {
		input: HuggingFaceEndpointInputSchemas.datasetsDeleteTag,
		output: HuggingFaceEndpointOutputSchemas.datasetsDeleteTag,
	},
	'datasets.checkUploadMethod': {
		input: HuggingFaceEndpointInputSchemas.datasetsCheckUploadMethod,
		output: HuggingFaceEndpointOutputSchemas.datasetsCheckUploadMethod,
	},
	'datasets.updateSettings': {
		input: HuggingFaceEndpointInputSchemas.datasetsUpdateSettings,
		output: HuggingFaceEndpointOutputSchemas.datasetsUpdateSettings,
	},
	'spaces.list': {
		input: HuggingFaceEndpointInputSchemas.spacesList,
		output: HuggingFaceEndpointOutputSchemas.spacesList,
	},
	'spaces.get': {
		input: HuggingFaceEndpointInputSchemas.spacesGet,
		output: HuggingFaceEndpointOutputSchemas.spacesGet,
	},
	'spaces.getScan': {
		input: HuggingFaceEndpointInputSchemas.spacesGetScan,
		output: HuggingFaceEndpointOutputSchemas.spacesGetScan,
	},
	'spaces.getCompare': {
		input: HuggingFaceEndpointInputSchemas.spacesGetCompare,
		output: HuggingFaceEndpointOutputSchemas.spacesGetCompare,
	},
	'spaces.listCommits': {
		input: HuggingFaceEndpointInputSchemas.spacesListCommits,
		output: HuggingFaceEndpointOutputSchemas.spacesListCommits,
	},
	'spaces.listRefs': {
		input: HuggingFaceEndpointInputSchemas.spacesListRefs,
		output: HuggingFaceEndpointOutputSchemas.spacesListRefs,
	},
	'spaces.listPathsInfo': {
		input: HuggingFaceEndpointInputSchemas.spacesListPathsInfo,
		output: HuggingFaceEndpointOutputSchemas.spacesListPathsInfo,
	},
	'spaces.getTreeSize': {
		input: HuggingFaceEndpointInputSchemas.spacesGetTreeSize,
		output: HuggingFaceEndpointOutputSchemas.spacesGetTreeSize,
	},
	'spaces.getJwt': {
		input: HuggingFaceEndpointInputSchemas.spacesGetJwt,
		output: HuggingFaceEndpointOutputSchemas.spacesGetJwt,
	},
	'spaces.getXetReadToken': {
		input: HuggingFaceEndpointInputSchemas.spacesGetXetReadToken,
		output: HuggingFaceEndpointOutputSchemas.spacesGetXetReadToken,
	},
	'spaces.getNotebook': {
		input: HuggingFaceEndpointInputSchemas.spacesGetNotebook,
		output: HuggingFaceEndpointOutputSchemas.spacesGetNotebook,
	},
	'spaces.getResolve': {
		input: HuggingFaceEndpointInputSchemas.spacesGetResolve,
		output: HuggingFaceEndpointOutputSchemas.spacesGetResolve,
	},
	'spaces.getResolveCache': {
		input: HuggingFaceEndpointInputSchemas.spacesGetResolveCache,
		output: HuggingFaceEndpointOutputSchemas.spacesGetResolveCache,
	},
	'spaces.createBranch': {
		input: HuggingFaceEndpointInputSchemas.spacesCreateBranch,
		output: HuggingFaceEndpointOutputSchemas.spacesCreateBranch,
	},
	'spaces.deleteBranch': {
		input: HuggingFaceEndpointInputSchemas.spacesDeleteBranch,
		output: HuggingFaceEndpointOutputSchemas.spacesDeleteBranch,
	},
	'spaces.createCommit': {
		input: HuggingFaceEndpointInputSchemas.spacesCreateCommit,
		output: HuggingFaceEndpointOutputSchemas.spacesCreateCommit,
	},
	'spaces.createTag': {
		input: HuggingFaceEndpointInputSchemas.spacesCreateTag,
		output: HuggingFaceEndpointOutputSchemas.spacesCreateTag,
	},
	'spaces.deleteTag': {
		input: HuggingFaceEndpointInputSchemas.spacesDeleteTag,
		output: HuggingFaceEndpointOutputSchemas.spacesDeleteTag,
	},
	'spaces.checkUploadMethod': {
		input: HuggingFaceEndpointInputSchemas.spacesCheckUploadMethod,
		output: HuggingFaceEndpointOutputSchemas.spacesCheckUploadMethod,
	},
	'spaces.updateSettings': {
		input: HuggingFaceEndpointInputSchemas.spacesUpdateSettings,
		output: HuggingFaceEndpointOutputSchemas.spacesUpdateSettings,
	},
	'models.getTagsByType': {
		input: HuggingFaceEndpointInputSchemas.modelsGetTagsByType,
		output: HuggingFaceEndpointOutputSchemas.modelsGetTagsByType,
	},
	'datasets.getTagsByType': {
		input: HuggingFaceEndpointInputSchemas.datasetsGetTagsByType,
		output: HuggingFaceEndpointOutputSchemas.datasetsGetTagsByType,
	},
	'datasets.getLeaderboard': {
		input: HuggingFaceEndpointInputSchemas.datasetsGetLeaderboard,
		output: HuggingFaceEndpointOutputSchemas.datasetsGetLeaderboard,
	},
	'datasets.squashCommits': {
		input: HuggingFaceEndpointInputSchemas.datasetsSquashCommits,
		output: HuggingFaceEndpointOutputSchemas.datasetsSquashCommits,
	},
	'datasets.listAccessRequests': {
		input: HuggingFaceEndpointInputSchemas.datasetsListAccessRequests,
		output: HuggingFaceEndpointOutputSchemas.datasetsListAccessRequests,
	},
	'datasets.handleAccessRequest': {
		input: HuggingFaceEndpointInputSchemas.datasetsHandleAccessRequest,
		output: HuggingFaceEndpointOutputSchemas.datasetsHandleAccessRequest,
	},
	'datasets.checkValidity': {
		input: HuggingFaceEndpointInputSchemas.datasetsCheckValidity,
		output: HuggingFaceEndpointOutputSchemas.datasetsCheckValidity,
	},
	'datasets.getCroissant': {
		input: HuggingFaceEndpointInputSchemas.datasetsGetCroissant,
		output: HuggingFaceEndpointOutputSchemas.datasetsGetCroissant,
	},
	'datasets.getInfo': {
		input: HuggingFaceEndpointInputSchemas.datasetsGetInfo,
		output: HuggingFaceEndpointOutputSchemas.datasetsGetInfo,
	},
	'datasets.getSize': {
		input: HuggingFaceEndpointInputSchemas.datasetsGetSize,
		output: HuggingFaceEndpointOutputSchemas.datasetsGetSize,
	},
	'datasets.listSplits': {
		input: HuggingFaceEndpointInputSchemas.datasetsListSplits,
		output: HuggingFaceEndpointOutputSchemas.datasetsListSplits,
	},
	'datasets.listParquetFiles': {
		input: HuggingFaceEndpointInputSchemas.datasetsListParquetFiles,
		output: HuggingFaceEndpointOutputSchemas.datasetsListParquetFiles,
	},
	'datasets.getFirstRows': {
		input: HuggingFaceEndpointInputSchemas.datasetsGetFirstRows,
		output: HuggingFaceEndpointOutputSchemas.datasetsGetFirstRows,
	},
	'datasets.getRows': {
		input: HuggingFaceEndpointInputSchemas.datasetsGetRows,
		output: HuggingFaceEndpointOutputSchemas.datasetsGetRows,
	},
	'datasets.getStatistics': {
		input: HuggingFaceEndpointInputSchemas.datasetsGetStatistics,
		output: HuggingFaceEndpointOutputSchemas.datasetsGetStatistics,
	},
	'datasets.filterRows': {
		input: HuggingFaceEndpointInputSchemas.datasetsFilterRows,
		output: HuggingFaceEndpointOutputSchemas.datasetsFilterRows,
	},
	'datasets.search': {
		input: HuggingFaceEndpointInputSchemas.datasetsSearch,
		output: HuggingFaceEndpointOutputSchemas.datasetsSearch,
	},
	'datasets.createSqlConsoleEmbed': {
		input: HuggingFaceEndpointInputSchemas.datasetsCreateSqlConsoleEmbed,
		output: HuggingFaceEndpointOutputSchemas.datasetsCreateSqlConsoleEmbed,
	},
	'datasets.updateSqlConsoleEmbed': {
		input: HuggingFaceEndpointInputSchemas.datasetsUpdateSqlConsoleEmbed,
		output: HuggingFaceEndpointOutputSchemas.datasetsUpdateSqlConsoleEmbed,
	},
	'spaces.listHardware': {
		input: HuggingFaceEndpointInputSchemas.spacesListHardware,
		output: HuggingFaceEndpointOutputSchemas.spacesListHardware,
	},
	'spaces.getMetrics': {
		input: HuggingFaceEndpointInputSchemas.spacesGetMetrics,
		output: HuggingFaceEndpointOutputSchemas.spacesGetMetrics,
	},
	'spaces.getEvents': {
		input: HuggingFaceEndpointInputSchemas.spacesGetEvents,
		output: HuggingFaceEndpointOutputSchemas.spacesGetEvents,
	},
	'spaces.listLfsFiles': {
		input: HuggingFaceEndpointInputSchemas.spacesListLfsFiles,
		output: HuggingFaceEndpointOutputSchemas.spacesListLfsFiles,
	},
	'spaces.getXetWriteToken': {
		input: HuggingFaceEndpointInputSchemas.spacesGetXetWriteToken,
		output: HuggingFaceEndpointOutputSchemas.spacesGetXetWriteToken,
	},
	'spaces.squashCommits': {
		input: HuggingFaceEndpointInputSchemas.spacesSquashCommits,
		output: HuggingFaceEndpointOutputSchemas.spacesSquashCommits,
	},
	'spaces.createSecret': {
		input: HuggingFaceEndpointInputSchemas.spacesCreateSecret,
		output: HuggingFaceEndpointOutputSchemas.spacesCreateSecret,
	},
	'spaces.deleteSecret': {
		input: HuggingFaceEndpointInputSchemas.spacesDeleteSecret,
		output: HuggingFaceEndpointOutputSchemas.spacesDeleteSecret,
	},
	'spaces.createVariable': {
		input: HuggingFaceEndpointInputSchemas.spacesCreateVariable,
		output: HuggingFaceEndpointOutputSchemas.spacesCreateVariable,
	},
	'spaces.deleteVariable': {
		input: HuggingFaceEndpointInputSchemas.spacesDeleteVariable,
		output: HuggingFaceEndpointOutputSchemas.spacesDeleteVariable,
	},
	'collections.create': {
		input: HuggingFaceEndpointInputSchemas.collectionsCreate,
		output: HuggingFaceEndpointOutputSchemas.collectionsCreate,
	},
	'collections.list': {
		input: HuggingFaceEndpointInputSchemas.collectionsList,
		output: HuggingFaceEndpointOutputSchemas.collectionsList,
	},
	'discussions.list': {
		input: HuggingFaceEndpointInputSchemas.discussionsList,
		output: HuggingFaceEndpointOutputSchemas.discussionsList,
	},
	'discussions.get': {
		input: HuggingFaceEndpointInputSchemas.discussionsGet,
		output: HuggingFaceEndpointOutputSchemas.discussionsGet,
	},
	'discussions.create': {
		input: HuggingFaceEndpointInputSchemas.discussionsCreate,
		output: HuggingFaceEndpointOutputSchemas.discussionsCreate,
	},
	'discussions.createComment': {
		input: HuggingFaceEndpointInputSchemas.discussionsCreateComment,
		output: HuggingFaceEndpointOutputSchemas.discussionsCreateComment,
	},
	'discussions.changeStatus': {
		input: HuggingFaceEndpointInputSchemas.discussionsChangeStatus,
		output: HuggingFaceEndpointOutputSchemas.discussionsChangeStatus,
	},
	'discussions.updateTitle': {
		input: HuggingFaceEndpointInputSchemas.discussionsUpdateTitle,
		output: HuggingFaceEndpointOutputSchemas.discussionsUpdateTitle,
	},
	'discussions.pin': {
		input: HuggingFaceEndpointInputSchemas.discussionsPin,
		output: HuggingFaceEndpointOutputSchemas.discussionsPin,
	},
	'discussions.delete': {
		input: HuggingFaceEndpointInputSchemas.discussionsDelete,
		output: HuggingFaceEndpointOutputSchemas.discussionsDelete,
	},
	'papers.getDaily': {
		input: HuggingFaceEndpointInputSchemas.papersGetDaily,
		output: HuggingFaceEndpointOutputSchemas.papersGetDaily,
	},
	'papers.search': {
		input: HuggingFaceEndpointInputSchemas.papersSearch,
		output: HuggingFaceEndpointOutputSchemas.papersSearch,
	},
	'papers.createIndex': {
		input: HuggingFaceEndpointInputSchemas.papersCreateIndex,
		output: HuggingFaceEndpointOutputSchemas.papersCreateIndex,
	},
	'papers.claimAuthorship': {
		input: HuggingFaceEndpointInputSchemas.papersClaimAuthorship,
		output: HuggingFaceEndpointOutputSchemas.papersClaimAuthorship,
	},
	'papers.createComment': {
		input: HuggingFaceEndpointInputSchemas.papersCreateComment,
		output: HuggingFaceEndpointOutputSchemas.papersCreateComment,
	},
	'papers.createCommentReply': {
		input: HuggingFaceEndpointInputSchemas.papersCreateCommentReply,
		output: HuggingFaceEndpointOutputSchemas.papersCreateCommentReply,
	},
	'docs.list': {
		input: HuggingFaceEndpointInputSchemas.docsList,
		output: HuggingFaceEndpointOutputSchemas.docsList,
	},
	'docs.search': {
		input: HuggingFaceEndpointInputSchemas.docsSearch,
		output: HuggingFaceEndpointOutputSchemas.docsSearch,
	},
	'repos.create': {
		input: HuggingFaceEndpointInputSchemas.reposCreate,
		output: HuggingFaceEndpointOutputSchemas.reposCreate,
	},
	'repos.listFiles': {
		input: HuggingFaceEndpointInputSchemas.reposListFiles,
		output: HuggingFaceEndpointOutputSchemas.reposListFiles,
	},
	'repos.getResolve': {
		input: HuggingFaceEndpointInputSchemas.reposGetResolve,
		output: HuggingFaceEndpointOutputSchemas.reposGetResolve,
	},
	'repos.requestAccess': {
		input: HuggingFaceEndpointInputSchemas.reposRequestAccess,
		output: HuggingFaceEndpointOutputSchemas.reposRequestAccess,
	},
	'users.getAvatar': {
		input: HuggingFaceEndpointInputSchemas.usersGetAvatar,
		output: HuggingFaceEndpointOutputSchemas.usersGetAvatar,
	},
	'users.getOverview': {
		input: HuggingFaceEndpointInputSchemas.usersGetOverview,
		output: HuggingFaceEndpointOutputSchemas.usersGetOverview,
	},
	'users.getSocials': {
		input: HuggingFaceEndpointInputSchemas.usersGetSocials,
		output: HuggingFaceEndpointOutputSchemas.usersGetSocials,
	},
	'organizations.getAvatar': {
		input: HuggingFaceEndpointInputSchemas.organizationsGetAvatar,
		output: HuggingFaceEndpointOutputSchemas.organizationsGetAvatar,
	},
	'organizations.getMembers': {
		input: HuggingFaceEndpointInputSchemas.organizationsGetMembers,
		output: HuggingFaceEndpointOutputSchemas.organizationsGetMembers,
	},
	'organizations.getSocials': {
		input: HuggingFaceEndpointInputSchemas.organizationsGetSocials,
		output: HuggingFaceEndpointOutputSchemas.organizationsGetSocials,
	},
	'trending.get': {
		input: HuggingFaceEndpointInputSchemas.trendingGet,
		output: HuggingFaceEndpointOutputSchemas.trendingGet,
	},
	'inference.chatCompletion': {
		input: HuggingFaceEndpointInputSchemas.inferenceChatCompletion,
		output: HuggingFaceEndpointOutputSchemas.inferenceChatCompletion,
	},
	'inference.embeddings': {
		input: HuggingFaceEndpointInputSchemas.inferenceEmbeddings,
		output: HuggingFaceEndpointOutputSchemas.inferenceEmbeddings,
	},
	'jobs.getHardware': {
		input: HuggingFaceEndpointInputSchemas.jobsGetHardware,
		output: HuggingFaceEndpointOutputSchemas.jobsGetHardware,
	},
	'endpoints.list': {
		input: HuggingFaceEndpointInputSchemas.endpointsList,
		output: HuggingFaceEndpointOutputSchemas.endpointsList,
	},
	'endpoints.listVendors': {
		input: HuggingFaceEndpointInputSchemas.endpointsListVendors,
		output: HuggingFaceEndpointOutputSchemas.endpointsListVendors,
	},
	'endpoints.deleteNetworkCidr': {
		input: HuggingFaceEndpointInputSchemas.endpointsDeleteNetworkCidr,
		output: HuggingFaceEndpointOutputSchemas.endpointsDeleteNetworkCidr,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof huggingFaceEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const huggingFaceEndpointMeta = {
	'account.getWhoami': {
		riskLevel: 'read',
		description: 'Get authenticated Hugging Face user info',
	},
	'account.listNotifications': {
		riskLevel: 'read',
		description: 'List notifications for the authenticated user',
	},
	'account.deleteNotifications': {
		riskLevel: 'destructive',
		description: 'Delete notifications by discussion ids or filters',
	},
	'settings.updateNotifications': {
		riskLevel: 'write',
		description: 'Update notification settings for the authenticated user',
	},
	'settings.updateWatch': {
		riskLevel: 'write',
		description: 'Update watch settings (orgs/users/repos to follow)',
	},
	'settings.getMcp': {
		riskLevel: 'read',
		description: 'Get MCP tools configuration for the authenticated user',
	},
	'settings.getBillingUsageV2': {
		riskLevel: 'read',
		description: 'Get billing usage for a custom date range (unix timestamps)',
	},
	'settings.getJobsUsage': {
		riskLevel: 'read',
		description: 'Get Jobs usage and billing for current subscription period',
	},
	'settings.getLiveBillingUsage': {
		riskLevel: 'read',
		description: 'Get live billing usage stream snapshot',
	},
	'settings.listWebhooks': {
		riskLevel: 'read',
		description: 'List all webhooks in settings',
	},
	'settings.getWebhook': {
		riskLevel: 'read',
		description: 'Get a webhook by id',
	},
	'settings.createWebhook': {
		riskLevel: 'write',
		description: 'Create a settings webhook',
	},
	'settings.updateWebhook': {
		riskLevel: 'write',
		description: 'Update an existing settings webhook',
	},
	'settings.deleteWebhook': {
		riskLevel: 'destructive',
		description: 'Delete a settings webhook',
	},
	'settings.updateWebhookStatus': {
		riskLevel: 'write',
		description: 'Enable or disable a webhook (action: enable|disable)',
	},
	'models.list': {
		riskLevel: 'read',
		description: 'List models on the Hub',
	},
	'models.get': {
		riskLevel: 'read',
		description: 'Get model repository info',
	},
	'models.getScan': {
		riskLevel: 'read',
		description: 'Get security scan status for a model',
	},
	'models.getCompare': {
		riskLevel: 'read',
		description: 'Compare two revisions of a model',
	},
	'models.listCommits': {
		riskLevel: 'read',
		description: 'List commits for a model',
	},
	'models.listRefs': {
		riskLevel: 'read',
		description: 'List refs (branches/tags) for a model',
	},
	'models.listPathsInfo': {
		riskLevel: 'read',
		description: 'List path metadata in a model',
	},
	'models.getTreeSize': {
		riskLevel: 'read',
		description: 'Get repository tree size for a model',
	},
	'models.getJwt': {
		riskLevel: 'read',
		description: 'Get JWT for a model repo',
	},
	'models.getXetReadToken': {
		riskLevel: 'read',
		description: 'Get XET read token for a model',
	},
	'models.getNotebook': {
		riskLevel: 'read',
		description: 'Get notebook URL from a model',
	},
	'models.getResolve': {
		riskLevel: 'read',
		description: 'Resolve a file from a model (follows redirects / XET info)',
	},
	'models.getResolveCache': {
		riskLevel: 'read',
		description: 'Resolve a file from model cache',
	},
	'models.createBranch': {
		riskLevel: 'write',
		description: 'Create a branch on a model',
	},
	'models.deleteBranch': {
		riskLevel: 'destructive',
		description: 'Delete a branch on a model',
	},
	'models.createCommit': {
		riskLevel: 'write',
		description:
			'Create a commit on a model (Hub NDJSON/JSON: files, deletedEntries, lfsFiles)',
	},
	'models.createTag': {
		riskLevel: 'write',
		description: 'Create a tag on a model',
	},
	'models.deleteTag': {
		riskLevel: 'destructive',
		description: 'Delete a tag on a model',
	},
	'models.checkUploadMethod': {
		riskLevel: 'read',
		description: 'Check LFS vs regular upload method for model files',
	},
	'models.updateSettings': {
		riskLevel: 'write',
		description: 'Update settings for a model repository',
	},
	'datasets.list': {
		riskLevel: 'read',
		description: 'List datasets on the Hub',
	},
	'datasets.get': {
		riskLevel: 'read',
		description: 'Get dataset repository info',
	},
	'datasets.getScan': {
		riskLevel: 'read',
		description: 'Get security scan status for a dataset',
	},
	'datasets.getCompare': {
		riskLevel: 'read',
		description: 'Compare two revisions of a dataset',
	},
	'datasets.listCommits': {
		riskLevel: 'read',
		description: 'List commits for a dataset',
	},
	'datasets.listRefs': {
		riskLevel: 'read',
		description: 'List refs (branches/tags) for a dataset',
	},
	'datasets.listPathsInfo': {
		riskLevel: 'read',
		description: 'List path metadata in a dataset',
	},
	'datasets.getTreeSize': {
		riskLevel: 'read',
		description: 'Get repository tree size for a dataset',
	},
	'datasets.getJwt': {
		riskLevel: 'read',
		description: 'Get JWT for a dataset repo',
	},
	'datasets.getXetReadToken': {
		riskLevel: 'read',
		description: 'Get XET read token for a dataset',
	},
	'datasets.getNotebook': {
		riskLevel: 'read',
		description: 'Get notebook URL from a dataset',
	},
	'datasets.getResolve': {
		riskLevel: 'read',
		description: 'Resolve a file from a dataset (follows redirects / XET info)',
	},
	'datasets.getResolveCache': {
		riskLevel: 'read',
		description: 'Resolve a file from dataset cache',
	},
	'datasets.createBranch': {
		riskLevel: 'write',
		description: 'Create a branch on a dataset',
	},
	'datasets.deleteBranch': {
		riskLevel: 'destructive',
		description: 'Delete a branch on a dataset',
	},
	'datasets.createCommit': {
		riskLevel: 'write',
		description:
			'Create a commit on a dataset (Hub NDJSON/JSON: files, deletedEntries, lfsFiles)',
	},
	'datasets.createTag': {
		riskLevel: 'write',
		description: 'Create a tag on a dataset',
	},
	'datasets.deleteTag': {
		riskLevel: 'destructive',
		description: 'Delete a tag on a dataset',
	},
	'datasets.checkUploadMethod': {
		riskLevel: 'read',
		description: 'Check LFS vs regular upload method for dataset files',
	},
	'datasets.updateSettings': {
		riskLevel: 'write',
		description: 'Update settings for a dataset repository',
	},
	'spaces.list': {
		riskLevel: 'read',
		description: 'List spaces on the Hub',
	},
	'spaces.get': {
		riskLevel: 'read',
		description: 'Get space repository info',
	},
	'spaces.getScan': {
		riskLevel: 'read',
		description: 'Get security scan status for a space',
	},
	'spaces.getCompare': {
		riskLevel: 'read',
		description: 'Compare two revisions of a space',
	},
	'spaces.listCommits': {
		riskLevel: 'read',
		description: 'List commits for a space',
	},
	'spaces.listRefs': {
		riskLevel: 'read',
		description: 'List refs (branches/tags) for a space',
	},
	'spaces.listPathsInfo': {
		riskLevel: 'read',
		description: 'List path metadata in a space',
	},
	'spaces.getTreeSize': {
		riskLevel: 'read',
		description: 'Get repository tree size for a space',
	},
	'spaces.getJwt': {
		riskLevel: 'read',
		description: 'Get JWT for a space repo',
	},
	'spaces.getXetReadToken': {
		riskLevel: 'read',
		description: 'Get XET read token for a space',
	},
	'spaces.getNotebook': {
		riskLevel: 'read',
		description: 'Get notebook URL from a space',
	},
	'spaces.getResolve': {
		riskLevel: 'read',
		description: 'Resolve a file from a space (follows redirects / XET info)',
	},
	'spaces.getResolveCache': {
		riskLevel: 'read',
		description: 'Resolve a file from space cache',
	},
	'spaces.createBranch': {
		riskLevel: 'write',
		description: 'Create a branch on a space',
	},
	'spaces.deleteBranch': {
		riskLevel: 'destructive',
		description: 'Delete a branch on a space',
	},
	'spaces.createCommit': {
		riskLevel: 'write',
		description:
			'Create a commit on a space (Hub NDJSON/JSON: files, deletedEntries, lfsFiles)',
	},
	'spaces.createTag': {
		riskLevel: 'write',
		description: 'Create a tag on a space',
	},
	'spaces.deleteTag': {
		riskLevel: 'destructive',
		description: 'Delete a tag on a space',
	},
	'spaces.checkUploadMethod': {
		riskLevel: 'read',
		description: 'Check LFS vs regular upload method for space files',
	},
	'spaces.updateSettings': {
		riskLevel: 'write',
		description: 'Update settings for a space repository',
	},
	'models.getTagsByType': {
		riskLevel: 'read',
		description: 'Get model tags grouped by type',
	},
	'datasets.getTagsByType': {
		riskLevel: 'read',
		description: 'Get dataset tags grouped by type',
	},
	'datasets.getLeaderboard': {
		riskLevel: 'read',
		description: 'Get evaluation leaderboard for a dataset',
	},
	'datasets.squashCommits': {
		riskLevel: 'destructive',
		description: 'Squash all commits in a dataset ref (irreversible)',
	},
	'datasets.listAccessRequests': {
		riskLevel: 'read',
		description: 'List access requests for a gated dataset',
	},
	'datasets.handleAccessRequest': {
		riskLevel: 'write',
		description: 'Accept/reject gated dataset access request',
	},
	'datasets.checkValidity': {
		riskLevel: 'read',
		description: 'Check whether a dataset is valid on the Hub viewer',
	},
	'datasets.getCroissant': {
		riskLevel: 'read',
		description: 'Get Croissant JSON-LD metadata for a dataset',
	},
	'datasets.getInfo': {
		riskLevel: 'read',
		description: 'Get dataset info (features, splits, citation)',
	},
	'datasets.getSize': {
		riskLevel: 'read',
		description: 'Get dataset size (rows and bytes)',
	},
	'datasets.listSplits': {
		riskLevel: 'read',
		description: 'List dataset configurations and splits',
	},
	'datasets.listParquetFiles': {
		riskLevel: 'read',
		description: 'List Parquet files for a dataset',
	},
	'datasets.getFirstRows': {
		riskLevel: 'read',
		description: 'Get first ~100 rows of a dataset split',
	},
	'datasets.getRows': {
		riskLevel: 'read',
		description: 'Get a slice of dataset rows (offset/length)',
	},
	'datasets.getStatistics': {
		riskLevel: 'read',
		description: 'Get statistics for a dataset split',
	},
	'datasets.filterRows': {
		riskLevel: 'read',
		description: 'Filter dataset rows with SQL-like where clause',
	},
	'datasets.search': {
		riskLevel: 'read',
		description: 'Full-text search within a dataset split',
	},
	'datasets.createSqlConsoleEmbed': {
		riskLevel: 'write',
		description: 'Create a SQL Console embed for a dataset',
	},
	'datasets.updateSqlConsoleEmbed': {
		riskLevel: 'write',
		description: 'Update a SQL Console embed',
	},
	'spaces.listHardware': {
		riskLevel: 'read',
		description: 'List available Space hardware configurations',
	},
	'spaces.getMetrics': {
		riskLevel: 'read',
		description: 'Get live Space metrics (SSE snapshot)',
	},
	'spaces.getEvents': {
		riskLevel: 'read',
		description: 'Stream Space status events (SSE snapshot)',
	},
	'spaces.listLfsFiles': {
		riskLevel: 'read',
		description: 'List LFS files in a Space',
	},
	'spaces.getXetWriteToken': {
		riskLevel: 'write',
		description: 'Get XET write token for a Space',
	},
	'spaces.squashCommits': {
		riskLevel: 'destructive',
		description: 'Squash all commits in a Space ref (irreversible)',
	},
	'spaces.createSecret': {
		riskLevel: 'write',
		description: 'Create or update a Space secret',
	},
	'spaces.deleteSecret': {
		riskLevel: 'destructive',
		description: 'Delete a Space secret',
	},
	'spaces.createVariable': {
		riskLevel: 'write',
		description: 'Create or update a Space variable',
	},
	'spaces.deleteVariable': {
		riskLevel: 'destructive',
		description: 'Delete a Space variable',
	},
	'collections.create': {
		riskLevel: 'write',
		description: 'Create a new collection',
	},
	'collections.list': {
		riskLevel: 'read',
		description: 'List collections on the Hub',
	},
	'discussions.list': {
		riskLevel: 'read',
		description: 'List discussions for a repository',
	},
	'discussions.get': {
		riskLevel: 'read',
		description: 'Get discussion details',
	},
	'discussions.create': {
		riskLevel: 'write',
		description: 'Create a discussion on a repository',
	},
	'discussions.createComment': {
		riskLevel: 'write',
		description: 'Comment on a discussion',
	},
	'discussions.changeStatus': {
		riskLevel: 'write',
		description: 'Open or close a discussion',
	},
	'discussions.updateTitle': {
		riskLevel: 'write',
		description: 'Update discussion title',
	},
	'discussions.pin': {
		riskLevel: 'write',
		description: 'Pin or unpin a discussion',
	},
	'discussions.delete': {
		riskLevel: 'destructive',
		description: 'Delete a discussion',
	},
	'papers.getDaily': {
		riskLevel: 'read',
		description: 'Get daily papers',
	},
	'papers.search': {
		riskLevel: 'read',
		description: 'Search papers (hybrid semantic/full-text)',
	},
	'papers.createIndex': {
		riskLevel: 'write',
		description: 'Index an arXiv paper by id',
	},
	'papers.claimAuthorship': {
		riskLevel: 'write',
		description: 'Claim authorship of a paper',
	},
	'papers.createComment': {
		riskLevel: 'write',
		description: 'Comment on a paper',
	},
	'papers.createCommentReply': {
		riskLevel: 'write',
		description: 'Reply to a paper comment',
	},
	'docs.list': {
		riskLevel: 'read',
		description: 'List available Hugging Face documentation',
	},
	'docs.search': {
		riskLevel: 'read',
		description: 'Search Hugging Face documentation',
	},
	'repos.create': {
		riskLevel: 'write',
		description: 'Create a model, dataset, or Space repository',
	},
	'repos.listFiles': {
		riskLevel: 'read',
		description: 'List repository file tree with pagination',
	},
	'repos.getResolve': {
		riskLevel: 'read',
		description: 'Resolve a file in any repository type',
	},
	'repos.requestAccess': {
		riskLevel: 'write',
		description: 'Request access to a gated repository',
	},
	'users.getAvatar': {
		riskLevel: 'read',
		description: 'Get user avatar URL',
	},
	'users.getOverview': {
		riskLevel: 'read',
		description: 'Get user profile overview',
	},
	'users.getSocials': {
		riskLevel: 'read',
		description: 'Get user social handles',
	},
	'organizations.getAvatar': {
		riskLevel: 'read',
		description: 'Get organization avatar',
	},
	'organizations.getMembers': {
		riskLevel: 'read',
		description: 'List organization members',
	},
	'organizations.getSocials': {
		riskLevel: 'read',
		description: 'Get organization social handles',
	},
	'trending.get': {
		riskLevel: 'read',
		description: 'Get trending repositories',
	},
	'inference.chatCompletion': {
		riskLevel: 'write',
		description:
			'Generate chat completion via Inference Providers (OpenAI-compatible)',
	},
	'inference.embeddings': {
		riskLevel: 'write',
		description: 'Generate text embeddings via Inference Providers',
	},
	'jobs.getHardware': {
		riskLevel: 'read',
		description: 'List available Jobs hardware',
	},
	'endpoints.list': {
		riskLevel: 'read',
		description: 'List Inference Endpoints for a namespace',
	},
	'endpoints.listVendors': {
		riskLevel: 'read',
		description: 'List cloud provider vendors for Inference Endpoints',
	},
	'endpoints.deleteNetworkCidr': {
		riskLevel: 'destructive',
		description: 'Delete a network CIDR list entry for Inference Endpoints',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof huggingFaceEndpointsNested
>;

export const huggingFaceAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseHuggingFacePlugin<T extends HuggingFacePluginOptions> =
	CorsairPlugin<
		'huggingface',
		typeof HuggingFaceSchema,
		typeof huggingFaceEndpointsNested,
		Record<string, never>,
		T,
		typeof defaultAuthType
	>;

export type InternalHuggingFacePlugin =
	BaseHuggingFacePlugin<HuggingFacePluginOptions>;

export type ExternalHuggingFacePlugin<T extends HuggingFacePluginOptions> =
	BaseHuggingFacePlugin<T>;

export function huggingface<const T extends HuggingFacePluginOptions>(
	// cast: empty default satisfies generic T when callers omit options
	incomingOptions: HuggingFacePluginOptions &
		T = {} as HuggingFacePluginOptions & T,
): ExternalHuggingFacePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'huggingface',
		authConfig: huggingFaceAuthConfig,
		schema: HuggingFaceSchema,
		options,
		hooks: options.hooks,
		endpoints: huggingFaceEndpointsNested,
		webhooks: {},
		endpointMeta: huggingFaceEndpointMeta,
		endpointSchemas: huggingFaceEndpointSchemas,
		webhookSchemas: {},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: HuggingFaceKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					// Public Hub GETs work without a token; return empty string.
					return '';
				}
				return res;
			}

			if (source === 'endpoint' && ctx.authType === 'oauth_2') {
				const res = await ctx.keys.get_access_token();
				if (!res) {
					throw new AuthMissingError(
						'oauth_2',
						'Hugging Face OAuth access token is required',
					);
				}
				return res;
			}

			return '';
		},
	} satisfies InternalHuggingFacePlugin;
}

export type {
	HuggingFaceEndpointInputs,
	HuggingFaceEndpointOutputs,
} from './endpoints/types';
