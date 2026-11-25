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
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	completeMedia,
	createMediaUpload,
	createPost,
	createWebhook,
	deleteMedia,
	deletePost,
	deleteWebhook,
	getContext,
	getPost,
	listAccounts,
	listPosts,
	listWebhooks,
	updatePost,
	updateWebhook,
} from './endpoints/handlers';
import type {
	PubloraEndpointInputs,
	PubloraEndpointOutputs,
} from './endpoints/types';
import {
	PubloraEndpointInputSchemas,
	PubloraEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { PubloraSchema } from './schema';
import { PostWebhooks } from './webhooks';
import type {
	PostDemotedEvent,
	PostFailedEvent,
	PostPublishedEvent,
	PostScheduledEvent,
	PubloraWebhookOutputs,
} from './webhooks/types';
import {
	isPubloraDelivery,
	PostDemotedEventSchema,
	PostFailedEventSchema,
	PostPublishedEventSchema,
	PostScheduledEventSchema,
} from './webhooks/types';

export type PubloraPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** Publora API key, sent as `x-publora-key`. */
	key?: string;
	/** Signing secret returned by `webhooks.create`, used to verify deliveries. */
	webhookSecret?: string;
	hooks?: InternalPubloraPlugin['hooks'];
	webhookHooks?: InternalPubloraPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof publoraEndpointsNested>;
};

export type PubloraContext = CorsairPluginContext<
	typeof PubloraSchema,
	PubloraPluginOptions
>;

export type PubloraKeyBuilderContext = KeyBuilderContext<PubloraPluginOptions>;

export type PubloraBoundEndpoints = BindEndpoints<
	typeof publoraEndpointsNested
>;

type PubloraEndpoint<K extends keyof PubloraEndpointOutputs> = CorsairEndpoint<
	PubloraContext,
	PubloraEndpointInputs[K],
	PubloraEndpointOutputs[K]
>;

export type PubloraEndpoints = {
	listAccounts: PubloraEndpoint<'listAccounts'>;
	getContext: PubloraEndpoint<'getContext'>;
	createPost: PubloraEndpoint<'createPost'>;
	getPost: PubloraEndpoint<'getPost'>;
	listPosts: PubloraEndpoint<'listPosts'>;
	updatePost: PubloraEndpoint<'updatePost'>;
	deletePost: PubloraEndpoint<'deletePost'>;
	createMediaUpload: PubloraEndpoint<'createMediaUpload'>;
	completeMedia: PubloraEndpoint<'completeMedia'>;
	deleteMedia: PubloraEndpoint<'deleteMedia'>;
	listWebhooks: PubloraEndpoint<'listWebhooks'>;
	createWebhook: PubloraEndpoint<'createWebhook'>;
	updateWebhook: PubloraEndpoint<'updateWebhook'>;
	deleteWebhook: PubloraEndpoint<'deleteWebhook'>;
};

type PubloraWebhook<
	K extends keyof PubloraWebhookOutputs,
	TEvent,
> = CorsairWebhook<PubloraContext, TEvent, PubloraWebhookOutputs[K]>;

export type PubloraWebhooks = {
	published: PubloraWebhook<'published', PostPublishedEvent>;
	failed: PubloraWebhook<'failed', PostFailedEvent>;
	scheduled: PubloraWebhook<'scheduled', PostScheduledEvent>;
	demoted: PubloraWebhook<'demoted', PostDemotedEvent>;
};

export type PubloraBoundWebhooks = BindWebhooks<PubloraWebhooks>;

const publoraEndpointsNested = {
	accounts: {
		list: listAccounts,
		getContext,
	},
	posts: {
		create: createPost,
		get: getPost,
		list: listPosts,
		update: updatePost,
		delete: deletePost,
	},
	media: {
		createUpload: createMediaUpload,
		complete: completeMedia,
		delete: deleteMedia,
	},
	webhooks: {
		list: listWebhooks,
		create: createWebhook,
		update: updateWebhook,
		delete: deleteWebhook,
	},
} as const;

const publoraWebhooksNested = {
	posts: {
		published: PostWebhooks.published,
		failed: PostWebhooks.failed,
		scheduled: PostWebhooks.scheduled,
		demoted: PostWebhooks.demoted,
	},
} as const;

export const publoraEndpointSchemas = {
	'accounts.list': {
		input: PubloraEndpointInputSchemas.listAccounts,
		output: PubloraEndpointOutputSchemas.listAccounts,
	},
	'accounts.getContext': {
		input: PubloraEndpointInputSchemas.getContext,
		output: PubloraEndpointOutputSchemas.getContext,
	},
	'posts.create': {
		input: PubloraEndpointInputSchemas.createPost,
		output: PubloraEndpointOutputSchemas.createPost,
	},
	'posts.get': {
		input: PubloraEndpointInputSchemas.getPost,
		output: PubloraEndpointOutputSchemas.getPost,
	},
	'posts.list': {
		input: PubloraEndpointInputSchemas.listPosts,
		output: PubloraEndpointOutputSchemas.listPosts,
	},
	'posts.update': {
		input: PubloraEndpointInputSchemas.updatePost,
		output: PubloraEndpointOutputSchemas.updatePost,
	},
	'posts.delete': {
		input: PubloraEndpointInputSchemas.deletePost,
		output: PubloraEndpointOutputSchemas.deletePost,
	},
	'media.createUpload': {
		input: PubloraEndpointInputSchemas.createMediaUpload,
		output: PubloraEndpointOutputSchemas.createMediaUpload,
	},
	'media.complete': {
		input: PubloraEndpointInputSchemas.completeMedia,
		output: PubloraEndpointOutputSchemas.completeMedia,
	},
	'media.delete': {
		input: PubloraEndpointInputSchemas.deleteMedia,
		output: PubloraEndpointOutputSchemas.deleteMedia,
	},
	'webhooks.list': {
		input: PubloraEndpointInputSchemas.listWebhooks,
		output: PubloraEndpointOutputSchemas.listWebhooks,
	},
	'webhooks.create': {
		input: PubloraEndpointInputSchemas.createWebhook,
		output: PubloraEndpointOutputSchemas.createWebhook,
	},
	'webhooks.update': {
		input: PubloraEndpointInputSchemas.updateWebhook,
		output: PubloraEndpointOutputSchemas.updateWebhook,
	},
	'webhooks.delete': {
		input: PubloraEndpointInputSchemas.deleteWebhook,
		output: PubloraEndpointOutputSchemas.deleteWebhook,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof publoraEndpointsNested
>;

export const publoraWebhookSchemas = {
	'posts.published': {
		description: 'A post went live on one network (one event per network copy)',
		payload: PostPublishedEventSchema,
		response: PostPublishedEventSchema,
	},
	'posts.failed': {
		description: 'A post could not be published on one network',
		payload: PostFailedEventSchema,
		response: PostFailedEventSchema,
	},
	'posts.scheduled': {
		description: 'A post was given a publish time',
		payload: PostScheduledEventSchema,
		response: PostScheduledEventSchema,
	},
	'posts.demoted': {
		description: 'A scheduled post went back to draft',
		payload: PostDemotedEventSchema,
		response: PostDemotedEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof publoraWebhooksNested>;

export const publoraEndpointMeta = {
	'accounts.list': {
		riskLevel: 'read',
		description:
			'List connected social accounts (LinkedIn, X, Instagram, Threads, TikTok, YouTube, Facebook Pages, Bluesky, Mastodon, Telegram) with connection and token status. Their platformId values are the targets for posts.create.',
	},
	'accounts.getContext': {
		riskLevel: 'read',
		description:
			"The plan, features, monthly and scheduled post quotas, latest allowed schedule date and allowed networks of the key's account. Check it before a batch of posts.",
	},
	'posts.create': {
		riskLevel: 'destructive',
		description:
			'Create one post for one or more connected accounts, with text, media URLs, per-network settings and first comments. Without scheduledTime or publishNow it is saved as a draft; with scheduledTime it is scheduled; publishNow publishes it right away and it cannot be recalled once live. An idempotencyKey makes a retry return the original post.',
	},
	'posts.get': {
		riskLevel: 'read',
		description:
			"Get one post group with its status, publish time, settings, attached media and each network's delivery state, including the live post id and link once published.",
	},
	'posts.list': {
		riskLevel: 'read',
		description:
			'List posts, newest first, filtered by status, network and scheduled date. Page with page and limit; pagination.hasNextPage says whether another page exists.',
	},
	'posts.update': {
		riskLevel: 'destructive',
		description:
			'Change a draft or scheduled post: text, targets (the list is replaced), publish time, status, settings, first comments or extra media. publishNow publishes it immediately.',
	},
	'posts.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a post group with all its network copies and media. Content already published on a network stays live.',
	},
	'media.createUpload': {
		riskLevel: 'write',
		description:
			'Get a pre-signed URL (valid for an hour) to PUT an image, video or PDF to, attached to a draft or scheduled post group. Use this for files that are not at a public URL.',
	},
	'media.complete': {
		riskLevel: 'write',
		description:
			'Check an uploaded file right away instead of when the post is scheduled. Optional.',
	},
	'media.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Remove an uploaded file from its post group. A scheduled post goes back to draft.',
	},
	'webhooks.list': {
		riskLevel: 'read',
		description:
			'List webhook subscriptions (signing secrets are not returned).',
	},
	'webhooks.create': {
		riskLevel: 'write',
		description:
			'Subscribe an HTTPS URL to post.scheduled, post.published, post.failed and post.demoted events (up to 10 per account; needs a paid plan). The reply is the only time the signing secret is shown.',
	},
	'webhooks.update': {
		riskLevel: 'write',
		description:
			"Change a subscription's name, URL or events, or pause and resume it.",
	},
	'webhooks.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a webhook subscription.',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof publoraEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

// Publora deliveries carry no account id, so webhooks are not routed per
// tenant; each Corsair instance verifies them with its own signing secret.
export const publoraAuthConfig = {
	api_key: { account: [] as const },
} as const satisfies PluginAuthConfig;

export type BasePubloraPlugin<T extends PubloraPluginOptions> = CorsairPlugin<
	'publora',
	typeof PubloraSchema,
	typeof publoraEndpointsNested,
	typeof publoraWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalPubloraPlugin = BasePubloraPlugin<PubloraPluginOptions>;

export type ExternalPubloraPlugin<T extends PubloraPluginOptions> =
	BasePubloraPlugin<T>;

/**
 * Builds the Publora plugin.
 *
 * Auth is an API key (`x-publora-key`), created on the API page of the
 * Publora dashboard. Webhook deliveries are verified with the secret that
 * `webhooks.create` returns.
 */
export function publora<const T extends PubloraPluginOptions>(
	incomingOptions: PubloraPluginOptions & T = {} as PubloraPluginOptions & T,
): ExternalPubloraPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'publora',
		authConfig: publoraAuthConfig,
		schema: PubloraSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: publoraEndpointsNested,
		webhooks: publoraWebhooksNested,
		endpointMeta: publoraEndpointMeta,
		endpointSchemas: publoraEndpointSchemas,
		webhookSchemas: publoraWebhookSchemas,
		pluginWebhookMatcher: isPubloraDelivery,
		errorHandlers: (() => {
			// Core uses the first handler whose matcher accepts the error, and
			// DEFAULT matches everything, so DEFAULT always goes last.
			const { DEFAULT: builtInDefault, ...specificDefaults } = errorHandlers;
			const { DEFAULT: callerDefault, ...callerHandlers } =
				options.errorHandlers || {};
			return {
				...specificDefaults,
				...callerHandlers,
				DEFAULT: callerDefault || builtInDefault,
			};
		})(),
		keyBuilder: async (ctx: PubloraKeyBuilderContext, source) => {
			if (source === 'webhook') {
				if (options.webhookSecret) return options.webhookSecret;
				const secret = await ctx.keys.get_webhook_signature();
				// An empty key makes verification answer 401 instead of throwing.
				return secret ?? '';
			}
			if (source !== 'endpoint') {
				throw new AuthMissingError('publora', 'api_key');
			}
			if (options.key) return options.key;
			const key = await ctx.keys.get_api_key();
			if (!key) throw new AuthMissingError('publora', 'api_key');
			return key;
		},
	} satisfies InternalPubloraPlugin;
}

export type {
	PubloraEndpointInputs,
	PubloraEndpointOutputs,
} from './endpoints/types';
export type {
	PubloraAccount,
	PubloraPlatformPost,
	PubloraPost,
} from './schema/database';
export type {
	PostDemotedEvent,
	PostFailedEvent,
	PostPublishedEvent,
	PostScheduledEvent,
	PubloraWebhookOutputs,
} from './webhooks/types';
