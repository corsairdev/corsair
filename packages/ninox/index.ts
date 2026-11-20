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
import { Records, Structure, Workspace } from './endpoints';
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
	moduleGet: NinoxEndpoint<'moduleGet'>;
	tableGet: NinoxEndpoint<'tableGet'>;
	tableCreate: NinoxEndpoint<'tableCreate'>;
	tableDelete: NinoxEndpoint<'tableDelete'>;
	fieldCreate: NinoxEndpoint<'fieldCreate'>;
	fieldDelete: NinoxEndpoint<'fieldDelete'>;
	viewsList: NinoxEndpoint<'viewsList'>;
	scriptExecute: NinoxEndpoint<'scriptExecute'>;
};

export const ninoxEndpointsNested = {
	workspace: {
		get: Workspace.get,
	},
	modules: {
		list: Workspace.modules,
		get: Structure.moduleGet,
	},
	tables: {
		list: Workspace.tables,
		get: Structure.tableGet,
		create: Structure.tableCreate,
		delete: Structure.tableDelete,
	},
	fields: {
		list: Workspace.fields,
		create: Structure.fieldCreate,
		delete: Structure.fieldDelete,
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
	views: {
		list: Structure.viewsList,
	},
	scripts: {
		execute: Structure.scriptExecute,
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
	'modules.get': {
		input: NinoxEndpointInputSchemas.moduleGet,
		output: NinoxEndpointOutputSchemas.moduleGet,
	},
	'tables.get': {
		input: NinoxEndpointInputSchemas.tableGet,
		output: NinoxEndpointOutputSchemas.tableGet,
	},
	'tables.create': {
		input: NinoxEndpointInputSchemas.tableCreate,
		output: NinoxEndpointOutputSchemas.tableCreate,
	},
	'tables.delete': {
		input: NinoxEndpointInputSchemas.tableDelete,
		output: NinoxEndpointOutputSchemas.tableDelete,
	},
	'fields.create': {
		input: NinoxEndpointInputSchemas.fieldCreate,
		output: NinoxEndpointOutputSchemas.fieldCreate,
	},
	'fields.delete': {
		input: NinoxEndpointInputSchemas.fieldDelete,
		output: NinoxEndpointOutputSchemas.fieldDelete,
	},
	'views.list': {
		input: NinoxEndpointInputSchemas.viewsList,
		output: NinoxEndpointOutputSchemas.viewsList,
	},
	'scripts.execute': {
		input: NinoxEndpointInputSchemas.scriptExecute,
		output: NinoxEndpointOutputSchemas.scriptExecute,
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
	'modules.get': {
		riskLevel: 'read',
		description: 'Read one module (app) by its internal name',
	},
	'tables.get': {
		riskLevel: 'read',
		description: 'Read one table with all of its field definitions',
	},
	'tables.create': {
		riskLevel: 'write',
		description:
			'Create a table in a module; add its fields with fields.create',
	},
	'tables.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a table and every record in it',
	},
	'fields.create': {
		riskLevel: 'write',
		description:
			'Add a field to a table: text, number, choice, date, reference and the other Ninox types',
	},
	'fields.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a field and the value every record held in it',
	},
	'views.list': {
		riskLevel: 'read',
		description: "List a table's saved views",
	},
	'scripts.execute': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Run Ninox script in a module and return its result; a script can change or delete records',
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
