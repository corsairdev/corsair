import type {
	AuthTypes,
	BindEndpoints,
	BindWebhooks,
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
	Domains,
	Forms,
	FormViews,
	Projects,
	Submissions,
	Webhooks,
} from './endpoints';
import type {
	BasinEndpointInputs,
	BasinEndpointOutputs,
} from './endpoints/types';
import {
	BasinEndpointInputSchemas,
	BasinEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { BasinSchema } from './schema';

// ─────────────────────────────────────────────────────────────────────────────
// Plugin Options & Context
// ─────────────────────────────────────────────────────────────────────────────

export type BasinPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalBasinPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof basinEndpointsNested>;
};

export type BasinContext = CorsairPluginContext<
	typeof BasinSchema,
	BasinPluginOptions
>;

export type BasinKeyBuilderContext = KeyBuilderContext<BasinPluginOptions>;

export type BasinBoundEndpoints = BindEndpoints<typeof basinEndpointsNested>;

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Type Map
// ─────────────────────────────────────────────────────────────────────────────

type BasinEndpoint<K extends keyof BasinEndpointOutputs> = CorsairEndpoint<
	BasinContext,
	BasinEndpointInputs[K],
	BasinEndpointOutputs[K]
>;

export type BasinEndpoints = {
	formsList: BasinEndpoint<'formsList'>;
	formsGet: BasinEndpoint<'formsGet'>;
	formsCreate: BasinEndpoint<'formsCreate'>;
	formsUpdate: BasinEndpoint<'formsUpdate'>;
	formsDelete: BasinEndpoint<'formsDelete'>;
	submissionsList: BasinEndpoint<'submissionsList'>;
	submissionsGet: BasinEndpoint<'submissionsGet'>;
	submissionsDelete: BasinEndpoint<'submissionsDelete'>;
	submissionsUpdate: BasinEndpoint<'submissionsUpdate'>;
	submissionsMarkSpam: BasinEndpoint<'submissionsMarkSpam'>;
	submissionsMarkHam: BasinEndpoint<'submissionsMarkHam'>;
	submissionsRefireWebhooks: BasinEndpoint<'submissionsRefireWebhooks'>;
	submissionsRefireWebhooksBulk: BasinEndpoint<'submissionsRefireWebhooksBulk'>;
	projectsList: BasinEndpoint<'projectsList'>;
	projectsGet: BasinEndpoint<'projectsGet'>;
	projectsCreate: BasinEndpoint<'projectsCreate'>;
	projectsUpdate: BasinEndpoint<'projectsUpdate'>;
	projectsDelete: BasinEndpoint<'projectsDelete'>;
	webhooksList: BasinEndpoint<'webhooksList'>;
	webhooksGet: BasinEndpoint<'webhooksGet'>;
	webhooksCreate: BasinEndpoint<'webhooksCreate'>;
	webhooksUpdate: BasinEndpoint<'webhooksUpdate'>;
	webhooksDelete: BasinEndpoint<'webhooksDelete'>;
	formViewsList: BasinEndpoint<'formViewsList'>;
	formViewsGet: BasinEndpoint<'formViewsGet'>;
	domainsList: BasinEndpoint<'domainsList'>;
};

// ─────────────────────────────────────────────────────────────────────────────
// Webhook Types (REST-only integration)
// ─────────────────────────────────────────────────────────────────────────────

export type BasinWebhooks = {};
export type BasinBoundWebhooks = BindWebhooks<BasinWebhooks>;
export type BasinWebhookOutputs = {};

// ─────────────────────────────────────────────────────────────────────────────
// Nested Endpoint Tree
// ─────────────────────────────────────────────────────────────────────────────

const basinEndpointsNested = {
	forms: {
		list: Forms.list,
		get: Forms.get,
		create: Forms.create,
		update: Forms.update,
		delete: Forms.delete,
	},
	submissions: {
		list: Submissions.list,
		get: Submissions.get,
		delete: Submissions.delete,
		update: Submissions.update,
		markSpam: Submissions.markSpam,
		markHam: Submissions.markHam,
		refireWebhooks: Submissions.refireWebhooks,
		refireWebhooksBulk: Submissions.refireWebhooksBulk,
	},
	projects: {
		list: Projects.list,
		get: Projects.get,
		create: Projects.create,
		update: Projects.update,
		delete: Projects.delete,
	},
	webhooks: {
		list: Webhooks.list,
		get: Webhooks.get,
		create: Webhooks.create,
		update: Webhooks.update,
		delete: Webhooks.delete,
	},
	formViews: {
		list: FormViews.list,
		get: FormViews.get,
	},
	domains: {
		list: Domains.list,
	},
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Schemas
// ─────────────────────────────────────────────────────────────────────────────

export const basinEndpointSchemas = {
	'forms.list': {
		input: BasinEndpointInputSchemas.formsList,
		output: BasinEndpointOutputSchemas.formsList,
	},
	'forms.get': {
		input: BasinEndpointInputSchemas.formsGet,
		output: BasinEndpointOutputSchemas.formsGet,
	},
	'forms.create': {
		input: BasinEndpointInputSchemas.formsCreate,
		output: BasinEndpointOutputSchemas.formsCreate,
	},
	'forms.update': {
		input: BasinEndpointInputSchemas.formsUpdate,
		output: BasinEndpointOutputSchemas.formsUpdate,
	},
	'forms.delete': {
		input: BasinEndpointInputSchemas.formsDelete,
		output: BasinEndpointOutputSchemas.formsDelete,
	},
	'submissions.list': {
		input: BasinEndpointInputSchemas.submissionsList,
		output: BasinEndpointOutputSchemas.submissionsList,
	},
	'submissions.get': {
		input: BasinEndpointInputSchemas.submissionsGet,
		output: BasinEndpointOutputSchemas.submissionsGet,
	},
	'submissions.delete': {
		input: BasinEndpointInputSchemas.submissionsDelete,
		output: BasinEndpointOutputSchemas.submissionsDelete,
	},
	'submissions.update': {
		input: BasinEndpointInputSchemas.submissionsUpdate,
		output: BasinEndpointOutputSchemas.submissionsUpdate,
	},
	'submissions.markSpam': {
		input: BasinEndpointInputSchemas.submissionsMarkSpam,
		output: BasinEndpointOutputSchemas.submissionsMarkSpam,
	},
	'submissions.markHam': {
		input: BasinEndpointInputSchemas.submissionsMarkHam,
		output: BasinEndpointOutputSchemas.submissionsMarkHam,
	},
	'submissions.refireWebhooks': {
		input: BasinEndpointInputSchemas.submissionsRefireWebhooks,
		output: BasinEndpointOutputSchemas.submissionsRefireWebhooks,
	},
	'submissions.refireWebhooksBulk': {
		input: BasinEndpointInputSchemas.submissionsRefireWebhooksBulk,
		output: BasinEndpointOutputSchemas.submissionsRefireWebhooksBulk,
	},
	'projects.list': {
		input: BasinEndpointInputSchemas.projectsList,
		output: BasinEndpointOutputSchemas.projectsList,
	},
	'projects.get': {
		input: BasinEndpointInputSchemas.projectsGet,
		output: BasinEndpointOutputSchemas.projectsGet,
	},
	'projects.create': {
		input: BasinEndpointInputSchemas.projectsCreate,
		output: BasinEndpointOutputSchemas.projectsCreate,
	},
	'projects.update': {
		input: BasinEndpointInputSchemas.projectsUpdate,
		output: BasinEndpointOutputSchemas.projectsUpdate,
	},
	'projects.delete': {
		input: BasinEndpointInputSchemas.projectsDelete,
		output: BasinEndpointOutputSchemas.projectsDelete,
	},
	'webhooks.list': {
		input: BasinEndpointInputSchemas.webhooksList,
		output: BasinEndpointOutputSchemas.webhooksList,
	},
	'webhooks.get': {
		input: BasinEndpointInputSchemas.webhooksGet,
		output: BasinEndpointOutputSchemas.webhooksGet,
	},
	'webhooks.create': {
		input: BasinEndpointInputSchemas.webhooksCreate,
		output: BasinEndpointOutputSchemas.webhooksCreate,
	},
	'webhooks.update': {
		input: BasinEndpointInputSchemas.webhooksUpdate,
		output: BasinEndpointOutputSchemas.webhooksUpdate,
	},
	'webhooks.delete': {
		input: BasinEndpointInputSchemas.webhooksDelete,
		output: BasinEndpointOutputSchemas.webhooksDelete,
	},
	'formViews.list': {
		input: BasinEndpointInputSchemas.formViewsList,
		output: BasinEndpointOutputSchemas.formViewsList,
	},
	'formViews.get': {
		input: BasinEndpointInputSchemas.formViewsGet,
		output: BasinEndpointOutputSchemas.formViewsGet,
	},
	'domains.list': {
		input: BasinEndpointInputSchemas.domainsList,
		output: BasinEndpointOutputSchemas.domainsList,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof basinEndpointsNested>;

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Meta
// ─────────────────────────────────────────────────────────────────────────────

const basinEndpointMeta = {
	'forms.list': {
		riskLevel: 'read',
		description: 'List all forms in the account',
	},
	'forms.get': {
		riskLevel: 'read',
		description: 'Retrieve a form by ID',
	},
	'forms.create': {
		riskLevel: 'write',
		description: 'Create a new form',
	},
	'forms.update': {
		riskLevel: 'write',
		description: 'Update an existing form configuration',
	},
	'forms.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Permanently delete a form and its configuration',
	},
	'submissions.list': {
		riskLevel: 'read',
		description: 'List submissions with filtering and pagination options',
	},
	'submissions.get': {
		riskLevel: 'read',
		description: 'Retrieve a specific form submission by ID',
	},
	'submissions.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Permanently delete a form submission',
	},
	'submissions.update': {
		riskLevel: 'write',
		description: 'Update a submission state (read, spam, trash)',
	},
	'submissions.markSpam': {
		riskLevel: 'write',
		description: 'Mark a submission as spam',
	},
	'submissions.markHam': {
		riskLevel: 'write',
		description: 'Mark a submission as legitimate (not spam)',
	},
	'submissions.refireWebhooks': {
		riskLevel: 'write',
		description: 'Re-trigger webhooks for a specific submission',
	},
	'submissions.refireWebhooksBulk': {
		riskLevel: 'write',
		description: 'Re-trigger webhooks in bulk for multiple submissions',
	},
	'projects.list': {
		riskLevel: 'read',
		description: 'List all projects in the account',
	},
	'projects.get': {
		riskLevel: 'read',
		description: 'Retrieve a project by ID',
	},
	'projects.create': {
		riskLevel: 'write',
		description: 'Create a new project',
	},
	'projects.update': {
		riskLevel: 'write',
		description: 'Update an existing project name',
	},
	'projects.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Permanently delete a project',
	},
	'webhooks.list': {
		riskLevel: 'read',
		description: 'List all form webhooks',
	},
	'webhooks.get': {
		riskLevel: 'read',
		description: 'Retrieve a form webhook configuration by ID',
	},
	'webhooks.create': {
		riskLevel: 'write',
		description: 'Create a new form webhook integration',
	},
	'webhooks.update': {
		riskLevel: 'write',
		description: 'Update a form webhook configuration',
	},
	'webhooks.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Permanently delete a form webhook integration',
	},
	'formViews.list': {
		riskLevel: 'read',
		description: 'List form views in the account',
	},
	'formViews.get': {
		riskLevel: 'read',
		description: 'Retrieve a specific form view by ID',
	},
	'domains.list': {
		riskLevel: 'read',
		description: 'List custom domains configured in the account',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof basinEndpointsNested>;

// ─────────────────────────────────────────────────────────────────────────────
// Auth Config & Plugin Definition
// ─────────────────────────────────────────────────────────────────────────────

const defaultAuthType: AuthTypes = 'api_key' as const;

export const basinAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseBasinPlugin<T extends BasinPluginOptions> = CorsairPlugin<
	'basin',
	typeof BasinSchema,
	typeof basinEndpointsNested,
	typeof basinWebhooksNested,
	T,
	typeof defaultAuthType,
	typeof basinAuthConfig
>;

const basinWebhooksNested = {} as const;

export type InternalBasinPlugin = BaseBasinPlugin<BasinPluginOptions>;

export type ExternalBasinPlugin<T extends BasinPluginOptions> =
	BaseBasinPlugin<T>;

export function basin<const T extends BasinPluginOptions>(
	incomingOptions: BasinPluginOptions & T = {} as BasinPluginOptions & T,
): ExternalBasinPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'basin',
		authConfig: basinAuthConfig,
		schema: BasinSchema,
		options,
		hooks: options.hooks,
		endpoints: basinEndpointsNested,
		webhooks: basinWebhooksNested,
		endpointMeta: basinEndpointMeta,
		endpointSchemas: basinEndpointSchemas,
		pluginWebhookMatcher: () => false,
		// Basin is REST-only: it delivers form submissions to *your* webhook URLs
		// and has no inbound events for Corsair to route, so there is no tenant to
		// match. The field is optional; a stub matcher that always returns null
		// would only claim a capability the plugin does not have.
		pluginTenantWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: BasinKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('basin', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('basin', 'api_key');
		},
	} satisfies InternalBasinPlugin;
}

// ─────────────────────────────────────────────────────────────────────────────
// Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	BasinDeleteResponse,
	BasinDomain,
	BasinEndpointInputs,
	BasinEndpointOutputs,
	BasinForm,
	BasinFormView,
	BasinFormWebhook,
	BasinProject,
	BasinSubmission,
	BasinSuccessMessage,
	DomainsListInput,
	DomainsListResponse,
	FormsCreateInput,
	FormsCreateResponse,
	FormsDeleteInput,
	FormsDeleteResponse,
	FormsGetInput,
	FormsGetResponse,
	FormsListInput,
	FormsListResponse,
	FormsUpdateInput,
	FormsUpdateResponse,
	FormViewsGetInput,
	FormViewsGetResponse,
	FormViewsListInput,
	FormViewsListResponse,
	ProjectsCreateInput,
	ProjectsCreateResponse,
	ProjectsDeleteInput,
	ProjectsDeleteResponse,
	ProjectsGetInput,
	ProjectsGetResponse,
	ProjectsListInput,
	ProjectsListResponse,
	ProjectsUpdateInput,
	ProjectsUpdateResponse,
	SubmissionsDeleteInput,
	SubmissionsDeleteResponse,
	SubmissionsGetInput,
	SubmissionsGetResponse,
	SubmissionsListInput,
	SubmissionsListResponse,
	SubmissionsMarkHamInput,
	SubmissionsMarkHamResponse,
	SubmissionsMarkSpamInput,
	SubmissionsMarkSpamResponse,
	SubmissionsRefireWebhooksBulkInput,
	SubmissionsRefireWebhooksBulkResponse,
	SubmissionsRefireWebhooksInput,
	SubmissionsRefireWebhooksResponse,
	SubmissionsUpdateInput,
	SubmissionsUpdateResponse,
	WebhooksCreateInput,
	WebhooksCreateResponse,
	WebhooksDeleteInput,
	WebhooksDeleteResponse,
	WebhooksGetInput,
	WebhooksGetResponse,
	WebhooksListInput,
	WebhooksListResponse,
	WebhooksUpdateInput,
	WebhooksUpdateResponse,
} from './endpoints/types';
