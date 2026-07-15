import { logEventFromContext } from 'corsair/core';
import type { GoogleAnalyticsEndpoints } from '..';
import { listQuery, makeAuthenticatedGoogleAnalyticsRequest } from '../client';
import type { GoogleAnalyticsEndpointOutputs } from './types';

// name is "properties/{id}/keyEvents/{keyEvent}".
export const get: GoogleAnalyticsEndpoints['keyEventsGet'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedGoogleAnalyticsRequest<
		GoogleAnalyticsEndpointOutputs['keyEventsGet']
	>(`/v1beta/${input.name}`, ctx, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'googleanalytics.keyEvents.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const list: GoogleAnalyticsEndpoints['keyEventsList'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedGoogleAnalyticsRequest<
		GoogleAnalyticsEndpointOutputs['keyEventsList']
	>(`/v1beta/${input.parent}/keyEvents`, ctx, {
		method: 'GET',
		query: listQuery(input),
	});

	await logEventFromContext(
		ctx,
		'googleanalytics.keyEvents.list',
		{ ...input },
		'completed',
	);
	return result;
};
