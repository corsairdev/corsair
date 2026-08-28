import { logEventFromContext } from 'corsair/core';
import type { BenzingaEndpoints } from '..';
import { makeBenzingaRequest } from '../client';
import type { BenzingaEndpointOutputs } from './types';

export const getNews: BenzingaEndpoints['getNews'] = async (ctx, input) => {
	const response = await makeBenzingaRequest<
		BenzingaEndpointOutputs['getNews']
	>('/api/v2/news', ctx.key, {
		method: 'GET',
		query: input,
	});

	await logEventFromContext(
		ctx,
		'benzinga.news.get',
		{ ...input },
		'completed',
	);

	return response;
};
