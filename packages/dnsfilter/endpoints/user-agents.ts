import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import { persistUserAgents } from '../persistence';
import type { DnsfilterEndpointOutputs } from './types';

// List user agents - GET /v1/user_agents
export const userAgentsList: DnsfilterEndpoints['userAgentsList'] = async (
	ctx,
	input,
) => {
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['userAgentsList']
	>('/v1/user_agents', ctx.key, {
		method: 'GET',
		query: {
			agent_local_user_uuids: input.agent_local_user_uuids,
			agent_state: input.agent_state,
			agent_type: input.agent_type,
			agent_version: input.agent_version,
			auto_update: input.auto_update,
			block_page_id: input.block_page_id,
			browser_extension_status: input.browser_extension_status,
			cybersight_enabled: input.cybersight_enabled,
			cybersight_status: input.cybersight_status,
			end_at: input.end_at,
			msp_id: input.msp_id,
			name_search: input.name_search,
			network_ids: input.network_ids,
			new_agent_states: input.new_agent_states,
			organization_ids: input.organization_ids,
			page: input.page,
			policy_id: input.policy_id,
			policy_schedule: input.policy_schedule,
			release_channels: input.release_channels,
			scheduled_policy_id: input.scheduled_policy_id,
			search: input.search,
			sort: input.sort,
			start_at: input.start_at,
			state: input.state,
			status: input.status,
			tags: input.tags,
			traffic_received_last_15_mins: input.traffic_received_last_15_mins,
			type: input.type,
			vpn_mode: input.vpn_mode,
			vpn_status: input.vpn_status,
		},
	});
	await persistUserAgents(ctx, response);
	await logEventFromContext(
		ctx,
		'dnsfilter.userAgents.list',
		input ?? {},
		'completed',
	);
	return response;
};

// List all user agents - GET /v1/user_agents/all
export const userAgentsListAll: DnsfilterEndpoints['userAgentsListAll'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['userAgentsListAll']
		>('/v1/user_agents/all', ctx.key, {
			method: 'GET',
			query: {
				agent_local_user_uuids: input.agent_local_user_uuids,
				cybersight_enabled: input.cybersight_enabled,
				end_at: input.end_at,
				network_ids: input.network_ids,
				organization_id: input.organization_id,
				page: input.page,
				search: input.search,
				sort: input.sort,
				start_at: input.start_at,
				state: input.state,
				status: input.status,
				tags: input.tags,
				type: input.type,
			},
		});
		await persistUserAgents(ctx, response);
		await logEventFromContext(
			ctx,
			'dnsfilter.userAgents.listAll',
			input ?? {},
			'completed',
		);
		return response;
	};

// Counts for user agents - GET /v1/user_agents/counts
export const userAgentsCounts: DnsfilterEndpoints['userAgentsCounts'] = async (
	ctx,
	input,
) => {
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['userAgentsCounts']
	>('/v1/user_agents/counts', ctx.key, {
		method: 'GET',
		query: {
			msp_id: input.msp_id,
			name_search: input.name_search,
			network_ids: input.network_ids,
			new_agent_states: input.new_agent_states,
			organization_ids: input.organization_ids,
			release_channels: input.release_channels,
			search: input.search,
			state: input.state,
			status: input.status,
			tags: input.tags,
			type: input.type,
		},
	});
	await logEventFromContext(
		ctx,
		'dnsfilter.userAgents.counts',
		input ?? {},
		'completed',
	);
	return response;
};

// Get a user agent - GET /v1/user_agents/{id}
export const userAgentsGet: DnsfilterEndpoints['userAgentsGet'] = async (
	ctx,
	input,
) => {
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['userAgentsGet']
	>('/v1/user_agents/{id}', ctx.key, {
		method: 'GET',
		path: {
			id: input.id,
		},
	});
	await persistUserAgents(ctx, response);
	await logEventFromContext(
		ctx,
		'dnsfilter.userAgents.get',
		input ?? {},
		'completed',
	);
	return response;
};

// Update a user agent - PATCH /v1/user_agents/{id}
export const userAgentsUpdate: DnsfilterEndpoints['userAgentsUpdate'] = async (
	ctx,
	input,
) => {
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['userAgentsUpdate']
	>('/v1/user_agents/{id}', ctx.key, {
		method: 'PATCH',
		path: {
			id: input.id,
		},
		body: {
			user_agent: input.user_agent,
		},
	});
	await persistUserAgents(ctx, response);
	await logEventFromContext(
		ctx,
		'dnsfilter.userAgents.update',
		input ?? {},
		'completed',
	);
	return response;
};

// Delete a user agent - DELETE /v1/user_agents/{id}
export const userAgentsDelete: DnsfilterEndpoints['userAgentsDelete'] = async (
	ctx,
	input,
) => {
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['userAgentsDelete']
	>('/v1/user_agents/{id}', ctx.key, {
		method: 'DELETE',
		path: {
			id: input.id,
		},
		query: {
			clear_registry: input.clear_registry,
			queue_uninstall: input.queue_uninstall,
		},
	});
	await logEventFromContext(
		ctx,
		'dnsfilter.userAgents.delete',
		input ?? {},
		'completed',
	);
	return response;
};

// Tags for user agents - GET /v1/user_agents/tags
export const userAgentsTags: DnsfilterEndpoints['userAgentsTags'] = async (
	ctx,
	input,
) => {
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['userAgentsTags']
	>('/v1/user_agents/tags', ctx.key, {
		method: 'GET',
		query: {
			include_used_only: input.include_used_only,
			msp_id: input.msp_id,
			network_ids: input.network_ids,
			organization_ids: input.organization_ids,
		},
	});
	await logEventFromContext(
		ctx,
		'dnsfilter.userAgents.tags',
		input ?? {},
		'completed',
	);
	return response;
};

// Dequeue uninstall for user agents - POST /v1/user_agents/dequeue_uninstall
export const userAgentsDequeueUninstall: DnsfilterEndpoints['userAgentsDequeueUninstall'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['userAgentsDequeueUninstall']
		>('/v1/user_agents/dequeue_uninstall', ctx.key, {
			method: 'POST',
			query: {
				id: input.id,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.userAgents.dequeueUninstall',
			input ?? {},
			'completed',
		);
		return response;
	};

// Uninstall pin for user agents - GET /v1/user_agents/uninstall_pin
export const userAgentsUninstallPin: DnsfilterEndpoints['userAgentsUninstallPin'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['userAgentsUninstallPin']
		>('/v1/user_agents/uninstall_pin', ctx.key, {
			method: 'GET',
			query: {
				organization_id: input.organization_id,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.userAgents.uninstallPin',
			input ?? {},
			'completed',
		);
		return response;
	};
