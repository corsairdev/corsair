import { logEventFromContext } from 'corsair/core';
import type { PostmanEndpoints } from '..';
import { makePostmanRequest } from '../client';
import type { PostmanEndpointOutputs } from './types';

export const list: PostmanEndpoints['accessKeysList'] = async (ctx, input) => {
	const response = await makePostmanRequest<
		PostmanEndpointOutputs['accessKeysList']
	>('/collection-access-keys', ctx.key, {
		method: 'GET',
		query: {
			collectionId: input.collectionId,
			cursor: input.cursor,
		},
	});

	await logEventFromContext(
		ctx,
		'postman.accessKeys.list',
		{ ...input },
		'completed',
	);
	return response;
};
