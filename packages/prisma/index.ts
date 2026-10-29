import type {
	AuthTypes,
	BindEndpoints,
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
	prismaEndpointMeta as generatedPrismaEndpointMeta,
	prismaEndpointSchemas,
	prismaEndpointsNested,
} from './endpoints';
import { errorHandlers } from './error-handlers';
import { PrismaSchema } from './schema';

export const prismaEndpointMeta =
	generatedPrismaEndpointMeta satisfies RequiredPluginEndpointMeta<
		typeof prismaEndpointsNested
	>;

export type PrismaPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	hooks?: InternalPrismaPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof prismaEndpointsNested>;
};

export type PrismaContext = CorsairPluginContext<
	typeof PrismaSchema,
	PrismaPluginOptions
>;

export type PrismaKeyBuilderContext = KeyBuilderContext<PrismaPluginOptions>;

export type PrismaBoundEndpoints = BindEndpoints<typeof prismaEndpointsNested>;

export type PrismaEndpoints = typeof prismaEndpointsNested;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const prismaAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BasePrismaPlugin<T extends PrismaPluginOptions> = CorsairPlugin<
	'prisma',
	typeof PrismaSchema,
	typeof prismaEndpointsNested,
	{},
	T,
	typeof defaultAuthType,
	typeof prismaAuthConfig
>;

export type InternalPrismaPlugin = BasePrismaPlugin<PrismaPluginOptions>;

export type ExternalPrismaPlugin<T extends PrismaPluginOptions> =
	BasePrismaPlugin<T>;

export function prisma<const T extends PrismaPluginOptions>(
	// The empty object keeps plugin setup ergonomic while preserving selected auth options.
	incomingOptions: PrismaPluginOptions & T = {} as PrismaPluginOptions & T,
): ExternalPrismaPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'prisma',
		schema: PrismaSchema,
		options: options,
		authConfig: prismaAuthConfig,
		hooks: options.hooks,
		endpoints: prismaEndpointsNested,
		webhooks: {},
		endpointMeta: prismaEndpointMeta,
		endpointSchemas: prismaEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: {
			...(({ DEFAULT: _defaultHandler, ...rest }) => rest)(errorHandlers),
			...(({ DEFAULT: _customDefault, ...rest }) => rest)(
				options.errorHandlers ?? {},
			),
			DEFAULT: options.errorHandlers?.DEFAULT ?? errorHandlers.DEFAULT,
		},
		keyBuilder: async (ctx: PrismaKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('prisma', 'api_key');
				}
				return res;
			}

			if (source === 'endpoint' && ctx.authType === 'oauth_2') {
				const res = await ctx.keys.get_access_token();
				if (!res) {
					throw new AuthMissingError('prisma', 'oauth_2');
				}
				return res;
			}

			throw new AuthMissingError('prisma', ctx.authType);
		},
	} satisfies InternalPrismaPlugin;
}

export type {
	PrismaEndpointInput,
	PrismaEndpointInputs,
	PrismaEndpointOutput,
	PrismaEndpointOutputs,
} from './endpoints/types';

export { prismaEndpointSchemas, prismaEndpointsNested };
