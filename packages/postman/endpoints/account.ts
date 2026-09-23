import { logEventFromContext } from 'corsair/core';
import type { PostmanEndpoints } from '..';
import { makePostmanRequest } from '../client';
import type { PostmanEndpointOutputs } from './types';

export const me: PostmanEndpoints['accountMe'] = async (ctx, input) => {
	const response = await makePostmanRequest<
		PostmanEndpointOutputs['accountMe']
	>('/me', ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'postman.account.me',
		{ ...input },
		'completed',
	);
	return response;
};
