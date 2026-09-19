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
import {
	Auth,
	Databases,
	Fields,
	Forms,
	Records,
	Submissions,
	Tables,
	Token,
	Webhooks,
} from './endpoints';
import type {
	FilloutFormsEndpointInputs,
	FilloutFormsEndpointOutputs,
} from './endpoints/types';
import {
	FilloutFormsEndpointInputSchemas,
	FilloutFormsEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { FilloutFormsSchema } from './schema';

export type FilloutFormsPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	hooks?: InternalFilloutFormsPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof filloutFormsEndpointsNested>;
};

export type FilloutFormsContext = CorsairPluginContext<
	typeof FilloutFormsSchema,
	FilloutFormsPluginOptions
>;

export type FilloutFormsKeyBuilderContext =
	KeyBuilderContext<FilloutFormsPluginOptions>;

export type FilloutFormsBoundEndpoints = BindEndpoints<
	typeof filloutFormsEndpointsNested
>;

type FilloutFormsEndpoint<K extends keyof FilloutFormsEndpointOutputs> =
	CorsairEndpoint<
		FilloutFormsContext,
		FilloutFormsEndpointInputs[K],
		FilloutFormsEndpointOutputs[K]
	>;

export type FilloutFormsEndpoints = {
	getForms: FilloutFormsEndpoint<'getForms'>;
	getFormMetadata: FilloutFormsEndpoint<'getFormMetadata'>;
	getDatabases: FilloutFormsEndpoint<'getDatabases'>;
	getDatabaseById: FilloutFormsEndpoint<'getDatabaseById'>;
	createDatabase: FilloutFormsEndpoint<'createDatabase'>;
	deleteDatabase: FilloutFormsEndpoint<'deleteDatabase'>;
	createTable: FilloutFormsEndpoint<'createTable'>;
	updateTable: FilloutFormsEndpoint<'updateTable'>;
	deleteTable: FilloutFormsEndpoint<'deleteTable'>;
	createField: FilloutFormsEndpoint<'createField'>;
	updateField: FilloutFormsEndpoint<'updateField'>;
	deleteField: FilloutFormsEndpoint<'deleteField'>;
	listSubmissions: FilloutFormsEndpoint<'listSubmissions'>;
	getSubmissionById: FilloutFormsEndpoint<'getSubmissionById'>;
	createSubmission: FilloutFormsEndpoint<'createSubmission'>;
	deleteSubmission: FilloutFormsEndpoint<'deleteSubmission'>;
	listRecords: FilloutFormsEndpoint<'listRecords'>;
	getRecordById: FilloutFormsEndpoint<'getRecordById'>;
	createRecord: FilloutFormsEndpoint<'createRecord'>;
	updateRecord: FilloutFormsEndpoint<'updateRecord'>;
	deleteRecord: FilloutFormsEndpoint<'deleteRecord'>;
	createFormWebhook: FilloutFormsEndpoint<'createFormWebhook'>;
	createDatabaseWebhook: FilloutFormsEndpoint<'createDatabaseWebhook'>;
	listDatabaseWebhooks: FilloutFormsEndpoint<'listDatabaseWebhooks'>;
	deleteDatabaseWebhook: FilloutFormsEndpoint<'deleteDatabaseWebhook'>;
	removeFormWebhook: FilloutFormsEndpoint<'removeFormWebhook'>;
	invalidateAccessToken: FilloutFormsEndpoint<'invalidateAccessToken'>;
	authorizeOAuth: FilloutFormsEndpoint<'authorizeOAuth'>;
};

const filloutFormsEndpointsNested = {
	forms: {
		getForms: Forms.getForms,
		getFormMetadata: Forms.getFormMetadata,
	},
	databases: {
		get: Databases.get,
		getById: Databases.getById,
		create: Databases.create,
		delete: Databases.delete,
	},
	tables: {
		create: Tables.create,
		update: Tables.update,
		delete: Tables.delete,
	},
	fields: {
		create: Fields.create,
		update: Fields.update,
		delete: Fields.delete,
	},
	submissions: {
		list: Submissions.list,
		getById: Submissions.getById,
		create: Submissions.create,
		delete: Submissions.delete,
	},
	records: {
		list: Records.list,
		getById: Records.getById,
		create: Records.create,
		update: Records.update,
		delete: Records.delete,
	},
	webhooks: {
		createForm: Webhooks.createForm,
		removeForm: Webhooks.removeForm,
		createDatabase: Webhooks.createDatabase,
		listDatabase: Webhooks.listDatabase,
		deleteDatabase: Webhooks.deleteDatabase,
	},
	token: {
		invalidate: Token.invalidateAccessToken,
	},
	oauth: {
		authorize: Auth.authorizeOAuth,
	},
} as const;

export const filloutFormsEndpointSchemas = {
	'forms.getForms': {
		input: FilloutFormsEndpointInputSchemas.getForms,
		output: FilloutFormsEndpointOutputSchemas.getForms,
	},
	'forms.getFormMetadata': {
		input: FilloutFormsEndpointInputSchemas.getFormMetadata,
		output: FilloutFormsEndpointOutputSchemas.getFormMetadata,
	},
	'databases.get': {
		input: FilloutFormsEndpointInputSchemas.getDatabases,
		output: FilloutFormsEndpointOutputSchemas.getDatabases,
	},
	'databases.getById': {
		input: FilloutFormsEndpointInputSchemas.getDatabaseById,
		output: FilloutFormsEndpointOutputSchemas.getDatabaseById,
	},
	'databases.create': {
		input: FilloutFormsEndpointInputSchemas.createDatabase,
		output: FilloutFormsEndpointOutputSchemas.createDatabase,
	},
	'databases.delete': {
		input: FilloutFormsEndpointInputSchemas.deleteDatabase,
		output: FilloutFormsEndpointOutputSchemas.deleteDatabase,
	},
	'tables.create': {
		input: FilloutFormsEndpointInputSchemas.createTable,
		output: FilloutFormsEndpointOutputSchemas.createTable,
	},
	'tables.update': {
		input: FilloutFormsEndpointInputSchemas.updateTable,
		output: FilloutFormsEndpointOutputSchemas.updateTable,
	},
	'tables.delete': {
		input: FilloutFormsEndpointInputSchemas.deleteTable,
		output: FilloutFormsEndpointOutputSchemas.deleteTable,
	},
	'fields.create': {
		input: FilloutFormsEndpointInputSchemas.createField,
		output: FilloutFormsEndpointOutputSchemas.createField,
	},
	'fields.update': {
		input: FilloutFormsEndpointInputSchemas.updateField,
		output: FilloutFormsEndpointOutputSchemas.updateField,
	},
	'fields.delete': {
		input: FilloutFormsEndpointInputSchemas.deleteField,
		output: FilloutFormsEndpointOutputSchemas.deleteField,
	},
	'submissions.list': {
		input: FilloutFormsEndpointInputSchemas.listSubmissions,
		output: FilloutFormsEndpointOutputSchemas.listSubmissions,
	},
	'submissions.getById': {
		input: FilloutFormsEndpointInputSchemas.getSubmissionById,
		output: FilloutFormsEndpointOutputSchemas.getSubmissionById,
	},
	'submissions.create': {
		input: FilloutFormsEndpointInputSchemas.createSubmission,
		output: FilloutFormsEndpointOutputSchemas.createSubmission,
	},
	'submissions.delete': {
		input: FilloutFormsEndpointInputSchemas.deleteSubmission,
		output: FilloutFormsEndpointOutputSchemas.deleteSubmission,
	},
	'records.list': {
		input: FilloutFormsEndpointInputSchemas.listRecords,
		output: FilloutFormsEndpointOutputSchemas.listRecords,
	},
	'records.getById': {
		input: FilloutFormsEndpointInputSchemas.getRecordById,
		output: FilloutFormsEndpointOutputSchemas.getRecordById,
	},
	'records.create': {
		input: FilloutFormsEndpointInputSchemas.createRecord,
		output: FilloutFormsEndpointOutputSchemas.createRecord,
	},
	'records.update': {
		input: FilloutFormsEndpointInputSchemas.updateRecord,
		output: FilloutFormsEndpointOutputSchemas.updateRecord,
	},
	'records.delete': {
		input: FilloutFormsEndpointInputSchemas.deleteRecord,
		output: FilloutFormsEndpointOutputSchemas.deleteRecord,
	},
	'webhooks.createForm': {
		input: FilloutFormsEndpointInputSchemas.createFormWebhook,
		output: FilloutFormsEndpointOutputSchemas.createFormWebhook,
	},
	'webhooks.removeForm': {
		input: FilloutFormsEndpointInputSchemas.removeFormWebhook,
		output: FilloutFormsEndpointOutputSchemas.removeFormWebhook,
	},
	'webhooks.createDatabase': {
		input: FilloutFormsEndpointInputSchemas.createDatabaseWebhook,
		output: FilloutFormsEndpointOutputSchemas.createDatabaseWebhook,
	},
	'webhooks.listDatabase': {
		input: FilloutFormsEndpointInputSchemas.listDatabaseWebhooks,
		output: FilloutFormsEndpointOutputSchemas.listDatabaseWebhooks,
	},
	'webhooks.deleteDatabase': {
		input: FilloutFormsEndpointInputSchemas.deleteDatabaseWebhook,
		output: FilloutFormsEndpointOutputSchemas.deleteDatabaseWebhook,
	},
	'token.invalidate': {
		input: FilloutFormsEndpointInputSchemas.invalidateAccessToken,
		output: FilloutFormsEndpointOutputSchemas.invalidateAccessToken,
	},
	'oauth.authorize': {
		input: FilloutFormsEndpointInputSchemas.authorizeOAuth,
		output: FilloutFormsEndpointOutputSchemas.authorizeOAuth,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof filloutFormsEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const filloutFormsEndpointMeta = {
	'forms.getForms': {
		riskLevel: 'read',
		description: 'List all Fillout forms',
	},
	'forms.getFormMetadata': {
		riskLevel: 'read',
		description: 'Get form metadata including questions and configuration',
	},
	'databases.get': {
		riskLevel: 'read',
		description: 'List Zite databases for the organization',
	},
	'databases.getById': {
		riskLevel: 'read',
		description: 'Get a Zite database with tables, fields, and views',
	},
	'databases.create': {
		riskLevel: 'write',
		description: 'Create a Zite database with tables and fields',
	},
	'databases.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a Zite database',
	},
	'tables.create': {
		riskLevel: 'write',
		description: 'Create a table in a Zite database',
	},
	'tables.update': {
		riskLevel: 'write',
		description: 'Update Zite table properties such as name',
	},
	'tables.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a Zite table',
	},
	'fields.create': {
		riskLevel: 'write',
		description: 'Add a field to a Zite table',
	},
	'fields.update': {
		riskLevel: 'write',
		description: 'Update a Zite field name or template',
	},
	'fields.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a Zite field',
	},
	'submissions.list': {
		riskLevel: 'read',
		description: 'List form submissions with filtering and pagination',
	},
	'submissions.getById': {
		riskLevel: 'read',
		description: 'Get a single submission by ID',
	},
	'submissions.create': {
		riskLevel: 'write',
		description: 'Create new form submissions',
	},
	'submissions.delete': {
		riskLevel: 'destructive',
		description: 'Delete a form submission by ID',
	},
	'records.list': {
		riskLevel: 'read',
		description: 'List Zite records with filter, sort, and pagination',
	},
	'records.getById': {
		riskLevel: 'read',
		description: 'Get a Zite record by UUID',
	},
	'records.create': {
		riskLevel: 'write',
		description: 'Create a Zite record',
	},
	'records.update': {
		riskLevel: 'write',
		description: 'Update fields on a Zite record',
	},
	'records.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a Zite record',
	},
	'webhooks.createForm': {
		riskLevel: 'write',
		description: 'Create a Fillout form submission webhook',
	},
	'webhooks.removeForm': {
		riskLevel: 'destructive',
		description: 'Remove a Fillout form webhook',
	},
	'webhooks.createDatabase': {
		riskLevel: 'write',
		description: 'Create a Zite database webhook',
	},
	'webhooks.listDatabase': {
		riskLevel: 'read',
		description: 'List Zite database webhooks',
	},
	'webhooks.deleteDatabase': {
		riskLevel: 'destructive',
		description: 'Delete a Zite database webhook',
	},
	'token.invalidate': {
		riskLevel: 'destructive',
		description: 'Invalidate/revoke an OAuth access token',
	},
	'oauth.authorize': {
		riskLevel: 'read',
		description: 'Generate the Fillout OAuth authorization URL',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof filloutFormsEndpointsNested
>;

export const filloutFormsAuthConfig = {
	api_key: {
		account: ['form_id'] as const,
	},
	oauth_2: {
		account: ['form_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseFilloutFormsPlugin<T extends FilloutFormsPluginOptions> =
	CorsairPlugin<
		'filloutforms',
		typeof FilloutFormsSchema,
		typeof filloutFormsEndpointsNested,
		{},
		T,
		typeof defaultAuthType
	>;

export type InternalFilloutFormsPlugin =
	BaseFilloutFormsPlugin<FilloutFormsPluginOptions>;

export type ExternalFilloutFormsPlugin<T extends FilloutFormsPluginOptions> =
	BaseFilloutFormsPlugin<T>;

export function filloutforms<const T extends FilloutFormsPluginOptions>(
	incomingOptions: FilloutFormsPluginOptions &
		T = {} as FilloutFormsPluginOptions & T,
): ExternalFilloutFormsPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'filloutforms',
		authConfig: filloutFormsAuthConfig,
		oauthConfig: {
			providerName: 'Fillout',
			authUrl: 'https://build.fillout.com/authorize/oauth',
			tokenUrl: 'https://server.fillout.com/public/oauth/accessToken',
			scopes: [],
		},
		schema: FilloutFormsSchema,
		options: options,
		hooks: options.hooks,
		endpoints: filloutFormsEndpointsNested,
		webhooks: {},
		endpointMeta: filloutFormsEndpointMeta,
		endpointSchemas: filloutFormsEndpointSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: FilloutFormsKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('filloutforms', 'api_key');
				}
				return res;
			}

			if (source === 'endpoint' && ctx.authType === 'oauth_2') {
				const res = await ctx.keys.get_access_token();
				if (!res) {
					throw new AuthMissingError('filloutforms', 'oauth_2');
				}
				return res;
			}

			throw new AuthMissingError('filloutforms', 'api_key');
		},
	} satisfies InternalFilloutFormsPlugin;
}

export type {
	AuthorizeOAuthInput,
	AuthorizeOAuthResponse,
	CreateFormWebhookInput,
	CreateFormWebhookResponse,
	CreateSubmissionInput,
	CreateSubmissionResponse,
	DeleteSubmissionInput,
	DeleteSubmissionResponse,
	FilloutFormsEndpointInputs,
	FilloutFormsEndpointOutputs,
	GetFormMetadataInput,
	GetFormMetadataResponse,
	GetFormsInput,
	GetFormsResponse,
	GetSubmissionByIdInput,
	GetSubmissionByIdResponse,
	InvalidateAccessTokenInput,
	InvalidateAccessTokenResponse,
	ListSubmissionsInput,
	ListSubmissionsResponse,
	RemoveFormWebhookInput,
	RemoveFormWebhookResponse,
} from './endpoints/types';
