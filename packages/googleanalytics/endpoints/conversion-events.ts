import { logEventFromContext } from 'corsair/core';
import type { GoogleAnalyticsEndpoints } from '..';
import { listQuery, makeAuthenticatedGoogleAnalyticsRequest } from '../client';
import type { GoogleAnalyticsEndpointOutputs } from './types';

// Deprecated; prefer keyEvents.list. Still served by the v1beta endpoint.
export const list: GoogleAnalyticsEndpoints['conversionEventsList'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedGoogleAnalyticsRequest<
		GoogleAnalyticsEndpointOutputs['conversionEventsList']
	>(`/v1beta/${input.parent}/conversionEvents`, ctx, {
		method: 'GET',
		query: listQuery(input),
	});

	await logEventFromContext(
		ctx,
		'googleanalytics.conversionEvents.list',
		{ ...input },
		'completed',
	);
	return result;
};
