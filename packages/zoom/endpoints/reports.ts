import { logEventFromContext } from 'corsair/core';
import { makeZoomRequest } from '../client';
import type { ZoomEndpoints } from '../index';
import type { ZoomEndpointOutputs } from './types';

export const dailyUsage: ZoomEndpoints['reportsDailyUsage'] = async (
	ctx,
	input,
) => {
	const result = await makeZoomRequest<
		ZoomEndpointOutputs['reportsDailyUsage']
	>('report/daily', ctx.key, {
		method: 'GET',
		query: input,
	});

	await logEventFromContext(
		ctx,
		'zoom.reports.dailyUsage',
		{ ...input },
		'completed',
	);
	return result;
};
