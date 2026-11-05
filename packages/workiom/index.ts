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
import { tryGetStoredKey } from './client';
import { Apps, Lists, Records } from './endpoints';
import type {
	WorkiomEndpointInputs,
	WorkiomEndpointOutputs,
} from './endpoints/types';
import {
	WorkiomEndpointInputSchemas,
	WorkiomEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { WorkiomSchema } from './schema';

export type WorkiomPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalWorkiomPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof workiomEndpointsNested>;
};

export type WorkiomContext = CorsairPluginContext<
	typeof WorkiomSchema,
	WorkiomPluginOptions,
	undefined,
	typeof workiomAuthConfig
>;

export type WorkiomKeyBuilderContext = KeyBuilderContext<
	WorkiomPluginOptions,
	typeof workiomAuthConfig
>;

export type WorkiomBoundEndpoints = BindEndpoints<
	typeof workiomEndpointsNested
>;

type WorkiomEndpoint<K extends keyof WorkiomEndpointOutputs> = CorsairEndpoint<
	WorkiomContext,
	WorkiomEndpointInputs[K],
	WorkiomEndpointOutputs[K]
>;

export type WorkiomEndpoints = {
	appsGetAll: WorkiomEndpoint<'appsGetAll'>;
	listsGet: WorkiomEndpoint<'listsGet'>;
	listsGetAll: WorkiomEndpoint<'listsGetAll'>;
	recordsGetAll: WorkiomEndpoint<'recordsGetAll'>;
	recordsCreate: WorkiomEndpoint<'recordsCreate'>;
	recordsUpdate: WorkiomEndpoint<'recordsUpdate'>;
};

const workiomEndpointsNested = {
	apps: {
		getAll: Apps.getAll,
	},
	lists: {
		get: Lists.get,
		getAll: Lists.getAll,
	},
	records: {
		getAll: Records.getAll,
		create: Records.create,
		update: Records.update,
	},
} as const;

export const workiomEndpointSchemas = {
	'apps.getAll': {
		input: WorkiomEndpointInputSchemas.appsGetAll,
		output: WorkiomEndpointOutputSchemas.appsGetAll,
	},
	'lists.get': {
		input: WorkiomEndpointInputSchemas.listsGet,
		output: WorkiomEndpointOutputSchemas.listsGet,
	},
	'lists.getAll': {
		input: WorkiomEndpointInputSchemas.listsGetAll,
		output: WorkiomEndpointOutputSchemas.listsGetAll,
	},
	'records.getAll': {
		input: WorkiomEndpointInputSchemas.recordsGetAll,
		output: WorkiomEndpointOutputSchemas.recordsGetAll,
	},
	'records.create': {
		input: WorkiomEndpointInputSchemas.recordsCreate,
		output: WorkiomEndpointOutputSchemas.recordsCreate,
	},
	'records.update': {
		input: WorkiomEndpointInputSchemas.recordsUpdate,
		output: WorkiomEndpointOutputSchemas.recordsUpdate,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof workiomEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const workiomEndpointMeta = {
	'apps.getAll': {
		riskLevel: 'read',
		description: 'List Workiom apps via GET /api/services/app/Apps/GetAll',
	},
	'lists.get': {
		riskLevel: 'read',
		description:
			"Get a list's fields, views, and filters via GET /api/services/app/Lists/Get",
	},
	'lists.getAll': {
		riskLevel: 'read',
		description:
			'Get all lists in a Workiom app via GET /api/services/app/Lists/GetAll',
	},
	'records.getAll': {
		riskLevel: 'read',
		description:
			'Get list records with sort, pagination, and filters via POST /api/services/app/Data/All',
	},
	'records.create': {
		riskLevel: 'write',
		description:
			'Create a list record via POST /api/services/app/Data/Create?listId=',
	},
	'records.update': {
		riskLevel: 'write',
		description:
			'Replace a list record via PUT /api/services/app/Data/Update?listId=&id=',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof workiomEndpointsNested>;

export const workiomAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseWorkiomPlugin<T extends WorkiomPluginOptions> = CorsairPlugin<
	'workiom',
	typeof WorkiomSchema,
	typeof workiomEndpointsNested,
	{},
	T,
	typeof defaultAuthType,
	typeof workiomAuthConfig
>;

export type InternalWorkiomPlugin = BaseWorkiomPlugin<WorkiomPluginOptions>;

export type ExternalWorkiomPlugin<T extends WorkiomPluginOptions> =
	BaseWorkiomPlugin<T>;

export function workiom<const T extends WorkiomPluginOptions>(
	incomingOptions: WorkiomPluginOptions & T = {} as WorkiomPluginOptions & T,
): ExternalWorkiomPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'workiom',
		authConfig: workiomAuthConfig,
		schema: WorkiomSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: workiomEndpointsNested,
		webhooks: {},
		endpointMeta: workiomEndpointMeta,
		endpointSchemas: workiomEndpointSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: WorkiomKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await tryGetStoredKey(() => ctx.keys.get_api_key());
				if (!res) {
					throw new AuthMissingError('workiom', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('workiom', 'api_key');
		},
	} satisfies InternalWorkiomPlugin;
}

export {
	makeWorkiomRequest,
	WORKIOM_API_BASE,
	WorkiomAPIError,
	WorkiomRateLimitError,
} from './client';
export type {
	AppsGetAllInput,
	AppsGetAllOutput,
	ListsGetAllInput,
	ListsGetAllOutput,
	ListsGetInput,
	ListsGetOutput,
	RecordsCreateInput,
	RecordsCreateOutput,
	RecordsGetAllInput,
	RecordsGetAllOutput,
	RecordsUpdateInput,
	RecordsUpdateOutput,
	WorkiomEndpointInputs,
	WorkiomEndpointOutputs,
} from './endpoints/types';
export {
	WorkiomEndpointInputSchemas,
	WorkiomEndpointOutputSchemas,
} from './endpoints/types';
