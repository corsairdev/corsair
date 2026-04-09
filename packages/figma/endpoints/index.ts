import * as ActivityLogsEndpoints from './activityLogs';
import * as CommentsEndpoints from './comments';
import * as ComponentsEndpoints from './components';
import * as DesignToolsEndpoints from './designTools';
import * as DevResourcesEndpoints from './devResources';
import * as FilesEndpoints from './files';
import * as LibraryAnalyticsEndpoints from './libraryAnalytics';
import * as PaymentsEndpoints from './payments';
import * as ProjectsEndpoints from './projects';
import * as StylesEndpoints from './styles';
import * as UsersEndpoints from './users';
import * as VariablesEndpoints from './variables';
import * as WebhooksEndpoints from './webhooks';

export const Comments = {
	add: CommentsEndpoints.add,
	delete: CommentsEndpoints.deleteComment,
	list: CommentsEndpoints.list,
	getReactions: CommentsEndpoints.getReactions,
	addReaction: CommentsEndpoints.addReaction,
	deleteReaction: CommentsEndpoints.deleteReaction,
};

export const Webhooks = {
	create: WebhooksEndpoints.create,
	delete: WebhooksEndpoints.deleteWebhook,
	get: WebhooksEndpoints.get,
	list: WebhooksEndpoints.list,
	getRequests: WebhooksEndpoints.getRequests,
	update: WebhooksEndpoints.update,
};

export const DevResources = {
	create: DevResourcesEndpoints.create,
	delete: DevResourcesEndpoints.deleteDevResource,
	get: DevResourcesEndpoints.get,
	update: DevResourcesEndpoints.update,
};

export const Variables = {
	createModifyDelete: VariablesEndpoints.createModifyDelete,
	getLocal: VariablesEndpoints.getLocal,
	getPublished: VariablesEndpoints.getPublished,
};

export const Components = {
	get: ComponentsEndpoints.get,
	getComponentSet: ComponentsEndpoints.getComponentSet,
	getForFile: ComponentsEndpoints.getForFile,
	getComponentSetsForFile: ComponentsEndpoints.getComponentSetsForFile,
	getForTeam: ComponentsEndpoints.getForTeam,
	getComponentSetsForTeam: ComponentsEndpoints.getComponentSetsForTeam,
};

export const Files = {
	getJSON: FilesEndpoints.getJSON,
	getMetadata: FilesEndpoints.getMetadata,
	getNodes: FilesEndpoints.getNodes,
	getStyles: FilesEndpoints.getStyles,
	getImageFills: FilesEndpoints.getImageFills,
	getVersions: FilesEndpoints.getVersions,
	renderImages: FilesEndpoints.renderImages,
	getProjectFiles: FilesEndpoints.getProjectFiles,
};

export const Styles = {
	get: StylesEndpoints.get,
	getForTeam: StylesEndpoints.getForTeam,
};

export const Projects = {
	getTeamProjects: ProjectsEndpoints.getTeamProjects,
};

export const Users = {
	getCurrent: UsersEndpoints.getCurrent,
};

export const LibraryAnalytics = {
	componentActions: LibraryAnalyticsEndpoints.componentActions,
	componentUsages: LibraryAnalyticsEndpoints.componentUsages,
	styleActions: LibraryAnalyticsEndpoints.styleActions,
	styleUsages: LibraryAnalyticsEndpoints.styleUsages,
	variableActions: LibraryAnalyticsEndpoints.variableActions,
	variableUsages: LibraryAnalyticsEndpoints.variableUsages,
};

export const ActivityLogs = {
	list: ActivityLogsEndpoints.list,
};

export const Payments = {
	get: PaymentsEndpoints.get,
};

export const DesignTools = {
	discoverResources: DesignToolsEndpoints.discoverResources,
	extractDesignTokens: DesignToolsEndpoints.extractDesignTokens,
	extractPrototypeInteractions:
		DesignToolsEndpoints.extractPrototypeInteractions,
	downloadImages: DesignToolsEndpoints.downloadImages,
	designTokensToTailwind: DesignToolsEndpoints.designTokensToTailwind,
};

export * from './types';
