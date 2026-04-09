import { logEventFromContext } from 'corsair/core';
import type { DropboxEndpoints } from '..';
import { DROPBOX_CONTENT_BASE, makeDropboxRequest } from '../client';
import type { DropboxEndpointOutputs } from './types';

export const copy: DropboxEndpoints['filesCopy'] = async (ctx, input) => {
	const result = await makeDropboxRequest<DropboxEndpointOutputs['filesCopy']>(
		'files/copy_v2',
		ctx.key,
		{
			method: 'POST',
			body: input,
		},
	);

	if (result.metadata && ctx.db.files) {
		try {
			const meta = result.metadata;
			if (meta['.tag'] === 'file') {
				await ctx.db.files.upsertByEntityId(meta.id, {
					...meta,
					client_modified: meta.client_modified
						? new Date(meta.client_modified)
						: null,
					server_modified: meta.server_modified
						? new Date(meta.server_modified)
						: null,
				});
			}
		} catch (error) {
			console.warn('Failed to save file to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'dropbox.files.copy',
		{ from_path: input.from_path, to_path: input.to_path },
		'completed',
	);
	return result;
};

export const deleteFile: DropboxEndpoints['filesDelete'] = async (
	ctx,
	input,
) => {
	const result = await makeDropboxRequest<
		DropboxEndpointOutputs['filesDelete']
	>('files/delete_v2', ctx.key, {
		method: 'POST',
		body: { path: input.path },
	});

	if (ctx.db.files) {
		try {
			const meta = result.metadata;
			if (meta['.tag'] === 'file') {
				await ctx.db.files.deleteByEntityId(meta.id);
			}
		} catch (error) {
			console.warn('Failed to delete file from database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'dropbox.files.delete',
		{ path: input.path },
		'completed',
	);
	return result;
};

export const download: DropboxEndpoints['filesDownload'] = async (
	ctx,
	input,
) => {
	// Dropbox download uses content.dropboxapi.com with metadata in Dropbox-API-Arg header.
	// The response body is the raw file content (text/binary), not JSON.
	const result = await makeDropboxRequest<
		DropboxEndpointOutputs['filesDownload']
	>('files/download', ctx.key, {
		method: 'POST',
		baseUrl: DROPBOX_CONTENT_BASE,
		extraHeaders: {
			'Dropbox-API-Arg': JSON.stringify({ path: input.path }),
		},
	});

	await logEventFromContext(
		ctx,
		'dropbox.files.download',
		{ path: input.path },
		'completed',
	);
	return result;
};

export const move: DropboxEndpoints['filesMove'] = async (ctx, input) => {
	const result = await makeDropboxRequest<DropboxEndpointOutputs['filesMove']>(
		'files/move_v2',
		ctx.key,
		{
			method: 'POST',
			body: input,
		},
	);

	if (result.metadata && ctx.db.files) {
		try {
			const meta = result.metadata;
			if (meta['.tag'] === 'file') {
				await ctx.db.files.upsertByEntityId(meta.id, {
					...meta,
					client_modified: meta.client_modified
						? new Date(meta.client_modified)
						: null,
					server_modified: meta.server_modified
						? new Date(meta.server_modified)
						: null,
				});
			}
		} catch (error) {
			console.warn('Failed to update file in database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'dropbox.files.move',
		{ from_path: input.from_path, to_path: input.to_path },
		'completed',
	);
	return result;
};

export const upload: DropboxEndpoints['filesUpload'] = async (ctx, input) => {
	// Dropbox upload uses content.dropboxapi.com. Metadata goes in Dropbox-API-Arg header;
	// the request body is the raw file content (string/bytes), not JSON.
	const result = await makeDropboxRequest<
		DropboxEndpointOutputs['filesUpload']
	>('files/upload', ctx.key, {
		method: 'POST',
		baseUrl: DROPBOX_CONTENT_BASE,
		extraHeaders: {
			'Dropbox-API-Arg': JSON.stringify({
				path: input.path,
				mode: input.mode ?? 'add',
				autorename: input.autorename ?? false,
				mute: input.mute ?? false,
				strict_conflict: input.strict_conflict ?? false,
			}),
			'Content-Type': 'application/octet-stream',
		},
		body: input.content,
	});

	if (result.id && ctx.db.files) {
		try {
			await ctx.db.files.upsertByEntityId(result.id, {
				...result,
				client_modified: result.client_modified
					? new Date(result.client_modified)
					: null,
				server_modified: result.server_modified
					? new Date(result.server_modified)
					: null,
			});
		} catch (error) {
			console.warn('Failed to save uploaded file to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'dropbox.files.upload',
		{ path: input.path },
		'completed',
	);
	return result;
};
