import { logEventFromContext } from 'corsair/core';
import type { GoogleAnalyticsEndpoints } from '..';
import {
	encodeResourcePath,
	GOOGLE_ANALYTICS_DATA_BASE,
	listQuery,
	makeAuthenticatedGoogleAnalyticsRequest,
} from '../client';
import type { GoogleAnalyticsEndpointOutputs } from './types';

// Asynchronous report tasks live on the Data API v1alpha.
// parent/name are "properties/{id}" / "properties/{id}/reportTasks/{task}".

export const create: GoogleAnalyticsEndpoints['reportTasksCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedGoogleAnalyticsRequest<
		GoogleAnalyticsEndpointOutputs['reportTasksCreate']
	>(`/v1alpha/${encodeResourcePath(input.parent)}/reportTasks`, ctx, {
		method: 'POST',
		base: GOOGLE_ANALYTICS_DATA_BASE,
		body: { reportTask: input.reportTask },
	});

	await logEventFromContext(
		ctx,
		'googleanalytics.reportTasks.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: GoogleAnalyticsEndpoints['reportTasksGet'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedGoogleAnalyticsRequest<
		GoogleAnalyticsEndpointOutputs['reportTasksGet']
	>(`/v1alpha/${encodeResourcePath(input.name)}`, ctx, {
		method: 'GET',
		base: GOOGLE_ANALYTICS_DATA_BASE,
	});

	await logEventFromContext(
		ctx,
		'googleanalytics.reportTasks.get',
		{ ...input },
		'completed',
	);
	return result;
};

// Returns the report content; errors if the task is not yet ACTIVE.
export const query: GoogleAnalyticsEndpoints['reportTasksQuery'] = async (
	ctx,
	input,
) => {
	const { name, ...body } = input;
	const result = await makeAuthenticatedGoogleAnalyticsRequest<
		GoogleAnalyticsEndpointOutputs['reportTasksQuery']
	>(`/v1alpha/${encodeResourcePath(name)}:query`, ctx, {
		method: 'POST',
		base: GOOGLE_ANALYTICS_DATA_BASE,
		body,
	});

	await logEventFromContext(
		ctx,
		'googleanalytics.reportTasks.query',
		{ ...input },
		'completed',
	);
	return result;
};

export const list: GoogleAnalyticsEndpoints['reportTasksList'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedGoogleAnalyticsRequest<
		GoogleAnalyticsEndpointOutputs['reportTasksList']
	>(`/v1alpha/${encodeResourcePath(input.parent)}/reportTasks`, ctx, {
		method: 'GET',
		base: GOOGLE_ANALYTICS_DATA_BASE,
		query: listQuery(input),
	});

	await logEventFromContext(
		ctx,
		'googleanalytics.reportTasks.list',
		{ ...input },
		'completed',
	);
	return result;
};
