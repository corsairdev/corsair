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
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { RecordsEndpoints, TablesEndpoints } from './endpoints';
import type {
	ServicenowEndpointInputs,
	ServicenowEndpointOutputs,
} from './endpoints/types';
import {
	ServicenowEndpointInputSchemas,
	ServicenowEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { ServicenowSchema } from './schema';

export type ServicenowPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/**
	 * The instance, as `acme.service-now.com` or the instance name `acme`.
	 * ServiceNow has no shared API host, so either this or a stored `host` key
	 * is required. Requests only go to `{instance}.service-now.com` (or
	 * `{instance}.servicenowservices.com`); any other host is rejected.
	 */
	host?: string;
	/** A username and password already joined as `{"username":...,"password":...}`. */
	key?: string;
	hooks?: InternalServicenowPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof servicenowEndpointsNested>;
};

export type ServicenowContext = CorsairPluginContext<
	typeof ServicenowSchema,
	ServicenowPluginOptions,
	undefined,
	typeof servicenowAuthConfig
>;

export type ServicenowKeyBuilderContext = KeyBuilderContext<
	ServicenowPluginOptions,
	typeof servicenowAuthConfig
>;

export type ServicenowBoundEndpoints = BindEndpoints<
	typeof servicenowEndpointsNested
>;

type ServicenowEndpoint<K extends keyof ServicenowEndpointOutputs> =
	CorsairEndpoint<
		ServicenowContext,
		ServicenowEndpointInputs[K],
		ServicenowEndpointOutputs[K]
	>;

export type ServicenowEndpoints = {
	recordsList: ServicenowEndpoint<'recordsList'>;
	recordsGet: ServicenowEndpoint<'recordsGet'>;
	recordsCreate: ServicenowEndpoint<'recordsCreate'>;
	recordsUpdate: ServicenowEndpoint<'recordsUpdate'>;
	recordsDelete: ServicenowEndpoint<'recordsDelete'>;
	tablesList: ServicenowEndpoint<'tablesList'>;
};

const servicenowEndpointsNested = {
	records: RecordsEndpoints,
	tables: TablesEndpoints,
} as const;

export const servicenowEndpointSchemas = {
	'records.list': {
		input: ServicenowEndpointInputSchemas.recordsList,
		output: ServicenowEndpointOutputSchemas.recordsList,
	},
	'records.get': {
		input: ServicenowEndpointInputSchemas.recordsGet,
		output: ServicenowEndpointOutputSchemas.recordsGet,
	},
	'records.create': {
		input: ServicenowEndpointInputSchemas.recordsCreate,
		output: ServicenowEndpointOutputSchemas.recordsCreate,
	},
	'records.update': {
		input: ServicenowEndpointInputSchemas.recordsUpdate,
		output: ServicenowEndpointOutputSchemas.recordsUpdate,
	},
	'records.delete': {
		input: ServicenowEndpointInputSchemas.recordsDelete,
		output: ServicenowEndpointOutputSchemas.recordsDelete,
	},
	'tables.list': {
		input: ServicenowEndpointInputSchemas.tablesList,
		output: ServicenowEndpointOutputSchemas.tablesList,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof servicenowEndpointsNested
>;

const defaultAuthType: 'api_key' = 'api_key';

/**
 * The Table API authenticates with **HTTP Basic**, so a username and password
 * are both required. They are account-level fields with a JSON-encoded pair in
 * `api_key`, because `keyBuilder` returns a single string and
 * `get_client_id`-style accessors only exist for the fields declared here.
 *
 * `host` is an account field too: it is per-customer, and the resolver reads it
 * from the same manager.
 */
export const servicenowAuthConfig = {
	api_key: {
		account: ['host', 'webhook_signature'] as const,
	},
} as const satisfies PluginAuthConfig;

const servicenowEndpointMeta = {
	'records.list': {
		riskLevel: 'read',
		description:
			'Query any table with an encoded query, field selection and offset paging',
	},
	'records.get': {
		riskLevel: 'read',
		description: 'Read one record by its sys_id',
	},
	'records.create': {
		riskLevel: 'write',
		description:
			'Create a record in any table, which triggers its business rules and notifications',
	},
	'records.update': {
		riskLevel: 'write',
		description:
			'Patch fields on one record, which triggers its business rules and notifications',
	},
	'records.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete one record. ServiceNow keeps no undo, and what happens to referencing records depends on the table reference cascade rule',
	},
	'tables.list': {
		riskLevel: 'read',
		description:
			'List visible table metadata from sys_db_object, to find a table name to query',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof servicenowEndpointsNested
>;

export type BaseServicenowPlugin<T extends ServicenowPluginOptions> =
	CorsairPlugin<
		'servicenow',
		typeof ServicenowSchema,
		typeof servicenowEndpointsNested,
		Record<string, never>,
		T,
		typeof defaultAuthType,
		typeof servicenowAuthConfig
	>;

export type InternalServicenowPlugin =
	BaseServicenowPlugin<ServicenowPluginOptions>;

export type ExternalServicenowPlugin<T extends ServicenowPluginOptions> =
	BaseServicenowPlugin<T>;

export function servicenow<const T extends ServicenowPluginOptions>(
	incomingOptions: ServicenowPluginOptions & T = {} as ServicenowPluginOptions &
		T,
): ExternalServicenowPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	} as ServicenowPluginOptions & T;
	return {
		id: 'servicenow',
		authConfig: servicenowAuthConfig,
		schema: ServicenowSchema,
		options,
		hooks: options.hooks,
		endpoints: servicenowEndpointsNested,
		webhooks: {},
		endpointMeta: servicenowEndpointMeta,
		endpointSchemas: servicenowEndpointSchemas,
		// ServiceNow can send outbound webhooks (business rules), but they are
		// configured per instance and per rule, so this plugin does not receive.
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx, source) => {
			if (source !== 'endpoint') {
				throw new AuthMissingError('servicenow', 'api_key');
			}
			if (options.key) return options.key;
			// A context with no key manager is an unconfigured account, not a crash:
			// fall through to the same AuthMissingError as a missing stored key.
			if (!ctx.keys) throw new AuthMissingError('servicenow', 'api_key');
			const stored = await ctx.keys.get_api_key();
			if (!stored) throw new AuthMissingError('servicenow', 'api_key');
			// The instance is the other half of a stored credential. Without it
			// the account is not connected yet, and only an AuthMissingError from
			// here gets the caller a connect link; `workable` does the same.
			const host = options.host ?? (await ctx.keys.get_host());
			if (!host?.trim()) throw new AuthMissingError('servicenow', 'api_key');
			return stored;
		},
	} satisfies InternalServicenowPlugin;
}

export type {
	RecordsCreateInput,
	RecordsCreateResponse,
	RecordsDeleteInput,
	RecordsDeleteResponse,
	RecordsGetInput,
	RecordsGetResponse,
	RecordsListInput,
	RecordsListResponse,
	RecordsUpdateInput,
	RecordsUpdateResponse,
	ServicenowEndpointInputs,
	ServicenowEndpointOutputs,
	ServicenowRecord,
	ServicenowTable,
	TablesListInput,
	TablesListResponse,
} from './endpoints/types';
