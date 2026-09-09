import type {
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
import { Handlers } from './endpoints';
import type {
	CallinglyEndpointInputs,
	CallinglyEndpointOutputs,
} from './endpoints/types';
import {
	CallinglyEndpointInputSchemas,
	CallinglyEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { CallinglySchema } from './schema';

export type CallinglyPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	hooks?: InternalCallinglyPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof callinglyEndpointsNested>;
};

export type CallinglyContext = CorsairPluginContext<
	typeof CallinglySchema,
	CallinglyPluginOptions
>;

export type CallinglyKeyBuilderContext =
	KeyBuilderContext<CallinglyPluginOptions>;

export type CallinglyBoundEndpoints = BindEndpoints<
	typeof callinglyEndpointsNested
>;

type CallinglyEndpoint<K extends keyof CallinglyEndpointOutputs> =
	CorsairEndpoint<
		CallinglyContext,
		CallinglyEndpointInputs[K],
		CallinglyEndpointOutputs[K]
	>;

export type CallinglyEndpoints = {
	getLead: CallinglyEndpoint<'getLead'>;
	listLeads: CallinglyEndpoint<'listLeads'>;
	updateLead: CallinglyEndpoint<'updateLead'>;
	deleteLead: CallinglyEndpoint<'deleteLead'>;

	createCall: CallinglyEndpoint<'createCall'>;
	getCall: CallinglyEndpoint<'getCall'>;
	listCalls: CallinglyEndpoint<'listCalls'>;

	createAgent: CallinglyEndpoint<'createAgent'>;
	listUsers: CallinglyEndpoint<'listUsers'>;
	updateAgent: CallinglyEndpoint<'updateAgent'>;
	deleteAgent: CallinglyEndpoint<'deleteAgent'>;
	getAgentSchedule: CallinglyEndpoint<'getAgentSchedule'>;
	updateAgentSchedule: CallinglyEndpoint<'updateAgentSchedule'>;

	createTeam: CallinglyEndpoint<'createTeam'>;
	listTeams: CallinglyEndpoint<'listTeams'>;
	getTeam: CallinglyEndpoint<'getTeam'>;
	listTeamUsers: CallinglyEndpoint<'listTeamUsers'>;
	updateTeamUsers: CallinglyEndpoint<'updateTeamUsers'>;
	updateTeamAgentSettings: CallinglyEndpoint<'updateTeamAgentSettings'>;
	removeTeamAgent: CallinglyEndpoint<'removeTeamAgent'>;

	listClients: CallinglyEndpoint<'listClients'>;
	createClient: CallinglyEndpoint<'createClient'>;
	deleteClient: CallinglyEndpoint<'deleteClient'>;
	setClientActive: CallinglyEndpoint<'setClientActive'>;

	listWebhooks: CallinglyEndpoint<'listWebhooks'>;
	getWebhook: CallinglyEndpoint<'getWebhook'>;
	createWebhook: CallinglyEndpoint<'createWebhook'>;
	updateWebhook: CallinglyEndpoint<'updateWebhook'>;
	deleteWebhook: CallinglyEndpoint<'deleteWebhook'>;
};

const callinglyEndpointsNested = {
	leads: {
		get: Handlers.getLead,
		list: Handlers.listLeads,
		update: Handlers.updateLead,
		delete: Handlers.deleteLead,
	},
	calls: {
		create: Handlers.createCall,
		get: Handlers.getCall,
		list: Handlers.listCalls,
	},
	agents: {
		create: Handlers.createAgent,
		list: Handlers.listUsers,
		update: Handlers.updateAgent,
		delete: Handlers.deleteAgent,
		getSchedule: Handlers.getAgentSchedule,
		updateSchedule: Handlers.updateAgentSchedule,
	},
	teams: {
		create: Handlers.createTeam,
		list: Handlers.listTeams,
		get: Handlers.getTeam,
		listUsers: Handlers.listTeamUsers,
		updateUsers: Handlers.updateTeamUsers,
		updateAgentSettings: Handlers.updateTeamAgentSettings,
		removeAgent: Handlers.removeTeamAgent,
	},
	clients: {
		list: Handlers.listClients,
		create: Handlers.createClient,
		delete: Handlers.deleteClient,
		activateDeactivate: Handlers.setClientActive,
	},
	webhooks: {
		list: Handlers.listWebhooks,
		get: Handlers.getWebhook,
		create: Handlers.createWebhook,
		update: Handlers.updateWebhook,
		delete: Handlers.deleteWebhook,
	},
} as const;

export const callinglyEndpointSchemas = {
	'leads.get': {
		input: CallinglyEndpointInputSchemas.getLead,
		output: CallinglyEndpointOutputSchemas.getLead,
	},
	'leads.list': {
		input: CallinglyEndpointInputSchemas.listLeads,
		output: CallinglyEndpointOutputSchemas.listLeads,
	},
	'leads.update': {
		input: CallinglyEndpointInputSchemas.updateLead,
		output: CallinglyEndpointOutputSchemas.updateLead,
	},
	'leads.delete': {
		input: CallinglyEndpointInputSchemas.deleteLead,
		output: CallinglyEndpointOutputSchemas.deleteLead,
	},
	'calls.create': {
		input: CallinglyEndpointInputSchemas.createCall,
		output: CallinglyEndpointOutputSchemas.createCall,
	},
	'calls.get': {
		input: CallinglyEndpointInputSchemas.getCall,
		output: CallinglyEndpointOutputSchemas.getCall,
	},
	'calls.list': {
		input: CallinglyEndpointInputSchemas.listCalls,
		output: CallinglyEndpointOutputSchemas.listCalls,
	},
	'agents.create': {
		input: CallinglyEndpointInputSchemas.createAgent,
		output: CallinglyEndpointOutputSchemas.createAgent,
	},
	'agents.list': {
		input: CallinglyEndpointInputSchemas.listUsers,
		output: CallinglyEndpointOutputSchemas.listUsers,
	},
	'agents.update': {
		input: CallinglyEndpointInputSchemas.updateAgent,
		output: CallinglyEndpointOutputSchemas.updateAgent,
	},
	'agents.delete': {
		input: CallinglyEndpointInputSchemas.deleteAgent,
		output: CallinglyEndpointOutputSchemas.deleteAgent,
	},
	'agents.getSchedule': {
		input: CallinglyEndpointInputSchemas.getAgentSchedule,
		output: CallinglyEndpointOutputSchemas.getAgentSchedule,
	},
	'agents.updateSchedule': {
		input: CallinglyEndpointInputSchemas.updateAgentSchedule,
		output: CallinglyEndpointOutputSchemas.updateAgentSchedule,
	},
	'teams.create': {
		input: CallinglyEndpointInputSchemas.createTeam,
		output: CallinglyEndpointOutputSchemas.createTeam,
	},
	'teams.list': {
		input: CallinglyEndpointInputSchemas.listTeams,
		output: CallinglyEndpointOutputSchemas.listTeams,
	},
	'teams.get': {
		input: CallinglyEndpointInputSchemas.getTeam,
		output: CallinglyEndpointOutputSchemas.getTeam,
	},
	'teams.listUsers': {
		input: CallinglyEndpointInputSchemas.listTeamUsers,
		output: CallinglyEndpointOutputSchemas.listTeamUsers,
	},
	'teams.updateUsers': {
		input: CallinglyEndpointInputSchemas.updateTeamUsers,
		output: CallinglyEndpointOutputSchemas.updateTeamUsers,
	},
	'teams.updateAgentSettings': {
		input: CallinglyEndpointInputSchemas.updateTeamAgentSettings,
		output: CallinglyEndpointOutputSchemas.updateTeamAgentSettings,
	},
	'teams.removeAgent': {
		input: CallinglyEndpointInputSchemas.removeTeamAgent,
		output: CallinglyEndpointOutputSchemas.removeTeamAgent,
	},
	'clients.list': {
		input: CallinglyEndpointInputSchemas.listClients,
		output: CallinglyEndpointOutputSchemas.listClients,
	},
	'clients.create': {
		input: CallinglyEndpointInputSchemas.createClient,
		output: CallinglyEndpointOutputSchemas.createClient,
	},
	'clients.delete': {
		input: CallinglyEndpointInputSchemas.deleteClient,
		output: CallinglyEndpointOutputSchemas.deleteClient,
	},
	'clients.activateDeactivate': {
		input: CallinglyEndpointInputSchemas.setClientActive,
		output: CallinglyEndpointOutputSchemas.setClientActive,
	},
	'webhooks.list': {
		input: CallinglyEndpointInputSchemas.listWebhooks,
		output: CallinglyEndpointOutputSchemas.listWebhooks,
	},
	'webhooks.get': {
		input: CallinglyEndpointInputSchemas.getWebhook,
		output: CallinglyEndpointOutputSchemas.getWebhook,
	},
	'webhooks.create': {
		input: CallinglyEndpointInputSchemas.createWebhook,
		output: CallinglyEndpointOutputSchemas.createWebhook,
	},
	'webhooks.update': {
		input: CallinglyEndpointInputSchemas.updateWebhook,
		output: CallinglyEndpointOutputSchemas.updateWebhook,
	},
	'webhooks.delete': {
		input: CallinglyEndpointInputSchemas.deleteWebhook,
		output: CallinglyEndpointOutputSchemas.deleteWebhook,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof callinglyEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const callinglyEndpointMeta = {
	'leads.get': {
		riskLevel: 'read',
		description: 'Retrieve lead details by ID',
	},
	'leads.list': {
		riskLevel: 'read',
		description:
			'List leads with optional date, phone number, and pagination filters',
	},
	'leads.update': {
		riskLevel: 'write',
		description: 'Update lead contact details and assignments',
	},
	'leads.delete': {
		riskLevel: 'destructive',
		description: 'Delete a lead by ID',
	},
	'calls.create': {
		riskLevel: 'write',
		description: 'Initiate or trigger a new call to a lead',
	},
	'calls.get': {
		riskLevel: 'read',
		description: 'Retrieve call details, duration, and recording by ID',
	},
	'calls.list': {
		riskLevel: 'read',
		description:
			'List call history and logs with optional team, user, and status filters',
	},
	'agents.create': {
		riskLevel: 'write',
		description: 'Register a new agent in Callingly',
	},
	'agents.list': {
		riskLevel: 'read',
		description: 'List all agents and users under the account',
	},
	'agents.update': {
		riskLevel: 'write',
		description: 'Update agent information',
	},
	'agents.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete an agent from a Callingly account',
	},
	'agents.getSchedule': {
		riskLevel: 'read',
		description: 'Retrieve the availability schedule for a specific agent',
	},
	'agents.updateSchedule': {
		riskLevel: 'write',
		description: 'Update an agent availability schedule',
	},
	'teams.create': {
		riskLevel: 'write',
		description: 'Create a new team in Callingly',
	},
	'teams.list': {
		riskLevel: 'read',
		description: 'List teams in the Callingly account',
	},
	'teams.get': {
		riskLevel: 'read',
		description: 'Retrieve team details by ID',
	},
	'teams.listUsers': {
		riskLevel: 'read',
		description: 'Retrieve all agents assigned to a specific team',
	},
	'teams.updateUsers': {
		riskLevel: 'write',
		description: 'Update the list of agents assigned to a team',
	},
	'teams.updateAgentSettings': {
		riskLevel: 'write',
		description: 'Update priority and capacity settings for a team agent',
	},
	'teams.removeAgent': {
		riskLevel: 'destructive',
		description: 'Remove a specific agent from a team',
	},
	'clients.list': {
		riskLevel: 'read',
		description: 'List agency client accounts',
	},
	'clients.create': {
		riskLevel: 'write',
		description: 'Create a new agency client account',
	},
	'clients.delete': {
		riskLevel: 'destructive',
		description: 'Delete an agency client account by ID',
	},
	'clients.activateDeactivate': {
		riskLevel: 'write',
		description: 'Activate or deactivate a client account',
	},
	'webhooks.list': {
		riskLevel: 'read',
		description: 'List configured webhooks',
	},
	'webhooks.get': {
		riskLevel: 'read',
		description: 'Retrieve details of a specific webhook by ID',
	},
	'webhooks.create': {
		riskLevel: 'write',
		description: 'Create a new webhook for call or lead events',
	},
	'webhooks.update': {
		riskLevel: 'write',
		description: 'Update an existing webhook configuration by ID',
	},
	'webhooks.delete': {
		riskLevel: 'destructive',
		description: 'Delete a webhook by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof callinglyEndpointsNested
>;

export const callinglyAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseCallinglyPlugin<T extends CallinglyPluginOptions> =
	CorsairPlugin<
		'callingly',
		typeof CallinglySchema,
		typeof callinglyEndpointsNested,
		Record<string, never>,
		T,
		typeof defaultAuthType
	>;

export type InternalCallinglyPlugin =
	BaseCallinglyPlugin<CallinglyPluginOptions>;

export type ExternalCallinglyPlugin<T extends CallinglyPluginOptions> =
	BaseCallinglyPlugin<T>;

export function callingly(
	incomingOptions: CallinglyPluginOptions = {},
): InternalCallinglyPlugin {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'callingly',
		authConfig: callinglyAuthConfig,
		schema: CallinglySchema,
		options: options,
		hooks: options.hooks,
		endpoints: callinglyEndpointsNested,
		webhooks: {},
		endpointMeta: callinglyEndpointMeta,
		endpointSchemas: callinglyEndpointSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: CallinglyKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys?.get_api_key?.();
				if (!res) {
					throw new AuthMissingError('callingly', 'api_key');
				}
				return res;
			}

			if (source === 'endpoint' && ctx.authType === 'oauth_2') {
				const res = await ctx.keys?.get_access_token?.();
				if (!res) {
					throw new AuthMissingError('callingly', 'oauth_2');
				}
				return res;
			}

			throw new AuthMissingError('callingly', 'api_key');
		},
	} satisfies InternalCallinglyPlugin;
}

export { CALLINGLY_API_BASE, CallinglyAPIError } from './client';
export * from './endpoints/types';
export * from './schema';
