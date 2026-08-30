import type {
	AuthTypes,
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	Auth,
	Forms,
	Submissions,
	Token,
	Unsupported,
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
import { FormWebhooks } from './webhooks';
import { resolveFilloutFormsOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchFilloutFormsTenantWebhook } from './webhooks/tenant-matcher';
import type {
	FilloutFormSubmissionEvent,
	FilloutWebhookOutputs,
} from './webhooks/types';
import { FilloutFormSubmissionEventPayloadSchema } from './webhooks/types';

export type FilloutFormsPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalFilloutFormsPlugin['hooks'];
	webhookHooks?: InternalFilloutFormsPlugin['webhookHooks'];
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
	updateSubmission: FilloutFormsEndpoint<'updateSubmission'>;
	deleteSubmission: FilloutFormsEndpoint<'deleteSubmission'>;
	createDatabaseWebhook: FilloutFormsEndpoint<'createDatabaseWebhook'>;
	listDatabaseWebhooks: FilloutFormsEndpoint<'listDatabaseWebhooks'>;
	deleteDatabaseWebhook: FilloutFormsEndpoint<'deleteDatabaseWebhook'>;
	removeFormWebhook: FilloutFormsEndpoint<'removeFormWebhook'>;
	invalidateAccessToken: FilloutFormsEndpoint<'invalidateAccessToken'>;
	authorizeOAuth: FilloutFormsEndpoint<'authorizeOAuth'>;
};

type FilloutFormsWebhook<
	K extends keyof FilloutWebhookOutputs,
	TEvent,
> = CorsairWebhook<FilloutFormsContext, TEvent, FilloutWebhookOutputs[K]>;

export type FilloutFormsWebhooks = {
	formSubmission: FilloutFormsWebhook<
		'formSubmission',
		FilloutFormSubmissionEvent
	>;
};

export type FilloutFormsBoundWebhooks = BindWebhooks<FilloutFormsWebhooks>;

const filloutFormsEndpointsNested = {
	forms: {
		getForms: Forms.getForms,
		getFormMetadata: Forms.getFormMetadata,
	},
	databases: {
		getDatabases: Unsupported.getDatabases,
		getDatabaseById: Unsupported.getDatabaseById,
		createDatabase: Unsupported.createDatabase,
		deleteDatabase: Unsupported.deleteDatabase,
	},
	tables: {
		createTable: Unsupported.createTable,
		updateTable: Unsupported.updateTable,
		deleteTable: Unsupported.deleteTable,
	},
	fields: {
		createField: Unsupported.createField,
		updateField: Unsupported.updateField,
		deleteField: Unsupported.deleteField,
	},
	submissions: {
		list: Submissions.list,
		getById: Submissions.getById,
		create: Submissions.create,
		update: Unsupported.updateSubmission,
		delete: Submissions.delete,
	},
	webhooks: {
		create: Webhooks.create,
		list: Unsupported.listDatabaseWebhooks,
		delete: Unsupported.deleteDatabaseWebhook,
		removeForm: Webhooks.remove,
	},
	token: {
		invalidate: Token.invalidateAccessToken,
	},
	oauth: {
		authorize: Auth.authorizeOAuth,
	},
} as const;

const filloutFormsWebhooksNested = {
	form: {
		formSubmission: FormWebhooks.formSubmission,
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
	'databases.getDatabases': {
		input: FilloutFormsEndpointInputSchemas.getDatabases,
		output: FilloutFormsEndpointOutputSchemas.getDatabases,
	},
	'databases.getDatabaseById': {
		input: FilloutFormsEndpointInputSchemas.getDatabaseById,
		output: FilloutFormsEndpointOutputSchemas.getDatabaseById,
	},
	'databases.createDatabase': {
		input: FilloutFormsEndpointInputSchemas.createDatabase,
		output: FilloutFormsEndpointOutputSchemas.createDatabase,
	},
	'databases.deleteDatabase': {
		input: FilloutFormsEndpointInputSchemas.deleteDatabase,
		output: FilloutFormsEndpointOutputSchemas.deleteDatabase,
	},
	'tables.createTable': {
		input: FilloutFormsEndpointInputSchemas.createTable,
		output: FilloutFormsEndpointOutputSchemas.createTable,
	},
	'tables.updateTable': {
		input: FilloutFormsEndpointInputSchemas.updateTable,
		output: FilloutFormsEndpointOutputSchemas.updateTable,
	},
	'tables.deleteTable': {
		input: FilloutFormsEndpointInputSchemas.deleteTable,
		output: FilloutFormsEndpointOutputSchemas.deleteTable,
	},
	'fields.createField': {
		input: FilloutFormsEndpointInputSchemas.createField,
		output: FilloutFormsEndpointOutputSchemas.createField,
	},
	'fields.updateField': {
		input: FilloutFormsEndpointInputSchemas.updateField,
		output: FilloutFormsEndpointOutputSchemas.updateField,
	},
	'fields.deleteField': {
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
	'submissions.update': {
		input: FilloutFormsEndpointInputSchemas.updateSubmission,
		output: FilloutFormsEndpointOutputSchemas.updateSubmission,
	},
	'submissions.delete': {
		input: FilloutFormsEndpointInputSchemas.deleteSubmission,
		output: FilloutFormsEndpointOutputSchemas.deleteSubmission,
	},
	'webhooks.create': {
		input: FilloutFormsEndpointInputSchemas.createDatabaseWebhook,
		output: FilloutFormsEndpointOutputSchemas.createDatabaseWebhook,
	},
	'webhooks.list': {
		input: FilloutFormsEndpointInputSchemas.listDatabaseWebhooks,
		output: FilloutFormsEndpointOutputSchemas.listDatabaseWebhooks,
	},
	'webhooks.delete': {
		input: FilloutFormsEndpointInputSchemas.deleteDatabaseWebhook,
		output: FilloutFormsEndpointOutputSchemas.deleteDatabaseWebhook,
	},
	'webhooks.removeForm': {
		input: FilloutFormsEndpointInputSchemas.removeFormWebhook,
		output: FilloutFormsEndpointOutputSchemas.removeFormWebhook,
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

const filloutFormsWebhookSchemas = {
	'form.formSubmission': {
		description: 'Fires when a form submission is received via Fillout webhook',
		payload: FilloutFormSubmissionEventPayloadSchema,
		response: FilloutFormSubmissionEventPayloadSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof filloutFormsWebhooksNested
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
	'databases.getDatabases': {
		riskLevel: 'read',
		description:
			'Not supported by Fillout API. Fillout does not expose database endpoints.',
	},
	'databases.getDatabaseById': {
		riskLevel: 'read',
		description:
			'Not supported by Fillout API. Fillout does not expose database endpoints.',
	},
	'databases.createDatabase': {
		riskLevel: 'write',
		description:
			'Not supported by Fillout API. Fillout does not expose database endpoints.',
	},
	'databases.deleteDatabase': {
		riskLevel: 'destructive',
		description:
			'Not supported by Fillout API. Fillout does not expose database endpoints.',
	},
	'tables.createTable': {
		riskLevel: 'write',
		description:
			'Not supported by Fillout API. Fillout does not expose table endpoints.',
	},
	'tables.updateTable': {
		riskLevel: 'write',
		description:
			'Not supported by Fillout API. Fillout does not expose table endpoints.',
	},
	'tables.deleteTable': {
		riskLevel: 'destructive',
		description:
			'Not supported by Fillout API. Fillout does not expose table endpoints.',
	},
	'fields.createField': {
		riskLevel: 'write',
		description:
			'Not supported by Fillout API. Fillout does not expose field endpoints.',
	},
	'fields.updateField': {
		riskLevel: 'write',
		description:
			'Not supported by Fillout API. Fillout does not expose field endpoints.',
	},
	'fields.deleteField': {
		riskLevel: 'destructive',
		description:
			'Not supported by Fillout API. Fillout does not expose field endpoints.',
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
	'submissions.update': {
		riskLevel: 'write',
		description:
			'Not supported by Fillout API. Use submissions.create to add new submissions.',
	},
	'submissions.delete': {
		riskLevel: 'destructive',
		description: 'Delete a form submission by ID',
	},
	'webhooks.create': {
		riskLevel: 'write',
		description: 'Create a webhook subscription for form submissions',
	},
	'webhooks.list': {
		riskLevel: 'read',
		description:
			'Not supported by Fillout API. Fillout does not expose webhook listing.',
	},
	'webhooks.delete': {
		riskLevel: 'destructive',
		description:
			'Not supported by Fillout API. Use webhooks.removeForm to remove form webhooks.',
	},
	'webhooks.removeForm': {
		riskLevel: 'destructive',
		description: 'Remove a webhook from a form',
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
		typeof filloutFormsWebhooksNested,
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
		webhookHooks: options.webhookHooks,
		endpoints: filloutFormsEndpointsNested,
		webhooks: filloutFormsWebhooksNested,
		endpointMeta: filloutFormsEndpointMeta,
		endpointSchemas: filloutFormsEndpointSchemas,
		webhookSchemas: filloutFormsWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			return 'x-fillout-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchFilloutFormsTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveFilloutFormsOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: FilloutFormsKeyBuilderContext, source) => {
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature();
				if (!res) {
					throw new Error(
						'[auth-missing:filloutforms:webhook_signature]: Fillout webhook signature is missing',
					);
				}
				return res;
			}

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

// ─────────────────────────────────────────────────────────────────────────────
// Webhook Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	FilloutFormSubmissionEvent,
	FilloutWebhookOutputs,
	FilloutWebhookSubmission,
} from './webhooks/types';

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	AuthorizeOAuthInput,
	AuthorizeOAuthResponse,
	CreateSubmissionInput,
	CreateSubmissionResponse,
	CreateWebhookInput,
	CreateWebhookResponse,
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
	RemoveWebhookInput,
	RemoveWebhookResponse,
} from './endpoints/types';
