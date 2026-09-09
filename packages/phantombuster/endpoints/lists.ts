import { logEventFromContext } from 'corsair/core';
import { makePhantomBusterRequest } from '../client';
import type { PhantomBusterEndpoints } from '../index';
import type {
	DeleteListResponse,
	FetchAllListsResponse,
	FetchListResponse,
	SaveListResponse,
} from './types';

export const fetchAll: PhantomBusterEndpoints['fetchAllLists'] = async (ctx) => {
	const response = await makePhantomBusterRequest<FetchAllListsResponse>(
		'/org-storage/lists/fetch-all',
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'phantombuster.lists.fetchAll',
		{},
		'completed',
	);

	return response;
};

export const fetch: PhantomBusterEndpoints['fetchList'] = async (ctx, input) => {
	const { id } = input;

	const response = await makePhantomBusterRequest<FetchListResponse>(
		'/org-storage/lists/fetch',
		ctx.key,
		{
			method: 'GET',
			query: { id },
		},
	);

	await logEventFromContext(
		ctx,
		'phantombuster.lists.fetch',
		{ id },
		'completed',
	);

	return response;
};

export const save: PhantomBusterEndpoints['saveList'] = async (ctx, input) => {
	const response = await makePhantomBusterRequest<SaveListResponse>(
		'/org-storage/lists/save',
		ctx.key,
		{
			method: 'POST',
			body: input as Record<string, unknown>,
		},
	);

	await logEventFromContext(ctx, 'phantombuster.lists.save', {}, 'completed');

	return response;
};

export const remove: PhantomBusterEndpoints['deleteList'] = async (ctx, input) => {
	const { id } = input;

	const response = await makePhantomBusterRequest<DeleteListResponse>(
		'/org-storage/lists/delete',
		ctx.key,
		{
			method: 'POST',
			body: { id },
		},
	);

	await logEventFromContext(
		ctx,
		'phantombuster.lists.delete',
		{ id },
		'completed',
	);

	return response;
};
