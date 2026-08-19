import { logEventFromContext } from 'corsair/core';
import type { HuggingFaceEndpoints } from '../index';
import { req, summarize } from './helpers';

export const create: HuggingFaceEndpoints['collectionsCreate'] = async (
	ctx,
	input,
) => {
	const response = await req(ctx, '/api/collections', {
		method: 'POST',
		body: {
			title: input.title,
			namespace: input.namespace,
			description: input.description,
			private: input.private,
		},
	});
	await logEventFromContext(
		ctx,
		'huggingface.collections.create',
		summarize(input),
		'completed',
	);
	return response;
};

export const list: HuggingFaceEndpoints['collectionsList'] = async (
	ctx,
	input,
) => {
	const response = await req(ctx, '/api/collections', {
		method: 'GET',
		query: { ...input },
	});
	await logEventFromContext(
		ctx,
		'huggingface.collections.list',
		summarize(input),
		'completed',
	);
	return response;
};
