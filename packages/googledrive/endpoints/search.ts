import { logEventFromContext } from 'corsair/core';
import { makeAuthenticatedGoogleDriveRequest } from '../client';
import type { GoogleDriveEndpoints } from '../index';
import { saveDriveFile, withNextPageToken } from './files';
import type { GoogleDriveEndpointOutputs } from './types';

export const filesAndFolders: GoogleDriveEndpoints['searchFilesAndFolders'] =
	async (ctx, input) => {
		const result = await makeAuthenticatedGoogleDriveRequest<
			GoogleDriveEndpointOutputs['searchFilesAndFolders']
		>('/files', ctx, {
			method: 'GET',
			query: {
				q: input.q,
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
				fields: withNextPageToken(input.fields),
			},
		});

		if (result.files) {
			try {
				for (const item of result.files) await saveDriveFile(ctx, item);
			} catch (error) {
				console.warn('Failed to save search results to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'googledrive.search.filesAndFolders',
			{ ...input },
			'completed',
		);
		return result;
	};
