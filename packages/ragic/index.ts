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
import type { RagicServer } from './client';
import * as Records from './endpoints';
import type {
	RagicEndpointInputs,
	RagicEndpointOutputs,
} from './endpoints/types';
import {
	RagicEndpointInputSchemas,
	RagicEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { RagicSchema } from './schema';

export type RagicPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	/**
	 * The Ragic server the account lives on. The default is `www.ragic.com`; an
	 * account on another shard uses `na3`, `ap5`, `eu2` and so on, and a key only
	 * works on its own server.
	 */
	server?: RagicServer;
	hooks?: InternalRagicPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof ragicEndpointsNested>;
};

export type RagicContext = CorsairPluginContext<
	typeof RagicSchema,
	RagicPluginOptions
>;

export type RagicKeyBuilderContext = KeyBuilderContext<RagicPluginOptions>;

export type RagicBoundEndpoints = BindEndpoints<typeof ragicEndpointsNested>;

type RagicEndpoint<K extends keyof RagicEndpointOutputs> = CorsairEndpoint<
	RagicContext,
	RagicEndpointInputs[K],
	RagicEndpointOutputs[K]
>;

export type RagicEndpoints = {
	recordsList: RagicEndpoint<'recordsList'>;
	recordsGet: RagicEndpoint<'recordsGet'>;
	recordsCreate: RagicEndpoint<'recordsCreate'>;
	recordsUpdate: RagicEndpoint<'recordsUpdate'>;
	recordsDelete: RagicEndpoint<'recordsDelete'>;
	recordsComment: RagicEndpoint<'recordsComment'>;
	recordsLock: RagicEndpoint<'recordsLock'>;
	recordsUnlock: RagicEndpoint<'recordsUnlock'>;
	schemaGet: RagicEndpoint<'schemaGet'>;
};

const ragicEndpointsNested = {
	records: {
		list: Records.list,
		get: Records.get,
		create: Records.create,
		update: Records.update,
		delete: Records.remove,
		comment: Records.comment,
		lock: Records.lock,
		unlock: Records.unlock,
	},
	schema: {
		get: Records.schema,
	},
} as const;

export const ragicEndpointSchemas = {
	'records.list': {
		input: RagicEndpointInputSchemas.recordsList,
		output: RagicEndpointOutputSchemas.recordsList,
	},
	'records.get': {
		input: RagicEndpointInputSchemas.recordsGet,
		output: RagicEndpointOutputSchemas.recordsGet,
	},
	'records.create': {
		input: RagicEndpointInputSchemas.recordsCreate,
		output: RagicEndpointOutputSchemas.recordsCreate,
	},
	'records.update': {
		input: RagicEndpointInputSchemas.recordsUpdate,
		output: RagicEndpointOutputSchemas.recordsUpdate,
	},
	'records.delete': {
		input: RagicEndpointInputSchemas.recordsDelete,
		output: RagicEndpointOutputSchemas.recordsDelete,
	},
	'records.comment': {
		input: RagicEndpointInputSchemas.recordsComment,
		output: RagicEndpointOutputSchemas.recordsComment,
	},
	'records.lock': {
		input: RagicEndpointInputSchemas.recordsLock,
		output: RagicEndpointOutputSchemas.recordsLock,
	},
	'records.unlock': {
		input: RagicEndpointInputSchemas.recordsUnlock,
		output: RagicEndpointOutputSchemas.recordsUnlock,
	},
	'schema.get': {
		input: RagicEndpointInputSchemas.schemaGet,
		output: RagicEndpointOutputSchemas.schemaGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof ragicEndpointsNested>;

const defaultAuthType = 'api_key' as const;

const ragicEndpointMeta = {
	'records.list': {
		riskLevel: 'read',
		description:
			'List records from a sheet with filters, full-text search, a saved view, paging and ordering; pass a taskId to check a mass operation instead',
	},
	'records.get': {
		riskLevel: 'read',
		description:
			'Read one record by id, optionally with its subtable, comments, history or unmasked fields. An unknown or deleted id answers an empty object',
	},
	'records.create': {
		riskLevel: 'write',
		description:
			'Create a record from field ID to value, including subtable rows grouped by negative row id, with control over formulas, workflows, AI Agents and notifications',
	},
	'records.update': {
		riskLevel: 'write',
		description:
			'Update only the fields you send on one record, edit a subtable row by its row id, or delete one with _DELSUB_',
	},
	'records.delete': {
		riskLevel: 'destructive',
		description:
			"Delete one record by id. Ragic moves it to the sheet's recycle bin, where it can be restored from the Ragic UI",
	},
	'records.comment': {
		riskLevel: 'write',
		description:
			'Post a comment on a record and return the comment that was added',
	},
	'records.lock': {
		riskLevel: 'write',
		description:
			'Lock a record so it cannot be edited until it is unlocked; the same permission as locking in the form',
	},
	'records.unlock': {
		riskLevel: 'write',
		description: 'Unlock a record that was locked',
	},
	'schema.get': {
		riskLevel: 'read',
		description:
			"Read a sheet's field schema, including field IDs, types and subtables, so a write can be built without guessing. Needs an account manager's API key",
	},
} as const satisfies RequiredPluginEndpointMeta<typeof ragicEndpointsNested>;

export type BaseRagicPlugin<T extends RagicPluginOptions> = CorsairPlugin<
	'ragic',
	typeof RagicSchema,
	typeof ragicEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalRagicPlugin = BaseRagicPlugin<RagicPluginOptions>;

export type ExternalRagicPlugin<T extends RagicPluginOptions> =
	BaseRagicPlugin<T>;

export function ragic<const T extends RagicPluginOptions>(
	incomingOptions: RagicPluginOptions & T = {} as RagicPluginOptions & T,
): ExternalRagicPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
		server: incomingOptions.server ?? ('www.ragic.com' as const),
	};
	return {
		id: 'ragic',
		schema: RagicSchema,
		options: options,
		hooks: options.hooks,
		endpoints: ragicEndpointsNested,
		webhooks: {},
		endpointMeta: ragicEndpointMeta,
		endpointSchemas: ragicEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: RagicKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('ragic', ctx.authType ?? 'api_key');
		},
	} satisfies InternalRagicPlugin;
}

export {
	RAGIC_DEFAULT_SERVER,
	RagicAPIError,
	type RagicServer,
} from './client';

export type {
	RagicEndpointInputs,
	RagicEndpointOutputs,
	RagicFilter,
	RagicRecord,
	RagicRecordSet,
	RecordsCommentInput,
	RecordsCommentResponse,
	RecordsCreateInput,
	RecordsDeleteInput,
	RecordsDeleteResponse,
	RecordsGetInput,
	RecordsGetResponse,
	RecordsListInput,
	RecordsListResponse,
	RecordsLockInput,
	RecordsLockResponse,
	RecordsUpdateInput,
	RecordsUpdateResponse,
	SchemaGetInput,
	SchemaGetResponse,
	WriteResponse,
} from './endpoints/types';
