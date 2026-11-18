import { logEventFromContext } from 'corsair/core';
import type { ListennotesEndpoints } from '..';
import { makeListennotesRequest } from '../client';
import type { SearchResponse, TypeaheadResponse } from './types';
import {
	ListennotesEndpointInputSchemas,
	ListennotesEndpointOutputSchemas,
} from './types';

export const search: ListennotesEndpoints['search.search'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		ListennotesEndpointInputSchemas['search.search'].parse(input);

	const response = await makeListennotesRequest<SearchResponse>(
		'/search',
		ctx.key,
		{
			method: 'GET',
			query: parsedInput,
		},
	);

	const parsed =
		ListennotesEndpointOutputSchemas['search.search'].parse(response);

	await logEventFromContext(
		ctx,
		'listennotes.search.search',
		{ count: parsed.count },
		'completed',
	);

	return parsed;
};

export const typeahead: ListennotesEndpoints['search.typeahead'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		ListennotesEndpointInputSchemas['search.typeahead'].parse(input);

	const response = await makeListennotesRequest<TypeaheadResponse>(
		'/typeahead',
		ctx.key,
		{
			method: 'GET',
			query: parsedInput,
		},
	);

	const parsed =
		ListennotesEndpointOutputSchemas['search.typeahead'].parse(response);

	await logEventFromContext(
		ctx,
		'listennotes.search.typeahead',
		{ count: parsed.terms.length },
		'completed',
	);

	return parsed;
};
