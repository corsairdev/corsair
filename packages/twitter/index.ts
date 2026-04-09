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
import {
	TweetsEndpoints,
	TwitterEndpointInputSchemas,
	TwitterEndpointOutputSchemas,
} from './endpoints';
import type {
	TwitterEndpointInputs,
	TwitterEndpointOutputs,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { TwitterSchema } from './schema';

// ── Context & Key Builder ─────────────────────────────────────────────────────

export type TwitterContext = CorsairPluginContext<
	typeof TwitterSchema,
	TwitterPluginOptions
>;

export type TwitterKeyBuilderContext = KeyBuilderContext<TwitterPluginOptions>;

// ── Endpoint Types ────────────────────────────────────────────────────────────

type TwitterEndpoint<K extends keyof TwitterEndpointOutputs> = CorsairEndpoint<
	TwitterContext,
	TwitterEndpointInputs[K],
	TwitterEndpointOutputs[K]
>;

export type TwitterEndpoints = {
	tweetsCreate: TwitterEndpoint<'tweetsCreate'>;
	tweetsCreateReply: TwitterEndpoint<'tweetsCreateReply'>;
};

export type TwitterBoundEndpoints = BindEndpoints<
	typeof twitterEndpointsNested
>;

// ── Plugin Options ────────────────────────────────────────────────────────────

export type TwitterPluginOptions = {
	authType?: PickAuth<'oauth_2'>;
	/** Optional access token (overrides key manager) */
	key?: string;
	/** Optional webhook secret for signature verification */
	webhookSecret?: string;
	hooks?: InternalTwitterPlugin['hooks'];
	webhookHooks?: InternalTwitterPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	/**
	 * Permission configuration for the Twitter plugin.
	 * Controls what the AI agent is allowed to do.
	 * Overrides use dot-notation paths from the Twitter endpoint tree — invalid paths are type errors.
	 */
	permissions?: PluginPermissionsConfig<typeof twitterEndpointsNested>;
};

// ── Endpoint + Webhook Trees ──────────────────────────────────────────────────

const twitterEndpointsNested = {
	tweets: {
		create: TweetsEndpoints.create,
		createReply: TweetsEndpoints.createReply,
	},
} as const;

const twitterWebhooksNested = {} as const;

// ── Endpoint Schemas ──────────────────────────────────────────────────────────

export const twitterEndpointSchemas = {
	'tweets.create': {
		input: TwitterEndpointInputSchemas.tweetsCreate,
		output: TwitterEndpointOutputSchemas.tweetsCreate,
	},
	'tweets.createReply': {
		input: TwitterEndpointInputSchemas.tweetsCreateReply,
		output: TwitterEndpointOutputSchemas.tweetsCreateReply,
	},
} as const;

// ── Endpoint Meta ─────────────────────────────────────────────────────────────

const twitterEndpointMeta = {
	'tweets.create': {
		riskLevel: 'write',
		description: 'Post a new tweet',
	},
	'tweets.createReply': {
		riskLevel: 'write',
		description: 'Post a reply to an existing tweet',
	},
} satisfies RequiredPluginEndpointMeta<typeof twitterEndpointsNested>;

// ── Auth Config ───────────────────────────────────────────────────────────────

export const twitterAuthConfig = {
	oauth_2: {
		account: ['one'] as const,
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
	typeof defaultAuthType
>;

export type InternalTwitterPlugin = BaseTwitterPlugin<TwitterPluginOptions>;

export type ExternalTwitterPlugin<T extends TwitterPluginOptions> =
	BaseTwitterPlugin<T>;

// ── Plugin Factory ────────────────────────────────────────────────────────────

export function twitter<const T extends TwitterPluginOptions>(
	incomingOptions: TwitterPluginOptions & T = {} as TwitterPluginOptions & T,
): ExternalTwitterPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'twitter',
		schema: TwitterSchema,
		options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: twitterEndpointsNested,
		webhooks: twitterWebhooksNested,
		endpointMeta: twitterEndpointMeta,
		endpointSchemas: twitterEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		pluginWebhookMatcher: (request) => {
			// Webhooks not implemented yet
			return false;
		},
		keyBuilder: async (ctx: TwitterKeyBuilderContext, source) => {
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature();
				return res ?? '';
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'oauth_2') {
				const res = await ctx.keys.get_access_token();
				if (!res) return '';
				return res;
			}

			return '';
		},
	} satisfies InternalTwitterPlugin;
}

// ── Type Exports ──────────────────────────────────────────────────────────────

export type {
	TweetsCreateInput,
	TweetsCreateReplyInput,
	TweetsCreateReplyResponse,
	TweetsCreateResponse,
	TwitterEndpointInputs,
	TwitterEndpointOutputs,
} from './endpoints/types';
export type { TwitterCredentials } from './schema';
