import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import { redactSensitive } from '../redact';
import type { DnsfilterEndpointOutputs } from './types';
import {
	DnsfilterEndpointInputSchemas,
	DnsfilterEndpointOutputSchemas,
} from './types';

// Update settings for user agents V2 - PATCH /v2/user_agents/{id}/update_settings
export const userAgentsV2UpdateSettings: DnsfilterEndpoints['userAgentsV2UpdateSettings'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.userAgentsV2UpdateSettings.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['userAgentsV2UpdateSettings']
		>('/v2/user_agents/{id}/update_settings', ctx.key, {
			method: 'PATCH',
			path: {
				id: values.id,
			},
			body: {
				user_agent: values.user_agent,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.userAgentsV2UpdateSettings.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.userAgentsV2.updateSettings',
			redactSensitive(values),
			'completed',
		);
		return result;
	};
