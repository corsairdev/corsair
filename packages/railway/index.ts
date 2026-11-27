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
import type { RailwayTokenKind } from './client';
import { tryGetStoredKey } from './client';
import {
	railwayEndpointMeta as generatedEndpointMeta,
	railwayEndpointSchemas,
	railwayEndpointsNested,
} from './endpoints/catalog';
import type {
	RailwayEndpointInputs,
	RailwayEndpointOutputs,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { RailwaySchema } from './schema';

export type RailwayPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/**
	 * A Railway token from railway.com/account/tokens: an account token (every
	 * workspace the user is in) or a workspace token (one workspace). A project
	 * token from a project's settings works too, with `tokenKind: 'project'`.
	 */
	key?: string;
	/**
	 * How the token is sent: `account` and `workspace` (the default) as
	 * `Authorization: Bearer`, `project` as `Project-Access-Token`.
	 */
	tokenKind?: RailwayTokenKind;
	hooks?: InternalRailwayPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof railwayEndpointsNested>;
};

// Workspace, project, environment and service ids are per-call inputs.
export const railwayAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type RailwayContext = CorsairPluginContext<
	typeof RailwaySchema,
	RailwayPluginOptions,
	undefined,
	typeof railwayAuthConfig
>;

export type RailwayKeyBuilderContext = KeyBuilderContext<
	RailwayPluginOptions,
	typeof railwayAuthConfig
>;

export type RailwayBoundEndpoints = BindEndpoints<
	typeof railwayEndpointsNested
>;

export type RailwayEndpoints = {
	[Id in keyof RailwayEndpointOutputs]: CorsairEndpoint<
		RailwayContext,
		RailwayEndpointInputs[Id],
		RailwayEndpointOutputs[Id]
	>;
};

export { railwayEndpointSchemas };

// One entry per operation, generated with the catalog (endpoints/catalog.ts).
const railwayEndpointMeta =
	generatedEndpointMeta satisfies RequiredPluginEndpointMeta<
		typeof railwayEndpointsNested
	>;

const defaultAuthType = 'api_key' as const;

export type BaseRailwayPlugin<T extends RailwayPluginOptions> = CorsairPlugin<
	'railway',
	typeof RailwaySchema,
	typeof railwayEndpointsNested,
	{},
	T,
	typeof defaultAuthType,
	typeof railwayAuthConfig
>;

export type InternalRailwayPlugin = BaseRailwayPlugin<RailwayPluginOptions>;

export type ExternalRailwayPlugin<T extends RailwayPluginOptions> =
	BaseRailwayPlugin<T>;

export function railway<const T extends RailwayPluginOptions>(
	// Safe: every RailwayPluginOptions field is optional, so an empty object satisfies it.
	incomingOptions: RailwayPluginOptions & T = {} as RailwayPluginOptions & T,
): ExternalRailwayPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'railway',
		authConfig: railwayAuthConfig,
		schema: RailwaySchema,
		options: options,
		hooks: options.hooks,
		endpoints: railwayEndpointsNested,
		webhooks: {},
		endpointMeta: railwayEndpointMeta,
		endpointSchemas: railwayEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: (() => {
			// Core uses the first handler whose matcher accepts the error, and
			// DEFAULT matches everything, so DEFAULT always goes last; otherwise
			// it would shadow a handler a caller adds through options.
			const { DEFAULT: builtInDefault, ...specificDefaults } = errorHandlers;
			const { DEFAULT: callerDefault, ...callerHandlers } =
				options.errorHandlers || {};
			return {
				...specificDefaults,
				...callerHandlers,
				DEFAULT: callerDefault || builtInDefault,
			};
		})(),
		keyBuilder: async (ctx: RailwayKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (options.key) return options.key;
			const key = await tryGetStoredKey(() => ctx.keys?.get_api_key());
			// No key configured: AuthMissingError makes core ask the tenant to connect.
			if (!key) throw new AuthMissingError('railway', 'api_key');
			return key;
		},
	} satisfies InternalRailwayPlugin;
}

export type { RailwayGraphQLRequest, RailwayTokenKind } from './client';
export { RailwayGraphQLError } from './client';
export {
	createRailwayOperation,
	getRailwayInputSchema,
	getRailwayOutputSchema,
	RAILWAY_OPERATION_IDS,
} from './endpoints';
export type {
	RailwayEndpointInputs,
	RailwayEndpointOutputs,
	RailwayJsonValue,
	RailwayOperationId,
} from './endpoints/types';
export {
	RailwayEndpointInputSchemas,
	RailwayEndpointOutputSchemas,
} from './endpoints/types';
