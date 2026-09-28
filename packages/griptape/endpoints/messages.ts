import { logEventFromContext } from 'corsair/core';
import type { GriptapeEndpointOutputs, GriptapeEndpoints } from '..';
import { makeGriptapeRequest } from '../client';

export const get: GriptapeEndpoints['messageGet'] = async (ctx, input) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['messageGet']
	>(`messages/${input.message_id}`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'griptape.message.get',
		{ ...input },
		'completed',
	);

	return response;
};

export const update: GriptapeEndpoints['messageUpdate'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['messageUpdate']
	>(`messages/${input.message_id}`, ctx.key, {
		method: 'PATCH',
		body: input.body,
	});

	await logEventFromContext(
		ctx,
		'griptape.message.update',
		{ ...input },
		'completed',
	);

	return response;
};

export const remove: GriptapeEndpoints['messageDelete'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['messageDelete']
	>(`messages/${input.message_id}`, ctx.key, {
		method: 'DELETE',
	});

	await logEventFromContext(
		ctx,
		'griptape.message.delete',
		{ ...input },
		'completed',
	);

	return response;
};
