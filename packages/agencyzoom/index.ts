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
	agencyZoomEndpointMeta as generatedAgencyZoomEndpointMeta,
	agencyZoomEndpointSchemas,
	agencyZoomEndpointsNested,
} from './endpoints';
import { errorHandlers } from './error-handlers';
import { AgencyZoomSchema } from './schema';

export const agencyZoomEndpointMeta =
	generatedAgencyZoomEndpointMeta satisfies RequiredPluginEndpointMeta<
		typeof agencyZoomEndpointsNested
	>;

export type AgencyZoomPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalAgencyZoomPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof agencyZoomEndpointsNested>;
};

export type AgencyZoomContext = CorsairPluginContext<
	typeof AgencyZoomSchema,
	AgencyZoomPluginOptions
>;

export type AgencyZoomKeyBuilderContext = KeyBuilderContext<AgencyZoomPluginOptions>;

export type AgencyZoomBoundEndpoints = BindEndpoints<typeof agencyZoomEndpointsNested>;

export type AgencyZoomEndpoints = typeof agencyZoomEndpointsNested;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const agencyZoomAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseAgencyZoomPlugin<T extends AgencyZoomPluginOptions> = CorsairPlugin<
	'agencyzoom',
	typeof AgencyZoomSchema,
	typeof agencyZoomEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalAgencyZoomPlugin = BaseAgencyZoomPlugin<AgencyZoomPluginOptions>;

export type ExternalAgencyZoomPlugin<T extends AgencyZoomPluginOptions> =
	BaseAgencyZoomPlugin<T>;

export function agencyzoom<const T extends AgencyZoomPluginOptions>(
	incomingOptions: AgencyZoomPluginOptions & T = {} as AgencyZoomPluginOptions & T,
): ExternalAgencyZoomPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'agencyzoom',
		schema: AgencyZoomSchema,
		options,
		authConfig: agencyZoomAuthConfig,
		hooks: options.hooks,
		endpoints: agencyZoomEndpointsNested,
		webhooks: {},
		endpointMeta: agencyZoomEndpointMeta,
		endpointSchemas: agencyZoomEndpointSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: AgencyZoomKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					console.error(
						'[AGENCYZOOM] JWT token missing — connect AgencyZoom or pass key in plugin options.',
					);
					throw new AuthMissingError('agencyzoom', 'api_key');
				}
				return res;
			}

			console.error(
				'[AGENCYZOOM] Authentication required for AgencyZoom API requests.',
			);
			throw new AuthMissingError('agencyzoom', 'api_key');
		},
	} satisfies InternalAgencyZoomPlugin;
}

export type {
	AgencyZoomEndpointInputs,
	AgencyZoomEndpointOutputs,
} from './endpoints/types';

export { agencyZoomEndpointsNested, agencyZoomEndpointSchemas };
