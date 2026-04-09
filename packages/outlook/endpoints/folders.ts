import { logEventFromContext } from 'corsair/core';
import type { OutlookEndpoints } from '..';
import { makeOutlookRequest } from '../client';
import type { OutlookEndpointOutputs } from './types';

const userPath = (userId?: string) => (userId ? `/users/${userId}` : '/me');

// ── DB record helper ──────────────────────────────────────────────────────────

const toFolderRecord = (folder: OutlookEndpointOutputs['foldersGet']) => ({
	// id is asserted non-null — all callers guard with `if (result.id)` before invoking this helper
	id: folder.id!,
	displayName: folder.displayName,
	parentFolderId: folder.parentFolderId,
	totalItemCount: folder.totalItemCount,
	unreadItemCount: folder.unreadItemCount,
	childFolderCount: folder.childFolderCount,
	isHidden: folder.isHidden,
});

// ── Endpoints ─────────────────────────────────────────────────────────────────

export const createFolder: OutlookEndpoints['foldersCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeOutlookRequest<
		OutlookEndpointOutputs['foldersCreate']
	>(`${userPath(input.user_id)}/mailFolders`, ctx.key, {
		method: 'POST',
		body: {
			displayName: input.displayName,
			...(input.isHidden !== undefined && { isHidden: input.isHidden }),
		},
	});

	if (result.id && ctx.db.folders) {
		try {
			await ctx.db.folders.upsertByEntityId(result.id, toFolderRecord(result));
		} catch (error) {
			console.warn('Failed to save folder to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'outlook.folders.create',
		{ displayName: input.displayName },
		'completed',
	);
	return result;
};

export const getFolder: OutlookEndpoints['foldersGet'] = async (ctx, input) => {
	const result = await makeOutlookRequest<OutlookEndpointOutputs['foldersGet']>(
		`${userPath(input.user_id)}/mailFolders/${input.mail_folder_id}`,
		ctx.key,
		{
			query: {
				...(input.select && { $select: input.select }),
			},
		},
	);

	if (result.id && ctx.db.folders) {
		try {
			await ctx.db.folders.upsertByEntityId(result.id, toFolderRecord(result));
		} catch (error) {
			console.warn('Failed to save folder to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'outlook.folders.get',
		{ mail_folder_id: input.mail_folder_id },
		'completed',
	);
	return result;
};

export const listFolders: OutlookEndpoints['foldersList'] = async (
	ctx,
	input,
) => {
	const result = await makeOutlookRequest<
		OutlookEndpointOutputs['foldersList']
	>(`${userPath(input.user_id)}/mailFolders`, ctx.key, {
		query: {
			...(input.top && { $top: input.top }),
			...(input.skip && { $skip: input.skip }),
			...(input.filter && { $filter: input.filter }),
			...(input.select && { $select: input.select }),
			...(input.orderby && { $orderby: input.orderby }),
			...(input.count !== undefined && { $count: input.count }),
			...(input.include_hidden_folders && {
				includeHiddenFolders: input.include_hidden_folders,
			}),
		},
	});

	if (result.value?.length && ctx.db.folders) {
		try {
			for (const folder of result.value) {
				if (folder.id) {
					await ctx.db.folders.upsertByEntityId(
						folder.id,
						toFolderRecord(folder),
					);
				}
			}
		} catch (error) {
			console.warn('Failed to save folders to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'outlook.folders.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const updateFolder: OutlookEndpoints['foldersUpdate'] = async (
	ctx,
	input,
) => {
	const result = await makeOutlookRequest<
		OutlookEndpointOutputs['foldersUpdate']
	>(`${userPath(input.user_id)}/mailFolders/${input.mail_folder_id}`, ctx.key, {
		method: 'PATCH',
		body: { displayName: input.displayName },
	});

	if (result.id && ctx.db.folders) {
		try {
			await ctx.db.folders.upsertByEntityId(result.id, toFolderRecord(result));
		} catch (error) {
			console.warn('Failed to update folder in database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'outlook.folders.update',
		{ mail_folder_id: input.mail_folder_id },
		'completed',
	);
	return result;
};

export const deleteFolder: OutlookEndpoints['foldersDelete'] = async (
	ctx,
	input,
) => {
	await makeOutlookRequest<void>(
		`${userPath(input.user_id)}/mailFolders/${input.folder_id}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	if (ctx.db.folders) {
		try {
			await ctx.db.folders.deleteByEntityId(input.folder_id);
		} catch (error) {
			console.warn('Failed to delete folder from database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'outlook.folders.delete',
		{ folder_id: input.folder_id },
		'completed',
	);
	return { success: true };
};
