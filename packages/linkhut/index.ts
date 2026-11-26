import type {
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { Posts, Tags } from './endpoints';
import type {
	LinkhutEndpointInputs,
	LinkhutEndpointOutputs,
} from './endpoints/types';
import {
	LinkhutEndpointInputSchemas,
	LinkhutEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { LinkhutSchema } from './schema';

export type LinkhutPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalLinkhutPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof linkhutEndpointsNested>;
};

export type LinkhutContext = CorsairPluginContext<
	typeof LinkhutSchema,
	LinkhutPluginOptions
>;

export type LinkhutKeyBuilderContext = KeyBuilderContext<LinkhutPluginOptions>;

export type LinkhutBoundEndpoints = BindEndpoints<
	typeof linkhutEndpointsNested
>;

type LinkhutEndpoint<K extends keyof LinkhutEndpointOutputs> = CorsairEndpoint<
	LinkhutContext,
	LinkhutEndpointInputs[K],
	LinkhutEndpointOutputs[K]
>;

export type LinkhutEndpoints = {
	postsLastUpdated: LinkhutEndpoint<'postsLastUpdated'>;
	postsAdd: LinkhutEndpoint<'postsAdd'>;
	postsDelete: LinkhutEndpoint<'postsDelete'>;
	postsGet: LinkhutEndpoint<'postsGet'>;
	postsRecent: LinkhutEndpoint<'postsRecent'>;
	postsDates: LinkhutEndpoint<'postsDates'>;
	postsAll: LinkhutEndpoint<'postsAll'>;
	postsAllHashes: LinkhutEndpoint<'postsAllHashes'>;
	postsSuggest: LinkhutEndpoint<'postsSuggest'>;
	tagsGet: LinkhutEndpoint<'tagsGet'>;
	tagsDelete: LinkhutEndpoint<'tagsDelete'>;
	tagsRename: LinkhutEndpoint<'tagsRename'>;
};

const linkhutEndpointsNested = {
	posts: {
		lastUpdated: Posts.lastUpdated,
		add: Posts.add,
		delete: Posts.remove,
		get: Posts.get,
		recent: Posts.recent,
		dates: Posts.dates,
		all: Posts.all,
		allHashes: Posts.allHashes,
		suggest: Posts.suggest,
	},
	tags: {
		get: Tags.get,
		delete: Tags.remove,
		rename: Tags.rename,
	},
} as const;

export const linkhutEndpointSchemas = {
	'posts.lastUpdated': {
		input: LinkhutEndpointInputSchemas.postsLastUpdated,
		output: LinkhutEndpointOutputSchemas.postsLastUpdated,
	},
	'posts.add': {
		input: LinkhutEndpointInputSchemas.postsAdd,
		output: LinkhutEndpointOutputSchemas.postsAdd,
	},
	'posts.delete': {
		input: LinkhutEndpointInputSchemas.postsDelete,
		output: LinkhutEndpointOutputSchemas.postsDelete,
	},
	'posts.get': {
		input: LinkhutEndpointInputSchemas.postsGet,
		output: LinkhutEndpointOutputSchemas.postsGet,
	},
	'posts.recent': {
		input: LinkhutEndpointInputSchemas.postsRecent,
		output: LinkhutEndpointOutputSchemas.postsRecent,
	},
	'posts.dates': {
		input: LinkhutEndpointInputSchemas.postsDates,
		output: LinkhutEndpointOutputSchemas.postsDates,
	},
	'posts.all': {
		input: LinkhutEndpointInputSchemas.postsAll,
		output: LinkhutEndpointOutputSchemas.postsAll,
	},
	'posts.allHashes': {
		input: LinkhutEndpointInputSchemas.postsAllHashes,
		output: LinkhutEndpointOutputSchemas.postsAllHashes,
	},
	'posts.suggest': {
		input: LinkhutEndpointInputSchemas.postsSuggest,
		output: LinkhutEndpointOutputSchemas.postsSuggest,
	},
	'tags.get': {
		input: LinkhutEndpointInputSchemas.tagsGet,
		output: LinkhutEndpointOutputSchemas.tagsGet,
	},
	'tags.delete': {
		input: LinkhutEndpointInputSchemas.tagsDelete,
		output: LinkhutEndpointOutputSchemas.tagsDelete,
	},
	'tags.rename': {
		input: LinkhutEndpointInputSchemas.tagsRename,
		output: LinkhutEndpointOutputSchemas.tagsRename,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof linkhutEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const linkhutEndpointMeta = {
	'posts.lastUpdated': {
		riskLevel: 'read',
		description:
			'Get the time of the last bookmark change, to tell whether posts.all needs to be read again',
	},
	'posts.add': {
		riskLevel: 'write',
		description:
			"Save a new bookmark; fails when the url is already saved. With `replace: 'yes'`, rewrite the saved bookmark for the url instead (omitted fields are cleared)",
	},
	'posts.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete the bookmark for a url. This cannot be undone',
	},
	'posts.get': {
		riskLevel: 'read',
		description:
			'Get the bookmarks of one day, the bookmarks with a tag, the bookmark for a url (empty when it is not saved) or the bookmarks for URL MD5 hashes',
	},
	'posts.recent': {
		riskLevel: 'read',
		description:
			'List the most recent bookmarks, up to 100, optionally with one tag. There is no offset',
	},
	'posts.dates': {
		riskLevel: 'read',
		description: 'Count the bookmarks saved on each day',
	},
	'posts.all': {
		riskLevel: 'read',
		description:
			'List bookmarks by offset, up to 1000 per page. Follow `nextStart` until it is null',
	},
	'posts.allHashes': {
		riskLevel: 'read',
		description:
			'List every bookmark as a URL MD5 and a change signature, to find what changed without downloading all bookmarks',
	},
	'posts.suggest': {
		riskLevel: 'read',
		description: 'Get popular and recommended tags for a url',
	},
	'tags.get': {
		riskLevel: 'read',
		description: 'List every tag with the number of bookmarks that carry it',
	},
	'tags.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a tag from every bookmark. The bookmarks stay, and the tag cannot be restored',
	},
	'tags.rename': {
		riskLevel: 'write',
		description: 'Rename a tag on every bookmark that carries it',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof linkhutEndpointsNested>;

export type BaseLinkhutPlugin<T extends LinkhutPluginOptions> = CorsairPlugin<
	'linkhut',
	typeof LinkhutSchema,
	typeof linkhutEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalLinkhutPlugin = BaseLinkhutPlugin<LinkhutPluginOptions>;

export type ExternalLinkhutPlugin<T extends LinkhutPluginOptions> =
	BaseLinkhutPlugin<T>;

export function linkhut<const T extends LinkhutPluginOptions>(
	incomingOptions: LinkhutPluginOptions & T = {} as LinkhutPluginOptions & T,
): ExternalLinkhutPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'linkhut',
		schema: LinkhutSchema,
		options: options,
		hooks: options.hooks,
		endpoints: linkhutEndpointsNested,
		webhooks: {},
		endpointMeta: linkhutEndpointMeta,
		endpointSchemas: linkhutEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: LinkhutKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('linkhut', 'api_key');
		},
	} satisfies InternalLinkhutPlugin;
}

export type { LinkhutRequestFacts } from './client';
export { linkhutRequestFacts } from './client';

export type {
	LinkhutEndpointInputs,
	LinkhutEndpointOutputs,
	PostsAddInput,
	PostsAddResponse,
	PostsAllHashesInput,
	PostsAllHashesResponse,
	PostsAllInput,
	PostsAllResponse,
	PostsDatesInput,
	PostsDatesResponse,
	PostsDeleteInput,
	PostsDeleteResponse,
	PostsGetInput,
	PostsGetResponse,
	PostsLastUpdatedInput,
	PostsLastUpdatedResponse,
	PostsRecentInput,
	PostsRecentResponse,
	PostsSuggestInput,
	PostsSuggestResponse,
	TagsDeleteInput,
	TagsDeleteResponse,
	TagsGetInput,
	TagsGetResponse,
	TagsRenameInput,
	TagsRenameResponse,
} from './endpoints/types';
