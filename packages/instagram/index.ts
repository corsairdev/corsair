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
};

export const InstagramEndpointsNested = {
	profile: {
		get: ProfileEndpoints.get,
		insights: ProfileEndpoints.insights,
	},

	media: {
		list: MediaEndpoints.list,
		get: MediaEndpoints.get,
		status: MediaEndpoints.status,
		insights: MediaEndpoints.insights,
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
	},

	conversations: {
		list: ConversationsEndpoints.list,
		get: ConversationsEndpoints.get,
	},

	messages: {
		get: MessagesEndpoints.get,
		send: MessagesEndpoints.send,
	},

	comments: {
		list: CommentsEndpoints.list,
		reply: CommentsEndpoints.reply,
		send: CommentsEndpoints.send,
		get: CommentsEndpoints.get,
		update: CommentsEndpoints.update,
		remove: CommentsEndpoints.remove,
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
	'conversations.list': {
		input: InstagramEndpointInputSchemas.GetInstagramConversations,
		output: InstagramEndpointOutputSchemas.GetInstagramConversations,
	},
	'conversations.get': {
		input: InstagramEndpointInputSchemas.GetConversationMessages,
		output: InstagramEndpointOutputSchemas.GetConversationMessages,
	},
	'messages.get': {
		input: InstagramEndpointInputSchemas.GetMessage,
		output: InstagramEndpointOutputSchemas.GetMessage,
	},
	'messages.send': {
		input: InstagramEndpointInputSchemas.SendMessage,
		output: InstagramEndpointOutputSchemas.SendMessage,
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

	'conversations.list': {
		riskLevel: 'read',
		description: 'list conversations on instagram messaging.',
	},

	'conversations.get': {
		riskLevel: 'read',
		description: 'get messages in a conversation on instagram messaging.',
	},

	'messages.get': {
		riskLevel: 'read',
		description: 'get details about a specific message on instagram messaging.',
	},

	'messages.send': {
		riskLevel: 'write',
		description: 'send a message in instagram messaging.',
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
