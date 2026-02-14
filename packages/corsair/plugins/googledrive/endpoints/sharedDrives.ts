import { logEventFromContext } from '../../utils/events';
import type { GoogleDriveEndpoints } from '..';
import { makeGoogleDriveRequest } from '../client';
import type { GoogleDriveEndpointOutputs } from './types';

export const create: GoogleDriveEndpoints['sharedDrivesCreate'] = async (
	ctx,
	input,
) => {
	const requestId = input.requestId || `req_${Date.now()}`;
	const result = await makeGoogleDriveRequest<
		GoogleDriveEndpointOutputs['sharedDrivesCreate']
	>('/drives', ctx.key, {
		method: 'POST',
		body: {
			name: input.name,
			themeId: input.themeId,
			colorRgb: input.colorRgb,
			restrictions: input.restrictions,
		},
		query: {
			requestId,
		},
	});

	if (result.id && ctx.db.sharedDrives) {
		try {
			await ctx.db.sharedDrives.upsertByEntityId(result.id, {
				...result,
				id: result.id,
				createdAt: new Date(),
			});
		} catch (error) {
			console.warn('Failed to save shared drive to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'googledrive.sharedDrives.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: GoogleDriveEndpoints['sharedDrivesGet'] = async (
	ctx,
	input,
) => {
	const result = await makeGoogleDriveRequest<
		GoogleDriveEndpointOutputs['sharedDrivesGet']
	>(`/drives/${input.driveId}`, ctx.key, {
		method: 'GET',
		query: {
			useDomainAdminAccess: input.useDomainAdminAccess,
		},
	});

	if (result.id && ctx.db.sharedDrives) {
		try {
			await ctx.db.sharedDrives.upsertByEntityId(result.id, {
				...result,
				id: result.id,
				createdAt: new Date(),
			});
		} catch (error) {
			console.warn('Failed to save shared drive to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'googledrive.sharedDrives.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const list: GoogleDriveEndpoints['sharedDrivesList'] = async (
	ctx,
	input,
) => {
	const result = await makeGoogleDriveRequest<
		GoogleDriveEndpointOutputs['sharedDrivesList']
	>('/drives', ctx.key, {
		method: 'GET',
		query: {
			pageSize: input.pageSize,
			pageToken: input.pageToken,
			q: input.q,
			useDomainAdminAccess: input.useDomainAdminAccess,
		},
	});

	if (result.drives && ctx.db.sharedDrives) {
		try {
			for (const drive of result.drives) {
				if (drive.id) {
					await ctx.db.sharedDrives.upsertByEntityId(drive.id, {
						...drive,
						id: drive.id,
						createdAt: new Date(),
					});
				}
			}
		} catch (error) {
			console.warn('Failed to save shared drives to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'googledrive.sharedDrives.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const update: GoogleDriveEndpoints['sharedDrivesUpdate'] = async (
	ctx,
	input,
) => {
	const result = await makeGoogleDriveRequest<
		GoogleDriveEndpointOutputs['sharedDrivesUpdate']
	>(`/drives/${input.driveId}`, ctx.key, {
		method: 'PATCH',
		body: {
			name: input.name,
			themeId: input.themeId,
			colorRgb: input.colorRgb,
			restrictions: input.restrictions,
		},
		query: {
			useDomainAdminAccess: input.useDomainAdminAccess,
		},
	});

	if (result.id && ctx.db.sharedDrives) {
		try {
			await ctx.db.sharedDrives.upsertByEntityId(result.id, {
				...result,
				id: result.id,
				createdAt: new Date(),
			});
		} catch (error) {
			console.warn('Failed to save shared drive to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'googledrive.sharedDrives.update',
		{ ...input },
		'completed',
	);
	return result;
};

export const deleteSharedDrive: GoogleDriveEndpoints['sharedDrivesDelete'] =
	async (ctx, input) => {
		await makeGoogleDriveRequest<
			GoogleDriveEndpointOutputs['sharedDrivesDelete']
		>(`/drives/${input.driveId}`, ctx.key, {
			method: 'DELETE',
		});

		if (ctx.db.sharedDrives) {
			try {
				await ctx.db.sharedDrives.deleteByEntityId(input.driveId);
			} catch (error) {
				console.warn('Failed to delete shared drive from database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'googledrive.sharedDrives.delete',
			{ ...input },
			'completed',
		);
	};
