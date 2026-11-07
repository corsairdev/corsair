import { logEventFromContext } from 'corsair/core';
import { makeMixmaxRequest } from '../client';
import type { MixmaxEndpoints } from '../index';
import { mixmaxPathParameter } from './path';
import type { MixmaxEndpointOutputs } from './types';

export const codeSnippetsList: MixmaxEndpoints['codeSnippetsList'] = async (
	ctx,
	input,
) => {
	const result = await makeMixmaxRequest<
		MixmaxEndpointOutputs['codeSnippetsList']
	>(ctx, '/v1/codesnippets', {
		method: 'GET',
		query: {
			limit: input.limit,
			next: input.next,
			previous: input.previous,
			fields: input.fields,
		},
	});

	await logEventFromContext(
		ctx,
		'mixmax.codeSnippets.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const codeSnippetsCreate: MixmaxEndpoints['codeSnippetsCreate'] = async (
	ctx,
	input,
) => {
	const { ...snippet } = input;
	const result = await makeMixmaxRequest<
		MixmaxEndpointOutputs['codeSnippetsCreate']
	>(ctx, '/v1/codesnippets', {
		method: 'POST',
		body: snippet,
	});

	await logEventFromContext(
		ctx,
		'mixmax.codeSnippets.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const codeSnippetsGet: MixmaxEndpoints['codeSnippetsGet'] = async (
	ctx,
	input,
) => {
	const result = await makeMixmaxRequest<
		MixmaxEndpointOutputs['codeSnippetsGet']
	>(ctx, mixmaxPathParameter('/v1/codesnippets/{id}', 'id', input.id), {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'mixmax.codeSnippets.get',
		{ ...input },
		'completed',
	);
	return result;
};
