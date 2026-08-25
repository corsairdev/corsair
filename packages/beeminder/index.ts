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
import { Charges, Goals, User } from './endpoints';
import type {
	BeeminderEndpointInputs,
	BeeminderEndpointOutputs,
} from './endpoints/types';
import {
	BeeminderEndpointInputSchemas,
	BeeminderEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { BeeminderSchema } from './schema';

export type BeeminderPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	/**
	 * The Beeminder username for API calls.
	 *
	 * When omitted the plugin falls back to the stored `username` key,
	 * or uses "me" (the authenticated user alias) if no username is available.
	 */
	username?: string;
	hooks?: InternalBeeminderPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof beeminderEndpointsNested>;
};

/**
 * Beeminder authenticates with either a personal auth token (API key) or
 * an OAuth 2.0 access token.
 *
 * Both token types are sent as an `Authorization: Bearer` header. The
 * username is needed to construct API URLs but can be resolved from "me"
 * if not provided.
 */
export const beeminderAuthConfig = {
	api_key: {
		account: ['username'] as const,
	},
	oauth_2: {
		account: ['username'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BeeminderContext = CorsairPluginContext<
	typeof BeeminderSchema,
	BeeminderPluginOptions,
	undefined,
	typeof beeminderAuthConfig
>;

export type BeeminderKeyBuilderContext =
	KeyBuilderContext<BeeminderPluginOptions>;

export type BeeminderBoundEndpoints = BindEndpoints<
	typeof beeminderEndpointsNested
>;

type BeeminderEndpoint<K extends keyof BeeminderEndpointOutputs> =
	CorsairEndpoint<
		BeeminderContext,
		BeeminderEndpointInputs[K],
		BeeminderEndpointOutputs[K]
	>;

export type BeeminderEndpoints = {
	userGet: BeeminderEndpoint<'userGet'>;

	goalsList: BeeminderEndpoint<'goalsList'>;
	goalsListArchived: BeeminderEndpoint<'goalsListArchived'>;

	chargesCreate: BeeminderEndpoint<'chargesCreate'>;
};

const beeminderEndpointsNested = {
	user: {
		get: User.get,
	},
	goals: {
		list: Goals.list,
		listArchived: Goals.listArchived,
	},
	charges: {
		create: Charges.create,
	},
} as const;

export const beeminderEndpointSchemas = {
	'user.get': {
		input: BeeminderEndpointInputSchemas.userGet,
		output: BeeminderEndpointOutputSchemas.userGet,
	},

	'goals.list': {
		input: BeeminderEndpointInputSchemas.goalsList,
		output: BeeminderEndpointOutputSchemas.goalsList,
	},
	'goals.listArchived': {
		input: BeeminderEndpointInputSchemas.goalsListArchived,
		output: BeeminderEndpointOutputSchemas.goalsListArchived,
	},

	'charges.create': {
		input: BeeminderEndpointInputSchemas.chargesCreate,
		output: BeeminderEndpointOutputSchemas.chargesCreate,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof beeminderEndpointsNested
>;

const defaultAuthType = 'api_key' as const satisfies AuthTypes;

/**
 * Risk levels.
 *
 * `read` for anything that only fetches. `write` for anything that changes
 * state and can be undone or repeated without loss.
 */
export const beeminderEndpointMeta = {
	'user.get': {
		riskLevel: 'read',
		description: 'Get information about the authenticated user',
	},

	'goals.list': {
		riskLevel: 'read',
		description: 'Get all active goals for the user',
	},
	'goals.listArchived': {
		riskLevel: 'read',
		description: 'Get all archived goals for the user',
	},

	'charges.create': {
		riskLevel: 'write',
		description: 'Create a charge against a Beeminder user',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof beeminderEndpointsNested
>;

export type BaseBeeminderPlugin<T extends BeeminderPluginOptions> =
	CorsairPlugin<
		'beeminder',
		typeof BeeminderSchema,
		typeof beeminderEndpointsNested,
		Record<string, never>,
		T,
		typeof defaultAuthType
	>;

export type InternalBeeminderPlugin =
	BaseBeeminderPlugin<BeeminderPluginOptions>;

export type ExternalBeeminderPlugin<T extends BeeminderPluginOptions> =
	BaseBeeminderPlugin<T>;

/**
 * The Beeminder plugin.
 *
 * Supports both API Key (personal auth token) and OAuth 2.0 authentication.
 * Beeminder uses implicit grant (`response_type=token`); the OAuth flow
 * returns an access token directly in the redirect URL fragment.
 *
 * **No webhooks.** Beeminder sends outbound webhooks to user-configured URLs,
 * but does not deliver events to third-party integrations via webhook.
 * So this plugin registers no webhook handlers, no matcher and no tenant
 * resolver.
 */
export function beeminder<const T extends BeeminderPluginOptions>(
	incomingOptions: BeeminderPluginOptions & T = {} as BeeminderPluginOptions &
		T,
): ExternalBeeminderPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'beeminder',
		authConfig: beeminderAuthConfig,
		schema: BeeminderSchema,
		options: options,
		hooks: options.hooks,
		endpoints: beeminderEndpointsNested,
		webhooks: {},
		endpointMeta: beeminderEndpointMeta,
		endpointSchemas: beeminderEndpointSchemas,
		webhookSchemas: {},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		oauthConfig: {
			providerName: 'Beeminder',
			authUrl: 'https://www.beeminder.com/apps/authorize',
			tokenUrl: 'https://www.beeminder.com/api/v1/auth_token.json',
			scopes: [],
			requiresRegisteredRedirect: true,
		},
		keyBuilder: async (ctx: BeeminderKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			if (source === 'endpoint' && ctx.authType === 'oauth_2') {
				const res = await ctx.keys.get_access_token();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalBeeminderPlugin;
}

export type {
	BeeminderEndpointInputs,
	BeeminderEndpointOutputs,
} from './endpoints/types';
