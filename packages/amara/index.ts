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
import {
	ActivityEndpoints,
	LanguagesEndpoints,
	MessagesEndpoints,
	TeamsEndpoints,
	UsersEndpoints,
	VideosEndpoints,
} from './endpoints';
import type {
	AmaraEndpointInputs,
	AmaraEndpointOutputs,
} from './endpoints/types';
import {
	AmaraEndpointInputSchemas,
	AmaraEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { AmaraSchema } from './schema';

// ─────────────────────────────────────────────────────────────────────────────
// Plugin Options
// ─────────────────────────────────────────────────────────────────────────────

export type AmaraPluginOptions = {
	/** Authentication method. Amara only supports API keys. */
	authType?: PickAuth<'api_key'>;
	/**
	 * Amara API key, sent as the `X-api-key` header. When omitted the key is
	 * resolved from the account key manager instead.
	 */
	key?: string;
	/** Optional: lifecycle hooks for endpoints */
	hooks?: InternalAmaraPlugin['hooks'];
	/** Optional: custom error handlers (merged with defaults) */
	errorHandlers?: CorsairErrorHandler;
	/**
	 * Permission configuration for the Amara plugin.
	 */
	permissions?: PluginPermissionsConfig<typeof amaraEndpointsNested>;
};

// ─────────────────────────────────────────────────────────────────────────────
// Context & Type Helpers
// ─────────────────────────────────────────────────────────────────────────────

export type AmaraContext = CorsairPluginContext<
	typeof AmaraSchema,
	AmaraPluginOptions,
	undefined,
	typeof amaraAuthConfig
>;

export type AmaraKeyBuilderContext = KeyBuilderContext<
	AmaraPluginOptions,
	typeof amaraAuthConfig
>;

export type AmaraBoundEndpoints = BindEndpoints<typeof amaraEndpointsNested>;

type AmaraEndpoint<K extends keyof AmaraEndpointOutputs> = CorsairEndpoint<
	AmaraContext,
	AmaraEndpointInputs[K],
	AmaraEndpointOutputs[K]
>;

export type AmaraEndpoints = {
	videosList: AmaraEndpoint<'videosList'>;
	videosViewDetails: AmaraEndpoint<'videosViewDetails'>;
	videosCreate: AmaraEndpoint<'videosCreate'>;
	videosUpdate: AmaraEndpoint<'videosUpdate'>;
	videosListActivity: AmaraEndpoint<'videosListActivity'>;
	videosListUrls: AmaraEndpoint<'videosListUrls'>;
	videosAddUrl: AmaraEndpoint<'videosAddUrl'>;
	videosGetUrl: AmaraEndpoint<'videosGetUrl'>;
	videosDeleteUrl: AmaraEndpoint<'videosDeleteUrl'>;
	videosMakeUrlPrimary: AmaraEndpoint<'videosMakeUrlPrimary'>;
	videosGetUrlDetails: AmaraEndpoint<'videosGetUrlDetails'>;
	videosListSubtitleLanguages: AmaraEndpoint<'videosListSubtitleLanguages'>;
	videosGetSubtitleLanguageDetails: AmaraEndpoint<'videosGetSubtitleLanguageDetails'>;
	videosCreateSubtitleLanguage: AmaraEndpoint<'videosCreateSubtitleLanguage'>;
	videosUpdateSubtitleLanguage: AmaraEndpoint<'videosUpdateSubtitleLanguage'>;
	videosFetchSubtitlesData: AmaraEndpoint<'videosFetchSubtitlesData'>;
	videosCreateSubtitles: AmaraEndpoint<'videosCreateSubtitles'>;
	videosListSubtitleActions: AmaraEndpoint<'videosListSubtitleActions'>;
	videosPerformSubtitleAction: AmaraEndpoint<'videosPerformSubtitleAction'>;
	videosListSubtitleNotes: AmaraEndpoint<'videosListSubtitleNotes'>;
	videosAddSubtitleNote: AmaraEndpoint<'videosAddSubtitleNote'>;
	usersGetData: AmaraEndpoint<'usersGetData'>;
	usersGetActivity: AmaraEndpoint<'usersGetActivity'>;
	teamsList: AmaraEndpoint<'teamsList'>;
	teamsGetDetails: AmaraEndpoint<'teamsGetDetails'>;
	teamsGetLanguages: AmaraEndpoint<'teamsGetLanguages'>;
	teamsListProjects: AmaraEndpoint<'teamsListProjects'>;
	teamsGetProject: AmaraEndpoint<'teamsGetProject'>;
	teamsCreateProject: AmaraEndpoint<'teamsCreateProject'>;
	teamsUpdateProject: AmaraEndpoint<'teamsUpdateProject'>;
	teamsDeleteProject: AmaraEndpoint<'teamsDeleteProject'>;
	teamsListMembers: AmaraEndpoint<'teamsListMembers'>;
	teamsGetMember: AmaraEndpoint<'teamsGetMember'>;
	teamsAddMember: AmaraEndpoint<'teamsAddMember'>;
	teamsUpdateMember: AmaraEndpoint<'teamsUpdateMember'>;
	teamsRemoveMember: AmaraEndpoint<'teamsRemoveMember'>;
	teamsListTasks: AmaraEndpoint<'teamsListTasks'>;
	teamsGetTask: AmaraEndpoint<'teamsGetTask'>;
	teamsListApplications: AmaraEndpoint<'teamsListApplications'>;
	activityList: AmaraEndpoint<'activityList'>;
	activityGet: AmaraEndpoint<'activityGet'>;
	languagesListAvailable: AmaraEndpoint<'languagesListAvailable'>;
	messagesSend: AmaraEndpoint<'messagesSend'>;
};

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Tree
// ─────────────────────────────────────────────────────────────────────────────

const amaraEndpointsNested = {
	videos: {
		list: VideosEndpoints.list,
		viewDetails: VideosEndpoints.viewDetails,
		create: VideosEndpoints.create,
		update: VideosEndpoints.update,
		listActivity: VideosEndpoints.listActivity,
		listUrls: VideosEndpoints.listUrls,
		addUrl: VideosEndpoints.addUrl,
		getUrl: VideosEndpoints.getUrl,
		deleteUrl: VideosEndpoints.deleteUrl,
		makeUrlPrimary: VideosEndpoints.makeUrlPrimary,
		getUrlDetails: VideosEndpoints.getUrlDetails,
		listSubtitleLanguages: VideosEndpoints.listSubtitleLanguages,
		getSubtitleLanguageDetails: VideosEndpoints.getSubtitleLanguageDetails,
		createSubtitleLanguage: VideosEndpoints.createSubtitleLanguage,
		updateSubtitleLanguage: VideosEndpoints.updateSubtitleLanguage,
		fetchSubtitlesData: VideosEndpoints.fetchSubtitlesData,
		createSubtitles: VideosEndpoints.createSubtitles,
		listSubtitleActions: VideosEndpoints.listSubtitleActions,
		performSubtitleAction: VideosEndpoints.performSubtitleAction,
		listSubtitleNotes: VideosEndpoints.listSubtitleNotes,
		addSubtitleNote: VideosEndpoints.addSubtitleNote,
	},
	users: {
		getData: UsersEndpoints.getData,
		getActivity: UsersEndpoints.getActivity,
	},
	teams: {
		list: TeamsEndpoints.list,
		getDetails: TeamsEndpoints.getDetails,
		getLanguages: TeamsEndpoints.getLanguages,
		listProjects: TeamsEndpoints.listProjects,
		getProject: TeamsEndpoints.getProject,
		createProject: TeamsEndpoints.createProject,
		updateProject: TeamsEndpoints.updateProject,
		deleteProject: TeamsEndpoints.deleteProject,
		listMembers: TeamsEndpoints.listMembers,
		getMember: TeamsEndpoints.getMember,
		addMember: TeamsEndpoints.addMember,
		updateMember: TeamsEndpoints.updateMember,
		removeMember: TeamsEndpoints.removeMember,
		listTasks: TeamsEndpoints.listTasks,
		getTask: TeamsEndpoints.getTask,
		listApplications: TeamsEndpoints.listApplications,
	},
	activity: {
		list: ActivityEndpoints.list,
		get: ActivityEndpoints.get,
	},
	languages: {
		listAvailable: LanguagesEndpoints.listAvailable,
	},
	messages: {
		send: MessagesEndpoints.send,
	},
} as const;

// No webhooks — Amara is a pull-based REST API with no event delivery here.
const amaraWebhooksNested = {} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Schemas
// ─────────────────────────────────────────────────────────────────────────────

export const amaraEndpointSchemas = {
	'videos.list': {
		input: AmaraEndpointInputSchemas.videosList,
		output: AmaraEndpointOutputSchemas.videosList,
	},
	'videos.viewDetails': {
		input: AmaraEndpointInputSchemas.videosViewDetails,
		output: AmaraEndpointOutputSchemas.videosViewDetails,
	},
	'videos.create': {
		input: AmaraEndpointInputSchemas.videosCreate,
		output: AmaraEndpointOutputSchemas.videosCreate,
	},
	'videos.update': {
		input: AmaraEndpointInputSchemas.videosUpdate,
		output: AmaraEndpointOutputSchemas.videosUpdate,
	},
	'videos.listActivity': {
		input: AmaraEndpointInputSchemas.videosListActivity,
		output: AmaraEndpointOutputSchemas.videosListActivity,
	},
	'videos.listUrls': {
		input: AmaraEndpointInputSchemas.videosListUrls,
		output: AmaraEndpointOutputSchemas.videosListUrls,
	},
	'videos.addUrl': {
		input: AmaraEndpointInputSchemas.videosAddUrl,
		output: AmaraEndpointOutputSchemas.videosAddUrl,
	},
	'videos.getUrl': {
		input: AmaraEndpointInputSchemas.videosGetUrl,
		output: AmaraEndpointOutputSchemas.videosGetUrl,
	},
	'videos.deleteUrl': {
		input: AmaraEndpointInputSchemas.videosDeleteUrl,
		output: AmaraEndpointOutputSchemas.videosDeleteUrl,
	},
	'videos.makeUrlPrimary': {
		input: AmaraEndpointInputSchemas.videosMakeUrlPrimary,
		output: AmaraEndpointOutputSchemas.videosMakeUrlPrimary,
	},
	'videos.getUrlDetails': {
		input: AmaraEndpointInputSchemas.videosGetUrlDetails,
		output: AmaraEndpointOutputSchemas.videosGetUrlDetails,
	},
	'videos.listSubtitleLanguages': {
		input: AmaraEndpointInputSchemas.videosListSubtitleLanguages,
		output: AmaraEndpointOutputSchemas.videosListSubtitleLanguages,
	},
	'videos.getSubtitleLanguageDetails': {
		input: AmaraEndpointInputSchemas.videosGetSubtitleLanguageDetails,
		output: AmaraEndpointOutputSchemas.videosGetSubtitleLanguageDetails,
	},
	'videos.createSubtitleLanguage': {
		input: AmaraEndpointInputSchemas.videosCreateSubtitleLanguage,
		output: AmaraEndpointOutputSchemas.videosCreateSubtitleLanguage,
	},
	'videos.updateSubtitleLanguage': {
		input: AmaraEndpointInputSchemas.videosUpdateSubtitleLanguage,
		output: AmaraEndpointOutputSchemas.videosUpdateSubtitleLanguage,
	},
	'videos.fetchSubtitlesData': {
		input: AmaraEndpointInputSchemas.videosFetchSubtitlesData,
		output: AmaraEndpointOutputSchemas.videosFetchSubtitlesData,
	},
	'videos.createSubtitles': {
		input: AmaraEndpointInputSchemas.videosCreateSubtitles,
		output: AmaraEndpointOutputSchemas.videosCreateSubtitles,
	},
	'videos.listSubtitleActions': {
		input: AmaraEndpointInputSchemas.videosListSubtitleActions,
		output: AmaraEndpointOutputSchemas.videosListSubtitleActions,
	},
	'videos.performSubtitleAction': {
		input: AmaraEndpointInputSchemas.videosPerformSubtitleAction,
		output: AmaraEndpointOutputSchemas.videosPerformSubtitleAction,
	},
	'videos.listSubtitleNotes': {
		input: AmaraEndpointInputSchemas.videosListSubtitleNotes,
		output: AmaraEndpointOutputSchemas.videosListSubtitleNotes,
	},
	'videos.addSubtitleNote': {
		input: AmaraEndpointInputSchemas.videosAddSubtitleNote,
		output: AmaraEndpointOutputSchemas.videosAddSubtitleNote,
	},
	'users.getData': {
		input: AmaraEndpointInputSchemas.usersGetData,
		output: AmaraEndpointOutputSchemas.usersGetData,
	},
	'users.getActivity': {
		input: AmaraEndpointInputSchemas.usersGetActivity,
		output: AmaraEndpointOutputSchemas.usersGetActivity,
	},
	'teams.list': {
		input: AmaraEndpointInputSchemas.teamsList,
		output: AmaraEndpointOutputSchemas.teamsList,
	},
	'teams.getDetails': {
		input: AmaraEndpointInputSchemas.teamsGetDetails,
		output: AmaraEndpointOutputSchemas.teamsGetDetails,
	},
	'teams.getLanguages': {
		input: AmaraEndpointInputSchemas.teamsGetLanguages,
		output: AmaraEndpointOutputSchemas.teamsGetLanguages,
	},
	'teams.listProjects': {
		input: AmaraEndpointInputSchemas.teamsListProjects,
		output: AmaraEndpointOutputSchemas.teamsListProjects,
	},
	'teams.getProject': {
		input: AmaraEndpointInputSchemas.teamsGetProject,
		output: AmaraEndpointOutputSchemas.teamsGetProject,
	},
	'teams.createProject': {
		input: AmaraEndpointInputSchemas.teamsCreateProject,
		output: AmaraEndpointOutputSchemas.teamsCreateProject,
	},
	'teams.updateProject': {
		input: AmaraEndpointInputSchemas.teamsUpdateProject,
		output: AmaraEndpointOutputSchemas.teamsUpdateProject,
	},
	'teams.deleteProject': {
		input: AmaraEndpointInputSchemas.teamsDeleteProject,
		output: AmaraEndpointOutputSchemas.teamsDeleteProject,
	},
	'teams.listMembers': {
		input: AmaraEndpointInputSchemas.teamsListMembers,
		output: AmaraEndpointOutputSchemas.teamsListMembers,
	},
	'teams.getMember': {
		input: AmaraEndpointInputSchemas.teamsGetMember,
		output: AmaraEndpointOutputSchemas.teamsGetMember,
	},
	'teams.addMember': {
		input: AmaraEndpointInputSchemas.teamsAddMember,
		output: AmaraEndpointOutputSchemas.teamsAddMember,
	},
	'teams.updateMember': {
		input: AmaraEndpointInputSchemas.teamsUpdateMember,
		output: AmaraEndpointOutputSchemas.teamsUpdateMember,
	},
	'teams.removeMember': {
		input: AmaraEndpointInputSchemas.teamsRemoveMember,
		output: AmaraEndpointOutputSchemas.teamsRemoveMember,
	},
	'teams.listTasks': {
		input: AmaraEndpointInputSchemas.teamsListTasks,
		output: AmaraEndpointOutputSchemas.teamsListTasks,
	},
	'teams.getTask': {
		input: AmaraEndpointInputSchemas.teamsGetTask,
		output: AmaraEndpointOutputSchemas.teamsGetTask,
	},
	'teams.listApplications': {
		input: AmaraEndpointInputSchemas.teamsListApplications,
		output: AmaraEndpointOutputSchemas.teamsListApplications,
	},
	'activity.list': {
		input: AmaraEndpointInputSchemas.activityList,
		output: AmaraEndpointOutputSchemas.activityList,
	},
	'activity.get': {
		input: AmaraEndpointInputSchemas.activityGet,
		output: AmaraEndpointOutputSchemas.activityGet,
	},
	'languages.listAvailable': {
		input: AmaraEndpointInputSchemas.languagesListAvailable,
		output: AmaraEndpointOutputSchemas.languagesListAvailable,
	},
	'messages.send': {
		input: AmaraEndpointInputSchemas.messagesSend,
		output: AmaraEndpointOutputSchemas.messagesSend,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof amaraEndpointsNested>;

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Meta
// ─────────────────────────────────────────────────────────────────────────────

const amaraEndpointMeta = {
	'videos.list': {
		riskLevel: 'read',
		description: 'List videos with optional filters and pagination',
	},
	'videos.viewDetails': {
		riskLevel: 'read',
		description: 'Get details for a single video by id',
	},
	'videos.create': {
		riskLevel: 'write',
		description: 'Create a video from a public URL',
	},
	'videos.update': {
		riskLevel: 'write',
		description: 'Update video metadata',
	},
	'videos.listActivity': {
		riskLevel: 'read',
		description: 'List activity for a video',
	},
	'videos.listUrls': {
		riskLevel: 'read',
		description: 'List URLs associated with a video',
	},
	'videos.addUrl': {
		riskLevel: 'write',
		description: 'Add a URL to a video',
	},
	'videos.getUrl': {
		riskLevel: 'read',
		description: 'Get a single video URL by id',
	},
	'videos.deleteUrl': {
		riskLevel: 'write',
		description: 'Delete a video URL',
	},
	'videos.makeUrlPrimary': {
		riskLevel: 'write',
		description: 'Set a video URL as primary',
	},
	'videos.getUrlDetails': {
		riskLevel: 'read',
		description: 'Look up a video by its public URL',
	},
	'videos.listSubtitleLanguages': {
		riskLevel: 'read',
		description: 'List subtitle languages for a video',
	},
	'videos.getSubtitleLanguageDetails': {
		riskLevel: 'read',
		description: 'Get details for a subtitle language',
	},
	'videos.createSubtitleLanguage': {
		riskLevel: 'write',
		description: 'Create a subtitle language on a video',
	},
	'videos.updateSubtitleLanguage': {
		riskLevel: 'write',
		description: 'Update subtitle language settings',
	},
	'videos.fetchSubtitlesData': {
		riskLevel: 'read',
		description: 'Fetch subtitles for a video language',
	},
	'videos.createSubtitles': {
		riskLevel: 'write',
		description: 'Create or update subtitles for a language',
	},
	'videos.listSubtitleActions': {
		riskLevel: 'read',
		description: 'List available subtitle actions',
	},
	'videos.performSubtitleAction': {
		riskLevel: 'write',
		description: 'Perform a subtitle action (publish, save-draft, …)',
	},
	'videos.listSubtitleNotes': {
		riskLevel: 'read',
		description: 'List editor notes on a subtitle set',
	},
	'videos.addSubtitleNote': {
		riskLevel: 'write',
		description: 'Add an editor note to a subtitle set',
	},
	'users.getData': {
		riskLevel: 'read',
		description: 'Get a user profile by identifier (or "me")',
	},
	'users.getActivity': {
		riskLevel: 'read',
		description: 'List activity for a user',
	},
	'teams.list': {
		riskLevel: 'read',
		description: 'List teams',
	},
	'teams.getDetails': {
		riskLevel: 'read',
		description: 'Get team details by slug',
	},
	'teams.getLanguages': {
		riskLevel: 'read',
		description: 'Get preferred/blacklisted language URIs for a team',
	},
	'teams.listProjects': {
		riskLevel: 'read',
		description: 'List projects within a team',
	},
	'teams.getProject': {
		riskLevel: 'read',
		description: 'Get details for a specific team project',
	},
	'teams.createProject': {
		riskLevel: 'write',
		description: 'Create a new project in a team',
	},
	'teams.updateProject': {
		riskLevel: 'write',
		description: 'Update a team project',
	},
	'teams.deleteProject': {
		riskLevel: 'write',
		description: 'Delete a project from a team',
	},
	'teams.listMembers': {
		riskLevel: 'read',
		description: 'List members of a team',
	},
	'teams.getMember': {
		riskLevel: 'read',
		description: 'Get details for a specific team member',
	},
	'teams.addMember': {
		riskLevel: 'write',
		description: 'Add a new member to a team',
	},
	'teams.updateMember': {
		riskLevel: 'write',
		description: 'Update member role in a team',
	},
	'teams.removeMember': {
		riskLevel: 'write',
		description: 'Remove a member from a team',
	},
	'teams.listTasks': {
		riskLevel: 'read',
		description: 'List tasks within a team with optional filters',
	},
	'teams.getTask': {
		riskLevel: 'read',
		description: 'Get details for a specific team task',
	},
	'teams.listApplications': {
		riskLevel: 'read',
		description: 'List membership applications for a team',
	},
	'activity.list': {
		riskLevel: 'read',
		description: 'List platform activity with optional filters',
	},
	'activity.get': {
		riskLevel: 'read',
		description: 'Get a single activity item by id',
	},
	'languages.listAvailable': {
		riskLevel: 'read',
		description: 'List all supported Amara language codes',
	},
	'messages.send': {
		riskLevel: 'write',
		description: 'Send a message to a user or team',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof amaraEndpointsNested>;

// ─────────────────────────────────────────────────────────────────────────────
// Auth Configuration
// ─────────────────────────────────────────────────────────────────────────────

const defaultAuthType: AuthTypes = 'api_key' as const;

export const amaraAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

// ─────────────────────────────────────────────────────────────────────────────
// Plugin Types
// ─────────────────────────────────────────────────────────────────────────────

export type BaseAmaraPlugin<T extends AmaraPluginOptions> = CorsairPlugin<
	'amara',
	typeof AmaraSchema,
	typeof amaraEndpointsNested,
	typeof amaraWebhooksNested,
	T,
	typeof defaultAuthType,
	typeof amaraAuthConfig
>;

export type InternalAmaraPlugin = BaseAmaraPlugin<AmaraPluginOptions>;

export type ExternalAmaraPlugin<T extends AmaraPluginOptions> =
	BaseAmaraPlugin<T>;

// ─────────────────────────────────────────────────────────────────────────────
// Plugin Factory
// ─────────────────────────────────────────────────────────────────────────────

export function amara<const T extends AmaraPluginOptions>(
	incomingOptions: AmaraPluginOptions & T = {} as AmaraPluginOptions & T,
): ExternalAmaraPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'amara',
		authConfig: amaraAuthConfig,
		schema: AmaraSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: amaraEndpointsNested,
		webhooks: amaraWebhooksNested,
		endpointMeta: amaraEndpointMeta,
		endpointSchemas: amaraEndpointSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: AmaraKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint') {
				const res = await ctx.keys?.get_api_key();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalAmaraPlugin;
}

export { AMARA_API_BASE, AmaraAPIError } from './client';
export type {
	Activity,
	ActivityListResponse,
	AmaraEndpointInputs,
	AmaraEndpointOutputs,
	LanguagesListResponse,
	MessageSendResponse,
	SubtitleLanguage,
	SubtitlesResource,
	Team,
	TeamLanguages,
	TeamListResponse,
	User,
	Video,
	VideoListResponse,
	VideoUrl,
} from './endpoints/types';
export {
	AmaraEndpointInputSchemas,
	AmaraEndpointOutputSchemas,
} from './endpoints/types';
