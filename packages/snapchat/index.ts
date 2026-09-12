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
import { Actions } from './endpoints';
import type {
	SnapchatEndpointInputs,
	SnapchatEndpointOutputs,
} from './endpoints/types';
import {
	SnapchatEndpointInputSchemas,
	SnapchatEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import type { SnapchatOperationName } from './operations';
import { SNAPCHAT_OPERATIONS } from './operations';
import { SnapchatSchema } from './schema';

export const snapchatAuthConfig = {
	oauth_2: {},
} as const satisfies PluginAuthConfig;

export type SnapchatPluginOptions = {
	authType?: PickAuth<'oauth_2'>;
	key?: string;
	composioApiKey?: string;
	connectedAccountId?: string;
	userId?: string;
	composioBaseUrl?: string;
	timeoutMs?: number;
	signal?: AbortSignal;
	hooks?: InternalSnapchatPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof snapchatEndpointsNested>;
};

export type SnapchatContext = CorsairPluginContext<
	typeof SnapchatSchema,
	SnapchatPluginOptions,
	undefined,
	typeof snapchatAuthConfig
>;

export type SnapchatKeyBuilderContext = KeyBuilderContext<
	SnapchatPluginOptions,
	typeof snapchatAuthConfig
>;

type SnapchatEndpoint<K extends SnapchatOperationName> = CorsairEndpoint<
	SnapchatContext,
	SnapchatEndpointInputs[K],
	SnapchatEndpointOutputs[K]
>;

export type SnapchatEndpoints = {
	[K in SnapchatOperationName]: SnapchatEndpoint<K>;
};

const snapchatEndpointsNested = {
	actions: Actions,
} as const;

export type SnapchatBoundEndpoints = BindEndpoints<
	typeof snapchatEndpointsNested
>;

type SnapchatEndpointSchemaKey = `actions.${SnapchatOperationName}`;

export const snapchatEndpointSchemas = Object.fromEntries(
	SNAPCHAT_OPERATIONS.map((operation) => [
		`actions.${operation.name}`,
		{
			input: SnapchatEndpointInputSchemas[operation.name],
			output: SnapchatEndpointOutputSchemas[operation.name],
		},
	]),
) as Record<
	SnapchatEndpointSchemaKey,
	{
		input: (typeof SnapchatEndpointInputSchemas)[SnapchatOperationName];
		output: (typeof SnapchatEndpointOutputSchemas)[SnapchatOperationName];
	}
> satisfies RequiredPluginEndpointSchemas<typeof snapchatEndpointsNested>;

const defaultAuthType = 'oauth_2' as const satisfies AuthTypes;

export const snapchatEndpointMeta = Object.fromEntries(
	SNAPCHAT_OPERATIONS.map((operation) => [
		`actions.${operation.name}`,
		{
			riskLevel: operation.riskLevel,
			description: operation.title,
		},
	]),
) as Record<
	SnapchatEndpointSchemaKey,
	{
		riskLevel: (typeof SNAPCHAT_OPERATIONS)[number]['riskLevel'];
		description: string;
	}
> satisfies RequiredPluginEndpointMeta<typeof snapchatEndpointsNested>;

export type BaseSnapchatPlugin<T extends SnapchatPluginOptions> = CorsairPlugin<
	'snapchat',
	typeof SnapchatSchema,
	typeof snapchatEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType
>;

export type InternalSnapchatPlugin = BaseSnapchatPlugin<SnapchatPluginOptions>;

export type ExternalSnapchatPlugin<T extends SnapchatPluginOptions> =
	BaseSnapchatPlugin<T>;

export function snapchat<const T extends SnapchatPluginOptions>(
	incomingOptions: SnapchatPluginOptions & T = {} as SnapchatPluginOptions & T,
): ExternalSnapchatPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'snapchat',
		authConfig: snapchatAuthConfig,
		oauthConfig: {
			providerName: 'Snapchat',
			authUrl: 'https://accounts.snapchat.com/login/oauth2/authorize',
			tokenUrl: 'https://accounts.snapchat.com/login/oauth2/access_token',
			scopes: ['snapchat-marketing-api'],
		},
		schema: SnapchatSchema,
		options,
		hooks: options.hooks,
		endpoints: snapchatEndpointsNested,
		webhooks: {},
		endpointMeta: snapchatEndpointMeta,
		endpointSchemas: snapchatEndpointSchemas,
		webhookSchemas: {},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: SnapchatKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'oauth_2') {
				const token = await ctx.keys.get_access_token();
				if (!token) {
					throw new AuthMissingError('snapchat', 'oauth_2');
				}
				return token;
			}

			throw new AuthMissingError('snapchat', 'oauth_2');
		},
	} satisfies InternalSnapchatPlugin;
}

export type {
	SnapchatEndpointInputs,
	SnapchatEndpointOutputs,
} from './endpoints/types';
