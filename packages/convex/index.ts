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
import { AuthMissingError } from 'corsair/core';
import {
	convexEndpointMeta,
	convexEndpointSchemas,
	convexEndpointsNested,
} from './endpoints';
import type {
	ConvexEndpointInputs,
	ConvexEndpointOutputs,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ConvexSchema } from './schema';

export type ConvexPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	/**
	 * Plugin-wide credential sent as `Authorization: Bearer <key>` for Management
	 * API operations. This must be a Convex personal/team access token — Convex
	 * does not accept deploy keys as bearer credentials for the Management API,
	 * so an `api_key` connection should store an access token.
	 * Deployment-scoped operations authenticate as `Authorization: Convex
	 * <key>` with a deployment admin deploy key — supplied per call via each
	 * operation's `deployKey` input or stored on the connection as
	 * `deploy_key`.
	 */
	key?: string;
	/**
	 * Deployment name (e.g. `acoustic-panther-728`) used to build the
	 * deployment-scoped REST API base URL (`https://<deployment>.convex.cloud`).
	 * Also resolvable per-account via the `subdomain` auth field.
	 */
	subdomain?: string;
	hooks?: InternalConvexPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof convexEndpointsNested>;
};

const defaultAuthType: AuthTypes = 'api_key' as const;

export const convexAuthConfig = {
	api_key: {
		account: ['subdomain', 'deploy_key'] as const,
	},
	oauth_2: {
		account: ['subdomain', 'deploy_key'] as const,
	},
} as const satisfies PluginAuthConfig;

export type ConvexContext = CorsairPluginContext<
	typeof ConvexSchema,
	ConvexPluginOptions,
	undefined,
	typeof convexAuthConfig
>;

export type ConvexKeyBuilderContext = KeyBuilderContext<
	ConvexPluginOptions,
	typeof convexAuthConfig
>;

export type ConvexBoundEndpoints = BindEndpoints<typeof convexEndpointsNested>;

type ConvexEndpoint<K extends keyof ConvexEndpointOutputs> = CorsairEndpoint<
	ConvexContext,
	ConvexEndpointInputs[K],
	ConvexEndpointOutputs[K]
>;

/**
 * Explicit endpoint types keyed by operation name (not `typeof
 * convexEndpointsNested`) so handler files can reference them without
 * creating a circular type reference.
 */
export type ConvexEndpoints = {
	projectsList: ConvexEndpoint<'projectsList'>;
	projectGetById: ConvexEndpoint<'projectGetById'>;
	projectGetBySlug: ConvexEndpoint<'projectGetBySlug'>;
	projectCreate: ConvexEndpoint<'projectCreate'>;
	projectDelete: ConvexEndpoint<'projectDelete'>;
	deploymentsList: ConvexEndpoint<'deploymentsList'>;
	deploymentGet: ConvexEndpoint<'deploymentGet'>;
	deploymentCreate: ConvexEndpoint<'deploymentCreate'>;
	deploymentUpdate: ConvexEndpoint<'deploymentUpdate'>;
	deploymentDelete: ConvexEndpoint<'deploymentDelete'>;
	deployKeyCreate: ConvexEndpoint<'deployKeyCreate'>;
	deployKeysList: ConvexEndpoint<'deployKeysList'>;
	customDomainDelete: ConvexEndpoint<'customDomainDelete'>;
	tokenDetails: ConvexEndpoint<'tokenDetails'>;
	deploymentClassesList: ConvexEndpoint<'deploymentClassesList'>;
	deploymentRegionsList: ConvexEndpoint<'deploymentRegionsList'>;
	executeQueryBatch: ConvexEndpoint<'executeQueryBatch'>;
	queryTimestamp: ConvexEndpoint<'queryTimestamp'>;
	logStreamsList: ConvexEndpoint<'logStreamsList'>;
};
export type BaseConvexPlugin<T extends ConvexPluginOptions> = CorsairPlugin<
	'convex',
	typeof ConvexSchema,
	typeof convexEndpointsNested,
	{},
	T,
	typeof defaultAuthType,
	typeof convexAuthConfig
>;

export type InternalConvexPlugin = BaseConvexPlugin<ConvexPluginOptions>;

export type ExternalConvexPlugin<T extends ConvexPluginOptions> =
	BaseConvexPlugin<T>;

export function convex<const T extends ConvexPluginOptions>(
	incomingOptions: ConvexPluginOptions & T = {} as ConvexPluginOptions & T,
): ExternalConvexPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'convex',
		schema: ConvexSchema,
		options: options,
		authConfig: convexAuthConfig,
		hooks: options.hooks,
		endpoints: convexEndpointsNested,
		webhooks: {},
		endpointMeta: convexEndpointMeta satisfies RequiredPluginEndpointMeta<
			typeof convexEndpointsNested
		>,
		endpointSchemas:
			convexEndpointSchemas satisfies RequiredPluginEndpointSchemas<
				typeof convexEndpointsNested
			>,
		pluginWebhookMatcher: () => false,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		// NOTE: `ctx.key` is the Management API credential (`Bearer <key>`).
		// Deployment-scoped operations authenticate with their own deploy key
		// (`Convex <key>`) supplied per call via `deployKey` or stored on the
		// connection as `deploy_key` — never with the access token. A connection
		// that only has a deploy key (no access token) resolves to an empty
		// placeholder so the binding succeeds and deployment-scoped operations
		// can run; Management operations then fail with a clear error in the
		// request client instead of sending the deploy key as a bearer token.
		keyBuilder: async (ctx: ConvexKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const apiKey = await ctx.keys.get_api_key();
				if (apiKey) {
					return apiKey;
				}
				if (await ctx.keys.get_deploy_key()) {
					// Deploy-key-only connection: no bearer credential.
					return '';
				}
				throw new AuthMissingError('convex', 'api_key');
			}

			if (source === 'endpoint' && ctx.authType === 'oauth_2') {
				const token = await ctx.keys.get_access_token();
				if (token) {
					return token;
				}
				if (await ctx.keys.get_deploy_key()) {
					// Deploy-key-only connection: no bearer credential.
					return '';
				}
				throw new AuthMissingError('convex', 'oauth_2');
			}

			throw new AuthMissingError('convex', ctx.authType);
		},
	} satisfies InternalConvexPlugin;
}

export type {
	ConvexEndpointInputs,
	ConvexEndpointOutputs,
} from './endpoints/types';

export { convexEndpointSchemas, convexEndpointsNested };
