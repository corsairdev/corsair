import { logEventFromContext } from 'corsair/core';
import type { CallinglyEndpoints } from '..';
import { makeCallinglyRequest } from '../client';
import { CallinglyEndpointOutputSchemas as Out } from './types';

// ===========================================================================
// Leads Handlers
// ===========================================================================

export const createLead: CallinglyEndpoints['createLead'] = async (
	ctx,
	input,
) => {
	const { account_id, ...body } = input;
	const response = Out.createLead.parse(
		await makeCallinglyRequest('leads', ctx.key, {
			method: 'POST',
			body,
			accountId: account_id,
		}),
	);
	await logEventFromContext(
		ctx,
		'callingly.leads.create',
		{ id: response.id },
		'completed',
	);
	return response;
};

export const getLead: CallinglyEndpoints['getLead'] = async (ctx, input) => {
	const { leadId, account_id } = input;
	const response = Out.getLead.parse(
		await makeCallinglyRequest(
			`leads/${encodeURIComponent(String(leadId))}`,
			ctx.key,
			{
				method: 'GET',
				accountId: account_id,
			},
		),
	);
	await logEventFromContext(
		ctx,
		'callingly.leads.get',
		{ leadId },
		'completed',
	);
	return response;
};

export const listLeads: CallinglyEndpoints['listLeads'] = async (
	ctx,
	input,
) => {
	const { account_id, ...query } = input;
	const response = Out.listLeads.parse(
		await makeCallinglyRequest('leads', ctx.key, {
			method: 'GET',
			query,
			accountId: account_id,
		}),
	);
	await logEventFromContext(
		ctx,
		'callingly.leads.list',
		{ ...query },
		'completed',
	);
	return response;
};

export const updateLead: CallinglyEndpoints['updateLead'] = async (
	ctx,
	input,
) => {
	const { leadId, account_id, ...body } = input;
	const response = Out.updateLead.parse(
		await makeCallinglyRequest(
			`leads/${encodeURIComponent(String(leadId))}`,
			ctx.key,
			{
				method: 'PUT',
				body,
				accountId: account_id,
			},
		),
	);
	await logEventFromContext(
		ctx,
		'callingly.leads.update',
		{ leadId },
		'completed',
	);
	return response;
};

export const deleteLead: CallinglyEndpoints['deleteLead'] = async (
	ctx,
	input,
) => {
	const { leadId, account_id } = input;
	const raw = await makeCallinglyRequest(
		`leads/${encodeURIComponent(String(leadId))}`,
		ctx.key,
		{
			method: 'DELETE',
			accountId: account_id,
		},
	);
	const response = Out.deleteLead.parse(raw ?? { success: true });
	await logEventFromContext(
		ctx,
		'callingly.leads.delete',
		{ leadId },
		'completed',
	);
	return response;
};

// ===========================================================================
// Calls Handlers
// ===========================================================================

export const createCall: CallinglyEndpoints['createCall'] = async (
	ctx,
	input,
) => {
	const { account_id, ...body } = input;
	const response = Out.createCall.parse(
		await makeCallinglyRequest('calls', ctx.key, {
			method: 'POST',
			body,
			accountId: account_id,
		}),
	);
	await logEventFromContext(
		ctx,
		'callingly.calls.create',
		{ id: response.id },
		'completed',
	);
	return response;
};

export const getCall: CallinglyEndpoints['getCall'] = async (ctx, input) => {
	const { callId, account_id } = input;
	const response = Out.getCall.parse(
		await makeCallinglyRequest(
			`calls/${encodeURIComponent(String(callId))}`,
			ctx.key,
			{
				method: 'GET',
				accountId: account_id,
			},
		),
	);
	await logEventFromContext(
		ctx,
		'callingly.calls.get',
		{ callId },
		'completed',
	);
	return response;
};

export const listCalls: CallinglyEndpoints['listCalls'] = async (
	ctx,
	input,
) => {
	const { account_id, ...query } = input;
	const response = Out.listCalls.parse(
		await makeCallinglyRequest('calls', ctx.key, {
			method: 'GET',
			query,
			accountId: account_id,
		}),
	);
	await logEventFromContext(
		ctx,
		'callingly.calls.list',
		{ ...query },
		'completed',
	);
	return response;
};

// ===========================================================================
// Agents / Users Handlers
// ===========================================================================

export const createAgent: CallinglyEndpoints['createAgent'] = async (
	ctx,
	input,
) => {
	const { account_id, ...body } = input;
	const response = Out.createAgent.parse(
		await makeCallinglyRequest('agents', ctx.key, {
			method: 'POST',
			body,
			accountId: account_id,
		}),
	);
	await logEventFromContext(
		ctx,
		'callingly.agents.create',
		{ id: response.id },
		'completed',
	);
	return response;
};

export const listUsers: CallinglyEndpoints['listUsers'] = async (
	ctx,
	input,
) => {
	const { account_id, ...query } = input;
	const response = Out.listUsers.parse(
		await makeCallinglyRequest('users', ctx.key, {
			method: 'GET',
			query,
			accountId: account_id,
		}),
	);
	await logEventFromContext(
		ctx,
		'callingly.users.list',
		{ ...query },
		'completed',
	);
	return response;
};

export const getUser: CallinglyEndpoints['getUser'] = async (ctx, input) => {
	const { userId, account_id } = input;
	const response = Out.getUser.parse(
		await makeCallinglyRequest(
			`users/${encodeURIComponent(String(userId))}`,
			ctx.key,
			{
				method: 'GET',
				accountId: account_id,
			},
		),
	);
	await logEventFromContext(
		ctx,
		'callingly.users.get',
		{ userId },
		'completed',
	);
	return response;
};

export const updateAgent: CallinglyEndpoints['updateAgent'] = async (
	ctx,
	input,
) => {
	const { agentId, account_id, ...body } = input;
	const response = Out.updateAgent.parse(
		await makeCallinglyRequest(
			`agents/${encodeURIComponent(String(agentId))}`,
			ctx.key,
			{
				method: 'PUT',
				body,
				accountId: account_id,
			},
		),
	);
	await logEventFromContext(
		ctx,
		'callingly.agents.update',
		{ agentId },
		'completed',
	);
	return response;
};

export const deleteAgent: CallinglyEndpoints['deleteAgent'] = async (
	ctx,
	input,
) => {
	const { agentId, account_id } = input;
	const raw = await makeCallinglyRequest(
		`agents/${encodeURIComponent(String(agentId))}`,
		ctx.key,
		{
			method: 'DELETE',
			accountId: account_id,
		},
	);
	const response = Out.deleteAgent.parse(raw ?? { success: true });
	await logEventFromContext(
		ctx,
		'callingly.agents.delete',
		{ agentId },
		'completed',
	);
	return response;
};

export const getAgentSchedule: CallinglyEndpoints['getAgentSchedule'] = async (
	ctx,
	input,
) => {
	const { agentId, account_id } = input;
	const response = Out.getAgentSchedule.parse(
		await makeCallinglyRequest(
			`agents/${encodeURIComponent(String(agentId))}/schedule`,
			ctx.key,
			{
				method: 'GET',
				accountId: account_id,
			},
		),
	);
	await logEventFromContext(
		ctx,
		'callingly.agents.getSchedule',
		{ agentId },
		'completed',
	);
	return response;
};

export const updateAgentSchedule: CallinglyEndpoints['updateAgentSchedule'] =
	async (ctx, input) => {
		const { agentId, account_id, ...body } = input;
		const response = Out.updateAgentSchedule.parse(
			await makeCallinglyRequest(
				`agents/${encodeURIComponent(String(agentId))}/schedule`,
				ctx.key,
				{
					method: 'PUT',
					body,
					accountId: account_id,
				},
			),
		);
		await logEventFromContext(
			ctx,
			'callingly.agents.updateSchedule',
			{ agentId },
			'completed',
		);
		return response;
	};

// ===========================================================================
// Teams Handlers
// ===========================================================================

export const createTeam: CallinglyEndpoints['createTeam'] = async (
	ctx,
	input,
) => {
	const { account_id, ...body } = input;
	const response = Out.createTeam.parse(
		await makeCallinglyRequest('teams', ctx.key, {
			method: 'POST',
			body,
			accountId: account_id,
		}),
	);
	await logEventFromContext(
		ctx,
		'callingly.teams.create',
		{ id: response.id },
		'completed',
	);
	return response;
};

export const listTeams: CallinglyEndpoints['listTeams'] = async (
	ctx,
	input,
) => {
	const { account_id, ...query } = input;
	const response = Out.listTeams.parse(
		await makeCallinglyRequest('teams', ctx.key, {
			method: 'GET',
			query,
			accountId: account_id,
		}),
	);
	await logEventFromContext(
		ctx,
		'callingly.teams.list',
		{ ...query },
		'completed',
	);
	return response;
};

export const getTeam: CallinglyEndpoints['getTeam'] = async (ctx, input) => {
	const { teamId, account_id } = input;
	const response = Out.getTeam.parse(
		await makeCallinglyRequest(
			`teams/${encodeURIComponent(String(teamId))}`,
			ctx.key,
			{
				method: 'GET',
				accountId: account_id,
			},
		),
	);
	await logEventFromContext(
		ctx,
		'callingly.teams.get',
		{ teamId },
		'completed',
	);
	return response;
};

export const listTeamUsers: CallinglyEndpoints['listTeamUsers'] = async (
	ctx,
	input,
) => {
	const { teamId, account_id } = input;
	const response = Out.listTeamUsers.parse(
		await makeCallinglyRequest(
			`teams/${encodeURIComponent(String(teamId))}/users`,
			ctx.key,
			{
				method: 'GET',
				accountId: account_id,
			},
		),
	);
	await logEventFromContext(
		ctx,
		'callingly.teams.listUsers',
		{ teamId },
		'completed',
	);
	return response;
};

export const updateTeamUsers: CallinglyEndpoints['updateTeamUsers'] = async (
	ctx,
	input,
) => {
	const { teamId, account_id, ...body } = input;
	const response = Out.updateTeamUsers.parse(
		await makeCallinglyRequest(
			`teams/${encodeURIComponent(String(teamId))}/users`,
			ctx.key,
			{
				method: 'PUT',
				body,
				accountId: account_id,
			},
		),
	);
	await logEventFromContext(
		ctx,
		'callingly.teams.updateUsers',
		{ teamId },
		'completed',
	);
	return response;
};

export const updateTeamAgentSettings: CallinglyEndpoints['updateTeamAgentSettings'] =
	async (ctx, input) => {
		const { teamId, agentId, account_id, ...body } = input;
		const response = Out.updateTeamAgentSettings.parse(
			await makeCallinglyRequest(
				`teams/${encodeURIComponent(String(teamId))}/agents/${encodeURIComponent(String(agentId))}`,
				ctx.key,
				{
					method: 'PUT',
					body,
					accountId: account_id,
				},
			),
		);
		await logEventFromContext(
			ctx,
			'callingly.teams.updateAgentSettings',
			{ teamId, agentId },
			'completed',
		);
		return response;
	};

export const removeTeamAgent: CallinglyEndpoints['removeTeamAgent'] = async (
	ctx,
	input,
) => {
	const { teamId, agentId, account_id } = input;
	const raw = await makeCallinglyRequest(
		`teams/${encodeURIComponent(String(teamId))}/agents/${encodeURIComponent(String(agentId))}`,
		ctx.key,
		{
			method: 'DELETE',
			accountId: account_id,
		},
	);
	const response = Out.removeTeamAgent.parse(raw ?? { success: true });
	await logEventFromContext(
		ctx,
		'callingly.teams.removeAgent',
		{ teamId, agentId },
		'completed',
	);
	return response;
};

// ===========================================================================
// Clients Handlers (Agency Management)
// ===========================================================================

export const listClients: CallinglyEndpoints['listClients'] = async (
	ctx,
	input,
) => {
	const response = Out.listClients.parse(
		await makeCallinglyRequest('clients', ctx.key, {
			method: 'GET',
			query: input,
		}),
	);
	await logEventFromContext(
		ctx,
		'callingly.clients.list',
		{ ...input },
		'completed',
	);
	return response;
};

export const getClient: CallinglyEndpoints['getClient'] = async (
	ctx,
	input,
) => {
	const response = Out.getClient.parse(
		await makeCallinglyRequest(
			`clients/${encodeURIComponent(String(input.clientId))}`,
			ctx.key,
			{ method: 'GET' },
		),
	);
	await logEventFromContext(
		ctx,
		'callingly.clients.get',
		{ clientId: input.clientId },
		'completed',
	);
	return response;
};

export const createClient: CallinglyEndpoints['createClient'] = async (
	ctx,
	input,
) => {
	const response = Out.createClient.parse(
		await makeCallinglyRequest('clients', ctx.key, {
			method: 'POST',
			body: input,
		}),
	);
	await logEventFromContext(
		ctx,
		'callingly.clients.create',
		{ id: response.id },
		'completed',
	);
	return response;
};

export const deleteClient: CallinglyEndpoints['deleteClient'] = async (
	ctx,
	input,
) => {
	const raw = await makeCallinglyRequest(
		`clients/${encodeURIComponent(String(input.clientId))}`,
		ctx.key,
		{ method: 'DELETE' },
	);
	const response = Out.deleteClient.parse(raw ?? { success: true });
	await logEventFromContext(
		ctx,
		'callingly.clients.delete',
		{ clientId: input.clientId },
		'completed',
	);
	return response;
};

export const setClientActive: CallinglyEndpoints['setClientActive'] = async (
	ctx,
	input,
) => {
	const response = Out.setClientActive.parse(
		await makeCallinglyRequest(
			`clients/${encodeURIComponent(String(input.clientId))}/active`,
			ctx.key,
			{
				method: 'POST',
				body: { active: input.active },
			},
		),
	);
	await logEventFromContext(
		ctx,
		'callingly.clients.setActive',
		{ clientId: input.clientId, active: input.active },
		'completed',
	);
	return response;
};

// ===========================================================================
// Webhooks Config Handlers
// ===========================================================================

export const listWebhooks: CallinglyEndpoints['listWebhooks'] = async (
	ctx,
	input,
) => {
	const { account_id, ...query } = input;
	const response = Out.listWebhooks.parse(
		await makeCallinglyRequest('webhooks', ctx.key, {
			method: 'GET',
			query,
			accountId: account_id,
		}),
	);
	await logEventFromContext(
		ctx,
		'callingly.webhooks.list',
		{ ...query },
		'completed',
	);
	return response;
};

export const getWebhook: CallinglyEndpoints['getWebhook'] = async (
	ctx,
	input,
) => {
	const { webhookId, account_id } = input;
	const response = Out.getWebhook.parse(
		await makeCallinglyRequest(
			`webhooks/${encodeURIComponent(String(webhookId))}`,
			ctx.key,
			{
				method: 'GET',
				accountId: account_id,
			},
		),
	);
	await logEventFromContext(
		ctx,
		'callingly.webhooks.get',
		{ webhookId },
		'completed',
	);
	return response;
};

export const createWebhook: CallinglyEndpoints['createWebhook'] = async (
	ctx,
	input,
) => {
	const { account_id, ...body } = input;
	const response = Out.createWebhook.parse(
		await makeCallinglyRequest('webhooks', ctx.key, {
			method: 'POST',
			body,
			accountId: account_id,
		}),
	);
	await logEventFromContext(
		ctx,
		'callingly.webhooks.create',
		{ id: response.id },
		'completed',
	);
	return response;
};

export const updateWebhook: CallinglyEndpoints['updateWebhook'] = async (
	ctx,
	input,
) => {
	const { webhookId, account_id, ...body } = input;
	const response = Out.updateWebhook.parse(
		await makeCallinglyRequest(
			`webhooks/${encodeURIComponent(String(webhookId))}`,
			ctx.key,
			{
				method: 'PUT',
				body,
				accountId: account_id,
			},
		),
	);
	await logEventFromContext(
		ctx,
		'callingly.webhooks.update',
		{ webhookId },
		'completed',
	);
	return response;
};

export const deleteWebhook: CallinglyEndpoints['deleteWebhook'] = async (
	ctx,
	input,
) => {
	const { webhookId, account_id } = input;
	const raw = await makeCallinglyRequest(
		`webhooks/${encodeURIComponent(String(webhookId))}`,
		ctx.key,
		{
			method: 'DELETE',
			accountId: account_id,
		},
	);
	const response = Out.deleteWebhook.parse(raw ?? { success: true });
	await logEventFromContext(
		ctx,
		'callingly.webhooks.delete',
		{ webhookId },
		'completed',
	);
	return response;
};
