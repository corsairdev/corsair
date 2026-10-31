import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import { redactSensitive } from '../redact';
import type { DnsfilterEndpointOutputs } from './types';
import {
	DnsfilterEndpointInputSchemas,
	DnsfilterEndpointOutputSchemas,
} from './types';

// Redirect link for PSA integrations - GET /v1/psa_integrations/redirect_link
export const psaIntegrationsRedirectLink: DnsfilterEndpoints['psaIntegrationsRedirectLink'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.psaIntegrationsRedirectLink.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['psaIntegrationsRedirectLink']
		>('/v1/psa_integrations/redirect_link', ctx.key, {
			method: 'GET',
			query: {
				organization_id: values.organization_id,
				psa_name: values.psa_name,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.psaIntegrationsRedirectLink.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dnsfilter.psaIntegrations.redirectLink',
			redactSensitive(values),
			'completed',
		);
		return result;
	};
