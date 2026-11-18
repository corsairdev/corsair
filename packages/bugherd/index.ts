import type {
	BindEndpoints,
	CorsairErrorHandler,
	CorsairPlugin,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import type { BugherdContext } from './context';
import { Bugherd } from './endpoints';
import {
	BugherdEndpointInputSchemas,
	BugherdEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { BugherdSchema } from './schema';

export type BugherdPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalBugherdPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof bugherdEndpointsNested>;
};

export type { BugherdContext };

export type BugherdKeyBuilderContext = KeyBuilderContext<BugherdPluginOptions>;

export type BugherdBoundEndpoints = BindEndpoints<
	typeof bugherdEndpointsNested
>;

const bugherdEndpointsNested = {
	projects: {
		list: Bugherd.listProjects,
		listActive: Bugherd.listActiveProjects,
		show: Bugherd.showProjectDetails,
		create: Bugherd.createProject,
		update: Bugherd.updateProject,
		delete: Bugherd.deleteProject,
		addMember: Bugherd.addMemberToProject,
		addGuest: Bugherd.addGuestToProject,
	},
	tasks: {
		list: Bugherd.listTasks,
		listFeedback: Bugherd.listFeedbackTasks,
		listArchived: Bugherd.listArchivedTasks,
		listTaskboard: Bugherd.listTaskboardTasks,
		show: Bugherd.showTask,
		showByLocalId: Bugherd.showTaskByLocalId,
		create: Bugherd.createTask,
		update: Bugherd.updateTask,
		delete: Bugherd.deleteTask,
		move: Bugherd.moveTasks,
		listForUser: Bugherd.showUserTasks,
		listComments: Bugherd.listComments,
		createComment: Bugherd.createComment,
		listAttachments: Bugherd.listAttachments,
		showAttachment: Bugherd.showAttachment,
		createAttachment: Bugherd.createAttachment,
		uploadAttachment: Bugherd.uploadAttachment,
		deleteAttachment: Bugherd.deleteAttachment,
	},
	columns: {
		list: Bugherd.listColumns,
		show: Bugherd.showColumn,
		create: Bugherd.createColumn,
		update: Bugherd.updateColumn,
		delete: Bugherd.deleteColumn,
	},
	webhooks: {
		list: Bugherd.listWebhooks,
		create: Bugherd.createWebhook,
		delete: Bugherd.deleteWebhook,
	},
	users: {
		list: Bugherd.listUsers,
		listMembers: Bugherd.listMembers,
		listGuests: Bugherd.listGuests,
		listProjects: Bugherd.showUserProjects,
	},
	organization: {
		show: Bugherd.showOrganization,
	},
} as const;

export const bugherdEndpointSchemas = {
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
	'projects.create': {
		input: BugherdEndpointInputSchemas.createProject,
		output: BugherdEndpointOutputSchemas.createProject,
	},
	'projects.update': {
		input: BugherdEndpointInputSchemas.updateProject,
		output: BugherdEndpointOutputSchemas.updateProject,
	},
	'projects.delete': {
		input: BugherdEndpointInputSchemas.deleteProject,
		output: BugherdEndpointOutputSchemas.deleteProject,
	},
	'projects.addMember': {
		input: BugherdEndpointInputSchemas.addMemberToProject,
		output: BugherdEndpointOutputSchemas.addMemberToProject,
	},
	'projects.addGuest': {
		input: BugherdEndpointInputSchemas.addGuestToProject,
		output: BugherdEndpointOutputSchemas.addGuestToProject,
	},
	'tasks.list': {
		input: BugherdEndpointInputSchemas.listTasks,
		output: BugherdEndpointOutputSchemas.listTasks,
	},
	'tasks.listFeedback': {
		input: BugherdEndpointInputSchemas.listFeedbackTasks,
		output: BugherdEndpointOutputSchemas.listFeedbackTasks,
	},
	'tasks.listArchived': {
		input: BugherdEndpointInputSchemas.listArchivedTasks,
		output: BugherdEndpointOutputSchemas.listArchivedTasks,
	},
	'tasks.listTaskboard': {
		input: BugherdEndpointInputSchemas.listTaskboardTasks,
		output: BugherdEndpointOutputSchemas.listTaskboardTasks,
	},
	'tasks.show': {
		input: BugherdEndpointInputSchemas.showTask,
		output: BugherdEndpointOutputSchemas.showTask,
	},
	'tasks.showByLocalId': {
		input: BugherdEndpointInputSchemas.showTaskByLocalId,
		output: BugherdEndpointOutputSchemas.showTaskByLocalId,
	},
	'tasks.create': {
		input: BugherdEndpointInputSchemas.createTask,
		output: BugherdEndpointOutputSchemas.createTask,
	},
	'tasks.update': {
		input: BugherdEndpointInputSchemas.updateTask,
		output: BugherdEndpointOutputSchemas.updateTask,
	},
	'tasks.delete': {
		input: BugherdEndpointInputSchemas.deleteTask,
		output: BugherdEndpointOutputSchemas.deleteTask,
	},
	'tasks.move': {
		input: BugherdEndpointInputSchemas.moveTasks,
		output: BugherdEndpointOutputSchemas.moveTasks,
	},
	'tasks.listForUser': {
		input: BugherdEndpointInputSchemas.showUserTasks,
		output: BugherdEndpointOutputSchemas.showUserTasks,
	},
	'tasks.listComments': {
		input: BugherdEndpointInputSchemas.listComments,
		output: BugherdEndpointOutputSchemas.listComments,
	},
	'tasks.createComment': {
		input: BugherdEndpointInputSchemas.createComment,
		output: BugherdEndpointOutputSchemas.createComment,
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
	'tasks.deleteAttachment': {
		input: BugherdEndpointInputSchemas.deleteAttachment,
		output: BugherdEndpointOutputSchemas.deleteAttachment,
	},
	'columns.list': {
		input: BugherdEndpointInputSchemas.listColumns,
		output: BugherdEndpointOutputSchemas.listColumns,
	},
	'columns.show': {
		input: BugherdEndpointInputSchemas.showColumn,
		output: BugherdEndpointOutputSchemas.showColumn,
	},
	'columns.create': {
		input: BugherdEndpointInputSchemas.createColumn,
		output: BugherdEndpointOutputSchemas.createColumn,
	},
	'columns.update': {
		input: BugherdEndpointInputSchemas.updateColumn,
		output: BugherdEndpointOutputSchemas.updateColumn,
	},
	'columns.delete': {
		input: BugherdEndpointInputSchemas.deleteColumn,
		output: BugherdEndpointOutputSchemas.deleteColumn,
	},
	'webhooks.list': {
		input: BugherdEndpointInputSchemas.listWebhooks,
		output: BugherdEndpointOutputSchemas.listWebhooks,
	},
	'webhooks.create': {
		input: BugherdEndpointInputSchemas.createWebhook,
		output: BugherdEndpointOutputSchemas.createWebhook,
	},
	'webhooks.delete': {
		input: BugherdEndpointInputSchemas.deleteWebhook,
		output: BugherdEndpointOutputSchemas.deleteWebhook,
	},
	'users.list': {
		input: BugherdEndpointInputSchemas.listUsers,
		output: BugherdEndpointOutputSchemas.listUsers,
	},
	'users.listMembers': {
		input: BugherdEndpointInputSchemas.listMembers,
		output: BugherdEndpointOutputSchemas.listMembers,
	},
	'users.listGuests': {
		input: BugherdEndpointInputSchemas.listGuests,
		output: BugherdEndpointOutputSchemas.listGuests,
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

const bugherdEndpointMeta = {
	'projects.list': {
		riskLevel: 'read',
		description:
			'List every project in the organization, active and inactive. 100 per page.',
	},
	'projects.listActive': {
		riskLevel: 'read',
		description: 'List active projects only. 100 per page.',
	},
	'projects.show': {
		riskLevel: 'read',
		description: 'Get one project with its members, guests and columns.',
	},
	'projects.create': {
		riskLevel: 'write',
		description:
			'Create a project for a website. Members and guests are added separately.',
	},
	'projects.update': {
		riskLevel: 'write',
		description:
			"Change a project's name, URL or settings. Only the fields given change.",
	},
	'projects.delete': {
		riskLevel: 'destructive',
		description: 'Delete a project and all its tasks. Cannot be undone.',
	},
	'projects.addMember': {
		riskLevel: 'write',
		description: 'Add one or more organization members to a project.',
	},
	'projects.addGuest': {
		riskLevel: 'destructive',
		description:
			'Add a guest (client) to a project by user id, or invite one by email. An email invite sends the person a message.',
	},
	'tasks.list': {
		riskLevel: 'read',
		description:
			'List tasks in a project, filtered by status, priority, tag, assignee, external id or date. 100 per page.',
	},
	'tasks.listFeedback': {
		riskLevel: 'read',
		description: 'List tasks in the Feedback panel (new, not yet triaged).',
	},
	'tasks.listArchived': {
		riskLevel: 'read',
		description: 'List closed and archived tasks in a project.',
	},
	'tasks.listTaskboard': {
		riskLevel: 'read',
		description: 'List the active tasks on the project taskboard.',
	},
	'tasks.show': {
		riskLevel: 'read',
		description:
			'Get one task by its global id, with or without the project id.',
	},
	'tasks.showByLocalId': {
		riskLevel: 'read',
		description: 'Get a task by the #number shown in the BugHerd UI.',
	},
	'tasks.create': {
		riskLevel: 'write',
		description:
			'Create a task in a project. Without a status it lands in the Feedback panel.',
	},
	'tasks.update': {
		riskLevel: 'write',
		description:
			'Change a task: status (column), priority, assignees, tags, description.',
	},
	'tasks.delete': {
		riskLevel: 'destructive',
		description: 'Delete a task. Cannot be undone.',
	},
	'tasks.move': {
		riskLevel: 'write',
		description: 'Move tasks to another project, by their #numbers.',
	},
	'tasks.listForUser': {
		riskLevel: 'read',
		description: 'List tasks assigned to a user across all projects.',
	},
	'tasks.listComments': {
		riskLevel: 'read',
		description: 'List the comments on a task.',
	},
	'tasks.createComment': {
		riskLevel: 'write',
		description: 'Comment on a task, optionally visible to team members only.',
	},
	'tasks.listAttachments': {
		riskLevel: 'read',
		description: 'List the files attached to a task.',
	},
	'tasks.showAttachment': {
		riskLevel: 'read',
		description: 'Get one attachment on a task.',
	},
	'tasks.createAttachment': {
		riskLevel: 'write',
		description:
			'Attach a file to a task from a public URL. BugHerd keeps a copy.',
	},
	'tasks.uploadAttachment': {
		riskLevel: 'write',
		description: 'Upload a file to a task (a URL, or base64 for a small file).',
	},
	'tasks.deleteAttachment': {
		riskLevel: 'destructive',
		description: 'Remove an attachment from a task. Cannot be undone.',
	},
	'columns.list': {
		riskLevel: 'read',
		description: 'List the columns on a project board, built-in and custom.',
	},
	'columns.show': {
		riskLevel: 'read',
		description: 'Get one column.',
	},
	'columns.create': {
		riskLevel: 'write',
		description: 'Add a custom column at the end of a project board.',
	},
	'columns.update': {
		riskLevel: 'write',
		description: 'Rename a custom column.',
	},
	'columns.delete': {
		riskLevel: 'destructive',
		description: 'Delete an empty column. Cannot be undone.',
	},
	'webhooks.list': {
		riskLevel: 'read',
		description: 'List the organization webhooks with their delivery counts.',
	},
	'webhooks.create': {
		riskLevel: 'write',
		description:
			'Subscribe a URL to one BugHerd event, for one project or all of them.',
	},
	'webhooks.delete': {
		riskLevel: 'destructive',
		description: 'Remove a webhook subscription. Cannot be undone.',
	},
	'users.list': {
		riskLevel: 'read',
		description: 'List everyone in the organization, members and guests.',
	},
	'users.listMembers': {
		riskLevel: 'read',
		description: 'List team members (not guests).',
	},
	'users.listGuests': {
		riskLevel: 'read',
		description: 'List guests (clients) across all projects.',
	},
	'users.listProjects': {
		riskLevel: 'read',
		description: 'List the projects a user belongs to.',
	},
	'organization.show': {
		riskLevel: 'read',
		description: 'Get the organization name and id.',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof bugherdEndpointsNested>;

const defaultAuthType = 'api_key' as const;

export const bugherdAuthConfig = {
	api_key: { account: [] as const },
} as const satisfies PluginAuthConfig;

export type BaseBugherdPlugin<T extends BugherdPluginOptions> = CorsairPlugin<
	'bugherd',
	typeof BugherdSchema,
	typeof bugherdEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType
>;

export type InternalBugherdPlugin = BaseBugherdPlugin<BugherdPluginOptions>;

export type ExternalBugherdPlugin<T extends BugherdPluginOptions> =
	BaseBugherdPlugin<T>;

export function bugherd(): ExternalBugherdPlugin<{}>;
export function bugherd<const T extends BugherdPluginOptions>(
	options: BugherdPluginOptions & T,
): ExternalBugherdPlugin<T>;
export function bugherd(
	incomingOptions: BugherdPluginOptions = {},
): InternalBugherdPlugin {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'bugherd',
		authConfig: bugherdAuthConfig,
		schema: BugherdSchema,
		options,
		hooks: options.hooks,
		endpoints: bugherdEndpointsNested,
		webhooks: {},
		endpointMeta: bugherdEndpointMeta,
		endpointSchemas: bugherdEndpointSchemas,
		errorHandlers: {
			RATE_LIMIT_ERROR: errorHandlers.RATE_LIMIT_ERROR,
			AUTH_ERROR: errorHandlers.AUTH_ERROR,
			...options.errorHandlers,
			DEFAULT: options.errorHandlers?.DEFAULT ?? errorHandlers.DEFAULT,
		},
		keyBuilder: async (ctx: BugherdKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (options.key?.trim()) return options.key;
			if (!ctx.keys) throw new AuthMissingError('bugherd', options.authType);
			const key = await ctx.keys.get_api_key();
			if (key?.trim()) return key;
			throw new AuthMissingError('bugherd', ctx.authType);
		},
	} satisfies InternalBugherdPlugin;
}

export type {
	BugherdEndpointInputs,
	BugherdEndpointOutputs,
} from './endpoints/types';
export type {
	BugherdAttachment,
	BugherdColumn,
	BugherdComment,
	BugherdOrganization,
	BugherdProject,
	BugherdTask,
	BugherdUser,
	BugherdWebhook,
} from './schema/database';
