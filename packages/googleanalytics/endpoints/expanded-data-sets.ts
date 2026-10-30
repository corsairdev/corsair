import { logEventFromContext } from 'corsair/core';
import type { GoogleAnalyticsEndpoints } from '..';
import {
	encodeResourcePath,
	jsonObjectBody,
	listQuery,
	makeAuthenticatedGoogleAnalyticsRequest,
} from '../client';
import type { GoogleAnalyticsEndpointOutputs } from './types';

export const create: GoogleAnalyticsEndpoints['expandedDataSetsCreate'] =
	async (ctx, input) => {
		const result = await makeAuthenticatedGoogleAnalyticsRequest<
			GoogleAnalyticsEndpointOutputs['expandedDataSetsCreate']
		>(`/v1alpha/${encodeResourcePath(input.parent)}/expandedDataSets`, ctx, {
			method: 'POST',
			body: jsonObjectBody(input.expandedDataSet),
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
	>(`/v1alpha/${encodeResourcePath(input.parent)}/expandedDataSets`, ctx, {
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
