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
} from 'corsair/core';
import { AuthMissingError, getOAuthAccessToken } from 'corsair/core';
import { X_AUTHORIZE_URL, X_TOKEN_URL } from './client';
import {
	TweetsEndpoints,
	twitterGeneratedEndpointMeta,
	twitterGeneratedEndpointSchemas,
	twitterGeneratedEndpointsNested,
} from './endpoints';
import { findTwitterOperation } from './endpoints/openapi-schema';
import { authProblem } from './endpoints/operations';
import {
	TweetsCreateInputSchema,
	TweetsCreateReplyInputSchema,
	TweetsCreateReplyResponseSchema,
	TweetsCreateResponseSchema,
} from './endpoints/tweets';
import type {
	TwitterEndpointInputs,
	TwitterEndpointOutputs,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { TwitterSchema } from './schema';
import { matchTwitterTenantWebhook } from './webhooks/tenant-matcher';

/**
 * The OAuth 2.0 scopes a connection asks for by default: posts, users,
 * follows, likes, lists, blocks, mutes, bookmarks, Spaces, DMs, media upload,
 * and `offline.access` for a refresh token.
 */
export const X_DEFAULT_SCOPES = [
	'tweet.read',
	'tweet.write',
	'tweet.moderate.write',
	'users.read',
	'follows.read',
	'follows.write',
	'offline.access',
	'space.read',
	'mute.read',
	'mute.write',
	'like.read',
	'like.write',
	'list.read',
	'list.write',
	'block.read',
	'block.write',
	'bookmark.read',
	'bookmark.write',
	'dm.read',
	'dm.write',
	'media.write',
] as const;

/**
 * Scopes a few route groups need on top of the defaults: live broadcasts,
 * calls, the developer account, the media library and Amplify, and reposts of
 * me. Pass `scopes: [...X_DEFAULT_SCOPES, ...X_EXTRA_SCOPES]` to ask for them;
 * the X app must have them enabled.
 */
export const X_EXTRA_SCOPES = [
	'broadcast.read',
	'broadcast.write',
	'calls.read',
	'calls.write',
	'calls.join',
	'developer.read',
	'developer.write',
	'media.library.read',
	'media.library.write',
	'timeline.read',
] as const;

// ── Context & Key Builder ─────────────────────────────────────────────────────

export type TwitterContext = CorsairPluginContext<
	typeof TwitterSchema,
	TwitterPluginOptions
>;

export type TwitterKeyBuilderContext = KeyBuilderContext<TwitterPluginOptions>;

// ── Endpoint Types ────────────────────────────────────────────────────────────

export type TwitterEndpoints = {
	[Id in keyof TwitterEndpointOutputs]: CorsairEndpoint<
		TwitterContext,
		TwitterEndpointInputs[Id],
		TwitterEndpointOutputs[Id]
	>;
};

// ── Plugin Options ────────────────────────────────────────────────────────────

export type TwitterPluginOptions = {
	/**
	 * `oauth_2` (default): a user's OAuth 2.0 token (Authorization Code with
	 * PKCE). Acts as that user: posts, DMs, timelines, bookmarks, likes.
	 * `api_key`: the X app's Bearer token (app-only auth). Reaches public reads
	 * and the app-only routes (compliance, usage, filtered-stream rules,
	 * full-archive counts), never anything that acts as a user.
	 */
	authType?: PickAuth<'oauth_2' | 'api_key'>;
	/** An access token or Bearer token to use instead of the stored one. */
	key?: string;
	/**
	 * OAuth 2.0 scopes to ask for. Defaults to `X_DEFAULT_SCOPES`; add
	 * `X_EXTRA_SCOPES` for broadcasts, calls, the developer account and the
	 * media library.
	 */
	scopes?: readonly string[];
	/** Optional webhook secret for signature verification */
	webhookSecret?: string;
	hooks?: InternalTwitterPlugin['hooks'];
	webhookHooks?: InternalTwitterPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	/**
	 * Permission configuration for the X plugin.
	 * Controls what the AI agent is allowed to do.
	 * Overrides use dot-notation paths from the endpoint tree — invalid paths are type errors.
	 */
	permissions?: PluginPermissionsConfig<typeof twitterEndpointsNested>;
};

// ── Endpoint + Webhook Trees ──────────────────────────────────────────────────

const twitterEndpointsNested = {
	...twitterGeneratedEndpointsNested,
	// The plugin's first two endpoints, kept for existing callers.
	tweets: {
		create: TweetsEndpoints.create,
		createReply: TweetsEndpoints.createReply,
	},
} as const;

export type TwitterBoundEndpoints = BindEndpoints<
	typeof twitterEndpointsNested
>;

const twitterWebhooksNested = {} as const;

// ── Endpoint Schemas & Meta ───────────────────────────────────────────────────

export const twitterEndpointSchemas = {
	...twitterGeneratedEndpointSchemas,
	'tweets.create': {
		input: TweetsCreateInputSchema,
		output: TweetsCreateResponseSchema,
	},
	'tweets.createReply': {
		input: TweetsCreateReplyInputSchema,
		output: TweetsCreateReplyResponseSchema,
	},
} satisfies RequiredPluginEndpointSchemas<typeof twitterEndpointsNested>;

const twitterEndpointMeta = {
	...twitterGeneratedEndpointMeta,
	'tweets.create': {
		riskLevel: 'destructive',
		description:
			"Publish a post on X as the connected user (camelCase inputs; posts.create takes X's own fields). Billed by X: $0.015 per post, $0.20 for a post that contains a URL.",
	},
	'tweets.createReply': {
		riskLevel: 'destructive',
		description:
			'Reply to a post on X as the connected user. Billed by X: $0.015 per post, $0.20 for a post that contains a URL.',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof twitterEndpointsNested>;

// ── Auth Config ───────────────────────────────────────────────────────────────

export const twitterAuthConfig = {
	oauth_2: {
		account: ['for_user_id'] as const,
	},
	api_key: {
		account: [] as const,
	},
} as const satisfies PluginAuthConfig;

// ── Plugin Types ──────────────────────────────────────────────────────────────

const defaultAuthType: AuthTypes = 'oauth_2' as const;

export type BaseTwitterPlugin<T extends TwitterPluginOptions> = CorsairPlugin<
	'twitter',
	typeof TwitterSchema,
	typeof twitterEndpointsNested,
	typeof twitterWebhooksNested,
	T,
	typeof defaultAuthType,
	typeof twitterAuthConfig
>;

export type InternalTwitterPlugin = BaseTwitterPlugin<TwitterPluginOptions>;

export type ExternalTwitterPlugin<T extends TwitterPluginOptions> =
	BaseTwitterPlugin<T>;

// ── Plugin Factory ────────────────────────────────────────────────────────────

export function twitter<const T extends TwitterPluginOptions>(
	// Safe: every TwitterPluginOptions field is optional, so an empty object satisfies it.
	incomingOptions: TwitterPluginOptions & T = {} as TwitterPluginOptions & T,
): ExternalTwitterPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'twitter',
		authConfig: twitterAuthConfig,
		schema: TwitterSchema,
		options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: twitterEndpointsNested,
		webhooks: twitterWebhooksNested,
		endpointMeta: twitterEndpointMeta,
		endpointSchemas: twitterEndpointSchemas,
		oauthConfig: {
			providerName: 'X',
			authUrl: X_AUTHORIZE_URL,
			tokenUrl: X_TOKEN_URL,
			// X requires PKCE (S256) on every Authorization Code sign-in, and a
			// confidential client authenticates to the token endpoint with Basic.
			pkce: true,
			tokenAuthMethod: 'basic',
			scopes: [...(options.scopes ?? X_DEFAULT_SCOPES)],
		},
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
		// Webhooks (Account Activity) are matched per tenant by for_user_id.
		pluginWebhookMatcher: () => false,
		pluginTenantWebhookMatcher: matchTwitterTenantWebhook,
		keyBuilder: async (ctx: TwitterKeyBuilderContext, source) => {
			if (source === 'webhook') {
				if (options.webhookSecret) return options.webhookSecret;
				const res = await ctx.keys.get_webhook_signature();
				if (!res) {
					throw new AuthMissingError('twitter', 'webhook_signature');
				}
				return res;
			}

			// A route that takes the other kind of token is refused before any
			// credential is read: an expired user token would otherwise be
			// refreshed (and its refresh token rotated) for a call X then refuses.
			if (source === 'endpoint' && ctx.meteredOperationId) {
				const operation = findTwitterOperation(ctx.meteredOperationId);
				const kind = ctx.authType === 'api_key' ? 'api_key' : 'oauth_2';
				const problem = operation && authProblem(operation, kind);
				if (problem) throw new Error(problem);
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				if (!key) throw new AuthMissingError('twitter', 'api_key');
				return key;
			}

			if (source === 'endpoint' && ctx.authType === 'oauth_2') {
				// Refreshes an expired token and stores the new pair: X rotates
				// the refresh token on every refresh, and the old one stops
				// working, so the rotated one must be the one kept.
				return getOAuthAccessToken(ctx, {
					plugin: 'twitter',
					tokenUrl: X_TOKEN_URL,
					tokenAuthMethod: 'basic',
				});
			}

			throw new AuthMissingError('twitter', ctx.authType ?? 'oauth_2');
		},
	} satisfies InternalTwitterPlugin;
}

// ── Exports ───────────────────────────────────────────────────────────────────

export {
	X_API_BASE,
	X_AUTHORIZE_URL,
	X_TOKEN_URL,
} from './client';
export {
	createTwitterOperation,
	getTwitterInputSchema,
	getTwitterOutputSchema,
	TWITTER_OPERATION_IDS,
} from './endpoints';
export type {
	TweetsCreateInput,
	TweetsCreateReplyInput,
	TweetsCreateReplyResponse,
	TweetsCreateResponse,
	TwitterEndpointInputs,
	TwitterEndpointOutputs,
	TwitterJsonValue,
	TwitterOperationId,
} from './endpoints/types';
export {
	TwitterEndpointInputSchemas,
	TwitterEndpointOutputSchemas,
} from './endpoints/types';
export type { TwitterCredentials } from './schema';
