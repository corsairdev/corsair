import { logEventFromContext } from 'corsair/core';
import type { GoogleAnalyticsEndpoints } from '..';
import {
	encodeResourcePath,
	listQuery,
	makeAuthenticatedGoogleAnalyticsRequest,
} from '../client';
import type { GoogleAnalyticsEndpointOutputs } from './types';

export const list: GoogleAnalyticsEndpoints['calculatedMetricsList'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedGoogleAnalyticsRequest<
		GoogleAnalyticsEndpointOutputs['calculatedMetricsList']
	>(`/v1alpha/${encodeResourcePath(input.parent)}/calculatedMetrics`, ctx, {
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
