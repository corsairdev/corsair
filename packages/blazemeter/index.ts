import type {
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
	blazemeterEndpointMeta,
	blazemeterEndpointSchemas,
	blazemeterEndpointsNested,
} from './endpoints';
import { errorHandlers } from './error-handlers';
import { BlazemeterSchema } from './schema';

/**
 * Exhaustiveness gate: every path in the endpoint tree must carry metadata.
 * Paired with the catalog/tree equality proof in `endpoints/index.ts`, adding an
 * endpoint without a catalog entry — or a catalog entry without a tree path —
 * fails to compile rather than silently shipping an unlabelled endpoint.
 */
const endpointMeta =
	blazemeterEndpointMeta satisfies RequiredPluginEndpointMeta<
		typeof blazemeterEndpointsNested
	>;

export const blazemeterAuthConfig = {
	api_key: {
		account: ['api_key_secret'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BlazemeterPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** API key ID, or `apiKeyId:apiKeySecret` for a compact local override. */
	key?: string;
	apiKeySecret?: string;
	credentials?: {
		apiKeyId: string;
		apiKeySecret: string;
	};
	hooks?: InternalBlazemeterPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof blazemeterEndpointsNested>;
};

export type BlazemeterContext = CorsairPluginContext<
	typeof BlazemeterSchema,
	BlazemeterPluginOptions,
	undefined,
	typeof blazemeterAuthConfig
>;

export type BlazemeterKeyBuilderContext = KeyBuilderContext<
	BlazemeterPluginOptions,
	typeof blazemeterAuthConfig
>;

export type BlazemeterEndpoints = typeof blazemeterEndpointsNested;
export type BlazemeterBoundEndpoints = BindEndpoints<
	typeof blazemeterEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

export type BaseBlazemeterPlugin<T extends BlazemeterPluginOptions> =
	CorsairPlugin<
		'blazemeter',
		typeof BlazemeterSchema,
		typeof blazemeterEndpointsNested,
		Record<string, never>,
		T,
		typeof defaultAuthType,
		typeof blazemeterAuthConfig
	>;

export type InternalBlazemeterPlugin =
	BaseBlazemeterPlugin<BlazemeterPluginOptions>;
export type ExternalBlazemeterPlugin<T extends BlazemeterPluginOptions> =
	BaseBlazemeterPlugin<T>;

export function blazemeter<const T extends BlazemeterPluginOptions>(
	incomingOptions: BlazemeterPluginOptions & T = {} as BlazemeterPluginOptions &
		T,
): ExternalBlazemeterPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'blazemeter',
		authConfig: blazemeterAuthConfig,
		schema: BlazemeterSchema,
		options,
		hooks: options.hooks,
		endpoints: blazemeterEndpointsNested,
		webhooks: {},
		endpointMeta,
		endpointSchemas: blazemeterEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: BlazemeterKeyBuilderContext, source) => {
			if (source !== 'endpoint') {
				throw new AuthMissingError('blazemeter', 'api_key');
			}

			if (options.credentials) {
				return `${options.credentials.apiKeyId}:${options.credentials.apiKeySecret}`;
			}
			if (options.key?.includes(':') && !options.apiKeySecret) {
				return options.key;
			}
			if (options.key && options.apiKeySecret) {
				return `${options.key}:${options.apiKeySecret}`;
			}

			if (ctx.authType === 'api_key') {
				const apiKeyId = await ctx.keys.get_api_key();
				const apiKeySecret = await ctx.keys.get_api_key_secret();
				if (apiKeyId && apiKeySecret) {
					return `${apiKeyId}:${apiKeySecret}`;
				}
			}

			throw new AuthMissingError('blazemeter', 'api_key');
		},
	} satisfies InternalBlazemeterPlugin;
}

export {
	BLAZEMETER_BASE_URLS,
	BlazemeterAPIError,
	basicAuthorization,
	parseBlazemeterCredentials,
} from './client';
export {
	blazemeterEndpointMeta,
	blazemeterEndpointSchemas,
	blazemeterEndpointsNested,
} from './endpoints';
export {
	BlazemeterCoreResponseSchema,
	BlazemeterEndpointInputSchemas,
	BlazemeterEndpointOutputSchemas,
	inputSchemaFor,
} from './endpoints/types';
export type {
	BlazemeterCatalogSlug,
	BlazemeterEndpointInput,
	BlazemeterOperation,
	BlazemeterOperationDefinition,
	BlazemeterOperationKey,
} from './operations';
export {
	BLAZEMETER_OPERATIONS,
	buildBlazemeterBody,
	buildBlazemeterFormData,
	buildBlazemeterQuery,
	getBlazemeterOperation,
	resolveBlazemeterPath,
} from './operations';
export { BlazemeterSchema } from './schema';
