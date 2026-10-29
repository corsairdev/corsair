import { logEventFromContext } from 'corsair/core';
import type { GriptapeEndpointOutputs, GriptapeEndpoints } from '..';
import { makeGriptapeRequest } from '../client';

export const list: GriptapeEndpoints['userList'] = async (ctx, input) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['userList']
	>('users', ctx.key, {
		method: 'GET',
		query: {
			page: input.page,
			page_size: input.page_size,
		},
	});

	await logEventFromContext(
		ctx,
		'griptape.user.list',
		{ ...input },
		'completed',
	);

	return response;
};

export const get: GriptapeEndpoints['userGet'] = async (ctx, input) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['userGet']
	>(`users/${input.user_id}`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'griptape.user.get',
		{ ...input },
		'completed',
	);

	return response;
};

export const getApiKey: GriptapeEndpoints['userGetApiKey'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['userGetApiKey']
	>(`api-keys/${input.api_key_id}`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'griptape.user.getApiKey',
		{ ...input },
		'completed',
	);

	return response;
};

export const deleteApiKey: GriptapeEndpoints['userDeleteApiKey'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['userDeleteApiKey']
	>(`api-keys/${input.api_key_id}`, ctx.key, {
		method: 'DELETE',
	});

	await logEventFromContext(
		ctx,
		'griptape.user.deleteApiKey',
		{ ...input },
		'completed',
	);

	return response;
};
