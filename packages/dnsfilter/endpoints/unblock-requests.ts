import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import { persistUnblockRequests } from '../persistence';
import { redactSensitive } from '../redact';
import type { DnsfilterEndpointOutputs } from './types';
import {
	DnsfilterEndpointInputSchemas,
	DnsfilterEndpointOutputSchemas,
} from './types';

// List unblock requests - GET /v2/unblock_requests
export const unblockRequestsList: DnsfilterEndpoints['unblockRequestsList'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.unblockRequestsList.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['unblockRequestsList']
		>('/v2/unblock_requests', ctx.key, {
			method: 'GET',
			query: {
				actioned_by: values.actioned_by,
				category: values.category,
				deployment: values.deployment,
				deployment_type: values.deployment_type,
				domain: values.domain,
				email: values.email,
				logged_in_user: values.logged_in_user,
				msp_id: values.msp_id,
				organization: values.organization,
				organization_id: values.organization_id,
				organization_ids: values.organization_ids,
				page: values.page,
				policy: values.policy,
				request_reason: values.request_reason,
				resolved_date: values.resolved_date,
				search: values.search,
				site: values.site,
				sort: values.sort,
				status: values.status,
				tab: values.tab,
				time_of_attempt: values.time_of_attempt,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.unblockRequestsList.parse(response);
		await persistUnblockRequests(ctx, result);
		await logEventFromContext(
			ctx,
			'dnsfilter.unblockRequests.list',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Counts for unblock requests - GET /v2/unblock_requests/counts
export const unblockRequestsCounts: DnsfilterEndpoints['unblockRequestsCounts'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.unblockRequestsCounts.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['unblockRequestsCounts']
		>('/v2/unblock_requests/counts', ctx.key, {
			method: 'GET',
			query: {
				msp_id: values.msp_id,
				organization_id: values.organization_id,
				organization_ids: values.organization_ids,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.unblockRequestsCounts.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.unblockRequests.counts',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Pending count for unblock requests - GET /v2/unblock_requests/pending_count
export const unblockRequestsPendingCount: DnsfilterEndpoints['unblockRequestsPendingCount'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.unblockRequestsPendingCount.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['unblockRequestsPendingCount']
		>('/v2/unblock_requests/pending_count', ctx.key, {
			method: 'GET',
			query: {
				msp_id: values.msp_id,
				organization_id: values.organization_id,
				organization_ids: values.organization_ids,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.unblockRequestsPendingCount.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dnsfilter.unblockRequests.pendingCount',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Get an unblock request - GET /v2/unblock_requests/{id}
export const unblockRequestsGet: DnsfilterEndpoints['unblockRequestsGet'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.unblockRequestsGet.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['unblockRequestsGet']
		>('/v2/unblock_requests/{id}', ctx.key, {
			method: 'GET',
			path: {
				id: values.id,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.unblockRequestsGet.parse(response);
		await persistUnblockRequests(ctx, result);
		await logEventFromContext(
			ctx,
			'dnsfilter.unblockRequests.get',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Decision for unblock requests - POST /v2/unblock_requests/{id}/decision
export const unblockRequestsDecision: DnsfilterEndpoints['unblockRequestsDecision'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.unblockRequestsDecision.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['unblockRequestsDecision']
		>('/v2/unblock_requests/{id}/decision', ctx.key, {
			method: 'POST',
			path: {
				id: values.id,
			},
			body: {
				decision: values.decision,
				domains: values.domains,
				message: values.message,
				internal_notes: values.internal_notes,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.unblockRequestsDecision.parse(response);
		await persistUnblockRequests(ctx, result);
		await logEventFromContext(
			ctx,
			'dnsfilter.unblockRequests.decision',
			redactSensitive(values),
			'completed',
		);
		return result;
	};
