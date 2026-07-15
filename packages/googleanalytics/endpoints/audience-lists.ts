import { logEventFromContext } from 'corsair/core';
import type { GoogleAnalyticsEndpoints } from '..';
import {
	GOOGLE_ANALYTICS_DATA_BASE,
	listQuery,
	makeAuthenticatedGoogleAnalyticsRequest,
} from '../client';
import type { GoogleAnalyticsEndpointOutputs } from './types';

// Audience lists retrieve users in an audience. They live on the Data API
// v1alpha. parent/name are "properties/{id}" / "properties/{id}/audienceLists/{list}".

export const create: GoogleAnalyticsEndpoints['audienceListsCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedGoogleAnalyticsRequest<
		GoogleAnalyticsEndpointOutputs['audienceListsCreate']
	>(`/v1alpha/${input.parent}/audienceLists`, ctx, {
		method: 'POST',
		base: GOOGLE_ANALYTICS_DATA_BASE,
		body: { audienceList: input.audienceList },
	});

	await logEventFromContext(
		ctx,
		'googleanalytics.audienceLists.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: GoogleAnalyticsEndpoints['audienceListsGet'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedGoogleAnalyticsRequest<
		GoogleAnalyticsEndpointOutputs['audienceListsGet']
	>(`/v1alpha/${input.name}`, ctx, {
		method: 'GET',
		base: GOOGLE_ANALYTICS_DATA_BASE,
	});

	await logEventFromContext(
		ctx,
		'googleanalytics.audienceLists.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const list: GoogleAnalyticsEndpoints['audienceListsList'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedGoogleAnalyticsRequest<
		GoogleAnalyticsEndpointOutputs['audienceListsList']
	>(`/v1alpha/${input.parent}/audienceLists`, ctx, {
		method: 'GET',
		base: GOOGLE_ANALYTICS_DATA_BASE,
		query: listQuery(input),
	});

	await logEventFromContext(
		ctx,
		'googleanalytics.audienceLists.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const query: GoogleAnalyticsEndpoints['audienceListsQuery'] = async (
	ctx,
	input,
) => {
	const { name, ...body } = input;
	const result = await makeAuthenticatedGoogleAnalyticsRequest<
		GoogleAnalyticsEndpointOutputs['audienceListsQuery']
	>(`/v1alpha/${name}:query`, ctx, {
		method: 'POST',
		base: GOOGLE_ANALYTICS_DATA_BASE,
		body,
	});

	await logEventFromContext(
		ctx,
		'googleanalytics.audienceLists.query',
		{ ...input },
		'completed',
	);
	return result;
};
