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
import { tryGetStoredKey } from './client';
import {
	chargebeeEndpointSchemas,
	chargebeeEndpointsNested,
	chargebeeEndpointMeta as generatedEndpointMeta,
} from './endpoints/catalog';
import type {
	ChargebeeEndpointInputs,
	ChargebeeEndpointOutputs,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ChargebeeSchema } from './schema';

export type ChargebeePluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** A Chargebee API key (Settings > Configure Chargebee > API Keys). Test and live sites have separate keys. */
	key?: string;
	/**
	 * The Chargebee site name, the part before `.chargebee.com` (`acme`, or
	 * `acme-test` for a test site). When unset, each connected account's stored
	 * `site` field is used.
	 */
	site?: string;
	/**
	 * Another API base, such as a proxy. Leave it out to use https://{site}.chargebee.com/api/v2.
	 */
	baseUrl?: string;
	hooks?: InternalChargebeePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof chargebeeEndpointsNested>;
};

/**
 * One API key per connected account, sent as HTTP Basic. Each account lives
 * on its own site, so the site name is an account field (`get_site()`) next
 * to the key; the `site` plugin option overrides it.
 */
export const chargebeeAuthConfig = {
	api_key: {
		account: ['site'] as const,
	},
} as const satisfies PluginAuthConfig;

export type ChargebeeContext = CorsairPluginContext<
	typeof ChargebeeSchema,
	ChargebeePluginOptions,
	undefined,
	typeof chargebeeAuthConfig
>;

export type ChargebeeKeyBuilderContext = KeyBuilderContext<
	ChargebeePluginOptions,
	typeof chargebeeAuthConfig
>;

export type ChargebeeBoundEndpoints = BindEndpoints<
	typeof chargebeeEndpointsNested
>;

export type ChargebeeEndpoints = {
	[Id in keyof ChargebeeEndpointOutputs]: CorsairEndpoint<
		ChargebeeContext,
		ChargebeeEndpointInputs[Id],
		ChargebeeEndpointOutputs[Id]
	>;
};

export { chargebeeEndpointSchemas };

// One entry per operation, generated with the catalog (endpoints/catalog.ts).
const chargebeeEndpointMeta =
	generatedEndpointMeta satisfies RequiredPluginEndpointMeta<
		typeof chargebeeEndpointsNested
	>;

const defaultAuthType = 'api_key' as const;

export type BaseChargebeePlugin<T extends ChargebeePluginOptions> =
	CorsairPlugin<
		'chargebee',
		typeof ChargebeeSchema,
		typeof chargebeeEndpointsNested,
		{},
		T,
		typeof defaultAuthType,
		typeof chargebeeAuthConfig
	>;

export type InternalChargebeePlugin =
	BaseChargebeePlugin<ChargebeePluginOptions>;

export type ExternalChargebeePlugin<T extends ChargebeePluginOptions> =
	BaseChargebeePlugin<T>;

export function chargebee<const T extends ChargebeePluginOptions>(
	// Safe: every ChargebeePluginOptions field is optional, so an empty object satisfies it.
	incomingOptions: ChargebeePluginOptions & T = {} as ChargebeePluginOptions &
		T,
): ExternalChargebeePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'chargebee',
		schema: ChargebeeSchema,
		options: options,
		hooks: options.hooks,
		endpoints: chargebeeEndpointsNested,
		webhooks: {},
		authConfig: chargebeeAuthConfig,
		endpointMeta: chargebeeEndpointMeta,
		endpointSchemas: chargebeeEndpointSchemas,
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
		keyBuilder: async (ctx: ChargebeeKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (options.key) return options.key;

			// No key configured: AuthMissingError makes core ask the tenant to connect.
			const storedKey = await tryGetStoredKey(() => ctx.keys?.get_api_key());
			if (!storedKey) throw new AuthMissingError('chargebee', 'api_key');
			return storedKey;
		},
	} satisfies InternalChargebeePlugin;
}

export {
	CHARGEBEE_OPERATION_IDS,
	createChargebeeOperation,
	getChargebeeInputSchema,
	getChargebeeOutputSchema,
} from './endpoints';
export type {
	ChargebeeEndpointInputs,
	ChargebeeEndpointOutputs,
	ChargebeeJsonValue,
	ChargebeeOperationId,
} from './endpoints/types';
export {
	ChargebeeEndpointInputSchemas,
	ChargebeeEndpointOutputSchemas,
} from './endpoints/types';
