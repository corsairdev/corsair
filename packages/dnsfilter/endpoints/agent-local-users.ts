import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import { redactSensitive } from '../redact';
import type { DnsfilterEndpointOutputs } from './types';
import {
	DnsfilterEndpointInputSchemas,
	DnsfilterEndpointOutputSchemas,
} from './types';

// List agent local users - GET /v1/agent_local_users
export const agentLocalUsersList: DnsfilterEndpoints['agentLocalUsersList'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.agentLocalUsersList.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['agentLocalUsersList']
		>('/v1/agent_local_users', ctx.key, {
			method: 'GET',
			query: {
				block_page: values.block_page,
				collection_id: values.collection_id,
				cybersight_enabled: values.cybersight_enabled,
				end_at: values.end_at,
				friendly_name: values.friendly_name,
				ids: values.ids,
				in_a_collection: values.in_a_collection,
				msp_id: values.msp_id,
				name: values.name,
				organization_ids: values.organization_ids,
				page: values.page,
				policy_schedule: values.policy_schedule,
				search: values.search,
				sort: values.sort,
				start_at: values.start_at,
				user_agent_uuids: values.user_agent_uuids,
				user_login: values.user_login,
				user_name: values.user_name,
				user_policy_override: values.user_policy_override,
				uuids: values.uuids,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.agentLocalUsersList.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.agentLocalUsers.list',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// List all agent local users - GET /v1/agent_local_users/all
export const agentLocalUsersListAll: DnsfilterEndpoints['agentLocalUsersListAll'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.agentLocalUsersListAll.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['agentLocalUsersListAll']
		>('/v1/agent_local_users/all', ctx.key, {
			method: 'GET',
			query: {
				cybersight_enabled: values.cybersight_enabled,
				end_at: values.end_at,
				in_a_collection: values.in_a_collection,
				name: values.name,
				organization_ids: values.organization_ids,
				page: values.page,
				sort: values.sort,
				start_at: values.start_at,
				user_agent_uuids: values.user_agent_uuids,
				user_policy_override: values.user_policy_override,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.agentLocalUsersListAll.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.agentLocalUsers.listAll',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Get an agent local user - GET /v1/agent_local_users/{id}
export const agentLocalUsersGet: DnsfilterEndpoints['agentLocalUsersGet'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.agentLocalUsersGet.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['agentLocalUsersGet']
		>('/v1/agent_local_users/{id}', ctx.key, {
			method: 'GET',
			path: {
				id: values.id,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.agentLocalUsersGet.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.agentLocalUsers.get',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Update an agent local user - PATCH /v1/agent_local_users/{id}
export const agentLocalUsersUpdate: DnsfilterEndpoints['agentLocalUsersUpdate'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.agentLocalUsersUpdate.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['agentLocalUsersUpdate']
		>('/v1/agent_local_users/{id}', ctx.key, {
			method: 'PATCH',
			path: {
				id: values.id,
			},
			body: {
				agent_local_user: values.agent_local_user,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.agentLocalUsersUpdate.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.agentLocalUsers.update',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Delete an agent local user - DELETE /v1/agent_local_users/{id}
export const agentLocalUsersDelete: DnsfilterEndpoints['agentLocalUsersDelete'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.agentLocalUsersDelete.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['agentLocalUsersDelete']
		>('/v1/agent_local_users/{id}', ctx.key, {
			method: 'DELETE',
			path: {
				id: values.id,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.agentLocalUsersDelete.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.agentLocalUsers.delete',
			redactSensitive(values),
			'completed',
		);
		return result;
	};
