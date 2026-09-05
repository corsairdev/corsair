import { logEventFromContext } from 'corsair/core';
import { makeWhautomateRequest } from '../client';
import type { WhautomateEndpoints } from '../index';
import type { WhautomateEndpointOutputs } from './types';
import { WhautomateEndpointOutputSchemas } from './types';

export const getAllWebhooks: WhautomateEndpoints['getAllWebhooks'] = async (
	ctx,
) => {
	const result = await makeWhautomateRequest<
		WhautomateEndpointOutputs['getAllWebhooks']
	>(
		ctx.options.apiHost!,
		ctx.key,
		'/webhooks',
		WhautomateEndpointOutputSchemas.getAllWebhooks,
		{
			method: 'GET',
		},
	);

	await logEventFromContext(ctx, 'whautomate.webhooks.list', {}, 'completed');
	return result;
};

export const Webhooks = {
	getAllWebhooks,
};
