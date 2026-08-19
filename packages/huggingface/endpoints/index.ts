import * as Account from './account';
import * as Collections from './collections';
import * as Datasets from './datasets';
import * as Discussions from './discussions';
import * as Docs from './docs';
import * as Endpoints from './endpoints';
import * as Inference from './inference';
import * as Jobs from './jobs';
import * as Models from './models';
import * as Organizations from './organizations';
import * as Papers from './papers';
import * as Repos from './repos';
import * as Settings from './settings';
import * as Spaces from './spaces';
import * as Trending from './trending';
import * as Users from './users';

export const AccountEndpoints = {
	getWhoami: Account.getWhoami,
	listNotifications: Account.listNotifications,
	deleteNotifications: Account.deleteNotifications,
} as const;

export const SettingsEndpoints = {
	updateNotifications: Settings.updateNotifications,
	updateWatch: Settings.updateWatch,
	getMcp: Settings.getMcp,
	getBillingUsageV2: Settings.getBillingUsageV2,
	getJobsUsage: Settings.getJobsUsage,
	getLiveBillingUsage: Settings.getLiveBillingUsage,
	listWebhooks: Settings.listWebhooks,
	getWebhook: Settings.getWebhook,
	createWebhook: Settings.createWebhook,
	updateWebhook: Settings.updateWebhook,
	deleteWebhook: Settings.deleteWebhook,
	updateWebhookStatus: Settings.updateWebhookStatus,
} as const;

export const ModelsEndpoints = {
	list: Models.list,
	get: Models.get,
	getScan: Models.getScan,
	getCompare: Models.getCompare,
	listCommits: Models.listCommits,
	listRefs: Models.listRefs,
	listPathsInfo: Models.listPathsInfo,
	getTreeSize: Models.getTreeSize,
	getJwt: Models.getJwt,
	getXetReadToken: Models.getXetReadToken,
	getNotebook: Models.getNotebook,
	getResolve: Models.getResolve,
	getResolveCache: Models.getResolveCache,
	createBranch: Models.createBranch,
	deleteBranch: Models.deleteBranch,
	createCommit: Models.createCommit,
	createTag: Models.createTag,
	deleteTag: Models.deleteTag,
	checkUploadMethod: Models.checkUploadMethod,
	updateSettings: Models.updateSettings,
	getTagsByType: Models.getTagsByType,
} as const;

export const DatasetsEndpoints = {
	list: Datasets.list,
	get: Datasets.get,
	getScan: Datasets.getScan,
	getCompare: Datasets.getCompare,
	listCommits: Datasets.listCommits,
	listRefs: Datasets.listRefs,
	listPathsInfo: Datasets.listPathsInfo,
	getTreeSize: Datasets.getTreeSize,
	getJwt: Datasets.getJwt,
	getXetReadToken: Datasets.getXetReadToken,
	getNotebook: Datasets.getNotebook,
	getResolve: Datasets.getResolve,
	getResolveCache: Datasets.getResolveCache,
	createBranch: Datasets.createBranch,
	deleteBranch: Datasets.deleteBranch,
	createCommit: Datasets.createCommit,
	createTag: Datasets.createTag,
	deleteTag: Datasets.deleteTag,
	checkUploadMethod: Datasets.checkUploadMethod,
	updateSettings: Datasets.updateSettings,
	getTagsByType: Datasets.getTagsByType,
	getLeaderboard: Datasets.getLeaderboard,
	squashCommits: Datasets.squashCommits,
	listAccessRequests: Datasets.listAccessRequests,
	handleAccessRequest: Datasets.handleAccessRequest,
	checkValidity: Datasets.checkValidity,
	getCroissant: Datasets.getCroissant,
	getInfo: Datasets.getInfo,
	getSize: Datasets.getSize,
	listSplits: Datasets.listSplits,
	listParquetFiles: Datasets.listParquetFiles,
	getFirstRows: Datasets.getFirstRows,
	getRows: Datasets.getRows,
	getStatistics: Datasets.getStatistics,
	filterRows: Datasets.filterRows,
	search: Datasets.search,
	createSqlConsoleEmbed: Datasets.createSqlConsoleEmbed,
	updateSqlConsoleEmbed: Datasets.updateSqlConsoleEmbed,
} as const;

export const SpacesEndpoints = {
	list: Spaces.list,
	get: Spaces.get,
	getScan: Spaces.getScan,
	getCompare: Spaces.getCompare,
	listCommits: Spaces.listCommits,
	listRefs: Spaces.listRefs,
	listPathsInfo: Spaces.listPathsInfo,
	getTreeSize: Spaces.getTreeSize,
	getJwt: Spaces.getJwt,
	getXetReadToken: Spaces.getXetReadToken,
	getNotebook: Spaces.getNotebook,
	getResolve: Spaces.getResolve,
	getResolveCache: Spaces.getResolveCache,
	createBranch: Spaces.createBranch,
	deleteBranch: Spaces.deleteBranch,
	createCommit: Spaces.createCommit,
	createTag: Spaces.createTag,
	deleteTag: Spaces.deleteTag,
	checkUploadMethod: Spaces.checkUploadMethod,
	updateSettings: Spaces.updateSettings,
	listHardware: Spaces.listHardware,
	getMetrics: Spaces.getMetrics,
	getEvents: Spaces.getEvents,
	listLfsFiles: Spaces.listLfsFiles,
	getXetWriteToken: Spaces.getXetWriteToken,
	squashCommits: Spaces.squashCommits,
	createSecret: Spaces.createSecret,
	deleteSecret: Spaces.deleteSecret,
	createVariable: Spaces.createVariable,
	deleteVariable: Spaces.deleteVariable,
} as const;

export const CollectionsEndpoints = {
	create: Collections.create,
	list: Collections.list,
} as const;

export const DiscussionsEndpoints = {
	list: Discussions.list,
	get: Discussions.get,
	create: Discussions.create,
	createComment: Discussions.createComment,
	changeStatus: Discussions.changeStatus,
	updateTitle: Discussions.updateTitle,
	pin: Discussions.pin,
	delete: Discussions.deleteDiscussion,
} as const;

export const PapersEndpoints = {
	getDaily: Papers.getDaily,
	search: Papers.search,
	createIndex: Papers.createIndex,
	claimAuthorship: Papers.claimAuthorship,
	createComment: Papers.createComment,
	createCommentReply: Papers.createCommentReply,
} as const;

export const DocsEndpoints = {
	list: Docs.list,
	search: Docs.search,
} as const;

export const ReposEndpoints = {
	create: Repos.create,
	listFiles: Repos.listFiles,
	getResolve: Repos.getResolve,
	requestAccess: Repos.requestAccess,
} as const;

export const UsersEndpoints = {
	getAvatar: Users.getAvatar,
	getOverview: Users.getOverview,
	getSocials: Users.getSocials,
} as const;

export const OrganizationsEndpoints = {
	getAvatar: Organizations.getAvatar,
	getMembers: Organizations.getMembers,
	getSocials: Organizations.getSocials,
} as const;

export const TrendingEndpoints = {
	get: Trending.get,
} as const;

export const InferenceEndpoints = {
	chatCompletion: Inference.chatCompletion,
	embeddings: Inference.embeddings,
} as const;

export const JobsEndpoints = {
	getHardware: Jobs.getHardware,
} as const;

export const EndpointsEndpoints = {
	list: Endpoints.list,
	listVendors: Endpoints.listVendors,
	deleteNetworkCidr: Endpoints.deleteNetworkCidr,
} as const;
