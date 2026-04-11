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
import { Subreddits } from './endpoints';
import type {
	RedditEndpointInputs,
	RedditEndpointOutputs,
} from './endpoints/types';
import {
	RedditEndpointInputSchemas,
	RedditEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { RedditSchema } from './schema';

export type RedditPluginOptions = {
	// Reddit public JSON API — api_key auth type is kept for framework compatibility
	// but no key is required or used in requests
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalRedditPlugin['hooks'];
	webhookHooks?: InternalRedditPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	/**
	 * Permission configuration for the Reddit plugin.
	 * Controls what the AI agent is allowed to do.
	 * Overrides use dot-notation paths from the Reddit endpoint tree — invalid paths are type errors.
	 */
	permissions?: PluginPermissionsConfig<typeof redditEndpointsNested>;
};

export type RedditContext = CorsairPluginContext<
	typeof RedditSchema,
	RedditPluginOptions
>;

export type RedditKeyBuilderContext = KeyBuilderContext<RedditPluginOptions>;

type RedditEndpoint<
	K extends keyof RedditEndpointOutputs,
	Input,
> = CorsairEndpoint<RedditContext, Input, RedditEndpointOutputs[K]>;

export type RedditEndpoints = {
	subredditsGetHot: RedditEndpoint<
		'subredditsGetHot',
		RedditEndpointInputs['subredditsGetHot']
	>;
};

export type RedditBoundEndpoints = BindEndpoints<
	typeof redditEndpointsNested
>;

const redditEndpointsNested = {
	subreddits: {
		getHot: Subreddits.getHot,
	},
} as const;

// Reddit public API does not support webhooks
const redditWebhooksNested = {} as const;

export const redditEndpointSchemas = {
	'subreddits.getHot': {
		input: RedditEndpointInputSchemas.subredditsGetHot,
		output: RedditEndpointOutputSchemas.subredditsGetHot,
	},
} as const;

const defaultAuthType: AuthTypes = 'api_key' as const;

const redditEndpointMeta = {
	'subreddits.getHot': {
		riskLevel: 'read',
		description: 'Get hot posts from a subreddit',
	},
} satisfies RequiredPluginEndpointMeta<typeof redditEndpointsNested>;

export const redditAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseRedditPlugin<T extends RedditPluginOptions> = CorsairPlugin<
	'reddit',
	typeof RedditSchema,
	typeof redditEndpointsNested,
	typeof redditWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalRedditPlugin = BaseRedditPlugin<RedditPluginOptions>;

export type ExternalRedditPlugin<T extends RedditPluginOptions> =
	BaseRedditPlugin<T>;

export function reddit<const T extends RedditPluginOptions>(
	incomingOptions: RedditPluginOptions & T = {} as RedditPluginOptions & T,
): ExternalRedditPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'reddit',
		schema: RedditSchema,
		options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: redditEndpointsNested,
		webhooks: redditWebhooksNested,
		endpointMeta: redditEndpointMeta,
		endpointSchemas: redditEndpointSchemas,
		pluginWebhookMatcher: (_request) => false,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (_ctx: RedditKeyBuilderContext, _source) => {
			if (options.key) {
				return options.key;
			}
			return '';
		},
	} satisfies InternalRedditPlugin;
}

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	GetHotPostsResponse,
	RedditEndpointInputs,
	RedditEndpointOutputs,
} from './endpoints/types';

export type { RedditWebhookOutputs } from './webhooks/types';
