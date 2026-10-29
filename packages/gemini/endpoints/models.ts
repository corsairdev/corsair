import { logEventFromContext } from 'corsair/core';
import type { GeminiEndpoints } from '..';
import { makeGeminiRequest } from '../client';
import type { ListModelsResponse } from './types';

export const listModels: GeminiEndpoints['listModels'] = async (ctx, input) => {
	const response = await makeGeminiRequest<ListModelsResponse>(
		'/models',
		ctx.key,
		{
			method: 'GET',
			query: {
				pageSize: input.pageSize,
				pageToken: input.pageToken,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'gemini.models.listModels',
		{ ...input },
		'completed',
	);
	return response;
};
