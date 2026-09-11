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
import { Account, Improvement, RemoveBackground } from './endpoints';
import type {
	RemovebgEndpointInputs,
	RemovebgEndpointOutputs,
} from './endpoints/types';
import {
	RemovebgEndpointInputSchemas,
	RemovebgEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { RemovebgSchema } from './schema';

export type RemovebgPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalRemovebgPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	/**
	 * Permission configuration for the remove.bg plugin.
	 * Controls what the AI agent is allowed to do.
	 * Overrides use dot-notation paths from the remove.bg endpoint tree — invalid paths are type errors.
	 */
	permissions?: PluginPermissionsConfig<typeof removebgEndpointsNested>;
};

export type RemovebgContext = CorsairPluginContext<
	typeof RemovebgSchema,
	RemovebgPluginOptions
>;

export type RemovebgKeyBuilderContext =
	KeyBuilderContext<RemovebgPluginOptions>;

export type RemovebgBoundEndpoints = BindEndpoints<
	typeof removebgEndpointsNested
>;

type RemovebgEndpoint<K extends keyof RemovebgEndpointOutputs> =
	CorsairEndpoint<
		RemovebgContext,
		RemovebgEndpointInputs[K],
		RemovebgEndpointOutputs[K]
	>;

export type RemovebgEndpoints = {
	account: RemovebgEndpoint<'account'>;
	removeBackground: RemovebgEndpoint<'removeBackground'>;
	improvement: RemovebgEndpoint<'improvement'>;
};

const removebgEndpointsNested = {
	account: {
		get: Account.get,
	},
	removeBackground: {
		remove: RemoveBackground.remove,
	},
	improvement: {
		submit: Improvement.submit,
	},
} as const;

const removebgWebhooksNested = {} as const;

export const removebgEndpointSchemas = {
	'account.get': {
		input: RemovebgEndpointInputSchemas.account,
		output: RemovebgEndpointOutputSchemas.account,
	},
	'removeBackground.remove': {
		input: RemovebgEndpointInputSchemas.removeBackground,
		output: RemovebgEndpointOutputSchemas.removeBackground,
	},
	'improvement.submit': {
		input: RemovebgEndpointInputSchemas.improvement,
		output: RemovebgEndpointOutputSchemas.improvement,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof removebgEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

/**
 * Risk-level metadata for each remove.bg endpoint.
 * Used by the MCP server permission system to decide allow / deny / require_approval.
 */
const removebgEndpointMeta = {
	'account.get': {
		riskLevel: 'read',
		description: 'Get account credit balance and API usage limits',
	},
	'removeBackground.remove': {
		riskLevel: 'write',
		description:
			'Remove the background from an image, returning a base64-encoded cutout',
	},
	'improvement.submit': {
		riskLevel: 'write',
		description:
			'Submit an image to the remove.bg Improvement program for AI training',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof removebgEndpointsNested>;

export const removebgAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseRemovebgPlugin<T extends RemovebgPluginOptions> = CorsairPlugin<
	'removebg',
	typeof RemovebgSchema,
	typeof removebgEndpointsNested,
	typeof removebgWebhooksNested,
	T,
	typeof defaultAuthType
>;

/**
 * We have to type the internal plugin separately from the external plugin
 * Because the internal plugin has to provide options for all possible auth methods
 * The external plugin has to provide options for the auth method the user has selected
 */
export type InternalRemovebgPlugin = BaseRemovebgPlugin<RemovebgPluginOptions>;

export type ExternalRemovebgPlugin<T extends RemovebgPluginOptions> =
	BaseRemovebgPlugin<T>;

export function removebg<const T extends RemovebgPluginOptions>(
	incomingOptions: RemovebgPluginOptions & T = {} as RemovebgPluginOptions & T,
): ExternalRemovebgPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'removebg',
		authConfig: removebgAuthConfig,
		schema: RemovebgSchema,
		options: options,
		hooks: options.hooks,
		endpoints: removebgEndpointsNested,
		webhooks: removebgWebhooksNested,
		endpointMeta: removebgEndpointMeta,
		endpointSchemas: removebgEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: RemovebgKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();

				if (!key) {
					throw new AuthMissingError('removebg', 'api_key');
				}

				return key;
			}

			throw new AuthMissingError('removebg', 'api_key');
		},
	} satisfies InternalRemovebgPlugin;
}

export type {
	AccountGetInput,
	AccountGetOutput,
	RemoveBackgroundInput,
	RemoveBackgroundOutput,
	RemovebgChannels,
	RemovebgEndpointInputs,
	RemovebgEndpointOutputs,
	RemovebgFormat,
	RemovebgImprovementErrorType,
	RemovebgShadowType,
	RemovebgSize,
	RemovebgType,
	RemovebgTypeLevel,
	SubmitImprovementInput,
	SubmitImprovementOutput,
} from './endpoints/types';
