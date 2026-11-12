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
import type { z } from 'zod';
import {
	DeployHQEndpoints,
	deployHQEndpointSchemas,
	deployHQEndpointMeta as generatedDeployHQEndpointMeta,
} from './endpoints';
import {
	deployHQOperationKeys,
	deployHQOperations,
} from './endpoints/openapi-operations';
import { errorHandlers } from './error-handlers';
import { DeployHQSchema } from './schema';

export type DeployHQPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	username?: string;
	accountSubdomain?: string;
	hooks?: InternalDeployHQPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof DeployHQEndpoints>;
};

export type DeployHQContext = CorsairPluginContext<
	typeof DeployHQSchema,
	DeployHQPluginOptions,
	undefined,
	typeof deployHQAuthConfig
>;

export type DeployHQKeyBuilderContext = KeyBuilderContext<
	DeployHQPluginOptions,
	typeof deployHQAuthConfig
>;

export type DeployHQBoundEndpoints = BindEndpoints<typeof DeployHQEndpoints>;
export type DeployHQEndpointInputs = {
	[Key in (typeof deployHQOperationKeys)[number]]: z.infer<
		(typeof deployHQOperations)[Key]['inputSchema']
	>;
};
export type DeployHQEndpointOutputs = {
	[Key in (typeof deployHQOperationKeys)[number]]: z.infer<
		(typeof deployHQOperations)[Key]['outputSchema']
	>;
};

const defaultAuthType: AuthTypes = 'api_key' as const;

export const deployHQAuthConfig = {
	api_key: {
		account: ['username', 'account_subdomain'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseDeployHQPlugin<T extends DeployHQPluginOptions> = CorsairPlugin<
	'deployhq',
	typeof DeployHQSchema,
	typeof DeployHQEndpoints,
	Record<string, never>,
	T,
	typeof defaultAuthType,
	typeof deployHQAuthConfig
>;

export type InternalDeployHQPlugin = BaseDeployHQPlugin<DeployHQPluginOptions>;
export type ExternalDeployHQPlugin<T extends DeployHQPluginOptions> =
	BaseDeployHQPlugin<T>;

const deployHQEndpointMeta =
	generatedDeployHQEndpointMeta satisfies RequiredPluginEndpointMeta<
		typeof DeployHQEndpoints
	>;

const publicOperations: ReadonlySet<string> = new Set(
	deployHQOperationKeys.filter(
		(operation) => deployHQOperations[operation].public,
	),
);

function configuredErrorHandlers(
	customHandlers?: CorsairErrorHandler,
): CorsairErrorHandler {
	const { DEFAULT: builtInDefault, ...builtIns } = errorHandlers;
	const { DEFAULT: callerDefault, ...callers } = customHandlers ?? {};
	return {
		...callers,
		...builtIns,
		...callers,
		DEFAULT: callerDefault ?? builtInDefault,
	};
}

export function deployhq<const T extends DeployHQPluginOptions>(
	incomingOptions: DeployHQPluginOptions & T = {} as DeployHQPluginOptions & T,
): ExternalDeployHQPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'deployhq',
		authConfig: deployHQAuthConfig,
		schema: DeployHQSchema,
		options,
		hooks: options.hooks,
		endpoints: DeployHQEndpoints,
		webhooks: {},
		endpointMeta: deployHQEndpointMeta,
		endpointSchemas: deployHQEndpointSchemas,
		errorHandlers: configuredErrorHandlers(options.errorHandlers),
		keyBuilder: async (context: DeployHQKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (publicOperations.has(context.meteredOperationId ?? '')) return '';
			const accountSubdomain =
				options.accountSubdomain ??
				(await context.keys?.get_account_subdomain()) ??
				undefined;
			const apiKey =
				options.key ?? (await context.keys?.get_api_key()) ?? undefined;
			const username =
				options.username ?? (await context.keys?.get_username()) ?? undefined;
			if (!accountSubdomain || !apiKey || !username) {
				throw new AuthMissingError('deployhq', 'api_key');
			}
			return apiKey;
		},
	} satisfies InternalDeployHQPlugin;
}

export { DeployHQEndpoints, deployHQEndpointMeta, deployHQEndpointSchemas };
export type {
	DeployHQOperationInput,
	DeployHQOperationKey,
	DeployHQOperationOutput,
} from './endpoints/runtime';
export { runDeployHQOperation } from './endpoints/runtime';
