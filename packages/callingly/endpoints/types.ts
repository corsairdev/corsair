import { z } from 'zod';
import {
	CallinglyCall,
	CallinglyClient,
	CallinglyLead,
	CallinglySchedule,
	CallinglyTeam,
	CallinglyTeamUser,
	CallinglyUser,
	CallinglyWebhookConfig,
} from '../schema/database';

// ---------------------------------------------------------------------------
// Common Response Schemas
// ---------------------------------------------------------------------------

export const DeleteResponseSchema = z
	.object({
		success: z.boolean().optional(),
		message: z.string().optional(),
	})
	.passthrough();

export type DeleteResponse = z.infer<typeof DeleteResponseSchema>;

// ---------------------------------------------------------------------------
// Lead Input & Output Schemas
// ---------------------------------------------------------------------------

export const CreateLeadInputSchema = z.object({
	phone_number: z.string().optional(),
	phone: z.string().optional(),
	name: z.string().optional(),
	first_name: z.string().optional(),
	last_name: z.string().optional(),
	email: z.string().email().optional(),
	team_id: z.union([z.string(), z.number()]).optional(),
	user_id: z.union([z.string(), z.number()]).optional(),
	agent_id: z.union([z.string(), z.number()]).optional(),
	scheduled_at: z.string().optional(),
	notes: z.string().optional(),
	tags: z.array(z.string()).optional(),
	custom_fields: z.record(z.string(), z.unknown()).optional(),
	account_id: z.string().optional(),
});

export const GetLeadInputSchema = z.object({
	leadId: z.union([z.string(), z.number()]),
	account_id: z.string().optional(),
});

export const ListLeadsInputSchema = z.object({
	start: z.string().optional(),
	end: z.string().optional(),
	phone_number: z.string().optional(),
	limit: z.number().optional(),
	page: z.number().optional(),
	account_id: z.string().optional(),
});

export const UpdateLeadInputSchema = z.object({
	leadId: z.union([z.string(), z.number()]),
	phone_number: z.string().optional(),
	phone: z.string().optional(),
	name: z.string().optional(),
	first_name: z.string().optional(),
	last_name: z.string().optional(),
	email: z.string().email().optional(),
	notes: z.string().optional(),
	tags: z.array(z.string()).optional(),
	custom_fields: z.record(z.string(), z.unknown()).optional(),
	account_id: z.string().optional(),
});

export const DeleteLeadInputSchema = z.object({
	leadId: z.union([z.string(), z.number()]),
	account_id: z.string().optional(),
});

export const ListLeadsResponseSchema = z.union([
	z.array(CallinglyLead),
	z
		.object({
			leads: z.array(CallinglyLead),
			total: z.number().optional(),
			page: z.number().optional(),
		})
		.passthrough(),
]);

export type CreateLeadInput = z.infer<typeof CreateLeadInputSchema>;
export type GetLeadInput = z.infer<typeof GetLeadInputSchema>;
export type ListLeadsInput = z.infer<typeof ListLeadsInputSchema>;
export type UpdateLeadInput = z.infer<typeof UpdateLeadInputSchema>;
export type DeleteLeadInput = z.infer<typeof DeleteLeadInputSchema>;
export type ListLeadsResponse = z.infer<typeof ListLeadsResponseSchema>;

// ---------------------------------------------------------------------------
// Call Input & Output Schemas
// ---------------------------------------------------------------------------

export const CreateCallInputSchema = z.object({
	phone_number: z.string().optional(),
	lead_id: z.union([z.string(), z.number()]).optional(),
	team_id: z.union([z.string(), z.number()]).optional(),
	user_id: z.union([z.string(), z.number()]).optional(),
	scheduled_at: z.string().optional(),
	account_id: z.string().optional(),
});

export const GetCallInputSchema = z.object({
	callId: z.union([z.string(), z.number()]),
	account_id: z.string().optional(),
});

export const ListCallsInputSchema = z.object({
	start: z.string().optional(),
	end: z.string().optional(),
	team_id: z.union([z.string(), z.number()]).optional(),
	user_id: z.union([z.string(), z.number()]).optional(),
	status: z.string().optional(),
	limit: z.number().optional(),
	page: z.number().optional(),
	account_id: z.string().optional(),
});

export const ListCallsResponseSchema = z.union([
	z.array(CallinglyCall),
	z
		.object({
			calls: z.array(CallinglyCall),
			total: z.number().optional(),
			page: z.number().optional(),
		})
		.passthrough(),
]);

export type CreateCallInput = z.infer<typeof CreateCallInputSchema>;
export type GetCallInput = z.infer<typeof GetCallInputSchema>;
export type ListCallsInput = z.infer<typeof ListCallsInputSchema>;
export type ListCallsResponse = z.infer<typeof ListCallsResponseSchema>;

// ---------------------------------------------------------------------------
// Agent / User Input & Output Schemas
// ---------------------------------------------------------------------------

export const CreateAgentInputSchema = z.object({
	name: z.string().optional(),
	first_name: z.string().optional(),
	last_name: z.string().optional(),
	email: z.string().email().optional(),
	phone_number: z.string().optional(),
	role: z.string().optional(),
	account_id: z.string().optional(),
});

export const ListUsersInputSchema = z.object({
	limit: z.number().optional(),
	page: z.number().optional(),
	account_id: z.string().optional(),
});

export const GetUserInputSchema = z.object({
	userId: z.union([z.string(), z.number()]),
	account_id: z.string().optional(),
});

export const UpdateAgentInputSchema = z.object({
	agentId: z.union([z.string(), z.number()]),
	name: z.string().optional(),
	first_name: z.string().optional(),
	last_name: z.string().optional(),
	email: z.string().email().optional(),
	phone_number: z.string().optional(),
	role: z.string().optional(),
	active: z.boolean().optional(),
	account_id: z.string().optional(),
});

export const DeleteAgentInputSchema = z.object({
	agentId: z.union([z.string(), z.number()]),
	account_id: z.string().optional(),
});

export const GetAgentScheduleInputSchema = z.object({
	agentId: z.union([z.string(), z.number()]),
	account_id: z.string().optional(),
});

export const UpdateAgentScheduleInputSchema = z.object({
	agentId: z.union([z.string(), z.number()]),
	timezone: z.string().optional(),
	schedule: z.record(z.string(), z.unknown()).optional(),
	days: z.array(z.string()).optional(),
	account_id: z.string().optional(),
});

export const ListUsersResponseSchema = z.union([
	z.array(CallinglyUser),
	z
		.object({
			users: z.array(CallinglyUser),
			agents: z.array(CallinglyUser).optional(),
			total: z.number().optional(),
		})
		.passthrough(),
]);

export type CreateAgentInput = z.infer<typeof CreateAgentInputSchema>;
export type ListUsersInput = z.infer<typeof ListUsersInputSchema>;
export type GetUserInput = z.infer<typeof GetUserInputSchema>;
export type UpdateAgentInput = z.infer<typeof UpdateAgentInputSchema>;
export type DeleteAgentInput = z.infer<typeof DeleteAgentInputSchema>;
export type GetAgentScheduleInput = z.infer<typeof GetAgentScheduleInputSchema>;
export type UpdateAgentScheduleInput = z.infer<
	typeof UpdateAgentScheduleInputSchema
>;
export type ListUsersResponse = z.infer<typeof ListUsersResponseSchema>;

// ---------------------------------------------------------------------------
// Team Input & Output Schemas
// ---------------------------------------------------------------------------

export const CreateTeamInputSchema = z.object({
	name: z.string(),
	description: z.string().optional(),
	user_ids: z.array(z.union([z.string(), z.number()])).optional(),
	account_id: z.string().optional(),
});

export const ListTeamsInputSchema = z.object({
	limit: z.number().optional(),
	page: z.number().optional(),
	account_id: z.string().optional(),
});

export const GetTeamInputSchema = z.object({
	teamId: z.union([z.string(), z.number()]),
	account_id: z.string().optional(),
});

export const ListTeamUsersInputSchema = z.object({
	teamId: z.union([z.string(), z.number()]),
	account_id: z.string().optional(),
});

export const UpdateTeamUsersInputSchema = z.object({
	teamId: z.union([z.string(), z.number()]),
	user_ids: z.array(z.union([z.string(), z.number()])),
	account_id: z.string().optional(),
});

export const UpdateTeamAgentSettingsInputSchema = z.object({
	teamId: z.union([z.string(), z.number()]),
	agentId: z.union([z.string(), z.number()]),
	priority: z.number().optional(),
	call_cap: z.number().optional(),
	account_id: z.string().optional(),
});

export const RemoveTeamAgentInputSchema = z.object({
	teamId: z.union([z.string(), z.number()]),
	agentId: z.union([z.string(), z.number()]),
	account_id: z.string().optional(),
});

export const ListTeamsResponseSchema = z.union([
	z.array(CallinglyTeam),
	z
		.object({
			teams: z.array(CallinglyTeam),
			total: z.number().optional(),
		})
		.passthrough(),
]);

export const ListTeamUsersResponseSchema = z.union([
	z.array(CallinglyTeamUser),
	z
		.object({
			users: z.array(CallinglyTeamUser),
			agents: z.array(CallinglyTeamUser).optional(),
		})
		.passthrough(),
]);

export type CreateTeamInput = z.infer<typeof CreateTeamInputSchema>;
export type ListTeamsInput = z.infer<typeof ListTeamsInputSchema>;
export type GetTeamInput = z.infer<typeof GetTeamInputSchema>;
export type ListTeamUsersInput = z.infer<typeof ListTeamUsersInputSchema>;
export type UpdateTeamUsersInput = z.infer<typeof UpdateTeamUsersInputSchema>;
export type UpdateTeamAgentSettingsInput = z.infer<
	typeof UpdateTeamAgentSettingsInputSchema
>;
export type RemoveTeamAgentInput = z.infer<typeof RemoveTeamAgentInputSchema>;
export type ListTeamsResponse = z.infer<typeof ListTeamsResponseSchema>;
export type ListTeamUsersResponse = z.infer<typeof ListTeamUsersResponseSchema>;

// ---------------------------------------------------------------------------
// Client (Agency) Input & Output Schemas
// ---------------------------------------------------------------------------

export const ListClientsInputSchema = z.object({
	limit: z.number().optional(),
	page: z.number().optional(),
});

export const GetClientInputSchema = z.object({
	clientId: z.union([z.string(), z.number()]),
});

export const CreateClientInputSchema = z.object({
	name: z.string(),
	email: z.string().email().optional(),
	company: z.string().optional(),
});

export const DeleteClientInputSchema = z.object({
	clientId: z.union([z.string(), z.number()]),
});

export const SetClientActiveInputSchema = z.object({
	clientId: z.union([z.string(), z.number()]),
	active: z.boolean(),
});

export const ListClientsResponseSchema = z.union([
	z.array(CallinglyClient),
	z
		.object({
			clients: z.array(CallinglyClient),
			total: z.number().optional(),
		})
		.passthrough(),
]);

export type ListClientsInput = z.infer<typeof ListClientsInputSchema>;
export type GetClientInput = z.infer<typeof GetClientInputSchema>;
export type CreateClientInput = z.infer<typeof CreateClientInputSchema>;
export type DeleteClientInput = z.infer<typeof DeleteClientInputSchema>;
export type SetClientActiveInput = z.infer<typeof SetClientActiveInputSchema>;
export type ListClientsResponse = z.infer<typeof ListClientsResponseSchema>;

// ---------------------------------------------------------------------------
// Webhooks Config Input & Output Schemas
// ---------------------------------------------------------------------------

export const ListWebhooksInputSchema = z.object({
	limit: z.number().optional(),
	page: z.number().optional(),
	account_id: z.string().optional(),
});

export const GetWebhookInputSchema = z.object({
	webhookId: z.union([z.string(), z.number()]),
	account_id: z.string().optional(),
});

export const CreateWebhookInputSchema = z.object({
	url: z.string(),
	event: z.string().optional(),
	events: z.array(z.string()).optional(),
	call_status: z.string().optional(),
	call_lead_status: z.string().optional(),
	field: z.string().optional(),
	filter: z.string().optional(),
	account_id: z.string().optional(),
});

export const UpdateWebhookInputSchema = z.object({
	webhookId: z.union([z.string(), z.number()]),
	url: z.string().optional(),
	event: z.string().optional(),
	events: z.array(z.string()).optional(),
	call_status: z.string().optional(),
	call_lead_status: z.string().optional(),
	field: z.string().optional(),
	filter: z.string().optional(),
	active: z.boolean().optional(),
	account_id: z.string().optional(),
});

export const DeleteWebhookInputSchema = z.object({
	webhookId: z.union([z.string(), z.number()]),
	account_id: z.string().optional(),
});

export const ListWebhooksResponseSchema = z.union([
	z.array(CallinglyWebhookConfig),
	z
		.object({
			webhooks: z.array(CallinglyWebhookConfig),
			total: z.number().optional(),
		})
		.passthrough(),
]);

export type ListWebhooksInput = z.infer<typeof ListWebhooksInputSchema>;
export type GetWebhookInput = z.infer<typeof GetWebhookInputSchema>;
export type CreateWebhookInput = z.infer<typeof CreateWebhookInputSchema>;
export type UpdateWebhookInput = z.infer<typeof UpdateWebhookInputSchema>;
export type DeleteWebhookInput = z.infer<typeof DeleteWebhookInputSchema>;
export type ListWebhooksResponse = z.infer<typeof ListWebhooksResponseSchema>;

// ---------------------------------------------------------------------------
// Combined Endpoint Inputs & Outputs Map
// ---------------------------------------------------------------------------

export type CallinglyEndpointInputs = {
	createLead: CreateLeadInput;
	getLead: GetLeadInput;
	listLeads: ListLeadsInput;
	updateLead: UpdateLeadInput;
	deleteLead: DeleteLeadInput;

	createCall: CreateCallInput;
	getCall: GetCallInput;
	listCalls: ListCallsInput;

	createAgent: CreateAgentInput;
	listUsers: ListUsersInput;
	getUser: GetUserInput;
	updateAgent: UpdateAgentInput;
	deleteAgent: DeleteAgentInput;
	getAgentSchedule: GetAgentScheduleInput;
	updateAgentSchedule: UpdateAgentScheduleInput;

	createTeam: CreateTeamInput;
	listTeams: ListTeamsInput;
	getTeam: GetTeamInput;
	listTeamUsers: ListTeamUsersInput;
	updateTeamUsers: UpdateTeamUsersInput;
	updateTeamAgentSettings: UpdateTeamAgentSettingsInput;
	removeTeamAgent: RemoveTeamAgentInput;

	listClients: ListClientsInput;
	getClient: GetClientInput;
	createClient: CreateClientInput;
	deleteClient: DeleteClientInput;
	setClientActive: SetClientActiveInput;

	listWebhooks: ListWebhooksInput;
	getWebhook: GetWebhookInput;
	createWebhook: CreateWebhookInput;
	updateWebhook: UpdateWebhookInput;
	deleteWebhook: DeleteWebhookInput;
};

export type CallinglyEndpointOutputs = {
	createLead: CallinglyLead;
	getLead: CallinglyLead;
	listLeads: ListLeadsResponse;
	updateLead: CallinglyLead;
	deleteLead: DeleteResponse;

	createCall: CallinglyCall;
	getCall: CallinglyCall;
	listCalls: ListCallsResponse;

	createAgent: CallinglyUser;
	listUsers: ListUsersResponse;
	getUser: CallinglyUser;
	updateAgent: CallinglyUser;
	deleteAgent: DeleteResponse;
	getAgentSchedule: CallinglySchedule;
	updateAgentSchedule: CallinglySchedule;

	createTeam: CallinglyTeam;
	listTeams: ListTeamsResponse;
	getTeam: CallinglyTeam;
	listTeamUsers: ListTeamUsersResponse;
	updateTeamUsers: CallinglyTeam;
	updateTeamAgentSettings: CallinglyTeamUser;
	removeTeamAgent: DeleteResponse;

	listClients: ListClientsResponse;
	getClient: CallinglyClient;
	createClient: CallinglyClient;
	deleteClient: DeleteResponse;
	setClientActive: CallinglyClient;

	listWebhooks: ListWebhooksResponse;
	getWebhook: CallinglyWebhookConfig;
	createWebhook: CallinglyWebhookConfig;
	updateWebhook: CallinglyWebhookConfig;
	deleteWebhook: DeleteResponse;
};

export const CallinglyEndpointInputSchemas = {
	createLead: CreateLeadInputSchema,
	getLead: GetLeadInputSchema,
	listLeads: ListLeadsInputSchema,
	updateLead: UpdateLeadInputSchema,
	deleteLead: DeleteLeadInputSchema,

	createCall: CreateCallInputSchema,
	getCall: GetCallInputSchema,
	listCalls: ListCallsInputSchema,

	createAgent: CreateAgentInputSchema,
	listUsers: ListUsersInputSchema,
	getUser: GetUserInputSchema,
	updateAgent: UpdateAgentInputSchema,
	deleteAgent: DeleteAgentInputSchema,
	getAgentSchedule: GetAgentScheduleInputSchema,
	updateAgentSchedule: UpdateAgentScheduleInputSchema,

	createTeam: CreateTeamInputSchema,
	listTeams: ListTeamsInputSchema,
	getTeam: GetTeamInputSchema,
	listTeamUsers: ListTeamUsersInputSchema,
	updateTeamUsers: UpdateTeamUsersInputSchema,
	updateTeamAgentSettings: UpdateTeamAgentSettingsInputSchema,
	removeTeamAgent: RemoveTeamAgentInputSchema,

	listClients: ListClientsInputSchema,
	getClient: GetClientInputSchema,
	createClient: CreateClientInputSchema,
	deleteClient: DeleteClientInputSchema,
	setClientActive: SetClientActiveInputSchema,

	listWebhooks: ListWebhooksInputSchema,
	getWebhook: GetWebhookInputSchema,
	createWebhook: CreateWebhookInputSchema,
	updateWebhook: UpdateWebhookInputSchema,
	deleteWebhook: DeleteWebhookInputSchema,
} as const;

export const CallinglyEndpointOutputSchemas = {
	createLead: CallinglyLead,
	getLead: CallinglyLead,
	listLeads: ListLeadsResponseSchema,
	updateLead: CallinglyLead,
	deleteLead: DeleteResponseSchema,

	createCall: CallinglyCall,
	getCall: CallinglyCall,
	listCalls: ListCallsResponseSchema,

	createAgent: CallinglyUser,
	listUsers: ListUsersResponseSchema,
	getUser: CallinglyUser,
	updateAgent: CallinglyUser,
	deleteAgent: DeleteResponseSchema,
	getAgentSchedule: CallinglySchedule,
	updateAgentSchedule: CallinglySchedule,

	createTeam: CallinglyTeam,
	listTeams: ListTeamsResponseSchema,
	getTeam: CallinglyTeam,
	listTeamUsers: ListTeamUsersResponseSchema,
	updateTeamUsers: CallinglyTeam,
	updateTeamAgentSettings: CallinglyTeamUser,
	removeTeamAgent: DeleteResponseSchema,

	listClients: ListClientsResponseSchema,
	getClient: CallinglyClient,
	createClient: CallinglyClient,
	deleteClient: DeleteResponseSchema,
	setClientActive: CallinglyClient,

	listWebhooks: ListWebhooksResponseSchema,
	getWebhook: CallinglyWebhookConfig,
	createWebhook: CallinglyWebhookConfig,
	updateWebhook: CallinglyWebhookConfig,
	deleteWebhook: DeleteResponseSchema,
} as const;
