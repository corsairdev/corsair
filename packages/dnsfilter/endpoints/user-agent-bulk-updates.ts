import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import { redactSensitive } from '../redact';
import type { DnsfilterEndpointOutputs } from './types';
import {
	DnsfilterEndpointInputSchemas,
	DnsfilterEndpointOutputSchemas,
} from './types';

// Bulk update user agent - POST /v1/user_agent_bulk_updates
export const userAgentBulkUpdatesCreate: DnsfilterEndpoints['userAgentBulkUpdatesCreate'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.userAgentBulkUpdatesCreate.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['userAgentBulkUpdatesCreate']
		>('/v1/user_agent_bulk_updates', ctx.key, {
			method: 'POST',
			query: {
				agent_state: values.agent_state,
				agent_version: values.agent_version,
				block_page_id: values.block_page_id,
				name_search: values.name_search,
				network_ids: values.network_ids,
				organization_id: values.organization_id,
				organization_ids: values.organization_ids,
				policy_id: values.policy_id,
				policy_schedule: values.policy_schedule,
				release_channels: values.release_channels,
				scheduled_policy_id: values.scheduled_policy_id,
				search: values.search,
				state: values.state,
				status: values.status,
				tags: values.tags,
				traffic_received_last_15_mins: values.traffic_received_last_15_mins,
				type: values.type,
			},
			body: {
				ids: values.ids,
				exclude_ids: values.exclude_ids,
				changeset: values.changeset,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.userAgentBulkUpdatesCreate.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.userAgentBulkUpdates.create',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Get a user agent bulk update - GET /v1/user_agent_bulk_updates/{id}
export const userAgentBulkUpdatesGet: DnsfilterEndpoints['userAgentBulkUpdatesGet'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.userAgentBulkUpdatesGet.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['userAgentBulkUpdatesGet']
		>('/v1/user_agent_bulk_updates/{id}', ctx.key, {
			method: 'GET',
			path: {
				id: values.id,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.userAgentBulkUpdatesGet.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.userAgentBulkUpdates.get',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Has mixed for user agent bulk updates - POST /v1/user_agent_bulk_updates/has_mixed
export const userAgentBulkUpdatesHasMixed: DnsfilterEndpoints['userAgentBulkUpdatesHasMixed'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.userAgentBulkUpdatesHasMixed.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['userAgentBulkUpdatesHasMixed']
		>('/v1/user_agent_bulk_updates/has_mixed', ctx.key, {
			method: 'POST',
			query: {
				agent_state: values.agent_state,
				name_search: values.name_search,
				network_ids: values.network_ids,
				organization_ids: values.organization_ids,
				search: values.search,
				state: values.state,
				status: values.status,
				tags: values.tags,
				traffic_received_last_15_mins: values.traffic_received_last_15_mins,
				type: values.type,
			},
			body: {
				ids: values.ids,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.userAgentBulkUpdatesHasMixed.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dnsfilter.userAgentBulkUpdates.hasMixed',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Counts for user agent bulk updates - GET /v1/user_agent_bulk_updates/counts
export const userAgentBulkUpdatesCounts: DnsfilterEndpoints['userAgentBulkUpdatesCounts'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.userAgentBulkUpdatesCounts.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['userAgentBulkUpdatesCounts']
		>('/v1/user_agent_bulk_updates/counts', ctx.key, {
			method: 'GET',
			query: {
				agent_state: values.agent_state,
				block_page_id: values.block_page_id,
				name_search: values.name_search,
				network_ids: values.network_ids,
				organization_id: values.organization_id,
				policy_id: values.policy_id,
				release_channels: values.release_channels,
				scheduled_policy_id: values.scheduled_policy_id,
				search: values.search,
				state: values.state,
				status: values.status,
				tags: values.tags,
				traffic_received_last_15_mins: values.traffic_received_last_15_mins,
				type: values.type,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.userAgentBulkUpdatesCounts.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.userAgentBulkUpdates.counts',
			redactSensitive(values),
			'completed',
		);
		return result;
	};
