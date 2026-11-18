import { logEventFromContext } from 'corsair/core';
import type { ListennotesEndpoints } from '..';
import { makeListennotesRequest } from '../client';
import type { PlaylistsGetResponse, PlaylistsListResponse } from './types';
import {
	ListennotesEndpointInputSchemas,
	ListennotesEndpointOutputSchemas,
} from './types';

export const list: ListennotesEndpoints['playlists.list'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		ListennotesEndpointInputSchemas['playlists.list'].parse(input);

	const response = await makeListennotesRequest<PlaylistsListResponse>(
		'/playlists',
		ctx.key,
		{
			method: 'GET',
			query: parsedInput,
		},
	);

	const parsed =
		ListennotesEndpointOutputSchemas['playlists.list'].parse(response);

	await logEventFromContext(
		ctx,
		'listennotes.playlists.list',
		{ count: parsed.playlists.length },
		'completed',
	);

	return parsed;
};

export const get: ListennotesEndpoints['playlists.get'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		ListennotesEndpointInputSchemas['playlists.get'].parse(input);
	const { id, ...query } = parsedInput;

	const response = await makeListennotesRequest<PlaylistsGetResponse>(
		`/playlists/${encodeURIComponent(id)}`,
		ctx.key,
		{
			method: 'GET',
			query,
		},
	);

	const parsed =
		ListennotesEndpointOutputSchemas['playlists.get'].parse(response);

	await logEventFromContext(
		ctx,
		'listennotes.playlists.get',
		{ id },
		'completed',
	);

	return parsed;
};
