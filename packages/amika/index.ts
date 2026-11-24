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
	amikaEndpointSchemas,
	amikaEndpointsNested,
	amikaEndpointMeta as generatedEndpointMeta,
} from './endpoints/catalog';
import type {
	AmikaEndpointInputs,
	AmikaEndpointOutputs,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { AmikaSchema } from './schema';

export type AmikaPluginOptions = {
	/**
	 * `api_key`: an Amika API key (`sk_…`), user or organization scoped, from
	 * app.amika.dev → Settings → API Keys or `amika auth api-key create`.
	 * A user key acts as that person; an organization key acts for the org
	 * (rigs it creates have no git author unless the git env vars are set).
	 */
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalAmikaPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof amikaEndpointsNested>;
};

export type AmikaContext = CorsairPluginContext<
	typeof AmikaSchema,
	AmikaPluginOptions
>;

export type AmikaKeyBuilderContext = KeyBuilderContext<AmikaPluginOptions>;

export type AmikaBoundEndpoints = BindEndpoints<typeof amikaEndpointsNested>;

export type AmikaEndpoints = {
	[Id in keyof AmikaEndpointOutputs]: CorsairEndpoint<
		AmikaContext,
		AmikaEndpointInputs[Id],
		AmikaEndpointOutputs[Id]
	>;
};

/**
 * No incoming webhooks: Amika's API publishes none. Rig, command-run and job
 * status are read with rigs.get, commandRuns.get and jobRuns.get.
 */
const amikaWebhooksNested = {} as const;

export { amikaEndpointSchemas };

// One entry per operation, generated with the catalog (endpoints/catalog.ts).
const amikaEndpointMeta =
	generatedEndpointMeta satisfies RequiredPluginEndpointMeta<
		typeof amikaEndpointsNested
	>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const amikaAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseAmikaPlugin<T extends AmikaPluginOptions> = CorsairPlugin<
	'amika',
	typeof AmikaSchema,
	typeof amikaEndpointsNested,
	typeof amikaWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalAmikaPlugin = BaseAmikaPlugin<AmikaPluginOptions>;

export type ExternalAmikaPlugin<T extends AmikaPluginOptions> =
	BaseAmikaPlugin<T>;

export function amika<const T extends AmikaPluginOptions>(
	incomingOptions: AmikaPluginOptions & T = {} as AmikaPluginOptions & T,
): ExternalAmikaPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'amika',
		authConfig: amikaAuthConfig,
		schema: AmikaSchema,
		options: options,
		hooks: options.hooks,
		endpoints: amikaEndpointsNested,
		webhooks: amikaWebhooksNested,
		endpointMeta: amikaEndpointMeta,
		endpointSchemas: amikaEndpointSchemas,
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
		keyBuilder: async (ctx: AmikaKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';

			if (options.key) return options.key;

			// No key configured: AuthMissingError makes core ask the tenant to connect.
			const storedKey = await tryGetStoredKey(() => ctx.keys?.get_api_key());
			if (!storedKey) throw new AuthMissingError('amika', 'api_key');
			return storedKey;
		},
	} satisfies InternalAmikaPlugin;
}

export {
	AMIKA_OPERATION_IDS,
	createAmikaOperation,
	getAmikaInputSchema,
	getAmikaOutputSchema,
} from './endpoints';
export type {
	AmikaEndpointInputs,
	AmikaEndpointOutputs,
	AmikaJsonValue,
	AmikaOperationId,
} from './endpoints/types';
export {
	AmikaEndpointInputSchemas,
	AmikaEndpointOutputSchemas,
} from './endpoints/types';
