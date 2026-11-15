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
import { GoogleClassroomEndpoints } from './endpoints';
import type { GoogleClassroomOAuthScope } from './endpoints/registry';
import {
	GOOGLE_CLASSROOM_OAUTH_SCOPES,
	GoogleClassroomEndpointMetadata,
	GoogleClassroomEndpointSchemas,
} from './endpoints/registry';
import type {
	GoogleClassroomEndpointInputs,
	GoogleClassroomEndpointOutputs,
	GoogleClassroomOperationId,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { GoogleClassroomSchema } from './schema';

export type GoogleClassroomPluginOptions = {
	authType?: PickAuth<'oauth_2'>;
	key?: string;
	oauthScopes?: readonly GoogleClassroomOAuthScope[];
	hooks?: InternalGoogleClassroomPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof googleClassroomEndpointsNested>;
};

export type GoogleClassroomContext = CorsairPluginContext<
	typeof GoogleClassroomSchema,
	GoogleClassroomPluginOptions
>;

export type GoogleClassroomKeyBuilderContext =
	KeyBuilderContext<GoogleClassroomPluginOptions>;

export type GoogleClassroomBoundEndpoints = BindEndpoints<
	typeof googleClassroomEndpointsNested
>;

export type GoogleClassroomEndpoint<K extends GoogleClassroomOperationId> =
	CorsairEndpoint<
		GoogleClassroomContext,
		GoogleClassroomEndpointInputs[K],
		GoogleClassroomEndpointOutputs[K]
	>;

const googleClassroomEndpointsNested = GoogleClassroomEndpoints;

export const googleclassroomEndpointSchemas =
	GoogleClassroomEndpointSchemas satisfies RequiredPluginEndpointSchemas<
		typeof googleClassroomEndpointsNested
	>;

const googleclassroomEndpointMeta =
	GoogleClassroomEndpointMetadata satisfies RequiredPluginEndpointMeta<
		typeof googleClassroomEndpointsNested
	>;

const defaultAuthType: AuthTypes = 'oauth_2' as const;

export const googleclassroomAuthConfig = {
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseGoogleClassroomPlugin<T extends GoogleClassroomPluginOptions> =
	CorsairPlugin<
		'googleclassroom',
		typeof GoogleClassroomSchema,
		typeof googleClassroomEndpointsNested,
		Record<string, never>,
		T,
		typeof defaultAuthType
	>;

export type InternalGoogleClassroomPlugin =
	BaseGoogleClassroomPlugin<GoogleClassroomPluginOptions>;

export type ExternalGoogleClassroomPlugin<
	T extends GoogleClassroomPluginOptions,
> = BaseGoogleClassroomPlugin<T>;

export function googleclassroom<const T extends GoogleClassroomPluginOptions>(
	incomingOptions: GoogleClassroomPluginOptions &
		T = {} as GoogleClassroomPluginOptions & T,
): ExternalGoogleClassroomPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	const { DEFAULT: builtInDefault, ...builtIns } = errorHandlers;
	const { DEFAULT: callerDefault, ...callerHandlers } =
		options.errorHandlers ?? {};

	return {
		id: 'googleclassroom',
		authConfig: googleclassroomAuthConfig,
		schema: GoogleClassroomSchema,
		options,
		hooks: options.hooks,
		endpoints: googleClassroomEndpointsNested,
		webhooks: {},
		endpointMeta: googleclassroomEndpointMeta,
		endpointSchemas: googleclassroomEndpointSchemas,
		errorHandlers: {
			...callerHandlers,
			...builtIns,
			...callerHandlers,
			DEFAULT: callerDefault ?? builtInDefault,
		},
		oauthConfig: {
			providerName: 'Google',
			authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
			tokenUrl: 'https://oauth2.googleapis.com/token',
			scopes: [...(options.oauthScopes ?? GOOGLE_CLASSROOM_OAUTH_SCOPES)],
			authParams: { access_type: 'offline', prompt: 'consent' },
		},
		keyBuilder: async (ctx: GoogleClassroomKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (options.key) return options.key;
			if (ctx.authType === 'oauth_2') {
				return getOAuthAccessToken(ctx, {
					plugin: 'googleclassroom',
					tokenUrl: 'https://oauth2.googleapis.com/token',
				});
			}
			throw new AuthMissingError('googleclassroom', 'oauth_2');
		},
	} satisfies InternalGoogleClassroomPlugin;
}

export type { GoogleClassroomOAuthScope } from './endpoints/registry';
export {
	GOOGLE_CLASSROOM_OAUTH_SCOPES,
	GOOGLE_CLASSROOM_SUPPORTED_SCOPES,
} from './endpoints/registry';
export type {
	GoogleClassroomEndpointInputs,
	GoogleClassroomEndpointOutputs,
	GoogleClassroomOperationId,
} from './endpoints/types';
export {
	GOOGLE_CLASSROOM_ROUTES,
	GoogleClassroomEndpointInputSchemas,
	GoogleClassroomEndpointOutputSchemas,
} from './endpoints/types';
