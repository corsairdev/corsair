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
import { AuthMissingError } from 'corsair/core';
import { tryGetStoredKey } from './client';
import {
	openseoEndpointMeta as generatedEndpointMeta,
	openseoEndpointSchemas,
	openseoEndpointsNested,
} from './endpoints/catalog';
import type {
	OpenseoEndpointInputs,
	OpenseoEndpointOutputs,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { OpenseoSchema } from './schema';

export type OpenseoPluginOptions = {
	/** OpenSEO: keyword research, SERPs, backlinks, rank tracking, site audits, AI visibility, Search Console and GA4. */
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalOpenseoPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof openseoEndpointsNested>;
};

export type OpenseoContext = CorsairPluginContext<
	typeof OpenseoSchema,
	OpenseoPluginOptions
>;

export type OpenseoKeyBuilderContext = KeyBuilderContext<OpenseoPluginOptions>;

export type OpenseoBoundEndpoints = BindEndpoints<
	typeof openseoEndpointsNested
>;

export type OpenseoEndpoints = {
	[Id in keyof OpenseoEndpointOutputs]: CorsairEndpoint<
		OpenseoContext,
		OpenseoEndpointInputs[Id],
		OpenseoEndpointOutputs[Id]
	>;
};

/**
 * No webhook capability. OpenSEO's API is its MCP server, which exposes only
 * request/response tools and sends no outbound events, so there is nothing for
 * this plugin to receive or match.
 */
const openseoWebhooksNested = {} as const;

export { openseoEndpointSchemas };

// One entry per operation, generated with the catalog (endpoints/catalog.ts).
const openseoEndpointMeta =
	generatedEndpointMeta satisfies RequiredPluginEndpointMeta<
		typeof openseoEndpointsNested
	>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const openseoAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseOpenseoPlugin<T extends OpenseoPluginOptions> = CorsairPlugin<
	'openseo',
	typeof OpenseoSchema,
	typeof openseoEndpointsNested,
	typeof openseoWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalOpenseoPlugin = BaseOpenseoPlugin<OpenseoPluginOptions>;

export type ExternalOpenseoPlugin<T extends OpenseoPluginOptions> =
	BaseOpenseoPlugin<T>;

export function openseo<const T extends OpenseoPluginOptions>(
	incomingOptions: OpenseoPluginOptions & T = {} as OpenseoPluginOptions & T,
): ExternalOpenseoPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'openseo',
		authConfig: openseoAuthConfig,
		schema: OpenseoSchema,
		options: options,
		hooks: options.hooks,
		endpoints: openseoEndpointsNested,
		webhooks: openseoWebhooksNested,
		endpointMeta: openseoEndpointMeta,
		endpointSchemas: openseoEndpointSchemas,
		errorHandlers: (() => {
			// Core selects the first handler whose matcher accepts the error
			// (`Object.keys(...).find`), and DEFAULT matches everything, so
			// DEFAULT must always be evaluated last - otherwise it shadows any
			// custom handler a caller contributes through options. The caller's
			// DEFAULT is destructured out as well: spreading it in place would
			// keep its original key position, ahead of their other handlers.
			const { DEFAULT: builtInDefault, ...specificDefaults } = errorHandlers;
			const { DEFAULT: callerDefault, ...callerHandlers } =
				options.errorHandlers || {};
			return {
				...specificDefaults,
				...callerHandlers,
				DEFAULT: callerDefault || builtInDefault,
			};
		})(),
		// Returns the stored OpenSEO key (or the explicit option). When no
		// key is configured this throws AuthMissingError so core creates the
		// account-connect prompt for the tenant.
		keyBuilder: async (ctx: OpenseoKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint') {
				const storedKey = await tryGetStoredKey(() => ctx.keys?.get_api_key());
				if (!storedKey) {
					throw new AuthMissingError('openseo', 'api_key');
				}
				return storedKey;
			}

			return '';
		},
	} satisfies InternalOpenseoPlugin;
}

export { OpenseoAPIError } from './client';
export {
	getOpenseoInputSchema,
	getOpenseoOutputSchema,
	OPENSEO_OPERATION_IDS,
} from './endpoints';
export type {
	OpenseoEndpointInputs,
	OpenseoEndpointOutputs,
	OpenseoJsonValue,
	OpenseoOperationId,
} from './endpoints/types';
export {
	OpenseoEndpointInputSchemas,
	OpenseoEndpointOutputSchemas,
} from './endpoints/types';
