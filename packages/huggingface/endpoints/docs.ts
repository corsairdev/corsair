import { logEventFromContext } from 'corsair/core';
import type { HuggingFaceEndpoints } from '../index';
import { req, summarize } from './helpers';

export const list: HuggingFaceEndpoints['docsList'] = async (ctx, input) => {
	const response = await req(ctx, '/api/docs', { method: 'GET' });
	await logEventFromContext(
		ctx,
		'huggingface.docs.list',
		summarize(input),
		'completed',
	);
	return response;
};

export const search: HuggingFaceEndpoints['docsSearch'] = async (
	ctx,
	input,
) => {
	const response = await req(ctx, '/api/docs/search', {
		method: 'GET',
		query: { q: input.q, product: input.product },
	});
	await logEventFromContext(
		ctx,
		'huggingface.docs.search',
		summarize(input),
		'completed',
	);
	return response;
};
