import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import { redactSensitive } from '../redact';
import type { DnsfilterEndpointOutputs } from './types';
import {
	DnsfilterEndpointInputSchemas,
	DnsfilterEndpointOutputSchemas,
} from './types';

// Bulk delete user agent - POST /v1/user_agent_bulk_deletes
export const userAgentBulkDeletesCreate: DnsfilterEndpoints['userAgentBulkDeletesCreate'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.userAgentBulkDeletesCreate.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['userAgentBulkDeletesCreate']
		>('/v1/user_agent_bulk_deletes', ctx.key, {
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
				queue_uninstall: values.queue_uninstall,
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
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.userAgentBulkDeletesCreate.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.userAgentBulkDeletes.create',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Get a user agent bulk delete - GET /v1/user_agent_bulk_deletes/{id}
export const userAgentBulkDeletesGet: DnsfilterEndpoints['userAgentBulkDeletesGet'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.userAgentBulkDeletesGet.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['userAgentBulkDeletesGet']
		>('/v1/user_agent_bulk_deletes/{id}', ctx.key, {
			method: 'GET',
			path: {
				id: values.id,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.userAgentBulkDeletesGet.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.userAgentBulkDeletes.get',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Counts for user agent bulk deletes - GET /v1/user_agent_bulk_deletes/counts
export const userAgentBulkDeletesCounts: DnsfilterEndpoints['userAgentBulkDeletesCounts'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.userAgentBulkDeletesCounts.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['userAgentBulkDeletesCounts']
		>('/v1/user_agent_bulk_deletes/counts', ctx.key, {
			method: 'GET',
			query: {
				agent_state: values.agent_state,
				name_search: values.name_search,
				network_ids: values.network_ids,
				organization_id: values.organization_id,
				search: values.search,
				state: values.state,
				status: values.status,
				tags: values.tags,
				traffic_received_last_15_mins: values.traffic_received_last_15_mins,
				type: values.type,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.userAgentBulkDeletesCounts.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.userAgentBulkDeletes.counts',
			redactSensitive(values),
			'completed',
		);
		return result;
	};
