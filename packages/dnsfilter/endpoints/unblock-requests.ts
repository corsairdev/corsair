import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import { persistUnblockRequests } from '../persistence';
import type { DnsfilterEndpointOutputs } from './types';

// List unblock requests - GET /v2/unblock_requests
export const unblockRequestsList: DnsfilterEndpoints['unblockRequestsList'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['unblockRequestsList']
		>('/v2/unblock_requests', ctx.key, {
			method: 'GET',
			query: {
				actioned_by: input.actioned_by,
				category: input.category,
				deployment: input.deployment,
				deployment_type: input.deployment_type,
				domain: input.domain,
				email: input.email,
				logged_in_user: input.logged_in_user,
				msp_id: input.msp_id,
				organization: input.organization,
				organization_id: input.organization_id,
				organization_ids: input.organization_ids,
				page: input.page,
				policy: input.policy,
				request_reason: input.request_reason,
				resolved_date: input.resolved_date,
				search: input.search,
				site: input.site,
				sort: input.sort,
				status: input.status,
				tab: input.tab,
				time_of_attempt: input.time_of_attempt,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.unblockRequests.list',
			input ?? {},
			'completed',
		);
		return response;
	};

// Counts for unblock requests - GET /v2/unblock_requests/counts
export const unblockRequestsCounts: DnsfilterEndpoints['unblockRequestsCounts'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['unblockRequestsCounts']
		>('/v2/unblock_requests/counts', ctx.key, {
			method: 'GET',
			query: {
				msp_id: input.msp_id,
				organization_id: input.organization_id,
				organization_ids: input.organization_ids,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.unblockRequests.counts',
			input ?? {},
			'completed',
		);
		return response;
	};

// Pending count for unblock requests - GET /v2/unblock_requests/pending_count
export const unblockRequestsPendingCount: DnsfilterEndpoints['unblockRequestsPendingCount'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['unblockRequestsPendingCount']
		>('/v2/unblock_requests/pending_count', ctx.key, {
			method: 'GET',
			query: {
				msp_id: input.msp_id,
				organization_id: input.organization_id,
				organization_ids: input.organization_ids,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.unblockRequests.pendingCount',
			input ?? {},
			'completed',
		);
		return response;
	};

// Get an unblock request - GET /v2/unblock_requests/{id}
export const unblockRequestsGet: DnsfilterEndpoints['unblockRequestsGet'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['unblockRequestsGet']
		>('/v2/unblock_requests/{id}', ctx.key, {
			method: 'GET',
			path: {
				id: input.id,
			},
		});
		await persistUnblockRequests(ctx, response);
		await logEventFromContext(
			ctx,
			'dnsfilter.unblockRequests.get',
			input ?? {},
			'completed',
		);
		return response;
	};

// Decision for unblock requests - POST /v2/unblock_requests/{id}/decision
export const unblockRequestsDecision: DnsfilterEndpoints['unblockRequestsDecision'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['unblockRequestsDecision']
		>('/v2/unblock_requests/{id}/decision', ctx.key, {
			method: 'POST',
			path: {
				id: input.id,
			},
			body: {
				decision: input.decision,
				domains: input.domains,
				message: input.message,
				internal_notes: input.internal_notes,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.unblockRequests.decision',
			input ?? {},
			'completed',
		);
		return response;
	};
