import { logEventFromContext } from 'corsair/core';
import { makeListennotesRequest } from '../client';
import type { ListennotesEndpoints } from '../index';
import type { GenresListResponse } from './types';
import {
	ListennotesEndpointInputSchemas,
	ListennotesEndpointOutputSchemas,
} from './types';

export const list: ListennotesEndpoints['genres.list'] = async (ctx, input) => {
	const parsedInput =
		ListennotesEndpointInputSchemas['genres.list'].parse(input);

	const response = await makeListennotesRequest<GenresListResponse>(
		'/genres',
		ctx.key,
		{
			method: 'GET',
			query: parsedInput,
		},
	);

	const parsed =
		ListennotesEndpointOutputSchemas['genres.list'].parse(response);

	await logEventFromContext(
		ctx,
		'listennotes.genres.list',
		{ count: parsed.genres.length },
		'completed',
	);

	return parsed;
};
