import { logEventFromContext } from 'corsair/core';
import type { GoogleAnalyticsEndpoints } from '..';
import {
	encodeResourcePath,
	listQuery,
	makeAuthenticatedGoogleAnalyticsRequest,
} from '../client';
import type { GoogleAnalyticsEndpointOutputs } from './types';

export const get: GoogleAnalyticsEndpoints['audiencesGet'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedGoogleAnalyticsRequest<
		GoogleAnalyticsEndpointOutputs['audiencesGet']
	>(`/v1alpha/${encodeResourcePath(input.name)}`, ctx, {
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
	>(`/v1alpha/${encodeResourcePath(input.parent)}/audiences`, ctx, {
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
