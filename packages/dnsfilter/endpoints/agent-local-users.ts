import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import type { DnsfilterEndpointOutputs } from './types';

// List agent local users - GET /v1/agent_local_users
export const agentLocalUsersList: DnsfilterEndpoints['agentLocalUsersList'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['agentLocalUsersList']
		>('/v1/agent_local_users', ctx.key, {
			method: 'GET',
			query: {
				block_page: input.block_page,
				collection_id: input.collection_id,
				cybersight_enabled: input.cybersight_enabled,
				end_at: input.end_at,
				friendly_name: input.friendly_name,
				ids: input.ids,
				in_a_collection: input.in_a_collection,
				msp_id: input.msp_id,
				name: input.name,
				organization_ids: input.organization_ids,
				page: input.page,
				policy_schedule: input.policy_schedule,
				search: input.search,
				sort: input.sort,
				start_at: input.start_at,
				user_agent_uuids: input.user_agent_uuids,
				user_login: input.user_login,
				user_name: input.user_name,
				user_policy_override: input.user_policy_override,
				uuids: input.uuids,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.agentLocalUsers.list',
			input ?? {},
			'completed',
		);
		return response;
	};

// List all agent local users - GET /v1/agent_local_users/all
export const agentLocalUsersListAll: DnsfilterEndpoints['agentLocalUsersListAll'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['agentLocalUsersListAll']
		>('/v1/agent_local_users/all', ctx.key, {
			method: 'GET',
			query: {
				cybersight_enabled: input.cybersight_enabled,
				end_at: input.end_at,
				in_a_collection: input.in_a_collection,
				name: input.name,
				organization_ids: input.organization_ids,
				page: input.page,
				sort: input.sort,
				start_at: input.start_at,
				user_agent_uuids: input.user_agent_uuids,
				user_policy_override: input.user_policy_override,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.agentLocalUsers.listAll',
			input ?? {},
			'completed',
		);
		return response;
	};

// Get an agent local user - GET /v1/agent_local_users/{id}
export const agentLocalUsersGet: DnsfilterEndpoints['agentLocalUsersGet'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['agentLocalUsersGet']
		>('/v1/agent_local_users/{id}', ctx.key, {
			method: 'GET',
			path: {
				id: input.id,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.agentLocalUsers.get',
			input ?? {},
			'completed',
		);
		return response;
	};

// Update an agent local user - PATCH /v1/agent_local_users/{id}
export const agentLocalUsersUpdate: DnsfilterEndpoints['agentLocalUsersUpdate'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['agentLocalUsersUpdate']
		>('/v1/agent_local_users/{id}', ctx.key, {
			method: 'PATCH',
			path: {
				id: input.id,
			},
			body: {
				agent_local_user: input.agent_local_user,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.agentLocalUsers.update',
			input ?? {},
			'completed',
		);
		return response;
	};

// Delete an agent local user - DELETE /v1/agent_local_users/{id}
export const agentLocalUsersDelete: DnsfilterEndpoints['agentLocalUsersDelete'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['agentLocalUsersDelete']
		>('/v1/agent_local_users/{id}', ctx.key, {
			method: 'DELETE',
			path: {
				id: input.id,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.agentLocalUsers.delete',
			input ?? {},
			'completed',
		);
		return response;
	};
