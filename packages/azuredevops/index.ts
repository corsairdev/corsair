import type {
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
import type { AzureDevopsAuthOptions } from './auth';
import {
	azuredevopsAccountFields,
	checkAzureDevopsStoredPairing,
	resolveAzureDevopsTarget,
} from './auth';
import { tryGetStoredKey } from './client';
import {
	azuredevopsEndpointSchemas,
	azuredevopsEndpointsNested,
	azuredevopsEndpointMeta as generatedEndpointMeta,
} from './endpoints/catalog';
import type {
	AzureDevopsEndpointInputs,
	AzureDevopsEndpointOutputs,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { AzureDevopsSchema } from './schema';

export type AzureDevopsPluginOptions = AzureDevopsAuthOptions & {
	authType?: PickAuth<'api_key'>;
	/** An Azure DevOps personal access token (User settings > Personal access tokens). Its scopes decide which operations work. */
	key?: string;
	hooks?: InternalAzureDevopsPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof azuredevopsEndpointsNested>;
};

/**
 * One API key per connected account. Each token belongs to one Azure DevOps organization (dev.azure.com/<organization>), so the account stores it
 * beside the key (auth.ts reads it).
 */
export const azuredevopsAuthConfig = {
	api_key: {
		account: azuredevopsAccountFields,
	},
} as const satisfies PluginAuthConfig;

export type AzureDevopsContext = CorsairPluginContext<
	typeof AzureDevopsSchema,
	AzureDevopsPluginOptions,
	undefined,
	typeof azuredevopsAuthConfig
>;

export type AzureDevopsKeyBuilderContext = KeyBuilderContext<
	AzureDevopsPluginOptions,
	typeof azuredevopsAuthConfig
>;

export type AzureDevopsBoundEndpoints = BindEndpoints<
	typeof azuredevopsEndpointsNested
>;

export type AzureDevopsEndpoints = {
	[Id in keyof AzureDevopsEndpointOutputs]: CorsairEndpoint<
		AzureDevopsContext,
		AzureDevopsEndpointInputs[Id],
		AzureDevopsEndpointOutputs[Id]
	>;
};

export { azuredevopsEndpointSchemas };

// One entry per operation, generated with the catalog (endpoints/catalog.ts).
const azuredevopsEndpointMeta =
	generatedEndpointMeta satisfies RequiredPluginEndpointMeta<
		typeof azuredevopsEndpointsNested
	>;

const defaultAuthType = 'api_key' as const;

export type BaseAzureDevopsPlugin<T extends AzureDevopsPluginOptions> =
	CorsairPlugin<
		'azuredevops',
		typeof AzureDevopsSchema,
		typeof azuredevopsEndpointsNested,
		{},
		T,
		typeof defaultAuthType,
		typeof azuredevopsAuthConfig
	>;

export type InternalAzureDevopsPlugin =
	BaseAzureDevopsPlugin<AzureDevopsPluginOptions>;

export type ExternalAzureDevopsPlugin<T extends AzureDevopsPluginOptions> =
	BaseAzureDevopsPlugin<T>;

export function azuredevops<const T extends AzureDevopsPluginOptions>(
	// Safe: every AzureDevopsPluginOptions field is optional, so an empty object satisfies it.
	incomingOptions: AzureDevopsPluginOptions &
		T = {} as AzureDevopsPluginOptions & T,
): ExternalAzureDevopsPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'azuredevops',
		schema: AzureDevopsSchema,
		options: options,
		hooks: options.hooks,
		endpoints: azuredevopsEndpointsNested,
		webhooks: {},
		authConfig: azuredevopsAuthConfig,
		endpointMeta: azuredevopsEndpointMeta,
		endpointSchemas: azuredevopsEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: (() => {
			// Core uses the first handler whose matcher accepts the error, and
			// DEFAULT matches everything, so DEFAULT always goes last; otherwise
			// it would shadow a handler a caller adds through options.
			const { DEFAULT: builtInDefault, ...specificDefaults } = errorHandlers;
			const { DEFAULT: callerDefault, ...callerHandlers } =
				options.errorHandlers || {};
			return {
				...specificDefaults,
				...callerHandlers,
				DEFAULT: callerDefault || builtInDefault,
			};
		})(),
		keyBuilder: async (ctx: AzureDevopsKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (options.key) {
				// Fails fast (AuthMissingError) when the site the key belongs to is not set.
				await resolveAzureDevopsTarget({
					key: options.key,
					options,
					keys: ctx.keys,
				});
				return options.key;
			}

			// No key configured: AuthMissingError makes core ask the tenant to connect.
			const storedKey = await tryGetStoredKey(() => ctx.keys?.get_api_key());
			if (!storedKey) throw new AuthMissingError('azuredevops', 'api_key');
			// A stored key belongs to the stored site: a site option pointing
			// elsewhere would hand it to another host, so that needs its own key.
			await checkAzureDevopsStoredPairing(options, ctx.keys);
			await resolveAzureDevopsTarget({
				key: storedKey,
				options,
				keys: ctx.keys,
			});
			return storedKey;
		},
	} satisfies InternalAzureDevopsPlugin;
}

export {
	AZUREDEVOPS_OPERATION_IDS,
	createAzureDevopsOperation,
	getAzureDevopsInputSchema,
	getAzureDevopsOutputSchema,
} from './endpoints';
export type {
	AzureDevopsEndpointInputs,
	AzureDevopsEndpointOutputs,
	AzureDevopsJsonValue,
	AzureDevopsOperationId,
} from './endpoints/types';
export {
	AzureDevopsEndpointInputSchemas,
	AzureDevopsEndpointOutputSchemas,
} from './endpoints/types';
