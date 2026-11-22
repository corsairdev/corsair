import { logEventFromContext } from 'corsair/core';
import { makeListennotesRequest } from '../client';
import type { ListennotesEndpoints } from '../index';
import type { LanguagesListResponse, RegionsListResponse } from './types';
import {
	ListennotesEndpointInputSchemas,
	ListennotesEndpointOutputSchemas,
} from './types';

export const regions: ListennotesEndpoints['regions.list'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		ListennotesEndpointInputSchemas['regions.list'].parse(input);
	const response = await makeListennotesRequest<RegionsListResponse>(
		'/regions',
		ctx.key,
		{ method: 'GET', query: parsedInput },
	);
	const parsed =
		ListennotesEndpointOutputSchemas['regions.list'].parse(response);
	await logEventFromContext(
		ctx,
		'listennotes.regions.list',
		{ count: Object.keys(parsed.regions).length },
		'completed',
	);
	return parsed;
};

export const languages: ListennotesEndpoints['languages.list'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		ListennotesEndpointInputSchemas['languages.list'].parse(input);
	const response = await makeListennotesRequest<LanguagesListResponse>(
		'/languages',
		ctx.key,
		{ method: 'GET', query: parsedInput },
	);
	const parsed =
		ListennotesEndpointOutputSchemas['languages.list'].parse(response);
	await logEventFromContext(
		ctx,
		'listennotes.languages.list',
		{ count: parsed.languages.length },
		'completed',
	);
	return parsed;
};
