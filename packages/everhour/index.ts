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
} from 'corsair/core';
import * as endpoints from './endpoints';
import type {
	EverhourEndpointInputs,
	EverhourEndpointOutputs,
} from './endpoints/types';
import {
	EverhourEndpointInputSchemas,
	EverhourEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { EverhourSchema } from './schema';
import { EverhourWebhooks } from './webhooks';
import {
	EverhourWebhookPayloadSchema,
	TimeUpdatedEventSchema,
} from './webhooks/types';

export type EverhourPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalEverhourPlugin['hooks'];
	webhookHooks?: InternalEverhourPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof everhourEndpointsNested>;
};

export type EverhourContext = CorsairPluginContext<
	typeof EverhourSchema,
	EverhourPluginOptions
>;

export type EverhourKeyBuilderContext =
	KeyBuilderContext<EverhourPluginOptions>;

export type EverhourBoundEndpoints = BindEndpoints<
	typeof everhourEndpointsNested
>;

type EverhourEndpoint<K extends keyof EverhourEndpointOutputs> =
	CorsairEndpoint<
		EverhourContext,
		EverhourEndpointInputs[K],
		EverhourEndpointOutputs[K]
	>;

// Covers every key of EverhourEndpointOutputs (48 operations); the input and
// output maps share an identical key set so no operation is left untyped.
export type EverhourEndpoints = {
	[K in keyof EverhourEndpointOutputs]: EverhourEndpoint<K>;
};

export type EverhourBoundWebhooks = BindWebhooks<typeof everhourWebhooksNested>;

const everhourEndpointsNested = {
	user: {
		getUser: endpoints.getUser,
		listTeamUsers: endpoints.listTeamUsers,
		listTeams: endpoints.listTeams,
	},
	timer: {
		getCurrentTimer: endpoints.getCurrentTimer,
		startTimer: endpoints.startTimer,
		stopTimer: endpoints.stopTimer,
	},
	time: {
		listUserTime: endpoints.listUserTime,
		listUserTimesheets: endpoints.listUserTimesheets,
		logTime: endpoints.logTime,
		updateTimeEntry: endpoints.updateTimeEntry,
		deleteTimeEntry: endpoints.deleteTimeEntry,
		requestTimesheetApproval: endpoints.requestTimesheetApproval,
		discardTimesheetApproval: endpoints.discardTimesheetApproval,
	},
	tasks: {
		searchTasks: endpoints.searchTasks,
		getTask: endpoints.getTask,
		listTasksForProject: endpoints.listTasksForProject,
		createTask: endpoints.createTask,
	},
	projects: {
		listProjects: endpoints.listProjects,
		getProject: endpoints.getProject,
		createProject: endpoints.createProject,
		updateProject: endpoints.updateProject,
		deleteProject: endpoints.deleteProject,
	},
	sections: {
		listSections: endpoints.listSections,
		getSection: endpoints.getSection,
		createSection: endpoints.createSection,
		deleteSection: endpoints.deleteSection,
	},
	clients: {
		listClients: endpoints.listClients,
		getClient: endpoints.getClient,
		createClient: endpoints.createClient,
		updateClient: endpoints.updateClient,
		deleteClient: endpoints.deleteClient,
	},
	platforms: {
		listPlatforms: endpoints.listPlatforms,
	},
	timecards: {
		clockIn: endpoints.clockIn,
		clockOut: endpoints.clockOut,
		getTimecard: endpoints.getTimecard,
		listTimecards: endpoints.listTimecards,
		listUserTimecards: endpoints.listUserTimecards,
		updateTimecard: endpoints.updateTimecard,
		deleteTimecard: endpoints.deleteTimecard,
	},
	expenses: {
		listExpenses: endpoints.listExpenses,
		listExpenseCategories: endpoints.listExpenseCategories,
	},
	invoices: {
		listInvoices: endpoints.listInvoices,
	},
	hooks: {
		listWebhooks: endpoints.listWebhooks,
		getWebhook: endpoints.getWebhook,
		createWebhook: endpoints.createWebhook,
		updateWebhook: endpoints.updateWebhook,
		deleteWebhook: endpoints.deleteWebhook,
	},
	tags: {
		listTags: endpoints.listTags,
	},
} as const;

const everhourWebhooksNested = {
	time: {
		updated: EverhourWebhooks['api:time:updated'],
	},
	timer: {
		started: EverhourWebhooks['api:timer:started'],
		stopped: EverhourWebhooks['api:timer:stopped'],
	},
	project: {
		created: EverhourWebhooks['api:project:created'],
		updated: EverhourWebhooks['api:project:updated'],
		removed: EverhourWebhooks['api:project:removed'],
	},
	task: {
		created: EverhourWebhooks['api:task:created'],
		updated: EverhourWebhooks['api:task:updated'],
		removed: EverhourWebhooks['api:task:removed'],
		recovered: EverhourWebhooks['api:task:recovered'],
	},
	estimate: {
		updated: EverhourWebhooks['api:estimate:updated'],
	},
	section: {
		created: EverhourWebhooks['api:section:created'],
		updated: EverhourWebhooks['api:section:updated'],
		removed: EverhourWebhooks['api:section:removed'],
		recovered: EverhourWebhooks['api:section:recovered'],
	},
	client: {
		created: EverhourWebhooks['api:client:created'],
		updated: EverhourWebhooks['api:client:updated'],
	},
	invoice: {
		created: EverhourWebhooks['api:invoice:created'],
		updated: EverhourWebhooks['api:invoice:updated'],
		deleted: EverhourWebhooks['api:invoice:deleted'],
	},
} as const;

export const everhourEndpointSchemas = {
	'user.getUser': {
		input: EverhourEndpointInputSchemas.getUser,
		output: EverhourEndpointOutputSchemas.getUser,
	},
	'user.listTeamUsers': {
		input: EverhourEndpointInputSchemas.listTeamUsers,
		output: EverhourEndpointOutputSchemas.listTeamUsers,
	},
	'user.listTeams': {
		input: EverhourEndpointInputSchemas.listTeams,
		output: EverhourEndpointOutputSchemas.listTeams,
	},
	'timer.getCurrentTimer': {
		input: EverhourEndpointInputSchemas.getCurrentTimer,
		output: EverhourEndpointOutputSchemas.getCurrentTimer,
	},
	'timer.startTimer': {
		input: EverhourEndpointInputSchemas.startTimer,
		output: EverhourEndpointOutputSchemas.startTimer,
	},
	'timer.stopTimer': {
		input: EverhourEndpointInputSchemas.stopTimer,
		output: EverhourEndpointOutputSchemas.stopTimer,
	},
	'time.listUserTime': {
		input: EverhourEndpointInputSchemas.listUserTime,
		output: EverhourEndpointOutputSchemas.listUserTime,
	},
	'time.listUserTimesheets': {
		input: EverhourEndpointInputSchemas.listUserTimesheets,
		output: EverhourEndpointOutputSchemas.listUserTimesheets,
	},
	'time.logTime': {
		input: EverhourEndpointInputSchemas.logTime,
		output: EverhourEndpointOutputSchemas.logTime,
	},
	'time.updateTimeEntry': {
		input: EverhourEndpointInputSchemas.updateTimeEntry,
		output: EverhourEndpointOutputSchemas.updateTimeEntry,
	},
	'time.deleteTimeEntry': {
		input: EverhourEndpointInputSchemas.deleteTimeEntry,
		output: EverhourEndpointOutputSchemas.deleteTimeEntry,
	},
	'time.requestTimesheetApproval': {
		input: EverhourEndpointInputSchemas.requestTimesheetApproval,
		output: EverhourEndpointOutputSchemas.requestTimesheetApproval,
	},
	'time.discardTimesheetApproval': {
		input: EverhourEndpointInputSchemas.discardTimesheetApproval,
		output: EverhourEndpointOutputSchemas.discardTimesheetApproval,
	},
	'tasks.searchTasks': {
		input: EverhourEndpointInputSchemas.searchTasks,
		output: EverhourEndpointOutputSchemas.searchTasks,
	},
	'tasks.getTask': {
		input: EverhourEndpointInputSchemas.getTask,
		output: EverhourEndpointOutputSchemas.getTask,
	},
	'tasks.listTasksForProject': {
		input: EverhourEndpointInputSchemas.listTasksForProject,
		output: EverhourEndpointOutputSchemas.listTasksForProject,
	},
	'tasks.createTask': {
		input: EverhourEndpointInputSchemas.createTask,
		output: EverhourEndpointOutputSchemas.createTask,
	},
	'projects.listProjects': {
		input: EverhourEndpointInputSchemas.listProjects,
		output: EverhourEndpointOutputSchemas.listProjects,
	},
	'projects.getProject': {
		input: EverhourEndpointInputSchemas.getProject,
		output: EverhourEndpointOutputSchemas.getProject,
	},
	'projects.createProject': {
		input: EverhourEndpointInputSchemas.createProject,
		output: EverhourEndpointOutputSchemas.createProject,
	},
	'projects.updateProject': {
		input: EverhourEndpointInputSchemas.updateProject,
		output: EverhourEndpointOutputSchemas.updateProject,
	},
	'projects.deleteProject': {
		input: EverhourEndpointInputSchemas.deleteProject,
		output: EverhourEndpointOutputSchemas.deleteProject,
	},
	'sections.listSections': {
		input: EverhourEndpointInputSchemas.listSections,
		output: EverhourEndpointOutputSchemas.listSections,
	},
	'sections.getSection': {
		input: EverhourEndpointInputSchemas.getSection,
		output: EverhourEndpointOutputSchemas.getSection,
	},
	'sections.createSection': {
		input: EverhourEndpointInputSchemas.createSection,
		output: EverhourEndpointOutputSchemas.createSection,
	},
	'sections.deleteSection': {
		input: EverhourEndpointInputSchemas.deleteSection,
		output: EverhourEndpointOutputSchemas.deleteSection,
	},
	'clients.listClients': {
		input: EverhourEndpointInputSchemas.listClients,
		output: EverhourEndpointOutputSchemas.listClients,
	},
	'clients.getClient': {
		input: EverhourEndpointInputSchemas.getClient,
		output: EverhourEndpointOutputSchemas.getClient,
	},
	'clients.createClient': {
		input: EverhourEndpointInputSchemas.createClient,
		output: EverhourEndpointOutputSchemas.createClient,
	},
	'clients.updateClient': {
		input: EverhourEndpointInputSchemas.updateClient,
		output: EverhourEndpointOutputSchemas.updateClient,
	},
	'clients.deleteClient': {
		input: EverhourEndpointInputSchemas.deleteClient,
		output: EverhourEndpointOutputSchemas.deleteClient,
	},
	'platforms.listPlatforms': {
		input: EverhourEndpointInputSchemas.listPlatforms,
		output: EverhourEndpointOutputSchemas.listPlatforms,
	},
	'timecards.clockIn': {
		input: EverhourEndpointInputSchemas.clockIn,
		output: EverhourEndpointOutputSchemas.clockIn,
	},
	'timecards.clockOut': {
		input: EverhourEndpointInputSchemas.clockOut,
		output: EverhourEndpointOutputSchemas.clockOut,
	},
	'timecards.getTimecard': {
		input: EverhourEndpointInputSchemas.getTimecard,
		output: EverhourEndpointOutputSchemas.getTimecard,
	},
	'timecards.listTimecards': {
		input: EverhourEndpointInputSchemas.listTimecards,
		output: EverhourEndpointOutputSchemas.listTimecards,
	},
	'timecards.listUserTimecards': {
		input: EverhourEndpointInputSchemas.listUserTimecards,
		output: EverhourEndpointOutputSchemas.listUserTimecards,
	},
	'timecards.updateTimecard': {
		input: EverhourEndpointInputSchemas.updateTimecard,
		output: EverhourEndpointOutputSchemas.updateTimecard,
	},
	'timecards.deleteTimecard': {
		input: EverhourEndpointInputSchemas.deleteTimecard,
		output: EverhourEndpointOutputSchemas.deleteTimecard,
	},
	'expenses.listExpenses': {
		input: EverhourEndpointInputSchemas.listExpenses,
		output: EverhourEndpointOutputSchemas.listExpenses,
	},
	'expenses.listExpenseCategories': {
		input: EverhourEndpointInputSchemas.listExpenseCategories,
		output: EverhourEndpointOutputSchemas.listExpenseCategories,
	},
	'invoices.listInvoices': {
		input: EverhourEndpointInputSchemas.listInvoices,
		output: EverhourEndpointOutputSchemas.listInvoices,
	},
	'hooks.listWebhooks': {
		input: EverhourEndpointInputSchemas.listWebhooks,
		output: EverhourEndpointOutputSchemas.listWebhooks,
	},
	'hooks.getWebhook': {
		input: EverhourEndpointInputSchemas.getWebhook,
		output: EverhourEndpointOutputSchemas.getWebhook,
	},
	'hooks.createWebhook': {
		input: EverhourEndpointInputSchemas.createWebhook,
		output: EverhourEndpointOutputSchemas.createWebhook,
	},
	'hooks.updateWebhook': {
		input: EverhourEndpointInputSchemas.updateWebhook,
		output: EverhourEndpointOutputSchemas.updateWebhook,
	},
	'hooks.deleteWebhook': {
		input: EverhourEndpointInputSchemas.deleteWebhook,
		output: EverhourEndpointOutputSchemas.deleteWebhook,
	},
	'tags.listTags': {
		input: EverhourEndpointInputSchemas.listTags,
		output: EverhourEndpointOutputSchemas.listTags,
	},
} as const;

const everhourWebhookSchemas = {
	'time.updated': {
		description: 'A time record is created or modified',
		payload: TimeUpdatedEventSchema,
		response: TimeUpdatedEventSchema,
	},
	'timer.started': {
		description: 'A timer was started',
		payload: EverhourWebhookPayloadSchema,
		response: EverhourWebhookPayloadSchema,
	},
	'timer.stopped': {
		description: 'A timer was stopped',
		payload: EverhourWebhookPayloadSchema,
		response: EverhourWebhookPayloadSchema,
	},
	'project.created': {
		description: 'A project was created',
		payload: EverhourWebhookPayloadSchema,
		response: EverhourWebhookPayloadSchema,
	},
	'project.updated': {
		description: 'A project was updated',
		payload: EverhourWebhookPayloadSchema,
		response: EverhourWebhookPayloadSchema,
	},
	'project.removed': {
		description: 'A project was removed',
		payload: EverhourWebhookPayloadSchema,
		response: EverhourWebhookPayloadSchema,
	},
	'task.created': {
		description: 'A task was created',
		payload: EverhourWebhookPayloadSchema,
		response: EverhourWebhookPayloadSchema,
	},
	'task.updated': {
		description: 'A task was updated',
		payload: EverhourWebhookPayloadSchema,
		response: EverhourWebhookPayloadSchema,
	},
	'task.removed': {
		description: 'A task was removed',
		payload: EverhourWebhookPayloadSchema,
		response: EverhourWebhookPayloadSchema,
	},
	'task.recovered': {
		description: 'A task was recovered',
		payload: EverhourWebhookPayloadSchema,
		response: EverhourWebhookPayloadSchema,
	},
	'estimate.updated': {
		description: 'A task estimate was updated',
		payload: EverhourWebhookPayloadSchema,
		response: EverhourWebhookPayloadSchema,
	},
	'section.created': {
		description: 'A section was created',
		payload: EverhourWebhookPayloadSchema,
		response: EverhourWebhookPayloadSchema,
	},
	'section.updated': {
		description: 'A section was updated',
		payload: EverhourWebhookPayloadSchema,
		response: EverhourWebhookPayloadSchema,
	},
	'section.removed': {
		description: 'A section was removed',
		payload: EverhourWebhookPayloadSchema,
		response: EverhourWebhookPayloadSchema,
	},
	'section.recovered': {
		description: 'A section was recovered',
		payload: EverhourWebhookPayloadSchema,
		response: EverhourWebhookPayloadSchema,
	},
	'client.created': {
		description: 'A client was created',
		payload: EverhourWebhookPayloadSchema,
		response: EverhourWebhookPayloadSchema,
	},
	'client.updated': {
		description: 'A client was updated',
		payload: EverhourWebhookPayloadSchema,
		response: EverhourWebhookPayloadSchema,
	},
	'invoice.created': {
		description: 'An invoice was created',
		payload: EverhourWebhookPayloadSchema,
		response: EverhourWebhookPayloadSchema,
	},
	'invoice.updated': {
		description: 'An invoice was updated',
		payload: EverhourWebhookPayloadSchema,
		response: EverhourWebhookPayloadSchema,
	},
	'invoice.deleted': {
		description: 'An invoice was deleted',
		payload: EverhourWebhookPayloadSchema,
		response: EverhourWebhookPayloadSchema,
	},
} as const;

const defaultAuthType: AuthTypes = 'api_key' as const;

const everhourEndpointMeta = {
	'user.getUser': {
		riskLevel: 'read',
		description: 'Get current user profile',
	},
	'user.listTeamUsers': {
		riskLevel: 'read',
		description: 'List all team users',
	},
	'user.listTeams': {
		riskLevel: 'read',
		description: 'Get the authenticated Everhour workspace',
	},
	'timer.getCurrentTimer': {
		riskLevel: 'read',
		description: 'Get the current active timer',
	},
	'timer.startTimer': { riskLevel: 'write', description: 'Start a new timer' },
	'timer.stopTimer': {
		riskLevel: 'write',
		description: 'Stop the currently running timer',
	},
	'time.listUserTime': {
		riskLevel: 'read',
		description: 'List time records for a user',
	},
	'time.listUserTimesheets': {
		riskLevel: 'read',
		description: 'List timesheets for a user',
	},
	'time.logTime': { riskLevel: 'write', description: 'Log a new time record' },
	'time.updateTimeEntry': {
		riskLevel: 'write',
		description: 'Update a time record',
	},
	'time.deleteTimeEntry': {
		riskLevel: 'write',
		description: 'Delete a time record',
	},
	'time.requestTimesheetApproval': {
		riskLevel: 'write',
		description: 'Request approval for a timesheet week',
	},
	'time.discardTimesheetApproval': {
		riskLevel: 'write',
		description: 'Discard a pending timesheet approval request',
	},
	'tasks.searchTasks': {
		riskLevel: 'read',
		description: 'Search tasks across projects',
	},
	'tasks.getTask': { riskLevel: 'read', description: 'Get a specific task' },
	'tasks.listTasksForProject': {
		riskLevel: 'read',
		description: 'List tasks for a project',
	},
	'tasks.createTask': { riskLevel: 'write', description: 'Create a task' },
	'projects.listProjects': { riskLevel: 'read', description: 'List projects' },
	'projects.getProject': { riskLevel: 'read', description: 'Get a project' },
	'projects.createProject': {
		riskLevel: 'write',
		description: 'Create a project',
	},
	'projects.updateProject': {
		riskLevel: 'write',
		description: 'Update a project',
	},
	'projects.deleteProject': {
		riskLevel: 'write',
		description: 'Delete a project',
	},
	'sections.listSections': {
		riskLevel: 'read',
		description: 'List sections in a project',
	},
	'sections.getSection': { riskLevel: 'read', description: 'Get a section' },
	'sections.createSection': {
		riskLevel: 'write',
		description: 'Create a section',
	},
	'sections.deleteSection': {
		riskLevel: 'write',
		description: 'Delete a section',
	},
	'clients.listClients': { riskLevel: 'read', description: 'List clients' },
	'clients.getClient': { riskLevel: 'read', description: 'Get a client' },
	'clients.createClient': {
		riskLevel: 'write',
		description: 'Create a client',
	},
	'clients.updateClient': {
		riskLevel: 'write',
		description: 'Update a client',
	},
	'clients.deleteClient': {
		riskLevel: 'write',
		description: 'Delete a client',
	},
	'platforms.listPlatforms': {
		riskLevel: 'read',
		description: 'List supported platforms',
	},
	'timecards.clockIn': { riskLevel: 'write', description: 'Clock a user in' },
	'timecards.clockOut': { riskLevel: 'write', description: 'Clock a user out' },
	'timecards.getTimecard': {
		riskLevel: 'read',
		description: 'Get a user timecard for a date',
	},
	'timecards.listTimecards': {
		riskLevel: 'read',
		description: 'List team timecards',
	},
	'timecards.listUserTimecards': {
		riskLevel: 'read',
		description: 'List timecards for a user',
	},
	'timecards.updateTimecard': {
		riskLevel: 'write',
		description: 'Update a user timecard',
	},
	'timecards.deleteTimecard': {
		riskLevel: 'write',
		description: 'Delete a user timecard',
	},
	'expenses.listExpenses': { riskLevel: 'read', description: 'List expenses' },
	'expenses.listExpenseCategories': {
		riskLevel: 'read',
		description: 'List expense categories',
	},
	'invoices.listInvoices': { riskLevel: 'read', description: 'List invoices' },
	'hooks.listWebhooks': { riskLevel: 'read', description: 'List webhooks' },
	'hooks.getWebhook': { riskLevel: 'read', description: 'Get a webhook' },
	'hooks.createWebhook': {
		riskLevel: 'write',
		description: 'Create a webhook',
	},
	'hooks.updateWebhook': {
		riskLevel: 'write',
		description: 'Update a webhook',
	},
	'hooks.deleteWebhook': {
		riskLevel: 'write',
		description: 'Delete a webhook',
	},
	'tags.listTags': { riskLevel: 'read', description: 'List workspace tags' },
} as const satisfies RequiredPluginEndpointMeta<typeof everhourEndpointsNested>;

export const everhourAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseEverhourPlugin<T extends EverhourPluginOptions> = CorsairPlugin<
	'everhour',
	typeof EverhourSchema,
	typeof everhourEndpointsNested,
	typeof everhourWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalEverhourPlugin = BaseEverhourPlugin<EverhourPluginOptions>;

export type ExternalEverhourPlugin<T extends EverhourPluginOptions> =
	BaseEverhourPlugin<T>;

export function everhour<const T extends EverhourPluginOptions>(
	incomingOptions: EverhourPluginOptions & T = {} as EverhourPluginOptions & T,
): ExternalEverhourPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'everhour',
		authConfig: everhourAuthConfig,
		schema: EverhourSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: everhourEndpointsNested as any,
		webhooks: everhourWebhooksNested as any,
		endpointMeta: everhourEndpointMeta,
		endpointSchemas: everhourEndpointSchemas,
		webhookSchemas: everhourWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			return 'x-hook-secret' in headers;
		},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: EverhourKeyBuilderContext, source) => {
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
	} satisfies InternalEverhourPlugin;
}

export type {
	EverhourEndpointInputs,
	EverhourEndpointOutputs,
} from './endpoints/types';
