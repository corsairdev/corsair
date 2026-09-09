import { logEventFromContext } from 'corsair/core';
import type { GoogleAnalyticsEndpoints } from '..';
import {
	encodeResourcePath,
	jsonObjectBody,
	listQuery,
	makeAuthenticatedGoogleAnalyticsRequest,
} from '../client';
import type { GoogleAnalyticsEndpointOutputs } from './types';

export const create: GoogleAnalyticsEndpoints['customMetricsCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedGoogleAnalyticsRequest<
		GoogleAnalyticsEndpointOutputs['customMetricsCreate']
	>(`/v1beta/${encodeResourcePath(input.parent)}/customMetrics`, ctx, {
		method: 'POST',
		body: jsonObjectBody(input.customMetric),
	});

	await logEventFromContext(
		ctx,
		'googleanalytics.customMetrics.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const list: GoogleAnalyticsEndpoints['customMetricsList'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedGoogleAnalyticsRequest<
		GoogleAnalyticsEndpointOutputs['customMetricsList']
	>(`/v1beta/${encodeResourcePath(input.parent)}/customMetrics`, ctx, {
		method: 'GET',
		query: listQuery(input),
	});

	await logEventFromContext(
		ctx,
		'googleanalytics.customMetrics.list',
		{ ...input },
		'completed',
	);
	return result;
};
