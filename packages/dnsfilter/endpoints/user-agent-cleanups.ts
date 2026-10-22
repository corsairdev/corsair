import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import type { DnsfilterEndpointOutputs } from './types';

// Clean up user agent - POST /v1/user_agent_cleanups
export const userAgentCleanupsCreate: DnsfilterEndpoints['userAgentCleanupsCreate'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['userAgentCleanupsCreate']
		>('/v1/user_agent_cleanups', ctx.key, {
			method: 'POST',
			body: {
				organization_id: input.organization_id,
				organization_ids: input.organization_ids,
				inactive_for: input.inactive_for,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.userAgentCleanups.create',
			input ?? {},
			'completed',
		);
		return response;
	};

// Get a user agent cleanup - GET /v1/user_agent_cleanups/{id}
export const userAgentCleanupsGet: DnsfilterEndpoints['userAgentCleanupsGet'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['userAgentCleanupsGet']
		>('/v1/user_agent_cleanups/{id}', ctx.key, {
			method: 'GET',
			path: {
				id: input.id,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.userAgentCleanups.get',
			input ?? {},
			'completed',
		);
		return response;
	};

// Update a user agent cleanup - PUT /v1/user_agent_cleanups/{id}
export const userAgentCleanupsUpdate: DnsfilterEndpoints['userAgentCleanupsUpdate'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['userAgentCleanupsUpdate']
		>('/v1/user_agent_cleanups/{id}', ctx.key, {
			method: 'PUT',
			path: {
				id: input.id,
			},
			body: {
				start: input.start,
				inactive_for: input.inactive_for,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.userAgentCleanups.update',
			input ?? {},
			'completed',
		);
		return response;
	};
