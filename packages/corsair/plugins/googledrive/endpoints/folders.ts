import { logEventFromContext } from '../../utils/events';
import type { GoogleDriveEndpoints } from '..';
import { makeGoogleDriveRequest } from '../client';
import type { GoogleDriveEndpointOutputs } from './types';

export const create: GoogleDriveEndpoints['foldersCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeGoogleDriveRequest<
		GoogleDriveEndpointOutputs['foldersCreate']
	>('/files', ctx.key, {
		method: 'POST',
		body: {
			name: input.name,
			mimeType: 'application/vnd.google-apps.folder',
			parents: input.parents,
			description: input.description,
		},
	});

	if (result.id && ctx.db.folders) {
		try {
			await ctx.db.folders.upsertByEntityId(result.id, {
				...result,
				id: result.id,
				createdAt: new Date(),
			});
		} catch (error) {
			console.warn('Failed to save folder to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'googledrive.folders.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: GoogleDriveEndpoints['foldersGet'] = async (ctx, input) => {
	const result = await makeGoogleDriveRequest<
		GoogleDriveEndpointOutputs['foldersGet']
	>(`/files/${input.folderId}`, ctx.key, {
		method: 'GET',
		query: {
			supportsAllDrives: input.supportsAllDrives,
			supportsTeamDrives: input.supportsTeamDrives,
			includePermissionsForView: input.includePermissionsForView,
		},
	});

	if (result.id && ctx.db.folders) {
		try {
			await ctx.db.folders.upsertByEntityId(result.id, {
				...result,
				id: result.id,
				createdAt: new Date(),
			});
		} catch (error) {
			console.warn('Failed to save folder to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'googledrive.folders.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const list: GoogleDriveEndpoints['foldersList'] = async (ctx, input) => {
	const q = `mimeType='application/vnd.google-apps.folder'${input.q ? ` and ${input.q}` : ''}`;
	const result = await makeGoogleDriveRequest<
		GoogleDriveEndpointOutputs['foldersList']
	>('/files', ctx.key, {
		method: 'GET',
		query: {
			q,
			pageSize: input.pageSize,
			pageToken: input.pageToken,
			spaces: input.spaces,
			corpora: input.corpora,
			driveId: input.driveId,
			includeItemsFromAllDrives: input.includeItemsFromAllDrives,
			includePermissionsForView: input.includePermissionsForView,
			orderBy: input.orderBy,
			supportsAllDrives: input.supportsAllDrives,
			supportsTeamDrives: input.supportsTeamDrives,
			teamDriveId: input.teamDriveId,
		},
	});

	if (result.files && ctx.db.folders) {
		try {
			for (const folder of result.files) {
				if (folder.id) {
					await ctx.db.folders.upsertByEntityId(folder.id, {
						...folder,
						id: folder.id,
						createdAt: new Date(),
					});
				}
			}
		} catch (error) {
			console.warn('Failed to save folders to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'googledrive.folders.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const deleteFolder: GoogleDriveEndpoints['foldersDelete'] = async (
	ctx,
	input,
) => {
	await makeGoogleDriveRequest<GoogleDriveEndpointOutputs['foldersDelete']>(
		`/files/${input.folderId}`,
		ctx.key,
		{
			method: 'DELETE',
			query: {
				supportsAllDrives: input.supportsAllDrives,
				supportsTeamDrives: input.supportsTeamDrives,
			},
		},
	);

	if (ctx.db.folders) {
		try {
			await ctx.db.folders.deleteByEntityId(input.folderId);
		} catch (error) {
			console.warn('Failed to delete folder from database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'googledrive.folders.delete',
		{ ...input },
		'completed',
	);
};

export const share: GoogleDriveEndpoints['foldersShare'] = async (
	ctx,
	input,
) => {
	const result = await makeGoogleDriveRequest<
		GoogleDriveEndpointOutputs['foldersShare']
	>(`/files/${input.folderId}/permissions`, ctx.key, {
		method: 'POST',
		body: {
			type: input.type,
			role: input.role,
			emailAddress: input.emailAddress,
			domain: input.domain,
			allowFileDiscovery: input.allowFileDiscovery,
			expirationTime: input.expirationTime,
			sendNotificationEmail: input.sendNotificationEmail,
			emailMessage: input.emailMessage,
		},
		query: {
			supportsAllDrives: input.supportsAllDrives,
			supportsTeamDrives: input.supportsTeamDrives,
			moveToNewOwnersRoot: input.moveToNewOwnersRoot,
			transferOwnership: input.transferOwnership,
		},
	});

	await logEventFromContext(
		ctx,
		'googledrive.folders.share',
		{ ...input },
		'completed',
	);
	return result;
};
