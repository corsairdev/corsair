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
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	Comments,
	Drafts,
	Feed,
	Images,
	Pages,
	Posts,
	Publications,
	Series,
	Tags,
	Users,
} from './endpoints';
import type {
	HashnodeEndpointInputs,
	HashnodeEndpointOutputs,
} from './endpoints/types';
import {
	HashnodeEndpointInputSchemas,
	HashnodeEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { HashnodeSchema } from './schema';

export type HashnodePluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalHashnodePlugin['hooks'];
	webhookHooks?: InternalHashnodePlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof hashnodeEndpointsNested>;
};

export type HashnodeContext = CorsairPluginContext<
	typeof HashnodeSchema,
	HashnodePluginOptions
>;
export type HashnodeKeyBuilderContext =
	KeyBuilderContext<HashnodePluginOptions>;

export type HashnodeBoundEndpoints = BindEndpoints<
	typeof hashnodeEndpointsNested
>;

type HashnodeEndpoint<K extends keyof HashnodeEndpointOutputs> =
	CorsairEndpoint<
		HashnodeContext,
		HashnodeEndpointInputs[K],
		HashnodeEndpointOutputs[K]
	>;

export type HashnodeEndpoints = {
	me: HashnodeEndpoint<'me'>;
	getPublication: HashnodeEndpoint<'getPublication'>;
	listPublications: HashnodeEndpoint<'listPublications'>;
	getPost: HashnodeEndpoint<'getPost'>;
	getPostBySlug: HashnodeEndpoint<'getPostBySlug'>;
	listPosts: HashnodeEndpoint<'listPosts'>;
	feed: HashnodeEndpoint<'feed'>;
	searchPostsOfPublication: HashnodeEndpoint<'searchPostsOfPublication'>;
	publishPost: HashnodeEndpoint<'publishPost'>;
	updatePost: HashnodeEndpoint<'updatePost'>;
	getUser: HashnodeEndpoint<'getUser'>;
	getTag: HashnodeEndpoint<'getTag'>;
	listPostComments: HashnodeEndpoint<'listPostComments'>;
	listSeries: HashnodeEndpoint<'listSeries'>;
	getSeries: HashnodeEndpoint<'getSeries'>;
	listPages: HashnodeEndpoint<'listPages'>;
	getPage: HashnodeEndpoint<'getPage'>;
	getDraft: HashnodeEndpoint<'getDraft'>;
	createDraft: HashnodeEndpoint<'createDraft'>;
	updateDraft: HashnodeEndpoint<'updateDraft'>;
	publishDraft: HashnodeEndpoint<'publishDraft'>;
	deleteDraft: HashnodeEndpoint<'deleteDraft'>;
	createImageUploadURL: HashnodeEndpoint<'createImageUploadURL'>;
};

export type HashnodeBoundWebhooks = Record<string, never>;

const hashnodeEndpointsNested = {
	publications: {
		get: Publications.get,
		list: Publications.list,
	},
	posts: {
		get: Posts.get,
		getBySlug: Posts.getBySlug,
		list: Posts.list,
		search: Posts.search,
		publish: Posts.publish,
		update: Posts.update,
	},
	comments: {
		list: Comments.list,
	},
	users: {
		get: Users.get,
	},
	me: Users.me,
	tags: {
		get: Tags.get,
	},
	series: {
		list: Series.list,
		get: Series.get,
	},
	pages: {
		list: Pages.list,
		get: Pages.get,
	},
	feed: {
		list: Feed.list,
	},
	drafts: {
		get: Drafts.get,
		create: Drafts.create,
		update: Drafts.update,
		publish: Drafts.publish,
		delete: Drafts.delete,
	},
	images: {
		createUploadURL: Images.createUploadURL,
	},
} as const;

const hashnodeWebhooksNested = {} as const;

export const hashnodeEndpointSchemas = {
	'publications.get': {
		input: HashnodeEndpointInputSchemas.getPublication,
		output: HashnodeEndpointOutputSchemas.getPublication,
	},
	'publications.list': {
		input: HashnodeEndpointInputSchemas.listPublications,
		output: HashnodeEndpointOutputSchemas.listPublications,
	},
	'posts.get': {
		input: HashnodeEndpointInputSchemas.getPost,
		output: HashnodeEndpointOutputSchemas.getPost,
	},
	'posts.getBySlug': {
		input: HashnodeEndpointInputSchemas.getPostBySlug,
		output: HashnodeEndpointOutputSchemas.getPostBySlug,
	},
	'posts.list': {
		input: HashnodeEndpointInputSchemas.listPosts,
		output: HashnodeEndpointOutputSchemas.listPosts,
	},
	'posts.search': {
		input: HashnodeEndpointInputSchemas.searchPostsOfPublication,
		output: HashnodeEndpointOutputSchemas.searchPostsOfPublication,
	},
	'posts.publish': {
		input: HashnodeEndpointInputSchemas.publishPost,
		output: HashnodeEndpointOutputSchemas.publishPost,
	},
	'posts.update': {
		input: HashnodeEndpointInputSchemas.updatePost,
		output: HashnodeEndpointOutputSchemas.updatePost,
	},
	'comments.list': {
		input: HashnodeEndpointInputSchemas.listPostComments,
		output: HashnodeEndpointOutputSchemas.listPostComments,
	},
	me: {
		input: HashnodeEndpointInputSchemas.me,
		output: HashnodeEndpointOutputSchemas.me,
	},
	'users.get': {
		input: HashnodeEndpointInputSchemas.getUser,
		output: HashnodeEndpointOutputSchemas.getUser,
	},
	'tags.get': {
		input: HashnodeEndpointInputSchemas.getTag,
		output: HashnodeEndpointOutputSchemas.getTag,
	},
	'series.list': {
		input: HashnodeEndpointInputSchemas.listSeries,
		output: HashnodeEndpointOutputSchemas.listSeries,
	},
	'series.get': {
		input: HashnodeEndpointInputSchemas.getSeries,
		output: HashnodeEndpointOutputSchemas.getSeries,
	},
	'pages.list': {
		input: HashnodeEndpointInputSchemas.listPages,
		output: HashnodeEndpointOutputSchemas.listPages,
	},
	'pages.get': {
		input: HashnodeEndpointInputSchemas.getPage,
		output: HashnodeEndpointOutputSchemas.getPage,
	},
	'feed.list': {
		input: HashnodeEndpointInputSchemas.feed,
		output: HashnodeEndpointOutputSchemas.feed,
	},
	'drafts.get': {
		input: HashnodeEndpointInputSchemas.getDraft,
		output: HashnodeEndpointOutputSchemas.getDraft,
	},
	'drafts.create': {
		input: HashnodeEndpointInputSchemas.createDraft,
		output: HashnodeEndpointOutputSchemas.createDraft,
	},
	'drafts.update': {
		input: HashnodeEndpointInputSchemas.updateDraft,
		output: HashnodeEndpointOutputSchemas.updateDraft,
	},
	'drafts.publish': {
		input: HashnodeEndpointInputSchemas.publishDraft,
		output: HashnodeEndpointOutputSchemas.publishDraft,
	},
	'drafts.delete': {
		input: HashnodeEndpointInputSchemas.deleteDraft,
		output: HashnodeEndpointOutputSchemas.deleteDraft,
	},
	'images.createUploadURL': {
		input: HashnodeEndpointInputSchemas.createImageUploadURL,
		output: HashnodeEndpointOutputSchemas.createImageUploadURL,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof hashnodeEndpointsNested
>;

const hashnodeWebhookSchemas =
	{} as const satisfies RequiredPluginWebhookSchemas<
		typeof hashnodeWebhooksNested
	>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const hashnodeEndpointMeta = {
	'publications.get': {
		riskLevel: 'read',
		description: 'Get a publication by host',
	},
	'publications.list': {
		riskLevel: 'read',
		description: 'List publications for the authenticated user',
	},
	'posts.get': {
		riskLevel: 'read',
		description: 'Get a single post by ID',
	},
	'posts.getBySlug': {
		riskLevel: 'read',
		description: 'Get a post by publication host and slug',
	},
	'posts.list': {
		riskLevel: 'read',
		description: 'List posts in a publication',
	},
	'posts.search': {
		riskLevel: 'read',
		description: 'Search posts within a publication',
	},
	'posts.publish': {
		riskLevel: 'write',
		description: 'Publish a new post',
	},
	'posts.update': {
		riskLevel: 'write',
		description: 'Update an existing post',
	},
	'comments.list': {
		riskLevel: 'read',
		description: 'List comments on a post',
	},
	me: {
		riskLevel: 'read',
		description: 'Get the current authenticated user',
	},
	'users.get': {
		riskLevel: 'read',
		description: 'Get a user by username',
	},
	'tags.get': {
		riskLevel: 'read',
		description: 'Get a tag by slug',
	},
	'series.list': {
		riskLevel: 'read',
		description: 'List series in a publication',
	},
	'series.get': {
		riskLevel: 'read',
		description: 'Get a series by slug',
	},
	'pages.list': {
		riskLevel: 'read',
		description: 'List static pages in a publication',
	},
	'pages.get': {
		riskLevel: 'read',
		description: 'Get a static page by slug',
	},
	'feed.list': {
		riskLevel: 'read',
		description: 'Get the global feed of posts',
	},
	'drafts.get': {
		riskLevel: 'read',
		description: 'Get a draft by ID',
	},
	'drafts.create': {
		riskLevel: 'write',
		description: 'Create a new draft',
	},
	'drafts.update': {
		riskLevel: 'write',
		description: 'Update an existing draft',
	},
	'drafts.publish': {
		riskLevel: 'write',
		description: 'Publish a draft as a post',
	},
	'drafts.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a draft [DESTRUCTIVE - IRREVERSIBLE]',
	},
	'images.createUploadURL': {
		riskLevel: 'write',
		description: 'Create a presigned image upload URL',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof hashnodeEndpointsNested>;

export const hashnodeAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseHashnodePlugin<T extends HashnodePluginOptions> = CorsairPlugin<
	'hashnode',
	typeof HashnodeSchema,
	typeof hashnodeEndpointsNested,
	typeof hashnodeWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalHashnodePlugin = BaseHashnodePlugin<HashnodePluginOptions>;

export type ExternalHashnodePlugin<T extends HashnodePluginOptions> =
	BaseHashnodePlugin<T>;

export function hashnode<const T extends HashnodePluginOptions>(
	incomingOptions: HashnodePluginOptions & T = {} as HashnodePluginOptions & T,
): ExternalHashnodePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'hashnode',
		authConfig: hashnodeAuthConfig,
		schema: HashnodeSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: hashnodeEndpointsNested,
		webhooks: hashnodeWebhooksNested,
		endpointMeta: hashnodeEndpointMeta,
		endpointSchemas: hashnodeEndpointSchemas,
		webhookSchemas: hashnodeWebhookSchemas,
		pluginWebhookMatcher: () => false,
		pluginTenantWebhookMatcher: () => null,
		oauthWebhookTenantLinkResolver: () => null,
		errorHandlers: (() => {
			const { DEFAULT: defaultHandler, ...specificDefaults } = errorHandlers;
			return {
				...specificDefaults,
				...(options.errorHandlers || {}),
				DEFAULT: options.errorHandlers?.DEFAULT || defaultHandler,
			};
		})(),
		keyBuilder: async (ctx: HashnodeKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();

				if (!res) {
					throw new AuthMissingError('hashnode', 'api_key');
				}

				return res;
			}

			throw new AuthMissingError('hashnode', 'api_key');
		},
	} satisfies InternalHashnodePlugin;
}

export type {
	HashnodeEndpointInputs,
	HashnodeEndpointOutputs,
} from './endpoints/types';
