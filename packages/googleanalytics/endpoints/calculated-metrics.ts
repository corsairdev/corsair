import { logEventFromContext } from 'corsair/core';
import type { GoogleAnalyticsEndpoints } from '..';
import { listQuery, makeAuthenticatedGoogleAnalyticsRequest } from '../client';
import type { GoogleAnalyticsEndpointOutputs } from './types';

// Calculated metrics are v1alpha only.
export const list: GoogleAnalyticsEndpoints['calculatedMetricsList'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedGoogleAnalyticsRequest<
		GoogleAnalyticsEndpointOutputs['calculatedMetricsList']
	>(`/v1alpha/${input.parent}/calculatedMetrics`, ctx, {
		method: 'GET',
		query: listQuery(input),
	});

	await logEventFromContext(
		ctx,
		'googleanalytics.calculatedMetrics.list',
		{ ...input },
		'completed',
	);
	return result;
};
