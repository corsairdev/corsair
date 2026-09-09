import { logEventFromContext } from 'corsair/core';
import type { CallinglyEndpoints } from '..';
import { makeCallinglyRequest } from '../client';
import {
	CallinglyEndpointInputSchemas as In,
	CallinglyEndpointOutputSchemas as Out,
} from './types';

type UpsertTable = {
	upsertByEntityId: (id: string, data: never) => Promise<unknown>;
	deleteByEntityId?: (id: string) => Promise<unknown>;
};

async function upsert(
	table: UpsertTable | undefined,
	id: unknown,
	data: unknown,
) {
	if (!table || id === undefined || id === null || id === '') return;
	try {
		await table.upsertByEntityId(String(id), data as never);
	} catch (error) {
		console.warn('Failed to persist Callingly entity:', error);
	}
}

async function remove(table: UpsertTable | undefined, id: unknown) {
	if (
		!table?.deleteByEntityId ||
		id === undefined ||
		id === null ||
		id === ''
	) {
		return;
	}
	try {
		await table.deleteByEntityId(String(id));
	} catch (error) {
		console.warn('Failed to delete Callingly entity:', error);
	}
}

function collection<T extends { id?: unknown }>(
	response: unknown,
	keys: string[],
): T[] {
	if (Array.isArray(response)) return response as T[];
	if (response && typeof response === 'object') {
		const record = response as Record<string, unknown>;
		for (const key of keys) {
			const value = record[key];
			if (Array.isArray(value)) return value as T[];
		}
	}
	return [];
}

function scheduleRecord(agentId: unknown, response: unknown) {
	if (Array.isArray(response)) {
		return { id: agentId, agent_id: agentId, days: response };
	}
	return response;
}

export const getLead: CallinglyEndpoints['getLead'] = async (ctx, input) => {
	const { leadId, account_id } = In.getLead.parse(input);
	const response = Out.getLead.parse(
		await makeCallinglyRequest(
			`leads/${encodeURIComponent(String(leadId))}`,
			ctx.key,
			{ method: 'GET', accountId: account_id },
		),
	);
	await upsert(ctx.db.leads, response.id, response);
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
	const { account_id, ...query } = In.listLeads.parse(input);
	const response = Out.listLeads.parse(
		await makeCallinglyRequest('leads', ctx.key, {
			method: 'GET',
			query,
			accountId: account_id,
		}),
	);
	for (const item of collection(response, ['leads'])) {
		await upsert(ctx.db.leads, item.id, item);
	}
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
	const { leadId, account_id, ...body } = In.updateLead.parse(input);
	const response = Out.updateLead.parse(
		await makeCallinglyRequest(
			`leads/${encodeURIComponent(String(leadId))}`,
			ctx.key,
			{ method: 'PUT', body, accountId: account_id },
		),
	);
	await upsert(ctx.db.leads, response.id, response);
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
	const { leadId, account_id } = In.deleteLead.parse(input);
	const raw = await makeCallinglyRequest(
		`leads/${encodeURIComponent(String(leadId))}`,
		ctx.key,
		{ method: 'DELETE', accountId: account_id },
	);
	const response = Out.deleteLead.parse(raw ?? { success: true });
	await remove(ctx.db.leads, leadId);
	await logEventFromContext(
		ctx,
		'callingly.leads.delete',
		{ leadId },
		'completed',
	);
	return response;
};

export const createCall: CallinglyEndpoints['createCall'] = async (
	ctx,
	input,
) => {
	const { account_id, ...body } = In.createCall.parse(input);
	const response = Out.createCall.parse(
		await makeCallinglyRequest('calls', ctx.key, {
			method: 'POST',
			body,
			accountId: account_id,
		}),
	);
	await upsert(ctx.db.calls, response.id, response);
	await logEventFromContext(
		ctx,
		'callingly.calls.create',
		{ id: response.id },
		'completed',
	);
	return response;
};

export const getCall: CallinglyEndpoints['getCall'] = async (ctx, input) => {
	const { callId, account_id } = In.getCall.parse(input);
	const response = Out.getCall.parse(
		await makeCallinglyRequest(
			`calls/${encodeURIComponent(String(callId))}`,
			ctx.key,
			{ method: 'GET', accountId: account_id },
		),
	);
	await upsert(ctx.db.calls, response.id, response);
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
	const { account_id, ...query } = In.listCalls.parse(input);
	const response = Out.listCalls.parse(
		await makeCallinglyRequest('calls', ctx.key, {
			method: 'GET',
			query,
			accountId: account_id,
		}),
	);
	for (const item of collection(response, ['calls', 'data'])) {
		await upsert(ctx.db.calls, item.id, item);
	}
	await logEventFromContext(
		ctx,
		'callingly.calls.list',
		{ ...query },
		'completed',
	);
	return response;
};

export const createAgent: CallinglyEndpoints['createAgent'] = async (
	ctx,
	input,
) => {
	const { account_id, ...body } = In.createAgent.parse(input);
	const response = Out.createAgent.parse(
		await makeCallinglyRequest('agents', ctx.key, {
			method: 'POST',
			body,
			accountId: account_id,
		}),
	);
	await upsert(ctx.db.users, response.id, response);
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
	const { account_id, ...query } = In.listUsers.parse(input);
	const response = Out.listUsers.parse(
		await makeCallinglyRequest('agents', ctx.key, {
			method: 'GET',
			query,
			accountId: account_id,
		}),
	);
	for (const item of collection(response, ['users', 'agents'])) {
		await upsert(ctx.db.users, item.id, item);
	}
	await logEventFromContext(
		ctx,
		'callingly.users.list',
		{ ...query },
		'completed',
	);
	return response;
};

export const updateAgent: CallinglyEndpoints['updateAgent'] = async (
	ctx,
	input,
) => {
	const { agentId, account_id, ...body } = In.updateAgent.parse(input);
	const response = Out.updateAgent.parse(
		await makeCallinglyRequest(
			`agents/${encodeURIComponent(String(agentId))}`,
			ctx.key,
			{ method: 'PUT', body, accountId: account_id },
		),
	);
	await upsert(ctx.db.users, response.id ?? agentId, response);
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
	const { agentId, account_id } = In.deleteAgent.parse(input);
	const raw = await makeCallinglyRequest(
		`agents/${encodeURIComponent(String(agentId))}`,
		ctx.key,
		{ method: 'DELETE', accountId: account_id },
	);
	const response = Out.deleteAgent.parse(raw ?? { success: true });
	await remove(ctx.db.users, agentId);
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
	const { agentId, account_id } = In.getAgentSchedule.parse(input);
	const response = Out.getAgentSchedule.parse(
		await makeCallinglyRequest(
			`agents/${encodeURIComponent(String(agentId))}/schedule`,
			ctx.key,
			{ method: 'GET', accountId: account_id },
		),
	);
	await upsert(ctx.db.schedules, agentId, scheduleRecord(agentId, response));
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
		const { agentId, account_id, days } = In.updateAgentSchedule.parse(input);
		const response = Out.updateAgentSchedule.parse(
			await makeCallinglyRequest(
				`agents/${encodeURIComponent(String(agentId))}/schedule`,
				ctx.key,
				{ method: 'PUT', body: days, accountId: account_id },
			),
		);
		await upsert(ctx.db.schedules, agentId, scheduleRecord(agentId, response));
		await logEventFromContext(
			ctx,
			'callingly.agents.updateSchedule',
			{ agentId },
			'completed',
		);
		return response;
	};

export const createTeam: CallinglyEndpoints['createTeam'] = async (
	ctx,
	input,
) => {
	const { account_id, ...body } = In.createTeam.parse(input);
	const response = Out.createTeam.parse(
		await makeCallinglyRequest('teams', ctx.key, {
			method: 'POST',
			body,
			accountId: account_id,
		}),
	);
	await upsert(ctx.db.teams, response.id, response);
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
	const { account_id, ...query } = In.listTeams.parse(input);
	const response = Out.listTeams.parse(
		await makeCallinglyRequest('teams', ctx.key, {
			method: 'GET',
			query,
			accountId: account_id,
		}),
	);
	for (const item of collection(response, ['teams'])) {
		await upsert(ctx.db.teams, item.id, item);
	}
	await logEventFromContext(
		ctx,
		'callingly.teams.list',
		{ ...query },
		'completed',
	);
	return response;
};

export const getTeam: CallinglyEndpoints['getTeam'] = async (ctx, input) => {
	const { teamId, account_id } = In.getTeam.parse(input);
	const response = Out.getTeam.parse(
		await makeCallinglyRequest(
			`teams/${encodeURIComponent(String(teamId))}`,
			ctx.key,
			{ method: 'GET', accountId: account_id },
		),
	);
	await upsert(ctx.db.teams, response.id, response);
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
	const { teamId, account_id } = In.listTeamUsers.parse(input);
	const response = Out.listTeamUsers.parse(
		await makeCallinglyRequest(
			`teams/${encodeURIComponent(String(teamId))}/agents`,
			ctx.key,
			{ method: 'GET', accountId: account_id },
		),
	);
	for (const item of collection(response, ['agents', 'users'])) {
		await upsert(ctx.db.teamUsers, `${teamId}:${item.id}`, {
			...item,
			team_id: teamId,
		});
	}
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
	const { teamId, user_ids, agents, account_id } =
		In.updateTeamUsers.parse(input);
	const agentIds = agents ?? user_ids ?? [];
	const response = Out.updateTeamUsers.parse(
		await makeCallinglyRequest(
			`teams/${encodeURIComponent(String(teamId))}/agents`,
			ctx.key,
			{ method: 'PUT', body: { agents: agentIds }, accountId: account_id },
		),
	);
	const members = collection(response, ['agents', 'users']);
	if (members.length > 0) {
		for (const item of members) {
			await upsert(ctx.db.teamUsers, `${teamId}:${item.id}`, {
				...item,
				team_id: teamId,
			});
		}
	} else if (response && typeof response === 'object' && 'id' in response) {
		await upsert(ctx.db.teams, response.id, response);
	}
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
		const { teamId, agentId, account_id, ...body } =
			In.updateTeamAgentSettings.parse(input);
		const response = Out.updateTeamAgentSettings.parse(
			await makeCallinglyRequest(
				`teams/${encodeURIComponent(String(teamId))}/agents/${encodeURIComponent(String(agentId))}`,
				ctx.key,
				{ method: 'PUT', body, accountId: account_id },
			),
		);
		await upsert(ctx.db.teamUsers, `${teamId}:${agentId}`, {
			...response,
			team_id: teamId,
		});
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
	const { teamId, agentId, account_id } = In.removeTeamAgent.parse(input);
	const raw = await makeCallinglyRequest(
		`teams/${encodeURIComponent(String(teamId))}/agents/${encodeURIComponent(String(agentId))}`,
		ctx.key,
		{ method: 'DELETE', accountId: account_id },
	);
	const response = Out.removeTeamAgent.parse(raw ?? { success: true });
	await remove(ctx.db.teamUsers, `${teamId}:${agentId}`);
	await logEventFromContext(
		ctx,
		'callingly.teams.removeAgent',
		{ teamId, agentId },
		'completed',
	);
	return response;
};

export const listClients: CallinglyEndpoints['listClients'] = async (
	ctx,
	input,
) => {
	In.listClients.parse(input);
	const response = Out.listClients.parse(
		await makeCallinglyRequest('clients', ctx.key, { method: 'GET' }),
	);
	for (const item of collection(response, ['clients'])) {
		await upsert(ctx.db.clients, item.id, item);
	}
	await logEventFromContext(ctx, 'callingly.clients.list', {}, 'completed');
	return response;
};

export const createClient: CallinglyEndpoints['createClient'] = async (
	ctx,
	input,
) => {
	const body = In.createClient.parse(input);
	const response = Out.createClient.parse(
		await makeCallinglyRequest('clients', ctx.key, { method: 'POST', body }),
	);
	await upsert(ctx.db.clients, response.id, response);
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
	const { clientId } = In.deleteClient.parse(input);
	const raw = await makeCallinglyRequest(
		`clients/${encodeURIComponent(String(clientId))}`,
		ctx.key,
		{ method: 'DELETE' },
	);
	const response = Out.deleteClient.parse(raw ?? { success: true });
	await remove(ctx.db.clients, clientId);
	await logEventFromContext(
		ctx,
		'callingly.clients.delete',
		{ clientId },
		'completed',
	);
	return response;
};

export const setClientActive: CallinglyEndpoints['setClientActive'] = async (
	ctx,
	input,
) => {
	const validated = In.setClientActive.parse(input);
	const is_active = validated.is_active ?? (validated.active === true ? 1 : 0);
	const response = Out.setClientActive.parse(
		await makeCallinglyRequest(
			`clients/${encodeURIComponent(String(validated.clientId))}/active`,
			ctx.key,
			{ method: 'POST', body: { is_active } },
		),
	);
	await upsert(ctx.db.clients, response.id ?? validated.clientId, response);
	await logEventFromContext(
		ctx,
		'callingly.clients.setActive',
		{ clientId: validated.clientId, is_active },
		'completed',
	);
	return response;
};

export const listWebhooks: CallinglyEndpoints['listWebhooks'] = async (
	ctx,
	input,
) => {
	const { account_id, ...query } = In.listWebhooks.parse(input);
	const response = Out.listWebhooks.parse(
		await makeCallinglyRequest('webhooks', ctx.key, {
			method: 'GET',
			query,
			accountId: account_id,
		}),
	);
	for (const item of collection(response, ['webhooks'])) {
		await upsert(ctx.db.webhooks, item.id, item);
	}
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
	const { webhookId, account_id } = In.getWebhook.parse(input);
	const response = Out.getWebhook.parse(
		await makeCallinglyRequest(
			`webhooks/${encodeURIComponent(String(webhookId))}`,
			ctx.key,
			{ method: 'GET', accountId: account_id },
		),
	);
	await upsert(ctx.db.webhooks, response.id, response);
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
	const { account_id, ...body } = In.createWebhook.parse(input);
	const response = Out.createWebhook.parse(
		await makeCallinglyRequest('webhooks', ctx.key, {
			method: 'POST',
			body,
			accountId: account_id,
		}),
	);
	await upsert(ctx.db.webhooks, response.id, response);
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
	const { webhookId, account_id, ...body } = In.updateWebhook.parse(input);
	const response = Out.updateWebhook.parse(
		await makeCallinglyRequest(
			`webhooks/${encodeURIComponent(String(webhookId))}`,
			ctx.key,
			{ method: 'PUT', body, accountId: account_id },
		),
	);
	await upsert(ctx.db.webhooks, response.id ?? webhookId, response);
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
	const { webhookId, account_id } = In.deleteWebhook.parse(input);
	const raw = await makeCallinglyRequest(
		`webhooks/${encodeURIComponent(String(webhookId))}`,
		ctx.key,
		{ method: 'DELETE', accountId: account_id },
	);
	const response = Out.deleteWebhook.parse(raw ?? { success: true });
	await remove(ctx.db.webhooks, webhookId);
	await logEventFromContext(
		ctx,
		'callingly.webhooks.delete',
		{ webhookId },
		'completed',
	);
	return response;
};
