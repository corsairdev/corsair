import type {
	AuthTypes,
	BindEndpoints,
	CorsairEndpoint,
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
import { FilevineAPIError } from './client';
import {
	ContactsEndpoints,
	DeadlinesEndpoints,
	DocumentsEndpoints,
	IdentityEndpoints,
	NotesEndpoints,
	ProjectsEndpoints,
	TasksEndpoints,
	WebhooksEndpoints,
} from './endpoints';
import type {
	FilevineEndpointInputs,
	FilevineEndpointOutputs,
} from './endpoints/types';
import {
	FilevineEndpointInputSchemas,
	FilevineEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { FilevineSchema } from './schema';

export type FilevinePluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	hooks?: InternalFilevinePlugin['hooks'];
	webhookHooks?: InternalFilevinePlugin['webhookHooks'];
	errorHandlers?: import('corsair/core').CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof filevineEndpointsNested>;
};

export type FilevineContext = CorsairPluginContext<
	typeof FilevineSchema,
	FilevinePluginOptions
>;

export type FilevineKeyBuilderContext =
	KeyBuilderContext<FilevinePluginOptions>;

export type FilevineBoundEndpoints = BindEndpoints<
	typeof filevineEndpointsNested
>;

type FilevineEndpoint<K extends keyof FilevineEndpointOutputs> =
	CorsairEndpoint<
		FilevineContext,
		FilevineEndpointInputs[K],
		FilevineEndpointOutputs[K]
	>;

export type FilevineEndpoints = {
	listProjects: FilevineEndpoint<'listProjects'>;
	getProject: FilevineEndpoint<'getProject'>;
	createProject: FilevineEndpoint<'createProject'>;
	updateProject: FilevineEndpoint<'updateProject'>;
	listContacts: FilevineEndpoint<'listContacts'>;
	getContact: FilevineEndpoint<'getContact'>;
	createContact: FilevineEndpoint<'createContact'>;
	attachProjectContact: FilevineEndpoint<'attachProjectContact'>;
	listProjectDocuments: FilevineEndpoint<'listProjectDocuments'>;
	getDocument: FilevineEndpoint<'getDocument'>;
	uploadProjectDocument: FilevineEndpoint<'uploadProjectDocument'>;
	listProjectNotes: FilevineEndpoint<'listProjectNotes'>;
	createNote: FilevineEndpoint<'createNote'>;
	updateNote: FilevineEndpoint<'updateNote'>;
	listProjectDeadlines: FilevineEndpoint<'listProjectDeadlines'>;
	createDeadline: FilevineEndpoint<'createDeadline'>;
	listProjectTasks: FilevineEndpoint<'listProjectTasks'>;
	createTask: FilevineEndpoint<'createTask'>;
	updateTask: FilevineEndpoint<'updateTask'>;
	listWebhookSubscriptions: FilevineEndpoint<'listWebhookSubscriptions'>;
	createWebhookSubscription: FilevineEndpoint<'createWebhookSubscription'>;
	deleteWebhookSubscription: FilevineEndpoint<'deleteWebhookSubscription'>;
	getAccessToken: FilevineEndpoint<'getAccessToken'>;
	getUserOrgsWithToken: FilevineEndpoint<'getUserOrgsWithToken'>;
};

const filevineEndpointsNested = {
	projects: {
		list: ProjectsEndpoints.list,
		get: ProjectsEndpoints.get,
		create: ProjectsEndpoints.create,
		update: ProjectsEndpoints.update,
	},
	contacts: {
		list: ContactsEndpoints.list,
		get: ContactsEndpoints.get,
		create: ContactsEndpoints.create,
		attach: ContactsEndpoints.attach,
	},
	documents: {
		list: DocumentsEndpoints.list,
		get: DocumentsEndpoints.get,
		upload: DocumentsEndpoints.upload,
	},
	notes: {
		list: NotesEndpoints.list,
		create: NotesEndpoints.create,
		update: NotesEndpoints.update,
	},
	deadlines: {
		list: DeadlinesEndpoints.list,
		create: DeadlinesEndpoints.create,
	},
	tasks: {
		list: TasksEndpoints.list,
		create: TasksEndpoints.create,
		update: TasksEndpoints.update,
	},
	webhooks: {
		list: WebhooksEndpoints.list,
		create: WebhooksEndpoints.create,
		delete: WebhooksEndpoints.delete,
	},
	identity: {
		getAccessToken: IdentityEndpoints.getAccessToken,
		getUserOrgsWithToken: IdentityEndpoints.getUserOrgsWithToken,
	},
} as const;

const filevineWebhooksNested = {} as const;

export const filevineEndpointSchemas = {
	'projects.list': {
		input: FilevineEndpointInputSchemas.listProjects,
		output: FilevineEndpointOutputSchemas.listProjects,
	},
	'projects.get': {
		input: FilevineEndpointInputSchemas.getProject,
		output: FilevineEndpointOutputSchemas.getProject,
	},
	'projects.create': {
		input: FilevineEndpointInputSchemas.createProject,
		output: FilevineEndpointOutputSchemas.createProject,
	},
	'projects.update': {
		input: FilevineEndpointInputSchemas.updateProject,
		output: FilevineEndpointOutputSchemas.updateProject,
	},
	'contacts.list': {
		input: FilevineEndpointInputSchemas.listContacts,
		output: FilevineEndpointOutputSchemas.listContacts,
	},
	'contacts.get': {
		input: FilevineEndpointInputSchemas.getContact,
		output: FilevineEndpointOutputSchemas.getContact,
	},
	'contacts.create': {
		input: FilevineEndpointInputSchemas.createContact,
		output: FilevineEndpointOutputSchemas.createContact,
	},
	'contacts.attach': {
		input: FilevineEndpointInputSchemas.attachProjectContact,
		output: FilevineEndpointOutputSchemas.attachProjectContact,
	},
	'documents.list': {
		input: FilevineEndpointInputSchemas.listProjectDocuments,
		output: FilevineEndpointOutputSchemas.listProjectDocuments,
	},
	'documents.get': {
		input: FilevineEndpointInputSchemas.getDocument,
		output: FilevineEndpointOutputSchemas.getDocument,
	},
	'documents.upload': {
		input: FilevineEndpointInputSchemas.uploadProjectDocument,
		output: FilevineEndpointOutputSchemas.uploadProjectDocument,
	},
	'notes.list': {
		input: FilevineEndpointInputSchemas.listProjectNotes,
		output: FilevineEndpointOutputSchemas.listProjectNotes,
	},
	'notes.create': {
		input: FilevineEndpointInputSchemas.createNote,
		output: FilevineEndpointOutputSchemas.createNote,
	},
	'notes.update': {
		input: FilevineEndpointInputSchemas.updateNote,
		output: FilevineEndpointOutputSchemas.updateNote,
	},
	'deadlines.list': {
		input: FilevineEndpointInputSchemas.listProjectDeadlines,
		output: FilevineEndpointOutputSchemas.listProjectDeadlines,
	},
	'deadlines.create': {
		input: FilevineEndpointInputSchemas.createDeadline,
		output: FilevineEndpointOutputSchemas.createDeadline,
	},
	'tasks.list': {
		input: FilevineEndpointInputSchemas.listProjectTasks,
		output: FilevineEndpointOutputSchemas.listProjectTasks,
	},
	'tasks.create': {
		input: FilevineEndpointInputSchemas.createTask,
		output: FilevineEndpointOutputSchemas.createTask,
	},
	'tasks.update': {
		input: FilevineEndpointInputSchemas.updateTask,
		output: FilevineEndpointOutputSchemas.updateTask,
	},
	'webhooks.list': {
		input: FilevineEndpointInputSchemas.listWebhookSubscriptions,
		output: FilevineEndpointOutputSchemas.listWebhookSubscriptions,
	},
	'webhooks.create': {
		input: FilevineEndpointInputSchemas.createWebhookSubscription,
		output: FilevineEndpointOutputSchemas.createWebhookSubscription,
	},
	'webhooks.delete': {
		input: FilevineEndpointInputSchemas.deleteWebhookSubscription,
		output: FilevineEndpointOutputSchemas.deleteWebhookSubscription,
	},
	'identity.getAccessToken': {
		input: FilevineEndpointInputSchemas.getAccessToken,
		output: FilevineEndpointOutputSchemas.getAccessToken,
	},
	'identity.getUserOrgsWithToken': {
		input: FilevineEndpointInputSchemas.getUserOrgsWithToken,
		output: FilevineEndpointOutputSchemas.getUserOrgsWithToken,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof filevineEndpointsNested
>;

const filevineWebhookSchemas = {} as const;

const defaultAuthType: AuthTypes = 'api_key' as const;

const filevineEndpointMeta = {
	'projects.list': {
		riskLevel: 'read',
		description: 'List projects with pagination and filters',
	},
	'projects.get': { riskLevel: 'read', description: 'Get a project by ID' },
	'projects.create': {
		riskLevel: 'write',
		description: 'Create a new project',
	},
	'projects.update': { riskLevel: 'write', description: 'Update a project' },
	'contacts.list': {
		riskLevel: 'read',
		description: 'List contacts with pagination',
	},
	'contacts.get': { riskLevel: 'read', description: 'Get a contact by ID' },
	'contacts.create': { riskLevel: 'write', description: 'Create a contact' },
	'contacts.attach': {
		riskLevel: 'write',
		description: 'Attach a contact to a project',
	},
	'documents.list': {
		riskLevel: 'read',
		description: 'List documents in a project',
	},
	'documents.get': {
		riskLevel: 'read',
		description: 'Get document metadata by ID',
	},
	'documents.upload': {
		riskLevel: 'write',
		description: 'Upload a document to a project',
	},
	'notes.list': { riskLevel: 'read', description: 'List notes for a project' },
	'notes.create': {
		riskLevel: 'write',
		description: 'Create a note on a project',
	},
	'notes.update': { riskLevel: 'write', description: 'Update a note' },
	'deadlines.list': {
		riskLevel: 'read',
		description: 'List deadlines for a project',
	},
	'deadlines.create': {
		riskLevel: 'write',
		description: 'Create a deadline on a project',
	},
	'tasks.list': { riskLevel: 'read', description: 'List tasks for a project' },
	'tasks.create': {
		riskLevel: 'write',
		description: 'Create a task on a project',
	},
	'tasks.update': { riskLevel: 'write', description: 'Update a task' },
	'webhooks.list': {
		riskLevel: 'read',
		description: 'List webhook subscriptions',
	},
	'webhooks.create': {
		riskLevel: 'write',
		description: 'Create a webhook subscription',
	},
	'webhooks.delete': {
		riskLevel: 'destructive',
		description: 'Delete a webhook subscription [DESTRUCTIVE]',
	},
	'identity.getAccessToken': {
		riskLevel: 'write',
		description: 'Exchange PAT for bearer token',
	},
	'identity.getUserOrgsWithToken': {
		riskLevel: 'read',
		description:
			'Get user and orgs for token (POST /fv-app/v2/utils/GetUserOrgsWithToken)',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof filevineEndpointsNested>;

export const filevineAuthConfig = {
	api_key: { account: ['tenant_external_id'] as const },
	oauth_2: { account: ['tenant_external_id'] as const },
} as const satisfies PluginAuthConfig;

export type BaseFilevinePlugin<T extends FilevinePluginOptions> = CorsairPlugin<
	'filevine',
	typeof FilevineSchema,
	typeof filevineEndpointsNested,
	typeof filevineWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalFilevinePlugin = BaseFilevinePlugin<FilevinePluginOptions>;

export type ExternalFilevinePlugin<T extends FilevinePluginOptions> =
	BaseFilevinePlugin<T>;

export function filevine<const T extends FilevinePluginOptions>(
	incomingOptions: FilevinePluginOptions & T = {} as FilevinePluginOptions & T,
): ExternalFilevinePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'filevine',
		authConfig: filevineAuthConfig,
		schema: FilevineSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: filevineEndpointsNested,
		webhooks: filevineWebhooksNested,
		endpointMeta: filevineEndpointMeta,
		endpointSchemas: filevineEndpointSchemas,
		webhookSchemas: filevineWebhookSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: FilevineKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) return options.key;
			if (ctx.authType === 'api_key') {
				const pat = await ctx.keys.get_api_key();
				if (!pat) throw new AuthMissingError('filevine', 'api_key');
				// If PAT looks like JWT (bearer), use directly; otherwise exchange PAT for bearer via Filevine Identity
				// The PAT exchange is documented at https://developer.filevine.io/docs/v2-ca/branches/main/29343b2585262-exchange-token
				// Never fall back to the raw PAT — data endpoints require an exchanged bearer token.
				const isJwt = pat.split('.').length === 3;
				if (isJwt) return pat;
				try {
					const form = new URLSearchParams({
						grant_type: 'personal_access_token',
						token: pat,
						scope:
							'fv.api.gateway.access tenant filevine.v2.api.* openid email fv.auth.tenant.read',
					});
					const resp = await fetch(
						'https://identity.filevine.io/connect/token',
						{
							method: 'POST',
							headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
							body: form.toString(),
						},
					);
					if (!resp.ok) {
						throw new FilevineAPIError(
							`Filevine token exchange failed with status ${resp.status}`,
							String(resp.status),
						);
					}
					const data = (await resp.json()) as { access_token?: string };
					if (!data.access_token) {
						throw new FilevineAPIError(
							'Filevine token exchange returned no access_token',
							'NO_ACCESS_TOKEN',
						);
					}
					return data.access_token;
				} catch (error) {
					if (error instanceof FilevineAPIError) throw error;
					throw new FilevineAPIError(
						`Filevine token exchange failed: ${error instanceof Error ? error.message : 'network error'}`,
						'TOKEN_EXCHANGE_FAILED',
						{ cause: error instanceof Error ? error : undefined },
					);
				}
			}
			if (ctx.authType === 'oauth_2') {
				const res = await ctx.keys.get_access_token();
				if (!res) throw new AuthMissingError('filevine', 'oauth_2');
				return res;
			}
			throw new AuthMissingError('filevine', 'api_key');
		},
	} satisfies InternalFilevinePlugin;
}

export type {
	AttachProjectContactInput,
	AttachProjectContactResponse,
	CreateContactInput,
	CreateContactResponse,
	CreateDeadlineInput,
	CreateDeadlineResponse,
	CreateNoteInput,
	CreateNoteResponse,
	CreateProjectInput,
	CreateProjectResponse,
	CreateTaskInput,
	CreateTaskResponse,
	CreateWebhookSubscriptionInput,
	CreateWebhookSubscriptionResponse,
	DeleteWebhookSubscriptionInput,
	DeleteWebhookSubscriptionResponse,
	FilevineEndpointInputs,
	FilevineEndpointOutputs,
	GetAccessTokenInput,
	GetAccessTokenResponse,
	GetContactInput,
	GetContactResponse,
	GetDocumentInput,
	GetDocumentResponse,
	GetProjectInput,
	GetProjectResponse,
	GetUserOrgsWithTokenInput,
	GetUserOrgsWithTokenResponse,
	ListContactsInput,
	ListContactsResponse,
	ListProjectDeadlinesInput,
	ListProjectDeadlinesResponse,
	ListProjectDocumentsInput,
	ListProjectDocumentsResponse,
	ListProjectNotesInput,
	ListProjectNotesResponse,
	ListProjectsInput,
	ListProjectsResponse,
	ListProjectTasksInput,
	ListProjectTasksResponse,
	ListWebhookSubscriptionsInput,
	ListWebhookSubscriptionsResponse,
	UpdateNoteInput,
	UpdateNoteResponse,
	UpdateProjectInput,
	UpdateProjectResponse,
	UpdateTaskInput,
	UpdateTaskResponse,
	UploadProjectDocumentInput,
	UploadProjectDocumentResponse,
} from './endpoints/types';
