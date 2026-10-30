import { logEventFromContext } from 'corsair/core';
import type { HuggingFaceEndpoints } from '../index';
import { req, summarize } from './helpers';

export const get: HuggingFaceEndpoints['trendingGet'] = async (ctx, input) => {
	const response = await req(ctx, '/api/trending', {
		method: 'GET',
		query: { type: input.type, limit: input.limit },
	});
	await logEventFromContext(
		ctx,
		'huggingface.trending.get',
		summarize(input),
		'completed',
	);
	return response;
};
