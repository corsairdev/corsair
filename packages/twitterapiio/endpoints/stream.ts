import { logEventFromContext } from 'corsair/core';
import { makeTwitterApiIORequest } from '../client';
import type { TwitterApiIOEndpoints } from '../index';
import type { TwitterApiIOEndpointOutputs } from './types';

export const addUser: TwitterApiIOEndpoints['streamAddUser'] = async (
	ctx,
	input,
) => {
	const response = await makeTwitterApiIORequest<
		TwitterApiIOEndpointOutputs['streamAddUser']
	>('/oapi/x_user_stream/add_user_to_monitor_tweet', ctx.key, {
		method: 'POST',
		body: { x_user_name: input.userName },
	});

	await logEventFromContext(
		ctx,
		'twitterapiio.stream.addUser',
		{ userName: input.userName },
		'completed',
	);
	return response;
};

export const removeUser: TwitterApiIOEndpoints['streamRemoveUser'] = async (
	ctx,
	input,
) => {
	const response = await makeTwitterApiIORequest<
		TwitterApiIOEndpointOutputs['streamRemoveUser']
	>('/oapi/x_user_stream/remove_user_from_monitor_tweet', ctx.key, {
		method: 'POST',
		body: { x_user_name: input.userName },
	});

	await logEventFromContext(
		ctx,
		'twitterapiio.stream.removeUser',
		{ userName: input.userName },
		'completed',
	);
	return response;
};

export const listUsers: TwitterApiIOEndpoints['streamListUsers'] = async (
	ctx,
	_input,
) => {
	const response = await makeTwitterApiIORequest<
		TwitterApiIOEndpointOutputs['streamListUsers']
	>('/oapi/x_user_stream/get_monitor_tweet_users', ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'twitterapiio.stream.listUsers',
		{},
		'completed',
	);
	return response;
};
