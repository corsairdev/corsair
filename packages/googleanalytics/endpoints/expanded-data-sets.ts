import { logEventFromContext } from 'corsair/core';
import type { GoogleAnalyticsEndpoints } from '..';
import { listQuery, makeAuthenticatedGoogleAnalyticsRequest } from '../client';
import type { GoogleAnalyticsEndpointOutputs } from './types';

// Expanded data sets are v1alpha (GA4 360).
export const create: GoogleAnalyticsEndpoints['expandedDataSetsCreate'] =
	async (ctx, input) => {
		const result = await makeAuthenticatedGoogleAnalyticsRequest<
			GoogleAnalyticsEndpointOutputs['expandedDataSetsCreate']
		>(`/v1alpha/${input.parent}/expandedDataSets`, ctx, {
			method: 'POST',
			body: { expandedDataSet: input.expandedDataSet },
		});

		await logEventFromContext(
			ctx,
			'googleanalytics.expandedDataSets.create',
			{ ...input },
			'completed',
		);
		return result;
	};

export const list: GoogleAnalyticsEndpoints['expandedDataSetsList'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedGoogleAnalyticsRequest<
		GoogleAnalyticsEndpointOutputs['expandedDataSetsList']
	>(`/v1alpha/${input.parent}/expandedDataSets`, ctx, {
		method: 'GET',
		query: listQuery(input),
	});

	await logEventFromContext(
		ctx,
		'googleanalytics.expandedDataSets.list',
		{ ...input },
		'completed',
	);
	return result;
};
