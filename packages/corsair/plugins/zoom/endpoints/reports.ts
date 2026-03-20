import { logEventFromContext } from '../../utils/events';
import type { ZoomEndpoints } from '..';
import { makeZoomRequest } from '../client';
import type { ZoomEndpointOutputs } from './types';

export const dailyUsage: ZoomEndpoints['reportsDailyUsage'] = async (
	ctx,
	input,
) => {
	const result = await makeZoomRequest<ZoomEndpointOutputs['reportsDailyUsage']>(
		'report/daily',
		ctx.key,
		{
			method: 'GET',
			query: input
		},
	);

	await logEventFromContext(
		ctx,
		'zoom.reports.dailyUsage',
		{ ...input },
		'completed',
	);
	return result;
};
