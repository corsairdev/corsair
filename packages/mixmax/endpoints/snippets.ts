import { logEventFromContext } from 'corsair/core';
import { makeMixmaxRequest } from '../client';
import type { MixmaxEndpoints } from '../index';
import type { MixmaxEndpointOutputs } from './types';

export const snippetsList: MixmaxEndpoints['snippetsList'] = async (
	ctx,
	input,
) => {
	const result = await makeMixmaxRequest<
		MixmaxEndpointOutputs['snippetsList']
	>('/v1/snippets', ctx.key, {
		method: 'GET',
		query: {
			search: input.search,
			isInline: input.isInline,
			deletedOnly: input.deletedOnly,
			archivedOnly: input.archivedOnly,
			sort: input.sort,
			sortAscending: input.sortAscending,
			expand: input.expand,
			limit: input.limit,
			next: input.next,
			previous: input.previous,
		},
	});

	await logEventFromContext(
		ctx,
		'mixmax.snippets.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const snippetsGet: MixmaxEndpoints['snippetsGet'] = async (ctx, input) => {
	const result = await makeMixmaxRequest<
		MixmaxEndpointOutputs['snippetsGet']
	>(`/v1/snippets/${input.id}`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'mixmax.snippets.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const snippetsCreate: MixmaxEndpoints['snippetsCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeMixmaxRequest<
		MixmaxEndpointOutputs['snippetsCreate']
	>('/v1/snippets', ctx.key, {
		method: 'POST',
		body: {
			name: input.name,
			content: input.content,
		},
	});

	await logEventFromContext(
		ctx,
		'mixmax.snippets.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const snippetsUpdate: MixmaxEndpoints['snippetsUpdate'] = async (
	ctx,
	input,
) => {
	const result = await makeMixmaxRequest<
		MixmaxEndpointOutputs['snippetsUpdate']
	>(`/v1/snippets/${input.id}`, ctx.key, {
		method: 'PATCH',
		body: {
			name: input.name,
			content: input.content,
		},
	});

	await logEventFromContext(
		ctx,
		'mixmax.snippets.update',
		{ ...input },
		'completed',
	);
	return result;
};

export const snippetsDelete: MixmaxEndpoints['snippetsDelete'] = async (
	ctx,
	input,
) => {
	const result = await makeMixmaxRequest<
		MixmaxEndpointOutputs['snippetsDelete']
	>(`/v1/snippets/${input.id}`, ctx.key, {
		method: 'DELETE',
	});

	await logEventFromContext(
		ctx,
		'mixmax.snippets.delete',
		{ ...input },
		'completed',
	);
	return result;
};