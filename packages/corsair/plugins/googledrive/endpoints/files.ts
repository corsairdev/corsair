import { logEventFromContext } from '../../utils/events';
import type { GoogleDriveBoundEndpoints, GoogleDriveEndpoints } from '..';
import { makeGoogleDriveRequest } from '../client';
import type { GoogleDriveEndpointOutputs } from './types';

export const list: GoogleDriveEndpoints['filesList'] = async (ctx, input) => {
	const result = await makeGoogleDriveRequest<
		GoogleDriveEndpointOutputs['filesList']
	>('/files', ctx.key, {
		method: 'GET',
		query: input,
	});

	if (result.files && ctx.db.files) {
		try {
			for (const file of result.files) {
				if (file.id) {
					const isFolder =
						file.mimeType === 'application/vnd.google-apps.folder';
					if (isFolder && ctx.db.folders) {
						await ctx.db.folders.upsertByEntityId(file.id, {
							...file,
							id: file.id,
							createdAt: new Date(),
						});
					} else if (!isFolder) {
						await ctx.db.files.upsertByEntityId(file.id, {
							...file,
							id: file.id,
							createdAt: new Date(),
						});
					}
				}
			}
		} catch (error) {
			console.warn('Failed to save files to database:', error);
		}
	}	

	await logEventFromContext(
		ctx,
		'googledrive.files.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: GoogleDriveEndpoints['filesGet'] = async (ctx, input) => {
	const result = await makeGoogleDriveRequest<
		GoogleDriveEndpointOutputs['filesGet']
	>(`/files/${input.fileId}`, ctx.key, {
		method: 'GET',
		query: input,
	});

	if (result.id) {
		const isFolder = result.mimeType === 'application/vnd.google-apps.folder';
		try {
			if (isFolder && ctx.db.folders) {
				await ctx.db.folders.upsertByEntityId(result.id, {
					...result,
					id: result.id,
					createdAt: new Date(),
				});
			} else if (!isFolder && ctx.db.files) {
				await ctx.db.files.upsertByEntityId(result.id, {
					...result,
					id: result.id,
					createdAt: new Date(),
				});
			}
		} catch (error) {
			console.warn('Failed to save file to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'googledrive.files.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const createFromText: GoogleDriveEndpoints['filesCreateFromText'] =
	async (ctx, input) => {

		const result = await makeGoogleDriveRequest<
			GoogleDriveEndpointOutputs['filesCreateFromText']
		>('/files', ctx.key, {
			method: 'POST',
			body: {
				...input,
			},
			query: {
				uploadType: 'multipart',
			},
		});

		if (result.id) {
			const endpoints = ctx.endpoints as GoogleDriveBoundEndpoints;
			await endpoints.files.get({ fileId: result.id });
		}

		await logEventFromContext(
			ctx,
			'googledrive.files.createFromText',
			{ ...input },
			'completed',
		);
		return result;
	};

export const upload: GoogleDriveEndpoints['filesUpload'] = async (
	ctx,
	input,
) => {
	const result = await makeGoogleDriveRequest<
		GoogleDriveEndpointOutputs['filesUpload']
	>('/files', ctx.key, {
		method: 'POST',
		body: {
			...input,
		},
		query: {
			uploadType: 'multipart',
		},
	});

	if (result.id) {
		const endpoints = ctx.endpoints as GoogleDriveBoundEndpoints;
		await endpoints.files.get({ fileId: result.id });
	}

	await logEventFromContext(
		ctx,
		'googledrive.files.upload',
		{ ...input },
		'completed',
	);
	return result;
};

export const update: GoogleDriveEndpoints['filesUpdate'] = async (
	ctx,
	input,
) => {
	const result = await makeGoogleDriveRequest<
		GoogleDriveEndpointOutputs['filesUpdate']
	>(`/files/${input.fileId}`, ctx.key, {
		method: 'PATCH',
		body: {
			name: input.name,
			description: input.description,
			starred: input.starred,
			trashed: input.trashed,
			parents: input.parents,
			properties: input.properties,
			appProperties: input.appProperties,
		},
		query: {
			addParents: input.addParents,
			removeParents: input.removeParents,
			supportsAllDrives: input.supportsAllDrives,
			supportsTeamDrives: input.supportsTeamDrives,
		},
	});

	if (result.id) {
		const endpoints = ctx.endpoints as GoogleDriveBoundEndpoints;
		await endpoints.files.get({ fileId: result.id });
	}

	await logEventFromContext(
		ctx,
		'googledrive.files.update',
		{ ...input },
		'completed',
	);
	return result;
};

export const deleteFile: GoogleDriveEndpoints['filesDelete'] = async (
	ctx,
	input,
) => {
	await makeGoogleDriveRequest<GoogleDriveEndpointOutputs['filesDelete']>(
		`/files/${input.fileId}`,
		ctx.key,
		{
			method: 'DELETE',
			query: {
				supportsAllDrives: input.supportsAllDrives,
				supportsTeamDrives: input.supportsTeamDrives,
			},
		},
	);

	if (ctx.db.files) {
		try {
			await ctx.db.files.deleteByEntityId(input.fileId);
		} catch (error) {
			console.warn('Failed to delete file from database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'googledrive.files.delete',
		{ ...input },
		'completed',
	);
};

export const copy: GoogleDriveEndpoints['filesCopy'] = async (ctx, input) => {
	const result = await makeGoogleDriveRequest<
		GoogleDriveEndpointOutputs['filesCopy']
	>(`/files/${input.fileId}/copy`, ctx.key, {
		method: 'POST',
		body: {
			name: input.name,
			parents: input.parents,
		},
		query: {
			supportsAllDrives: input.supportsAllDrives,
			supportsTeamDrives: input.supportsTeamDrives,
		},
	});

	if (result.id) {
		const endpoints = ctx.endpoints as GoogleDriveBoundEndpoints;
		await endpoints.files.get({ fileId: result.id });
	}

	await logEventFromContext(
		ctx,
		'googledrive.files.copy',
		{ ...input },
		'completed',
	);
	return result;
};

export const move: GoogleDriveEndpoints['filesMove'] = async (ctx, input) => {
	const result = await makeGoogleDriveRequest<
		GoogleDriveEndpointOutputs['filesMove']
	>(`/files/${input.fileId}`, ctx.key, {
		method: 'PATCH',
		body: {},
		query: input,
	});

	if (result.id) {
		const endpoints = ctx.endpoints as GoogleDriveBoundEndpoints;
		await endpoints.files.get({ fileId: result.id });
	}

	await logEventFromContext(
		ctx,
		'googledrive.files.move',
		{ ...input },
		'completed',
	);
	return result;
};

export const download: GoogleDriveEndpoints['filesDownload'] = async (
	ctx,
	input,
) => {
	const result = await makeGoogleDriveRequest<
		GoogleDriveEndpointOutputs['filesDownload']
	>(`/files/${input.fileId}`, ctx.key, {
		method: 'GET',
		query: {
			alt: 'media',
			acknowledgeAbuse: input.acknowledgeAbuse,
		},
	});

	await logEventFromContext(
		ctx,
		'googledrive.files.download',
		{ ...input },
		'completed',
	);
	return result;
};

export const share: GoogleDriveEndpoints['filesShare'] = async (ctx, input) => {
	const result = await makeGoogleDriveRequest<
		GoogleDriveEndpointOutputs['filesShare']
	>(`/files/${input.fileId}/permissions`, ctx.key, {
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
		'googledrive.files.share',
		{ ...input },
		'completed',
	);
	return result;
};
