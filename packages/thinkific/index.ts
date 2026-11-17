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
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { normalizeThinkificSubdomain } from './client';
import {
	thinkificEndpointMeta as generatedThinkificEndpointMeta,
	thinkificEndpointSchemas as generatedThinkificEndpointSchemas,
	thinkificEndpointsNested,
} from './endpoints';
import type {
	ThinkificEndpointInputs,
	ThinkificEndpointOutputs,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ThinkificSchema } from './schema';

/**
 * The site subdomain (`acme` for `acme.thinkific.com`) is an account field, so Hub asks for it
 * next to the API key and the key manager generates `get_subdomain()` for it.
 */
export const thinkificAuthConfig = {
	api_key: {
		account: ['subdomain'] as const,
	},
} as const satisfies PluginAuthConfig;

export const thinkificEndpointSchemas =
	generatedThinkificEndpointSchemas satisfies RequiredPluginEndpointSchemas<
		typeof thinkificEndpointsNested
	>;

export const thinkificEndpointMeta =
	generatedThinkificEndpointMeta satisfies RequiredPluginEndpointMeta<
		typeof thinkificEndpointsNested
	>;

export type ThinkificPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalThinkificPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof thinkificEndpointsNested>;
};

export type ThinkificContext = CorsairPluginContext<
	typeof ThinkificSchema,
	ThinkificPluginOptions,
	typeof thinkificEndpointsNested,
	typeof thinkificAuthConfig
>;

export type ThinkificKeyBuilderContext = KeyBuilderContext<
	ThinkificPluginOptions,
	typeof thinkificAuthConfig
>;

export type ThinkificBoundEndpoints = BindEndpoints<
	typeof thinkificEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

export type BaseThinkificPlugin<T extends ThinkificPluginOptions> =
	CorsairPlugin<
		'thinkific',
		typeof ThinkificSchema,
		typeof thinkificEndpointsNested,
		Record<string, never>,
		T,
		typeof defaultAuthType,
		typeof thinkificAuthConfig
	>;

export type InternalThinkificPlugin =
	BaseThinkificPlugin<ThinkificPluginOptions>;

export type ExternalThinkificPlugin<T extends ThinkificPluginOptions> =
	BaseThinkificPlugin<T>;

export function thinkific<const T extends ThinkificPluginOptions>(
	incomingOptions: ThinkificPluginOptions & T = {} as ThinkificPluginOptions &
		T,
): ExternalThinkificPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	const { DEFAULT: builtInDefault, ...builtInHandlers } = errorHandlers;
	const { DEFAULT: callerDefault, ...callerHandlers } =
		options.errorHandlers ?? {};

	return {
		id: 'thinkific',
		authConfig: thinkificAuthConfig,
		schema: ThinkificSchema,
		options,
		hooks: options.hooks,
		endpoints: thinkificEndpointsNested,
		webhooks: {},
		endpointMeta: thinkificEndpointMeta,
		endpointSchemas: thinkificEndpointSchemas,
		errorHandlers: {
			...builtInHandlers,
			...callerHandlers,
			DEFAULT: callerDefault ?? builtInDefault,
		},
		keyBuilder: async (ctx: ThinkificKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';

			const apiKey = options.key ?? (await ctx.keys.get_api_key());
			if (!apiKey) {
				throw new AuthMissingError('thinkific', 'api_key');
			}
			// A key without a subdomain can't reach any site. Failing here, not in the endpoint,
			// lets core hand back a connect link.
			if (!normalizeThinkificSubdomain(await ctx.keys.get_subdomain())) {
				throw new AuthMissingError(
					'thinkific',
					'api_key',
					'Thinkific subdomain is not set: connect the account with its site subdomain (acme for acme.thinkific.com).',
				);
			}
			return apiKey;
		},
	} satisfies InternalThinkificPlugin;
}

export type { ThinkificEndpointInputs, ThinkificEndpointOutputs };

export { ThinkificComponentSchemas } from './endpoints/schemas';
