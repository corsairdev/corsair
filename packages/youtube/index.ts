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
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import {
	CaptionsEndpoints,
	ChannelsEndpoints,
	CommentsEndpoints,
	I18nEndpoints,
	LiveChatEndpoints,
	PlaylistImagesEndpoints,
	PlaylistItemsEndpoints,
	PlaylistsEndpoints,
	SearchEndpoints,
	SubscriptionsEndpoints,
	VideoActionsEndpoints,
	VideoCategoriesEndpoints,
	VideosEndpoints,
	YoutubeEndpointInputSchemas,
	YoutubeEndpointOutputSchemas,
} from './endpoints';
import type {
	YoutubeEndpointInputs,
	YoutubeEndpointOutputs,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { YoutubeSchema } from './schema';
import type { YoutubeWebhookOutputs } from './webhooks/types';

// ── Context & Key Builder ─────────────────────────────────────────────────────

export type YoutubeContext = CorsairPluginContext<
	typeof YoutubeSchema,
	YoutubePluginOptions
>;

export type YoutubeKeyBuilderContext = KeyBuilderContext<YoutubePluginOptions>;

// ── Endpoint Types ────────────────────────────────────────────────────────────

type YoutubeEndpoint<K extends keyof YoutubeEndpointOutputs> = CorsairEndpoint<
	YoutubeContext,
	YoutubeEndpointInputs[K],
	YoutubeEndpointOutputs[K]
>;

export type YoutubeEndpoints = {
	// Playlists
	playlistsList: YoutubeEndpoint<'playlistsList'>;
	playlistsCreate: YoutubeEndpoint<'playlistsCreate'>;
	playlistsUpdate: YoutubeEndpoint<'playlistsUpdate'>;
	playlistsDelete: YoutubeEndpoint<'playlistsDelete'>;
	// Playlist Items
	playlistItemsAdd: YoutubeEndpoint<'playlistItemsAdd'>;
	playlistItemsList: YoutubeEndpoint<'playlistItemsList'>;
	playlistItemsUpdate: YoutubeEndpoint<'playlistItemsUpdate'>;
	playlistItemsDelete: YoutubeEndpoint<'playlistItemsDelete'>;
	// Videos
	videosGet: YoutubeEndpoint<'videosGet'>;
	videosGetBatch: YoutubeEndpoint<'videosGetBatch'>;
	videosList: YoutubeEndpoint<'videosList'>;
	videosListMostPopular: YoutubeEndpoint<'videosListMostPopular'>;
	videosUpdate: YoutubeEndpoint<'videosUpdate'>;
	videosUpload: YoutubeEndpoint<'videosUpload'>;
	videosUploadMultipart: YoutubeEndpoint<'videosUploadMultipart'>;
	videosDelete: YoutubeEndpoint<'videosDelete'>;
	// Channels
	channelsGetStatistics: YoutubeEndpoint<'channelsGetStatistics'>;
	channelsGetIdByHandle: YoutubeEndpoint<'channelsGetIdByHandle'>;
	channelsGetActivities: YoutubeEndpoint<'channelsGetActivities'>;
	channelsUpdate: YoutubeEndpoint<'channelsUpdate'>;
	channelSectionsList: YoutubeEndpoint<'channelSectionsList'>;
	channelSectionsCreate: YoutubeEndpoint<'channelSectionsCreate'>;
	channelSectionsUpdate: YoutubeEndpoint<'channelSectionsUpdate'>;
	channelSectionsDelete: YoutubeEndpoint<'channelSectionsDelete'>;
	// Comments
	commentsList: YoutubeEndpoint<'commentsList'>;
	commentThreadsList: YoutubeEndpoint<'commentThreadsList'>;
	commentThreadsList2: YoutubeEndpoint<'commentThreadsList2'>;
	commentsPost: YoutubeEndpoint<'commentsPost'>;
	commentsCreateReply: YoutubeEndpoint<'commentsCreateReply'>;
	commentsUpdate: YoutubeEndpoint<'commentsUpdate'>;
	commentsDelete: YoutubeEndpoint<'commentsDelete'>;
	commentsMarkSpam: YoutubeEndpoint<'commentsMarkSpam'>;
	commentsSetModerationStatus: YoutubeEndpoint<'commentsSetModerationStatus'>;
	// Search
	searchYouTube: YoutubeEndpoint<'searchYouTube'>;
	// Subscriptions
	subscriptionsList: YoutubeEndpoint<'subscriptionsList'>;
	subscriptionsSubscribe: YoutubeEndpoint<'subscriptionsSubscribe'>;
	subscriptionsUnsubscribe: YoutubeEndpoint<'subscriptionsUnsubscribe'>;
	// Video Actions
	videoActionsRate: YoutubeEndpoint<'videoActionsRate'>;
	videoActionsGetRating: YoutubeEndpoint<'videoActionsGetRating'>;
	videoActionsReportAbuse: YoutubeEndpoint<'videoActionsReportAbuse'>;
	videoActionsListAbuseReasons: YoutubeEndpoint<'videoActionsListAbuseReasons'>;
	videoActionsUpdateThumbnail: YoutubeEndpoint<'videoActionsUpdateThumbnail'>;
	// Captions
	captionsList: YoutubeEndpoint<'captionsList'>;
	captionsUpdate: YoutubeEndpoint<'captionsUpdate'>;
	captionsLoad: YoutubeEndpoint<'captionsLoad'>;
	// Live Chat
	liveChatListMessages: YoutubeEndpoint<'liveChatListMessages'>;
	liveChatListSuperChatEvents: YoutubeEndpoint<'liveChatListSuperChatEvents'>;
	// i18n
	i18nListLanguages: YoutubeEndpoint<'i18nListLanguages'>;
	i18nListRegions: YoutubeEndpoint<'i18nListRegions'>;
	videoCategoriesList: YoutubeEndpoint<'videoCategoriesList'>;
	// Playlist Images
	playlistImagesList: YoutubeEndpoint<'playlistImagesList'>;
};

// ── Webhook Types ─────────────────────────────────────────────────────────────

type YoutubeWebhook<
	K extends keyof YoutubeWebhookOutputs,
	TEvent,
> = CorsairWebhook<YoutubeContext, TEvent, YoutubeWebhookOutputs[K]>;

export type YoutubeWebhooks = {};

export type YoutubeBoundEndpoints = BindEndpoints<
	typeof youtubeEndpointsNested
>;
export type YoutubeBoundWebhooks = BindWebhooks<YoutubeWebhooks>;

// ── Plugin Options ────────────────────────────────────────────────────────────

export type YoutubePluginOptions = {
	authType?: PickAuth<'oauth_2'>;
	/** Optional access token (overrides key manager) */
	key?: string;
	/** Optional webhook secret for signature verification */
	webhookSecret?: string;
	hooks?: InternalYoutubePlugin['hooks'];
	webhookHooks?: InternalYoutubePlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	/**
	 * Permission configuration for the YouTube plugin.
	 * Controls what the AI agent is allowed to do.
	 * Overrides use dot-notation paths from the YouTube endpoint tree — invalid paths are type errors.
	 */
	permissions?: PluginPermissionsConfig<typeof youtubeEndpointsNested>;
};

// ── Endpoint + Webhook Trees ──────────────────────────────────────────────────

const youtubeEndpointsNested = {
	playlists: {
		list: PlaylistsEndpoints.list,
		create: PlaylistsEndpoints.create,
		update: PlaylistsEndpoints.update,
		delete: PlaylistsEndpoints.delete,
	},
	playlistItems: {
		add: PlaylistItemsEndpoints.add,
		list: PlaylistItemsEndpoints.list,
		update: PlaylistItemsEndpoints.update,
		delete: PlaylistItemsEndpoints.delete,
	},
	videos: {
		get: VideosEndpoints.get,
		getBatch: VideosEndpoints.getBatch,
		list: VideosEndpoints.list,
		listMostPopular: VideosEndpoints.listMostPopular,
		update: VideosEndpoints.update,
		upload: VideosEndpoints.upload,
		uploadMultipart: VideosEndpoints.uploadMultipart,
		delete: VideosEndpoints.delete,
	},
	channels: {
		getStatistics: ChannelsEndpoints.getStatistics,
		getIdByHandle: ChannelsEndpoints.getIdByHandle,
		getActivities: ChannelsEndpoints.getActivities,
		update: ChannelsEndpoints.update,
	},
	channelSections: {
		list: ChannelsEndpoints.sectionsList,
		create: ChannelsEndpoints.sectionsCreate,
		update: ChannelsEndpoints.sectionsUpdate,
		delete: ChannelsEndpoints.sectionsDelete,
	},
	comments: {
		list: CommentsEndpoints.list,
		threadsList: CommentsEndpoints.threadsList,
		threadsList2: CommentsEndpoints.threadsList2,
		post: CommentsEndpoints.post,
		createReply: CommentsEndpoints.createReply,
		update: CommentsEndpoints.update,
		delete: CommentsEndpoints.delete,
		markSpam: CommentsEndpoints.markSpam,
		setModerationStatus: CommentsEndpoints.setModerationStatus,
	},
	search: {
		youtube: SearchEndpoints.youtube,
	},
	subscriptions: {
		list: SubscriptionsEndpoints.list,
		subscribe: SubscriptionsEndpoints.subscribe,
		unsubscribe: SubscriptionsEndpoints.unsubscribe,
	},
	videoActions: {
		rate: VideoActionsEndpoints.rate,
		getRating: VideoActionsEndpoints.getRating,
		reportAbuse: VideoActionsEndpoints.reportAbuse,
		listAbuseReasons: VideoActionsEndpoints.listAbuseReasons,
		updateThumbnail: VideoActionsEndpoints.updateThumbnail,
	},
	captions: {
		list: CaptionsEndpoints.list,
		update: CaptionsEndpoints.update,
		load: CaptionsEndpoints.load,
	},
	liveChat: {
		listMessages: LiveChatEndpoints.listMessages,
		listSuperChatEvents: LiveChatEndpoints.listSuperChatEvents,
	},
	i18n: {
		listLanguages: I18nEndpoints.listLanguages,
		listRegions: I18nEndpoints.listRegions,
	},
	videoCategories: {
		list: VideoCategoriesEndpoints.list,
	},
	playlistImages: {
		list: PlaylistImagesEndpoints.list,
	},
} as const;

const youtubeWebhooksNested = {} as const;

// ── Endpoint Schemas ──────────────────────────────────────────────────────────

// Explicitly typed to avoid "inferred type exceeds serialization limit" TS error with 51 schemas
export const youtubeEndpointSchemas: RequiredPluginEndpointSchemas<
	typeof youtubeEndpointsNested
> = {
	'playlists.list': {
		input: YoutubeEndpointInputSchemas.playlistsList,
		output: YoutubeEndpointOutputSchemas.playlistsList,
	},
	'playlists.create': {
		input: YoutubeEndpointInputSchemas.playlistsCreate,
		output: YoutubeEndpointOutputSchemas.playlistsCreate,
	},
	'playlists.update': {
		input: YoutubeEndpointInputSchemas.playlistsUpdate,
		output: YoutubeEndpointOutputSchemas.playlistsUpdate,
	},
	'playlists.delete': {
		input: YoutubeEndpointInputSchemas.playlistsDelete,
		output: YoutubeEndpointOutputSchemas.playlistsDelete,
	},
	'playlistItems.add': {
		input: YoutubeEndpointInputSchemas.playlistItemsAdd,
		output: YoutubeEndpointOutputSchemas.playlistItemsAdd,
	},
	'playlistItems.list': {
		input: YoutubeEndpointInputSchemas.playlistItemsList,
		output: YoutubeEndpointOutputSchemas.playlistItemsList,
	},
	'playlistItems.update': {
		input: YoutubeEndpointInputSchemas.playlistItemsUpdate,
		output: YoutubeEndpointOutputSchemas.playlistItemsUpdate,
	},
	'playlistItems.delete': {
		input: YoutubeEndpointInputSchemas.playlistItemsDelete,
		output: YoutubeEndpointOutputSchemas.playlistItemsDelete,
	},
	'videos.get': {
		input: YoutubeEndpointInputSchemas.videosGet,
		output: YoutubeEndpointOutputSchemas.videosGet,
	},
	'videos.getBatch': {
		input: YoutubeEndpointInputSchemas.videosGetBatch,
		output: YoutubeEndpointOutputSchemas.videosGetBatch,
	},
	'videos.list': {
		input: YoutubeEndpointInputSchemas.videosList,
		output: YoutubeEndpointOutputSchemas.videosList,
	},
	'videos.listMostPopular': {
		input: YoutubeEndpointInputSchemas.videosListMostPopular,
		output: YoutubeEndpointOutputSchemas.videosListMostPopular,
	},
	'videos.update': {
		input: YoutubeEndpointInputSchemas.videosUpdate,
		output: YoutubeEndpointOutputSchemas.videosUpdate,
	},
	'videos.upload': {
		input: YoutubeEndpointInputSchemas.videosUpload,
		output: YoutubeEndpointOutputSchemas.videosUpload,
	},
	'videos.uploadMultipart': {
		input: YoutubeEndpointInputSchemas.videosUploadMultipart,
		output: YoutubeEndpointOutputSchemas.videosUploadMultipart,
	},
	'videos.delete': {
		input: YoutubeEndpointInputSchemas.videosDelete,
		output: YoutubeEndpointOutputSchemas.videosDelete,
	},
	'channels.getStatistics': {
		input: YoutubeEndpointInputSchemas.channelsGetStatistics,
		output: YoutubeEndpointOutputSchemas.channelsGetStatistics,
	},
	'channels.getIdByHandle': {
		input: YoutubeEndpointInputSchemas.channelsGetIdByHandle,
		output: YoutubeEndpointOutputSchemas.channelsGetIdByHandle,
	},
	'channels.getActivities': {
		input: YoutubeEndpointInputSchemas.channelsGetActivities,
		output: YoutubeEndpointOutputSchemas.channelsGetActivities,
	},
	'channels.update': {
		input: YoutubeEndpointInputSchemas.channelsUpdate,
		output: YoutubeEndpointOutputSchemas.channelsUpdate,
	},
	'channelSections.list': {
		input: YoutubeEndpointInputSchemas.channelSectionsList,
		output: YoutubeEndpointOutputSchemas.channelSectionsList,
	},
	'channelSections.create': {
		input: YoutubeEndpointInputSchemas.channelSectionsCreate,
		output: YoutubeEndpointOutputSchemas.channelSectionsCreate,
	},
	'channelSections.update': {
		input: YoutubeEndpointInputSchemas.channelSectionsUpdate,
		output: YoutubeEndpointOutputSchemas.channelSectionsUpdate,
	},
	'channelSections.delete': {
		input: YoutubeEndpointInputSchemas.channelSectionsDelete,
		output: YoutubeEndpointOutputSchemas.channelSectionsDelete,
	},
	'comments.list': {
		input: YoutubeEndpointInputSchemas.commentsList,
		output: YoutubeEndpointOutputSchemas.commentsList,
	},
	'comments.threadsList': {
		input: YoutubeEndpointInputSchemas.commentThreadsList,
		output: YoutubeEndpointOutputSchemas.commentThreadsList,
	},
	'comments.threadsList2': {
		input: YoutubeEndpointInputSchemas.commentThreadsList2,
		output: YoutubeEndpointOutputSchemas.commentThreadsList2,
	},
	'comments.post': {
		input: YoutubeEndpointInputSchemas.commentsPost,
		output: YoutubeEndpointOutputSchemas.commentsPost,
	},
	'comments.createReply': {
		input: YoutubeEndpointInputSchemas.commentsCreateReply,
		output: YoutubeEndpointOutputSchemas.commentsCreateReply,
	},
	'comments.update': {
		input: YoutubeEndpointInputSchemas.commentsUpdate,
		output: YoutubeEndpointOutputSchemas.commentsUpdate,
	},
	'comments.delete': {
		input: YoutubeEndpointInputSchemas.commentsDelete,
		output: YoutubeEndpointOutputSchemas.commentsDelete,
	},
	'comments.markSpam': {
		input: YoutubeEndpointInputSchemas.commentsMarkSpam,
		output: YoutubeEndpointOutputSchemas.commentsMarkSpam,
	},
	'comments.setModerationStatus': {
		input: YoutubeEndpointInputSchemas.commentsSetModerationStatus,
		output: YoutubeEndpointOutputSchemas.commentsSetModerationStatus,
	},
	'search.youtube': {
		input: YoutubeEndpointInputSchemas.searchYouTube,
		output: YoutubeEndpointOutputSchemas.searchYouTube,
	},
	'subscriptions.list': {
		input: YoutubeEndpointInputSchemas.subscriptionsList,
		output: YoutubeEndpointOutputSchemas.subscriptionsList,
	},
	'subscriptions.subscribe': {
		input: YoutubeEndpointInputSchemas.subscriptionsSubscribe,
		output: YoutubeEndpointOutputSchemas.subscriptionsSubscribe,
	},
	'subscriptions.unsubscribe': {
		input: YoutubeEndpointInputSchemas.subscriptionsUnsubscribe,
		output: YoutubeEndpointOutputSchemas.subscriptionsUnsubscribe,
	},
	'videoActions.rate': {
		input: YoutubeEndpointInputSchemas.videoActionsRate,
		output: YoutubeEndpointOutputSchemas.videoActionsRate,
	},
	'videoActions.getRating': {
		input: YoutubeEndpointInputSchemas.videoActionsGetRating,
		output: YoutubeEndpointOutputSchemas.videoActionsGetRating,
	},
	'videoActions.reportAbuse': {
		input: YoutubeEndpointInputSchemas.videoActionsReportAbuse,
		output: YoutubeEndpointOutputSchemas.videoActionsReportAbuse,
	},
	'videoActions.listAbuseReasons': {
		input: YoutubeEndpointInputSchemas.videoActionsListAbuseReasons,
		output: YoutubeEndpointOutputSchemas.videoActionsListAbuseReasons,
	},
	'videoActions.updateThumbnail': {
		input: YoutubeEndpointInputSchemas.videoActionsUpdateThumbnail,
		output: YoutubeEndpointOutputSchemas.videoActionsUpdateThumbnail,
	},
	'captions.list': {
		input: YoutubeEndpointInputSchemas.captionsList,
		output: YoutubeEndpointOutputSchemas.captionsList,
	},
	'captions.update': {
		input: YoutubeEndpointInputSchemas.captionsUpdate,
		output: YoutubeEndpointOutputSchemas.captionsUpdate,
	},
	'captions.load': {
		input: YoutubeEndpointInputSchemas.captionsLoad,
		output: YoutubeEndpointOutputSchemas.captionsLoad,
	},
	'liveChat.listMessages': {
		input: YoutubeEndpointInputSchemas.liveChatListMessages,
		output: YoutubeEndpointOutputSchemas.liveChatListMessages,
	},
	'liveChat.listSuperChatEvents': {
		input: YoutubeEndpointInputSchemas.liveChatListSuperChatEvents,
		output: YoutubeEndpointOutputSchemas.liveChatListSuperChatEvents,
	},
	'i18n.listLanguages': {
		input: YoutubeEndpointInputSchemas.i18nListLanguages,
		output: YoutubeEndpointOutputSchemas.i18nListLanguages,
	},
	'i18n.listRegions': {
		input: YoutubeEndpointInputSchemas.i18nListRegions,
		output: YoutubeEndpointOutputSchemas.i18nListRegions,
	},
	'videoCategories.list': {
		input: YoutubeEndpointInputSchemas.videoCategoriesList,
		output: YoutubeEndpointOutputSchemas.videoCategoriesList,
	},
	'playlistImages.list': {
		input: YoutubeEndpointInputSchemas.playlistImagesList,
		output: YoutubeEndpointOutputSchemas.playlistImagesList,
	},
};

// ── Endpoint Meta ─────────────────────────────────────────────────────────────

const youtubeEndpointMeta = {
	'playlists.list': {
		riskLevel: 'read',
		description: "List the authenticated user's playlists",
	},
	'playlists.create': {
		riskLevel: 'write',
		description: 'Create a new playlist',
	},
	'playlists.update': {
		riskLevel: 'write',
		description: 'Update an existing playlist',
	},
	'playlists.delete': {
		riskLevel: 'destructive',
		description: 'Delete a playlist',
	},
	'playlistItems.add': {
		riskLevel: 'write',
		description: 'Add a video to a playlist',
	},
	'playlistItems.list': {
		riskLevel: 'read',
		description: 'List items in a playlist',
	},
	'playlistItems.update': {
		riskLevel: 'write',
		description: 'Update a playlist item',
	},
	'playlistItems.delete': {
		riskLevel: 'destructive',
		description: 'Remove an item from a playlist',
	},
	'videos.get': {
		riskLevel: 'read',
		description: 'Get details for a single video',
	},
	'videos.getBatch': {
		riskLevel: 'read',
		description: 'Get details for multiple videos in one request',
	},
	'videos.list': {
		riskLevel: 'read',
		description: 'List videos for a channel',
	},
	'videos.listMostPopular': {
		riskLevel: 'read',
		description: 'List most popular videos on YouTube',
	},
	'videos.update': { riskLevel: 'write', description: 'Update video metadata' },
	'videos.upload': { riskLevel: 'write', description: 'Upload a new video' },
	'videos.uploadMultipart': {
		riskLevel: 'write',
		description: 'Upload a new video using multipart upload',
	},
	'videos.delete': { riskLevel: 'destructive', description: 'Delete a video' },
	'channels.getStatistics': {
		riskLevel: 'read',
		description: 'Get channel statistics and details',
	},
	'channels.getIdByHandle': {
		riskLevel: 'read',
		description: 'Get channel ID by handle',
	},
	'channels.getActivities': {
		riskLevel: 'read',
		description: "Get a channel's activity feed",
	},
	'channels.update': {
		riskLevel: 'write',
		description: 'Update channel branding settings',
	},
	'channelSections.list': {
		riskLevel: 'read',
		description: 'List channel sections',
	},
	'channelSections.create': {
		riskLevel: 'write',
		description: 'Create a new channel section',
	},
	'channelSections.update': {
		riskLevel: 'write',
		description: 'Update a channel section',
	},
	'channelSections.delete': {
		riskLevel: 'destructive',
		description: 'Delete a channel section',
	},
	'comments.list': { riskLevel: 'read', description: 'List comments' },
	'comments.threadsList': {
		riskLevel: 'read',
		description: 'List comment threads (deprecated)',
	},
	'comments.threadsList2': {
		riskLevel: 'read',
		description: 'List comment threads',
	},
	'comments.post': {
		riskLevel: 'write',
		description: 'Post a comment on a video',
	},
	'comments.createReply': {
		riskLevel: 'write',
		description: 'Post a reply to a comment',
	},
	'comments.update': { riskLevel: 'write', description: 'Update a comment' },
	'comments.delete': {
		riskLevel: 'destructive',
		description: 'Delete a comment',
	},
	'comments.markSpam': {
		riskLevel: 'write',
		description: 'Mark a comment as spam',
	},
	'comments.setModerationStatus': {
		riskLevel: 'write',
		description: 'Set moderation status for a comment',
	},
	'search.youtube': {
		riskLevel: 'read',
		description: 'Search YouTube for videos, channels, and playlists',
	},
	'subscriptions.list': {
		riskLevel: 'read',
		description: "List the authenticated user's subscriptions",
	},
	'subscriptions.subscribe': {
		riskLevel: 'write',
		description: 'Subscribe to a YouTube channel',
	},
	'subscriptions.unsubscribe': {
		riskLevel: 'destructive',
		description: 'Unsubscribe from a YouTube channel',
	},
	'videoActions.rate': {
		riskLevel: 'write',
		description: 'Rate a video (like, dislike, or remove rating)',
	},
	'videoActions.getRating': {
		riskLevel: 'read',
		description: "Get the authenticated user's rating for a video",
	},
	'videoActions.reportAbuse': {
		riskLevel: 'write',
		description: 'Report a video for abuse',
	},
	'videoActions.listAbuseReasons': {
		riskLevel: 'read',
		description: 'List available video abuse report reasons',
	},
	'videoActions.updateThumbnail': {
		riskLevel: 'write',
		description: 'Update the thumbnail for a video',
	},
	'captions.list': {
		riskLevel: 'read',
		description: 'List caption tracks for a video',
	},
	'captions.update': {
		riskLevel: 'write',
		description: 'Update a caption track',
	},
	'captions.load': {
		riskLevel: 'read',
		description: 'Download a caption track',
	},
	'liveChat.listMessages': {
		riskLevel: 'read',
		description: 'List messages in a live chat',
	},
	'liveChat.listSuperChatEvents': {
		riskLevel: 'read',
		description: 'List Super Chat events',
	},
	'i18n.listLanguages': {
		riskLevel: 'read',
		description: 'List supported i18n languages',
	},
	'i18n.listRegions': {
		riskLevel: 'read',
		description: 'List supported i18n regions',
	},
	'videoCategories.list': {
		riskLevel: 'read',
		description: 'List video categories',
	},
	'playlistImages.list': {
		riskLevel: 'read',
		description: 'List playlist images',
	},
} satisfies RequiredPluginEndpointMeta<typeof youtubeEndpointsNested>;

// ── Auth Config ───────────────────────────────────────────────────────────────

export const youtubeAuthConfig = {
	oauth_2: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

// ── Plugin Types ──────────────────────────────────────────────────────────────

const defaultAuthType: AuthTypes = 'oauth_2' as const;

export type BaseYoutubePlugin<T extends YoutubePluginOptions> = CorsairPlugin<
	'youtube',
	typeof YoutubeSchema,
	typeof youtubeEndpointsNested,
	typeof youtubeWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalYoutubePlugin = BaseYoutubePlugin<YoutubePluginOptions>;

export type ExternalYoutubePlugin<T extends YoutubePluginOptions> =
	BaseYoutubePlugin<T>;

// ── Plugin Factory ────────────────────────────────────────────────────────────

export function youtube<const T extends YoutubePluginOptions>(
	// default parameter asserted to satisfy the generic constraint when no options are provided
	incomingOptions: YoutubePluginOptions & T = {} as YoutubePluginOptions & T,
): ExternalYoutubePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'youtube',
		schema: YoutubeSchema,
		options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: youtubeEndpointsNested,
		webhooks: youtubeWebhooksNested,
		endpointMeta: youtubeEndpointMeta,
		endpointSchemas: youtubeEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		pluginWebhookMatcher: (request) => {
			// Webhooks not implemented yet
			return false;
		},
		keyBuilder: async (ctx: YoutubeKeyBuilderContext, source) => {
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature();
				return res ?? '';
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'oauth_2') {
				const res = await ctx.keys.get_access_token();
				if (!res) return '';
				return res;
			}

			return '';
		},
	} satisfies InternalYoutubePlugin;
}

// ── Type Exports ──────────────────────────────────────────────────────────────

export type {
	CaptionsListInput,
	CaptionsListResponse,
	CaptionsLoadInput,
	CaptionsLoadResponse,
	CaptionsUpdateInput,
	CaptionsUpdateResponse,
	ChannelSectionsCreateInput,
	ChannelSectionsCreateResponse,
	ChannelSectionsDeleteInput,
	ChannelSectionsDeleteResponse,
	ChannelSectionsListInput,
	ChannelSectionsListResponse,
	ChannelSectionsUpdateInput,
	ChannelSectionsUpdateResponse,
	ChannelsGetActivitiesInput,
	ChannelsGetActivitiesResponse,
	ChannelsGetIdByHandleInput,
	ChannelsGetIdByHandleResponse,
	ChannelsGetStatisticsInput,
	ChannelsGetStatisticsResponse,
	ChannelsUpdateInput,
	ChannelsUpdateResponse,
	CommentsCreateReplyInput,
	CommentsCreateReplyResponse,
	CommentsDeleteInput,
	CommentsDeleteResponse,
	CommentsListInput,
	CommentsListResponse,
	CommentsMarkSpamInput,
	CommentsMarkSpamResponse,
	CommentsPostInput,
	CommentsPostResponse,
	CommentsSetModerationStatusInput,
	CommentsSetModerationStatusResponse,
	CommentsUpdateInput,
	CommentsUpdateResponse,
	CommentThreadsList2Input,
	CommentThreadsList2Response,
	CommentThreadsListInput,
	CommentThreadsListResponse,
	I18nListLanguagesInput,
	I18nListLanguagesResponse,
	I18nListRegionsInput,
	I18nListRegionsResponse,
	LiveChatListMessagesInput,
	LiveChatListMessagesResponse,
	LiveChatListSuperChatEventsInput,
	LiveChatListSuperChatEventsResponse,
	PlaylistImagesListInput,
	PlaylistImagesListResponse,
	PlaylistItemsAddInput,
	PlaylistItemsAddResponse,
	PlaylistItemsDeleteInput,
	PlaylistItemsDeleteResponse,
	PlaylistItemsListInput,
	PlaylistItemsListResponse,
	PlaylistItemsUpdateInput,
	PlaylistItemsUpdateResponse,
	PlaylistsCreateInput,
	PlaylistsCreateResponse,
	PlaylistsDeleteInput,
	PlaylistsDeleteResponse,
	PlaylistsListInput,
	PlaylistsListResponse,
	PlaylistsUpdateInput,
	PlaylistsUpdateResponse,
	SearchYouTubeInput,
	SearchYouTubeResponse,
	SubscriptionsListInput,
	SubscriptionsListResponse,
	SubscriptionsSubscribeInput,
	SubscriptionsSubscribeResponse,
	SubscriptionsUnsubscribeInput,
	SubscriptionsUnsubscribeResponse,
	VideoActionsGetRatingInput,
	VideoActionsGetRatingResponse,
	VideoActionsListAbuseReasonsInput,
	VideoActionsListAbuseReasonsResponse,
	VideoActionsRateInput,
	VideoActionsRateResponse,
	VideoActionsReportAbuseInput,
	VideoActionsReportAbuseResponse,
	VideoActionsUpdateThumbnailInput,
	VideoActionsUpdateThumbnailResponse,
	VideoCategoriesListInput,
	VideoCategoriesListResponse,
	VideosDeleteInput,
	VideosDeleteResponse,
	VideosGetBatchInput,
	VideosGetBatchResponse,
	VideosGetInput,
	VideosGetResponse,
	VideosListInput,
	VideosListMostPopularInput,
	VideosListMostPopularResponse,
	VideosListResponse,
	VideosUpdateInput,
	VideosUpdateResponse,
	VideosUploadInput,
	VideosUploadMultipartInput,
	VideosUploadMultipartResponse,
	VideosUploadResponse,
	YoutubeEndpointInputs,
	YoutubeEndpointOutputs,
} from './endpoints/types';
export type { YoutubeCredentials } from './schema';
export type { YoutubeWebhookOutputs } from './webhooks/types';
