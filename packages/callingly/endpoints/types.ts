import { z } from 'zod';
import {
	CallinglyCall,
	CallinglyCallDirection,
	CallinglyClient,
	CallinglyLead,
	CallinglyScheduleDay,
	CallinglyTeam,
	CallinglyTeamUser,
	CallinglyUser,
	CallinglyWebhookCallLeadStatus,
	CallinglyWebhookCallStatus,
	CallinglyWebhookConfig,
	CallinglyWebhookEvent,
	CallinglyWebhookLeadField,
} from '../schema/database';

const ResourceId = z.union([z.string(), z.number()]);

/**
 * Agency partners act on a client account by passing its `account_id`.
 * https://help.callingly.com/article/38-api
 */
const AccountId = ResourceId.optional();

/**
 * DELETE /v1/leads/{id} returns `{ success: true }` and
 * DELETE /v1/webhooks/{id} returns `{ message: "Webhook deleted." }`.
 */
export const AckResponseSchema = z.object({
	success: z.boolean().optional(),
	message: z.string().optional(),
});

export type AckResponse = z.infer<typeof AckResponseSchema>;

// Leads

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
	stage: z.string().nullable().optional(),
	is_stopped: z.union([z.literal(0), z.literal(1)]).optional(),
	is_blocked: z.union([z.literal(0), z.literal(1)]).optional(),
	account_id: AccountId,
});

export const DeleteLeadInputSchema = z.object({
	leadId: ResourceId,
	account_id: AccountId,
});

export const ListLeadsResponseSchema = z.array(CallinglyLead);

export type GetLeadInput = z.infer<typeof GetLeadInputSchema>;
export type ListLeadsInput = z.infer<typeof ListLeadsInputSchema>;
export type UpdateLeadInput = z.infer<typeof UpdateLeadInputSchema>;
export type DeleteLeadInput = z.infer<typeof DeleteLeadInputSchema>;
export type ListLeadsResponse = z.infer<typeof ListLeadsResponseSchema>;

// Calls

export const CreateCallInputSchema = z.object({
	team_id: ResourceId,
	phone_number: z.string(),
	first_name: z.string().optional(),
	last_name: z.string().optional(),
	email: z.string().email().optional(),
	company: z.string().optional(),
	category: z.string().optional(),
	source: z.string().optional(),
	crm_id: ResourceId.optional(),
	scheduled_at: z
		.string()
		.optional()
		.describe('Schedule the call instead of dialing now (YYYY-MM-DD HH:MM:SS)'),
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
	limit: z.number().int().positive().optional(),
	page: z.number().int().positive().optional(),
	account_id: AccountId,
});

export const ListCallsResponseSchema = z.object({
	data: z.array(CallinglyCall),
});

/**
 * The docs give no response sample for POST /v1/calls. It is read as a call
 * record, with `call_id` accepted in place of `id` so a dialed call never
 * fails to parse after the phone has already rung.
 */
export const CreateCallResponseSchema = CallinglyCall.extend({
	id: ResourceId.optional(),
	call_id: ResourceId.optional(),
});

export type CreateCallInput = z.infer<typeof CreateCallInputSchema>;
export type CreateCallResponse = z.infer<typeof CreateCallResponseSchema>;
export type GetCallInput = z.infer<typeof GetCallInputSchema>;
export type ListCallsInput = z.infer<typeof ListCallsInputSchema>;
export type ListCallsResponse = z.infer<typeof ListCallsResponseSchema>;

// Agents

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
	donotdisturb: z.union([z.literal(0), z.literal(1)]).optional(),
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
	days: z.array(CallinglyScheduleDay).min(1),
	account_id: AccountId,
});

export const AgentScheduleResponseSchema = z.array(CallinglyScheduleDay);
export const ListUsersResponseSchema = z.object({
	data: z.array(CallinglyUser),
	count: z.number().optional(),
});

export type CreateAgentInput = z.infer<typeof CreateAgentInputSchema>;
export type ListUsersInput = z.infer<typeof ListUsersInputSchema>;
export type UpdateAgentInput = z.infer<typeof UpdateAgentInputSchema>;
export type DeleteAgentInput = z.infer<typeof DeleteAgentInputSchema>;
export type GetAgentScheduleInput = z.infer<typeof GetAgentScheduleInputSchema>;
export type UpdateAgentScheduleInput = z.infer<
	typeof UpdateAgentScheduleInputSchema
>;
export type AgentScheduleResponse = z.infer<typeof AgentScheduleResponseSchema>;
export type ListUsersResponse = z.infer<typeof ListUsersResponseSchema>;

// Teams

export const CreateTeamInputSchema = z.object({
	name: z.string(),
	is_record: z.union([z.literal(0), z.literal(1)]).optional(),
	call_mode: z.string().optional(),
	whispertext: z.string().optional(),
	language: z.string().optional(),
	delay: z.number().optional(),
	is_retry: z.union([z.literal(0), z.literal(1)]).optional(),
	retries: z.number().int().optional(),
	retry_schedule: z.array(z.number()).optional(),
	is_reschedule: z.union([z.literal(0), z.literal(1)]).optional(),
	is_retry_lead: z.union([z.literal(0), z.literal(1)]).optional(),
	lead_retries: z.number().int().optional(),
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

export const UpdateTeamUsersInputSchema = z.object({
	teamId: ResourceId,
	agents: z
		.array(ResourceId)
		.min(1)
		.describe('Agent ids that replace every current team assignment'),
	account_id: AccountId,
});

export const UpdateTeamAgentSettingsInputSchema = z.object({
	teamId: ResourceId,
	agentId: ResourceId,
	priority: z.number().int().optional(),
	cap: z.number().int().nullable().optional(),
	account_id: AccountId,
});

export const RemoveTeamAgentInputSchema = z.object({
	teamId: ResourceId,
	agentId: ResourceId,
	account_id: AccountId,
});

export const ListTeamsResponseSchema = z.object({
	data: z.array(CallinglyTeam),
});

export const ListTeamUsersResponseSchema = z.object({
	agents: z.array(CallinglyTeamUser),
});

/**
 * The docs only give the request body for PUT /v1/teams/{id}/agents,
 * so the response is either the new roster or a plain acknowledgement.
 */
export const UpdateTeamUsersResponseSchema = z.union([
	ListTeamUsersResponseSchema,
	AckResponseSchema,
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
export type UpdateTeamUsersResponse = z.infer<
	typeof UpdateTeamUsersResponseSchema
>;

// Clients (agency accounts)

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

export const SetClientActiveInputSchema = z.object({
	clientId: ResourceId,
	is_active: z
		.union([z.literal(0), z.literal(1)])
		.describe('1 activates calling for the client, 0 deactivates it'),
});

export const ListClientsResponseSchema = z.object({
	data: z.array(CallinglyClient),
});

export type ListClientsInput = z.infer<typeof ListClientsInputSchema>;
export type CreateClientInput = z.infer<typeof CreateClientInputSchema>;
export type DeleteClientInput = z.infer<typeof DeleteClientInputSchema>;
export type SetClientActiveInput = z.infer<typeof SetClientActiveInputSchema>;
export type ListClientsResponse = z.infer<typeof ListClientsResponseSchema>;

// Webhooks (outbound event subscriptions managed through the REST API)

const WebhookFilterFields = {
	call_direction: CallinglyCallDirection.nullable()
		.optional()
		.describe('call_completed only'),
	call_status: CallinglyWebhookCallStatus.nullable()
		.optional()
		.describe('call_completed only'),
	call_lead_status: CallinglyWebhookCallLeadStatus.nullable()
		.optional()
		.describe('call_completed only'),
	team_id: ResourceId.nullable()
		.optional()
		.describe('Outbound call_completed only'),
	number_id: ResourceId.nullable()
		.optional()
		.describe('Inbound call_completed only'),
	field: CallinglyWebhookLeadField.nullable()
		.optional()
		.describe(
			'lead_created / lead_updated only: trigger when this field changes',
		),
	filter: z
		.string()
		.nullable()
		.optional()
		.describe('lead_created / lead_updated only: required value of `field`'),
};

export const ListWebhooksInputSchema = z.object({
	account_id: AccountId,
});

export const GetWebhookInputSchema = z.object({
	webhookId: ResourceId,
	account_id: AccountId,
});

export const CreateWebhookInputSchema = z.object({
	name: z.string(),
	event: CallinglyWebhookEvent,
	target_url: z.string().url(),
	...WebhookFilterFields,
	account_id: AccountId,
});

export const UpdateWebhookInputSchema = z.object({
	webhookId: ResourceId,
	name: z.string().optional(),
	event: CallinglyWebhookEvent.optional(),
	target_url: z.string().url().optional(),
	...WebhookFilterFields,
	account_id: AccountId,
});

export const DeleteWebhookInputSchema = z.object({
	webhookId: ResourceId,
	account_id: AccountId,
});

export const ListWebhooksResponseSchema = z.array(CallinglyWebhookConfig);

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
	deleteLead: AckResponse;

	createCall: CreateCallResponse;
	getCall: CallinglyCall;
	listCalls: ListCallsResponse;

	createAgent: CallinglyUser;
	listUsers: ListUsersResponse;
	updateAgent: CallinglyUser;
	deleteAgent: AckResponse;
	getAgentSchedule: AgentScheduleResponse;
	updateAgentSchedule: AgentScheduleResponse;

	createTeam: CallinglyTeam;
	listTeams: ListTeamsResponse;
	getTeam: CallinglyTeam;
	listTeamUsers: ListTeamUsersResponse;
	updateTeamUsers: UpdateTeamUsersResponse;
	updateTeamAgentSettings: CallinglyTeamUser;
	removeTeamAgent: AckResponse;

	listClients: ListClientsResponse;
	createClient: CallinglyClient;
	deleteClient: AckResponse;
	setClientActive: AckResponse;

	listWebhooks: ListWebhooksResponse;
	getWebhook: CallinglyWebhookConfig;
	createWebhook: CallinglyWebhookConfig;
	updateWebhook: CallinglyWebhookConfig;
	deleteWebhook: AckResponse;
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
	deleteLead: AckResponseSchema,

	createCall: CreateCallResponseSchema,
	getCall: CallinglyCall,
	listCalls: ListCallsResponseSchema,

	createAgent: CallinglyUser,
	listUsers: ListUsersResponseSchema,
	updateAgent: CallinglyUser,
	deleteAgent: AckResponseSchema,
	getAgentSchedule: AgentScheduleResponseSchema,
	updateAgentSchedule: AgentScheduleResponseSchema,

	createTeam: CallinglyTeam,
	listTeams: ListTeamsResponseSchema,
	getTeam: CallinglyTeam,
	listTeamUsers: ListTeamUsersResponseSchema,
	updateTeamUsers: UpdateTeamUsersResponseSchema,
	updateTeamAgentSettings: CallinglyTeamUser,
	removeTeamAgent: AckResponseSchema,

	listClients: ListClientsResponseSchema,
	createClient: CallinglyClient,
	deleteClient: AckResponseSchema,
	setClientActive: AckResponseSchema,

	listWebhooks: ListWebhooksResponseSchema,
	getWebhook: CallinglyWebhookConfig,
	createWebhook: CallinglyWebhookConfig,
	updateWebhook: CallinglyWebhookConfig,
	deleteWebhook: AckResponseSchema,
} as const;
