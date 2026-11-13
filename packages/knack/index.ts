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
import { packKnackCredentials } from './client';
import { knackEndpoints } from './endpoints';
import type {
	KnackEndpointInputs,
	KnackEndpointOutputs,
} from './endpoints/types';
import {
	KnackEndpointInputSchemas,
	KnackEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { KnackSchema } from './schema';

export type KnackPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** The packed credential pair, mainly for tests. */
	key?: string;
	hooks?: InternalKnackPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof knackEndpoints>;
};

export type KnackContext = CorsairPluginContext<
	typeof KnackSchema,
	KnackPluginOptions,
	undefined,
	typeof knackAuthConfig
>;

export type KnackKeyBuilderContext = KeyBuilderContext<
	KnackPluginOptions,
	typeof knackAuthConfig
>;

export type KnackBoundEndpoints = BindEndpoints<typeof knackEndpoints>;

type KnackEndpoint<K extends keyof KnackEndpointOutputs> = CorsairEndpoint<
	KnackContext,
	KnackEndpointInputs[K],
	KnackEndpointOutputs[K]
>;

export type KnackEndpoints = {
	[K in keyof KnackEndpointOutputs]: KnackEndpoint<K>;
};

const knackWebhooksNested = {} as const;

export const knackEndpointSchemas = {
	'applications.get': {
		input: KnackEndpointInputSchemas.applicationsGet,
		output: KnackEndpointOutputSchemas.applicationsGet,
	},
	'objects.list': {
		input: KnackEndpointInputSchemas.objectsList,
		output: KnackEndpointOutputSchemas.objectsList,
	},
	'objects.get': {
		input: KnackEndpointInputSchemas.objectsGet,
		output: KnackEndpointOutputSchemas.objectsGet,
	},
	'records.list': {
		input: KnackEndpointInputSchemas.recordsList,
		output: KnackEndpointOutputSchemas.recordsList,
	},
	'records.get': {
		input: KnackEndpointInputSchemas.recordsGet,
		output: KnackEndpointOutputSchemas.recordsGet,
	},
	'records.create': {
		input: KnackEndpointInputSchemas.recordsCreate,
		output: KnackEndpointOutputSchemas.recordsCreate,
	},
	'records.update': {
		input: KnackEndpointInputSchemas.recordsUpdate,
		output: KnackEndpointOutputSchemas.recordsUpdate,
	},
	'records.delete': {
		input: KnackEndpointInputSchemas.recordsDelete,
		output: KnackEndpointOutputSchemas.recordsDelete,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof knackEndpoints>;

const knackEndpointMeta = {
	'applications.get': {
		riskLevel: 'read',
		description:
			"Read the app metadata: its objects, each object's fields, and per-object record counts",
	},
	'objects.list': {
		riskLevel: 'read',
		description: 'List the tables in this app with their object keys',
	},
	'objects.get': {
		riskLevel: 'read',
		description: "Read one table's definition and field keys",
	},
	'records.list': {
		riskLevel: 'read',
		description: 'List records in a table, with paging, sorting and filters',
	},
	'records.get': {
		riskLevel: 'read',
		description: 'Read one record by id',
	},
	'records.create': {
		riskLevel: 'write',
		description: 'Create a record in a table',
	},
	'records.update': {
		riskLevel: 'write',
		description: 'Update fields on an existing record',
	},
	'records.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a record permanently',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof knackEndpoints>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const knackAuthConfig = {
	api_key: {
		// Knack needs an application id and an API key on every request, and both
		// identify the same one app. The key manager only builds accessors for
		// declared fields, so the key has to sit beside the id or it cannot be
		// read at all. The application id uses the base `api_key` field.
		account: ['api_secret'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseKnackPlugin<T extends KnackPluginOptions> = CorsairPlugin<
	'knack',
	typeof KnackSchema,
	typeof knackEndpoints,
	typeof knackWebhooksNested,
	T,
	typeof defaultAuthType,
	typeof knackAuthConfig
>;

export type InternalKnackPlugin = BaseKnackPlugin<KnackPluginOptions>;

export type ExternalKnackPlugin<T extends KnackPluginOptions> =
	BaseKnackPlugin<T>;

export function knack<const T extends KnackPluginOptions>(
	incomingOptions: KnackPluginOptions & T = {} as KnackPluginOptions & T,
): ExternalKnackPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'knack',
		authConfig: knackAuthConfig,
		schema: KnackSchema,
		options,
		hooks: options.hooks,
		endpoints: knackEndpoints,
		// Knack sends no inbound webhooks: changes are read from the API, and the
		// docs offer no subscription call.
		webhooks: knackWebhooksNested,
		endpointMeta: knackEndpointMeta,
		endpointSchemas: knackEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: KnackKeyBuilderContext) => {
			if (options.key) return options.key;

			if (ctx.authType !== 'api_key') {
				throw new AuthMissingError('knack', 'api_key');
			}

			// The account's `api_key` holds the application id and its
			// `api_secret` field holds the API key.
			const [applicationId, apiKey] = await Promise.all([
				ctx.keys.get_api_key(),
				ctx.keys.get_api_secret(),
			]);

			// Knack answers 401 when either header is missing, so a half-set
			// account is treated as no account rather than sent as a bad request.
			if (!applicationId || !apiKey) {
				throw new AuthMissingError('knack', 'api_key');
			}

			return packKnackCredentials({ applicationId, apiKey });
		},
	} satisfies InternalKnackPlugin;
}

export type { KnackCredentials } from './client';
export { packKnackCredentials, parseKnackCredentials } from './client';
export type {
	KnackApplicationsGetResponse,
	KnackEndpointInputs,
	KnackEndpointOutputs,
	KnackFilter,
	KnackObject,
	KnackObjectsListResponse,
	KnackRecord,
	KnackRecordsListInput,
	KnackRecordsListResponse,
} from './endpoints/types';
export { mergeErrorHandlers } from './error-handlers';
