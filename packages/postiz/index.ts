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
import { Insights, Integrations, Posts } from './endpoints';
import type {
	PostizEndpointInputs,
	PostizEndpointOutputs,
} from './endpoints/types';
import {
	PostizEndpointInputSchemas,
	PostizEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { PostizSchema } from './schema';

/**
 * `base_url` is the instance URL for a self-hosted Postiz, such as
 * `https://postiz.example.com`, or `https://api.postiz.com` for Postiz Cloud.
 * Empty also reaches Cloud, but core treats every account field as required,
 * so an empty `base_url` leaves the account status `partial`.
 */
export const postizAuthConfig = {
	api_key: {
		account: ['base_url'] as const,
	},
} as const satisfies PluginAuthConfig;

export type PostizPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** The API key from Developer settings. Overrides the stored `api_key`. */
	key?: string;
	/**
	 * A self-hosted instance's https URL, such as `https://postiz.example.com`.
	 * Overrides the account's stored `base_url`. Unset means Postiz Cloud.
	 */
	baseUrl?: string;
	hooks?: InternalPostizPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof postizEndpointsNested>;
};

export type PostizContext = CorsairPluginContext<
	typeof PostizSchema,
	PostizPluginOptions,
	undefined,
	typeof postizAuthConfig
>;

export type PostizKeyBuilderContext = KeyBuilderContext<
	PostizPluginOptions,
	typeof postizAuthConfig
>;

export type PostizBoundEndpoints = BindEndpoints<typeof postizEndpointsNested>;

type PostizEndpoint<K extends keyof PostizEndpointOutputs> = CorsairEndpoint<
	PostizContext,
	PostizEndpointInputs[K],
	PostizEndpointOutputs[K]
>;

export type PostizEndpoints = {
	integrationsList: PostizEndpoint<'integrationsList'>;
	isConnected: PostizEndpoint<'isConnected'>;
	findSlot: PostizEndpoint<'findSlot'>;
	postsList: PostizEndpoint<'postsList'>;
	postsCreate: PostizEndpoint<'postsCreate'>;
	postsDelete: PostizEndpoint<'postsDelete'>;
	postsChangeStatus: PostizEndpoint<'postsChangeStatus'>;
	mediaList: PostizEndpoint<'mediaList'>;
	mediaUploadFromUrl: PostizEndpoint<'mediaUploadFromUrl'>;
	notificationsList: PostizEndpoint<'notificationsList'>;
	analyticsPlatform: PostizEndpoint<'analyticsPlatform'>;
};

const postizEndpointsNested = {
	integrations: {
		list: Integrations.list,
		isConnected: Integrations.isConnected,
		findSlot: Integrations.findSlot,
	},
	posts: {
		list: Posts.list,
		create: Posts.create,
		delete: Posts.remove,
		changeStatus: Posts.changeStatus,
	},
	media: {
		list: Insights.list,
		uploadFromUrl: Insights.uploadFromUrl,
	},
	notifications: {
		list: Insights.notifications,
	},
	analytics: {
		platform: Insights.analytics,
	},
} as const;

export const postizEndpointSchemas = {
	'integrations.list': {
		input: PostizEndpointInputSchemas.integrationsList,
		output: PostizEndpointOutputSchemas.integrationsList,
	},
	'integrations.isConnected': {
		input: PostizEndpointInputSchemas.isConnected,
		output: PostizEndpointOutputSchemas.isConnected,
	},
	'integrations.findSlot': {
		input: PostizEndpointInputSchemas.findSlot,
		output: PostizEndpointOutputSchemas.findSlot,
	},
	'posts.list': {
		input: PostizEndpointInputSchemas.postsList,
		output: PostizEndpointOutputSchemas.postsList,
	},
	'posts.create': {
		input: PostizEndpointInputSchemas.postsCreate,
		output: PostizEndpointOutputSchemas.postsCreate,
	},
	'posts.delete': {
		input: PostizEndpointInputSchemas.postsDelete,
		output: PostizEndpointOutputSchemas.postsDelete,
	},
	'posts.changeStatus': {
		input: PostizEndpointInputSchemas.postsChangeStatus,
		output: PostizEndpointOutputSchemas.postsChangeStatus,
	},
	'media.list': {
		input: PostizEndpointInputSchemas.mediaList,
		output: PostizEndpointOutputSchemas.mediaList,
	},
	'media.uploadFromUrl': {
		input: PostizEndpointInputSchemas.mediaUploadFromUrl,
		output: PostizEndpointOutputSchemas.mediaUploadFromUrl,
	},
	'notifications.list': {
		input: PostizEndpointInputSchemas.notificationsList,
		output: PostizEndpointOutputSchemas.notificationsList,
	},
	'analytics.platform': {
		input: PostizEndpointInputSchemas.analyticsPlatform,
		output: PostizEndpointOutputSchemas.analyticsPlatform,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof postizEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const postizEndpointMeta = {
	'integrations.list': {
		riskLevel: 'read',
		description:
			'List the connected channels, optionally narrowed to one customer group',
	},
	'integrations.isConnected': {
		riskLevel: 'read',
		description: 'Confirm the API key is valid and the workspace is reachable',
	},
	'integrations.findSlot': {
		riskLevel: 'read',
		description: "Read a channel's next free posting slot",
	},
	'posts.list': {
		riskLevel: 'read',
		description:
			'List posts in a date window with their state, release URL and any platform error',
	},
	'posts.create': {
		riskLevel: 'destructive',
		description:
			'Create a post as a draft, scheduled, or published immediately. A schedule or an immediate post goes out to every listed channel and cannot be recalled by this plugin once published',
	},
	'posts.delete': {
		riskLevel: 'destructive',
		description:
			'Delete a post, which also deletes every post in its group. A published post stays live on the platform',
	},
	'posts.changeStatus': {
		riskLevel: 'destructive',
		description:
			'Move a post between draft and scheduled. Scheduling queues it to publish at its stored date to every channel it targets',
	},
	'media.list': {
		riskLevel: 'read',
		description:
			"Page through the organization's media library, optionally filtered by file name",
	},
	'media.uploadFromUrl': {
		riskLevel: 'write',
		description:
			'Copy a file from a public URL into the media library, for use as a post attachment',
	},
	'notifications.list': {
		riskLevel: 'read',
		description: 'Page through the organization notifications, newest first',
	},
	'analytics.platform': {
		riskLevel: 'read',
		description: "Read one channel's analytics rows for a period",
	},
} as const satisfies RequiredPluginEndpointMeta<typeof postizEndpointsNested>;

export type BasePostizPlugin<T extends PostizPluginOptions> = CorsairPlugin<
	'postiz',
	typeof PostizSchema,
	typeof postizEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType,
	typeof postizAuthConfig
>;

export type InternalPostizPlugin = BasePostizPlugin<PostizPluginOptions>;

export type ExternalPostizPlugin<T extends PostizPluginOptions> =
	BasePostizPlugin<T>;

export function postiz<const T extends PostizPluginOptions>(
	incomingOptions: PostizPluginOptions & T = {} as PostizPluginOptions & T,
): ExternalPostizPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'postiz',
		authConfig: postizAuthConfig,
		schema: PostizSchema,
		options,
		hooks: options.hooks,
		endpoints: postizEndpointsNested,
		webhooks: {},
		endpointMeta: postizEndpointMeta,
		endpointSchemas: postizEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: PostizKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('postiz', ctx.authType ?? 'api_key');
		},
	} satisfies InternalPostizPlugin;
}

export { PostizAPIError } from './client';
export type {
	AnalyticsPlatformInput,
	AnalyticsPlatformOutput,
	FindSlotInput,
	FindSlotOutput,
	IntegrationsListInput,
	IntegrationsListOutput,
	IsConnectedInput,
	IsConnectedOutput,
	MediaListInput,
	MediaListOutput,
	MediaUploadFromUrlInput,
	MediaUploadFromUrlOutput,
	NotificationsListInput,
	NotificationsListOutput,
	PostizEndpointInputs,
	PostizEndpointOutputs,
	PostizIntegration,
	PostizMedia,
	PostizMediaFile,
	PostizNotification,
	PostizPost,
	PostizPostContent,
	PostizPostCreated,
	PostizPostItem,
	PostizSettings,
	PostizTag,
	PostsChangeStatusInput,
	PostsChangeStatusOutput,
	PostsCreateInput,
	PostsCreateOutput,
	PostsDeleteInput,
	PostsDeleteOutput,
	PostsListInput,
	PostsListOutput,
} from './endpoints/types';
