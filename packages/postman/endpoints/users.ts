import { logEventFromContext } from 'corsair/core';
import type { PostmanEndpoints } from '..';
import { makePostmanRequest } from '../client';
import type { PostmanEndpointOutputs } from './types';

export const list: PostmanEndpoints['usersList'] = async (ctx, input) => {
	const response = await makePostmanRequest<
		PostmanEndpointOutputs['usersList']
	>('/users', ctx.key, {
		method: 'GET',
		query: {
			groupId: input.groupId,
		},
	});

	await logEventFromContext(
		ctx,
		'postman.users.list',
		{ ...input },
		'completed',
	);
	return response;
};

export const get: PostmanEndpoints['usersGet'] = async (ctx, input) => {
	const response = await makePostmanRequest<PostmanEndpointOutputs['usersGet']>(
		'/users/{userId}',
		ctx.key,
		{
			method: 'GET',
			path: {
				userId: input.userId,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'postman.users.get',
		{ ...input },
		'completed',
	);
	return response;
};
