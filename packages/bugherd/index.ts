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
import { BugherdAPIError, makeBugherdRequest } from './client';
import { Bugherd } from './endpoints';
import type {
	BugherdEndpointInputs,
	BugherdEndpointOutputs,
} from './endpoints/types';
import {
	BugherdEndpointInputSchemas,
	BugherdEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { BugherdSchema } from './schema';

export type BugherdPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalBugherdPlugin['hooks'];
	webhookHooks?: InternalBugherdPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof bugherdEndpointsNested>;
};

export type BugherdContext = CorsairPluginContext<
	typeof BugherdSchema,
	BugherdPluginOptions
>;

export type BugherdKeyBuilderContext = KeyBuilderContext<BugherdPluginOptions>;

export type BugherdBoundEndpoints = BindEndpoints<
	typeof bugherdEndpointsNested
>;

type BugherdEndpoint<K extends keyof BugherdEndpointOutputs> = CorsairEndpoint<
	BugherdContext,
	BugherdEndpointInputs[K],
	BugherdEndpointOutputs[K]
>;

export type BugherdEndpoints = {
	addGuestToProject: BugherdEndpoint<'addGuestToProject'>;
	addMemberToProject: BugherdEndpoint<'addMemberToProject'>;
	createAttachment: BugherdEndpoint<'createAttachment'>;
	createColumn: BugherdEndpoint<'createColumn'>;
	createComment: BugherdEndpoint<'createComment'>;
	createProject: BugherdEndpoint<'createProject'>;
	createTask: BugherdEndpoint<'createTask'>;
	createWebhook: BugherdEndpoint<'createWebhook'>;
	deleteProject: BugherdEndpoint<'deleteProject'>;
	listActiveProjects: BugherdEndpoint<'listActiveProjects'>;
	listAttachments: BugherdEndpoint<'listAttachments'>;
	listColumns: BugherdEndpoint<'listColumns'>;
	listProjects: BugherdEndpoint<'listProjects'>;
	listUsers: BugherdEndpoint<'listUsers'>;
	listWebhooks: BugherdEndpoint<'listWebhooks'>;
	showAttachment: BugherdEndpoint<'showAttachment'>;
	showColumn: BugherdEndpoint<'showColumn'>;
	showOrganization: BugherdEndpoint<'showOrganization'>;
	showProjectDetails: BugherdEndpoint<'showProjectDetails'>;
	showUserProjects: BugherdEndpoint<'showUserProjects'>;
	showUserTasks: BugherdEndpoint<'showUserTasks'>;
	updateColumn: BugherdEndpoint<'updateColumn'>;
	updateProject: BugherdEndpoint<'updateProject'>;
	updateTask: BugherdEndpoint<'updateTask'>;
	uploadAttachment: BugherdEndpoint<'uploadAttachment'>;
};

const bugherdEndpointsNested = {
	projects: {
		addGuest: Bugherd.addGuestToProject,
		addMember: Bugherd.addMemberToProject,
		create: Bugherd.createProject,
		delete: Bugherd.deleteProject,
		list: Bugherd.listProjects,
		listActive: Bugherd.listActiveProjects,
		show: Bugherd.showProjectDetails,
		update: Bugherd.updateProject,
	},
	columns: {
		create: Bugherd.createColumn,
		list: Bugherd.listColumns,
		show: Bugherd.showColumn,
		update: Bugherd.updateColumn,
	},
	tasks: {
		create: Bugherd.createTask,
		update: Bugherd.updateTask,
		listAttachments: Bugherd.listAttachments,
		showAttachment: Bugherd.showAttachment,
		createAttachment: Bugherd.createAttachment,
		uploadAttachment: Bugherd.uploadAttachment,
		createComment: Bugherd.createComment,
		listForUser: Bugherd.showUserTasks,
	},
	webhooks: {
		create: Bugherd.createWebhook,
		list: Bugherd.listWebhooks,
	},
	users: {
		list: Bugherd.listUsers,
		listProjects: Bugherd.showUserProjects,
	},
	organization: {
		show: Bugherd.showOrganization,
	},
} as const;

export const bugherdEndpointSchemas = {
	'projects.addGuest': {
		input: BugherdEndpointInputSchemas.addGuestToProject,
		output: BugherdEndpointOutputSchemas.addGuestToProject,
	},
	'projects.addMember': {
		input: BugherdEndpointInputSchemas.addMemberToProject,
		output: BugherdEndpointOutputSchemas.addMemberToProject,
	},
	'projects.create': {
		input: BugherdEndpointInputSchemas.createProject,
		output: BugherdEndpointOutputSchemas.createProject,
	},
	'projects.delete': {
		input: BugherdEndpointInputSchemas.deleteProject,
		output: BugherdEndpointOutputSchemas.deleteProject,
	},
	'projects.list': {
		input: BugherdEndpointInputSchemas.listProjects,
		output: BugherdEndpointOutputSchemas.listProjects,
	},
	'projects.listActive': {
		input: BugherdEndpointInputSchemas.listActiveProjects,
		output: BugherdEndpointOutputSchemas.listActiveProjects,
	},
	'projects.show': {
		input: BugherdEndpointInputSchemas.showProjectDetails,
		output: BugherdEndpointOutputSchemas.showProjectDetails,
	},
	'projects.update': {
		input: BugherdEndpointInputSchemas.updateProject,
		output: BugherdEndpointOutputSchemas.updateProject,
	},
	'columns.create': {
		input: BugherdEndpointInputSchemas.createColumn,
		output: BugherdEndpointOutputSchemas.createColumn,
	},
	'columns.list': {
		input: BugherdEndpointInputSchemas.listColumns,
		output: BugherdEndpointOutputSchemas.listColumns,
	},
	'columns.show': {
		input: BugherdEndpointInputSchemas.showColumn,
		output: BugherdEndpointOutputSchemas.showColumn,
	},
	'columns.update': {
		input: BugherdEndpointInputSchemas.updateColumn,
		output: BugherdEndpointOutputSchemas.updateColumn,
	},
	'tasks.create': {
		input: BugherdEndpointInputSchemas.createTask,
		output: BugherdEndpointOutputSchemas.createTask,
	},
	'tasks.update': {
		input: BugherdEndpointInputSchemas.updateTask,
		output: BugherdEndpointOutputSchemas.updateTask,
	},
	'tasks.listAttachments': {
		input: BugherdEndpointInputSchemas.listAttachments,
		output: BugherdEndpointOutputSchemas.listAttachments,
	},
	'tasks.showAttachment': {
		input: BugherdEndpointInputSchemas.showAttachment,
		output: BugherdEndpointOutputSchemas.showAttachment,
	},
	'tasks.createAttachment': {
		input: BugherdEndpointInputSchemas.createAttachment,
		output: BugherdEndpointOutputSchemas.createAttachment,
	},
	'tasks.uploadAttachment': {
		input: BugherdEndpointInputSchemas.uploadAttachment,
		output: BugherdEndpointOutputSchemas.uploadAttachment,
	},
	'tasks.createComment': {
		input: BugherdEndpointInputSchemas.createComment,
		output: BugherdEndpointOutputSchemas.createComment,
	},
	'tasks.listForUser': {
		input: BugherdEndpointInputSchemas.showUserTasks,
		output: BugherdEndpointOutputSchemas.showUserTasks,
	},
	'webhooks.create': {
		input: BugherdEndpointInputSchemas.createWebhook,
		output: BugherdEndpointOutputSchemas.createWebhook,
	},
	'webhooks.list': {
		input: BugherdEndpointInputSchemas.listWebhooks,
		output: BugherdEndpointOutputSchemas.listWebhooks,
	},
	'users.list': {
		input: BugherdEndpointInputSchemas.listUsers,
		output: BugherdEndpointOutputSchemas.listUsers,
	},
	'users.listProjects': {
		input: BugherdEndpointInputSchemas.showUserProjects,
		output: BugherdEndpointOutputSchemas.showUserProjects,
	},
	'organization.show': {
		input: BugherdEndpointInputSchemas.showOrganization,
		output: BugherdEndpointOutputSchemas.showOrganization,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof bugherdEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const bugherdEndpointMeta = {
	'projects.addGuest': {
		riskLevel: 'write' as const,
		description: 'Add a guest to a project',
	},
	'projects.addMember': {
		riskLevel: 'write' as const,
		description: 'Add a member to a project',
	},
	'projects.create': {
		riskLevel: 'write' as const,
		description: 'Create a new project',
	},
	'projects.delete': {
		riskLevel: 'destructive' as const,
		description: 'Delete a project',
	},
	'projects.list': {
		riskLevel: 'read' as const,
		description: 'List all projects',
	},
	'projects.listActive': {
		riskLevel: 'read' as const,
		description: 'List active projects',
	},
	'projects.show': {
		riskLevel: 'read' as const,
		description: 'Show project details',
	},
	'projects.update': {
		riskLevel: 'write' as const,
		description: 'Update a project',
	},
	'columns.create': {
		riskLevel: 'write' as const,
		description: 'Create a new column',
	},
	'columns.list': {
		riskLevel: 'read' as const,
		description: 'List columns in a project',
	},
	'columns.show': {
		riskLevel: 'read' as const,
		description: 'Show column details',
	},
	'columns.update': {
		riskLevel: 'write' as const,
		description: 'Update a column',
	},
	'tasks.create': {
		riskLevel: 'write' as const,
		description: 'Create a new task',
	},
	'tasks.update': {
		riskLevel: 'write' as const,
		description: 'Update a task',
	},
	'tasks.listAttachments': {
		riskLevel: 'read' as const,
		description: 'List attachments for a task',
	},
	'tasks.showAttachment': {
		riskLevel: 'read' as const,
		description: 'Show attachment details',
	},
	'tasks.createAttachment': {
		riskLevel: 'write' as const,
		description: 'Create an attachment reference',
	},
	'tasks.uploadAttachment': {
		riskLevel: 'write' as const,
		description: 'Upload an attachment file',
	},
	'tasks.createComment': {
		riskLevel: 'write' as const,
		description: 'Create a comment on a task',
	},
	'tasks.listForUser': {
		riskLevel: 'read' as const,
		description: 'List tasks assigned to a user',
	},
	'webhooks.create': {
		riskLevel: 'write' as const,
		description: 'Create a new webhook',
	},
	'webhooks.list': {
		riskLevel: 'read' as const,
		description: 'List webhooks for a project',
	},
	'users.list': {
		riskLevel: 'read' as const,
		description: 'List users',
	},
	'users.listProjects': {
		riskLevel: 'read' as const,
		description: 'List projects for a user',
	},
	'organization.show': {
		riskLevel: 'read' as const,
		description: 'Show organization details',
	},
} satisfies RequiredPluginEndpointMeta<typeof bugherdEndpointsNested>;

export const bugherdAuthConfig = {
	api_key: {
		account: ['project_id'] as const,
	},
	oauth_2: {
		account: ['project_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseBugherdPlugin<T extends BugherdPluginOptions> = CorsairPlugin<
	'bugherd',
	typeof BugherdSchema,
	typeof bugherdEndpointsNested,
	never,
	T,
	typeof defaultAuthType
>;

export type InternalBugherdPlugin = BaseBugherdPlugin<BugherdPluginOptions>;

export type ExternalBugherdPlugin<T extends BugherdPluginOptions> =
	BaseBugherdPlugin<T>;

export function bugherd<const T extends BugherdPluginOptions>(
	incomingOptions: BugherdPluginOptions & T = {} as BugherdPluginOptions & T,
): ExternalBugherdPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'bugherd',
		authConfig: bugherdAuthConfig,
		schema: BugherdSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: bugherdEndpointsNested,
		endpointMeta: bugherdEndpointMeta,
		endpointSchemas: bugherdEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: BugherdKeyBuilderContext, source) => {
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature();
				return res ?? '';
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			if (source === 'endpoint' && ctx.authType === 'oauth_2') {
				const res = await ctx.keys.get_access_token();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalBugherdPlugin;
}

export type {
	AddGuestToProjectInput,
	AddGuestToProjectOutput,
	AddMemberToProjectInput,
	AddMemberToProjectOutput,
	BugherdEndpointInputs,
	BugherdEndpointOutputs,
	CreateAttachmentInput,
	CreateAttachmentOutput,
	CreateColumnInput,
	CreateColumnOutput,
	CreateCommentInput,
	CreateCommentOutput,
	CreateProjectInput,
	CreateProjectOutput,
	CreateTaskInput,
	CreateTaskOutput,
	CreateWebhookInput,
	CreateWebhookOutput,
	DeleteProjectInput,
	DeleteProjectOutput,
	ListActiveProjectsInput,
	ListActiveProjectsOutput,
	ListAttachmentsInput,
	ListAttachmentsOutput,
	ListColumnsInput,
	ListColumnsOutput,
	ListProjectsInput,
	ListProjectsOutput,
	ListUsersInput,
	ListUsersOutput,
	ListWebhooksInput,
	ListWebhooksOutput,
	ShowAttachmentInput,
	ShowAttachmentOutput,
	ShowColumnInput,
	ShowColumnOutput,
	ShowOrganizationInput,
	ShowOrganizationOutput,
	ShowProjectDetailsInput,
	ShowProjectDetailsOutput,
	ShowUserProjectsInput,
	ShowUserProjectsOutput,
	ShowUserTasksInput,
	ShowUserTasksOutput,
	UpdateColumnInput,
	UpdateColumnOutput,
	UpdateProjectInput,
	UpdateProjectOutput,
	UpdateTaskInput,
	UpdateTaskOutput,
	UploadAttachmentInput,
	UploadAttachmentOutput,
} from './endpoints/types';
