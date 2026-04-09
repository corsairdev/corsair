import { logEventFromContext } from 'corsair/core';
import type { SharepointEndpoints } from '..';
import { makeGraphRequest, resolveSiteGuid } from '../client';
import type { SharepointEndpointOutputs } from './types';

export const upload: SharepointEndpoints['filesUpload'] = async (
	ctx,
	input,
) => {
	const siteId = await resolveSiteGuid(
		(await ctx.keys.get_site_id()) ?? ctx.options?.siteId ?? '',
		ctx.key,
	);
	const folderPath = input.folder_server_relative_url.replace(/^\/+/, '');
	const content = input.content_text ?? input.content_base64 ?? '';
	const fileBody = content;

	const result = await makeGraphRequest<
		SharepointEndpointOutputs['filesUpload']
	>(
		`/sites/${siteId}/drive/root:/${folderPath}/${encodeURIComponent(input.file_name)}:/content`,
		ctx.key,
		{ method: 'PUT', body: fileBody, mediaType: 'text/plain' },
	);

	if (result.id && ctx.db.files) {
		try {
			await ctx.db.files.upsertByEntityId(result.id, {
				id: result.id,
				name: result.name,
				serverRelativeUrl: result.webUrl,
				timeCreated: result.createdDateTime,
				timeLastModified: result.lastModifiedDateTime,
				createdAt: new Date(),
			});
		} catch (error) {
			console.warn('Failed to save uploaded file to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'sharepoint.files.upload',
		{ ...input },
		'completed',
	);
	return result;
};

export const download: SharepointEndpoints['filesDownload'] = async (
	ctx,
	input,
) => {
	const siteId = await resolveSiteGuid(
		(await ctx.keys.get_site_id()) ?? ctx.options?.siteId ?? '',
		ctx.key,
	);
	const drivePath = input.server_relative_url.replace(/^\/+/, '');

	const result = await makeGraphRequest<
		SharepointEndpointOutputs['filesDownload']
	>(`/sites/${siteId}/drive/root:/${drivePath}:/content`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'sharepoint.files.download',
		{ ...input },
		'completed',
	);
	return result;
};

export const listInFolder: SharepointEndpoints['filesListInFolder'] = async (
	ctx,
	input,
) => {
	const siteId = await resolveSiteGuid(
		(await ctx.keys.get_site_id()) ?? ctx.options?.siteId ?? '',
		ctx.key,
	);
	const folderPath = input.folder_server_relative_url.replace(/^\/+/, '');
	const query: Record<string, string | number | boolean | undefined> = {};
	if (input.filter) query['$filter'] = input.filter;
	if (input.select) query['$select'] = input.select;

	const result = await makeGraphRequest<
		SharepointEndpointOutputs['filesListInFolder']
	>(`/sites/${siteId}/drive/root:/${folderPath}:/children`, ctx.key, {
		method: 'GET',
		query,
	});

	if (result.value && ctx.db.files) {
		try {
			for (const file of result.value) {
				if (file.id && file.file) {
					await ctx.db.files.upsertByEntityId(file.id, {
						id: file.id,
						name: file.name,
						serverRelativeUrl: file.webUrl,
						timeCreated: file.createdDateTime,
						timeLastModified: file.lastModifiedDateTime,
					});
				}
			}
		} catch (error) {
			console.warn('Failed to save files to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'sharepoint.files.listInFolder',
		{ ...input },
		'completed',
	);
	return result;
};

export const recycle: SharepointEndpoints['filesRecycle'] = async (
	ctx,
	input,
) => {
	const siteId = await resolveSiteGuid(
		(await ctx.keys.get_site_id()) ?? ctx.options?.siteId ?? '',
		ctx.key,
	);
	const drivePath = input.server_relative_url.replace(/^\/+/, '');

	// Resolve file ID before deletion so we can remove the DB record by entity ID
	const file = await makeGraphRequest<{ id?: string }>(
		`/sites/${siteId}/drive/root:/${drivePath}`,
		ctx.key,
		{ method: 'GET', query: { $select: 'id' } },
	);

	await makeGraphRequest<Record<string, unknown>>(
		`/sites/${siteId}/drive/root:/${drivePath}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	if (ctx.db.files && file.id) {
		try {
			await ctx.db.files.deleteByEntityId(file.id);
		} catch (error) {
			console.warn('Failed to delete file from database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'sharepoint.files.recycle',
		{ ...input },
		'completed',
	);
	return { value: undefined };
};

export const checkIn: SharepointEndpoints['filesCheckIn'] = async (
	ctx,
	input,
) => {
	const siteId = await resolveSiteGuid(
		(await ctx.keys.get_site_id()) ?? ctx.options?.siteId ?? '',
		ctx.key,
	);
	const drivePath = input.server_relative_path.replace(/^\/+/, '');

	const item = await makeGraphRequest<{ id?: string }>(
		`/sites/${siteId}/drive/root:/${drivePath}`,
		ctx.key,
		{ method: 'GET', query: { $select: 'id' } },
	);

	await makeGraphRequest<Record<string, unknown>>(
		`/sites/${siteId}/drive/items/${item.id}/checkin`,
		ctx.key,
		{
			method: 'POST',
			body: {
				comment: input.comment ?? '',
				checkInAs: input.checkintype === 0 ? 'unspecified' : 'published',
			},
		},
	);

	if (item.id && ctx.db.files) {
		try {
			const existing = await ctx.db.files.findByEntityId(item.id);
			await ctx.db.files.upsertByEntityId(item.id, {
				...(existing?.data ?? {}),
				id: item.id,
				checkOutType: 0, // 0 = checked in
				modifiedAt: new Date(),
			});
		} catch (error) {
			console.warn('Failed to update file check-in status in database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'sharepoint.files.checkIn',
		{ ...input },
		'completed',
	);
	return {
		status: 200,
		message: 'File checked in successfully',
		server_relative_path: input.server_relative_path,
	};
};

export const checkOut: SharepointEndpoints['filesCheckOut'] = async (
	ctx,
	input,
) => {
	const siteId = await resolveSiteGuid(
		(await ctx.keys.get_site_id()) ?? ctx.options?.siteId ?? '',
		ctx.key,
	);
	const drivePath = input.server_relative_path.replace(/^\/+/, '');

	const item = await makeGraphRequest<{ id?: string }>(
		`/sites/${siteId}/drive/root:/${drivePath}`,
		ctx.key,
		{ method: 'GET', query: { $select: 'id' } },
	);

	await makeGraphRequest<Record<string, unknown>>(
		`/sites/${siteId}/drive/items/${item.id}/checkout`,
		ctx.key,
		{ method: 'POST' },
	);

	if (item.id && ctx.db.files) {
		try {
			const existing = await ctx.db.files.findByEntityId(item.id);
			await ctx.db.files.upsertByEntityId(item.id, {
				...(existing?.data ?? {}),
				id: item.id,
				checkOutType: 1, // 1 = exclusive check out
				modifiedAt: new Date(),
			});
		} catch (error) {
			console.warn(
				'Failed to update file check-out status in database:',
				error,
			);
		}
	}

	await logEventFromContext(
		ctx,
		'sharepoint.files.checkOut',
		{ ...input },
		'completed',
	);
	return {
		message: 'File checked out successfully',
		server_relative_path: input.server_relative_path,
	};
};

export const undoCheckout: SharepointEndpoints['filesUndoCheckout'] = async (
	ctx,
	input,
) => {
	const siteId = await resolveSiteGuid(
		(await ctx.keys.get_site_id()) ?? ctx.options?.siteId ?? '',
		ctx.key,
	);
	const drivePath = input.server_relative_path.replace(/^\/+/, '');

	const item = await makeGraphRequest<{ id?: string }>(
		`/sites/${siteId}/drive/root:/${drivePath}`,
		ctx.key,
		{ method: 'GET', query: { $select: 'id' } },
	);

	await makeGraphRequest<Record<string, unknown>>(
		`/sites/${siteId}/drive/items/${item.id}/discardCheckout`,
		ctx.key,
		{ method: 'POST' },
	);

	if (item.id && ctx.db.files) {
		try {
			const existing = await ctx.db.files.findByEntityId(item.id);
			await ctx.db.files.upsertByEntityId(item.id, {
				...(existing?.data ?? {}),
				id: item.id,
				checkOutType: 0, // 0 = checked in (undo restores to checked-in state)
				modifiedAt: new Date(),
			});
		} catch (error) {
			console.warn(
				'Failed to update file undo-checkout status in database:',
				error,
			);
		}
	}

	await logEventFromContext(
		ctx,
		'sharepoint.files.undoCheckout',
		{ ...input },
		'completed',
	);
	return {
		message: 'File checkout undone successfully',
		server_relative_path: input.server_relative_path,
	};
};

export const getFile: SharepointEndpoints['filesGet'] = async (ctx, input) => {
	const siteId = await resolveSiteGuid(
		(await ctx.keys.get_site_id()) ?? ctx.options?.siteId ?? '',
		ctx.key,
	);
	const drivePath = input.server_relative_url.replace(/^\/+/, '');

	const result = await makeGraphRequest<SharepointEndpointOutputs['filesGet']>(
		`/sites/${siteId}/drive/root:/${drivePath}`,
		ctx.key,
		{ method: 'GET' },
	);

	if (result.id && ctx.db.files) {
		try {
			await ctx.db.files.upsertByEntityId(result.id, {
				id: result.id,
				name: result.name,
				serverRelativeUrl: result.webUrl,
				timeCreated: result.createdDateTime,
				timeLastModified: result.lastModifiedDateTime,
			});
		} catch (error) {
			console.warn('Failed to save file to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'sharepoint.files.get',
		{ ...input },
		'completed',
	);
	return result;
};
