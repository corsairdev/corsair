import { logEventFromContext } from 'corsair/core';
import type { PostmanEndpoints } from '..';
import { makePostmanRequest } from '../client';
import type { PostmanEndpointOutputs } from './types';

export const create: PostmanEndpoints['webhooksCreate'] = async (
	ctx,
	input,
) => {
	const response = await makePostmanRequest<
		PostmanEndpointOutputs['webhooksCreate']
	>('/webhooks', ctx.key, {
		method: 'POST',
		query: {
			workspace: input.workspace,
		},
		body: {
			webhook: input.webhook,
		},
	});

	await logEventFromContext(
		ctx,
		'postman.webhooks.create',
		{ ...input },
		'completed',
	);
	return response;
};
