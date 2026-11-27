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
	mongodbatlasEndpointMeta as generatedEndpointMeta,
	mongodbatlasEndpointSchemas,
	mongodbatlasEndpointsNested,
} from './endpoints/catalog';
import type {
	MongoDBAtlasEndpointInputs,
	MongoDBAtlasEndpointOutputs,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { MongoDBAtlasSchema } from './schema';

export type MongoDBAtlasPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/**
	 * A service account (`mdb_sa_id_...:mdb_sa_sk_...`, or the JSON
	 * `{ "clientId", "clientSecret" }`) from Organization > Access Manager >
	 * Applications, or a programmatic API key as `publicKey:privateKey`.
	 * The roles it has decide which operations work.
	 */
	key?: string;
	hooks?: InternalMongoDBAtlasPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof mongodbatlasEndpointsNested>;
};

// Organization, project (group), cluster and user ids are per-call inputs.
export const mongodbatlasAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type MongoDBAtlasContext = CorsairPluginContext<
	typeof MongoDBAtlasSchema,
	MongoDBAtlasPluginOptions,
	undefined,
	typeof mongodbatlasAuthConfig
>;

export type MongoDBAtlasKeyBuilderContext = KeyBuilderContext<
	MongoDBAtlasPluginOptions,
	typeof mongodbatlasAuthConfig
>;

export type MongoDBAtlasBoundEndpoints = BindEndpoints<
	typeof mongodbatlasEndpointsNested
>;

export type MongoDBAtlasEndpoints = {
	[Id in keyof MongoDBAtlasEndpointOutputs]: CorsairEndpoint<
		MongoDBAtlasContext,
		MongoDBAtlasEndpointInputs[Id],
		MongoDBAtlasEndpointOutputs[Id]
	>;
};

export { mongodbatlasEndpointSchemas };

// One entry per operation, generated with the catalog (endpoints/catalog.ts).
const mongodbatlasEndpointMeta =
	generatedEndpointMeta satisfies RequiredPluginEndpointMeta<
		typeof mongodbatlasEndpointsNested
	>;

const defaultAuthType = 'api_key' as const;

export type BaseMongoDBAtlasPlugin<T extends MongoDBAtlasPluginOptions> =
	CorsairPlugin<
		'mongodbatlas',
		typeof MongoDBAtlasSchema,
		typeof mongodbatlasEndpointsNested,
		{},
		T,
		typeof defaultAuthType,
		typeof mongodbatlasAuthConfig
	>;

export type InternalMongoDBAtlasPlugin =
	BaseMongoDBAtlasPlugin<MongoDBAtlasPluginOptions>;

export type ExternalMongoDBAtlasPlugin<T extends MongoDBAtlasPluginOptions> =
	BaseMongoDBAtlasPlugin<T>;

export function mongodbatlas<const T extends MongoDBAtlasPluginOptions>(
	// Safe: every MongoDBAtlasPluginOptions field is optional, so an empty object satisfies it.
	incomingOptions: MongoDBAtlasPluginOptions &
		T = {} as MongoDBAtlasPluginOptions & T,
): ExternalMongoDBAtlasPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'mongodbatlas',
		authConfig: mongodbatlasAuthConfig,
		schema: MongoDBAtlasSchema,
		options: options,
		hooks: options.hooks,
		endpoints: mongodbatlasEndpointsNested,
		webhooks: {},
		endpointMeta: mongodbatlasEndpointMeta,
		endpointSchemas: mongodbatlasEndpointSchemas,
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
		keyBuilder: async (ctx: MongoDBAtlasKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (options.key) return options.key;
			const key = await tryGetStoredKey(() => ctx.keys?.get_api_key());
			// No key configured: AuthMissingError makes core ask the tenant to connect.
			if (!key) throw new AuthMissingError('mongodbatlas', 'api_key');
			return key;
		},
	} satisfies InternalMongoDBAtlasPlugin;
}

export type { MongoDBAtlasCredential, MongoDBAtlasRequest } from './client';
export {
	clearMongoDBAtlasAuthCache,
	digestAuthorization,
	parseAtlasKey,
	parseDigestChallenge,
} from './client';
export {
	createMongoDBAtlasOperation,
	getMongoDBAtlasInputSchema,
	getMongoDBAtlasOutputSchema,
	MONGODBATLAS_OPERATION_IDS,
} from './endpoints';
export type {
	MongoDBAtlasEndpointInputs,
	MongoDBAtlasEndpointOutputs,
	MongoDBAtlasJsonValue,
	MongoDBAtlasOperationId,
} from './endpoints/types';
export {
	MongoDBAtlasEndpointInputSchemas,
	MongoDBAtlasEndpointOutputSchemas,
} from './endpoints/types';
