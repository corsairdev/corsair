import type {
	AuthTypes,
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	cancelPost,
	createPost,
	getPost,
	listAccounts,
	listPosts,
} from './endpoints/handlers';
import type {
	PostOnceEndpointInputs,
	PostOnceEndpointOutputs,
} from './endpoints/types';
import {
	PostOnceEndpointInputSchemas,
	PostOnceEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { PostOnceSchema } from './schema';

export type PostOncePluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** PostOnce API key, sent as `Authorization: Bearer <key>`. */
	key?: string;
	hooks?: InternalPostOncePlugin['hooks'];
	webhookHooks?: InternalPostOncePlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof postonceEndpointsNested>;
};

export type PostOnceContext = CorsairPluginContext<
	typeof PostOnceSchema,
	PostOncePluginOptions
>;

export type PostOnceKeyBuilderContext =
	KeyBuilderContext<PostOncePluginOptions>;

export type PostOnceBoundEndpoints = BindEndpoints<
	typeof postonceEndpointsNested
>;

type PostOnceEndpoint<K extends keyof PostOnceEndpointOutputs> =
	CorsairEndpoint<
		PostOnceContext,
		PostOnceEndpointInputs[K],
		PostOnceEndpointOutputs[K]
	>;

export type PostOnceEndpoints = {
	listAccounts: PostOnceEndpoint<'listAccounts'>;
	createPost: PostOnceEndpoint<'createPost'>;
	getPost: PostOnceEndpoint<'getPost'>;
	listPosts: PostOnceEndpoint<'listPosts'>;
	cancelPost: PostOnceEndpoint<'cancelPost'>;
};

/**
 * PostOnce offers signed post.published / post.failed webhooks, but they are
 * not part of this plugin's five-operation catalog (0 triggers).
 */
export type PostOnceWebhooks = Record<string, never>;

export type PostOnceBoundWebhooks = BindWebhooks<PostOnceWebhooks>;

const postonceEndpointsNested = {
	accounts: {
		list: listAccounts,
	},
	posts: {
		create: createPost,
		get: getPost,
		list: listPosts,
		cancel: cancelPost,
	},
} as const;

const postonceWebhooksNested = {} as const;

export const postonceEndpointSchemas = {
	'accounts.list': {
		input: PostOnceEndpointInputSchemas.listAccounts,
		output: PostOnceEndpointOutputSchemas.listAccounts,
	},
	'posts.create': {
		input: PostOnceEndpointInputSchemas.createPost,
		output: PostOnceEndpointOutputSchemas.createPost,
	},
	'posts.get': {
		input: PostOnceEndpointInputSchemas.getPost,
		output: PostOnceEndpointOutputSchemas.getPost,
	},
	'posts.list': {
		input: PostOnceEndpointInputSchemas.listPosts,
		output: PostOnceEndpointOutputSchemas.listPosts,
	},
	'posts.cancel': {
		input: PostOnceEndpointInputSchemas.cancelPost,
		output: PostOnceEndpointOutputSchemas.cancelPost,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof postonceEndpointsNested
>;

export const postonceWebhookSchemas =
	{} as const satisfies RequiredPluginWebhookSchemas<
		typeof postonceWebhooksNested
	>;

export const postonceEndpointMeta = {
	'accounts.list': {
		riskLevel: 'read',
		description:
			'List connected social accounts (LinkedIn, X, Threads, Bluesky, Facebook Pages, Instagram, TikTok, YouTube, Pinterest) with status, capabilities and media requirements. Their ids are the targets for posts.create.',
	},
	'posts.create': {
		riskLevel: 'destructive',
		description:
			'Create one post for one or more connected accounts, with text and media URLs. Without publish_at it publishes immediately and cannot be recalled once live; with publish_at it is scheduled. An idempotencyKey makes a retry return the original post.',
	},
	'posts.get': {
		riskLevel: 'read',
		description:
			'Get one post with its per-account delivery state: status, platform post URL and any platform error.',
	},
	'posts.list': {
		riskLevel: 'read',
		description:
			"List the profile's posts, newest first, including dashboard and workflow posts. Page with after = meta.next_cursor.",
	},
	'posts.cancel': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Cancel a scheduled or still-pending post. The post record is kept with status cancelled; content already published on a network stays live.',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof postonceEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export type BasePostOncePlugin<T extends PostOncePluginOptions> = CorsairPlugin<
	'postonce',
	typeof PostOnceSchema,
	typeof postonceEndpointsNested,
	typeof postonceWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalPostOncePlugin = BasePostOncePlugin<PostOncePluginOptions>;

export type ExternalPostOncePlugin<T extends PostOncePluginOptions> =
	BasePostOncePlugin<T>;

/**
 * Builds the PostOnce plugin.
 *
 * Auth is an API key (`Authorization: Bearer`), created under Developers in
 * the PostOnce dashboard.
 */
export function postonce<const T extends PostOncePluginOptions>(
	incomingOptions: PostOncePluginOptions & T = {} as PostOncePluginOptions & T,
): ExternalPostOncePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'postonce',
		schema: PostOnceSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: postonceEndpointsNested,
		webhooks: postonceWebhooksNested,
		endpointMeta: postonceEndpointMeta,
		endpointSchemas: postonceEndpointSchemas,
		webhookSchemas: postonceWebhookSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: PostOnceKeyBuilderContext, source) => {
			if (source !== 'endpoint') {
				throw new AuthMissingError('postonce', 'api_key');
			}
			if (options.key) return options.key;
			const key = await ctx.keys.get_api_key();
			if (!key) throw new AuthMissingError('postonce', 'api_key');
			return key;
		},
	} satisfies InternalPostOncePlugin;
}

export type {
	PostOnceEndpointInputs,
	PostOnceEndpointOutputs,
} from './endpoints/types';
export type {
	PostOnceAccount,
	PostOnceMedia,
	PostOncePost,
	PostOncePostTarget,
} from './schema/database';
