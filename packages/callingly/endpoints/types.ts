import { z } from 'zod';
import {
	CallinglyCall,
	CallinglyClient,
	CallinglyLead,
	CallinglySchedule,
	CallinglyScheduleDay,
	CallinglyTeam,
	CallinglyTeamUser,
	CallinglyUser,
	CallinglyWebhookConfig,
} from '../schema/database';

const AccountId = z.union([z.string(), z.number()]).optional();
const ResourceId = z.union([z.string(), z.number()]);

export const DeleteResponseSchema = z
	.object({
		success: z.boolean().optional(),
		message: z.string().optional(),
	})
	.passthrough();

export type DeleteResponse = z.infer<typeof DeleteResponseSchema>;

export const GetLeadInputSchema = z.object({
	leadId: ResourceId,
	account_id: AccountId,
});

export const ListLeadsInputSchema = z.object({
	start: z.string().optional(),
	end: z.string().optional(),
	phone_number: z.string().optional(),
	account_id: AccountId,
});

export const UpdateLeadInputSchema = z.object({
	leadId: ResourceId,
	fname: z.string().optional(),
	lname: z.string().optional(),
	email: z.string().email().optional(),
	phone_number: z.string().optional(),
	source: z.string().optional(),
	company: z.string().optional(),
	status: z.string().optional(),
	result: z.string().nullable().optional(),
	// z.unknown() is used because Callingly documents stage as mixed JSON with no stable object shape.
	stage: z.unknown().nullable().optional(),
	is_stopped: z.number().optional(),
	is_blocked: z.number().optional(),
	account_id: AccountId,
});

export const DeleteLeadInputSchema = z.object({
	leadId: ResourceId,
	account_id: AccountId,
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

export type GetLeadInput = z.infer<typeof GetLeadInputSchema>;
export type ListLeadsInput = z.infer<typeof ListLeadsInputSchema>;
export type UpdateLeadInput = z.infer<typeof UpdateLeadInputSchema>;
export type DeleteLeadInput = z.infer<typeof DeleteLeadInputSchema>;
export type ListLeadsResponse = z.infer<typeof ListLeadsResponseSchema>;

export const CreateCallInputSchema = z.object({
	phone_number: z.string(),
	team_id: ResourceId,
	first_name: z.string().optional(),
	last_name: z.string().optional(),
	email: z.string().email().optional(),
	company: z.string().optional(),
	category: z.string().optional(),
	source: z.string().optional(),
	crm_id: ResourceId.optional(),
	scheduled_at: z.string().optional(),
	account_id: AccountId,
});

export const GetCallInputSchema = z.object({
	callId: ResourceId,
	account_id: AccountId,
});

export const ListCallsInputSchema = z.object({
	start: z.string().optional(),
	end: z.string().optional(),
	team_id: ResourceId.optional(),
	limit: z.number().optional(),
	page: z.number().optional(),
	account_id: AccountId,
});

export const ListCallsResponseSchema = z.union([
	z.array(CallinglyCall),
	z
		.object({
			calls: z.array(CallinglyCall),
			data: z.array(CallinglyCall).optional(),
			total: z.number().optional(),
			page: z.number().optional(),
		})
		.passthrough(),
	z
		.object({
			calls: z.array(CallinglyCall).optional(),
			data: z.array(CallinglyCall),
			total: z.number().optional(),
			page: z.number().optional(),
		})
		.passthrough(),
]);

export type CreateCallInput = z.infer<typeof CreateCallInputSchema>;
export type GetCallInput = z.infer<typeof GetCallInputSchema>;
export type ListCallsInput = z.infer<typeof ListCallsInputSchema>;
export type ListCallsResponse = z.infer<typeof ListCallsResponseSchema>;

export const CreateAgentInputSchema = z.object({
	fname: z.string(),
	lname: z.string(),
	phone_number: z.string(),
	ext: z.string().optional(),
	timezone: z.string().optional(),
	account_id: AccountId,
});

export const ListUsersInputSchema = z.object({
	account_id: AccountId,
});

export const UpdateAgentInputSchema = z.object({
	agentId: ResourceId,
	fname: z.string().optional(),
	lname: z.string().optional(),
	phone_number: z.string().optional(),
	ext: z.string().optional(),
	timezone: z.string().optional(),
	donotdisturb: z.number().optional(),
	donotdisturb_until: z.string().optional(),
	account_id: AccountId,
});

export const DeleteAgentInputSchema = z.object({
	agentId: ResourceId,
	account_id: AccountId,
});

export const GetAgentScheduleInputSchema = z.object({
	agentId: ResourceId,
	account_id: AccountId,
});

export const UpdateAgentScheduleInputSchema = z.object({
	agentId: ResourceId,
	days: z.array(CallinglyScheduleDay),
	account_id: AccountId,
});

export const GetAgentScheduleResponseSchema = z.union([
	CallinglySchedule,
	z.array(CallinglyScheduleDay),
]);

export const ListUsersResponseSchema = z.union([
	z.array(CallinglyUser),
	z
		.object({
			users: z.array(CallinglyUser),
			agents: z.array(CallinglyUser).optional(),
			total: z.number().optional(),
		})
		.passthrough(),
	z
		.object({
			users: z.array(CallinglyUser).optional(),
			agents: z.array(CallinglyUser),
			total: z.number().optional(),
		})
		.passthrough(),
]);

export type CreateAgentInput = z.infer<typeof CreateAgentInputSchema>;
export type ListUsersInput = z.infer<typeof ListUsersInputSchema>;
export type UpdateAgentInput = z.infer<typeof UpdateAgentInputSchema>;
export type DeleteAgentInput = z.infer<typeof DeleteAgentInputSchema>;
export type GetAgentScheduleInput = z.infer<typeof GetAgentScheduleInputSchema>;
export type UpdateAgentScheduleInput = z.infer<
	typeof UpdateAgentScheduleInputSchema
>;
export type GetAgentScheduleResponse = z.infer<
	typeof GetAgentScheduleResponseSchema
>;
export type ListUsersResponse = z.infer<typeof ListUsersResponseSchema>;

export const CreateTeamInputSchema = z.object({
	name: z.string(),
	is_record: z.number().optional(),
	call_mode: z.string().optional(),
	whispertext: z.string().optional(),
	language: z.string().optional(),
	delay: z.number().optional(),
	is_retry: z.number().optional(),
	retries: z.number().optional(),
	retry_schedule: z.array(z.number()).optional(),
	is_reschedule: z.number().optional(),
	is_retry_lead: z.number().optional(),
	lead_retries: z.number().optional(),
	lead_retry_schedule: z.array(z.number()).optional(),
	account_id: AccountId,
});

export const ListTeamsInputSchema = z.object({
	account_id: AccountId,
});

export const GetTeamInputSchema = z.object({
	teamId: ResourceId,
	account_id: AccountId,
});

export const ListTeamUsersInputSchema = z.object({
	teamId: ResourceId,
	account_id: AccountId,
});

export const UpdateTeamUsersInputSchema = z
	.object({
		teamId: ResourceId,
		agents: z.array(z.union([z.string(), z.number()])).optional(),
		user_ids: z.array(z.union([z.string(), z.number()])).optional(),
		account_id: AccountId,
	})
	.refine(
		(value) =>
			(value.agents?.length ?? 0) > 0 || (value.user_ids?.length ?? 0) > 0,
		{
			message: 'agents is required',
		},
	);

export const UpdateTeamAgentSettingsInputSchema = z.object({
	teamId: ResourceId,
	agentId: ResourceId,
	priority: z.number().optional(),
	cap: z.number().nullable().optional(),
	account_id: AccountId,
});

export const RemoveTeamAgentInputSchema = z.object({
	teamId: ResourceId,
	agentId: ResourceId,
	account_id: AccountId,
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
			agents: z.array(CallinglyTeamUser),
			users: z.array(CallinglyTeamUser).optional(),
		})
		.passthrough(),
	z
		.object({
			agents: z.array(CallinglyTeamUser).optional(),
			users: z.array(CallinglyTeamUser),
		})
		.passthrough(),
]);

export const UpdateTeamUsersResponseSchema = z.union([
	CallinglyTeam,
	DeleteResponseSchema,
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

export const ListClientsInputSchema = z.object({});

export const CreateClientInputSchema = z.object({
	fname: z.string(),
	lname: z.string(),
	company: z.string(),
	email: z.string().email(),
	phone_number: z.string(),
	password: z.string(),
});

export const DeleteClientInputSchema = z.object({
	clientId: ResourceId,
});

export const SetClientActiveInputSchema = z
	.object({
		clientId: ResourceId,
		is_active: z.union([z.literal(0), z.literal(1)]).optional(),
		active: z.boolean().optional(),
	})
	.refine(
		(value) => value.is_active !== undefined || value.active !== undefined,
		{
			message: 'is_active is required',
		},
	);

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
export type CreateClientInput = z.infer<typeof CreateClientInputSchema>;
export type DeleteClientInput = z.infer<typeof DeleteClientInputSchema>;
export type SetClientActiveInput = z.infer<typeof SetClientActiveInputSchema>;
export type ListClientsResponse = z.infer<typeof ListClientsResponseSchema>;

export const ListWebhooksInputSchema = z.object({
	account_id: AccountId,
});

export const GetWebhookInputSchema = z.object({
	webhookId: ResourceId,
	account_id: AccountId,
});

export const CreateWebhookInputSchema = z.object({
	name: z.string(),
	event: z.string(),
	target_url: z.string(),
	call_direction: z.string().nullable().optional(),
	call_status: z.string().nullable().optional(),
	call_lead_status: z.string().nullable().optional(),
	team_id: ResourceId.optional(),
	number_id: ResourceId.optional(),
	field: z.string().nullable().optional(),
	filter: z.string().nullable().optional(),
	account_id: AccountId,
});

export const UpdateWebhookInputSchema = z.object({
	webhookId: ResourceId,
	name: z.string().optional(),
	event: z.string().optional(),
	target_url: z.string().optional(),
	call_direction: z.string().nullable().optional(),
	call_status: z.string().nullable().optional(),
	call_lead_status: z.string().nullable().optional(),
	team_id: ResourceId.optional(),
	number_id: ResourceId.optional(),
	field: z.string().nullable().optional(),
	filter: z.string().nullable().optional(),
	account_id: AccountId,
});

export const DeleteWebhookInputSchema = z.object({
	webhookId: ResourceId,
	account_id: AccountId,
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

export type CallinglyEndpointInputs = {
	getLead: GetLeadInput;
	listLeads: ListLeadsInput;
	updateLead: UpdateLeadInput;
	deleteLead: DeleteLeadInput;

	createCall: CreateCallInput;
	getCall: GetCallInput;
	listCalls: ListCallsInput;

	createAgent: CreateAgentInput;
	listUsers: ListUsersInput;
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
	getLead: CallinglyLead;
	listLeads: ListLeadsResponse;
	updateLead: CallinglyLead;
	deleteLead: DeleteResponse;

	createCall: CallinglyCall;
	getCall: CallinglyCall;
	listCalls: ListCallsResponse;

	createAgent: CallinglyUser;
	listUsers: ListUsersResponse;
	updateAgent: CallinglyUser;
	deleteAgent: DeleteResponse;
	getAgentSchedule: GetAgentScheduleResponse;
	updateAgentSchedule: GetAgentScheduleResponse;

	createTeam: CallinglyTeam;
	listTeams: ListTeamsResponse;
	getTeam: CallinglyTeam;
	listTeamUsers: ListTeamUsersResponse;
	updateTeamUsers: z.infer<typeof UpdateTeamUsersResponseSchema>;
	updateTeamAgentSettings: CallinglyTeamUser;
	removeTeamAgent: DeleteResponse;

	listClients: ListClientsResponse;
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
	getLead: GetLeadInputSchema,
	listLeads: ListLeadsInputSchema,
	updateLead: UpdateLeadInputSchema,
	deleteLead: DeleteLeadInputSchema,

	createCall: CreateCallInputSchema,
	getCall: GetCallInputSchema,
	listCalls: ListCallsInputSchema,

	createAgent: CreateAgentInputSchema,
	listUsers: ListUsersInputSchema,
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
	getLead: CallinglyLead,
	listLeads: ListLeadsResponseSchema,
	updateLead: CallinglyLead,
	deleteLead: DeleteResponseSchema,

	createCall: CallinglyCall,
	getCall: CallinglyCall,
	listCalls: ListCallsResponseSchema,

	createAgent: CallinglyUser,
	listUsers: ListUsersResponseSchema,
	updateAgent: CallinglyUser,
	deleteAgent: DeleteResponseSchema,
	getAgentSchedule: GetAgentScheduleResponseSchema,
	updateAgentSchedule: GetAgentScheduleResponseSchema,

	createTeam: CallinglyTeam,
	listTeams: ListTeamsResponseSchema,
	getTeam: CallinglyTeam,
	listTeamUsers: ListTeamUsersResponseSchema,
	updateTeamUsers: UpdateTeamUsersResponseSchema,
	updateTeamAgentSettings: CallinglyTeamUser,
	removeTeamAgent: DeleteResponseSchema,

	listClients: ListClientsResponseSchema,
	createClient: CallinglyClient,
	deleteClient: DeleteResponseSchema,
	setClientActive: CallinglyClient,

	listWebhooks: ListWebhooksResponseSchema,
	getWebhook: CallinglyWebhookConfig,
	createWebhook: CallinglyWebhookConfig,
	updateWebhook: CallinglyWebhookConfig,
	deleteWebhook: DeleteResponseSchema,
} as const;
