import type {
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
import { AuthMissingError } from 'corsair/core';
import {
	BlueskyEndpointInputSchemas,
	BlueskyEndpointOutputSchemas,
	FeedsEndpoints,
	PostsEndpoints,
	ProfilesEndpoints,
} from './endpoints';
import type {
	BlueskyEndpointInputs,
	BlueskyEndpointOutputs,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { BlueskySchema } from './schema';
import { matchBlueskyTenantWebhook } from './webhooks/tenant-matcher';

// ── Auth Config ───────────────────────────────────────────────────────────────

export const blueskyAuthConfig = {
	api_key: {
		account: ['handle'] as const,
	},
} as const satisfies PluginAuthConfig;

// ── Context & Key Builder ─────────────────────────────────────────────────────

export type BlueskyContext = CorsairPluginContext<
	typeof BlueskySchema,
	BlueskyPluginOptions,
	undefined,
	typeof blueskyAuthConfig
>;

export type BlueskyKeyBuilderContext = KeyBuilderContext<
	BlueskyPluginOptions,
	typeof blueskyAuthConfig
>;

// ── Endpoint Types ────────────────────────────────────────────────────────────

type BlueskyEndpoint<K extends keyof BlueskyEndpointOutputs> = CorsairEndpoint<
	BlueskyContext,
	BlueskyEndpointInputs[K],
	BlueskyEndpointOutputs[K]
>;

export type BlueskyEndpoints = {
	postsCreate: BlueskyEndpoint<'postsCreate'>;
	postsDelete: BlueskyEndpoint<'postsDelete'>;
	profileGet: BlueskyEndpoint<'profileGet'>;
	timelineGet: BlueskyEndpoint<'timelineGet'>;
};

export type BlueskyBoundEndpoints = BindEndpoints<
	typeof blueskyEndpointsNested
>;

// ── Plugin Options ────────────────────────────────────────────────────────────

export type BlueskyPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** Optional app password (overrides key manager) */
	key?: string;
	/** Optional handle (overrides key manager) */
	handle?: string;
	hooks?: InternalBlueskyPlugin['hooks'];
	webhookHooks?: InternalBlueskyPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	/**
	 * Permission configuration for the Bluesky plugin.
	 * Controls what the AI agent is allowed to do.
	 */
	permissions?: PluginPermissionsConfig<typeof blueskyEndpointsNested>;
};

// ── Endpoint + Webhook Trees ──────────────────────────────────────────────────

const blueskyEndpointsNested = {
	posts: {
		create: PostsEndpoints.create,
		deleteRecord: PostsEndpoints.deleteRecord,
	},
	profiles: {
		get: ProfilesEndpoints.get,
	},
	feeds: {
		getTimeline: FeedsEndpoints.getTimeline,
	},
} as const;

const blueskyWebhooksNested = {} as const;

// ── Endpoint Schemas ──────────────────────────────────────────────────────────

export const blueskyEndpointSchemas = {
	'posts.create': {
		input: BlueskyEndpointInputSchemas.postsCreate,
		output: BlueskyEndpointOutputSchemas.postsCreate,
	},
	'posts.deleteRecord': {
		input: BlueskyEndpointInputSchemas.postsDelete,
		output: BlueskyEndpointOutputSchemas.postsDelete,
	},
	'profiles.get': {
		input: BlueskyEndpointInputSchemas.profileGet,
		output: BlueskyEndpointOutputSchemas.profileGet,
	},
	'feeds.getTimeline': {
		input: BlueskyEndpointInputSchemas.timelineGet,
		output: BlueskyEndpointOutputSchemas.timelineGet,
	},
} as const;

// ── Endpoint Meta ─────────────────────────────────────────────────────────────

const blueskyEndpointMeta = {
	'posts.create': {
		riskLevel: 'write',
		description: 'Create/publish a new post (skeet) on Bluesky',
	},
	'posts.deleteRecord': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a post on Bluesky [DESTRUCTIVE]',
	},
	'profiles.get': {
		riskLevel: 'read',
		description: 'Get profile information for a Bluesky actor/user',
	},
	'feeds.getTimeline': {
		riskLevel: 'read',
		description: 'Get the home timeline feed of the authenticated user',
	},
} satisfies RequiredPluginEndpointMeta<typeof blueskyEndpointsNested>;

// ── Plugin Types ──────────────────────────────────────────────────────────────

const defaultAuthType = 'api_key' as const;

export type BaseBlueskyPlugin<T extends BlueskyPluginOptions> = CorsairPlugin<
	'bluesky',
	typeof BlueskySchema,
	typeof blueskyEndpointsNested,
	typeof blueskyWebhooksNested,
	T,
	typeof defaultAuthType,
	typeof blueskyAuthConfig
>;

export type InternalBlueskyPlugin = BaseBlueskyPlugin<BlueskyPluginOptions>;

export type ExternalBlueskyPlugin<T extends BlueskyPluginOptions> =
	BaseBlueskyPlugin<T>;

// ── Plugin Factory ────────────────────────────────────────────────────────────

export function bluesky<const T extends BlueskyPluginOptions>(
	// `{} as BlueskyPluginOptions & T` is used here as the default parameter
	// value because TypeScript cannot infer that an empty object satisfies the generic
	// intersection type `BlueskyPluginOptions & T` at the call site; callers always
	// override this via their own options object.
	incomingOptions: BlueskyPluginOptions & T = {} as BlueskyPluginOptions & T,
): ExternalBlueskyPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'bluesky',
		schema: BlueskySchema,
		options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: blueskyEndpointsNested,
		webhooks: blueskyWebhooksNested,
		authConfig: blueskyAuthConfig,
		endpointMeta: blueskyEndpointMeta,
		endpointSchemas: blueskyEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		pluginWebhookMatcher: (request) => {
			// Webhooks not supported on Bluesky
			return false;
		},
		pluginTenantWebhookMatcher: matchBlueskyTenantWebhook,
		keyBuilder: async (ctx: BlueskyKeyBuilderContext, source) => {
			const authType = ctx.authType;

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('bluesky', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('bluesky', 'api_key');
		},
	} satisfies InternalBlueskyPlugin;
}

// ── Type Exports ──────────────────────────────────────────────────────────────

export type {
	BlueskyEndpointInputs,
	BlueskyEndpointOutputs,
	PostsCreateInput,
	PostsCreateResponse,
	PostsDeleteInput,
	PostsDeleteResponse,
	ProfileGetInput,
	ProfileGetResponse,
	TimelineGetInput,
	TimelineGetResponse,
} from './endpoints/types';
export type { BlueskyPost } from './schema';
