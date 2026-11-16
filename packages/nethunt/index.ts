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
import { Account, Folders, Records } from './endpoints';
import type {
	NethuntEndpointInputs,
	NethuntEndpointOutputs,
} from './endpoints/types';
import {
	NethuntEndpointInputSchemas,
	NethuntEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { NethuntSchema } from './schema';

export type NethuntPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** The API key, the password half of Basic auth. Overrides the stored key. */
	key?: string;
	/**
	 * The account email, the username half. NetHunt's auth is an email and a key
	 * pair, so both are needed; this overrides the stored `email`.
	 */
	email?: string;
	hooks?: InternalNethuntPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof nethuntEndpointsNested>;
};

export type NethuntContext = CorsairPluginContext<
	typeof NethuntSchema,
	NethuntPluginOptions,
	undefined,
	typeof nethuntAuthConfig
>;

export type NethuntKeyBuilderContext = KeyBuilderContext<NethuntPluginOptions>;

export type NethuntBoundEndpoints = BindEndpoints<
	typeof nethuntEndpointsNested
>;

type NethuntEndpoint<K extends keyof NethuntEndpointOutputs> = CorsairEndpoint<
	NethuntContext,
	NethuntEndpointInputs[K],
	NethuntEndpointOutputs[K]
>;

export type NethuntEndpoints = {
	foldersList: NethuntEndpoint<'foldersList'>;
	foldersFields: NethuntEndpoint<'foldersFields'>;
	recordsFind: NethuntEndpoint<'recordsFind'>;
	recordsRecent: NethuntEndpoint<'recordsRecent'>;
	recordsUpdated: NethuntEndpoint<'recordsUpdated'>;
	recordsChanges: NethuntEndpoint<'recordsChanges'>;
	recordsCreate: NethuntEndpoint<'recordsCreate'>;
	recordsUpdate: NethuntEndpoint<'recordsUpdate'>;
	recordsDelete: NethuntEndpoint<'recordsDelete'>;
	recordsComment: NethuntEndpoint<'recordsComment'>;
	recordsCallLog: NethuntEndpoint<'recordsCallLog'>;
	recordsLinkThread: NethuntEndpoint<'recordsLinkThread'>;
	accountVerify: NethuntEndpoint<'accountVerify'>;
};

export const nethuntEndpointsNested = {
	folders: {
		list: Folders.list,
		fields: Folders.fields,
	},
	records: {
		find: Records.find,
		recent: Records.recent,
		updated: Records.updated,
		changes: Records.changes,
		create: Records.create,
		update: Records.update,
		delete: Records.remove,
		comment: Records.comment,
		callLog: Records.callLog,
		linkThread: Records.linkThread,
	},
	account: {
		verify: Account.verify,
	},
} as const;

export const nethuntEndpointSchemas = {
	'folders.list': {
		input: NethuntEndpointInputSchemas.foldersList,
		output: NethuntEndpointOutputSchemas.foldersList,
	},
	'folders.fields': {
		input: NethuntEndpointInputSchemas.foldersFields,
		output: NethuntEndpointOutputSchemas.foldersFields,
	},
	'records.find': {
		input: NethuntEndpointInputSchemas.recordsFind,
		output: NethuntEndpointOutputSchemas.recordsFind,
	},
	'records.recent': {
		input: NethuntEndpointInputSchemas.recordsRecent,
		output: NethuntEndpointOutputSchemas.recordsRecent,
	},
	'records.updated': {
		input: NethuntEndpointInputSchemas.recordsUpdated,
		output: NethuntEndpointOutputSchemas.recordsUpdated,
	},
	'records.changes': {
		input: NethuntEndpointInputSchemas.recordsChanges,
		output: NethuntEndpointOutputSchemas.recordsChanges,
	},
	'records.create': {
		input: NethuntEndpointInputSchemas.recordsCreate,
		output: NethuntEndpointOutputSchemas.recordsCreate,
	},
	'records.update': {
		input: NethuntEndpointInputSchemas.recordsUpdate,
		output: NethuntEndpointOutputSchemas.recordsUpdate,
	},
	'records.delete': {
		input: NethuntEndpointInputSchemas.recordsDelete,
		output: NethuntEndpointOutputSchemas.recordsDelete,
	},
	'records.comment': {
		input: NethuntEndpointInputSchemas.recordsComment,
		output: NethuntEndpointOutputSchemas.recordsComment,
	},
	'records.callLog': {
		input: NethuntEndpointInputSchemas.recordsCallLog,
		output: NethuntEndpointOutputSchemas.recordsCallLog,
	},
	'records.linkThread': {
		input: NethuntEndpointInputSchemas.recordsLinkThread,
		output: NethuntEndpointOutputSchemas.recordsLinkThread,
	},
	'account.verify': {
		input: NethuntEndpointInputSchemas.accountVerify,
		output: NethuntEndpointOutputSchemas.accountVerify,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof nethuntEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

/**
 * NetHunt authenticates with Basic auth: the username is the account email and
 * the password is the API key. Both live on the account, because `keyBuilder`
 * only generates accessors for account-level fields on an `api_key` account.
 */
export const nethuntAuthConfig = {
	api_key: {
		account: ['email'] as const,
	},
} as const satisfies PluginAuthConfig;

const nethuntEndpointMeta = {
	'folders.list': {
		riskLevel: 'read',
		description:
			'List the folders this account can read, or only the ones it may create records in',
	},
	'folders.fields': {
		riskLevel: 'read',
		description:
			"List a folder's field names, which are user-defined and are what a create or update must use",
	},
	'records.find': {
		riskLevel: 'read',
		description:
			'Find records in a folder by id or by a text query such as Name:Doe',
	},
	'records.recent': {
		riskLevel: 'read',
		description:
			'List records created in a folder after a timestamp; NetHunt defaults the window to 24 hours',
	},
	'records.updated': {
		riskLevel: 'read',
		description:
			'List records updated in a folder after a timestamp, optionally only when named fields changed',
	},
	'records.changes': {
		riskLevel: 'read',
		description:
			'Read the audit trail for a folder: who changed which field, when, with before and after values, including deletes',
	},
	'records.create': {
		riskLevel: 'write',
		description:
			'Create one record in a folder from a flat map of the folder’s field names, with the time zone NetHunt needs to read dates',
	},
	'records.update': {
		riskLevel: 'write',
		description:
			'Update a record’s fields through per-field actions, each able to overwrite, remove or add values',
	},
	'records.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a record permanently; NetHunt has no restore route and the audit trail keeps only the change entry',
	},
	'records.comment': {
		riskLevel: 'write',
		description: 'Add a comment to a record’s timeline',
	},
	'records.callLog': {
		riskLevel: 'write',
		description:
			'Log a call on a record’s timeline with its start time and duration in minutes',
	},
	'records.linkThread': {
		riskLevel: 'write',
		description: 'Attach an existing Gmail thread to a record',
	},
	'account.verify': {
		riskLevel: 'read',
		description:
			'Confirm the email and key pair work and return the user behind them',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof nethuntEndpointsNested>;

export type BaseNethuntPlugin<T extends NethuntPluginOptions> = CorsairPlugin<
	'nethunt',
	typeof NethuntSchema,
	typeof nethuntEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalNethuntPlugin = BaseNethuntPlugin<NethuntPluginOptions>;

export type ExternalNethuntPlugin<T extends NethuntPluginOptions> =
	BaseNethuntPlugin<T>;

export function nethunt<const T extends NethuntPluginOptions>(
	incomingOptions: NethuntPluginOptions & T = {} as NethuntPluginOptions & T,
): ExternalNethuntPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'nethunt',
		authConfig: nethuntAuthConfig,
		schema: NethuntSchema,
		options: options,
		hooks: options.hooks,
		endpoints: nethuntEndpointsNested,
		webhooks: {},
		endpointMeta: nethuntEndpointMeta,
		endpointSchemas: nethuntEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: NethuntKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('nethunt', ctx.authType ?? 'api_key');
		},
	} satisfies InternalNethuntPlugin;
}

export { NethuntAPIError } from './client';

export type {
	AccountVerifyInput,
	AccountVerifyResponse,
	FoldersFieldsInput,
	FoldersFieldsResponse,
	FoldersListInput,
	FoldersListResponse,
	NethuntEndpointInputs,
	NethuntEndpointOutputs,
	NethuntFolder,
	NethuntRecord,
	NethuntUser,
	RecordsCallLogInput,
	RecordsCallLogResponse,
	RecordsChangesInput,
	RecordsChangesResponse,
	RecordsCommentInput,
	RecordsCommentResponse,
	RecordsCreateInput,
	RecordsCreateResponse,
	RecordsDeleteInput,
	RecordsDeleteResponse,
	RecordsFindInput,
	RecordsFindResponse,
	RecordsLinkThreadInput,
	RecordsLinkThreadResponse,
	RecordsRecentInput,
	RecordsRecentResponse,
	RecordsUpdatedInput,
	RecordsUpdatedResponse,
	RecordsUpdateInput,
	RecordsUpdateResponse,
} from './endpoints/types';
