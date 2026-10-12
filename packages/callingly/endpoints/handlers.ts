import { logEventFromContext } from 'corsair/core';
import type { CallinglyEndpoints } from '..';
import { makeCallinglyRequest } from '../client';
import {
	CallinglyEndpointInputSchemas as In,
	CallinglyEndpointOutputSchemas as Out,
} from './types';

/** Local sync is best effort: a failed write must not fail the API call. */
async function persist(write: () => Promise<void>): Promise<void> {
	try {
		await write();
	} catch (error) {
		console.warn('Failed to sync Callingly data to the database:', error);
	}
}

const segment = (id: string | number) => encodeURIComponent(String(id));

// Leads

export const getLead: CallinglyEndpoints['getLead'] = async (ctx, input) => {
	const { leadId, account_id } = In.getLead.parse(input);
	const lead = Out.getLead.parse(
		await makeCallinglyRequest(`leads/${segment(leadId)}`, ctx.key, {
			accountId: account_id,
		}),
	);
	await persist(async () => {
		await ctx.db.leads?.upsertByEntityId(String(lead.id), lead);
	});
	await logEventFromContext(
		ctx,
		'callingly.leads.get',
		{ leadId },
		'completed',
	);
	return lead;
};

export const listLeads: CallinglyEndpoints['listLeads'] = async (
	ctx,
	input,
) => {
	const { account_id, ...query } = In.listLeads.parse(input);
	const leads = Out.listLeads.parse(
		await makeCallinglyRequest('leads', ctx.key, {
			query,
			accountId: account_id,
		}),
	);
	await persist(async () => {
		for (const lead of leads) {
			await ctx.db.leads?.upsertByEntityId(String(lead.id), lead);
		}
	});
	await logEventFromContext(
		ctx,
		'callingly.leads.list',
		{ count: leads.length },
		'completed',
	);
	return leads;
};

export const updateLead: CallinglyEndpoints['updateLead'] = async (
	ctx,
	input,
) => {
	const { leadId, account_id, ...body } = In.updateLead.parse(input);
	const lead = Out.updateLead.parse(
		await makeCallinglyRequest(`leads/${segment(leadId)}`, ctx.key, {
			method: 'PUT',
			body,
			accountId: account_id,
		}),
	);
	await persist(async () => {
		await ctx.db.leads?.upsertByEntityId(String(lead.id), lead);
	});
	await logEventFromContext(
		ctx,
		'callingly.leads.update',
		{ leadId },
		'completed',
	);
	return lead;
};

export const deleteLead: CallinglyEndpoints['deleteLead'] = async (
	ctx,
	input,
) => {
	const { leadId, account_id } = In.deleteLead.parse(input);
	const result = Out.deleteLead.parse(
		(await makeCallinglyRequest(`leads/${segment(leadId)}`, ctx.key, {
			method: 'DELETE',
			accountId: account_id,
		})) ?? {},
	);
	await persist(async () => {
		await ctx.db.leads?.deleteByEntityId(String(leadId));
	});
	await logEventFromContext(
		ctx,
		'callingly.leads.delete',
		{ leadId },
		'completed',
	);
	return result;
};

// Calls

export const createCall: CallinglyEndpoints['createCall'] = async (
	ctx,
	input,
) => {
	const { account_id, ...body } = In.createCall.parse(input);
	const call = Out.createCall.parse(
		await makeCallinglyRequest('calls', ctx.key, {
			method: 'POST',
			body,
			accountId: account_id,
		}),
	);
	const callId = call.id ?? call.call_id;
	if (callId !== undefined) {
		await persist(async () => {
			await ctx.db.calls?.upsertByEntityId(String(callId), {
				...call,
				id: callId,
			});
		});
	}
	await logEventFromContext(
		ctx,
		'callingly.calls.create',
		{ callId, teamId: body.team_id },
		'completed',
	);
	return call;
};

export const getCall: CallinglyEndpoints['getCall'] = async (ctx, input) => {
	const { callId, account_id } = In.getCall.parse(input);
	const call = Out.getCall.parse(
		await makeCallinglyRequest(`calls/${segment(callId)}`, ctx.key, {
			accountId: account_id,
		}),
	);
	await persist(async () => {
		await ctx.db.calls?.upsertByEntityId(String(call.id), call);
	});
	await logEventFromContext(
		ctx,
		'callingly.calls.get',
		{ callId },
		'completed',
	);
	return call;
};

export const listCalls: CallinglyEndpoints['listCalls'] = async (
	ctx,
	input,
) => {
	const { account_id, ...query } = In.listCalls.parse(input);
	const response = Out.listCalls.parse(
		await makeCallinglyRequest('calls', ctx.key, {
			query,
			accountId: account_id,
		}),
	);
	await persist(async () => {
		for (const call of response.data) {
			await ctx.db.calls?.upsertByEntityId(String(call.id), call);
		}
	});
	await logEventFromContext(
		ctx,
		'callingly.calls.list',
		{ count: response.data.length },
		'completed',
	);
	return response;
};

// Agents

export const createAgent: CallinglyEndpoints['createAgent'] = async (
	ctx,
	input,
) => {
	const { account_id, ...body } = In.createAgent.parse(input);
	const agent = Out.createAgent.parse(
		await makeCallinglyRequest('agents', ctx.key, {
			method: 'POST',
			body,
			accountId: account_id,
		}),
	);
	await persist(async () => {
		await ctx.db.users?.upsertByEntityId(String(agent.id), agent);
	});
	await logEventFromContext(
		ctx,
		'callingly.agents.create',
		{ agentId: agent.id },
		'completed',
	);
	return agent;
};

export const listUsers: CallinglyEndpoints['listUsers'] = async (
	ctx,
	input,
) => {
	const { account_id } = In.listUsers.parse(input);
	const agents = Out.listUsers.parse(
		await makeCallinglyRequest('agents', ctx.key, { accountId: account_id }),
	);
	await persist(async () => {
		for (const agent of agents) {
			await ctx.db.users?.upsertByEntityId(String(agent.id), agent);
		}
	});
	await logEventFromContext(
		ctx,
		'callingly.agents.list',
		{ count: agents.length },
		'completed',
	);
	return agents;
};

export const updateAgent: CallinglyEndpoints['updateAgent'] = async (
	ctx,
	input,
) => {
	const { agentId, account_id, ...body } = In.updateAgent.parse(input);
	const agent = Out.updateAgent.parse(
		await makeCallinglyRequest(`agents/${segment(agentId)}`, ctx.key, {
			method: 'PUT',
			body,
			accountId: account_id,
		}),
	);
	await persist(async () => {
		await ctx.db.users?.upsertByEntityId(String(agent.id), agent);
	});
	await logEventFromContext(
		ctx,
		'callingly.agents.update',
		{ agentId },
		'completed',
	);
	return agent;
};

export const deleteAgent: CallinglyEndpoints['deleteAgent'] = async (
	ctx,
	input,
) => {
	const { agentId, account_id } = In.deleteAgent.parse(input);
	const result = Out.deleteAgent.parse(
		(await makeCallinglyRequest(`agents/${segment(agentId)}`, ctx.key, {
			method: 'DELETE',
			accountId: account_id,
		})) ?? {},
	);
	await persist(async () => {
		await ctx.db.users?.deleteByEntityId(String(agentId));
	});
	await logEventFromContext(
		ctx,
		'callingly.agents.delete',
		{ agentId },
		'completed',
	);
	return result;
};

export const getAgentSchedule: CallinglyEndpoints['getAgentSchedule'] = async (
	ctx,
	input,
) => {
	const { agentId, account_id } = In.getAgentSchedule.parse(input);
	const days = Out.getAgentSchedule.parse(
		await makeCallinglyRequest(`agents/${segment(agentId)}/schedule`, ctx.key, {
			accountId: account_id,
		}),
	);
	await persist(async () => {
		await ctx.db.schedules?.upsertByEntityId(String(agentId), {
			id: agentId,
			days,
		});
	});
	await logEventFromContext(
		ctx,
		'callingly.agents.getSchedule',
		{ agentId },
		'completed',
	);
	return days;
};

export const updateAgentSchedule: CallinglyEndpoints['updateAgentSchedule'] =
	async (ctx, input) => {
		const { agentId, account_id, days } = In.updateAgentSchedule.parse(input);
		const saved = Out.updateAgentSchedule.parse(
			await makeCallinglyRequest(
				`agents/${segment(agentId)}/schedule`,
				ctx.key,
				{ method: 'PUT', body: days, accountId: account_id },
			),
		);
		await persist(async () => {
			await ctx.db.schedules?.upsertByEntityId(String(agentId), {
				id: agentId,
				days: saved,
			});
		});
		await logEventFromContext(
			ctx,
			'callingly.agents.updateSchedule',
			{ agentId },
			'completed',
		);
		return saved;
	};

// Teams

export const createTeam: CallinglyEndpoints['createTeam'] = async (
	ctx,
	input,
) => {
	const { account_id, ...body } = In.createTeam.parse(input);
	const team = Out.createTeam.parse(
		await makeCallinglyRequest('teams', ctx.key, {
			method: 'POST',
			body,
			accountId: account_id,
		}),
	);
	await persist(async () => {
		await ctx.db.teams?.upsertByEntityId(String(team.id), team);
	});
	await logEventFromContext(
		ctx,
		'callingly.teams.create',
		{ teamId: team.id },
		'completed',
	);
	return team;
};

export const listTeams: CallinglyEndpoints['listTeams'] = async (
	ctx,
	input,
) => {
	const { account_id } = In.listTeams.parse(input);
	const teams = Out.listTeams.parse(
		await makeCallinglyRequest('teams', ctx.key, { accountId: account_id }),
	);
	await persist(async () => {
		for (const team of teams) {
			await ctx.db.teams?.upsertByEntityId(String(team.id), team);
		}
	});
	await logEventFromContext(
		ctx,
		'callingly.teams.list',
		{ count: teams.length },
		'completed',
	);
	return teams;
};

export const getTeam: CallinglyEndpoints['getTeam'] = async (ctx, input) => {
	const { teamId, account_id } = In.getTeam.parse(input);
	const team = Out.getTeam.parse(
		await makeCallinglyRequest(`teams/${segment(teamId)}`, ctx.key, {
			accountId: account_id,
		}),
	);
	await persist(async () => {
		await ctx.db.teams?.upsertByEntityId(String(team.id), team);
	});
	await logEventFromContext(
		ctx,
		'callingly.teams.get',
		{ teamId },
		'completed',
	);
	return team;
};

export const listTeamUsers: CallinglyEndpoints['listTeamUsers'] = async (
	ctx,
	input,
) => {
	const { teamId, account_id } = In.listTeamUsers.parse(input);
	const response = Out.listTeamUsers.parse(
		await makeCallinglyRequest(`teams/${segment(teamId)}/agents`, ctx.key, {
			accountId: account_id,
		}),
	);
	await persist(async () => {
		for (const agent of response.agents) {
			await ctx.db.teamUsers?.upsertByEntityId(`${teamId}:${agent.id}`, {
				...agent,
				team_id: teamId,
			});
		}
	});
	await logEventFromContext(
		ctx,
		'callingly.teams.listUsers',
		{ teamId, count: response.agents.length },
		'completed',
	);
	return response;
};

export const updateTeamUsers: CallinglyEndpoints['updateTeamUsers'] = async (
	ctx,
	input,
) => {
	const { teamId, agents, account_id } = In.updateTeamUsers.parse(input);
	const response = Out.updateTeamUsers.parse(
		await makeCallinglyRequest(`teams/${segment(teamId)}/agents`, ctx.key, {
			method: 'PUT',
			body: { agents: agents.map(String) },
			accountId: account_id,
		}),
	);
	if ('agents' in response) {
		await persist(async () => {
			for (const agent of response.agents) {
				await ctx.db.teamUsers?.upsertByEntityId(`${teamId}:${agent.id}`, {
					...agent,
					team_id: teamId,
				});
			}
		});
	}
	await logEventFromContext(
		ctx,
		'callingly.teams.updateUsers',
		{ teamId, count: agents.length },
		'completed',
	);
	return response;
};

export const updateTeamAgentSettings: CallinglyEndpoints['updateTeamAgentSettings'] =
	async (ctx, input) => {
		const { teamId, agentId, account_id, ...body } =
			In.updateTeamAgentSettings.parse(input);
		const agent = Out.updateTeamAgentSettings.parse(
			await makeCallinglyRequest(
				`teams/${segment(teamId)}/agents/${segment(agentId)}`,
				ctx.key,
				{ method: 'PUT', body, accountId: account_id },
			),
		);
		await persist(async () => {
			await ctx.db.teamUsers?.upsertByEntityId(`${teamId}:${agentId}`, {
				...agent,
				team_id: teamId,
			});
		});
		await logEventFromContext(
			ctx,
			'callingly.teams.updateAgentSettings',
			{ teamId, agentId },
			'completed',
		);
		return agent;
	};

export const removeTeamAgent: CallinglyEndpoints['removeTeamAgent'] = async (
	ctx,
	input,
) => {
	const { teamId, agentId, account_id } = In.removeTeamAgent.parse(input);
	const result = Out.removeTeamAgent.parse(
		(await makeCallinglyRequest(
			`teams/${segment(teamId)}/agents/${segment(agentId)}`,
			ctx.key,
			{ method: 'DELETE', accountId: account_id },
		)) ?? {},
	);
	await persist(async () => {
		await ctx.db.teamUsers?.deleteByEntityId(`${teamId}:${agentId}`);
	});
	await logEventFromContext(
		ctx,
		'callingly.teams.removeAgent',
		{ teamId, agentId },
		'completed',
	);
	return result;
};

// Clients

export const listClients: CallinglyEndpoints['listClients'] = async (
	ctx,
	input,
) => {
	In.listClients.parse(input);
	const clients = Out.listClients.parse(
		await makeCallinglyRequest('clients', ctx.key),
	);
	await persist(async () => {
		for (const client of clients) {
			await ctx.db.clients?.upsertByEntityId(String(client.id), client);
		}
	});
	await logEventFromContext(
		ctx,
		'callingly.clients.list',
		{ count: clients.length },
		'completed',
	);
	return clients;
};

export const createClient: CallinglyEndpoints['createClient'] = async (
	ctx,
	input,
) => {
	const body = In.createClient.parse(input);
	const client = Out.createClient.parse(
		await makeCallinglyRequest('clients', ctx.key, { method: 'POST', body }),
	);
	await persist(async () => {
		await ctx.db.clients?.upsertByEntityId(String(client.id), client);
	});
	await logEventFromContext(
		ctx,
		'callingly.clients.create',
		{ clientId: client.id },
		'completed',
	);
	return client;
};

export const deleteClient: CallinglyEndpoints['deleteClient'] = async (
	ctx,
	input,
) => {
	const { clientId } = In.deleteClient.parse(input);
	const result = Out.deleteClient.parse(
		(await makeCallinglyRequest(`clients/${segment(clientId)}`, ctx.key, {
			method: 'DELETE',
		})) ?? {},
	);
	await persist(async () => {
		await ctx.db.clients?.deleteByEntityId(String(clientId));
	});
	await logEventFromContext(
		ctx,
		'callingly.clients.delete',
		{ clientId },
		'completed',
	);
	return result;
};

export const setClientActive: CallinglyEndpoints['setClientActive'] = async (
	ctx,
	input,
) => {
	const { clientId, is_active } = In.setClientActive.parse(input);
	const client = Out.setClientActive.parse(
		await makeCallinglyRequest(`clients/${segment(clientId)}/active`, ctx.key, {
			method: 'POST',
			body: { is_active },
		}),
	);
	await persist(async () => {
		await ctx.db.clients?.upsertByEntityId(String(client.id), client);
	});
	await logEventFromContext(
		ctx,
		'callingly.clients.activateDeactivate',
		{ clientId, is_active },
		'completed',
	);
	return client;
};

// Webhooks

export const listWebhooks: CallinglyEndpoints['listWebhooks'] = async (
	ctx,
	input,
) => {
	const { account_id } = In.listWebhooks.parse(input);
	const webhooks = Out.listWebhooks.parse(
		await makeCallinglyRequest('webhooks', ctx.key, { accountId: account_id }),
	);
	await persist(async () => {
		for (const webhook of webhooks) {
			await ctx.db.webhooks?.upsertByEntityId(String(webhook.id), webhook);
		}
	});
	await logEventFromContext(
		ctx,
		'callingly.webhooks.list',
		{ count: webhooks.length },
		'completed',
	);
	return webhooks;
};

export const getWebhook: CallinglyEndpoints['getWebhook'] = async (
	ctx,
	input,
) => {
	const { webhookId, account_id } = In.getWebhook.parse(input);
	const webhook = Out.getWebhook.parse(
		await makeCallinglyRequest(`webhooks/${segment(webhookId)}`, ctx.key, {
			accountId: account_id,
		}),
	);
	await persist(async () => {
		await ctx.db.webhooks?.upsertByEntityId(String(webhook.id), webhook);
	});
	await logEventFromContext(
		ctx,
		'callingly.webhooks.get',
		{ webhookId },
		'completed',
	);
	return webhook;
};

export const createWebhook: CallinglyEndpoints['createWebhook'] = async (
	ctx,
	input,
) => {
	const { account_id, ...body } = In.createWebhook.parse(input);
	const webhook = Out.createWebhook.parse(
		await makeCallinglyRequest('webhooks', ctx.key, {
			method: 'POST',
			body,
			accountId: account_id,
		}),
	);
	await persist(async () => {
		await ctx.db.webhooks?.upsertByEntityId(String(webhook.id), webhook);
	});
	await logEventFromContext(
		ctx,
		'callingly.webhooks.create',
		{ webhookId: webhook.id },
		'completed',
	);
	return webhook;
};

export const updateWebhook: CallinglyEndpoints['updateWebhook'] = async (
	ctx,
	input,
) => {
	const { webhookId, account_id, ...body } = In.updateWebhook.parse(input);
	const webhook = Out.updateWebhook.parse(
		await makeCallinglyRequest(`webhooks/${segment(webhookId)}`, ctx.key, {
			method: 'PUT',
			body,
			accountId: account_id,
		}),
	);
	await persist(async () => {
		await ctx.db.webhooks?.upsertByEntityId(String(webhook.id), webhook);
	});
	await logEventFromContext(
		ctx,
		'callingly.webhooks.update',
		{ webhookId },
		'completed',
	);
	return webhook;
};

export const deleteWebhook: CallinglyEndpoints['deleteWebhook'] = async (
	ctx,
	input,
) => {
	const { webhookId, account_id } = In.deleteWebhook.parse(input);
	const result = Out.deleteWebhook.parse(
		(await makeCallinglyRequest(`webhooks/${segment(webhookId)}`, ctx.key, {
			method: 'DELETE',
			accountId: account_id,
		})) ?? {},
	);
	await persist(async () => {
		await ctx.db.webhooks?.deleteByEntityId(String(webhookId));
	});
	await logEventFromContext(
		ctx,
		'callingly.webhooks.delete',
		{ webhookId },
		'completed',
	);
	return result;
};
