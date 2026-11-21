import { logEventFromContext } from 'corsair/core';
import { makeListennotesRequest } from '../client';
import type { ListennotesEndpoints } from '../index';
import type { CuratedGetResponse, CuratedListResponse } from './types';
import {
	ListennotesEndpointInputSchemas,
	ListennotesEndpointOutputSchemas,
} from './types';

export const list: ListennotesEndpoints['curated.list'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		ListennotesEndpointInputSchemas['curated.list'].parse(input);

	const response = await makeListennotesRequest<CuratedListResponse>(
		'/curated_podcasts',
		ctx.key,
		{
			method: 'GET',
			query: parsedInput,
		},
	);

	const parsed =
		ListennotesEndpointOutputSchemas['curated.list'].parse(response);

	await logEventFromContext(
		ctx,
		'listennotes.curated.list',
		{ count: parsed.curated_lists.length },
		'completed',
	);

	return parsed;
};

export const get: ListennotesEndpoints['curated.get'] = async (ctx, input) => {
	const parsedInput =
		ListennotesEndpointInputSchemas['curated.get'].parse(input);
	const { id } = parsedInput;

	const response = await makeListennotesRequest<CuratedGetResponse>(
		`/curated_podcasts/${encodeURIComponent(id)}`,
		ctx.key,
		{
			method: 'GET',
		},
	);

	const parsed =
		ListennotesEndpointOutputSchemas['curated.get'].parse(response);

	await logEventFromContext(
		ctx,
		'listennotes.curated.get',
		{ id },
		'completed',
	);

	return parsed;
};
