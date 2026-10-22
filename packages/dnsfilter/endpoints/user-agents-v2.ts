import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import type { DnsfilterEndpointOutputs } from './types';

// Update settings for user agents V2 - PATCH /v2/user_agents/{id}/update_settings
export const userAgentsV2UpdateSettings: DnsfilterEndpoints['userAgentsV2UpdateSettings'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['userAgentsV2UpdateSettings']
		>('/v2/user_agents/{id}/update_settings', ctx.key, {
			method: 'PATCH',
			path: {
				id: input.id,
			},
			body: {
				user_agent: input.user_agent,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.userAgentsV2.updateSettings',
			input ?? {},
			'completed',
		);
		return response;
	};
