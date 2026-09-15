import { logEventFromContext } from 'corsair/core';
import type { CustomerioEndpoints } from '..';
import { makeAppRequest } from '../client';
import type { CustomerioEndpointOutputs } from './types';

// GET /v1/reporting_webhooks (underscore path segment, verified in OpenAPI)
// Docs: https://docs.customer.io/integrations/api/app/tag/reporting-webhooks/listWebhooks/
// This lists reporting-webhook configurations; it is a read endpoint, not an
// incoming-webhook handler. The plugin ships no webhook receivers.
export const getWebhooks: CustomerioEndpoints['getWebhooks'] = async (
	ctx,
	input,
) => {
	const response = await makeAppRequest<
		CustomerioEndpointOutputs['getWebhooks']
	>('/v1/reporting_webhooks', ctx.key, {
		method: 'GET',
		region: ctx.options.region,
	});
	await logEventFromContext(
		ctx,
		'customerio.reportingWebhooks.getWebhooks',
		{ ...input },
		'completed',
	);
	return response;
};
