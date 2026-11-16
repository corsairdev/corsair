import type {
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { Records, Workspace } from './endpoints';
import type {
	NinoxEndpointInputs,
	NinoxEndpointOutputs,
} from './endpoints/types';
import {
	NinoxEndpointInputSchemas,
	NinoxEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { NinoxSchema } from './schema';

export type NinoxPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** A Ninox workspace API key, from the workspace's integration settings. */
	key?: string;
	hooks?: InternalNinoxPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof ninoxEndpointsNested>;
};

export type NinoxContext = CorsairPluginContext<
	typeof NinoxSchema,
	NinoxPluginOptions
>;

export type NinoxKeyBuilderContext = KeyBuilderContext<NinoxPluginOptions>;

export type NinoxBoundEndpoints = BindEndpoints<typeof ninoxEndpointsNested>;

type NinoxEndpoint<K extends keyof NinoxEndpointOutputs> = CorsairEndpoint<
	NinoxContext,
	NinoxEndpointInputs[K],
	NinoxEndpointOutputs[K]
>;

export type NinoxEndpoints = {
	workspaceGet: NinoxEndpoint<'workspaceGet'>;
	modulesList: NinoxEndpoint<'modulesList'>;
	tablesList: NinoxEndpoint<'tablesList'>;
	fieldsList: NinoxEndpoint<'fieldsList'>;
	recordsList: NinoxEndpoint<'recordsList'>;
	recordsGet: NinoxEndpoint<'recordsGet'>;
	recordsCreate: NinoxEndpoint<'recordsCreate'>;
	recordsUpdate: NinoxEndpoint<'recordsUpdate'>;
	recordsDelete: NinoxEndpoint<'recordsDelete'>;
	recordsUpsert: NinoxEndpoint<'recordsUpsert'>;
	recordsChanges: NinoxEndpoint<'recordsChanges'>;
};

export const ninoxEndpointsNested = {
	workspace: {
		get: Workspace.get,
	},
	modules: {
		list: Workspace.modules,
	},
	tables: {
		list: Workspace.tables,
	},
	fields: {
		list: Workspace.fields,
	},
	records: {
		list: Records.list,
		get: Records.get,
		create: Records.create,
		update: Records.update,
		delete: Records.remove,
		upsert: Records.upsert,
		changes: Records.changes,
	},
} as const;

export const ninoxEndpointSchemas = {
	'workspace.get': {
		input: NinoxEndpointInputSchemas.workspaceGet,
		output: NinoxEndpointOutputSchemas.workspaceGet,
	},
	'modules.list': {
		input: NinoxEndpointInputSchemas.modulesList,
		output: NinoxEndpointOutputSchemas.modulesList,
	},
	'tables.list': {
		input: NinoxEndpointInputSchemas.tablesList,
		output: NinoxEndpointOutputSchemas.tablesList,
	},
	'fields.list': {
		input: NinoxEndpointInputSchemas.fieldsList,
		output: NinoxEndpointOutputSchemas.fieldsList,
	},
	'records.list': {
		input: NinoxEndpointInputSchemas.recordsList,
		output: NinoxEndpointOutputSchemas.recordsList,
	},
	'records.get': {
		input: NinoxEndpointInputSchemas.recordsGet,
		output: NinoxEndpointOutputSchemas.recordsGet,
	},
	'records.create': {
		input: NinoxEndpointInputSchemas.recordsCreate,
		output: NinoxEndpointOutputSchemas.recordsCreate,
	},
	'records.update': {
		input: NinoxEndpointInputSchemas.recordsUpdate,
		output: NinoxEndpointOutputSchemas.recordsUpdate,
	},
	'records.delete': {
		input: NinoxEndpointInputSchemas.recordsDelete,
		output: NinoxEndpointOutputSchemas.recordsDelete,
	},
	'records.upsert': {
		input: NinoxEndpointInputSchemas.recordsUpsert,
		output: NinoxEndpointOutputSchemas.recordsUpsert,
	},
	'records.changes': {
		input: NinoxEndpointInputSchemas.recordsChanges,
		output: NinoxEndpointOutputSchemas.recordsChanges,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof ninoxEndpointsNested>;

const defaultAuthType = 'api_key' as const;

const ninoxEndpointMeta = {
	'workspace.get': {
		riskLevel: 'read',
		description: 'Read the workspace and the modules in it',
	},
	'modules.list': {
		riskLevel: 'read',
		description: 'List the workspace’s modules, paged by limit and offset',
	},
	'tables.list': {
		riskLevel: 'read',
		description: 'List the tables inside one module',
	},
	'fields.list': {
		riskLevel: 'read',
		description:
			'List a table’s field names and types, which decide what a record write may set',
	},
	'records.list': {
		riskLevel: 'read',
		description:
			'Read rows from a table with a field filter, sort order and offset paging; only columns the table marks filterable are accepted',
	},
	'records.get': {
		riskLevel: 'read',
		description:
			'Read one row by id, which is the only way to fetch a known record because the id is not filterable',
	},
	'records.create': {
		riskLevel: 'write',
		description:
			'Create rows in one transaction, so a single bad record rolls the whole batch back',
	},
	'records.update': {
		riskLevel: 'write',
		description:
			'Update rows in one transaction, optionally rejecting a write when a field no longer holds the value the caller read',
	},
	'records.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete rows in one transaction, rolling the whole set back if any id is wrong; there is no restore call',
	},
	'records.upsert': {
		riskLevel: 'write',
		description:
			'Create or update rows matched by one unique field, refusing an ambiguous match rather than picking a row',
	},
	'records.changes': {
		riskLevel: 'read',
		description:
			'Poll a table’s row-level change feed since a timestamp, which needs history tracking enabled on that table',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof ninoxEndpointsNested>;

export type BaseNinoxPlugin<T extends NinoxPluginOptions> = CorsairPlugin<
	'ninox',
	typeof NinoxSchema,
	typeof ninoxEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalNinoxPlugin = BaseNinoxPlugin<NinoxPluginOptions>;

export type ExternalNinoxPlugin<T extends NinoxPluginOptions> =
	BaseNinoxPlugin<T>;

export function ninox<const T extends NinoxPluginOptions>(
	incomingOptions: NinoxPluginOptions & T = {} as NinoxPluginOptions & T,
): ExternalNinoxPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'ninox',
		schema: NinoxSchema,
		options: options,
		hooks: options.hooks,
		endpoints: ninoxEndpointsNested,
		webhooks: {},
		endpointMeta: ninoxEndpointMeta,
		endpointSchemas: ninoxEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: NinoxKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('ninox', ctx.authType ?? 'api_key');
		},
	} satisfies InternalNinoxPlugin;
}

export { NinoxAPIError } from './client';

export type {
	FieldsListInput,
	FieldsListResponse,
	ModulesListInput,
	ModulesListResponse,
	NinoxEndpointInputs,
	NinoxEndpointOutputs,
	NinoxField,
	NinoxModule,
	NinoxRow,
	NinoxRowChange,
	NinoxTable,
	RecordGetInput,
	RecordGetResponse,
	RecordsChangesInput,
	RecordsChangesResponse,
	RecordsCreateInput,
	RecordsCreateResponse,
	RecordsDeleteInput,
	RecordsDeleteResponse,
	RecordsListInput,
	RecordsListResponse,
	RecordsUpdateInput,
	RecordsUpdateResponse,
	RecordsUpsertInput,
	RecordsUpsertResponse,
	TablesListInput,
	TablesListResponse,
	WorkspaceGetInput,
	WorkspaceGetResponse,
} from './endpoints/types';
