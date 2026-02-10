import { logEventFromContext } from '../../utils/events';
import type { GoogleDriveEndpoints } from '..';
import { makeGoogleDriveRequest } from '../client';
import type { FileList } from '../types';
import type { GoogleDriveEndpointOutputs } from './types';

export const filesAndFolders: GoogleDriveEndpoints['searchFilesAndFolders'] = async (
	ctx,
	input,
) => {
	const result = await makeGoogleDriveRequest<GoogleDriveEndpointOutputs['searchFilesAndFolders']>(
		'/files',
		ctx.key,
		{
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
			},
		},
	);

	if (result.files) {
		try {
			for (const item of result.files) {
				if (item.id) {
					const isFolder = item.mimeType === 'application/vnd.google-apps.folder';
					if (isFolder && ctx.db.folders) {
						await ctx.db.folders.upsertByEntityId(item.id, {
							...item,
							id: item.id,
							createdAt: new Date(),
						});
					} else if (!isFolder && ctx.db.files) {
						await ctx.db.files.upsertByEntityId(item.id, {
							...item,
							id: item.id,
							createdAt: new Date(),
						});
					}
				}
			}
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
