import { logEventFromContext } from 'corsair/core';
import type { PostmanEndpoints } from '..';
import { makePostmanRequest } from '../client';
import type { PostmanEndpointOutputs } from './types';

export const list: PostmanEndpoints['groupsList'] = async (ctx, input) => {
	const response = await makePostmanRequest<
		PostmanEndpointOutputs['groupsList']
	>('/groups', ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'postman.groups.list',
		{ ...input },
		'completed',
	);
	return response;
};
