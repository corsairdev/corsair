import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import type { DnsfilterEndpointOutputs } from './types';

// Bulk update user agent - POST /v1/user_agent_bulk_updates
export const userAgentBulkUpdatesCreate: DnsfilterEndpoints['userAgentBulkUpdatesCreate'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['userAgentBulkUpdatesCreate']
		>('/v1/user_agent_bulk_updates', ctx.key, {
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
				changeset: input.changeset,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.userAgentBulkUpdates.create',
			input ?? {},
			'completed',
		);
		return response;
	};

// Get a user agent bulk update - GET /v1/user_agent_bulk_updates/{id}
export const userAgentBulkUpdatesGet: DnsfilterEndpoints['userAgentBulkUpdatesGet'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['userAgentBulkUpdatesGet']
		>('/v1/user_agent_bulk_updates/{id}', ctx.key, {
			method: 'GET',
			path: {
				id: input.id,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.userAgentBulkUpdates.get',
			input ?? {},
			'completed',
		);
		return response;
	};

// Has mixed for user agent bulk updates - POST /v1/user_agent_bulk_updates/has_mixed
export const userAgentBulkUpdatesHasMixed: DnsfilterEndpoints['userAgentBulkUpdatesHasMixed'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['userAgentBulkUpdatesHasMixed']
		>('/v1/user_agent_bulk_updates/has_mixed', ctx.key, {
			method: 'POST',
			query: {
				agent_state: input.agent_state,
				name_search: input.name_search,
				network_ids: input.network_ids,
				organization_ids: input.organization_ids,
				search: input.search,
				state: input.state,
				status: input.status,
				tags: input.tags,
				traffic_received_last_15_mins: input.traffic_received_last_15_mins,
				type: input.type,
			},
			body: {
				ids: input.ids,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.userAgentBulkUpdates.hasMixed',
			input ?? {},
			'completed',
		);
		return response;
	};

// Counts for user agent bulk updates - GET /v1/user_agent_bulk_updates/counts
export const userAgentBulkUpdatesCounts: DnsfilterEndpoints['userAgentBulkUpdatesCounts'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['userAgentBulkUpdatesCounts']
		>('/v1/user_agent_bulk_updates/counts', ctx.key, {
			method: 'GET',
			query: {
				agent_state: input.agent_state,
				block_page_id: input.block_page_id,
				name_search: input.name_search,
				network_ids: input.network_ids,
				organization_id: input.organization_id,
				policy_id: input.policy_id,
				release_channels: input.release_channels,
				scheduled_policy_id: input.scheduled_policy_id,
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
			'dnsfilter.userAgentBulkUpdates.counts',
			input ?? {},
			'completed',
		);
		return response;
	};
