import { logEventFromContext } from 'corsair/core';
import type { GriptapeEndpointOutputs, GriptapeEndpoints } from '..';
import { makeGriptapeRequest } from '../client';

export const create: GriptapeEndpoints['assistantCreate'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['assistantCreate']
	>('assistants', ctx.key, {
		method: 'POST',
		body: input.body,
	});

	await logEventFromContext(
		ctx,
		'griptape.assistant.create',
		{ ...input },
		'completed',
	);

	return response;
};

export const update: GriptapeEndpoints['assistantUpdate'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['assistantUpdate']
	>(`assistants/${input.assistant_id}`, ctx.key, {
		method: 'PATCH',
		body: input.body,
	});

	await logEventFromContext(
		ctx,
		'griptape.assistant.update',
		{ ...input },
		'completed',
	);

	return response;
};

export const remove: GriptapeEndpoints['assistantDelete'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['assistantDelete']
	>(`assistants/${input.assistant_id}`, ctx.key, {
		method: 'DELETE',
	});

	await logEventFromContext(
		ctx,
		'griptape.assistant.delete',
		{ ...input },
		'completed',
	);

	return response;
};
