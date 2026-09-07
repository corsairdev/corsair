import { logEventFromContext } from 'corsair/core';
import type { WhautomateHandler } from '../client';
import { makeWhautomateRequest, resolveApiHost } from '../client';

import type {
	WhautomateEndpointInputs,
	WhautomateEndpointOutputs,
} from './types';
import { WhautomateEndpointOutputSchemas } from './types';

export const getAllWebhooks: WhautomateHandler<
	WhautomateEndpointInputs['getAllWebhooks'],
	WhautomateEndpointOutputs['getAllWebhooks']
> = async (ctx) => {
	const result = await makeWhautomateRequest<
		WhautomateEndpointOutputs['getAllWebhooks']
	>(
		await resolveApiHost(ctx),
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
