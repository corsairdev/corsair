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
			webhook: {
				name: input.name,
				collection: input.collection,
				workspace: input.workspace,
			},
		},
	});
	await logEventFromContext(
		ctx,
		'postman.webhooks.create',
		{ collection: input.collection },
		'completed',
	);
	return response;
};
