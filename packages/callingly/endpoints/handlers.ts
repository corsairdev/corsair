import { logEventFromContext } from 'corsair/core';
import type { CallinglyEndpoints } from '..';
import { makeCallinglyRequest } from '../client';
import {
	CallinglyEndpointInputSchemas as In,
	CallinglyEndpointOutputSchemas as Out,
} from './types';

// ===========================================================================
// Leads Handlers
// ===========================================================================

export const createLead: CallinglyEndpoints['createLead'] = async (
	ctx,
	input,
) => {
	const validated = In.createLead.parse(input);
	const { account_id, ...body } = validated;
	const response = Out.createLead.parse(
		await makeCallinglyRequest('leads', ctx.key, {
			method: 'POST',
			body,
			accountId: account_id,
		}),
	);

	if (ctx.db.leads && response.id) {
		try {
			await ctx.db.leads.upsertByEntityId(String(response.id), response);
		} catch (error) {
			console.warn('Failed to persist lead to local database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'callingly.leads.create',
		{ id: response.id },
		'completed',
	);
	return response;
};

export const getLead: CallinglyEndpoints['getLead'] = async (ctx, input) => {
	const validated = In.getLead.parse(input);
	const { leadId, account_id } = validated;
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

	if (ctx.db.leads && response.id) {
		try {
			await ctx.db.leads.upsertByEntityId(String(response.id), response);
		} catch (error) {
			console.warn('Failed to persist lead to local database:', error);
		}
	}

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
	const validated = In.listLeads.parse(input);
	const { account_id, ...query } = validated;
	const response = Out.listLeads.parse(
		await makeCallinglyRequest('leads', ctx.key, {
			method: 'GET',
			query,
			accountId: account_id,
		}),
	);

	if (ctx.db.leads) {
		try {
			const items = Array.isArray(response) ? response : (response.leads ?? []);
			for (const item of items) {
				if (item.id) {
					await ctx.db.leads.upsertByEntityId(String(item.id), item);
				}
			}
		} catch (error) {
			console.warn('Failed to persist leads to local database:', error);
		}
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
	const validated = In.updateLead.parse(input);
	const { leadId, account_id, ...body } = validated;
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

	if (ctx.db.leads && response.id) {
		try {
			await ctx.db.leads.upsertByEntityId(String(response.id), response);
		} catch (error) {
			console.warn('Failed to persist lead to local database:', error);
		}
	}

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
	const validated = In.deleteLead.parse(input);
	const { leadId, account_id } = validated;
	const raw = await makeCallinglyRequest(
		`leads/${encodeURIComponent(String(leadId))}`,
		ctx.key,
		{
			method: 'DELETE',
			accountId: account_id,
		},
	);
	const response = Out.deleteLead.parse(raw ?? { success: true });

	if (ctx.db.leads) {
		try {
			await ctx.db.leads.deleteByEntityId(String(leadId));
		} catch (error) {
			console.warn('Failed to delete lead from local database:', error);
		}
	}

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
	const validated = In.createCall.parse(input);
	const { account_id, ...body } = validated;
	const response = Out.createCall.parse(
		await makeCallinglyRequest('calls', ctx.key, {
			method: 'POST',
			body,
			accountId: account_id,
		}),
	);

	if (ctx.db.calls && response.id) {
		try {
			await ctx.db.calls.upsertByEntityId(String(response.id), response);
		} catch (error) {
			console.warn('Failed to persist call to local database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'callingly.calls.create',
		{ id: response.id },
		'completed',
	);
	return response;
};

export const getCall: CallinglyEndpoints['getCall'] = async (ctx, input) => {
	const validated = In.getCall.parse(input);
	const { callId, account_id } = validated;
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

	if (ctx.db.calls && response.id) {
		try {
			await ctx.db.calls.upsertByEntityId(String(response.id), response);
		} catch (error) {
			console.warn('Failed to persist call to local database:', error);
		}
	}

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
	const validated = In.listCalls.parse(input);
	const { account_id, ...query } = validated;
	const response = Out.listCalls.parse(
		await makeCallinglyRequest('calls', ctx.key, {
			method: 'GET',
			query,
			accountId: account_id,
		}),
	);

	if (ctx.db.calls) {
		try {
			const items = Array.isArray(response)
				? response
				: (response.calls ?? response.data ?? []);
			for (const item of items) {
				if (item.id) {
					await ctx.db.calls.upsertByEntityId(String(item.id), item);
				}
			}
		} catch (error) {
			console.warn('Failed to persist calls to local database:', error);
		}
	}

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
	const validated = In.createAgent.parse(input);
	const { account_id, ...body } = validated;
	const response = Out.createAgent.parse(
		await makeCallinglyRequest('agents', ctx.key, {
			method: 'POST',
			body,
			accountId: account_id,
		}),
	);

	if (ctx.db.users && response.id) {
		try {
			await ctx.db.users.upsertByEntityId(String(response.id), response);
		} catch (error) {
			console.warn('Failed to persist user to local database:', error);
		}
	}

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
	const validated = In.listUsers.parse(input);
	const { account_id, ...query } = validated;
	const response = Out.listUsers.parse(
		await makeCallinglyRequest('agents', ctx.key, {
			method: 'GET',
			query,
			accountId: account_id,
		}),
	);

	if (ctx.db.users) {
		try {
			const items = Array.isArray(response)
				? response
				: (response.users ?? response.agents ?? []);
			for (const item of items) {
				if (item.id) {
					await ctx.db.users.upsertByEntityId(String(item.id), item);
				}
			}
		} catch (error) {
			console.warn('Failed to persist users to local database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'callingly.users.list',
		{ ...query },
		'completed',
	);
	return response;
};

export const getUser: CallinglyEndpoints['getUser'] = async (ctx, input) => {
	const validated = In.getUser.parse(input);
	const { userId, account_id } = validated;
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

	if (ctx.db.users && response.id) {
		try {
			await ctx.db.users.upsertByEntityId(String(response.id), response);
		} catch (error) {
			console.warn('Failed to persist user to local database:', error);
		}
	}

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
	const validated = In.updateAgent.parse(input);
	const { agentId, account_id, ...body } = validated;
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

	if (ctx.db.users && response.id) {
		try {
			await ctx.db.users.upsertByEntityId(String(response.id), response);
		} catch (error) {
			console.warn('Failed to persist user to local database:', error);
		}
	}

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
	const validated = In.deleteAgent.parse(input);
	const { agentId, account_id } = validated;
	const raw = await makeCallinglyRequest(
		`agents/${encodeURIComponent(String(agentId))}`,
		ctx.key,
		{
			method: 'DELETE',
			accountId: account_id,
		},
	);
	const response = Out.deleteAgent.parse(raw ?? { success: true });

	if (ctx.db.users) {
		try {
			await ctx.db.users.deleteByEntityId(String(agentId));
		} catch (error) {
			console.warn('Failed to delete user from local database:', error);
		}
	}

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
	const validated = In.getAgentSchedule.parse(input);
	const { agentId, account_id } = validated;
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

	if (ctx.db.schedules) {
		try {
			const isArray = Array.isArray(response);
			const scheduleId = String(
				!isArray && (response.agent_id ?? response.user_id)
					? (response.agent_id ?? response.user_id)
					: agentId,
			);
			const record = isArray
				? { agent_id: agentId, schedule: { days: response } }
				: response;
			await ctx.db.schedules.upsertByEntityId(scheduleId, record);
		} catch (error) {
			console.warn('Failed to persist schedule to local database:', error);
		}
	}

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
		const validated = In.updateAgentSchedule.parse(input);
		const { agentId, account_id, ...body } = validated;
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

		if (ctx.db.schedules) {
			try {
				const scheduleId = String(
					response.agent_id ?? response.user_id ?? agentId,
				);
				await ctx.db.schedules.upsertByEntityId(scheduleId, response);
			} catch (error) {
				console.warn('Failed to persist schedule to local database:', error);
			}
		}

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
	const validated = In.createTeam.parse(input);
	const { account_id, ...body } = validated;
	const response = Out.createTeam.parse(
		await makeCallinglyRequest('teams', ctx.key, {
			method: 'POST',
			body,
			accountId: account_id,
		}),
	);

	if (ctx.db.teams && response.id) {
		try {
			await ctx.db.teams.upsertByEntityId(String(response.id), response);
		} catch (error) {
			console.warn('Failed to persist team to local database:', error);
		}
	}

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
	const validated = In.listTeams.parse(input);
	const { account_id, ...query } = validated;
	const response = Out.listTeams.parse(
		await makeCallinglyRequest('teams', ctx.key, {
			method: 'GET',
			query,
			accountId: account_id,
		}),
	);

	if (ctx.db.teams) {
		try {
			const items = Array.isArray(response) ? response : (response.teams ?? []);
			for (const item of items) {
				if (item.id) {
					await ctx.db.teams.upsertByEntityId(String(item.id), item);
				}
			}
		} catch (error) {
			console.warn('Failed to persist teams to local database:', error);
		}
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
	const validated = In.getTeam.parse(input);
	const { teamId, account_id } = validated;
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

	if (ctx.db.teams && response.id) {
		try {
			await ctx.db.teams.upsertByEntityId(String(response.id), response);
		} catch (error) {
			console.warn('Failed to persist team to local database:', error);
		}
	}

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
	const validated = In.listTeamUsers.parse(input);
	const { teamId, account_id } = validated;
	const response = Out.listTeamUsers.parse(
		await makeCallinglyRequest(
			`teams/${encodeURIComponent(String(teamId))}/agents`,
			ctx.key,
			{
				method: 'GET',
				accountId: account_id,
			},
		),
	);

	if (ctx.db.teamUsers) {
		try {
			const items = Array.isArray(response)
				? response
				: (response.users ?? response.agents ?? []);
			for (const item of items) {
				if (item.id) {
					await ctx.db.teamUsers.upsertByEntityId(`${teamId}:${item.id}`, {
						...item,
						team_id: teamId,
					});
				}
			}
		} catch (error) {
			console.warn('Failed to persist team users to local database:', error);
		}
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
	const validated = In.updateTeamUsers.parse(input);
	const { teamId, user_ids, account_id, ...body } = validated;
	const response = Out.updateTeamUsers.parse(
		await makeCallinglyRequest(
			`teams/${encodeURIComponent(String(teamId))}/agents`,
			ctx.key,
			{
				method: 'PUT',
				body: { agents: user_ids, ...body },
				accountId: account_id,
			},
		),
	);

	if (ctx.db.teams && response.id) {
		try {
			await ctx.db.teams.upsertByEntityId(String(response.id), response);
		} catch (error) {
			console.warn('Failed to persist team to local database:', error);
		}
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
		const validated = In.updateTeamAgentSettings.parse(input);
		const { teamId, agentId, account_id, ...body } = validated;
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

		if (ctx.db.teamUsers && (response.id ?? agentId)) {
			try {
				await ctx.db.teamUsers.upsertByEntityId(`${teamId}:${agentId}`, {
					...response,
					team_id: teamId,
				});
			} catch (error) {
				console.warn(
					'Failed to persist team user settings to local database:',
					error,
				);
			}
		}

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
	const validated = In.removeTeamAgent.parse(input);
	const { teamId, agentId, account_id } = validated;
	const raw = await makeCallinglyRequest(
		`teams/${encodeURIComponent(String(teamId))}/agents/${encodeURIComponent(String(agentId))}`,
		ctx.key,
		{
			method: 'DELETE',
			accountId: account_id,
		},
	);
	const response = Out.removeTeamAgent.parse(raw ?? { success: true });

	if (ctx.db.teamUsers) {
		try {
			await ctx.db.teamUsers.deleteByEntityId(`${teamId}:${agentId}`);
		} catch (error) {
			console.warn('Failed to delete team agent from local database:', error);
		}
	}

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
	const validated = In.listClients.parse(input);
	const response = Out.listClients.parse(
		await makeCallinglyRequest('clients', ctx.key, {
			method: 'GET',
			query: validated,
		}),
	);

	if (ctx.db.clients) {
		try {
			const items = Array.isArray(response)
				? response
				: (response.clients ?? []);
			for (const item of items) {
				if (item.id) {
					await ctx.db.clients.upsertByEntityId(String(item.id), item);
				}
			}
		} catch (error) {
			console.warn('Failed to persist clients to local database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'callingly.clients.list',
		{ ...validated },
		'completed',
	);
	return response;
};

export const getClient: CallinglyEndpoints['getClient'] = async (
	ctx,
	input,
) => {
	const validated = In.getClient.parse(input);
	const response = Out.getClient.parse(
		await makeCallinglyRequest(
			`clients/${encodeURIComponent(String(validated.clientId))}`,
			ctx.key,
			{ method: 'GET' },
		),
	);

	if (ctx.db.clients && response.id) {
		try {
			await ctx.db.clients.upsertByEntityId(String(response.id), response);
		} catch (error) {
			console.warn('Failed to persist client to local database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'callingly.clients.get',
		{ clientId: validated.clientId },
		'completed',
	);
	return response;
};

export const createClient: CallinglyEndpoints['createClient'] = async (
	ctx,
	input,
) => {
	const validated = In.createClient.parse(input);
	const response = Out.createClient.parse(
		await makeCallinglyRequest('clients', ctx.key, {
			method: 'POST',
			body: validated,
		}),
	);

	if (ctx.db.clients && response.id) {
		try {
			await ctx.db.clients.upsertByEntityId(String(response.id), response);
		} catch (error) {
			console.warn('Failed to persist client to local database:', error);
		}
	}

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
	const validated = In.deleteClient.parse(input);
	const raw = await makeCallinglyRequest(
		`clients/${encodeURIComponent(String(validated.clientId))}`,
		ctx.key,
		{ method: 'DELETE' },
	);
	const response = Out.deleteClient.parse(raw ?? { success: true });

	if (ctx.db.clients) {
		try {
			await ctx.db.clients.deleteByEntityId(String(validated.clientId));
		} catch (error) {
			console.warn('Failed to delete client from local database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'callingly.clients.delete',
		{ clientId: validated.clientId },
		'completed',
	);
	return response;
};

export const setClientActive: CallinglyEndpoints['setClientActive'] = async (
	ctx,
	input,
) => {
	const validated = In.setClientActive.parse(input);
	const response = Out.setClientActive.parse(
		await makeCallinglyRequest(
			`clients/${encodeURIComponent(String(validated.clientId))}/active`,
			ctx.key,
			{
				method: 'POST',
				body: { is_active: validated.active ? 1 : 0 },
			},
		),
	);

	if (ctx.db.clients && response.id) {
		try {
			await ctx.db.clients.upsertByEntityId(String(response.id), response);
		} catch (error) {
			console.warn('Failed to persist client to local database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'callingly.clients.setActive',
		{ clientId: validated.clientId, active: validated.active },
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
	const validated = In.listWebhooks.parse(input);
	const { account_id, ...query } = validated;
	const response = Out.listWebhooks.parse(
		await makeCallinglyRequest('webhooks', ctx.key, {
			method: 'GET',
			query,
			accountId: account_id,
		}),
	);

	if (ctx.db.webhooks) {
		try {
			const items = Array.isArray(response)
				? response
				: (response.webhooks ?? []);
			for (const item of items) {
				if (item.id) {
					await ctx.db.webhooks.upsertByEntityId(String(item.id), item);
				}
			}
		} catch (error) {
			console.warn('Failed to persist webhooks to local database:', error);
		}
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
	const validated = In.getWebhook.parse(input);
	const { webhookId, account_id } = validated;
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

	if (ctx.db.webhooks && response.id) {
		try {
			await ctx.db.webhooks.upsertByEntityId(String(response.id), response);
		} catch (error) {
			console.warn('Failed to persist webhook to local database:', error);
		}
	}

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
	const validated = In.createWebhook.parse(input);
	const { account_id, ...body } = validated;
	const response = Out.createWebhook.parse(
		await makeCallinglyRequest('webhooks', ctx.key, {
			method: 'POST',
			body,
			accountId: account_id,
		}),
	);

	if (ctx.db.webhooks && response.id) {
		try {
			await ctx.db.webhooks.upsertByEntityId(String(response.id), response);
		} catch (error) {
			console.warn('Failed to persist webhook to local database:', error);
		}
	}

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
	const validated = In.updateWebhook.parse(input);
	const { webhookId, account_id, ...body } = validated;
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

	if (ctx.db.webhooks && response.id) {
		try {
			await ctx.db.webhooks.upsertByEntityId(String(response.id), response);
		} catch (error) {
			console.warn('Failed to persist webhook to local database:', error);
		}
	}

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
	const validated = In.deleteWebhook.parse(input);
	const { webhookId, account_id } = validated;
	const raw = await makeCallinglyRequest(
		`webhooks/${encodeURIComponent(String(webhookId))}`,
		ctx.key,
		{
			method: 'DELETE',
			accountId: account_id,
		},
	);
	const response = Out.deleteWebhook.parse(raw ?? { success: true });

	if (ctx.db.webhooks) {
		try {
			await ctx.db.webhooks.deleteByEntityId(String(webhookId));
		} catch (error) {
			console.warn('Failed to delete webhook from local database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'callingly.webhooks.delete',
		{ webhookId },
		'completed',
	);
	return response;
};
