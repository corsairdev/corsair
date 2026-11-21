import { logEventFromContext } from 'corsair/core';
import { makeListennotesRequest } from '../client';
import type { ListennotesEndpoints } from '../index';
import type {
	PlaylistItem,
	PlaylistSummary,
	PlaylistsDeleteItemResponse,
	PlaylistsDeleteResponse,
	PlaylistsGetResponse,
	PlaylistsListResponse,
} from './types';
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

export const create: ListennotesEndpoints['playlists.create'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		ListennotesEndpointInputSchemas['playlists.create'].parse(input);
	const response = await makeListennotesRequest<PlaylistSummary>(
		'/playlists',
		ctx.key,
		{ method: 'POST', body: parsedInput },
	);
	const parsed =
		ListennotesEndpointOutputSchemas['playlists.create'].parse(response);
	await logEventFromContext(
		ctx,
		'listennotes.playlists.create',
		{ id: parsed.id },
		'completed',
	);
	return parsed;
};

export const update: ListennotesEndpoints['playlists.update'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		ListennotesEndpointInputSchemas['playlists.update'].parse(input);
	const { id, ...body } = parsedInput;
	const response = await makeListennotesRequest<PlaylistSummary>(
		`/playlists/${encodeURIComponent(id)}`,
		ctx.key,
		{ method: 'PUT', body },
	);
	const parsed =
		ListennotesEndpointOutputSchemas['playlists.update'].parse(response);
	await logEventFromContext(
		ctx,
		'listennotes.playlists.update',
		{ id: parsed.id },
		'completed',
	);
	return parsed;
};

export const remove: ListennotesEndpoints['playlists.delete'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		ListennotesEndpointInputSchemas['playlists.delete'].parse(input);
	const response = await makeListennotesRequest<PlaylistsDeleteResponse>(
		`/playlists/${encodeURIComponent(parsedInput.id)}`,
		ctx.key,
		{ method: 'DELETE' },
	);
	const parsed =
		ListennotesEndpointOutputSchemas['playlists.delete'].parse(response);
	await logEventFromContext(
		ctx,
		'listennotes.playlists.delete',
		{ deleted: parsed.deleted },
		'completed',
	);
	return parsed;
};

export const addItem: ListennotesEndpoints['playlists.addItem'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		ListennotesEndpointInputSchemas['playlists.addItem'].parse(input);
	const { id, ...body } = parsedInput;
	const response = await makeListennotesRequest<PlaylistItem>(
		`/playlists/${encodeURIComponent(id)}/items`,
		ctx.key,
		{ method: 'POST', body },
	);
	const parsed =
		ListennotesEndpointOutputSchemas['playlists.addItem'].parse(response);
	await logEventFromContext(
		ctx,
		'listennotes.playlists.addItem',
		{ id: parsed.id },
		'completed',
	);
	return parsed;
};

export const updateItem: ListennotesEndpoints['playlists.updateItem'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		ListennotesEndpointInputSchemas['playlists.updateItem'].parse(input);
	const { id, item_id, notes } = parsedInput;
	const response = await makeListennotesRequest<PlaylistItem>(
		`/playlists/${encodeURIComponent(id)}/items/${item_id}`,
		ctx.key,
		{ method: 'PUT', body: { notes } },
	);
	const parsed =
		ListennotesEndpointOutputSchemas['playlists.updateItem'].parse(response);
	await logEventFromContext(
		ctx,
		'listennotes.playlists.updateItem',
		{ id: parsed.id },
		'completed',
	);
	return parsed;
};

export const deleteItem: ListennotesEndpoints['playlists.deleteItem'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		ListennotesEndpointInputSchemas['playlists.deleteItem'].parse(input);
	const response = await makeListennotesRequest<PlaylistsDeleteItemResponse>(
		`/playlists/${encodeURIComponent(parsedInput.id)}/items/${parsedInput.item_id}`,
		ctx.key,
		{ method: 'DELETE' },
	);
	const parsed =
		ListennotesEndpointOutputSchemas['playlists.deleteItem'].parse(response);
	await logEventFromContext(
		ctx,
		'listennotes.playlists.deleteItem',
		{ id: parsed.id, deleted: parsed.deleted },
		'completed',
	);
	return parsed;
};
