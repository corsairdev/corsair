import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import type { DnsfilterEndpointOutputs } from './types';

// Bulk delete user agent - POST /v1/user_agent_bulk_deletes
export const userAgentBulkDeletesCreate: DnsfilterEndpoints['userAgentBulkDeletesCreate'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['userAgentBulkDeletesCreate']
		>('/v1/user_agent_bulk_deletes', ctx.key, {
			method: 'POST',
			query: {
				agent_state: input.agent_state,
				agent_version: input.agent_version,
				block_page_id: input.block_page_id,
				name_search: input.name_search,
				network_ids: input.network_ids,
				organization_id: input.organization_id,
				organization_ids: input.organization_ids,
				policy_id: input.policy_id,
				policy_schedule: input.policy_schedule,
				queue_uninstall: input.queue_uninstall,
				release_channels: input.release_channels,
				scheduled_policy_id: input.scheduled_policy_id,
				search: input.search,
				state: input.state,
				status: input.status,
				tags: input.tags,
				traffic_received_last_15_mins: input.traffic_received_last_15_mins,
				type: input.type,
			},
			body: {
				ids: input.ids,
				exclude_ids: input.exclude_ids,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.userAgentBulkDeletes.create',
			input ?? {},
			'completed',
		);
		return response;
	};

// Get an user agent bulk delete - GET /v1/user_agent_bulk_deletes/{id}
export const userAgentBulkDeletesGet: DnsfilterEndpoints['userAgentBulkDeletesGet'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['userAgentBulkDeletesGet']
		>('/v1/user_agent_bulk_deletes/{id}', ctx.key, {
			method: 'GET',
			path: {
				id: input.id,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.userAgentBulkDeletes.get',
			input ?? {},
			'completed',
		);
		return response;
	};

// Counts for user agent bulk deletes - GET /v1/user_agent_bulk_deletes/counts
export const userAgentBulkDeletesCounts: DnsfilterEndpoints['userAgentBulkDeletesCounts'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['userAgentBulkDeletesCounts']
		>('/v1/user_agent_bulk_deletes/counts', ctx.key, {
			method: 'GET',
			query: {
				agent_state: input.agent_state,
				name_search: input.name_search,
				network_ids: input.network_ids,
				organization_id: input.organization_id,
				search: input.search,
				state: input.state,
				status: input.status,
				tags: input.tags,
				traffic_received_last_15_mins: input.traffic_received_last_15_mins,
				type: input.type,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.userAgentBulkDeletes.counts',
			input ?? {},
			'completed',
		);
		return response;
	};
