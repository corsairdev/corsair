import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import { redactSensitive } from '../redact';
import type { DnsfilterEndpointOutputs } from './types';
import {
	DnsfilterEndpointInputSchemas,
	DnsfilterEndpointOutputSchemas,
} from './types';

// Bulk delete agent local user - POST /v1/agent_local_user_bulk_deletes
export const agentLocalUserBulkDeletesCreate: DnsfilterEndpoints['agentLocalUserBulkDeletesCreate'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.agentLocalUserBulkDeletesCreate.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['agentLocalUserBulkDeletesCreate']
		>('/v1/agent_local_user_bulk_deletes', ctx.key, {
			method: 'POST',
			query: {
				block_page: values.block_page,
				collection_id: values.collection_id,
				friendly_name: values.friendly_name,
				name_search: values.name_search,
				policy_schedule: values.policy_schedule,
				search: values.search,
				user_login: values.user_login,
				user_name: values.user_name,
			},
			body: {
				ids: values.ids,
				exclude_ids: values.exclude_ids,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.agentLocalUserBulkDeletesCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dnsfilter.agentLocalUserBulkDeletes.create',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Get an agent local user bulk delete - GET /v1/agent_local_user_bulk_deletes/{id}
export const agentLocalUserBulkDeletesGet: DnsfilterEndpoints['agentLocalUserBulkDeletesGet'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.agentLocalUserBulkDeletesGet.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['agentLocalUserBulkDeletesGet']
		>('/v1/agent_local_user_bulk_deletes/{id}', ctx.key, {
			method: 'GET',
			path: {
				id: values.id,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.agentLocalUserBulkDeletesGet.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dnsfilter.agentLocalUserBulkDeletes.get',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Counts for agent local user bulk deletes - GET /v1/agent_local_user_bulk_deletes/counts
export const agentLocalUserBulkDeletesCounts: DnsfilterEndpoints['agentLocalUserBulkDeletesCounts'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.agentLocalUserBulkDeletesCounts.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['agentLocalUserBulkDeletesCounts']
		>('/v1/agent_local_user_bulk_deletes/counts', ctx.key, {
			method: 'GET',
			query: {
				id: values.id,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.agentLocalUserBulkDeletesCounts.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dnsfilter.agentLocalUserBulkDeletes.counts',
			redactSensitive(values),
			'completed',
		);
		return result;
	};
