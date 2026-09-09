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
import { attachManagedRefreshAuth, getManagedAccessToken } from 'corsair/hub';
import { Users } from './endpoints';
import type {
	WakaTimeEndpointInputs,
	WakaTimeEndpointOutputs,
} from './endpoints/types';
import {
	WakaTimeEndpointInputSchemas,
	WakaTimeEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { WakaTimeSchema } from './schema';

export type WakaTimePluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2' | 'managed'>;
	key?: string;
	hooks?: InternalWakaTimePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof wakaTimeEndpointsNested>;
};

export type WakaTimeContext = CorsairPluginContext<
	typeof WakaTimeSchema,
	WakaTimePluginOptions
>;

export type WakaTimeKeyBuilderContext =
	KeyBuilderContext<WakaTimePluginOptions>;

export type WakaTimeBoundEndpoints = BindEndpoints<
	typeof wakaTimeEndpointsNested
>;

type WakaTimeEndpoint<K extends keyof WakaTimeEndpointOutputs> =
	CorsairEndpoint<
		WakaTimeContext,
		WakaTimeEndpointInputs[K],
		WakaTimeEndpointOutputs[K]
	>;

export type WakaTimeEndpoints = {
	getCurrentUser: WakaTimeEndpoint<'getCurrentUser'>;
};

const wakaTimeEndpointsNested = {
	users: {
		current: Users.current,
	},
} as const;

export const wakaTimeEndpointSchemas = {
	'users.current': {
		input: WakaTimeEndpointInputSchemas.getCurrentUser,
		output: WakaTimeEndpointOutputSchemas.getCurrentUser,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof wakaTimeEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const wakaTimeEndpointMeta = {
	'users.current': {
		riskLevel: 'read',
		description: 'Get the current WakaTime user',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof wakaTimeEndpointsNested>;

export const wakaTimeAuthConfig = {
	api_key: {},
	oauth_2: {},
	managed: {},
} as const satisfies PluginAuthConfig;

export type BaseWakaTimePlugin<T extends WakaTimePluginOptions> = CorsairPlugin<
	'wakatime',
	typeof WakaTimeSchema,
	typeof wakaTimeEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalWakaTimePlugin = BaseWakaTimePlugin<WakaTimePluginOptions>;

export type ExternalWakaTimePlugin<T extends WakaTimePluginOptions> =
	BaseWakaTimePlugin<T>;

/** Creates a WakaTime plugin configured for WakaTime API-key authentication. */
export function wakatime<const T extends WakaTimePluginOptions>(
	incomingOptions: WakaTimePluginOptions & T = {} as WakaTimePluginOptions & T,
): ExternalWakaTimePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'wakatime',
		authConfig: wakaTimeAuthConfig,
		oauthConfig: {
			providerName: 'WakaTime',
			authUrl: 'https://wakatime.com/oauth/authorize',
			tokenUrl: 'https://wakatime.com/oauth/token',
			scopes: [
				'email',
				'read_stats',
				'read_summaries',
				'read_heartbeats',
				'write_heartbeats',
				'read_goals',
			],
			tokenAuthMethod: 'body',
		},
		schema: WakaTimeSchema,
		options: options,
		hooks: options.hooks,
		endpoints: wakaTimeEndpointsNested,
		endpointMeta: wakaTimeEndpointMeta,
		endpointSchemas: wakaTimeEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: WakaTimeKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			if (source === 'endpoint' && ctx.authType === 'oauth_2') {
				return getOAuthAccessToken(ctx, {
					plugin: 'wakatime',
					tokenUrl: 'https://wakatime.com/oauth/token',
				});
			}

			if (ctx.authType === 'managed') {
				if (!ctx.hub) {
					throw new Error(
						'[auth-missing:wakatime:managed]: Hub config is required for managed auth. Pass hub: { ... } to createCorsair().',
					);
				}

				const managedContext = {
					keys: ctx.keys,
					hub: ctx.hub,
					plugin: 'wakatime',
					tenantId: ctx.tenantId,
				};

				const result = await getManagedAccessToken(managedContext);
				await attachManagedRefreshAuth(ctx, managedContext);
				return result.accessToken;
			}

			throw new AuthMissingError('wakatime', 'oauth_2');
		},
	} satisfies InternalWakaTimePlugin;
}

export type {
	GetCurrentUserInput,
	GetCurrentUserResponse,
	WakaTimeEndpointInputs,
	WakaTimeEndpointOutputs,
} from './endpoints/types';
