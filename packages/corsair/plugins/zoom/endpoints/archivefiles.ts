import { logEventFromContext } from '../../utils/events';
import type { ZoomEndpoints } from '..';
import { makeZoomRequest } from '../client';
import type { ZoomEndpointOutputs } from './types';

export const list: ZoomEndpoints['archiveFilesList'] = async (ctx, input) => {
	const result = await makeZoomRequest<ZoomEndpointOutputs['archiveFilesList']>(
		'archive_files',
		ctx.key,
		{
			method: 'GET',
			query: input
		},
	);

	if (result.meetings && ctx.db.archiveFiles) {
		try {
			for (const meeting of result.meetings) {
				const m = meeting
				const meetingId = m.id
				if (meetingId && typeof meetingId === 'string') {
					await ctx.db.archiveFiles.upsertByEntityId(meetingId, m);
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
