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
import { AuthMissingError, getOAuthAccessToken } from 'corsair/core';
import { d2lBrightspaceEndpointsNested } from './endpoints';
import {
	d2lBrightspaceEndpointMeta,
	d2lBrightspaceEndpointSchemas,
} from './endpoints/registry';
import type {
	D2lBrightspaceEndpointInputs,
	D2lBrightspaceEndpointOutputs,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { D2L_ROUTES } from './route-definitions';
import { D2lBrightspaceSchema } from './schema';

export const d2lBrightspaceAuthConfig = {
	api_key: {
		// D2L's legacy ID-Key flow uses the base api_key field for the Application Key.
		account: [
			'application_id',
			'user_id',
			'user_key',
			'brightspace_url',
		] as const,
	},
	oauth_2: {
		account: ['brightspace_url'] as const,
	},
} as const satisfies PluginAuthConfig;

export type D2lBrightspacePluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	/** Optional single-tenant override; multi-tenant connections should store brightspace_url. */
	baseUrl?: string;
	/** Bounded request timeout in milliseconds. Defaults to 20 seconds; max 60 seconds. */
	timeoutMs?: number;
	hooks?: InternalD2lBrightspacePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof d2lBrightspaceEndpointsNested>;
};

export type D2lBrightspaceContext = CorsairPluginContext<
	typeof D2lBrightspaceSchema,
	D2lBrightspacePluginOptions,
	undefined,
	typeof d2lBrightspaceAuthConfig
>;

export type D2lBrightspaceKeyBuilderContext = KeyBuilderContext<
	D2lBrightspacePluginOptions,
	typeof d2lBrightspaceAuthConfig
>;

export type D2lBrightspaceBoundEndpoints = BindEndpoints<
	typeof d2lBrightspaceEndpointsNested
>;

type D2lBrightspaceEndpoint<K extends string> = CorsairEndpoint<
	D2lBrightspaceContext,
	D2lBrightspaceEndpointInputs[K],
	D2lBrightspaceEndpointOutputs[K]
>;

export type D2lBrightspaceEndpoints = {
	apiProperties: Record<string, D2lBrightspaceEndpoint<string>>;
	awardService: Record<string, D2lBrightspaceEndpoint<string>>;
	brightspaceForParents: Record<string, D2lBrightspaceEndpoint<string>>;
	eportfolio: Record<string, D2lBrightspaceEndpoint<string>>;
	learningEnvironment: Record<string, D2lBrightspaceEndpoint<string>>;
	learningObjectRepository: Record<string, D2lBrightspaceEndpoint<string>>;
	learningPlatform: Record<string, D2lBrightspaceEndpoint<string>>;
};

const defaultAuthType: AuthTypes = 'oauth_2' as const;

const d2lOAuthScopes = [
	'core:*:*',
	...[...new Set(D2L_ROUTES.flatMap((route) => route.oauthScopes))],
];

const checkedD2lBrightspaceEndpointMeta =
	d2lBrightspaceEndpointMeta satisfies RequiredPluginEndpointMeta<
		typeof d2lBrightspaceEndpointsNested
	>;

const publicVersionRoutes = new Set<string>(
	D2L_ROUTES.filter(
		(route) =>
			route.group === 'API properties' &&
			route.path.startsWith('/d2l/api/') &&
			route.path.includes('/versions'),
	).map((route) => route.operationPath),
);

export type BaseD2lBrightspacePlugin<T extends D2lBrightspacePluginOptions> =
	CorsairPlugin<
		'd2lbrightspace',
		typeof D2lBrightspaceSchema,
		typeof d2lBrightspaceEndpointsNested,
		Record<string, never>,
		T,
		typeof defaultAuthType,
		typeof d2lBrightspaceAuthConfig
	>;

export type InternalD2lBrightspacePlugin =
	BaseD2lBrightspacePlugin<D2lBrightspacePluginOptions>;
export type ExternalD2lBrightspacePlugin<
	T extends D2lBrightspacePluginOptions,
> = BaseD2lBrightspacePlugin<T>;

export function d2lBrightspace<const T extends D2lBrightspacePluginOptions>(
	incomingOptions: D2lBrightspacePluginOptions &
		T = {} as D2lBrightspacePluginOptions & T,
): ExternalD2lBrightspacePlugin<T> {
	const requestedTimeoutMs = incomingOptions.timeoutMs ?? 20_000;
	const timeoutMs = Math.max(
		1_000,
		Math.min(
			Number.isFinite(requestedTimeoutMs) ? requestedTimeoutMs : 20_000,
			60_000,
		),
	);
	const options = {
		...incomingOptions,
		timeoutMs,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	const { DEFAULT: builtInDefault, ...builtInHandlers } = errorHandlers;
	const { DEFAULT: callerDefault, ...callerHandlers } =
		options.errorHandlers ?? {};
	const orderedErrorHandlers = {
		...callerHandlers,
		...builtInHandlers,
		...callerHandlers,
		DEFAULT: callerDefault ?? builtInDefault,
	};
	return {
		id: 'd2lbrightspace',
		authConfig: d2lBrightspaceAuthConfig,
		oauthConfig: {
			providerName: 'D2L Brightspace',
			authUrl: 'https://auth.brightspace.com/oauth2/auth',
			tokenUrl: 'https://auth.brightspace.com/core/connect/token',
			scopes: d2lOAuthScopes,
			requiresRegisteredRedirect: true,
		},
		schema: D2lBrightspaceSchema,
		options,
		hooks: options.hooks,
		endpoints: d2lBrightspaceEndpointsNested,
		webhooks: {},
		endpointMeta: checkedD2lBrightspaceEndpointMeta,
		endpointSchemas: d2lBrightspaceEndpointSchemas,
		errorHandlers: orderedErrorHandlers,
		keyBuilder: async (ctx: D2lBrightspaceKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (publicVersionRoutes.has(ctx.meteredOperationId ?? '')) return '';
			if (!ctx.keys) {
				throw new AuthMissingError('d2lbrightspace', ctx.authType);
			}
			if (!ctx.options.baseUrl && !(await ctx.keys.get_brightspace_url())) {
				throw new AuthMissingError('d2lbrightspace', ctx.authType);
			}
			if (ctx.authType === 'oauth_2') {
				return getOAuthAccessToken(ctx, {
					plugin: 'd2lbrightspace',
					tokenUrl: 'https://auth.brightspace.com/core/connect/token',
				});
			}
			const applicationKey = await ctx.keys.get_api_key();
			const [applicationId, userId, userKey] = await Promise.all([
				ctx.keys.get_application_id(),
				ctx.keys.get_user_id(),
				ctx.keys.get_user_key(),
			]);
			const legacyIdPattern = /^[A-Za-z0-9_-]{22}$/;
			if (
				!applicationKey ||
				!applicationId ||
				!userId ||
				!userKey ||
				!legacyIdPattern.test(applicationKey) ||
				!legacyIdPattern.test(applicationId) ||
				!legacyIdPattern.test(userId) ||
				!legacyIdPattern.test(userKey)
			) {
				throw new AuthMissingError('d2lbrightspace', 'api_key');
			}
			return applicationKey;
		},
	} satisfies InternalD2lBrightspacePlugin;
}

export {
	d2lBrightspaceEndpointsNested,
	d2lBrightspaceEndpointMeta,
	d2lBrightspaceEndpointSchemas,
};
export { d2lBrightspace as d2lbrightspace };
export { D2L_ROUTES };
export type { D2lBrightspaceEndpointInputs, D2lBrightspaceEndpointOutputs };
export type {
	D2lJsonValue,
	D2lRouteInput,
	D2lRouteOutput,
} from './endpoints/types';
