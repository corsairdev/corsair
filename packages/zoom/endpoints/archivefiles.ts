import { logEventFromContext } from 'corsair/core';
import type { ZoomEndpoints } from '..';
import { makeZoomRequest } from '../client';
import type { ZoomEndpointOutputs } from './types';

export const list: ZoomEndpoints['archiveFilesList'] = async (ctx, input) => {
	const result = await makeZoomRequest<ZoomEndpointOutputs['archiveFilesList']>(
		'archive_files',
		ctx.key,
		{
			method: 'GET',
			query: input,
		},
	);

	if (result.meetings && ctx.db.archiveFiles) {
		try {
			for (const meeting of result.meetings) {
				if (meeting.id && typeof meeting.id === 'string') {
					await ctx.db.archiveFiles.upsertByEntityId(meeting.id, meeting);
				}
			}
		} catch (error) {
			console.warn('Failed to save archive files to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'zoom.archiveFiles.list',
		{ ...input },
		'completed',
	);
	return result;
};
