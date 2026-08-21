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
	formsCreate: BasinEndpoint<'formsCreate'>;
	formsList: BasinEndpoint<'formsList'>;
	formsGet: BasinEndpoint<'formsGet'>;
	formsUpdate: BasinEndpoint<'formsUpdate'>;
	formsDelete: BasinEndpoint<'formsDelete'>;
	submissionsList: BasinEndpoint<'submissionsList'>;
	submissionsDelete: BasinEndpoint<'submissionsDelete'>;
	projectsCreate: BasinEndpoint<'projectsCreate'>;
	projectsList: BasinEndpoint<'projectsList'>;
	projectsGet: BasinEndpoint<'projectsGet'>;
	projectsUpdate: BasinEndpoint<'projectsUpdate'>;
	projectsDelete: BasinEndpoint<'projectsDelete'>;
	webhooksCreate: BasinEndpoint<'webhooksCreate'>;
	webhooksListForForm: BasinEndpoint<'webhooksListForForm'>;
	webhooksGet: BasinEndpoint<'webhooksGet'>;
	webhooksList: BasinEndpoint<'webhooksList'>;
	webhooksUpdate: BasinEndpoint<'webhooksUpdate'>;
	webhooksDelete: BasinEndpoint<'webhooksDelete'>;
	formViewsList: BasinEndpoint<'formViewsList'>;
	domainsList: BasinEndpoint<'domainsList'>;
};

// ─────────────────────────────────────────────────────────────────────────────
// Nested Endpoint Tree
// ─────────────────────────────────────────────────────────────────────────────

const basinEndpointsNested = {
	forms: {
		create: Forms.create,
		list: Forms.list,
		get: Forms.get,
		update: Forms.update,
		delete: Forms.delete,
	},
	submissions: {
		list: Submissions.list,
		delete: Submissions.delete,
	},
	projects: {
		create: Projects.create,
		list: Projects.list,
		get: Projects.get,
		update: Projects.update,
		delete: Projects.delete,
	},
	webhooks: {
		create: Webhooks.create,
		listForForm: Webhooks.listForForm,
		get: Webhooks.get,
		list: Webhooks.list,
		update: Webhooks.update,
		delete: Webhooks.delete,
	},
	formViews: {
		list: FormViews.list,
	},
	domains: {
		list: Domains.list,
	},
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Schemas & Metadata
// ─────────────────────────────────────────────────────────────────────────────

export const basinEndpointSchemas = {
	'forms.create': {
		input: BasinEndpointInputSchemas.formsCreate,
		output: BasinEndpointOutputSchemas.formsCreate,
	},
	'forms.list': {
		input: BasinEndpointInputSchemas.formsList,
		output: BasinEndpointOutputSchemas.formsList,
	},
	'forms.get': {
		input: BasinEndpointInputSchemas.formsGet,
		output: BasinEndpointOutputSchemas.formsGet,
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
	'submissions.delete': {
		input: BasinEndpointInputSchemas.submissionsDelete,
		output: BasinEndpointOutputSchemas.submissionsDelete,
	},
	'projects.create': {
		input: BasinEndpointInputSchemas.projectsCreate,
		output: BasinEndpointOutputSchemas.projectsCreate,
	},
	'projects.list': {
		input: BasinEndpointInputSchemas.projectsList,
		output: BasinEndpointOutputSchemas.projectsList,
	},
	'projects.get': {
		input: BasinEndpointInputSchemas.projectsGet,
		output: BasinEndpointOutputSchemas.projectsGet,
	},
	'projects.update': {
		input: BasinEndpointInputSchemas.projectsUpdate,
		output: BasinEndpointOutputSchemas.projectsUpdate,
	},
	'projects.delete': {
		input: BasinEndpointInputSchemas.projectsDelete,
		output: BasinEndpointOutputSchemas.projectsDelete,
	},
	'webhooks.create': {
		input: BasinEndpointInputSchemas.webhooksCreate,
		output: BasinEndpointOutputSchemas.webhooksCreate,
	},
	'webhooks.listForForm': {
		input: BasinEndpointInputSchemas.webhooksListForForm,
		output: BasinEndpointOutputSchemas.webhooksListForForm,
	},
	'webhooks.get': {
		input: BasinEndpointInputSchemas.webhooksGet,
		output: BasinEndpointOutputSchemas.webhooksGet,
	},
	'webhooks.list': {
		input: BasinEndpointInputSchemas.webhooksList,
		output: BasinEndpointOutputSchemas.webhooksList,
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
	'domains.list': {
		input: BasinEndpointInputSchemas.domainsList,
		output: BasinEndpointOutputSchemas.domainsList,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof basinEndpointsNested>;

const basinEndpointMeta = {
	'forms.create': {
		riskLevel: 'write',
		description: 'Create a new form',
	},
	'forms.list': {
		riskLevel: 'read',
		description: 'List all forms with optional pagination and search query',
	},
	'forms.get': {
		riskLevel: 'read',
		description: 'Get details of a specific form by ID',
	},
	'forms.update': {
		riskLevel: 'write',
		description: 'Update an existing form settings',
	},
	'forms.delete': {
		riskLevel: 'destructive',
		description: 'Delete a form [DESTRUCTIVE]',
	},
	'submissions.list': {
		riskLevel: 'read',
		description: 'List form submissions with filtering, search, and sorting',
	},
	'submissions.delete': {
		riskLevel: 'destructive',
		description: 'Delete a form submission by ID [DESTRUCTIVE]',
	},
	'projects.create': {
		riskLevel: 'write',
		description: 'Create a new project container',
	},
	'projects.list': {
		riskLevel: 'read',
		description: 'List all projects with pagination',
	},
	'projects.get': {
		riskLevel: 'read',
		description: 'Get project metadata by ID',
	},
	'projects.update': {
		riskLevel: 'write',
		description: 'Update project details',
	},
	'projects.delete': {
		riskLevel: 'destructive',
		description: 'Delete a project [DESTRUCTIVE]',
	},
	'webhooks.create': {
		riskLevel: 'write',
		description: 'Create a webhook for a specific form',
	},
	'webhooks.listForForm': {
		riskLevel: 'read',
		description: 'Retrieve all webhooks for a specific form',
	},
	'webhooks.get': {
		riskLevel: 'read',
		description: 'Get details of a specific form webhook by ID',
	},
	'webhooks.list': {
		riskLevel: 'read',
		description: 'List all form webhooks across the account',
	},
	'webhooks.update': {
		riskLevel: 'write',
		description: 'Update webhook settings',
	},
	'webhooks.delete': {
		riskLevel: 'destructive',
		description: 'Delete a webhook [DESTRUCTIVE]',
	},
	'formViews.list': {
		riskLevel: 'read',
		description: 'List form views with pagination and filtering',
	},
	'domains.list': {
		riskLevel: 'read',
		description: 'Retrieve all custom domains',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof basinEndpointsNested>;

// ─────────────────────────────────────────────────────────────────────────────
// Auth Config & Plugin Definition
// ─────────────────────────────────────────────────────────────────────────────

const defaultAuthType: AuthTypes = 'api_key' as const;

export const basinAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseBasinPlugin<T extends BasinPluginOptions> = CorsairPlugin<
	'basin',
	typeof BasinSchema,
	typeof basinEndpointsNested,
	{},
	T,
	typeof defaultAuthType,
	typeof basinAuthConfig
>;

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
		options: options,
		hooks: options.hooks,
		endpoints: basinEndpointsNested,
		webhooks: {},
		endpointMeta: basinEndpointMeta,
		endpointSchemas: basinEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: (() => {
			const { DEFAULT: defaultHandler, ...specificDefaults } = errorHandlers;
			return {
				...specificDefaults,
				...(options.errorHandlers || {}),
				DEFAULT: options.errorHandlers?.DEFAULT || defaultHandler,
			};
		})(),
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
// Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	BasinDomainSchema,
	BasinEndpointInputs,
	BasinEndpointOutputs,
	BasinFormSchema,
	BasinFormViewSchema,
	BasinFormWebhookSchema,
	BasinProjectSchema,
	BasinSubmissionSchema,
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
	SubmissionsListInput,
	SubmissionsListResponse,
	WebhooksCreateInput,
	WebhooksCreateResponse,
	WebhooksDeleteInput,
	WebhooksDeleteResponse,
	WebhooksGetInput,
	WebhooksGetResponse,
	WebhooksListForFormInput,
	WebhooksListForFormResponse,
	WebhooksListInput,
	WebhooksListResponse,
	WebhooksUpdateInput,
	WebhooksUpdateResponse,
} from './endpoints/types';
