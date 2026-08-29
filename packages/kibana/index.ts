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
import { DataViews, SavedObjects, Status } from './endpoints';
import type {
	DataViewsGetInput,
	DataViewsGetResponse,
	KibanaEndpointInputs,
	KibanaEndpointOutputs,
	SavedObjectsCreateInput,
	SavedObjectsCreateResponse,
	SavedObjectsDeleteInput,
	SavedObjectsDeleteResponse,
	SavedObjectsFindInput,
	SavedObjectsFindResponse,
	SavedObjectsGetInput,
	SavedObjectsGetResponse,
	StatusGetInput,
	StatusGetResponse,
} from './endpoints/types';
import {
	KibanaEndpointInputSchemas,
	KibanaEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { KibanaSchema } from './schema';

export type KibanaPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	baseUrl?: string;
	hooks?: InternalKibanaPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof kibanaEndpointsNested>;
};

export const kibanaAuthConfig = {
	api_key: {
		account: ['base_url', 'tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type KibanaContext = CorsairPluginContext<
	typeof KibanaSchema,
	KibanaPluginOptions,
	undefined,
	typeof kibanaAuthConfig
>;

export type KibanaKeyBuilderContext = KeyBuilderContext<
	KibanaPluginOptions,
	typeof kibanaAuthConfig
>;

export type KibanaBoundEndpoints = BindEndpoints<typeof kibanaEndpointsNested>;

type KibanaEndpoint<K extends keyof KibanaEndpointOutputs> = CorsairEndpoint<
	KibanaContext,
	KibanaEndpointInputs[K],
	KibanaEndpointOutputs[K]
>;

export type KibanaEndpoints = {
	savedObjectsFind: KibanaEndpoint<'savedObjectsFind'>;
	savedObjectsGet: KibanaEndpoint<'savedObjectsGet'>;
	savedObjectsCreate: KibanaEndpoint<'savedObjectsCreate'>;
	savedObjectsDelete: KibanaEndpoint<'savedObjectsDelete'>;
	dataViewsGet: KibanaEndpoint<'dataViewsGet'>;
	statusGet: KibanaEndpoint<'statusGet'>;
};

const kibanaEndpointsNested = {
	savedObjects: {
		find: SavedObjects.find,
		get: SavedObjects.get,
		create: SavedObjects.create,
		delete: SavedObjects.remove,
	},
	dataViews: {
		get: DataViews.get,
	},
	status: {
		get: Status.get,
	},
} as const;

export const kibanaEndpointSchemas = {
	'savedObjects.find': {
		input: KibanaEndpointInputSchemas.savedObjectsFind,
		output: KibanaEndpointOutputSchemas.savedObjectsFind,
	},
	'savedObjects.get': {
		input: KibanaEndpointInputSchemas.savedObjectsGet,
		output: KibanaEndpointOutputSchemas.savedObjectsGet,
	},
	'savedObjects.create': {
		input: KibanaEndpointInputSchemas.savedObjectsCreate,
		output: KibanaEndpointOutputSchemas.savedObjectsCreate,
	},
	'savedObjects.delete': {
		input: KibanaEndpointInputSchemas.savedObjectsDelete,
		output: KibanaEndpointOutputSchemas.savedObjectsDelete,
	},
	'dataViews.get': {
		input: KibanaEndpointInputSchemas.dataViewsGet,
		output: KibanaEndpointOutputSchemas.dataViewsGet,
	},
	'status.get': {
		input: KibanaEndpointInputSchemas.statusGet,
		output: KibanaEndpointOutputSchemas.statusGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof kibanaEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const kibanaEndpointMeta = {
	'savedObjects.find': {
		riskLevel: 'read',
		description: 'Find saved objects matching search query or type filters',
	},
	'savedObjects.get': {
		riskLevel: 'read',
		description: 'Retrieve a specific saved object by type and ID',
	},
	'savedObjects.create': {
		riskLevel: 'write',
		description: 'Create a new saved object in Kibana',
	},
	'savedObjects.delete': {
		riskLevel: 'destructive',
		description: 'Delete a saved object by type and ID',
	},
	'dataViews.get': {
		riskLevel: 'read',
		description: 'Retrieve data view details by ID',
	},
	'status.get': {
		riskLevel: 'read',
		description: 'Retrieve health and version status of the Kibana instance',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof kibanaEndpointsNested>;

export type BaseKibanaPlugin<T extends KibanaPluginOptions> = CorsairPlugin<
	'kibana',
	typeof KibanaSchema,
	typeof kibanaEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType,
	typeof kibanaAuthConfig
>;

export type InternalKibanaPlugin = BaseKibanaPlugin<KibanaPluginOptions>;

export type ExternalKibanaPlugin<T extends KibanaPluginOptions> =
	BaseKibanaPlugin<T>;

export function kibana<const T extends KibanaPluginOptions>(
	incomingOptions: KibanaPluginOptions & T = {} as KibanaPluginOptions & T,
): ExternalKibanaPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'kibana',
		authConfig: kibanaAuthConfig,
		schema: KibanaSchema,
		options: options,
		hooks: options.hooks,
		endpoints: kibanaEndpointsNested,
		webhooks: {} as Record<string, never>,
		endpointMeta: kibanaEndpointMeta,
		endpointSchemas: kibanaEndpointSchemas,
		webhookSchemas: {} as Record<string, never>,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: KibanaKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalKibanaPlugin;
}

export type {
	DataViewsGetInput,
	DataViewsGetResponse,
	KibanaEndpointInputs,
	KibanaEndpointOutputs,
	SavedObjectsCreateInput,
	SavedObjectsCreateResponse,
	SavedObjectsDeleteInput,
	SavedObjectsDeleteResponse,
	SavedObjectsFindInput,
	SavedObjectsFindResponse,
	SavedObjectsGetInput,
	SavedObjectsGetResponse,
	StatusGetInput,
	StatusGetResponse,
} from './endpoints/types';
