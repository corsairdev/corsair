import { logEventFromContext } from 'corsair/core';
import type { GoogleAnalyticsEndpoints } from '..';
import {
	encodeResourcePath,
	listQuery,
	makeAuthenticatedGoogleAnalyticsRequest,
} from '../client';
import type { GoogleAnalyticsEndpointOutputs } from './types';

export const list: GoogleAnalyticsEndpoints['conversionEventsList'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedGoogleAnalyticsRequest<
		GoogleAnalyticsEndpointOutputs['conversionEventsList']
	>(`/v1beta/${encodeResourcePath(input.parent)}/conversionEvents`, ctx, {
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
