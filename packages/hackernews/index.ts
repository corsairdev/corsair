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
} from 'corsair/core';
import { Items, Search, Stories, Updates, Users } from './endpoints';
import type {
	HackerNewsEndpointInputs,
	HackerNewsEndpointOutputs,
} from './endpoints/types';
import {
	HackerNewsEndpointInputSchemas,
	HackerNewsEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { HackerNewsSchema } from './schema';

export type HackerNewsPluginOptions = {
	// HackerNews is a public API (NO_AUTH) — api_key auth type is kept for framework compatibility
	// but no key is required or used in requests
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalHackerNewsPlugin['hooks'];
	webhookHooks?: InternalHackerNewsPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	/**
	 * Permission configuration for the HackerNews plugin.
	 * Controls what the AI agent is allowed to do.
	 * Overrides use dot-notation paths from the HackerNews endpoint tree — invalid paths are type errors.
	 */
	permissions?: PluginPermissionsConfig<typeof hackerNewsEndpointsNested>;
};

export type HackerNewsContext = CorsairPluginContext<
	typeof HackerNewsSchema,
	HackerNewsPluginOptions
>;

export type HackerNewsKeyBuilderContext =
	KeyBuilderContext<HackerNewsPluginOptions>;

type HackerNewsEndpoint<
	K extends keyof HackerNewsEndpointOutputs,
	Input,
> = CorsairEndpoint<HackerNewsContext, Input, HackerNewsEndpointOutputs[K]>;

export type HackerNewsEndpoints = {
	itemsGet: HackerNewsEndpoint<
		'itemsGet',
		HackerNewsEndpointInputs['itemsGet']
	>;
	itemsGetWithId: HackerNewsEndpoint<
		'itemsGetWithId',
		HackerNewsEndpointInputs['itemsGetWithId']
	>;
	itemsGetMaxId: HackerNewsEndpoint<
		'itemsGetMaxId',
		HackerNewsEndpointInputs['itemsGetMaxId']
	>;
	storiesGetTop: HackerNewsEndpoint<
		'storiesGetTop',
		HackerNewsEndpointInputs['storiesGetTop']
	>;
	storiesGetBest: HackerNewsEndpoint<
		'storiesGetBest',
		HackerNewsEndpointInputs['storiesGetBest']
	>;
	storiesGetNew: HackerNewsEndpoint<
		'storiesGetNew',
		HackerNewsEndpointInputs['storiesGetNew']
	>;
	storiesGetAsk: HackerNewsEndpoint<
		'storiesGetAsk',
		HackerNewsEndpointInputs['storiesGetAsk']
	>;
	storiesGetShow: HackerNewsEndpoint<
		'storiesGetShow',
		HackerNewsEndpointInputs['storiesGetShow']
	>;
	storiesGetJobs: HackerNewsEndpoint<
		'storiesGetJobs',
		HackerNewsEndpointInputs['storiesGetJobs']
	>;
	usersGet: HackerNewsEndpoint<
		'usersGet',
		HackerNewsEndpointInputs['usersGet']
	>;
	usersGetByUsername: HackerNewsEndpoint<
		'usersGetByUsername',
		HackerNewsEndpointInputs['usersGetByUsername']
	>;
	searchPosts: HackerNewsEndpoint<
		'searchPosts',
		HackerNewsEndpointInputs['searchPosts']
	>;
	searchGetLatest: HackerNewsEndpoint<
		'searchGetLatest',
		HackerNewsEndpointInputs['searchGetLatest']
	>;
	searchGetFrontpage: HackerNewsEndpoint<
		'searchGetFrontpage',
		HackerNewsEndpointInputs['searchGetFrontpage']
	>;
	searchGetTodays: HackerNewsEndpoint<
		'searchGetTodays',
		HackerNewsEndpointInputs['searchGetTodays']
	>;
	updatesGet: HackerNewsEndpoint<
		'updatesGet',
		HackerNewsEndpointInputs['updatesGet']
	>;
};

export type HackerNewsBoundEndpoints = BindEndpoints<
	typeof hackerNewsEndpointsNested
>;

const hackerNewsEndpointsNested = {
	items: {
		get: Items.get,
		getWithId: Items.getWithId,
		getMaxId: Items.getMaxId,
	},
	stories: {
		getTop: Stories.getTop,
		getBest: Stories.getBest,
		getNew: Stories.getNew,
		getAsk: Stories.getAsk,
		getShow: Stories.getShow,
		getJobs: Stories.getJobs,
	},
	users: {
		get: Users.get,
		getByUsername: Users.getByUsername,
	},
	search: {
		posts: Search.posts,
		getLatest: Search.getLatest,
		getFrontpage: Search.getFrontpage,
		getTodays: Search.getTodays,
	},
	updates: {
		get: Updates.get,
	},
} as const;

// HackerNews has no webhooks (triggers: [] in API spec)
const hackerNewsWebhooksNested = {} as const;

export const hackerNewsEndpointSchemas = {
	'items.get': {
		input: HackerNewsEndpointInputSchemas.itemsGet,
		output: HackerNewsEndpointOutputSchemas.itemsGet,
	},
	'items.getWithId': {
		input: HackerNewsEndpointInputSchemas.itemsGetWithId,
		output: HackerNewsEndpointOutputSchemas.itemsGetWithId,
	},
	'items.getMaxId': {
		input: HackerNewsEndpointInputSchemas.itemsGetMaxId,
		output: HackerNewsEndpointOutputSchemas.itemsGetMaxId,
	},
	'stories.getTop': {
		input: HackerNewsEndpointInputSchemas.storiesGetTop,
		output: HackerNewsEndpointOutputSchemas.storiesGetTop,
	},
	'stories.getBest': {
		input: HackerNewsEndpointInputSchemas.storiesGetBest,
		output: HackerNewsEndpointOutputSchemas.storiesGetBest,
	},
	'stories.getNew': {
		input: HackerNewsEndpointInputSchemas.storiesGetNew,
		output: HackerNewsEndpointOutputSchemas.storiesGetNew,
	},
	'stories.getAsk': {
		input: HackerNewsEndpointInputSchemas.storiesGetAsk,
		output: HackerNewsEndpointOutputSchemas.storiesGetAsk,
	},
	'stories.getShow': {
		input: HackerNewsEndpointInputSchemas.storiesGetShow,
		output: HackerNewsEndpointOutputSchemas.storiesGetShow,
	},
	'stories.getJobs': {
		input: HackerNewsEndpointInputSchemas.storiesGetJobs,
		output: HackerNewsEndpointOutputSchemas.storiesGetJobs,
	},
	'users.get': {
		input: HackerNewsEndpointInputSchemas.usersGet,
		output: HackerNewsEndpointOutputSchemas.usersGet,
	},
	'users.getByUsername': {
		input: HackerNewsEndpointInputSchemas.usersGetByUsername,
		output: HackerNewsEndpointOutputSchemas.usersGetByUsername,
	},
	'search.posts': {
		input: HackerNewsEndpointInputSchemas.searchPosts,
		output: HackerNewsEndpointOutputSchemas.searchPosts,
	},
	'search.getLatest': {
		input: HackerNewsEndpointInputSchemas.searchGetLatest,
		output: HackerNewsEndpointOutputSchemas.searchGetLatest,
	},
	'search.getFrontpage': {
		input: HackerNewsEndpointInputSchemas.searchGetFrontpage,
		output: HackerNewsEndpointOutputSchemas.searchGetFrontpage,
	},
	'search.getTodays': {
		input: HackerNewsEndpointInputSchemas.searchGetTodays,
		output: HackerNewsEndpointOutputSchemas.searchGetTodays,
	},
	'updates.get': {
		input: HackerNewsEndpointInputSchemas.updatesGet,
		output: HackerNewsEndpointOutputSchemas.updatesGet,
	},
} as const;

const defaultAuthType: AuthTypes = 'api_key' as const;

const hackerNewsEndpointMeta = {
	'items.get': {
		riskLevel: 'read',
		description: 'Get a HackerNews item by numeric ID',
	},
	'items.getWithId': {
		riskLevel: 'read',
		description: 'Get a HackerNews item with nested comments',
	},
	'items.getMaxId': {
		riskLevel: 'read',
		description: 'Get the current maximum item ID',
	},
	'stories.getTop': {
		riskLevel: 'read',
		description: 'Get top HackerNews story IDs',
	},
	'stories.getBest': {
		riskLevel: 'read',
		description: 'Get best HackerNews story IDs',
	},
	'stories.getNew': {
		riskLevel: 'read',
		description: 'Get newest HackerNews story IDs',
	},
	'stories.getAsk': { riskLevel: 'read', description: 'Get Ask HN story IDs' },
	'stories.getShow': {
		riskLevel: 'read',
		description: 'Get Show HN story IDs',
	},
	'stories.getJobs': {
		riskLevel: 'read',
		description: 'Get HackerNews job story IDs',
	},
	'users.get': {
		riskLevel: 'read',
		description: 'Get a HackerNews user profile via Algolia',
	},
	'users.getByUsername': {
		riskLevel: 'read',
		description: 'Get a HackerNews user profile via Firebase',
	},
	'search.posts': {
		riskLevel: 'read',
		description: 'Full-text search HackerNews posts',
	},
	'search.getLatest': {
		riskLevel: 'read',
		description: 'Get latest HackerNews posts',
	},
	'search.getFrontpage': {
		riskLevel: 'read',
		description: 'Get current HackerNews frontpage posts',
	},
	'search.getTodays': {
		riskLevel: 'read',
		description: "Get today's HackerNews posts",
	},
	'updates.get': {
		riskLevel: 'read',
		description: 'Get recently changed HackerNews items and profiles',
	},
} satisfies RequiredPluginEndpointMeta<typeof hackerNewsEndpointsNested>;

export const hackerNewsAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseHackerNewsPlugin<T extends HackerNewsPluginOptions> =
	CorsairPlugin<
		'hackernews',
		typeof HackerNewsSchema,
		typeof hackerNewsEndpointsNested,
		typeof hackerNewsWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalHackerNewsPlugin =
	BaseHackerNewsPlugin<HackerNewsPluginOptions>;

export type ExternalHackerNewsPlugin<T extends HackerNewsPluginOptions> =
	BaseHackerNewsPlugin<T>;

export function hackernews<const T extends HackerNewsPluginOptions>(
	// {} as HackerNewsPluginOptions & T: default empty options; safe because all fields are optional
	incomingOptions: HackerNewsPluginOptions & T = {} as HackerNewsPluginOptions &
		T,
): ExternalHackerNewsPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'hackernews',
		schema: HackerNewsSchema,
		options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: hackerNewsEndpointsNested,
		webhooks: hackerNewsWebhooksNested,
		endpointMeta: hackerNewsEndpointMeta,
		endpointSchemas: hackerNewsEndpointSchemas,
		// HackerNews has no webhooks — no incoming webhook requests to match
		pluginWebhookMatcher: (_request) => false,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		// HackerNews is a public API — keyBuilder returns empty string (no auth needed)
		keyBuilder: async (_ctx: HackerNewsKeyBuilderContext, _source) => {
			if (options.key) {
				return options.key;
			}
			return '';
		},
	} satisfies InternalHackerNewsPlugin;
}

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	GetAskStoriesResponse,
	GetBestStoriesResponse,
	GetFrontpageResponse,
	GetItemResponse,
	GetItemWithIdResponse,
	GetJobStoriesResponse,
	GetLatestPostsResponse,
	GetMaxItemIdResponse,
	GetNewStoriesResponse,
	GetShowStoriesResponse,
	GetTodaysPostsResponse,
	GetTopStoriesResponse,
	GetUpdatesResponse,
	GetUserByUsernameResponse,
	GetUserResponse,
	HackerNewsEndpointInputs,
	HackerNewsEndpointOutputs,
	SearchPostsResponse,
} from './endpoints/types';

export type { HackerNewsWebhookOutputs } from './webhooks/types';
