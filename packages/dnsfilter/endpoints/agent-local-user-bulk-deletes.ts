import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import type { DnsfilterEndpointOutputs } from './types';

// Bulk delete agent local user - POST /v1/agent_local_user_bulk_deletes
export const agentLocalUserBulkDeletesCreate: DnsfilterEndpoints['agentLocalUserBulkDeletesCreate'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['agentLocalUserBulkDeletesCreate']
		>('/v1/agent_local_user_bulk_deletes', ctx.key, {
			method: 'POST',
			query: {
				block_page: input.block_page,
				collection_id: input.collection_id,
				friendly_name: input.friendly_name,
				name_search: input.name_search,
				policy_schedule: input.policy_schedule,
				search: input.search,
				user_login: input.user_login,
				user_name: input.user_name,
			},
			body: {
				ids: input.ids,
				exclude_ids: input.exclude_ids,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.agentLocalUserBulkDeletes.create',
			input ?? {},
			'completed',
		);
		return response;
	};

// Get an agent local user bulk delete - GET /v1/agent_local_user_bulk_deletes/{id}
export const agentLocalUserBulkDeletesGet: DnsfilterEndpoints['agentLocalUserBulkDeletesGet'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['agentLocalUserBulkDeletesGet']
		>('/v1/agent_local_user_bulk_deletes/{id}', ctx.key, {
			method: 'GET',
			path: {
				id: input.id,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.agentLocalUserBulkDeletes.get',
			input ?? {},
			'completed',
		);
		return response;
	};

// Counts for agent local user bulk deletes - GET /v1/agent_local_user_bulk_deletes/counts
export const agentLocalUserBulkDeletesCounts: DnsfilterEndpoints['agentLocalUserBulkDeletesCounts'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['agentLocalUserBulkDeletesCounts']
		>('/v1/agent_local_user_bulk_deletes/counts', ctx.key, {
			method: 'GET',
			query: {
				id: input.id,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.agentLocalUserBulkDeletes.counts',
			input ?? {},
			'completed',
		);
		return response;
	};
