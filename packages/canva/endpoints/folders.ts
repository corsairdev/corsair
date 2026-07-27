import { logEventFromContext } from 'corsair/core';
import { makeCanvaRequest } from '../client';
import type { CanvaEndpoints } from '../index';
import type { CanvaEndpointOutputs, Folder } from './types';

function toFolderEntity(folder: Folder) {
	return {
		id: folder.id,
		name: folder.name,
		created_at: folder.created_at ? new Date(folder.created_at * 1000) : null,
		updated_at: folder.updated_at ? new Date(folder.updated_at * 1000) : null,
	};
}

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

	if (ctx.db.folders) {
		try {
			await ctx.db.folders.upsertByEntityId(
				result.folder.id,
				toFolderEntity(result.folder),
			);
		} catch (error) {
			console.warn('Failed to save folder to database:', error);
		}
	}

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

	if (ctx.db.folders) {
		try {
			await ctx.db.folders.upsertByEntityId(
				result.folder.id,
				toFolderEntity(result.folder),
			);
		} catch (error) {
			console.warn('Failed to save folder to database:', error);
		}
	}

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

	if (ctx.db.folders) {
		try {
			await ctx.db.folders.upsertByEntityId(
				result.folder.id,
				toFolderEntity(result.folder),
			);
		} catch (error) {
			console.warn('Failed to update folder in database:', error);
		}
	}

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

	if (ctx.db.folders) {
		try {
			await ctx.db.folders.deleteByEntityId(input.folderId);
		} catch (error) {
			console.warn('Failed to delete folder from database:', error);
		}
	}

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
	const { folderId, continuation, limit, item_types, sort_by, pin_status } =
		input;
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
			...(pin_status !== undefined && { pin_status }),
		},
	});

	if (
		result.items.length > 0 &&
		(ctx.db.folders || ctx.db.designs || ctx.db.assets)
	) {
		try {
			for (const item of result.items) {
				if (item.type === 'folder' && ctx.db.folders) {
					await ctx.db.folders.upsertByEntityId(
						item.folder.id,
						toFolderEntity(item.folder),
					);
				} else if (item.type === 'design' && ctx.db.designs) {
					await ctx.db.designs.upsertByEntityId(item.design.id, {
						id: item.design.id,
						title: item.design.title,
						owner_user_id: item.design.owner?.user_id,
						owner_team_id: item.design.owner?.team_id,
						url: item.design.url,
					});
				} else if (item.type === 'image' && ctx.db.assets) {
					await ctx.db.assets.upsertByEntityId(item.image.id, {
						id: item.image.id,
						type: item.image.type,
						name: item.image.name,
						tags: item.image.tags,
						created_at: item.image.created_at
							? new Date(item.image.created_at * 1000)
							: null,
						updated_at: item.image.updated_at
							? new Date(item.image.updated_at * 1000)
							: null,
					});
				} else if (item.type === 'brand_template' && ctx.db.brandTemplates) {
					await ctx.db.brandTemplates.upsertByEntityId(item.brand_template.id, {
						id: item.brand_template.id,
						title: item.brand_template.title,
						view_url: item.brand_template.view_url,
						create_url: item.brand_template.create_url,
						created_at: item.brand_template.created_at
							? new Date(item.brand_template.created_at * 1000)
							: null,
						updated_at: item.brand_template.updated_at
							? new Date(item.brand_template.updated_at * 1000)
							: null,
					});
				}
			}
		} catch (error) {
			console.warn('Failed to save folder items to database:', error);
		}
	}

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
