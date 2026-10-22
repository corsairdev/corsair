import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import type { DnsfilterEndpointOutputs } from './types';

// List scheduled policies - GET /v1/scheduled_policies
export const scheduledPoliciesList: DnsfilterEndpoints['scheduledPoliciesList'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['scheduledPoliciesList']
		>('/v1/scheduled_policies', ctx.key, {
			method: 'GET',
			query: {
				page: input.page,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.scheduledPolicies.list',
			input ?? {},
			'completed',
		);
		return response;
	};

// Create a scheduled policy - POST /v1/scheduled_policies
export const scheduledPoliciesCreate: DnsfilterEndpoints['scheduledPoliciesCreate'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['scheduledPoliciesCreate']
		>('/v1/scheduled_policies', ctx.key, {
			method: 'POST',
			body: {
				name: input.name,
				organization_id: input.organization_id,
				policy_ids: input.policy_ids,
				timezone: input.timezone,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.scheduledPolicies.create',
			input ?? {},
			'completed',
		);
		return response;
	};

// List all scheduled policies - GET /v1/scheduled_policies/all
export const scheduledPoliciesListAll: DnsfilterEndpoints['scheduledPoliciesListAll'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['scheduledPoliciesListAll']
		>('/v1/scheduled_policies/all', ctx.key, {
			method: 'GET',
			query: {
				page: input.page,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.scheduledPolicies.listAll',
			input ?? {},
			'completed',
		);
		return response;
	};

// Get a scheduled policy - GET /v1/scheduled_policies/{id}
export const scheduledPoliciesGet: DnsfilterEndpoints['scheduledPoliciesGet'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['scheduledPoliciesGet']
		>('/v1/scheduled_policies/{id}', ctx.key, {
			method: 'GET',
			path: {
				id: input.id,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.scheduledPolicies.get',
			input ?? {},
			'completed',
		);
		return response;
	};

// Update a scheduled policy - PATCH /v1/scheduled_policies/{id}
export const scheduledPoliciesUpdate: DnsfilterEndpoints['scheduledPoliciesUpdate'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['scheduledPoliciesUpdate']
		>('/v1/scheduled_policies/{id}', ctx.key, {
			method: 'PATCH',
			path: {
				id: input.id,
			},
			body: {
				name: input.name,
				organization_id: input.organization_id,
				policy_ids: input.policy_ids,
				timezone: input.timezone,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.scheduledPolicies.update',
			input ?? {},
			'completed',
		);
		return response;
	};

// Delete a scheduled policy - DELETE /v1/scheduled_policies/{id}
export const scheduledPoliciesDelete: DnsfilterEndpoints['scheduledPoliciesDelete'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['scheduledPoliciesDelete']
		>('/v1/scheduled_policies/{id}', ctx.key, {
			method: 'DELETE',
			path: {
				id: input.id,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.scheduledPolicies.delete',
			input ?? {},
			'completed',
		);
		return response;
	};
