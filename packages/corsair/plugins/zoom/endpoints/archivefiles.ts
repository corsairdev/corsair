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
			query: {
				page_size: input.page_size,
				next_page_token: input.next_page_token,
				from: input.from,
				to: input.to,
				type: input.type,
				query_date_type: input.query_date_type,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'zoom.archiveFiles.list',
		{ ...input },
		'completed',
	);
	return result;
};
