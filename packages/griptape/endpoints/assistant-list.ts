import { logEventFromContext } from 'corsair/core';
import type { GriptapeEndpointOutputs, GriptapeEndpoints } from '..';
import { makeGriptapeRequest } from '../client';

export const list: GriptapeEndpoints['assistantList'] = async (ctx, input) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['assistantList']
	>('assistants', ctx.key, {
		method: 'GET',
		query: {
			page: input.page,
			page_size: input.page_size,
		},
	});

	await logEventFromContext(
		ctx,
		'griptape.assistant.list',
		{ ...input },
		'completed',
	);

	return response;
};
