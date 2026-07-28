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
	CommentsEndpoints,
	ConversationsEndpoints,
	MessagesEndpoints,
	PagesEndpoints,
	PhotosEndpoints,
	PostsEndpoints,
	ReactionsEndpoints,
	UsersEndpoints,
	VideosEndpoints,
} from './endpoints';
import type {
	FacebookEndpointInputs,
	FacebookEndpointOutputs,
} from './endpoints/types';
import {
	FacebookEndpointInputSchemas,
	FacebookEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { FacebookSchema } from './schema';

export type FacebookPluginOptions = {
	authType?: PickAuth<'oauth_2'>;
	key?: string;
	hooks?: InternalFacebookPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof facebookEndpointsNested>;
};

export type FacebookContext = CorsairPluginContext<
	typeof FacebookSchema,
	FacebookPluginOptions,
	undefined,
	typeof facebookAuthConfig
>;

export type FacebookKeyBuilderContext = KeyBuilderContext<
	FacebookPluginOptions,
	typeof facebookAuthConfig
>;

export type FacebookBoundEndpoints = BindEndpoints<
	typeof facebookEndpointsNested
>;

type FacebookEndpoint<K extends keyof FacebookEndpointOutputs> =
	CorsairEndpoint<
		FacebookContext,
		FacebookEndpointInputs[K],
		FacebookEndpointOutputs[K]
	>;

export type FacebookEndpoints = {
	getCurrentUser: FacebookEndpoint<'getCurrentUser'>;
	getUserPages: FacebookEndpoint<'getUserPages'>;
	listManagedPages: FacebookEndpoint<'listManagedPages'>;
	getPageDetails: FacebookEndpoint<'getPageDetails'>;
	searchPages: FacebookEndpoint<'searchPages'>;
	updatePageSettings: FacebookEndpoint<'updatePageSettings'>;
	getPageInsights: FacebookEndpoint<'getPageInsights'>;
	getPageRoles: FacebookEndpoint<'getPageRoles'>;
	assignPageTask: FacebookEndpoint<'assignPageTask'>;
	removePageTask: FacebookEndpoint<'removePageTask'>;
	createPost: FacebookEndpoint<'createPost'>;
	getPost: FacebookEndpoint<'getPost'>;
	getPagePosts: FacebookEndpoint<'getPagePosts'>;
	getScheduledPosts: FacebookEndpoint<'getScheduledPosts'>;
	updatePost: FacebookEndpoint<'updatePost'>;
	deletePost: FacebookEndpoint<'deletePost'>;
	reschedulePost: FacebookEndpoint<'reschedulePost'>;
	publishScheduledPost: FacebookEndpoint<'publishScheduledPost'>;
	getPageTaggedPosts: FacebookEndpoint<'getPageTaggedPosts'>;
	getPostInsights: FacebookEndpoint<'getPostInsights'>;
	getPostReactions: FacebookEndpoint<'getPostReactions'>;
	createComment: FacebookEndpoint<'createComment'>;
	getComment: FacebookEndpoint<'getComment'>;
	getComments: FacebookEndpoint<'getComments'>;
	updateComment: FacebookEndpoint<'updateComment'>;
	deleteComment: FacebookEndpoint<'deleteComment'>;
	addReaction: FacebookEndpoint<'addReaction'>;
	unlikePostOrComment: FacebookEndpoint<'unlikePostOrComment'>;
	uploadPhoto: FacebookEndpoint<'uploadPhoto'>;
	uploadPhotosBatch: FacebookEndpoint<'uploadPhotosBatch'>;
	createPhotoPost: FacebookEndpoint<'createPhotoPost'>;
	addPhotosToAlbum: FacebookEndpoint<'addPhotosToAlbum'>;
	createPhotoAlbum: FacebookEndpoint<'createPhotoAlbum'>;
	getPagePhotos: FacebookEndpoint<'getPagePhotos'>;
	createVideoPost: FacebookEndpoint<'createVideoPost'>;
	getPageVideos: FacebookEndpoint<'getPageVideos'>;
	uploadVideo: FacebookEndpoint<'uploadVideo'>;
	getPageConversations: FacebookEndpoint<'getPageConversations'>;
	getConversationMessages: FacebookEndpoint<'getConversationMessages'>;
	getMessageDetails: FacebookEndpoint<'getMessageDetails'>;
	sendMessage: FacebookEndpoint<'sendMessage'>;
	sendMediaMessage: FacebookEndpoint<'sendMediaMessage'>;
	markMessageSeen: FacebookEndpoint<'markMessageSeen'>;
	toggleTypingIndicator: FacebookEndpoint<'toggleTypingIndicator'>;
};

const facebookEndpointsNested = {
	users: {
		getCurrentUser: UsersEndpoints.getCurrentUser,
		getUserPages: UsersEndpoints.getUserPages,
	},
	pages: {
		listManaged: UsersEndpoints.listManagedPages,
		getDetails: PagesEndpoints.getDetails,
		search: PagesEndpoints.search,
		updateSettings: PagesEndpoints.updateSettings,
		getInsights: PagesEndpoints.getInsights,
		getRoles: PagesEndpoints.getRoles,
		assignTask: PagesEndpoints.assignTask,
		removeTask: PagesEndpoints.removeTask,
	},
	posts: {
		create: PostsEndpoints.create,
		get: PostsEndpoints.get,
		list: PostsEndpoints.list,
		listScheduled: PostsEndpoints.listScheduled,
		update: PostsEndpoints.update,
		delete: PostsEndpoints.remove,
		reschedule: PostsEndpoints.reschedule,
		publishScheduled: PostsEndpoints.publishScheduled,
		listTagged: PostsEndpoints.listTagged,
		getInsights: PostsEndpoints.getInsights,
		getReactions: PostsEndpoints.getReactions,
	},
	comments: {
		create: CommentsEndpoints.create,
		get: CommentsEndpoints.get,
		list: CommentsEndpoints.list,
		update: CommentsEndpoints.update,
		delete: CommentsEndpoints.remove,
	},
	reactions: {
		add: ReactionsEndpoints.add,
		unlike: ReactionsEndpoints.unlike,
	},
	photos: {
		upload: PhotosEndpoints.upload,
		uploadBatch: PhotosEndpoints.uploadBatch,
		createPost: PhotosEndpoints.createPost,
		addToAlbum: PhotosEndpoints.addToAlbum,
		createAlbum: PhotosEndpoints.createAlbum,
		list: PhotosEndpoints.list,
	},
	videos: {
		createPost: VideosEndpoints.createPost,
		list: VideosEndpoints.list,
		upload: VideosEndpoints.upload,
	},
	conversations: {
		list: ConversationsEndpoints.list,
		getMessages: ConversationsEndpoints.getMessages,
	},
	messages: {
		getDetails: MessagesEndpoints.getDetails,
		send: MessagesEndpoints.send,
		sendMedia: MessagesEndpoints.sendMedia,
		markSeen: MessagesEndpoints.markSeen,
		toggleTyping: MessagesEndpoints.toggleTyping,
	},
} as const;

export const facebookEndpointSchemas = {
	'users.getCurrentUser': {
		input: FacebookEndpointInputSchemas.getCurrentUser,
		output: FacebookEndpointOutputSchemas.getCurrentUser,
	},
	'users.getUserPages': {
		input: FacebookEndpointInputSchemas.getUserPages,
		output: FacebookEndpointOutputSchemas.getUserPages,
	},
	'pages.listManaged': {
		input: FacebookEndpointInputSchemas.listManagedPages,
		output: FacebookEndpointOutputSchemas.listManagedPages,
	},
	'pages.getDetails': {
		input: FacebookEndpointInputSchemas.getPageDetails,
		output: FacebookEndpointOutputSchemas.getPageDetails,
	},
	'pages.search': {
		input: FacebookEndpointInputSchemas.searchPages,
		output: FacebookEndpointOutputSchemas.searchPages,
	},
	'pages.updateSettings': {
		input: FacebookEndpointInputSchemas.updatePageSettings,
		output: FacebookEndpointOutputSchemas.updatePageSettings,
	},
	'pages.getInsights': {
		input: FacebookEndpointInputSchemas.getPageInsights,
		output: FacebookEndpointOutputSchemas.getPageInsights,
	},
	'pages.getRoles': {
		input: FacebookEndpointInputSchemas.getPageRoles,
		output: FacebookEndpointOutputSchemas.getPageRoles,
	},
	'pages.assignTask': {
		input: FacebookEndpointInputSchemas.assignPageTask,
		output: FacebookEndpointOutputSchemas.assignPageTask,
	},
	'pages.removeTask': {
		input: FacebookEndpointInputSchemas.removePageTask,
		output: FacebookEndpointOutputSchemas.removePageTask,
	},
	'posts.create': {
		input: FacebookEndpointInputSchemas.createPost,
		output: FacebookEndpointOutputSchemas.createPost,
	},
	'posts.get': {
		input: FacebookEndpointInputSchemas.getPost,
		output: FacebookEndpointOutputSchemas.getPost,
	},
	'posts.list': {
		input: FacebookEndpointInputSchemas.getPagePosts,
		output: FacebookEndpointOutputSchemas.getPagePosts,
	},
	'posts.listScheduled': {
		input: FacebookEndpointInputSchemas.getScheduledPosts,
		output: FacebookEndpointOutputSchemas.getScheduledPosts,
	},
	'posts.update': {
		input: FacebookEndpointInputSchemas.updatePost,
		output: FacebookEndpointOutputSchemas.updatePost,
	},
	'posts.delete': {
		input: FacebookEndpointInputSchemas.deletePost,
		output: FacebookEndpointOutputSchemas.deletePost,
	},
	'posts.reschedule': {
		input: FacebookEndpointInputSchemas.reschedulePost,
		output: FacebookEndpointOutputSchemas.reschedulePost,
	},
	'posts.publishScheduled': {
		input: FacebookEndpointInputSchemas.publishScheduledPost,
		output: FacebookEndpointOutputSchemas.publishScheduledPost,
	},
	'posts.listTagged': {
		input: FacebookEndpointInputSchemas.getPageTaggedPosts,
		output: FacebookEndpointOutputSchemas.getPageTaggedPosts,
	},
	'posts.getInsights': {
		input: FacebookEndpointInputSchemas.getPostInsights,
		output: FacebookEndpointOutputSchemas.getPostInsights,
	},
	'posts.getReactions': {
		input: FacebookEndpointInputSchemas.getPostReactions,
		output: FacebookEndpointOutputSchemas.getPostReactions,
	},
	'comments.create': {
		input: FacebookEndpointInputSchemas.createComment,
		output: FacebookEndpointOutputSchemas.createComment,
	},
	'comments.get': {
		input: FacebookEndpointInputSchemas.getComment,
		output: FacebookEndpointOutputSchemas.getComment,
	},
	'comments.list': {
		input: FacebookEndpointInputSchemas.getComments,
		output: FacebookEndpointOutputSchemas.getComments,
	},
	'comments.update': {
		input: FacebookEndpointInputSchemas.updateComment,
		output: FacebookEndpointOutputSchemas.updateComment,
	},
	'comments.delete': {
		input: FacebookEndpointInputSchemas.deleteComment,
		output: FacebookEndpointOutputSchemas.deleteComment,
	},
	'reactions.add': {
		input: FacebookEndpointInputSchemas.addReaction,
		output: FacebookEndpointOutputSchemas.addReaction,
	},
	'reactions.unlike': {
		input: FacebookEndpointInputSchemas.unlikePostOrComment,
		output: FacebookEndpointOutputSchemas.unlikePostOrComment,
	},
	'photos.upload': {
		input: FacebookEndpointInputSchemas.uploadPhoto,
		output: FacebookEndpointOutputSchemas.uploadPhoto,
	},
	'photos.uploadBatch': {
		input: FacebookEndpointInputSchemas.uploadPhotosBatch,
		output: FacebookEndpointOutputSchemas.uploadPhotosBatch,
	},
	'photos.createPost': {
		input: FacebookEndpointInputSchemas.createPhotoPost,
		output: FacebookEndpointOutputSchemas.createPhotoPost,
	},
	'photos.addToAlbum': {
		input: FacebookEndpointInputSchemas.addPhotosToAlbum,
		output: FacebookEndpointOutputSchemas.addPhotosToAlbum,
	},
	'photos.createAlbum': {
		input: FacebookEndpointInputSchemas.createPhotoAlbum,
		output: FacebookEndpointOutputSchemas.createPhotoAlbum,
	},
	'photos.list': {
		input: FacebookEndpointInputSchemas.getPagePhotos,
		output: FacebookEndpointOutputSchemas.getPagePhotos,
	},
	'videos.createPost': {
		input: FacebookEndpointInputSchemas.createVideoPost,
		output: FacebookEndpointOutputSchemas.createVideoPost,
	},
	'videos.list': {
		input: FacebookEndpointInputSchemas.getPageVideos,
		output: FacebookEndpointOutputSchemas.getPageVideos,
	},
	'videos.upload': {
		input: FacebookEndpointInputSchemas.uploadVideo,
		output: FacebookEndpointOutputSchemas.uploadVideo,
	},
	'conversations.list': {
		input: FacebookEndpointInputSchemas.getPageConversations,
		output: FacebookEndpointOutputSchemas.getPageConversations,
	},
	'conversations.getMessages': {
		input: FacebookEndpointInputSchemas.getConversationMessages,
		output: FacebookEndpointOutputSchemas.getConversationMessages,
	},
	'messages.getDetails': {
		input: FacebookEndpointInputSchemas.getMessageDetails,
		output: FacebookEndpointOutputSchemas.getMessageDetails,
	},
	'messages.send': {
		input: FacebookEndpointInputSchemas.sendMessage,
		output: FacebookEndpointOutputSchemas.sendMessage,
	},
	'messages.sendMedia': {
		input: FacebookEndpointInputSchemas.sendMediaMessage,
		output: FacebookEndpointOutputSchemas.sendMediaMessage,
	},
	'messages.markSeen': {
		input: FacebookEndpointInputSchemas.markMessageSeen,
		output: FacebookEndpointOutputSchemas.markMessageSeen,
	},
	'messages.toggleTyping': {
		input: FacebookEndpointInputSchemas.toggleTypingIndicator,
		output: FacebookEndpointOutputSchemas.toggleTypingIndicator,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof facebookEndpointsNested
>;

const defaultAuthType: AuthTypes = 'oauth_2' as const;

const facebookEndpointMeta = {
	'users.getCurrentUser': {
		riskLevel: 'read',
		description: 'Get the authenticated Facebook user via /me.',
	},
	'users.getUserPages': {
		riskLevel: 'read',
		description:
			'Deprecated. List Facebook Pages for the authenticated user via /me/accounts.',
	},
	'pages.listManaged': {
		riskLevel: 'read',
		description:
			'List Facebook Pages the authenticated user manages, including page access tokens.',
	},
	'pages.getDetails': {
		riskLevel: 'read',
		description: 'Retrieve metadata for a Facebook Page.',
	},
	'pages.search': {
		riskLevel: 'read',
		description:
			'DEPRECATED for standard Facebook apps: /pages/search is Workplace-only.',
	},
	'pages.updateSettings': {
		riskLevel: 'write',
		description: 'Update editable settings on a Facebook Page.',
	},
	'pages.getInsights': {
		riskLevel: 'read',
		description: 'Retrieve Page insights for the given metrics and period.',
	},
	'pages.getRoles': {
		riskLevel: 'read',
		description: 'List users and their roles on a Facebook Page.',
	},
	'pages.assignTask': {
		riskLevel: 'write',
		description: 'Assign Page tasks to a user.',
	},
	'pages.removeTask': {
		riskLevel: 'write',
		description: 'Remove a user from Page task assignments.',
	},
	'posts.create': {
		riskLevel: 'write',
		description: 'Publish or schedule a Page feed post.',
	},
	'posts.get': {
		riskLevel: 'read',
		description: 'Retrieve a single Page post by ID.',
	},
	'posts.list': {
		riskLevel: 'read',
		description:
			'List Page timeline content via /feed (page posts + visitor posts + tagged posts).',
	},
	'posts.listScheduled': {
		riskLevel: 'read',
		description: 'List scheduled but unpublished Page posts.',
	},
	'posts.update': {
		riskLevel: 'write',
		description: 'Update an existing Page post.',
	},
	'posts.delete': {
		riskLevel: 'write',
		irreversible: true,
		description: 'Delete a Page post.',
	},
	'posts.reschedule': {
		riskLevel: 'write',
		description: 'Change the scheduled publish time of a post.',
	},
	'posts.publishScheduled': {
		riskLevel: 'write',
		description: 'Publish a previously scheduled post immediately.',
	},
	'posts.listTagged': {
		riskLevel: 'read',
		description: 'List posts in which the Page is tagged.',
	},
	'posts.getInsights': {
		riskLevel: 'read',
		description: 'Retrieve insights for a Page post.',
	},
	'posts.getReactions': {
		riskLevel: 'read',
		description: 'List reactions on a Page post.',
	},
	'comments.create': {
		riskLevel: 'write',
		description: 'Create a comment on a Page post or other object.',
	},
	'comments.get': {
		riskLevel: 'read',
		description: 'Retrieve a single comment by ID.',
	},
	'comments.list': {
		riskLevel: 'read',
		description: 'List comments on a Page post or other object.',
	},
	'comments.update': {
		riskLevel: 'write',
		description: 'Update or hide a comment.',
	},
	'comments.delete': {
		riskLevel: 'write',
		irreversible: true,
		description: 'Delete a comment.',
	},
	'reactions.add': {
		riskLevel: 'write',
		description: 'Add a reaction to a post or comment.',
	},
	'reactions.unlike': {
		riskLevel: 'write',
		description:
			'Remove the authenticated user like/reaction from a post or comment.',
	},
	'photos.upload': {
		riskLevel: 'write',
		description: 'Upload a photo to a Page.',
	},
	'photos.uploadBatch': {
		riskLevel: 'write',
		description: 'Upload multiple photos using the Graph API batch endpoint.',
	},
	'photos.createPost': {
		riskLevel: 'write',
		description: 'Create and publish a photo post on a Page.',
	},
	'photos.addToAlbum': {
		riskLevel: 'write',
		description: 'Add a photo to an existing album.',
	},
	'photos.createAlbum': {
		riskLevel: 'write',
		description: 'Create a photo album on a Page.',
	},
	'photos.list': {
		riskLevel: 'read',
		description: 'List photos uploaded to a Page.',
	},
	'videos.createPost': {
		riskLevel: 'write',
		description: 'Create a video post on a Page using file_url.',
	},
	'videos.list': {
		riskLevel: 'read',
		description: 'List videos uploaded to a Page.',
	},
	'videos.upload': {
		riskLevel: 'write',
		description:
			'Deprecated direct upload helper. Prefer resumable upload for large files.',
	},
	'conversations.list': {
		riskLevel: 'read',
		description: 'List Messenger conversations for a Page.',
	},
	'conversations.getMessages': {
		riskLevel: 'read',
		description: 'List messages in a Messenger conversation.',
	},
	'messages.getDetails': {
		riskLevel: 'read',
		description: 'Retrieve a single Messenger message by ID.',
	},
	'messages.send': {
		riskLevel: 'write',
		description: 'Send a text Messenger message from a Page.',
	},
	'messages.sendMedia': {
		riskLevel: 'write',
		description: 'Send a media Messenger message from a Page.',
	},
	'messages.markSeen': {
		riskLevel: 'write',
		description: 'Mark the most recent messages in a conversation as seen.',
	},
	'messages.toggleTyping': {
		riskLevel: 'write',
		description: 'Show or hide the Messenger typing indicator.',
	},
} satisfies RequiredPluginEndpointMeta<typeof facebookEndpointsNested>;

export const facebookAuthConfig = {
	oauth_2: {
		integration: [] as const,
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseFacebookPlugin<T extends FacebookPluginOptions> = CorsairPlugin<
	'facebook',
	typeof FacebookSchema,
	typeof facebookEndpointsNested,
	{},
	T,
	typeof defaultAuthType,
	typeof facebookAuthConfig
>;

export type InternalFacebookPlugin = BaseFacebookPlugin<FacebookPluginOptions>;

export type ExternalFacebookPlugin<T extends FacebookPluginOptions> =
	BaseFacebookPlugin<T>;

export function facebook<const T extends FacebookPluginOptions>(
	incomingOptions: FacebookPluginOptions & T = {} as FacebookPluginOptions & T,
): ExternalFacebookPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'facebook',
		authConfig: facebookAuthConfig,
		schema: FacebookSchema,
		options,
		hooks: options.hooks,
		endpoints: facebookEndpointsNested,
		webhooks: {},
		endpointMeta: facebookEndpointMeta,
		endpointSchemas: facebookEndpointSchemas,
		oauthConfig: {
			providerName: 'Facebook',
			authUrl: 'https://www.facebook.com/v25.0/dialog/oauth',
			tokenUrl: 'https://graph.facebook.com/v25.0/oauth/access_token',
			scopes: [
				'pages_show_list',
				'pages_read_engagement',
				'pages_manage_posts',
				'pages_manage_metadata',
				'pages_manage_engagement',
				'pages_messaging',
				'pages_read_user_content',
				'publish_video',
				'business_management',
				'read_insights',
			],
		},
		pluginWebhookMatcher: () => false,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: FacebookKeyBuilderContext) => {
			if (options.key) {
				return options.key;
			}

			if (ctx.authType !== 'oauth_2') {
				throw new AuthMissingError('facebook', 'oauth_2');
			}

			const accessToken = await ctx.keys.get_access_token();
			if (!accessToken) {
				throw new AuthMissingError('facebook', 'oauth_2');
			}

			return accessToken;
		},
	} satisfies InternalFacebookPlugin;
}

export {
	FACEBOOK_API_BASE,
	FACEBOOK_GRAPH_API_VERSION,
	FacebookAPIError,
} from './client';
export type {
	FacebookEndpointInputs,
	FacebookEndpointOutputs,
} from './endpoints/types';
