import { logEventFromContext } from 'corsair/core';
import type { DropboxEndpoints } from '..';
import { makeDropboxRequest } from '../client';
import type { DropboxEndpointOutputs } from './types';

export const copy: DropboxEndpoints['foldersCopy'] = async (ctx, input) => {
	const result = await makeDropboxRequest<
		DropboxEndpointOutputs['foldersCopy']
	>('files/copy_v2', ctx.key, {
		method: 'POST',
		body: input,
	});

	if (result.metadata && ctx.db.folders) {
		try {
			const meta = result.metadata;
			if (meta['.tag'] === 'folder') {
				await ctx.db.folders.upsertByEntityId(meta.id, {
					...meta,
				});
			}
		} catch (error) {
			console.warn('Failed to save folder to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'dropbox.folders.copy',
		{ from_path: input.from_path, to_path: input.to_path },
		'completed',
	);
	return result;
};

export const create: DropboxEndpoints['foldersCreate'] = async (ctx, input) => {
	const result = await makeDropboxRequest<
		DropboxEndpointOutputs['foldersCreate']
	>('files/create_folder_v2', ctx.key, {
		method: 'POST',
		body: {
			path: input.path,
			autorename: input.autorename,
		},
	});

	if (result.metadata && ctx.db.folders) {
		try {
			const meta = result.metadata;
			if (meta.id) {
				await ctx.db.folders.upsertByEntityId(meta.id, {
					...meta,
				});
			}
		} catch (error) {
			console.warn('Failed to save folder to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'dropbox.folders.create',
		{ path: input.path },
		'completed',
	);
	return result;
};

export const deleteFolder: DropboxEndpoints['foldersDelete'] = async (
	ctx,
	input,
) => {
	const result = await makeDropboxRequest<
		DropboxEndpointOutputs['foldersDelete']
	>('files/delete_v2', ctx.key, {
		method: 'POST',
		body: { path: input.path },
	});

	if (ctx.db.folders) {
		try {
			const meta = result.metadata;
			if (meta['.tag'] === 'folder') {
				await ctx.db.folders.deleteByEntityId(meta.id);
			}
		} catch (error) {
			console.warn('Failed to delete folder from database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'dropbox.folders.delete',
		{ path: input.path },
		'completed',
	);
	return result;
};

export const list: DropboxEndpoints['foldersList'] = async (ctx, input) => {
	const result = await makeDropboxRequest<
		DropboxEndpointOutputs['foldersList']
	>('files/list_folder', ctx.key, {
		method: 'POST',
		body: input,
	});

	if (result.entries && ctx.db.files && ctx.db.folders) {
		try {
			// Hoist the full-table reads outside the loop — fetch once if any deleted
			// entry is present rather than issuing 2×N scans for N deleted entries.
			const hasDeleted = result.entries.some((e) => e['.tag'] === 'deleted');
			const [allFiles, allFolders] = hasDeleted
				? await Promise.all([ctx.db.files.list(), ctx.db.folders.list()])
				: [[], []];

			for (const entry of result.entries) {
				if (entry['.tag'] === 'deleted') {
					// Deleted entries have no id — look up by path_lower to get the entity_id
					if (!entry.path_lower) continue;
					// TypedEntity.data is typed as ZodTypeAny inferred shape — cast to known schema
					const fileMatch = allFiles.find(
						(f) =>
							(f.data as { path_lower?: string }).path_lower ===
							entry.path_lower,
					);
					const folderMatch = allFolders.find(
						(f) =>
							(f.data as { path_lower?: string }).path_lower ===
							entry.path_lower,
					);
					await Promise.allSettled([
						fileMatch
							? ctx.db.files.deleteByEntityId(fileMatch.entity_id)
							: Promise.resolve(),
						folderMatch
							? ctx.db.folders.deleteByEntityId(folderMatch.entity_id)
							: Promise.resolve(),
					]);
				} else if (entry['.tag'] === 'folder') {
					await ctx.db.folders.upsertByEntityId(entry.id, {
						...entry,
					});
				} else {
					// entry is narrowed to FileMetadata — size is typed
					await ctx.db.files.upsertByEntityId(entry.id, {
						...entry,
						server_modified: entry.server_modified
							? new Date(entry.server_modified)
							: null,
						client_modified: entry.client_modified
							? new Date(entry.client_modified)
							: null,
					});
				}
			}
		} catch (error) {
			console.warn('Failed to save folder entries to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'dropbox.folders.list',
		{ path: input.path },
		'completed',
	);
	return result;
};

export const listContinue: DropboxEndpoints['foldersListContinue'] = async (
	ctx,
	input,
) => {
	const result = await makeDropboxRequest<
		DropboxEndpointOutputs['foldersListContinue']
	>('files/list_folder/continue', ctx.key, {
		method: 'POST',
		body: { cursor: input.cursor },
	});

	if (result.entries && ctx.db.files && ctx.db.folders) {
		try {
			// Hoist the full-table reads outside the loop — fetch once if any deleted
			// entry is present rather than issuing 2×N scans for N deleted entries.
			const hasDeleted = result.entries.some((e) => e['.tag'] === 'deleted');
			const [allFiles, allFolders] = hasDeleted
				? await Promise.all([ctx.db.files.list(), ctx.db.folders.list()])
				: [[], []];

			for (const entry of result.entries) {
				if (entry['.tag'] === 'deleted') {
					// Deleted entries have no id — look up by path_lower to get the entity_id
					if (!entry.path_lower) continue;
					// TypedEntity.data is typed as ZodTypeAny inferred shape — cast to known schema
					const fileMatch = allFiles.find(
						(f) =>
							(f.data as { path_lower?: string }).path_lower ===
							entry.path_lower,
					);
					const folderMatch = allFolders.find(
						(f) =>
							(f.data as { path_lower?: string }).path_lower ===
							entry.path_lower,
					);
					await Promise.allSettled([
						fileMatch
							? ctx.db.files.deleteByEntityId(fileMatch.entity_id)
							: Promise.resolve(),
						folderMatch
							? ctx.db.folders.deleteByEntityId(folderMatch.entity_id)
							: Promise.resolve(),
					]);
				} else if (entry['.tag'] === 'folder') {
					await ctx.db.folders.upsertByEntityId(entry.id, {
						...entry,
					});
				} else {
					// entry is narrowed to FileMetadata — size is typed
					await ctx.db.files.upsertByEntityId(entry.id, {
						...entry,
						server_modified: entry.server_modified
							? new Date(entry.server_modified)
							: null,
						client_modified: entry.client_modified
							? new Date(entry.client_modified)
							: null,
					});
				}
			}
		} catch (error) {
			console.warn(
				'Failed to save list_folder/continue entries to database:',
				error,
			);
		}
	}

	await logEventFromContext(
		ctx,
		'dropbox.folders.listContinue',
		{ cursor: input.cursor },
		'completed',
	);
	return result;
};

export const move: DropboxEndpoints['foldersMove'] = async (ctx, input) => {
	const result = await makeDropboxRequest<
		DropboxEndpointOutputs['foldersMove']
	>('files/move_v2', ctx.key, {
		method: 'POST',
		body: input,
	});

	if (result.metadata && ctx.db.folders) {
		try {
			const meta = result.metadata;
			if (meta['.tag'] === 'folder') {
				await ctx.db.folders.upsertByEntityId(meta.id, {
					...meta,
				});
			}
		} catch (error) {
			console.warn('Failed to update folder in database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'dropbox.folders.move',
		{ from_path: input.from_path, to_path: input.to_path },
		'completed',
	);
	return result;
};
