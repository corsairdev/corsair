import type {
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';

import {
	attachInstagramRefreshAuth,
	getValidFacebookAccessToken,
} from './client';
import {
	CarouselEndpoints,
	CommentsEndpoints,
	ConversationsEndpoints,
	ImageEndpoints,
	MediaEndpoints,
	MessagesEndpoints,
	MessengerEndpoints,
	PostEndpoints,
	ProfileEndpoints,
	PublishEndpoints,
	ReelEndpoints,
	VideoEndpoints,
} from './endpoints/index';
import type {
	InstagramEndpointInputs,
	InstagramEndpointOutputs,
} from './endpoints/types';
import {
	InstagramEndpointInputSchemas,
	InstagramEndpointOutputSchemas,
} from './endpoints/types';
import type { InstagramCredentials } from './schema';
import { InstagramSchema } from './schema';
import { InstagramWebhooks } from './webhooks/index';
import type {
	InstagramWebhookCommentPayload,
	InstagramWebhookOutputs,
	InstagramWebhookPayload,
	InstagramWebhookUrlVerificationPayload,
} from './webhooks/types';
import {
	InstagramCommentEventSchema,
	InstagramCommentsWebhookSchema,
	InstagramMessageReceivedEventSchema,
	InstagramUrlVerificationEventSchema,
	InstagramWebhookPayloadSchema,
	InstagramWebhookUrlVerificationSchema,
} from './webhooks/types';

export const InstagramWebhooksNested = {
	messageReceived: InstagramWebhooks.messageReceived,
	url_verification: InstagramWebhooks.url_verification,
	comments: InstagramWebhooks.comments,
} as const;

export const instagramAuthConfig = {
	oauth_2: {
		//OAuth2 plugins, client_id and client_secret are always provided by the base framework and must not be declared in the integration array
		integration: [] as const,
	},
} as const satisfies PluginAuthConfig;

type InstagramEndpoint<K extends keyof InstagramEndpointOutputs> =
	CorsairEndpoint<
		InstagramContext,
		InstagramEndpointInputs[K],
		InstagramEndpointOutputs[K]
	>;

type InstagramWebhook<
	K extends keyof InstagramWebhookOutputs,
	TPayload,
> = CorsairWebhook<InstagramContext, TPayload, InstagramWebhookOutputs[K]>;

export type InstagramWebhooks = {
	messageReceived: InstagramWebhook<'messageReceived', InstagramWebhookPayload>;
	url_verification: InstagramWebhook<
		'url_verification',
		InstagramWebhookUrlVerificationPayload
	>;
	comments: InstagramWebhook<'comments', InstagramWebhookCommentPayload>;
};

export type InstagramBoundWebhooks = BindWebhooks<
	typeof InstagramWebhooksNested
>;

export type InstagramEndpoints = {
	GetInstagramUser: InstagramEndpoint<'GetInstagramUser'>;
	GetInstagramMediaList: InstagramEndpoint<'GetInstagramMediaList'>;
	GetInstagramMedia: InstagramEndpoint<'GetInstagramMedia'>;
	CreateImageContainer: InstagramEndpoint<'CreateImageContainer'>;
	CreateReelContainer: InstagramEndpoint<'CreateReelContainer'>;
	PublishInstagramMedia: InstagramEndpoint<'PublishInstagramMedia'>;
	GetMediaContainerStatus: InstagramEndpoint<'GetMediaContainerStatus'>;
	CreateImageStoryContainer: InstagramEndpoint<'CreateImageStoryContainer'>;
	CreateVideoStoryContainer: InstagramEndpoint<'CreateVideoStoryContainer'>;
	CreateCarouselContainer: InstagramEndpoint<'CreateCarouselContainer'>;
	CreateVideoContainer: InstagramEndpoint<'CreateVideoContainer'>;
	GetMediaInsights: InstagramEndpoint<'GetMediaInsights'>;
	GetAccountInsights: InstagramEndpoint<'GetAccountInsights'>;
	GetInstagramConversations: InstagramEndpoint<'GetInstagramConversations'>;
	GetConversationMessages: InstagramEndpoint<'GetConversationMessages'>;
	GetMessage: InstagramEndpoint<'GetMessage'>;
	SendMessage: InstagramEndpoint<'SendMessage'>;
	GetComments: InstagramEndpoint<'GetComments'>;
	ReplyComments: InstagramEndpoint<'ReplyComments'>;
	SendComments: InstagramEndpoint<'SendComments'>;
	GetCommentsDetails: InstagramEndpoint<'GetCommentsDetails'>;
	UpdateComments: InstagramEndpoint<'UpdateComments'>;
	DeleteComment: InstagramEndpoint<'DeleteComment'>;
	CreateMediaContainer: InstagramEndpoint<'CreateMediaContainer'>;
	CreatePost: InstagramEndpoint<'CreatePost'>;
	DeleteMessengerProfile: InstagramEndpoint<'DeleteMessengerProfile'>;
	GetConversation: InstagramEndpoint<'GetConversation'>;
	GetIgCommentReplies: InstagramEndpoint<'GetIgCommentReplies'>;
	GetIgMediaChildren: InstagramEndpoint<'GetIgMediaChildren'>;
	GetIgMediaComments: InstagramEndpoint<'GetIgMediaComments'>;
	GetIgMediaInsights: InstagramEndpoint<'GetIgMediaInsights'>;
	GetIgUserContentPublishingLimit: InstagramEndpoint<'GetIgUserContentPublishingLimit'>;
	GetIgUserLiveMedia: InstagramEndpoint<'GetIgUserLiveMedia'>;
	GetIgUserMedia: InstagramEndpoint<'GetIgUserMedia'>;
	GetIgUserStories: InstagramEndpoint<'GetIgUserStories'>;
	GetIgUserTags: InstagramEndpoint<'GetIgUserTags'>;
	GetMessengerProfile: InstagramEndpoint<'GetMessengerProfile'>;
	GetPageConversations: InstagramEndpoint<'GetPageConversations'>;
	GetPostComments: InstagramEndpoint<'GetPostComments'>;
	GetPostInsights: InstagramEndpoint<'GetPostInsights'>;
	GetPostStatus: InstagramEndpoint<'GetPostStatus'>;
	GetUserInfo: InstagramEndpoint<'GetUserInfo'>;
	GetUserInsights: InstagramEndpoint<'GetUserInsights'>;
	GetUserMedia: InstagramEndpoint<'GetUserMedia'>;
	ListAllConversations: InstagramEndpoint<'ListAllConversations'>;
	ListAllMessages: InstagramEndpoint<'ListAllMessages'>;
	MarkSeen: InstagramEndpoint<'MarkSeen'>;
	PostIgCommentReplies: InstagramEndpoint<'PostIgCommentReplies'>;
	PostIgMediaComments: InstagramEndpoint<'PostIgMediaComments'>;
	PostIgUserMedia: InstagramEndpoint<'PostIgUserMedia'>;
	PublishIgUserMedia: InstagramEndpoint<'PublishIgUserMedia'>;
	ReplyToComment: InstagramEndpoint<'ReplyToComment'>;
	ReplyToIgUserMentions: InstagramEndpoint<'ReplyToIgUserMentions'>;
	SendImage: InstagramEndpoint<'SendImage'>;
	SendTextMessage: InstagramEndpoint<'SendTextMessage'>;
	UpdateMessengerProfile: InstagramEndpoint<'UpdateMessengerProfile'>;
};

export const InstagramEndpointsNested = {
	profile: {
		get: ProfileEndpoints.get,
		insights: ProfileEndpoints.insights,
		contentPublishingLimit: ProfileEndpoints.contentPublishingLimit,
		liveMedia: ProfileEndpoints.liveMedia,
		media: ProfileEndpoints.media,
		stories: ProfileEndpoints.stories,
		tags: ProfileEndpoints.tags,
		info: ProfileEndpoints.info,
		userInsights: ProfileEndpoints.userInsights,
		userMedia: ProfileEndpoints.userMedia,
		replyMentions: ProfileEndpoints.replyMentions,
	},

	media: {
		list: MediaEndpoints.list,
		get: MediaEndpoints.get,
		status: MediaEndpoints.status,
		insights: MediaEndpoints.insights,
		createMediaContainer: MediaEndpoints.createMediaContainer,
		children: MediaEndpoints.children,
		comments: MediaEndpoints.comments,
		getMediaInsights: MediaEndpoints.getMediaInsights,
		postIgUserMedia: MediaEndpoints.postIgUserMedia,
	},

	image: {
		post: ImageEndpoints.post,
		story: ImageEndpoints.story,
	},

	reel: {
		post: ReelEndpoints.post,
	},

	video: {
		story: VideoEndpoints.story,
		container: VideoEndpoints.container,
	},

	carousel: {
		post: CarouselEndpoints.post,
	},

	publish: {
		publish_media: PublishEndpoints.publish,
		createPost: PublishEndpoints.createPost,
		publishIgUserMedia: PublishEndpoints.publishIgUserMedia,
	},

	conversations: {
		list: ConversationsEndpoints.list,
		get: ConversationsEndpoints.get,
		getConversation: ConversationsEndpoints.getConversation,
		pageConversations: ConversationsEndpoints.pageConversations,
		listAll: ConversationsEndpoints.listAll,
	},

	messages: {
		get: MessagesEndpoints.get,
		send: MessagesEndpoints.send,
		listAll: MessagesEndpoints.listAll,
		markSeen: MessagesEndpoints.markSeen,
		sendImage: MessagesEndpoints.sendImage,
		sendTextMessage: MessagesEndpoints.sendTextMessage,
	},

	comments: {
		list: CommentsEndpoints.list,
		reply: CommentsEndpoints.reply,
		send: CommentsEndpoints.send,
		get: CommentsEndpoints.get,
		update: CommentsEndpoints.update,
		remove: CommentsEndpoints.remove,
		getReplies: CommentsEndpoints.getReplies,
		postReplies: CommentsEndpoints.postReplies,
		postComments: CommentsEndpoints.postComments,
		replyToComment: CommentsEndpoints.replyToComment,
	},

	messenger: {
		getProfile: MessengerEndpoints.getProfile,
		updateProfile: MessengerEndpoints.updateProfile,
		deleteProfile: MessengerEndpoints.deleteProfile,
	},

	post: {
		comments: PostEndpoints.comments,
		insights: PostEndpoints.insights,
		status: PostEndpoints.status,
	},
} as const;

export type InstagramBoundEndpoints = BindEndpoints<
	typeof InstagramEndpointsNested
>;

export const InstagramEndpointSchemas = {
	'profile.get': {
		input: InstagramEndpointInputSchemas.GetInstagramUser,
		output: InstagramEndpointOutputSchemas.GetInstagramUser,
	},
	'profile.insights': {
		input: InstagramEndpointInputSchemas.GetAccountInsights,
		output: InstagramEndpointOutputSchemas.GetAccountInsights,
	},
	'profile.contentPublishingLimit': {
		input: InstagramEndpointInputSchemas.GetIgUserContentPublishingLimit,
		output: InstagramEndpointOutputSchemas.GetIgUserContentPublishingLimit,
	},
	'profile.liveMedia': {
		input: InstagramEndpointInputSchemas.GetIgUserLiveMedia,
		output: InstagramEndpointOutputSchemas.GetIgUserLiveMedia,
	},
	'profile.media': {
		input: InstagramEndpointInputSchemas.GetIgUserMedia,
		output: InstagramEndpointOutputSchemas.GetIgUserMedia,
	},
	'profile.stories': {
		input: InstagramEndpointInputSchemas.GetIgUserStories,
		output: InstagramEndpointOutputSchemas.GetIgUserStories,
	},
	'profile.tags': {
		input: InstagramEndpointInputSchemas.GetIgUserTags,
		output: InstagramEndpointOutputSchemas.GetIgUserTags,
	},
	'profile.info': {
		input: InstagramEndpointInputSchemas.GetUserInfo,
		output: InstagramEndpointOutputSchemas.GetUserInfo,
	},
	'profile.userInsights': {
		input: InstagramEndpointInputSchemas.GetUserInsights,
		output: InstagramEndpointOutputSchemas.GetUserInsights,
	},
	'profile.userMedia': {
		input: InstagramEndpointInputSchemas.GetUserMedia,
		output: InstagramEndpointOutputSchemas.GetUserMedia,
	},
	'profile.replyMentions': {
		input: InstagramEndpointInputSchemas.ReplyToIgUserMentions,
		output: InstagramEndpointOutputSchemas.ReplyToIgUserMentions,
	},
	'media.list': {
		input: InstagramEndpointInputSchemas.GetInstagramMediaList,
		output: InstagramEndpointOutputSchemas.GetInstagramMediaList,
	},
	'media.get': {
		input: InstagramEndpointInputSchemas.GetInstagramMedia,
		output: InstagramEndpointOutputSchemas.GetInstagramMedia,
	},
	'media.status': {
		input: InstagramEndpointInputSchemas.GetMediaContainerStatus,
		output: InstagramEndpointOutputSchemas.GetMediaContainerStatus,
	},
	'media.insights': {
		input: InstagramEndpointInputSchemas.GetMediaInsights,
		output: InstagramEndpointOutputSchemas.GetMediaInsights,
	},
	'media.createMediaContainer': {
		input: InstagramEndpointInputSchemas.CreateMediaContainer,
		output: InstagramEndpointOutputSchemas.CreateMediaContainer,
	},
	'media.children': {
		input: InstagramEndpointInputSchemas.GetIgMediaChildren,
		output: InstagramEndpointOutputSchemas.GetIgMediaChildren,
	},
	'media.comments': {
		input: InstagramEndpointInputSchemas.GetIgMediaComments,
		output: InstagramEndpointOutputSchemas.GetIgMediaComments,
	},
	'media.getMediaInsights': {
		input: InstagramEndpointInputSchemas.GetIgMediaInsights,
		output: InstagramEndpointOutputSchemas.GetIgMediaInsights,
	},
	'media.postIgUserMedia': {
		input: InstagramEndpointInputSchemas.PostIgUserMedia,
		output: InstagramEndpointOutputSchemas.PostIgUserMedia,
	},
	'image.post': {
		input: InstagramEndpointInputSchemas.CreateImageContainer,
		output: InstagramEndpointOutputSchemas.CreateImageContainer,
	},
	'image.story': {
		input: InstagramEndpointInputSchemas.CreateImageStoryContainer,
		output: InstagramEndpointOutputSchemas.CreateImageStoryContainer,
	},
	'reel.post': {
		input: InstagramEndpointInputSchemas.CreateReelContainer,
		output: InstagramEndpointOutputSchemas.CreateReelContainer,
	},
	'video.story': {
		input: InstagramEndpointInputSchemas.CreateVideoStoryContainer,
		output: InstagramEndpointOutputSchemas.CreateVideoStoryContainer,
	},
	'video.container': {
		input: InstagramEndpointInputSchemas.CreateVideoContainer,
		output: InstagramEndpointOutputSchemas.CreateVideoContainer,
	},
	'carousel.post': {
		input: InstagramEndpointInputSchemas.CreateCarouselContainer,
		output: InstagramEndpointOutputSchemas.CreateCarouselContainer,
	},
	'publish.publish_media': {
		input: InstagramEndpointInputSchemas.PublishInstagramMedia,
		output: InstagramEndpointOutputSchemas.PublishInstagramMedia,
	},
	'publish.createPost': {
		input: InstagramEndpointInputSchemas.CreatePost,
		output: InstagramEndpointOutputSchemas.CreatePost,
	},
	'publish.publishIgUserMedia': {
		input: InstagramEndpointInputSchemas.PublishIgUserMedia,
		output: InstagramEndpointOutputSchemas.PublishIgUserMedia,
	},
	'conversations.list': {
		input: InstagramEndpointInputSchemas.GetInstagramConversations,
		output: InstagramEndpointOutputSchemas.GetInstagramConversations,
	},
	'conversations.get': {
		input: InstagramEndpointInputSchemas.GetConversationMessages,
		output: InstagramEndpointOutputSchemas.GetConversationMessages,
	},
	'conversations.getConversation': {
		input: InstagramEndpointInputSchemas.GetConversation,
		output: InstagramEndpointOutputSchemas.GetConversation,
	},
	'conversations.pageConversations': {
		input: InstagramEndpointInputSchemas.GetPageConversations,
		output: InstagramEndpointOutputSchemas.GetPageConversations,
	},
	'conversations.listAll': {
		input: InstagramEndpointInputSchemas.ListAllConversations,
		output: InstagramEndpointOutputSchemas.ListAllConversations,
	},
	'messages.get': {
		input: InstagramEndpointInputSchemas.GetMessage,
		output: InstagramEndpointOutputSchemas.GetMessage,
	},
	'messages.send': {
		input: InstagramEndpointInputSchemas.SendMessage,
		output: InstagramEndpointOutputSchemas.SendMessage,
	},
	'messages.listAll': {
		input: InstagramEndpointInputSchemas.ListAllMessages,
		output: InstagramEndpointOutputSchemas.ListAllMessages,
	},
	'messages.markSeen': {
		input: InstagramEndpointInputSchemas.MarkSeen,
		output: InstagramEndpointOutputSchemas.MarkSeen,
	},
	'messages.sendImage': {
		input: InstagramEndpointInputSchemas.SendImage,
		output: InstagramEndpointOutputSchemas.SendImage,
	},
	'messages.sendTextMessage': {
		input: InstagramEndpointInputSchemas.SendTextMessage,
		output: InstagramEndpointOutputSchemas.SendTextMessage,
	},
	'comments.list': {
		input: InstagramEndpointInputSchemas.GetComments,
		output: InstagramEndpointOutputSchemas.GetComments,
	},
	'comments.reply': {
		input: InstagramEndpointInputSchemas.ReplyComments,
		output: InstagramEndpointOutputSchemas.ReplyComments,
	},
	'comments.send': {
		input: InstagramEndpointInputSchemas.SendComments,
		output: InstagramEndpointOutputSchemas.SendComments,
	},
	'comments.get': {
		input: InstagramEndpointInputSchemas.GetCommentsDetails,
		output: InstagramEndpointOutputSchemas.GetCommentsDetails,
	},
	'comments.update': {
		input: InstagramEndpointInputSchemas.UpdateComments,
		output: InstagramEndpointOutputSchemas.UpdateComments,
	},
	'comments.remove': {
		input: InstagramEndpointInputSchemas.DeleteComment,
		output: InstagramEndpointOutputSchemas.DeleteComment,
	},
	'comments.getReplies': {
		input: InstagramEndpointInputSchemas.GetIgCommentReplies,
		output: InstagramEndpointOutputSchemas.GetIgCommentReplies,
	},
	'comments.postReplies': {
		input: InstagramEndpointInputSchemas.PostIgCommentReplies,
		output: InstagramEndpointOutputSchemas.PostIgCommentReplies,
	},
	'comments.postComments': {
		input: InstagramEndpointInputSchemas.PostIgMediaComments,
		output: InstagramEndpointOutputSchemas.PostIgMediaComments,
	},
	'comments.replyToComment': {
		input: InstagramEndpointInputSchemas.ReplyToComment,
		output: InstagramEndpointOutputSchemas.ReplyToComment,
	},
	'messenger.getProfile': {
		input: InstagramEndpointInputSchemas.GetMessengerProfile,
		output: InstagramEndpointOutputSchemas.GetMessengerProfile,
	},
	'messenger.updateProfile': {
		input: InstagramEndpointInputSchemas.UpdateMessengerProfile,
		output: InstagramEndpointOutputSchemas.UpdateMessengerProfile,
	},
	'messenger.deleteProfile': {
		input: InstagramEndpointInputSchemas.DeleteMessengerProfile,
		output: InstagramEndpointOutputSchemas.DeleteMessengerProfile,
	},
	'post.comments': {
		input: InstagramEndpointInputSchemas.GetPostComments,
		output: InstagramEndpointOutputSchemas.GetPostComments,
	},
	'post.insights': {
		input: InstagramEndpointInputSchemas.GetPostInsights,
		output: InstagramEndpointOutputSchemas.GetPostInsights,
	},
	'post.status': {
		input: InstagramEndpointInputSchemas.GetPostStatus,
		output: InstagramEndpointOutputSchemas.GetPostStatus,
	},
};

const instagramEndpointMeta = {
	'profile.get': {
		riskLevel: 'read',
		description: 'read the user instagram profile.',
	},
	'profile.insights': {
		riskLevel: 'read',
		description: 'get insights for the instagram business account.',
	},
	'profile.contentPublishingLimit': {
		riskLevel: 'read',
		description: 'get user content publishing limit.',
	},
	'profile.liveMedia': {
		riskLevel: 'read',
		description: 'get user live media.',
	},
	'profile.media': { riskLevel: 'read', description: 'get user media.' },
	'profile.stories': { riskLevel: 'read', description: 'get user stories.' },
	'profile.tags': { riskLevel: 'read', description: 'get user tags.' },
	'profile.info': { riskLevel: 'read', description: 'get user info.' },
	'profile.userInsights': {
		riskLevel: 'read',
		description: 'get user insights.',
	},
	'profile.userMedia': {
		riskLevel: 'read',
		description: 'get user media (deprecated).',
	},
	'profile.replyMentions': {
		riskLevel: 'write',
		description: 'reply to mentions.',
	},

	'media.list': {
		riskLevel: 'read',
		description: 'list media objects on the instagram account.',
	},
	'media.get': {
		riskLevel: 'read',
		description: 'get details about a specific media object.',
	},
	'media.status': {
		riskLevel: 'read',
		description: 'get the status of a media container.',
	},
	'media.insights': {
		riskLevel: 'read',
		description: 'get insights for a specific media object.',
	},
	'media.createMediaContainer': {
		riskLevel: 'write',
		description: 'create a media container.',
	},
	'media.children': { riskLevel: 'read', description: 'get children media.' },
	'media.comments': { riskLevel: 'read', description: 'get comments.' },
	'media.getMediaInsights': {
		riskLevel: 'read',
		description: 'get media insights.',
	},
	'media.postIgUserMedia': {
		riskLevel: 'write',
		description: 'create post media container.',
	},

	'image.post': {
		riskLevel: 'write',
		description: 'create an image container for publishing on instagram.',
	},
	'image.story': {
		riskLevel: 'write',
		description: 'create an image story container for publishing on instagram.',
	},

	'reel.post': {
		riskLevel: 'write',
		description: 'create a reel container for publishing on instagram.',
	},

	'video.story': {
		riskLevel: 'write',
		description: 'create a video story container for publishing on instagram.',
	},
	'video.container': {
		riskLevel: 'write',
		description:
			'create a video carousel container for publishing on instagram.',
	},

	'carousel.post': {
		riskLevel: 'write',
		description: 'create a carousel container for publishing on instagram.',
	},

	'publish.publish_media': {
		riskLevel: 'write',
		description: 'publish media on instagram.',
	},
	'publish.createPost': { riskLevel: 'write', description: 'create a post.' },
	'publish.publishIgUserMedia': {
		riskLevel: 'write',
		description: 'publish user media.',
	},

	'conversations.list': {
		riskLevel: 'read',
		description: 'list conversations on instagram messaging.',
	},
	'conversations.get': {
		riskLevel: 'read',
		description: 'get messages in a conversation on instagram messaging.',
	},
	'conversations.getConversation': {
		riskLevel: 'read',
		description: 'get conversation details.',
	},
	'conversations.pageConversations': {
		riskLevel: 'read',
		description: 'get page conversations.',
	},
	'conversations.listAll': {
		riskLevel: 'read',
		description: 'list all conversations.',
	},

	'messages.get': {
		riskLevel: 'read',
		description: 'get details about a specific message on instagram messaging.',
	},
	'messages.send': {
		riskLevel: 'write',
		description: 'send a message in instagram messaging.',
	},
	'messages.listAll': { riskLevel: 'read', description: 'list all messages.' },
	'messages.markSeen': {
		riskLevel: 'write',
		description: 'mark messages as seen.',
	},
	'messages.sendImage': {
		riskLevel: 'write',
		description: 'send image via DM.',
	},
	'messages.sendTextMessage': {
		riskLevel: 'write',
		description: 'send text message via DM.',
	},

	'comments.list': {
		riskLevel: 'read',
		description: 'list comments on an instagram media object.',
	},
	'comments.reply': {
		riskLevel: 'write',
		description: 'reply to a comment on an instagram media object.',
	},
	'comments.send': {
		riskLevel: 'write',
		description: 'send a comment on an instagram media object.',
	},
	'comments.get': {
		riskLevel: 'read',
		description:
			'get details about a specific comment on an instagram media object.',
	},
	'comments.update': {
		riskLevel: 'write',
		description: 'update a comment on an instagram media object.',
	},
	'comments.remove': {
		riskLevel: 'write',
		description: 'delete a comment on an instagram media object.',
	},
	'comments.getReplies': {
		riskLevel: 'read',
		description: 'get comment replies.',
	},
	'comments.postReplies': {
		riskLevel: 'write',
		description: 'post a comment reply.',
	},
	'comments.postComments': {
		riskLevel: 'write',
		description: 'post a media comment.',
	},
	'comments.replyToComment': {
		riskLevel: 'write',
		description: 'reply to comment (deprecated).',
	},

	'messenger.getProfile': {
		riskLevel: 'read',
		description: 'get messenger profile.',
	},
	'messenger.updateProfile': {
		riskLevel: 'write',
		description: 'update messenger profile.',
	},
	'messenger.deleteProfile': {
		riskLevel: 'write',
		description: 'delete messenger profile.',
	},

	'post.comments': {
		riskLevel: 'read',
		description: 'get post comments (deprecated).',
	},
	'post.insights': {
		riskLevel: 'read',
		description: 'get post insights (deprecated).',
	},
	'post.status': {
		riskLevel: 'read',
		description: 'get post status (deprecated).',
	},
} satisfies RequiredPluginEndpointMeta<typeof InstagramEndpointsNested>;

const InstagramWebhookSchemas = {
	messageReceived: {
		description: 'A Instagram message was received, sent or seen',
		payload: InstagramWebhookPayloadSchema,
		response: InstagramMessageReceivedEventSchema,
	},

	url_verification: {
		description:
			'Represents a webhook URL verification challenge from Meta. Used to verify that the webhook endpoint is owned and controlled by the application.',
		payload: InstagramWebhookUrlVerificationSchema,
		response: InstagramUrlVerificationEventSchema,
	},

	comments: {
		description:
			'Represents an Instagram comment webhook event containing information about a comment, including the commenter, media, comment text, and related metadata.',
		payload: InstagramCommentsWebhookSchema,
		response: InstagramCommentEventSchema,
	},
} as const;

export type InstagramPluginOptions = {
	authType?: PickAuth<'oauth_2'>;
	key?: string;
	credentials?: InstagramCredentials;
	/** Verify token configured in the Meta app dashboard for webhook URL verification. */
	webhookVerifyToken?: string;
	hooks?: InternalInstagramPlugin['hooks'];
	webhookHooks?: InternalInstagramPlugin['webhookHooks'];
	permissions?: PluginPermissionsConfig<typeof InstagramEndpointsNested>;
};

export type InstagramContext = CorsairPluginContext<
	typeof InstagramSchema,
	InstagramPluginOptions,
	undefined,
	typeof instagramAuthConfig
>;

export type InstagramKeyBuilderContext = KeyBuilderContext<
	InstagramPluginOptions,
	typeof instagramAuthConfig
>;

const defaultAuthType = 'oauth_2' as const;

export type BaseInstagramPlugin<T extends InstagramPluginOptions> =
	CorsairPlugin<
		'instagram',
		typeof InstagramSchema,
		typeof InstagramEndpointsNested,
		typeof InstagramWebhooksNested,
		T,
		typeof defaultAuthType,
		typeof instagramAuthConfig
	>;

/**
 * We have to type the internal plugin separately from the external plugin
 * Because the internal plugin has to provide options for all possible auth methods
 * The external plugin has to provide options for the auth method the user has selected
 */

export type InternalInstagramPlugin =
	BaseInstagramPlugin<InstagramPluginOptions>;

export type ExternalInstagramPlugin<T extends InstagramPluginOptions> =
	BaseInstagramPlugin<T>;

export function instagram<const T extends InstagramPluginOptions>(
	incomingOptions: InstagramPluginOptions & T = {} as InstagramPluginOptions &
		T,
): ExternalInstagramPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'instagram',

		schema: InstagramSchema,

		options,

		authConfig: instagramAuthConfig,

		oauthConfig: {
			providerName: 'Facebook',
			authUrl: 'https://www.facebook.com/v25.0/dialog/oauth',
			tokenUrl: 'https://graph.facebook.com/v25.0/oauth/access_token',
			scopes: [
				'pages_show_list',
				'pages_manage_metadata',
				'pages_messaging',
				'pages_read_engagement',
				'instagram_basic',
				'instagram_manage_comments',
				'instagram_manage_messages',
				'instagram_content_publish',
				'instagram_manage_insights',
			],
		},

		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: InstagramEndpointsNested,
		webhooks: InstagramWebhooksNested,
		endpointSchemas: InstagramEndpointSchemas,
		webhookSchemas: InstagramWebhookSchemas,
		endpointMeta: instagramEndpointMeta,
		keyBuilder: async (ctx: InstagramKeyBuilderContext) => {
			if (options.key) {
				return options.key;
			}

			if (ctx.authType !== 'oauth_2') {
				throw new AuthMissingError('instagram', 'oauth_2');
			}

			const creds = options.credentials;

			const [storedAccessToken, expiresAt, integrationCredentials] =
				await Promise.all([
					ctx.keys.get_access_token(),
					ctx.keys.get_expires_at(),
					ctx.keys.get_integration_credentials(),
				]);

			const accessToken = storedAccessToken ?? creds?.accessToken ?? null;

			const clientId =
				integrationCredentials.client_id ?? creds?.clientId ?? null;
			const clientSecret =
				integrationCredentials.client_secret ?? creds?.clientSecret ?? null;

			if (!accessToken) {
				throw new AuthMissingError('instagram', 'oauth_2');
			}

			if (!clientId || !clientSecret) {
				throw new Error(
					'[auth-missing:instagram:client_credentials]: Instagram client credentials are missing',
				);
			}

			let result: Awaited<ReturnType<typeof getValidFacebookAccessToken>>;
			try {
				result = await getValidFacebookAccessToken({
					accessToken,
					expiresAt: expiresAt ? Number(expiresAt) : null,
					appId: clientId,
					appSecret: clientSecret,
				});
			} catch (error) {
				throw new Error(
					`[corsair:instagram] Failed to obtain valid access token: ${error instanceof Error ? error.message : String(error)}`,
				);
			}

			if (result.refreshed) {
				try {
					await ctx.keys.set_access_token(result.accessToken);
					await ctx.keys.set_expires_at(String(result.expiresAt));
				} catch (error) {
					throw new Error(
						`[corsair:instagram] Token was refreshed but failed to persist new credentials: ${error instanceof Error ? error.message : String(error)}`,
					);
				}
			}

			attachInstagramRefreshAuth(ctx, async () => {
				const currentToken =
					(await ctx.keys.get_access_token()) ?? creds?.accessToken ?? null;
				if (!currentToken) {
					throw new AuthMissingError('instagram', 'oauth_2');
				}

				const freshResult = await getValidFacebookAccessToken({
					accessToken: currentToken,
					expiresAt: null,
					appId: clientId,
					appSecret: clientSecret,
					forceRefresh: true,
				});
				await ctx.keys.set_access_token(freshResult.accessToken);
				await ctx.keys.set_expires_at(String(freshResult.expiresAt));
				return freshResult.accessToken;
			});

			return result.accessToken;
		},
	} satisfies InternalInstagramPlugin;
}
