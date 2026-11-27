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
import {
	createManagedPricingCredentialCache,
	resolveManagedPricingApiKey,
} from 'corsair/hub';
import { tryGetStoredKey } from './client';
import {
	scrapeCreatorsEndpointMeta as generatedEndpointMeta,
	scrapeCreatorsEndpointSchemas,
	scrapeCreatorsEndpointsNested,
} from './endpoints/catalog';
import type {
	ScrapeCreatorsEndpointInputs,
	ScrapeCreatorsEndpointOutputs,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ScrapeCreatorsSchema } from './schema';

export type ScrapeCreatorsPluginOptions = {
	/** Your own ScrapeCreators key (`api_key`), or Corsair's account billed in Corsair credits (`managed_pricing`). */
	authType?: PickAuth<'api_key' | 'managed_pricing'>;
	key?: string;
	hooks?: InternalScrapeCreatorsPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof scrapeCreatorsEndpointsNested>;
};

export type ScrapeCreatorsContext = CorsairPluginContext<
	typeof ScrapeCreatorsSchema,
	ScrapeCreatorsPluginOptions
>;

export type ScrapeCreatorsKeyBuilderContext =
	KeyBuilderContext<ScrapeCreatorsPluginOptions>;

export type ScrapeCreatorsBoundEndpoints = BindEndpoints<
	typeof scrapeCreatorsEndpointsNested
>;

export type ScrapeCreatorsEndpoints = {
	[Id in keyof ScrapeCreatorsEndpointOutputs]: CorsairEndpoint<
		ScrapeCreatorsContext,
		ScrapeCreatorsEndpointInputs[Id],
		ScrapeCreatorsEndpointOutputs[Id]
	>;
};

/**
 * No webhook capability: ScrapeCreators is request/response only and sends no
 * events.
 */
const scrapeCreatorsWebhooksNested = {} as const;

export { scrapeCreatorsEndpointSchemas };

// One entry per operation, generated with the catalog (endpoints/catalog.ts).
const scrapeCreatorsEndpointMeta =
	generatedEndpointMeta satisfies RequiredPluginEndpointMeta<
		typeof scrapeCreatorsEndpointsNested
	>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const scrapeCreatorsAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

// Short-lived keys Hub mints for Corsair's own ScrapeCreators account, one per
// metered operation, cached until they expire.
const scrapeCreatorsManagedPricingCache = createManagedPricingCredentialCache();

export type BaseScrapeCreatorsPlugin<T extends ScrapeCreatorsPluginOptions> =
	CorsairPlugin<
		'scrapecreators',
		typeof ScrapeCreatorsSchema,
		typeof scrapeCreatorsEndpointsNested,
		typeof scrapeCreatorsWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalScrapeCreatorsPlugin =
	BaseScrapeCreatorsPlugin<ScrapeCreatorsPluginOptions>;

export type ExternalScrapeCreatorsPlugin<
	T extends ScrapeCreatorsPluginOptions,
> = BaseScrapeCreatorsPlugin<T>;

export function scrapecreators<const T extends ScrapeCreatorsPluginOptions>(
	incomingOptions: ScrapeCreatorsPluginOptions &
		T = {} as ScrapeCreatorsPluginOptions & T,
): ExternalScrapeCreatorsPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	// managed_pricing runs on Corsair's key, which core gets from Hub without
	// asking the keyBuilder, so an explicit key would be dropped silently and
	// the call billed to Corsair credits. The two can't both apply.
	if (options.authType === 'managed_pricing' && options.key) {
		throw new Error(
			"scrapecreators: `key` can't be used with authType 'managed_pricing', which runs on Corsair's ScrapeCreators key. Drop `key`, or use authType 'api_key' to call ScrapeCreators with your own key.",
		);
	}
	return {
		id: 'scrapecreators',
		authConfig: scrapeCreatorsAuthConfig,
		schema: ScrapeCreatorsSchema,
		options: options,
		hooks: options.hooks,
		endpoints: scrapeCreatorsEndpointsNested,
		webhooks: scrapeCreatorsWebhooksNested,
		endpointMeta: scrapeCreatorsEndpointMeta,
		endpointSchemas: scrapeCreatorsEndpointSchemas,
		errorHandlers: (() => {
			// Core picks the first handler whose matcher accepts the error and
			// DEFAULT matches everything, so DEFAULT goes last, after any
			// handlers the caller adds (theirs replaces ours when given).
			const { DEFAULT: builtInDefault, ...specificDefaults } = errorHandlers;
			const { DEFAULT: callerDefault, ...callerHandlers } =
				options.errorHandlers || {};
			return {
				...specificDefaults,
				...callerHandlers,
				DEFAULT: callerDefault || builtInDefault,
			};
		})(),
		// Returns the explicit option, a key Hub mints on Corsair's account
		// (managed_pricing), or the stored ScrapeCreators key. With no key it
		// throws AuthMissingError so core asks the tenant to connect.
		keyBuilder: async (ctx: ScrapeCreatorsKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'managed_pricing') {
				return resolveManagedPricingApiKey(ctx, {
					plugin: 'scrapecreators',
					cache: scrapeCreatorsManagedPricingCache,
					operation: ctx.meteredOperationId,
				});
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const storedKey = await tryGetStoredKey(() => ctx.keys?.get_api_key());
				if (!storedKey) {
					throw new AuthMissingError('scrapecreators', 'api_key');
				}
				return storedKey;
			}

			if (source === 'endpoint') {
				throw new AuthMissingError('scrapecreators', ctx.authType ?? 'api_key');
			}

			return '';
		},
	} satisfies InternalScrapeCreatorsPlugin;
}

export {
	getScrapeCreatorsInputSchema,
	getScrapeCreatorsOutputSchema,
	SCRAPECREATORS_MAX_QUERY_LENGTH,
	SCRAPECREATORS_OPERATION_IDS,
} from './endpoints';
export type {
	ScrapeCreatorsEndpointInputs,
	ScrapeCreatorsEndpointOutputs,
	ScrapeCreatorsEnvelope,
	ScrapeCreatorsJsonValue,
	ScrapeCreatorsOperationId,
} from './endpoints/types';
export {
	ScrapeCreatorsEndpointInputSchemas,
	ScrapeCreatorsEndpointOutputSchemas,
} from './endpoints/types';
