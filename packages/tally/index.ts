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
} from 'corsair/core';
import {
	Forms,
	Organizations,
	Questions,
	Submissions,
	Users,
	WebhookManagement,
	Workspaces,
} from './endpoints';
import type {
	TallyEndpointInputs,
	TallyEndpointOutputs,
} from './endpoints/types';
import {
	TallyEndpointInputSchemas,
	TallyEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { TallySchema } from './schema';
import { FormResponseWebhooks } from './webhooks';
import type {
	TallyFormResponseEvent,
	TallyWebhookOutputs,
} from './webhooks/types';
import { TallyFormResponseEventSchema } from './webhooks/types';

// ─────────────────────────────────────────────────────────────────────────────
// Plugin Options
// ─────────────────────────────────────────────────────────────────────────────

export type TallyPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalTallyPlugin['hooks'];
	webhookHooks?: InternalTallyPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof tallyEndpointsNested>;
};

export type TallyContext = CorsairPluginContext<
	typeof TallySchema,
	TallyPluginOptions
>;

export type TallyKeyBuilderContext = KeyBuilderContext<TallyPluginOptions>;

export type TallyBoundEndpoints = BindEndpoints<typeof tallyEndpointsNested>;

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Type Map
// ─────────────────────────────────────────────────────────────────────────────

type TallyEndpoint<K extends keyof TallyEndpointOutputs> = CorsairEndpoint<
	TallyContext,
	TallyEndpointInputs[K],
	TallyEndpointOutputs[K]
>;

export type TallyEndpoints = {
	formsList: TallyEndpoint<'formsList'>;
	formsCreate: TallyEndpoint<'formsCreate'>;
	formsGet: TallyEndpoint<'formsGet'>;
	formsUpdate: TallyEndpoint<'formsUpdate'>;
	formsDelete: TallyEndpoint<'formsDelete'>;
	questionsList: TallyEndpoint<'questionsList'>;
	submissionsList: TallyEndpoint<'submissionsList'>;
	submissionsGet: TallyEndpoint<'submissionsGet'>;
	submissionsDelete: TallyEndpoint<'submissionsDelete'>;
	usersGetMe: TallyEndpoint<'usersGetMe'>;
	organizationsListUsers: TallyEndpoint<'organizationsListUsers'>;
	organizationsRemoveUser: TallyEndpoint<'organizationsRemoveUser'>;
	organizationsListInvites: TallyEndpoint<'organizationsListInvites'>;
	organizationsCreateInvite: TallyEndpoint<'organizationsCreateInvite'>;
	organizationsCancelInvite: TallyEndpoint<'organizationsCancelInvite'>;
	workspacesList: TallyEndpoint<'workspacesList'>;
	workspacesCreate: TallyEndpoint<'workspacesCreate'>;
	workspacesGet: TallyEndpoint<'workspacesGet'>;
	workspacesUpdate: TallyEndpoint<'workspacesUpdate'>;
	workspacesDelete: TallyEndpoint<'workspacesDelete'>;
	webhookManagementList: TallyEndpoint<'webhookManagementList'>;
	webhookManagementCreate: TallyEndpoint<'webhookManagementCreate'>;
	webhookManagementUpdate: TallyEndpoint<'webhookManagementUpdate'>;
	webhookManagementDelete: TallyEndpoint<'webhookManagementDelete'>;
	webhookManagementListEvents: TallyEndpoint<'webhookManagementListEvents'>;
	webhookManagementRetryEvent: TallyEndpoint<'webhookManagementRetryEvent'>;
};

// ─────────────────────────────────────────────────────────────────────────────
// Webhook Type Map
// ─────────────────────────────────────────────────────────────────────────────

type TallyWebhook<K extends keyof TallyWebhookOutputs, TEvent> = CorsairWebhook<
	TallyContext,
	TEvent,
	TallyWebhookOutputs[K]
>;

export type TallyWebhooks = {
	formResponse: TallyWebhook<'formResponse', TallyFormResponseEvent>;
};

export type TallyBoundWebhooks = BindWebhooks<TallyWebhooks>;

// ─────────────────────────────────────────────────────────────────────────────
// Nested Endpoint / Webhook Trees
// ─────────────────────────────────────────────────────────────────────────────

const tallyEndpointsNested = {
	forms: {
		list: Forms.list,
		create: Forms.create,
		get: Forms.get,
		update: Forms.update,
		delete: Forms.delete,
	},
	questions: {
		list: Questions.list,
	},
	submissions: {
		list: Submissions.list,
		get: Submissions.get,
		delete: Submissions.delete,
	},
	users: {
		getMe: Users.getMe,
	},
	organizations: {
		listUsers: Organizations.listUsers,
		removeUser: Organizations.removeUser,
		listInvites: Organizations.listInvites,
		createInvite: Organizations.createInvite,
		cancelInvite: Organizations.cancelInvite,
	},
	workspaces: {
		list: Workspaces.list,
		create: Workspaces.create,
		get: Workspaces.get,
		update: Workspaces.update,
		delete: Workspaces.delete,
	},
	webhookManagement: {
		list: WebhookManagement.list,
		create: WebhookManagement.create,
		update: WebhookManagement.update,
		delete: WebhookManagement.delete,
		listEvents: WebhookManagement.listEvents,
		retryEvent: WebhookManagement.retryEvent,
	},
} as const;

const tallyWebhooksNested = {
	formResponse: {
		formResponse: FormResponseWebhooks.formResponse,
	},
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Schemas
// ─────────────────────────────────────────────────────────────────────────────

export const tallyEndpointSchemas = {
	'forms.list': {
		input: TallyEndpointInputSchemas.formsList,
		output: TallyEndpointOutputSchemas.formsList,
	},
	'forms.create': {
		input: TallyEndpointInputSchemas.formsCreate,
		output: TallyEndpointOutputSchemas.formsCreate,
	},
	'forms.get': {
		input: TallyEndpointInputSchemas.formsGet,
		output: TallyEndpointOutputSchemas.formsGet,
	},
	'forms.update': {
		input: TallyEndpointInputSchemas.formsUpdate,
		output: TallyEndpointOutputSchemas.formsUpdate,
	},
	'forms.delete': {
		input: TallyEndpointInputSchemas.formsDelete,
		output: TallyEndpointOutputSchemas.formsDelete,
	},
	'questions.list': {
		input: TallyEndpointInputSchemas.questionsList,
		output: TallyEndpointOutputSchemas.questionsList,
	},
	'submissions.list': {
		input: TallyEndpointInputSchemas.submissionsList,
		output: TallyEndpointOutputSchemas.submissionsList,
	},
	'submissions.get': {
		input: TallyEndpointInputSchemas.submissionsGet,
		output: TallyEndpointOutputSchemas.submissionsGet,
	},
	'submissions.delete': {
		input: TallyEndpointInputSchemas.submissionsDelete,
		output: TallyEndpointOutputSchemas.submissionsDelete,
	},
	'users.getMe': {
		input: TallyEndpointInputSchemas.usersGetMe,
		output: TallyEndpointOutputSchemas.usersGetMe,
	},
	'organizations.listUsers': {
		input: TallyEndpointInputSchemas.organizationsListUsers,
		output: TallyEndpointOutputSchemas.organizationsListUsers,
	},
	'organizations.removeUser': {
		input: TallyEndpointInputSchemas.organizationsRemoveUser,
		output: TallyEndpointOutputSchemas.organizationsRemoveUser,
	},
	'organizations.listInvites': {
		input: TallyEndpointInputSchemas.organizationsListInvites,
		output: TallyEndpointOutputSchemas.organizationsListInvites,
	},
	'organizations.createInvite': {
		input: TallyEndpointInputSchemas.organizationsCreateInvite,
		output: TallyEndpointOutputSchemas.organizationsCreateInvite,
	},
	'organizations.cancelInvite': {
		input: TallyEndpointInputSchemas.organizationsCancelInvite,
		output: TallyEndpointOutputSchemas.organizationsCancelInvite,
	},
	'workspaces.list': {
		input: TallyEndpointInputSchemas.workspacesList,
		output: TallyEndpointOutputSchemas.workspacesList,
	},
	'workspaces.create': {
		input: TallyEndpointInputSchemas.workspacesCreate,
		output: TallyEndpointOutputSchemas.workspacesCreate,
	},
	'workspaces.get': {
		input: TallyEndpointInputSchemas.workspacesGet,
		output: TallyEndpointOutputSchemas.workspacesGet,
	},
	'workspaces.update': {
		input: TallyEndpointInputSchemas.workspacesUpdate,
		output: TallyEndpointOutputSchemas.workspacesUpdate,
	},
	'workspaces.delete': {
		input: TallyEndpointInputSchemas.workspacesDelete,
		output: TallyEndpointOutputSchemas.workspacesDelete,
	},
	'webhookManagement.list': {
		input: TallyEndpointInputSchemas.webhookManagementList,
		output: TallyEndpointOutputSchemas.webhookManagementList,
	},
	'webhookManagement.create': {
		input: TallyEndpointInputSchemas.webhookManagementCreate,
		output: TallyEndpointOutputSchemas.webhookManagementCreate,
	},
	'webhookManagement.update': {
		input: TallyEndpointInputSchemas.webhookManagementUpdate,
		output: TallyEndpointOutputSchemas.webhookManagementUpdate,
	},
	'webhookManagement.delete': {
		input: TallyEndpointInputSchemas.webhookManagementDelete,
		output: TallyEndpointOutputSchemas.webhookManagementDelete,
	},
	'webhookManagement.listEvents': {
		input: TallyEndpointInputSchemas.webhookManagementListEvents,
		output: TallyEndpointOutputSchemas.webhookManagementListEvents,
	},
	'webhookManagement.retryEvent': {
		input: TallyEndpointInputSchemas.webhookManagementRetryEvent,
		output: TallyEndpointOutputSchemas.webhookManagementRetryEvent,
	},
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Meta (risk levels)
// ─────────────────────────────────────────────────────────────────────────────

const tallyEndpointMeta = {
	'forms.list': {
		riskLevel: 'read',
		description: 'List all forms with optional pagination and workspace filter',
	},
	'forms.create': {
		riskLevel: 'write',
		description: 'Create a new form',
	},
	'forms.get': {
		riskLevel: 'read',
		description: 'Retrieve a form by ID',
	},
	'forms.update': {
		riskLevel: 'write',
		description: 'Update an existing form',
	},
	'forms.delete': {
		riskLevel: 'destructive',
		description: 'Delete a form [DESTRUCTIVE]',
	},
	'questions.list': {
		riskLevel: 'read',
		description: 'List all questions for a form',
	},
	'submissions.list': {
		riskLevel: 'read',
		description: 'List form submissions with optional filters',
	},
	'submissions.get': {
		riskLevel: 'read',
		description: 'Retrieve a specific form submission',
	},
	'submissions.delete': {
		riskLevel: 'destructive',
		description: 'Delete a form submission [DESTRUCTIVE]',
	},
	'users.getMe': {
		riskLevel: 'read',
		description: 'Retrieve the current authenticated user',
	},
	'organizations.listUsers': {
		riskLevel: 'read',
		description: 'List all users in an organization',
	},
	'organizations.removeUser': {
		riskLevel: 'destructive',
		description: 'Remove a user from an organization [DESTRUCTIVE]',
	},
	'organizations.listInvites': {
		riskLevel: 'read',
		description: 'List pending invites for an organization',
	},
	'organizations.createInvite': {
		riskLevel: 'write',
		description: 'Invite users to an organization',
	},
	'organizations.cancelInvite': {
		riskLevel: 'destructive',
		description: 'Cancel a pending organization invite [DESTRUCTIVE]',
	},
	'workspaces.list': {
		riskLevel: 'read',
		description: 'List all workspaces',
	},
	'workspaces.create': {
		riskLevel: 'write',
		description: 'Create a new workspace (Pro subscription required)',
	},
	'workspaces.get': {
		riskLevel: 'read',
		description: 'Retrieve a workspace by ID',
	},
	'workspaces.update': {
		riskLevel: 'write',
		description: 'Update a workspace name',
	},
	'workspaces.delete': {
		riskLevel: 'destructive',
		description: 'Delete a workspace [DESTRUCTIVE]',
	},
	'webhookManagement.list': {
		riskLevel: 'read',
		description: 'List all webhooks',
	},
	'webhookManagement.create': {
		riskLevel: 'write',
		description: 'Create a new webhook subscription',
	},
	'webhookManagement.update': {
		riskLevel: 'write',
		description: 'Update a webhook subscription',
	},
	'webhookManagement.delete': {
		riskLevel: 'destructive',
		description: 'Delete a webhook subscription [DESTRUCTIVE]',
	},
	'webhookManagement.listEvents': {
		riskLevel: 'read',
		description: 'List delivery events for a webhook',
	},
	'webhookManagement.retryEvent': {
		riskLevel: 'write',
		description: 'Retry a failed webhook event delivery',
	},
} satisfies RequiredPluginEndpointMeta<typeof tallyEndpointsNested>;

// ─────────────────────────────────────────────────────────────────────────────
// Webhook Schemas
// ─────────────────────────────────────────────────────────────────────────────

const tallyWebhookSchemas = {
	'formResponse.formResponse': {
		description: 'A new form response was submitted',
		payload: TallyFormResponseEventSchema,
		response: TallyFormResponseEventSchema,
	},
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Auth Config
// ─────────────────────────────────────────────────────────────────────────────

export const tallyAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

// ─────────────────────────────────────────────────────────────────────────────
// Plugin Type Definitions
// ─────────────────────────────────────────────────────────────────────────────

const defaultAuthType: AuthTypes = 'api_key' as const;

export type BaseTallyPlugin<T extends TallyPluginOptions> = CorsairPlugin<
	'tally',
	typeof TallySchema,
	typeof tallyEndpointsNested,
	typeof tallyWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalTallyPlugin = BaseTallyPlugin<TallyPluginOptions>;

export type ExternalTallyPlugin<T extends TallyPluginOptions> =
	BaseTallyPlugin<T>;

// ─────────────────────────────────────────────────────────────────────────────
// Plugin Factory
// ─────────────────────────────────────────────────────────────────────────────

export function tally<const T extends TallyPluginOptions>(
	incomingOptions: TallyPluginOptions & T = {} as TallyPluginOptions & T,
): ExternalTallyPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'tally',
		schema: TallySchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: tallyEndpointsNested,
		webhooks: tallyWebhooksNested,
		endpointMeta: tallyEndpointMeta,
		endpointSchemas: tallyEndpointSchemas,
		webhookSchemas: tallyWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			return 'tally-signature' in request.headers;
		},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: TallyKeyBuilderContext, source) => {
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature();

				if (!res) {
					return '';
				}

				return res;
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();

				if (!res) {
					return '';
				}

				return res;
			}

			return '';
		},
	} satisfies InternalTallyPlugin;
}

// ─────────────────────────────────────────────────────────────────────────────
// Webhook Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	TallyFormResponseEvent,
	TallyWebhookOutputs,
} from './webhooks/types';

export { createTallyMatch } from './webhooks/types';

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
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
	OrganizationsCancelInviteInput,
	OrganizationsCancelInviteResponse,
	OrganizationsCreateInviteInput,
	OrganizationsCreateInviteResponse,
	OrganizationsListInvitesInput,
	OrganizationsListInvitesResponse,
	OrganizationsListUsersInput,
	OrganizationsListUsersResponse,
	OrganizationsRemoveUserInput,
	OrganizationsRemoveUserResponse,
	QuestionsListInput,
	QuestionsListResponse,
	SubmissionsDeleteInput,
	SubmissionsDeleteResponse,
	SubmissionsGetInput,
	SubmissionsGetResponse,
	SubmissionsListInput,
	SubmissionsListResponse,
	TallyEndpointInputs,
	TallyEndpointOutputs,
	UsersGetMeInput,
	UsersGetMeResponse,
	WebhookManagementCreateInput,
	WebhookManagementCreateResponse,
	WebhookManagementDeleteInput,
	WebhookManagementDeleteResponse,
	WebhookManagementListEventsInput,
	WebhookManagementListEventsResponse,
	WebhookManagementListInput,
	WebhookManagementListResponse,
	WebhookManagementRetryEventInput,
	WebhookManagementRetryEventResponse,
	WebhookManagementUpdateInput,
	WebhookManagementUpdateResponse,
	WorkspacesCreateInput,
	WorkspacesCreateResponse,
	WorkspacesDeleteInput,
	WorkspacesDeleteResponse,
	WorkspacesGetInput,
	WorkspacesGetResponse,
	WorkspacesListInput,
	WorkspacesListResponse,
	WorkspacesUpdateInput,
	WorkspacesUpdateResponse,
} from './endpoints/types';
