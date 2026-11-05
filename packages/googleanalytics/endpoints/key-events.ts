import { logEventFromContext } from 'corsair/core';
import type { GoogleAnalyticsEndpoints } from '..';
import {
	encodeResourcePath,
	listQuery,
	makeAuthenticatedGoogleAnalyticsRequest,
} from '../client';
import type { GoogleAnalyticsEndpointOutputs } from './types';

export const get: GoogleAnalyticsEndpoints['keyEventsGet'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedGoogleAnalyticsRequest<
		GoogleAnalyticsEndpointOutputs['keyEventsGet']
	>(`/v1beta/${encodeResourcePath(input.name)}`, ctx, {
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
	>(`/v1beta/${encodeResourcePath(input.parent)}/keyEvents`, ctx, {
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
