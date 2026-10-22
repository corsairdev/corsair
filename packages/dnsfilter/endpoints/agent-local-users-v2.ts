import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import { redactSensitive } from '../redact';
import type { DnsfilterEndpointOutputs } from './types';
import {
	DnsfilterEndpointInputSchemas,
	DnsfilterEndpointOutputSchemas,
} from './types';

// Counts for agent local users V2 - GET /v2/agent_local_users/counts
export const agentLocalUsersV2Counts: DnsfilterEndpoints['agentLocalUsersV2Counts'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.agentLocalUsersV2Counts.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['agentLocalUsersV2Counts']
		>('/v2/agent_local_users/counts', ctx.key, {
			method: 'GET',
			query: {
				msp_id: values.msp_id,
				name: values.name,
				organization_ids: values.organization_ids,
				search: values.search,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.agentLocalUsersV2Counts.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.agentLocalUsersV2.counts',
			redactSensitive(values),
			'completed',
		);
		return result;
	};
