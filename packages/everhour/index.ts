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
import { z } from 'zod';
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
import { resolveEverhourOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchEverhourTenantWebhook } from './webhooks/tenant-matcher';

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

export type EverhourEndpoints = any;

export type EverhourBoundWebhooks = any;

const everhourEndpointsNested = {
	user: {
		getUser: endpoints.getUser,
		listTeamUsers: endpoints.listTeamUsers,
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
	},
	tasks: {
		searchTasks: endpoints.searchTasks,
		getTask: endpoints.getTask,
		listTasksForProject: endpoints.listTasksForProject,
	},
	projects: {
		listProjects: endpoints.listProjects,
		getProject: endpoints.getProject,
	},
	clients: {
		listClients: endpoints.listClients,
		getClient: endpoints.getClient,
	},
	platforms: {
		listPlatforms: endpoints.listPlatforms,
	},
} as const;

const everhourWebhooksNested = {
	'api:time:updated': {
		'api:time:updated': EverhourWebhooks['api:time:updated'],
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
	'projects.listProjects': {
		input: EverhourEndpointInputSchemas.listProjects,
		output: EverhourEndpointOutputSchemas.listProjects,
	},
	'projects.getProject': {
		input: EverhourEndpointInputSchemas.getProject,
		output: EverhourEndpointOutputSchemas.getProject,
	},
	'clients.listClients': {
		input: EverhourEndpointInputSchemas.listClients,
		output: EverhourEndpointOutputSchemas.listClients,
	},
	'clients.getClient': {
		input: EverhourEndpointInputSchemas.getClient,
		output: EverhourEndpointOutputSchemas.getClient,
	},
	'platforms.listPlatforms': {
		input: EverhourEndpointInputSchemas.listPlatforms,
		output: EverhourEndpointOutputSchemas.listPlatforms,
	},
} as const;

const everhourWebhookSchemas = {
	'api:time:updated.api:time:updated': {
		description: 'A time record is created or modified',
		payload: z.any(),
		response: z.any(),
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
	'tasks.searchTasks': {
		riskLevel: 'read',
		description: 'Search tasks across projects',
	},
	'tasks.getTask': { riskLevel: 'read', description: 'Get a specific task' },
	'tasks.listTasksForProject': {
		riskLevel: 'read',
		description: 'List tasks for a project',
	},
	'projects.listProjects': { riskLevel: 'read', description: 'List projects' },
	'projects.getProject': { riskLevel: 'read', description: 'Get a project' },
	'clients.listClients': { riskLevel: 'read', description: 'List clients' },
	'clients.getClient': { riskLevel: 'read', description: 'Get a client' },
	'platforms.listPlatforms': {
		riskLevel: 'read',
		description: 'List supported platforms',
	},
} as const;

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
		pluginTenantWebhookMatcher: matchEverhourTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveEverhourOAuthWebhookTenantLink,
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
