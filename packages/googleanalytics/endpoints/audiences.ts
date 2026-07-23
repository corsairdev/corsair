import { logEventFromContext } from 'corsair/core';
import type { GoogleAnalyticsEndpoints } from '..';
import { listQuery, makeAuthenticatedGoogleAnalyticsRequest } from '../client';
import type { GoogleAnalyticsEndpointOutputs } from './types';

// Audiences are configured via the Admin API v1alpha.
// name is "properties/{id}/audiences/{audience}".
export const get: GoogleAnalyticsEndpoints['audiencesGet'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedGoogleAnalyticsRequest<
		GoogleAnalyticsEndpointOutputs['audiencesGet']
	>(`/v1alpha/${input.name}`, ctx, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'googleanalytics.audiences.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const list: GoogleAnalyticsEndpoints['audiencesList'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedGoogleAnalyticsRequest<
		GoogleAnalyticsEndpointOutputs['audiencesList']
	>(`/v1alpha/${input.parent}/audiences`, ctx, {
		method: 'GET',
		query: listQuery(input),
	});

	await logEventFromContext(
		ctx,
		'googleanalytics.audiences.list',
		{ ...input },
		'completed',
	);
	return result;
};
