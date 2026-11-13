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
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { ElorusEndpoints } from './endpoints';
import { elorusEndpointMeta } from './endpoints/meta';
import type {
	ElorusOperationInputs,
	ElorusOperationOutputs,
} from './endpoints/operation';
import { elorusOperationSchemas } from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ElorusSchema } from './schema';

export type ElorusPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	organizationId?: string;
	demo?: boolean;
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof ElorusEndpoints>;
};

export const elorusAuthConfig = {
	api_key: {
		account: ['organization_id'] as const,
	},
} as const satisfies PluginAuthConfig;

const defaultAuthType: AuthTypes = 'api_key' as const;

export type ElorusContext = CorsairPluginContext<
	typeof ElorusSchema,
	ElorusPluginOptions,
	undefined,
	typeof elorusAuthConfig
>;

export type ElorusKeyBuilderContext = KeyBuilderContext<
	ElorusPluginOptions,
	typeof elorusAuthConfig
>;

export type ElorusBoundEndpoints = BindEndpoints<typeof ElorusEndpoints>;
export type ElorusEndpointInputs = ElorusOperationInputs;
export type ElorusEndpointOutputs = ElorusOperationOutputs;

export type BaseElorusPlugin<T extends ElorusPluginOptions> = CorsairPlugin<
	'elorus',
	typeof ElorusSchema,
	typeof ElorusEndpoints,
	Record<string, never>,
	T,
	typeof defaultAuthType,
	typeof elorusAuthConfig
>;

export type InternalElorusPlugin = BaseElorusPlugin<ElorusPluginOptions>;
export type ExternalElorusPlugin<T extends ElorusPluginOptions> =
	BaseElorusPlugin<T>;

export const elorusEndpointSchemas =
	elorusOperationSchemas satisfies RequiredPluginEndpointSchemas<
		typeof ElorusEndpoints
	>;

export const elorusEndpointMetadata =
	elorusEndpointMeta satisfies RequiredPluginEndpointMeta<
		typeof ElorusEndpoints
	>;

export function elorus<const T extends ElorusPluginOptions>(
	incomingOptions: ElorusPluginOptions & T = {} as ElorusPluginOptions & T,
): ExternalElorusPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'elorus',
		authConfig: elorusAuthConfig,
		schema: ElorusSchema,
		options,
		endpoints: ElorusEndpoints,
		webhooks: {},
		endpointMeta: elorusEndpointMetadata,
		endpointSchemas: elorusEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ElorusKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			const apiKey = options.key ?? (await ctx.keys.get_api_key());
			const organizationId =
				options.organizationId ?? (await ctx.keys.get_organization_id());
			if (!apiKey || !organizationId) {
				throw new AuthMissingError(
					'elorus',
					'api_key',
					'Connect Elorus with an API key and organization ID before making API calls.',
				);
			}
			return apiKey;
		},
	} satisfies InternalElorusPlugin;
}

export { ELORUS_API_BASE, ElorusAPIError } from './client';
export type {
	ElorusOperationInputs,
	ElorusOperationOutputs,
} from './endpoints/operation';
export type { ElorusOperationKey } from './endpoints/types';
