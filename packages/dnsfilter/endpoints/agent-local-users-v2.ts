import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import type { DnsfilterEndpointOutputs } from './types';

// Counts for agent local users V2 - GET /v2/agent_local_users/counts
export const agentLocalUsersV2Counts: DnsfilterEndpoints['agentLocalUsersV2Counts'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['agentLocalUsersV2Counts']
		>('/v2/agent_local_users/counts', ctx.key, {
			method: 'GET',
			query: {
				msp_id: input.msp_id,
				name: input.name,
				organization_ids: input.organization_ids,
				search: input.search,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.agentLocalUsersV2.counts',
			input ?? {},
			'completed',
		);
		return response;
	};
