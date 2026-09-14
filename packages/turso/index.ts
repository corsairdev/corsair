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
import { Changes, Regions, Tokens } from './endpoints';
import type {
	TursoEndpointInputs,
	TursoEndpointOutputs,
} from './endpoints/types';
import {
	TursoEndpointInputSchemas,
	TursoEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { TursoSchema } from './schema';

/**
 * Options accepted by the Turso Corsair plugin.
 */
export type TursoPluginOptions = {
	/** Authentication type, defaults to 'api_key'. */
	authType?: PickAuth<'api_key'>;
	/**
	 * A Turso platform API token, bypassing Corsair's stored credentials. Create
	 * one with `turso auth api-tokens mint`.
	 */
	key?: string;
	/**
	 * A database auth token for the database host, used by `changes.listen` and
	 * its `/v2/pipeline` fallback. Turso scopes these separately from the
	 * platform API token (`turso db tokens create <db>`). Falls back to the
	 * stored `database_token` credential or platform token when omitted.
	 */
	databaseToken?: string;
	/** Lifecycle hooks for plugin execution. */
	hooks?: InternalTursoPlugin['hooks'];
	/** Optional custom error handlers. */
	errorHandlers?: CorsairErrorHandler;
	/** Permissions configuration for plugin endpoints. */
	permissions?: PluginPermissionsConfig<typeof tursoEndpointsNested>;
};

/**
 * Auth configuration. Turso issues a platform API token stored in `api_key`.
 * Multi-tenant setups can also store an optional tenant-scoped `database_token`.
 */
export const tursoAuthConfig = {
	api_key: {
		account: ['database_token'] as const,
	},
} as const satisfies PluginAuthConfig;

/**
 * Context type available to Turso endpoint functions.
 */
export type TursoContext = CorsairPluginContext<
	typeof TursoSchema,
	TursoPluginOptions,
	undefined,
	typeof tursoAuthConfig
>;

/**
 * Key builder context type for Turso credential resolution.
 */
export type TursoKeyBuilderContext = KeyBuilderContext<
	TursoPluginOptions,
	typeof tursoAuthConfig
>;

/**
 * Bound endpoints type for Turso.
 */
export type TursoBoundEndpoints = BindEndpoints<typeof tursoEndpointsNested>;

type TursoEndpoint<K extends keyof TursoEndpointOutputs> = CorsairEndpoint<
	TursoContext,
	TursoEndpointInputs[K],
	TursoEndpointOutputs[K]
>;

/**
 * Map of Turso endpoint operations.
 */
export type TursoEndpoints = {
	closestRegion: TursoEndpoint<'closestRegion'>;
	validateApiToken: TursoEndpoint<'validateApiToken'>;
	listenToChanges: TursoEndpoint<'listenToChanges'>;
};

/**
 * Webhooks type for Turso (no webhook surface).
 */
export type TursoWebhooks = Record<string, never>;

const tursoEndpointsNested = {
	regions: {
		closest: Regions.closest,
	},
	tokens: {
		validate: Tokens.validate,
	},
	changes: {
		listen: Changes.listen,
	},
} as const;

const tursoWebhooksNested = {} as const;

/**
 * Zod input and output schemas for all Turso endpoints.
 */
export const tursoEndpointSchemas = {
	'regions.closest': {
		input: TursoEndpointInputSchemas.closestRegion,
		output: TursoEndpointOutputSchemas.closestRegion,
	},
	'tokens.validate': {
		input: TursoEndpointInputSchemas.validateApiToken,
		output: TursoEndpointOutputSchemas.validateApiToken,
	},
	'changes.listen': {
		input: TursoEndpointInputSchemas.listenToChanges,
		output: TursoEndpointOutputSchemas.listenToChanges,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof tursoEndpointsNested>;

const tursoWebhookSchemas = {} as const satisfies RequiredPluginWebhookSchemas<
	typeof tursoWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

/**
 * Endpoint metadata including risk levels and descriptions for permission evaluation.
 */
const tursoEndpointMeta = {
	'regions.closest': {
		riskLevel: 'read',
		description:
			'Get the closest Turso region based on client location, to minimize latency',
	},
	'tokens.validate': {
		riskLevel: 'read',
		description:
			'Validate a Turso API token and retrieve its expiration time (-1 when it never expires)',
	},
	'changes.listen': {
		riskLevel: 'read',
		description:
			'Listen to committed insert/update/delete events for a table in a Turso database',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof tursoEndpointsNested>;

/**
 * Base plugin type for Turso.
 */
export type BaseTursoPlugin<T extends TursoPluginOptions> = CorsairPlugin<
	'turso',
	typeof TursoSchema,
	typeof tursoEndpointsNested,
	typeof tursoWebhooksNested,
	T,
	typeof defaultAuthType,
	typeof tursoAuthConfig
>;

/**
 * Internal plugin representation.
 */
export type InternalTursoPlugin = BaseTursoPlugin<TursoPluginOptions>;

/**
 * External plugin representation returned by the factory function.
 */
export type ExternalTursoPlugin<T extends TursoPluginOptions> =
	BaseTursoPlugin<T>;

/**
 * Creates an instance of the Turso Corsair integration plugin.
 *
 * @param incomingOptions - Configuration options including the API token.
 * @returns The configured Turso plugin instance.
 */
export function turso<const T extends TursoPluginOptions>(
	// Every field of TursoPluginOptions is optional, so `{}` is a valid default;
	// the assertion only supplies the inferred `T`, which TypeScript cannot
	// synthesise for a defaulted generic parameter.
	incomingOptions: TursoPluginOptions & T = {} as TursoPluginOptions & T,
): ExternalTursoPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'turso',
		authConfig: tursoAuthConfig,
		schema: TursoSchema,
		options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: tursoEndpointsNested,
		webhooks: tursoWebhooksNested,
		endpointMeta: tursoEndpointMeta,
		endpointSchemas: tursoEndpointSchemas,
		webhookSchemas: tursoWebhookSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: TursoKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('turso', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('turso', 'api_key');
		},
	} satisfies InternalTursoPlugin;
}

export type { SseEvent } from './client';
export {
	isTursoDatabaseUrl,
	isTursoHost,
	parseSseBuffer,
	TURSO_API_BASE,
	TURSO_REGION_BASE,
	TursoAPIError,
	tryGetStoredKey,
	tursoFetchJson,
	tursoPipelineHealthCheck,
} from './client';
export type {
	ChangeAction,
	ChangeEvent,
	ClosestRegionInput,
	ClosestRegionResponse,
	ListenHealthCheckResult,
	ListenStreamResult,
	ListenToChangesInput,
	ListenToChangesResponse,
	TursoEndpointInputs,
	TursoEndpointOutputs,
	ValidateApiTokenInput,
	ValidateApiTokenResponse,
} from './endpoints/types';
export {
	ChangeActionSchema,
	ChangeEventSchema,
	ClosestRegionInputSchema,
	ClosestRegionResponseSchema,
	ListenToChangesInputSchema,
	ListenToChangesResponseSchema,
	TursoEndpointInputSchemas,
	TursoEndpointOutputSchemas,
	ValidateApiTokenInputSchema,
	ValidateApiTokenResponseSchema,
} from './endpoints/types';
