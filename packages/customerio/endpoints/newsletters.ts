import { logEventFromContext } from 'corsair/core';
import type { CustomerioEndpoints } from '..';
import { makeAppRequest } from '../client';
import type { CustomerioEndpointOutputs } from './types';

// GET /v1/newsletters (one-time sends)
// Docs: https://docs.customer.io/integrations/api/app/tag/newsletters/listNewsletters/
export const listNewsletters: CustomerioEndpoints['listNewsletters'] = async (
	ctx,
	input,
) => {
	const response = await makeAppRequest<
		CustomerioEndpointOutputs['listNewsletters']
	>('/v1/newsletters', ctx.key, {
		method: 'GET',
		region: ctx.options.region,
		query: {
			limit: input.limit,
			start: input.start,
			sort: input.sort,
		},
	});
	await logEventFromContext(
		ctx,
		'customerio.newsletters.listNewsletters',
		{ ...input },
		'completed',
	);
	return response;
};
