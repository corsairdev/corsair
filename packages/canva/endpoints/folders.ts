import { logEventFromContext } from 'corsair/core';
import { makeCanvaRequest } from '../client';
import type { CanvaEndpoints } from '../index';
import type { CanvaEndpointOutputs } from './types';

export const create: CanvaEndpoints['foldersCreate'] = async (ctx, input) => {
	const result = await makeCanvaRequest<CanvaEndpointOutputs['foldersCreate']>(
		'v1/folders',
		ctx.key,
		{
			method: 'POST',
			body: {
				name: input.name,
				parent_folder_id: input.parent_folder_id,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'canva.folders.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: CanvaEndpoints['foldersGet'] = async (ctx, input) => {
	const result = await makeCanvaRequest<CanvaEndpointOutputs['foldersGet']>(
		`v1/folders/${input.folderId}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'canva.folders.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const update: CanvaEndpoints['foldersUpdate'] = async (ctx, input) => {
	const { folderId, name } = input;
	const result = await makeCanvaRequest<CanvaEndpointOutputs['foldersUpdate']>(
		`v1/folders/${folderId}`,
		ctx.key,
		{
			method: 'PATCH',
			body: { name },
		},
	);

	await logEventFromContext(
		ctx,
		'canva.folders.update',
		{ ...input },
		'completed',
	);
	return result;
};

export const deleteFolder: CanvaEndpoints['foldersDelete'] = async (
	ctx,
	input,
) => {
	await makeCanvaRequest<void>(`v1/folders/${input.folderId}`, ctx.key, {
		method: 'DELETE',
	});

	await logEventFromContext(
		ctx,
		'canva.folders.delete',
		{ ...input },
		'completed',
	);
	return { success: true };
};

export const listItems: CanvaEndpoints['foldersListItems'] = async (
	ctx,
	input,
) => {
	const { folderId, continuation, limit, item_types, sort_by } = input;
	const result = await makeCanvaRequest<
		CanvaEndpointOutputs['foldersListItems']
	>(`v1/folders/${folderId}/items`, ctx.key, {
		method: 'GET',
		query: {
			...(continuation !== undefined && { continuation }),
			...(limit !== undefined && { limit }),
			...(item_types !== undefined && {
				item_types: item_types.join(','),
			}),
			...(sort_by !== undefined && { sort_by }),
		},
	});

	await logEventFromContext(
		ctx,
		'canva.folders.listItems',
		{ ...input },
		'completed',
	);
	return result;
};

export const moveItem: CanvaEndpoints['foldersMoveItem'] = async (
	ctx,
	input,
) => {
	await makeCanvaRequest<void>('v1/folders/move', ctx.key, {
		method: 'POST',
		body: {
			to_folder_id: input.to_folder_id,
			item_id: input.item_id,
		},
	});

	await logEventFromContext(
		ctx,
		'canva.folders.moveItem',
		{ ...input },
		'completed',
	);
	return { success: true };
};
