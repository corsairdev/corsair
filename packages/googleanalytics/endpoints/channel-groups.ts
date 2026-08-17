import { logEventFromContext } from 'corsair/core';
import type { GoogleAnalyticsEndpoints } from '..';
import {
	encodeResourcePath,
	listQuery,
	makeAuthenticatedGoogleAnalyticsRequest,
} from '../client';
import type { GoogleAnalyticsEndpointOutputs } from './types';

// Channel groups are v1alpha.
export const list: GoogleAnalyticsEndpoints['channelGroupsList'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedGoogleAnalyticsRequest<
		GoogleAnalyticsEndpointOutputs['channelGroupsList']
	>(`/v1alpha/${encodeResourcePath(input.parent)}/channelGroups`, ctx, {
		method: 'GET',
		query: listQuery(input),
	});

	await logEventFromContext(
		ctx,
		'googleanalytics.channelGroups.list',
		{ ...input },
		'completed',
	);
	return result;
};
