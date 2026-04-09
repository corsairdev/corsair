import type {
	AuthTypes,
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
} from 'corsair/core';
import {
	ActivityLogs,
	Comments,
	Components,
	DesignTools,
	DevResources,
	Files,
	LibraryAnalytics,
	Payments,
	Projects,
	Styles,
	Users,
	Variables,
	Webhooks,
} from './endpoints';
import type {
	FigmaEndpointInputs,
	FigmaEndpointOutputs,
} from './endpoints/types';
import {
	FigmaEndpointInputSchemas,
	FigmaEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { FigmaSchema } from './schema';
import {
	FileCommentWebhooks,
	FileDeleteWebhooks,
	FileUpdateWebhooks,
	FileVersionUpdateWebhooks,
	LibraryPublishWebhooks,
	PingWebhooks,
} from './webhooks';
import type {
	FigmaFileCommentEvent,
	FigmaFileDeleteEvent,
	FigmaFileUpdateEvent,
	FigmaFileVersionUpdateEvent,
	FigmaLibraryPublishEvent,
	FigmaPingEvent,
	FigmaWebhookOutputs,
} from './webhooks/types';
import {
	FigmaFileCommentEventSchema,
	FigmaFileCommentPayloadSchema,
	FigmaFileDeleteEventSchema,
	FigmaFileDeletePayloadSchema,
	FigmaFileUpdateEventSchema,
	FigmaFileUpdatePayloadSchema,
	FigmaFileVersionUpdateEventSchema,
	FigmaFileVersionUpdatePayloadSchema,
	FigmaLibraryPublishEventSchema,
	FigmaLibraryPublishPayloadSchema,
	FigmaPingEventSchema,
	FigmaPingPayloadSchema,
} from './webhooks/types';

export type FigmaPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalFigmaPlugin['hooks'];
	webhookHooks?: InternalFigmaPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	/**
	 * Permission configuration for the Figma plugin.
	 * Controls what the AI agent is allowed to do.
	 * Overrides use dot-notation paths from the Figma endpoint tree — invalid paths are type errors.
	 */
	permissions?: PluginPermissionsConfig<typeof figmaEndpointsNested>;
};

export type FigmaContext = CorsairPluginContext<
	typeof FigmaSchema,
	FigmaPluginOptions
>;

export type FigmaKeyBuilderContext = KeyBuilderContext<FigmaPluginOptions>;

export type FigmaBoundEndpoints = BindEndpoints<typeof figmaEndpointsNested>;

type FigmaEndpoint<K extends keyof FigmaEndpointOutputs> = CorsairEndpoint<
	FigmaContext,
	FigmaEndpointInputs[K],
	FigmaEndpointOutputs[K]
>;

export type FigmaEndpoints = {
	commentsAdd: FigmaEndpoint<'commentsAdd'>;
	commentsDelete: FigmaEndpoint<'commentsDelete'>;
	commentsList: FigmaEndpoint<'commentsList'>;
	commentsGetReactions: FigmaEndpoint<'commentsGetReactions'>;
	commentsAddReaction: FigmaEndpoint<'commentsAddReaction'>;
	commentsDeleteReaction: FigmaEndpoint<'commentsDeleteReaction'>;
	webhooksCreate: FigmaEndpoint<'webhooksCreate'>;
	webhooksDelete: FigmaEndpoint<'webhooksDelete'>;
	webhooksGet: FigmaEndpoint<'webhooksGet'>;
	webhooksList: FigmaEndpoint<'webhooksList'>;
	webhooksGetRequests: FigmaEndpoint<'webhooksGetRequests'>;
	webhooksUpdate: FigmaEndpoint<'webhooksUpdate'>;
	devResourcesCreate: FigmaEndpoint<'devResourcesCreate'>;
	devResourcesDelete: FigmaEndpoint<'devResourcesDelete'>;
	devResourcesGet: FigmaEndpoint<'devResourcesGet'>;
	devResourcesUpdate: FigmaEndpoint<'devResourcesUpdate'>;
	variablesCreateModifyDelete: FigmaEndpoint<'variablesCreateModifyDelete'>;
	variablesGetLocal: FigmaEndpoint<'variablesGetLocal'>;
	variablesGetPublished: FigmaEndpoint<'variablesGetPublished'>;
	componentsGet: FigmaEndpoint<'componentsGet'>;
	componentSetsGet: FigmaEndpoint<'componentSetsGet'>;
	componentsGetForFile: FigmaEndpoint<'componentsGetForFile'>;
	componentSetsGetForFile: FigmaEndpoint<'componentSetsGetForFile'>;
	componentsGetForTeam: FigmaEndpoint<'componentsGetForTeam'>;
	componentSetsGetForTeam: FigmaEndpoint<'componentSetsGetForTeam'>;
	filesGetJSON: FigmaEndpoint<'filesGetJSON'>;
	filesGetMetadata: FigmaEndpoint<'filesGetMetadata'>;
	filesGetNodes: FigmaEndpoint<'filesGetNodes'>;
	filesGetStyles: FigmaEndpoint<'filesGetStyles'>;
	filesGetImageFills: FigmaEndpoint<'filesGetImageFills'>;
	filesGetVersions: FigmaEndpoint<'filesGetVersions'>;
	filesRenderImages: FigmaEndpoint<'filesRenderImages'>;
	filesGetProjectFiles: FigmaEndpoint<'filesGetProjectFiles'>;
	stylesGet: FigmaEndpoint<'stylesGet'>;
	stylesGetForTeam: FigmaEndpoint<'stylesGetForTeam'>;
	projectsGetTeamProjects: FigmaEndpoint<'projectsGetTeamProjects'>;
	usersGetCurrent: FigmaEndpoint<'usersGetCurrent'>;
	libraryAnalyticsComponentActions: FigmaEndpoint<'libraryAnalyticsComponentActions'>;
	libraryAnalyticsComponentUsages: FigmaEndpoint<'libraryAnalyticsComponentUsages'>;
	libraryAnalyticsStyleActions: FigmaEndpoint<'libraryAnalyticsStyleActions'>;
	libraryAnalyticsStyleUsages: FigmaEndpoint<'libraryAnalyticsStyleUsages'>;
	libraryAnalyticsVariableActions: FigmaEndpoint<'libraryAnalyticsVariableActions'>;
	libraryAnalyticsVariableUsages: FigmaEndpoint<'libraryAnalyticsVariableUsages'>;
	activityLogsList: FigmaEndpoint<'activityLogsList'>;
	paymentsGet: FigmaEndpoint<'paymentsGet'>;
	designToolsDiscoverResources: FigmaEndpoint<'designToolsDiscoverResources'>;
	designToolsExtractDesignTokens: FigmaEndpoint<'designToolsExtractDesignTokens'>;
	designToolsExtractPrototypeInteractions: FigmaEndpoint<'designToolsExtractPrototypeInteractions'>;
	designToolsDownloadImages: FigmaEndpoint<'designToolsDownloadImages'>;
	designToolsDesignTokensToTailwind: FigmaEndpoint<'designToolsDesignTokensToTailwind'>;
};

type FigmaWebhook<K extends keyof FigmaWebhookOutputs, TEvent> = CorsairWebhook<
	FigmaContext,
	TEvent,
	FigmaWebhookOutputs[K]
>;

export type FigmaWebhooks = {
	fileComment: FigmaWebhook<'fileComment', FigmaFileCommentEvent>;
	fileUpdate: FigmaWebhook<'fileUpdate', FigmaFileUpdateEvent>;
	fileDelete: FigmaWebhook<'fileDelete', FigmaFileDeleteEvent>;
	fileVersionUpdate: FigmaWebhook<
		'fileVersionUpdate',
		FigmaFileVersionUpdateEvent
	>;
	libraryPublish: FigmaWebhook<'libraryPublish', FigmaLibraryPublishEvent>;
	ping: FigmaWebhook<'ping', FigmaPingEvent>;
};

export type FigmaBoundWebhooks = BindWebhooks<FigmaWebhooks>;

const figmaEndpointsNested = {
	comments: {
		add: Comments.add,
		delete: Comments.delete,
		list: Comments.list,
		getReactions: Comments.getReactions,
		addReaction: Comments.addReaction,
		deleteReaction: Comments.deleteReaction,
	},
	webhooks: {
		create: Webhooks.create,
		delete: Webhooks.delete,
		get: Webhooks.get,
		list: Webhooks.list,
		getRequests: Webhooks.getRequests,
		update: Webhooks.update,
	},
	devResources: {
		create: DevResources.create,
		delete: DevResources.delete,
		get: DevResources.get,
		update: DevResources.update,
	},
	variables: {
		createModifyDelete: Variables.createModifyDelete,
		getLocal: Variables.getLocal,
		getPublished: Variables.getPublished,
	},
	components: {
		get: Components.get,
		getComponentSet: Components.getComponentSet,
		getForFile: Components.getForFile,
		getComponentSetsForFile: Components.getComponentSetsForFile,
		getForTeam: Components.getForTeam,
		getComponentSetsForTeam: Components.getComponentSetsForTeam,
	},
	files: {
		getJSON: Files.getJSON,
		getMetadata: Files.getMetadata,
		getNodes: Files.getNodes,
		getStyles: Files.getStyles,
		getImageFills: Files.getImageFills,
		getVersions: Files.getVersions,
		renderImages: Files.renderImages,
		getProjectFiles: Files.getProjectFiles,
	},
	styles: {
		get: Styles.get,
		getForTeam: Styles.getForTeam,
	},
	projects: {
		getTeamProjects: Projects.getTeamProjects,
	},
	users: {
		getCurrent: Users.getCurrent,
	},
	libraryAnalytics: {
		componentActions: LibraryAnalytics.componentActions,
		componentUsages: LibraryAnalytics.componentUsages,
		styleActions: LibraryAnalytics.styleActions,
		styleUsages: LibraryAnalytics.styleUsages,
		variableActions: LibraryAnalytics.variableActions,
		variableUsages: LibraryAnalytics.variableUsages,
	},
	activityLogs: {
		list: ActivityLogs.list,
	},
	payments: {
		get: Payments.get,
	},
	designTools: {
		discoverResources: DesignTools.discoverResources,
		extractDesignTokens: DesignTools.extractDesignTokens,
		extractPrototypeInteractions: DesignTools.extractPrototypeInteractions,
		downloadImages: DesignTools.downloadImages,
		designTokensToTailwind: DesignTools.designTokensToTailwind,
	},
} as const;

const figmaWebhooksNested = {
	files: {
		fileComment: FileCommentWebhooks.fileComment,
		fileUpdate: FileUpdateWebhooks.fileUpdate,
		fileDelete: FileDeleteWebhooks.fileDelete,
		fileVersionUpdate: FileVersionUpdateWebhooks.fileVersionUpdate,
	},
	library: {
		libraryPublish: LibraryPublishWebhooks.libraryPublish,
	},
	ping: {
		ping: PingWebhooks.ping,
	},
} as const;

export const figmaEndpointSchemas = {
	'comments.add': {
		input: FigmaEndpointInputSchemas.commentsAdd,
		output: FigmaEndpointOutputSchemas.commentsAdd,
	},
	'comments.delete': {
		input: FigmaEndpointInputSchemas.commentsDelete,
		output: FigmaEndpointOutputSchemas.commentsDelete,
	},
	'comments.list': {
		input: FigmaEndpointInputSchemas.commentsList,
		output: FigmaEndpointOutputSchemas.commentsList,
	},
	'comments.getReactions': {
		input: FigmaEndpointInputSchemas.commentsGetReactions,
		output: FigmaEndpointOutputSchemas.commentsGetReactions,
	},
	'comments.addReaction': {
		input: FigmaEndpointInputSchemas.commentsAddReaction,
		output: FigmaEndpointOutputSchemas.commentsAddReaction,
	},
	'comments.deleteReaction': {
		input: FigmaEndpointInputSchemas.commentsDeleteReaction,
		output: FigmaEndpointOutputSchemas.commentsDeleteReaction,
	},
	'webhooks.create': {
		input: FigmaEndpointInputSchemas.webhooksCreate,
		output: FigmaEndpointOutputSchemas.webhooksCreate,
	},
	'webhooks.delete': {
		input: FigmaEndpointInputSchemas.webhooksDelete,
		output: FigmaEndpointOutputSchemas.webhooksDelete,
	},
	'webhooks.get': {
		input: FigmaEndpointInputSchemas.webhooksGet,
		output: FigmaEndpointOutputSchemas.webhooksGet,
	},
	'webhooks.list': {
		input: FigmaEndpointInputSchemas.webhooksList,
		output: FigmaEndpointOutputSchemas.webhooksList,
	},
	'webhooks.getRequests': {
		input: FigmaEndpointInputSchemas.webhooksGetRequests,
		output: FigmaEndpointOutputSchemas.webhooksGetRequests,
	},
	'webhooks.update': {
		input: FigmaEndpointInputSchemas.webhooksUpdate,
		output: FigmaEndpointOutputSchemas.webhooksUpdate,
	},
	'devResources.create': {
		input: FigmaEndpointInputSchemas.devResourcesCreate,
		output: FigmaEndpointOutputSchemas.devResourcesCreate,
	},
	'devResources.delete': {
		input: FigmaEndpointInputSchemas.devResourcesDelete,
		output: FigmaEndpointOutputSchemas.devResourcesDelete,
	},
	'devResources.get': {
		input: FigmaEndpointInputSchemas.devResourcesGet,
		output: FigmaEndpointOutputSchemas.devResourcesGet,
	},
	'devResources.update': {
		input: FigmaEndpointInputSchemas.devResourcesUpdate,
		output: FigmaEndpointOutputSchemas.devResourcesUpdate,
	},
	'variables.createModifyDelete': {
		input: FigmaEndpointInputSchemas.variablesCreateModifyDelete,
		output: FigmaEndpointOutputSchemas.variablesCreateModifyDelete,
	},
	'variables.getLocal': {
		input: FigmaEndpointInputSchemas.variablesGetLocal,
		output: FigmaEndpointOutputSchemas.variablesGetLocal,
	},
	'variables.getPublished': {
		input: FigmaEndpointInputSchemas.variablesGetPublished,
		output: FigmaEndpointOutputSchemas.variablesGetPublished,
	},
	'components.get': {
		input: FigmaEndpointInputSchemas.componentsGet,
		output: FigmaEndpointOutputSchemas.componentsGet,
	},
	'components.getComponentSet': {
		input: FigmaEndpointInputSchemas.componentSetsGet,
		output: FigmaEndpointOutputSchemas.componentSetsGet,
	},
	'components.getForFile': {
		input: FigmaEndpointInputSchemas.componentsGetForFile,
		output: FigmaEndpointOutputSchemas.componentsGetForFile,
	},
	'components.getComponentSetsForFile': {
		input: FigmaEndpointInputSchemas.componentSetsGetForFile,
		output: FigmaEndpointOutputSchemas.componentSetsGetForFile,
	},
	'components.getForTeam': {
		input: FigmaEndpointInputSchemas.componentsGetForTeam,
		output: FigmaEndpointOutputSchemas.componentsGetForTeam,
	},
	'components.getComponentSetsForTeam': {
		input: FigmaEndpointInputSchemas.componentSetsGetForTeam,
		output: FigmaEndpointOutputSchemas.componentSetsGetForTeam,
	},
	'files.getJSON': {
		input: FigmaEndpointInputSchemas.filesGetJSON,
		output: FigmaEndpointOutputSchemas.filesGetJSON,
	},
	'files.getMetadata': {
		input: FigmaEndpointInputSchemas.filesGetMetadata,
		output: FigmaEndpointOutputSchemas.filesGetMetadata,
	},
	'files.getNodes': {
		input: FigmaEndpointInputSchemas.filesGetNodes,
		output: FigmaEndpointOutputSchemas.filesGetNodes,
	},
	'files.getStyles': {
		input: FigmaEndpointInputSchemas.filesGetStyles,
		output: FigmaEndpointOutputSchemas.filesGetStyles,
	},
	'files.getImageFills': {
		input: FigmaEndpointInputSchemas.filesGetImageFills,
		output: FigmaEndpointOutputSchemas.filesGetImageFills,
	},
	'files.getVersions': {
		input: FigmaEndpointInputSchemas.filesGetVersions,
		output: FigmaEndpointOutputSchemas.filesGetVersions,
	},
	'files.renderImages': {
		input: FigmaEndpointInputSchemas.filesRenderImages,
		output: FigmaEndpointOutputSchemas.filesRenderImages,
	},
	'files.getProjectFiles': {
		input: FigmaEndpointInputSchemas.filesGetProjectFiles,
		output: FigmaEndpointOutputSchemas.filesGetProjectFiles,
	},
	'styles.get': {
		input: FigmaEndpointInputSchemas.stylesGet,
		output: FigmaEndpointOutputSchemas.stylesGet,
	},
	'styles.getForTeam': {
		input: FigmaEndpointInputSchemas.stylesGetForTeam,
		output: FigmaEndpointOutputSchemas.stylesGetForTeam,
	},
	'projects.getTeamProjects': {
		input: FigmaEndpointInputSchemas.projectsGetTeamProjects,
		output: FigmaEndpointOutputSchemas.projectsGetTeamProjects,
	},
	'users.getCurrent': {
		input: FigmaEndpointInputSchemas.usersGetCurrent,
		output: FigmaEndpointOutputSchemas.usersGetCurrent,
	},
	'libraryAnalytics.componentActions': {
		input: FigmaEndpointInputSchemas.libraryAnalyticsComponentActions,
		output: FigmaEndpointOutputSchemas.libraryAnalyticsComponentActions,
	},
	'libraryAnalytics.componentUsages': {
		input: FigmaEndpointInputSchemas.libraryAnalyticsComponentUsages,
		output: FigmaEndpointOutputSchemas.libraryAnalyticsComponentUsages,
	},
	'libraryAnalytics.styleActions': {
		input: FigmaEndpointInputSchemas.libraryAnalyticsStyleActions,
		output: FigmaEndpointOutputSchemas.libraryAnalyticsStyleActions,
	},
	'libraryAnalytics.styleUsages': {
		input: FigmaEndpointInputSchemas.libraryAnalyticsStyleUsages,
		output: FigmaEndpointOutputSchemas.libraryAnalyticsStyleUsages,
	},
	'libraryAnalytics.variableActions': {
		input: FigmaEndpointInputSchemas.libraryAnalyticsVariableActions,
		output: FigmaEndpointOutputSchemas.libraryAnalyticsVariableActions,
	},
	'libraryAnalytics.variableUsages': {
		input: FigmaEndpointInputSchemas.libraryAnalyticsVariableUsages,
		output: FigmaEndpointOutputSchemas.libraryAnalyticsVariableUsages,
	},
	'activityLogs.list': {
		input: FigmaEndpointInputSchemas.activityLogsList,
		output: FigmaEndpointOutputSchemas.activityLogsList,
	},
	'payments.get': {
		input: FigmaEndpointInputSchemas.paymentsGet,
		output: FigmaEndpointOutputSchemas.paymentsGet,
	},
	'designTools.discoverResources': {
		input: FigmaEndpointInputSchemas.designToolsDiscoverResources,
		output: FigmaEndpointOutputSchemas.designToolsDiscoverResources,
	},
	'designTools.extractDesignTokens': {
		input: FigmaEndpointInputSchemas.designToolsExtractDesignTokens,
		output: FigmaEndpointOutputSchemas.designToolsExtractDesignTokens,
	},
	'designTools.extractPrototypeInteractions': {
		input: FigmaEndpointInputSchemas.designToolsExtractPrototypeInteractions,
		output: FigmaEndpointOutputSchemas.designToolsExtractPrototypeInteractions,
	},
	'designTools.downloadImages': {
		input: FigmaEndpointInputSchemas.designToolsDownloadImages,
		output: FigmaEndpointOutputSchemas.designToolsDownloadImages,
	},
	'designTools.designTokensToTailwind': {
		input: FigmaEndpointInputSchemas.designToolsDesignTokensToTailwind,
		output: FigmaEndpointOutputSchemas.designToolsDesignTokensToTailwind,
	},
} as const;

const defaultAuthType: AuthTypes = 'api_key' as const;

const figmaEndpointMeta = {
	'comments.add': {
		riskLevel: 'write',
		description: 'Add a comment to a Figma file',
	},
	'comments.delete': {
		riskLevel: 'destructive',
		description: 'Delete a comment from a Figma file [DESTRUCTIVE]',
	},
	'comments.list': {
		riskLevel: 'read',
		description: 'List comments on a Figma file',
	},
	'comments.getReactions': {
		riskLevel: 'read',
		description: 'Get reactions on a comment',
	},
	'comments.addReaction': {
		riskLevel: 'write',
		description: 'Add a reaction to a comment',
	},
	'comments.deleteReaction': {
		riskLevel: 'write',
		description: 'Delete a reaction from a comment',
	},
	'webhooks.create': {
		riskLevel: 'write',
		description: 'Create a Figma webhook',
	},
	'webhooks.delete': {
		riskLevel: 'destructive',
		description: 'Delete a Figma webhook [DESTRUCTIVE]',
	},
	'webhooks.get': {
		riskLevel: 'read',
		description: 'Get a Figma webhook by ID',
	},
	'webhooks.list': { riskLevel: 'read', description: 'List Figma webhooks' },
	'webhooks.getRequests': {
		riskLevel: 'read',
		description: 'Get webhook request history',
	},
	'webhooks.update': {
		riskLevel: 'write',
		description: 'Update a Figma webhook',
	},
	'devResources.create': {
		riskLevel: 'write',
		description: 'Create dev resources on a Figma file',
	},
	'devResources.delete': {
		riskLevel: 'destructive',
		description: 'Delete a dev resource from a Figma file [DESTRUCTIVE]',
	},
	'devResources.get': {
		riskLevel: 'read',
		description: 'Get dev resources for a Figma file',
	},
	'devResources.update': {
		riskLevel: 'write',
		description: 'Update dev resources on a Figma file',
	},
	'variables.createModifyDelete': {
		riskLevel: 'write',
		description: 'Create, modify, or delete variables in a Figma file',
	},
	'variables.getLocal': {
		riskLevel: 'read',
		description: 'Get local variables from a Figma file',
	},
	'variables.getPublished': {
		riskLevel: 'read',
		description: 'Get published variables from a Figma file',
	},
	'components.get': {
		riskLevel: 'read',
		description: 'Get a Figma component by key',
	},
	'components.getComponentSet': {
		riskLevel: 'read',
		description: 'Get a Figma component set by key',
	},
	'components.getForFile': {
		riskLevel: 'read',
		description: 'Get all components in a Figma file',
	},
	'components.getComponentSetsForFile': {
		riskLevel: 'read',
		description: 'Get all component sets in a Figma file',
	},
	'components.getForTeam': {
		riskLevel: 'read',
		description: 'Get all components for a Figma team',
	},
	'components.getComponentSetsForTeam': {
		riskLevel: 'read',
		description: 'Get all component sets for a Figma team',
	},
	'files.getJSON': {
		riskLevel: 'read',
		description: 'Get full Figma file JSON',
	},
	'files.getMetadata': {
		riskLevel: 'read',
		description: 'Get Figma file metadata',
	},
	'files.getNodes': {
		riskLevel: 'read',
		description: 'Get specific nodes from a Figma file',
	},
	'files.getStyles': {
		riskLevel: 'read',
		description: 'Get styles from a Figma file',
	},
	'files.getImageFills': {
		riskLevel: 'read',
		description: 'Get image fills from a Figma file',
	},
	'files.getVersions': {
		riskLevel: 'read',
		description: 'Get version history of a Figma file',
	},
	'files.renderImages': {
		riskLevel: 'read',
		description: 'Render Figma nodes as images',
	},
	'files.getProjectFiles': {
		riskLevel: 'read',
		description: 'Get all files in a Figma project',
	},
	'styles.get': { riskLevel: 'read', description: 'Get a Figma style by key' },
	'styles.getForTeam': {
		riskLevel: 'read',
		description: 'Get all styles for a Figma team',
	},
	'projects.getTeamProjects': {
		riskLevel: 'read',
		description: 'Get all projects for a Figma team',
	},
	'users.getCurrent': {
		riskLevel: 'read',
		description: 'Get the currently authenticated Figma user',
	},
	'libraryAnalytics.componentActions': {
		riskLevel: 'read',
		description: 'Get library component action analytics',
	},
	'libraryAnalytics.componentUsages': {
		riskLevel: 'read',
		description: 'Get library component usage analytics',
	},
	'libraryAnalytics.styleActions': {
		riskLevel: 'read',
		description: 'Get library style action analytics',
	},
	'libraryAnalytics.styleUsages': {
		riskLevel: 'read',
		description: 'Get library style usage analytics',
	},
	'libraryAnalytics.variableActions': {
		riskLevel: 'read',
		description: 'Get library variable action analytics',
	},
	'libraryAnalytics.variableUsages': {
		riskLevel: 'read',
		description: 'Get library variable usage analytics',
	},
	'activityLogs.list': {
		riskLevel: 'read',
		description: 'List Figma organization activity logs',
	},
	'payments.get': {
		riskLevel: 'read',
		description: 'Get payment information for a Figma plugin or widget',
	},
	'designTools.discoverResources': {
		riskLevel: 'read',
		description: 'Discover Figma files, projects, and teams',
	},
	'designTools.extractDesignTokens': {
		riskLevel: 'read',
		description:
			'Extract design tokens (variables and styles) from a Figma file',
	},
	'designTools.extractPrototypeInteractions': {
		riskLevel: 'read',
		description: 'Extract prototype interactions and flows from a Figma file',
	},
	'designTools.downloadImages': {
		riskLevel: 'read',
		description: 'Download rendered images for Figma nodes',
	},
	'designTools.designTokensToTailwind': {
		riskLevel: 'read',
		description: 'Convert Figma design tokens to a Tailwind CSS configuration',
	},
} satisfies RequiredPluginEndpointMeta<typeof figmaEndpointsNested>;

const figmaWebhookSchemas = {
	'files.fileComment': {
		description: 'A comment was posted on a Figma file',
		payload: FigmaFileCommentPayloadSchema,
		response: FigmaFileCommentEventSchema,
	},
	'files.fileUpdate': {
		description: 'A Figma file was updated',
		payload: FigmaFileUpdatePayloadSchema,
		response: FigmaFileUpdateEventSchema,
	},
	'files.fileDelete': {
		description: 'A Figma file was deleted',
		payload: FigmaFileDeletePayloadSchema,
		response: FigmaFileDeleteEventSchema,
	},
	'files.fileVersionUpdate': {
		description: 'A new version was created for a Figma file',
		payload: FigmaFileVersionUpdatePayloadSchema,
		response: FigmaFileVersionUpdateEventSchema,
	},
	'library.libraryPublish': {
		description: 'A Figma library was published',
		payload: FigmaLibraryPublishPayloadSchema,
		response: FigmaLibraryPublishEventSchema,
	},
	'ping.ping': {
		description: 'A ping event from Figma to verify the webhook endpoint',
		payload: FigmaPingPayloadSchema,
		response: FigmaPingEventSchema,
	},
} as const;

export const figmaAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseFigmaPlugin<T extends FigmaPluginOptions> = CorsairPlugin<
	'figma',
	typeof FigmaSchema,
	typeof figmaEndpointsNested,
	typeof figmaWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalFigmaPlugin = BaseFigmaPlugin<FigmaPluginOptions>;

export type ExternalFigmaPlugin<T extends FigmaPluginOptions> =
	BaseFigmaPlugin<T>;

export function figma<const T extends FigmaPluginOptions>(
	// type assertion: default to empty object cast to the options intersection type when no options are provided
	incomingOptions: FigmaPluginOptions & T = {} as FigmaPluginOptions & T,
): ExternalFigmaPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'figma',
		schema: FigmaSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: figmaEndpointsNested,
		webhooks: figmaWebhooksNested,
		endpointMeta: figmaEndpointMeta,
		endpointSchemas: figmaEndpointSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			const hasSignature = 'x-figma-signature' in headers;
			return hasSignature;
		},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: FigmaKeyBuilderContext, source) => {
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature();

				if (!res) {
					return '';
				}

				return res;
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();

				if (!res) {
					return '';
				}

				return res;
			}

			return '';
		},
	} satisfies InternalFigmaPlugin;
}

// ─────────────────────────────────────────────────────────────────────────────
// Webhook Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	FigmaFileCommentEvent,
	FigmaFileDeleteEvent,
	FigmaFileUpdateEvent,
	FigmaFileVersionUpdateEvent,
	FigmaLibraryPublishEvent,
	FigmaPingEvent,
	FigmaWebhookOutputs,
	FigmaWebhookPayload,
} from './webhooks/types';

export { createFigmaEventMatch } from './webhooks/types';

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	ActivityLogsListResponse,
	CommentsAddReactionResponse,
	CommentsAddResponse,
	CommentsDeleteReactionResponse,
	CommentsDeleteResponse,
	CommentsGetReactionsResponse,
	CommentsListResponse,
	ComponentSetsGetForFileResponse,
	ComponentSetsGetForTeamResponse,
	ComponentSetsGetResponse,
	ComponentsGetForFileResponse,
	ComponentsGetForTeamResponse,
	ComponentsGetResponse,
	DesignToolsDesignTokensToTailwindResponse,
	DesignToolsDiscoverResourcesResponse,
	DesignToolsDownloadImagesResponse,
	DesignToolsExtractDesignTokensResponse,
	DesignToolsExtractPrototypeInteractionsResponse,
	DevResourcesCreateResponse,
	DevResourcesDeleteResponse,
	DevResourcesGetResponse,
	DevResourcesUpdateResponse,
	FigmaEndpointInputs,
	FigmaEndpointOutputs,
	FilesGetImageFillsResponse,
	FilesGetJSONResponse,
	FilesGetMetadataResponse,
	FilesGetNodesResponse,
	FilesGetProjectFilesResponse,
	FilesGetStylesResponse,
	FilesGetVersionsResponse,
	FilesRenderImagesResponse,
	LibraryAnalyticsComponentActionsResponse,
	LibraryAnalyticsComponentUsagesResponse,
	LibraryAnalyticsStyleActionsResponse,
	LibraryAnalyticsStyleUsagesResponse,
	LibraryAnalyticsVariableActionsResponse,
	LibraryAnalyticsVariableUsagesResponse,
	PaymentsGetResponse,
	ProjectsGetTeamProjectsResponse,
	StylesGetForTeamResponse,
	StylesGetResponse,
	UsersGetCurrentResponse,
	VariablesCreateModifyDeleteResponse,
	VariablesGetLocalResponse,
	VariablesGetPublishedResponse,
	WebhooksCreateResponse,
	WebhooksDeleteResponse,
	WebhooksGetRequestsResponse,
	WebhooksGetResponse,
	WebhooksListResponse,
	WebhooksUpdateResponse,
} from './endpoints/types';
