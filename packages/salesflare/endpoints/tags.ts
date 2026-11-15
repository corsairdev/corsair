import { logEventFromContext } from 'corsair/core';
import type { SalesflareEndpoints } from '..';
import { makeSalesflareRequest } from '../client';
import { salesflarePathParameter } from './path';
import type { SalesflareEndpointOutputs } from './types';

export const listTags: SalesflareEndpoints['listTags'] = async (ctx, input) => {
	const response = await makeSalesflareRequest<
		SalesflareEndpointOutputs['listTags']
	>(ctx, '/tags', { method: 'GET', query: input });
	await logEventFromContext(
		ctx,
		'salesflare.tags.listTags',
		input,
		'completed',
	);
	return response;
};

export const createTag: SalesflareEndpoints['createTag'] = async (
	ctx,
	input,
) => {
	const response = await makeSalesflareRequest<
		SalesflareEndpointOutputs['createTag']
	>(ctx, '/tags', { method: 'POST', body: input });
	await logEventFromContext(
		ctx,
		'salesflare.tags.createTag',
		input,
		'completed',
	);
	return response;
};

export const retrieveTag: SalesflareEndpoints['retrieveTag'] = async (
	ctx,
	input,
) => {
	const response = await makeSalesflareRequest<
		SalesflareEndpointOutputs['retrieveTag']
	>(ctx, salesflarePathParameter('/tags/{tag_id}', 'tag_id', input.tagId), {
		method: 'GET',
	});
	await logEventFromContext(
		ctx,
		'salesflare.tags.retrieveTag',
		input,
		'completed',
	);
	return response;
};

export const updateTag: SalesflareEndpoints['updateTag'] = async (
	ctx,
	input,
) => {
	const { tagId, ...body } = input;
	const response = await makeSalesflareRequest<
		SalesflareEndpointOutputs['updateTag']
	>(ctx, salesflarePathParameter('/tags/{tag_id}', 'tag_id', input.tagId), {
		method: 'PUT',
		body: body,
	});
	await logEventFromContext(
		ctx,
		'salesflare.tags.updateTag',
		input,
		'completed',
	);
	return response;
};

export const deleteTag: SalesflareEndpoints['deleteTag'] = async (
	ctx,
	input,
) => {
	const response = await makeSalesflareRequest<
		SalesflareEndpointOutputs['deleteTag']
	>(ctx, salesflarePathParameter('/tags/{tag_id}', 'tag_id', input.tagId), {
		method: 'DELETE',
	});
	await logEventFromContext(
		ctx,
		'salesflare.tags.deleteTag',
		input,
		'completed',
	);
	return response;
};

export const listTagUsage: SalesflareEndpoints['listTagUsage'] = async (
	ctx,
	input,
) => {
	const response = await makeSalesflareRequest<
		SalesflareEndpointOutputs['listTagUsage']
	>(
		ctx,
		salesflarePathParameter('/tags/{tag_id}/usage', 'tag_id', input.tagId),
		{ method: 'GET' },
	);
	await logEventFromContext(
		ctx,
		'salesflare.tags.listTagUsage',
		input,
		'completed',
	);
	return response;
};
