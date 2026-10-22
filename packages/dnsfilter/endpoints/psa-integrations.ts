import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import type { DnsfilterEndpointOutputs } from './types';

// Redirect link for PSA integrations - GET /v1/psa_integrations/redirect_link
export const psaIntegrationsRedirectLink: DnsfilterEndpoints['psaIntegrationsRedirectLink'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['psaIntegrationsRedirectLink']
		>('/v1/psa_integrations/redirect_link', ctx.key, {
			method: 'GET',
			query: {
				organization_id: input.organization_id,
				psa_name: input.psa_name,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.psaIntegrations.redirectLink',
			input ?? {},
			'completed',
		);
		return response;
	};
