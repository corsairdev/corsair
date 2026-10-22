import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import { persistUserAgents } from '../persistence';
import { redactSensitive } from '../redact';
import type { DnsfilterEndpointOutputs } from './types';
import {
	DnsfilterEndpointInputSchemas,
	DnsfilterEndpointOutputSchemas,
} from './types';

// List user agents - GET /v1/user_agents
export const userAgentsList: DnsfilterEndpoints['userAgentsList'] = async (
	ctx,
	input,
) => {
	const values = DnsfilterEndpointInputSchemas.userAgentsList.parse(
		input ?? {},
	);
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['userAgentsList']
	>('/v1/user_agents', ctx.key, {
		method: 'GET',
		query: {
			agent_local_user_uuids: values.agent_local_user_uuids,
			agent_state: values.agent_state,
			agent_type: values.agent_type,
			agent_version: values.agent_version,
			auto_update: values.auto_update,
			block_page_id: values.block_page_id,
			browser_extension_status: values.browser_extension_status,
			cybersight_enabled: values.cybersight_enabled,
			cybersight_status: values.cybersight_status,
			end_at: values.end_at,
			msp_id: values.msp_id,
			name_search: values.name_search,
			network_ids: values.network_ids,
			new_agent_states: values.new_agent_states,
			organization_ids: values.organization_ids,
			page: values.page,
			policy_id: values.policy_id,
			policy_schedule: values.policy_schedule,
			release_channels: values.release_channels,
			scheduled_policy_id: values.scheduled_policy_id,
			search: values.search,
			sort: values.sort,
			start_at: values.start_at,
			state: values.state,
			status: values.status,
			tags: values.tags,
			traffic_received_last_15_mins: values.traffic_received_last_15_mins,
			type: values.type,
			vpn_mode: values.vpn_mode,
			vpn_status: values.vpn_status,
		},
	});
	const result = DnsfilterEndpointOutputSchemas.userAgentsList.parse(response);
	await persistUserAgents(ctx, result);
	await logEventFromContext(
		ctx,
		'dnsfilter.userAgents.list',
		redactSensitive(values),
		'completed',
	);
	return result;
};

// List all user agents - GET /v1/user_agents/all
export const userAgentsListAll: DnsfilterEndpoints['userAgentsListAll'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.userAgentsListAll.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['userAgentsListAll']
		>('/v1/user_agents/all', ctx.key, {
			method: 'GET',
			query: {
				agent_local_user_uuids: values.agent_local_user_uuids,
				cybersight_enabled: values.cybersight_enabled,
				end_at: values.end_at,
				network_ids: values.network_ids,
				organization_id: values.organization_id,
				page: values.page,
				search: values.search,
				sort: values.sort,
				start_at: values.start_at,
				state: values.state,
				status: values.status,
				tags: values.tags,
				type: values.type,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.userAgentsListAll.parse(response);
		await persistUserAgents(ctx, result);
		await logEventFromContext(
			ctx,
			'dnsfilter.userAgents.listAll',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Counts for user agents - GET /v1/user_agents/counts
export const userAgentsCounts: DnsfilterEndpoints['userAgentsCounts'] = async (
	ctx,
	input,
) => {
	const values = DnsfilterEndpointInputSchemas.userAgentsCounts.parse(
		input ?? {},
	);
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['userAgentsCounts']
	>('/v1/user_agents/counts', ctx.key, {
		method: 'GET',
		query: {
			msp_id: values.msp_id,
			name_search: values.name_search,
			network_ids: values.network_ids,
			new_agent_states: values.new_agent_states,
			organization_ids: values.organization_ids,
			release_channels: values.release_channels,
			search: values.search,
			state: values.state,
			status: values.status,
			tags: values.tags,
			type: values.type,
		},
	});
	const result =
		DnsfilterEndpointOutputSchemas.userAgentsCounts.parse(response);
	await logEventFromContext(
		ctx,
		'dnsfilter.userAgents.counts',
		redactSensitive(values),
		'completed',
	);
	return result;
};

// Get a user agent - GET /v1/user_agents/{id}
export const userAgentsGet: DnsfilterEndpoints['userAgentsGet'] = async (
	ctx,
	input,
) => {
	const values = DnsfilterEndpointInputSchemas.userAgentsGet.parse(input ?? {});
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['userAgentsGet']
	>('/v1/user_agents/{id}', ctx.key, {
		method: 'GET',
		path: {
			id: values.id,
		},
	});
	const result = DnsfilterEndpointOutputSchemas.userAgentsGet.parse(response);
	await persistUserAgents(ctx, result);
	await logEventFromContext(
		ctx,
		'dnsfilter.userAgents.get',
		redactSensitive(values),
		'completed',
	);
	return result;
};

// Update a user agent - PATCH /v1/user_agents/{id}
export const userAgentsUpdate: DnsfilterEndpoints['userAgentsUpdate'] = async (
	ctx,
	input,
) => {
	const values = DnsfilterEndpointInputSchemas.userAgentsUpdate.parse(
		input ?? {},
	);
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['userAgentsUpdate']
	>('/v1/user_agents/{id}', ctx.key, {
		method: 'PATCH',
		path: {
			id: values.id,
		},
		body: {
			user_agent: values.user_agent,
		},
	});
	const result =
		DnsfilterEndpointOutputSchemas.userAgentsUpdate.parse(response);
	await persistUserAgents(ctx, result);
	await logEventFromContext(
		ctx,
		'dnsfilter.userAgents.update',
		redactSensitive(values),
		'completed',
	);
	return result;
};

// Delete a user agent - DELETE /v1/user_agents/{id}
export const userAgentsDelete: DnsfilterEndpoints['userAgentsDelete'] = async (
	ctx,
	input,
) => {
	const values = DnsfilterEndpointInputSchemas.userAgentsDelete.parse(
		input ?? {},
	);
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['userAgentsDelete']
	>('/v1/user_agents/{id}', ctx.key, {
		method: 'DELETE',
		path: {
			id: values.id,
		},
		query: {
			clear_registry: values.clear_registry,
			queue_uninstall: values.queue_uninstall,
		},
	});
	const result =
		DnsfilterEndpointOutputSchemas.userAgentsDelete.parse(response);
	try {
		await ctx.db.userAgents.deleteByEntityId(String(values.id));
	} catch (error) {
		console.warn('Failed to evict DNSFilter userAgents row:', error);
	}
	await logEventFromContext(
		ctx,
		'dnsfilter.userAgents.delete',
		redactSensitive(values),
		'completed',
	);
	return result;
};

// Tags for user agents - GET /v1/user_agents/tags
export const userAgentsTags: DnsfilterEndpoints['userAgentsTags'] = async (
	ctx,
	input,
) => {
	const values = DnsfilterEndpointInputSchemas.userAgentsTags.parse(
		input ?? {},
	);
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['userAgentsTags']
	>('/v1/user_agents/tags', ctx.key, {
		method: 'GET',
		query: {
			include_used_only: values.include_used_only,
			msp_id: values.msp_id,
			network_ids: values.network_ids,
			organization_ids: values.organization_ids,
		},
	});
	const result = DnsfilterEndpointOutputSchemas.userAgentsTags.parse(response);
	await logEventFromContext(
		ctx,
		'dnsfilter.userAgents.tags',
		redactSensitive(values),
		'completed',
	);
	return result;
};

// Dequeue uninstall for user agents - POST /v1/user_agents/dequeue_uninstall
export const userAgentsDequeueUninstall: DnsfilterEndpoints['userAgentsDequeueUninstall'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.userAgentsDequeueUninstall.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['userAgentsDequeueUninstall']
		>('/v1/user_agents/dequeue_uninstall', ctx.key, {
			method: 'POST',
			query: {
				id: values.id,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.userAgentsDequeueUninstall.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.userAgents.dequeueUninstall',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Uninstall pin for user agents - GET /v1/user_agents/uninstall_pin
export const userAgentsUninstallPin: DnsfilterEndpoints['userAgentsUninstallPin'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.userAgentsUninstallPin.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['userAgentsUninstallPin']
		>('/v1/user_agents/uninstall_pin', ctx.key, {
			method: 'GET',
			query: {
				organization_id: values.organization_id,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.userAgentsUninstallPin.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.userAgents.uninstallPin',
			redactSensitive(values),
			'completed',
		);
		return result;
	};
