import { logEventFromContext } from 'corsair/core';
import { makePhantomBusterRequest } from '../client';
import type { PhantomBusterContext } from '../index';
import type {
	DeleteListInput,
	DeleteListResponse,
	FetchAllListsInput,
	FetchAllListsResponse,
	FetchListInput,
	FetchListResponse,
	SaveListInput,
	SaveListResponse,
} from './types';

export const fetchAll = async (
	ctx: PhantomBusterContext,
	_input: FetchAllListsInput,
): Promise<FetchAllListsResponse> => {
	const response = await makePhantomBusterRequest<FetchAllListsResponse>(
		'/org-storage/lists/fetch-all',
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'phantombuster.lists.fetchAll', {}, 'completed');

	return response;
};

export const fetch = async (
	ctx: PhantomBusterContext,
	input: FetchListInput,
): Promise<FetchListResponse> => {
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

export const save = async (
	ctx: PhantomBusterContext,
	input: SaveListInput,
): Promise<SaveListResponse> => {
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

export const remove = async (
	ctx: PhantomBusterContext,
	input: DeleteListInput,
): Promise<DeleteListResponse> => {
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
