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
	createDraft,
	createMediaUpload,
	createPost,
	createWebhook,
	createWorkflow,
	deleteWebhook,
	deleteWorkflow,
	getAnalytics,
	getDraft,
	getMedia,
	getPost,
	getPostAnalytics,
	getWebhook,
	getWorkflow,
	listAccounts,
	listDrafts,
	listPosts,
	listWebhooks,
	listWorkflows,
	publishPost,
	retryPostTarget,
	updateDraft,
	updatePost,
	updateWorkflow,
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
	updatePost: PostOnceEndpoint<'updatePost'>;
	publishPost: PostOnceEndpoint<'publishPost'>;
	retryPostTarget: PostOnceEndpoint<'retryPostTarget'>;
	getPostAnalytics: PostOnceEndpoint<'getPostAnalytics'>;
	getAnalytics: PostOnceEndpoint<'getAnalytics'>;
	listDrafts: PostOnceEndpoint<'listDrafts'>;
	createDraft: PostOnceEndpoint<'createDraft'>;
	getDraft: PostOnceEndpoint<'getDraft'>;
	updateDraft: PostOnceEndpoint<'updateDraft'>;
	createMediaUpload: PostOnceEndpoint<'createMediaUpload'>;
	getMedia: PostOnceEndpoint<'getMedia'>;
	listWorkflows: PostOnceEndpoint<'listWorkflows'>;
	getWorkflow: PostOnceEndpoint<'getWorkflow'>;
	createWorkflow: PostOnceEndpoint<'createWorkflow'>;
	updateWorkflow: PostOnceEndpoint<'updateWorkflow'>;
	deleteWorkflow: PostOnceEndpoint<'deleteWorkflow'>;
	listWebhooks: PostOnceEndpoint<'listWebhooks'>;
	getWebhook: PostOnceEndpoint<'getWebhook'>;
	createWebhook: PostOnceEndpoint<'createWebhook'>;
	deleteWebhook: PostOnceEndpoint<'deleteWebhook'>;
};

/**
 * PostOnce offers signed post.published / post.failed webhooks, but they are
 * not handled by this plugin yet (0 triggers); webhooks.create registers them.
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
		update: updatePost,
		publish: publishPost,
		retryTarget: retryPostTarget,
		getAnalytics: getPostAnalytics,
	},
	analytics: {
		get: getAnalytics,
	},
	drafts: {
		list: listDrafts,
		create: createDraft,
		get: getDraft,
		update: updateDraft,
	},
	media: {
		createUpload: createMediaUpload,
		get: getMedia,
	},
	workflows: {
		list: listWorkflows,
		get: getWorkflow,
		create: createWorkflow,
		update: updateWorkflow,
		delete: deleteWorkflow,
	},
	webhooks: {
		list: listWebhooks,
		get: getWebhook,
		create: createWebhook,
		delete: deleteWebhook,
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
	'posts.update': {
		input: PostOnceEndpointInputSchemas.updatePost,
		output: PostOnceEndpointOutputSchemas.updatePost,
	},
	'posts.publish': {
		input: PostOnceEndpointInputSchemas.publishPost,
		output: PostOnceEndpointOutputSchemas.publishPost,
	},
	'posts.retryTarget': {
		input: PostOnceEndpointInputSchemas.retryPostTarget,
		output: PostOnceEndpointOutputSchemas.retryPostTarget,
	},
	'posts.getAnalytics': {
		input: PostOnceEndpointInputSchemas.getPostAnalytics,
		output: PostOnceEndpointOutputSchemas.getPostAnalytics,
	},
	'analytics.get': {
		input: PostOnceEndpointInputSchemas.getAnalytics,
		output: PostOnceEndpointOutputSchemas.getAnalytics,
	},
	'drafts.list': {
		input: PostOnceEndpointInputSchemas.listDrafts,
		output: PostOnceEndpointOutputSchemas.listDrafts,
	},
	'drafts.create': {
		input: PostOnceEndpointInputSchemas.createDraft,
		output: PostOnceEndpointOutputSchemas.createDraft,
	},
	'drafts.get': {
		input: PostOnceEndpointInputSchemas.getDraft,
		output: PostOnceEndpointOutputSchemas.getDraft,
	},
	'drafts.update': {
		input: PostOnceEndpointInputSchemas.updateDraft,
		output: PostOnceEndpointOutputSchemas.updateDraft,
	},
	'media.createUpload': {
		input: PostOnceEndpointInputSchemas.createMediaUpload,
		output: PostOnceEndpointOutputSchemas.createMediaUpload,
	},
	'media.get': {
		input: PostOnceEndpointInputSchemas.getMedia,
		output: PostOnceEndpointOutputSchemas.getMedia,
	},
	'workflows.list': {
		input: PostOnceEndpointInputSchemas.listWorkflows,
		output: PostOnceEndpointOutputSchemas.listWorkflows,
	},
	'workflows.get': {
		input: PostOnceEndpointInputSchemas.getWorkflow,
		output: PostOnceEndpointOutputSchemas.getWorkflow,
	},
	'workflows.create': {
		input: PostOnceEndpointInputSchemas.createWorkflow,
		output: PostOnceEndpointOutputSchemas.createWorkflow,
	},
	'workflows.update': {
		input: PostOnceEndpointInputSchemas.updateWorkflow,
		output: PostOnceEndpointOutputSchemas.updateWorkflow,
	},
	'workflows.delete': {
		input: PostOnceEndpointInputSchemas.deleteWorkflow,
		output: PostOnceEndpointOutputSchemas.deleteWorkflow,
	},
	'webhooks.list': {
		input: PostOnceEndpointInputSchemas.listWebhooks,
		output: PostOnceEndpointOutputSchemas.listWebhooks,
	},
	'webhooks.get': {
		input: PostOnceEndpointInputSchemas.getWebhook,
		output: PostOnceEndpointOutputSchemas.getWebhook,
	},
	'webhooks.create': {
		input: PostOnceEndpointInputSchemas.createWebhook,
		output: PostOnceEndpointOutputSchemas.createWebhook,
	},
	'webhooks.delete': {
		input: PostOnceEndpointInputSchemas.deleteWebhook,
		output: PostOnceEndpointOutputSchemas.deleteWebhook,
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
	'posts.update': {
		riskLevel: 'write',
		description:
			'Change a scheduled post before it runs: text, accounts, media or publish time. Only the fields sent change.',
	},
	'posts.publish': {
		riskLevel: 'destructive',
		description:
			'Publish a scheduled post right now. It goes live on every target and cannot be recalled.',
	},
	'posts.retryTarget': {
		riskLevel: 'destructive',
		description:
			"Retry one failed destination of a post (targetId from the post's targets). Published destinations are not posted again.",
	},
	'posts.getAnalytics': {
		riskLevel: 'read',
		description:
			'Views, likes, comments, shares and saves for each published copy of one post (TikTok, Instagram, YouTube and Facebook). Cached for up to an hour.',
	},
	'analytics.get': {
		riskLevel: 'read',
		description:
			"Per-account and per-post views, likes, comments, shares and saves over the last 7, 30 or 90 days, including posts made outside PostOnce, with each post compared to its account's median views.",
	},
	'drafts.list': {
		riskLevel: 'read',
		description:
			'List unscheduled drafts, newest first. Page with after = meta.next_after and after_id = meta.next_after_id.',
	},
	'drafts.create': {
		riskLevel: 'write',
		description:
			'Save text, media and intended accounts as a draft without publishing or scheduling it.',
	},
	'drafts.get': {
		riskLevel: 'read',
		description: 'Get one draft.',
	},
	'drafts.update': {
		riskLevel: 'write',
		description:
			"Edit, archive, restore or mark a draft ready. Pass the draft's current updated_at as expected_updated_at; a stale value gets a 409.",
	},
	'media.createUpload': {
		riskLevel: 'write',
		description:
			'Get a signed URL to upload an image or video to, and a media_id. After the file is PUT to the URL, media.get gives the public URL that posts and drafts accept.',
	},
	'media.get': {
		riskLevel: 'read',
		description: "Turn a media_id into the uploaded file's public URL.",
	},
	'workflows.list': {
		riskLevel: 'read',
		description:
			'List cross-posting workflows: each copies new posts from a source account to target accounts.',
	},
	'workflows.get': {
		riskLevel: 'read',
		description: 'Get one cross-posting workflow.',
	},
	'workflows.create': {
		riskLevel: 'destructive',
		description:
			'Create a cross-posting workflow. While active, PostOnce publishes every new post from the source account to the target accounts automatically.',
	},
	'workflows.update': {
		riskLevel: 'destructive',
		description:
			'Change a cross-posting workflow: name, accounts, filters or is_active. Turning it on or adding targets makes PostOnce publish future posts to them automatically.',
	},
	'workflows.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a cross-posting workflow and its queued items.',
	},
	'webhooks.list': {
		riskLevel: 'read',
		description:
			'List registered webhook endpoints (signing secrets are not returned).',
	},
	'webhooks.get': {
		riskLevel: 'read',
		description: 'Get one registered webhook endpoint.',
	},
	'webhooks.create': {
		riskLevel: 'write',
		description:
			'Register an HTTPS endpoint for signed post.published, post.partially_published and post.failed events (up to 5). The reply is the only time the signing secret is shown.',
	},
	'webhooks.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a webhook endpoint and its delivery log.',
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
