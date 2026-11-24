import { logEventFromContext } from 'corsair/core';
import { makeAuthenticatedGoogleDriveRequest } from '../client';
import type { GoogleDriveEndpoints } from '../index';
import { saveFile } from './files';
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
				// A fields mask without nextPageToken silently ends pagination.
				fields:
					input.fields && !input.fields.includes('nextPageToken')
						? `nextPageToken,${input.fields}`
						: input.fields,
			},
		});

		if (result.files) {
			try {
				for (const item of result.files) {
					if (item.id) {
						const isFolder =
							item.mimeType === 'application/vnd.google-apps.folder';
						await saveFile(
							isFolder ? ctx.db.folders : ctx.db.files,
							{ ...item, id: item.id, createdAt: new Date() },
							Boolean(input.fields),
						);
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
