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
	surfEndpointMeta,
	surfEndpointSchemas,
	surfEndpointsNested,
} from './endpoints/registry';
import type {
	SurfEndpointInputs,
	SurfEndpointOutputs,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { SurfSchema } from './schema';

export type SurfPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	baseUrl?: string;
	hooks?: InternalSurfPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof surfEndpointsNested>;
};

export const surfAuthConfig = {
	api_key: { account: [] as const },
} as const satisfies PluginAuthConfig;

export type SurfContext = CorsairPluginContext<
	typeof SurfSchema,
	SurfPluginOptions,
	undefined,
	typeof surfAuthConfig
>;

export type SurfKeyBuilderContext = KeyBuilderContext<
	SurfPluginOptions,
	typeof surfAuthConfig
>;

export type SurfBoundEndpoints = BindEndpoints<typeof surfEndpointsNested>;

type SurfEndpoint<K extends keyof SurfEndpointOutputs> = CorsairEndpoint<
	SurfContext,
	SurfEndpointInputs[K],
	SurfEndpointOutputs[K]
>;

export type SurfEndpoints = {
	[K in keyof SurfEndpointOutputs]: SurfEndpoint<K>;
};

const defaultAuthType: AuthTypes = 'api_key' as const;

export const surfEndpointSchemasChecked =
	surfEndpointSchemas satisfies RequiredPluginEndpointSchemas<
		typeof surfEndpointsNested
	>;

export const surfEndpointMetaChecked =
	surfEndpointMeta satisfies RequiredPluginEndpointMeta<
		typeof surfEndpointsNested
	>;

export type BaseSurfPlugin<T extends SurfPluginOptions> = CorsairPlugin<
	'surf',
	typeof SurfSchema,
	typeof surfEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalSurfPlugin = BaseSurfPlugin<SurfPluginOptions>;
export type ExternalSurfPlugin<T extends SurfPluginOptions> = BaseSurfPlugin<T>;

export function surf<const T extends SurfPluginOptions>(
	// The factory default is an empty options object. The generic T is the caller's options.
	incomingOptions: SurfPluginOptions & T = {} as SurfPluginOptions & T,
): ExternalSurfPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	// DEFAULT matches every error. It has to stay last, or a user handler
	// whose key is inserted after it never runs.
	const { DEFAULT, ...builtIns } = errorHandlers;
	const { DEFAULT: userDefault, ...userHandlers } = options.errorHandlers ?? {};
	return {
		id: 'surf',
		authConfig: surfAuthConfig,
		schema: SurfSchema,
		options,
		hooks: options.hooks,
		endpoints: surfEndpointsNested,
		endpointMeta: surfEndpointMetaChecked,
		endpointSchemas: surfEndpointSchemasChecked,
		errorHandlers: {
			...builtIns,
			...userHandlers,
			DEFAULT: userDefault ?? DEFAULT,
		},
		keyBuilder: async (ctx: SurfKeyBuilderContext) => {
			if (options.key) return options.key;
			const stored = await ctx.keys.get_api_key();
			if (!stored) throw new AuthMissingError('surf', 'api_key');
			return stored;
		},
	} satisfies InternalSurfPlugin;
}

export type {
	SurfEndpointInputs,
	SurfEndpointOutputs,
} from './endpoints/types';
