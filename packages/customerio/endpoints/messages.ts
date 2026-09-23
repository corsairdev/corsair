import { logEventFromContext } from 'corsair/core';
import type { CustomerioEndpoints } from '..';
import { makeAppRequest } from '../client';
import type { CustomerioEndpointOutputs } from './types';

// GET /v1/messages
// Docs: https://docs.customer.io/integrations/api/app/tag/messages/listMessages/
export const getMessages: CustomerioEndpoints['getMessages'] = async (
	ctx,
	input,
) => {
	const response = await makeAppRequest<
		CustomerioEndpointOutputs['getMessages']
	>('/v1/messages', ctx.key, {
		method: 'GET',
		region: ctx.options.region,
		query: {
			limit: input.limit,
			start: input.start,
			drafts: input.drafts,
			type: input.type,
			campaign_id: input.campaign_id,
			newsletter_id: input.newsletter_id,
			action_id: input.action_id,
		},
	});
	await logEventFromContext(
		ctx,
		'customerio.messages.getMessages',
		{ ...input },
		'completed',
	);
	return response;
};
