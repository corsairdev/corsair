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
	litescrapeEndpointMeta as generatedEndpointMeta,
	litescrapeEndpointSchemas,
	litescrapeEndpointsNested,
} from './endpoints/catalog';
import type {
	LitescrapeEndpointInputs,
	LitescrapeEndpointOutputs,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { LitescrapeSchema } from './schema';

export type LitescrapePluginOptions = {
	/** Litescrape web-data API: search engines, maps, shopping, social, jobs and real estate. */
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalLitescrapePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof litescrapeEndpointsNested>;
};

export type LitescrapeContext = CorsairPluginContext<
	typeof LitescrapeSchema,
	LitescrapePluginOptions
>;

export type LitescrapeKeyBuilderContext =
	KeyBuilderContext<LitescrapePluginOptions>;

export type LitescrapeBoundEndpoints = BindEndpoints<
	typeof litescrapeEndpointsNested
>;

export type LitescrapeEndpoints = {
	[Id in keyof LitescrapeEndpointOutputs]: CorsairEndpoint<
		LitescrapeContext,
		LitescrapeEndpointInputs[Id],
		LitescrapeEndpointOutputs[Id]
	>;
};

/**
 * No webhook capability. The Litescrape API exposes only request/response
 * operations and publishes no inbound event verification spec, so there is
 * nothing for this plugin to receive or match.
 */
const litescrapeWebhooksNested = {} as const;

export { litescrapeEndpointSchemas };

// One entry per operation, generated with the catalog (endpoints/catalog.ts).
const litescrapeEndpointMeta =
	generatedEndpointMeta satisfies RequiredPluginEndpointMeta<
		typeof litescrapeEndpointsNested
	>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const litescrapeAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseLitescrapePlugin<T extends LitescrapePluginOptions> =
	CorsairPlugin<
		'litescrape',
		typeof LitescrapeSchema,
		typeof litescrapeEndpointsNested,
		typeof litescrapeWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalLitescrapePlugin =
	BaseLitescrapePlugin<LitescrapePluginOptions>;

export type ExternalLitescrapePlugin<T extends LitescrapePluginOptions> =
	BaseLitescrapePlugin<T>;

export function litescrape<const T extends LitescrapePluginOptions>(
	incomingOptions: LitescrapePluginOptions & T = {} as LitescrapePluginOptions &
		T,
): ExternalLitescrapePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'litescrape',
		authConfig: litescrapeAuthConfig,
		schema: LitescrapeSchema,
		options: options,
		hooks: options.hooks,
		endpoints: litescrapeEndpointsNested,
		webhooks: litescrapeWebhooksNested,
		endpointMeta: litescrapeEndpointMeta,
		endpointSchemas: litescrapeEndpointSchemas,
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
		// Returns the stored LiteScrape key (or the explicit option). When no
		// key is configured this throws AuthMissingError so core creates the
		// account-connect prompt for the tenant.
		keyBuilder: async (ctx: LitescrapeKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint') {
				const storedKey = await tryGetStoredKey(() => ctx.keys?.get_api_key());
				if (!storedKey) {
					throw new AuthMissingError('litescrape', 'api_key');
				}
				return storedKey;
			}

			return '';
		},
	} satisfies InternalLitescrapePlugin;
}

export {
	getLitescrapeInputSchema,
	getLitescrapeOutputSchema,
	LITESCRAPE_OPERATION_IDS,
} from './endpoints';
export type {
	LitescrapeEndpointInputs,
	LitescrapeEndpointOutputs,
	LitescrapeJsonValue,
	LitescrapeOperationId,
} from './endpoints/types';
export {
	LitescrapeEndpointInputSchemas,
	LitescrapeEndpointOutputSchemas,
} from './endpoints/types';
