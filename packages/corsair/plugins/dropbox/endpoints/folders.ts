import { logEventFromContext } from '../../utils/events';
import type { DropboxEndpoints } from '..';
import { makeDropboxRequest } from '../client';
import type { DropboxEndpointOutputs } from './types';

export const copy: DropboxEndpoints['foldersCopy'] = async (ctx, input) => {
	const result = await makeDropboxRequest<
		DropboxEndpointOutputs['foldersCopy']
	>('files/copy_v2', ctx.key, {
		method: 'POST',
		body: {
			from_path: input.from_path,
			to_path: input.to_path,
			allow_shared_folder: input.allow_shared_folder,
			autorename: input.autorename,
			allow_ownership_transfer: input.allow_ownership_transfer,
		},
	});

	if (result.metadata && ctx.db.folders) {
		try {
			const meta = result.metadata;
			if (!('size' in meta) && meta.id) {
				await ctx.db.folders.upsertByEntityId(meta.id, {
					id: meta.id,
					name: meta.name,
					path_lower: meta.path_lower,
					path_display: meta.path_display,
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
					id: meta.id,
					name: meta.name,
					path_lower: meta.path_lower,
					path_display: meta.path_display,
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
			if (!('size' in meta) && meta.id) {
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
		body: {
			path: input.path,
			recursive: input.recursive,
			include_deleted: input.include_deleted,
			include_mounted_folders: input.include_mounted_folders,
			limit: input.limit,
		},
	});
	console.log(result, 'result');

	if (result.entries && ctx.db.files && ctx.db.folders) {
		try {
			for (const entry of result.entries) {
				if (!entry.id) continue;

				if ('size' in entry) {
					await ctx.db.files.upsertByEntityId(entry.id, {
						id: entry.id,
						name: entry.name,
						path_lower: entry.path_lower,
						path_display: entry.path_display,
						// any cast needed because entry is a union type at runtime
						size: (entry as { size?: number }).size,
					});
				} else {
					await ctx.db.folders.upsertByEntityId(entry.id, {
						id: entry.id,
						name: entry.name,
						path_lower: entry.path_lower,
						path_display: entry.path_display,
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
			for (const entry of result.entries) {
				if (!entry.id) continue;

				if ('size' in entry) {
					await ctx.db.files.upsertByEntityId(entry.id, {
						id: entry.id,
						name: entry.name,
						path_lower: entry.path_lower,
						path_display: entry.path_display,
						// any cast needed because entry is a union type at runtime
						size: (entry as { size?: number }).size,
					});
				} else {
					await ctx.db.folders.upsertByEntityId(entry.id, {
						id: entry.id,
						name: entry.name,
						path_lower: entry.path_lower,
						path_display: entry.path_display,
					});
				}
			}
		} catch (error) {
			console.warn('Failed to save list_folder/continue entries to database:', error);
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
		body: {
			from_path: input.from_path,
			to_path: input.to_path,
			allow_shared_folder: input.allow_shared_folder,
			autorename: input.autorename,
			allow_ownership_transfer: input.allow_ownership_transfer,
		},
	});

	if (result.metadata && ctx.db.folders) {
		try {
			const meta = result.metadata;
			if (!('size' in meta) && meta.id) {
				await ctx.db.folders.upsertByEntityId(meta.id, {
					id: meta.id,
					name: meta.name,
					path_lower: meta.path_lower,
					path_display: meta.path_display,
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
