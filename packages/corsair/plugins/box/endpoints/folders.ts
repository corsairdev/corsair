import { logEventFromContext } from '../../utils/events';
import type { BoxBoundEndpoints, BoxEndpoints } from '..';
import { makeBoxRequest } from '../client';
import type { BoxEndpointOutputs } from './types';

function toFolderDbRecord(folder: BoxEndpointOutputs['foldersGet']) {
	return {
		id: folder.id,
		type: folder.type,
		name: folder.name,
		description: folder.description,
		etag: folder.etag,
		sequence_id: folder.sequence_id,
		created_at: folder.created_at,
		modified_at: folder.modified_at,
		trashed_at: folder.trashed_at,
		purged_at: folder.purged_at,
		content_created_at: folder.content_created_at,
		content_modified_at: folder.content_modified_at,
		is_externally_owned: folder.is_externally_owned,
		has_collaborations: folder.has_collaborations,
		item_status: folder.item_status,
	};
}

export const get: BoxEndpoints['foldersGet'] = async (ctx, input) => {
	const { folder_id, ...query } = input;
	const result = await makeBoxRequest<BoxEndpointOutputs['foldersGet']>(
		`folders/${folder_id}`,
		ctx.key,
		{
			method: 'GET',
			query,
		},
	);

	if (result.id && ctx.db.folders) {
		try {
			await ctx.db.folders.upsertByEntityId(
				result.id,
				toFolderDbRecord(result),
			);
		} catch (error) {
			console.warn('Failed to save folder to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'box.folders.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const create: BoxEndpoints['foldersCreate'] = async (ctx, input) => {
	const { name, parent_id, ...rest } = input;
	const result = await makeBoxRequest<BoxEndpointOutputs['foldersCreate']>(
		'folders',
		ctx.key,
		{
			method: 'POST',
			body: {
				name,
				parent: { id: parent_id },
				...rest,
			} as Record<string, unknown>,
		},
	);

	if (result.id && ctx.db.folders) {
		try {
			await ctx.db.folders.upsertByEntityId(
				result.id,
				toFolderDbRecord(result),
			);
		} catch (error) {
			console.warn('Failed to save created folder to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'box.folders.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const deleteFolder: BoxEndpoints['foldersDelete'] = async (
	ctx,
	input,
) => {
	const { folder_id, recursive } = input;
	await makeBoxRequest<void>(`folders/${folder_id}`, ctx.key, {
		method: 'DELETE',
		query: { recursive },
	});

	await logEventFromContext(
		ctx,
		'box.folders.delete',
		{ ...input },
		'completed',
	);
	return { success: true };
};

export const search: BoxEndpoints['foldersSearch'] = async (ctx, input) => {
	const result = await makeBoxRequest<BoxEndpointOutputs['foldersSearch']>(
		'search',
		ctx.key,
		{
			method: 'GET',
			query: {
				...input,
				type: 'folder',
			},
		},
	);

	if (result.entries && ctx.db.folders) {
		try {
			for (const entry of result.entries) {
				if (entry.id) {
					const endpoints = ctx.endpoints as BoxBoundEndpoints;
					await endpoints.folders.get({ folder_id: entry.id });
				}
			}
		} catch (error) {
			console.warn('Failed to save search results to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'box.folders.search',
		{ ...input },
		'completed',
	);
	return result;
};

export const share: BoxEndpoints['foldersShare'] = async (ctx, input) => {
	const { folder_id, shared_link } = input;
	const result = await makeBoxRequest<BoxEndpointOutputs['foldersShare']>(
		`folders/${folder_id}`,
		ctx.key,
		{
			method: 'PUT',
			body: { shared_link } as Record<string, unknown>,
			query: { fields: 'shared_link' },
		},
	);

	if (result.id && ctx.db.folders) {
		try {
			await ctx.db.folders.upsertByEntityId(
				result.id,
				toFolderDbRecord(result),
			);
		} catch (error) {
			console.warn('Failed to save shared folder to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'box.folders.share',
		{ ...input },
		'completed',
	);
	return result;
};

export const update: BoxEndpoints['foldersUpdate'] = async (ctx, input) => {
	const { folder_id, fields, ...body } = input;
	const result = await makeBoxRequest<BoxEndpointOutputs['foldersUpdate']>(
		`folders/${folder_id}`,
		ctx.key,
		{
			method: 'PUT',
			body: body as Record<string, unknown>,
			query: fields ? { fields } : undefined,
		},
	);

	if (result.id && ctx.db.folders) {
		try {
			await ctx.db.folders.upsertByEntityId(
				result.id,
				toFolderDbRecord(result),
			);
		} catch (error) {
			console.warn('Failed to save updated folder to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'box.folders.update',
		{ ...input },
		'completed',
	);
	return result;
};
