import { logEventFromContext } from 'corsair/core';
import type { GoogleAnalyticsEndpoints } from '..';
import {
	encodeResourcePath,
	GOOGLE_ANALYTICS_DATA_BASE,
	jsonObjectBody,
	listQuery,
	makeAuthenticatedGoogleAnalyticsRequest,
} from '../client';
import type { GoogleAnalyticsEndpointOutputs } from './types';

export const create: GoogleAnalyticsEndpoints['audienceExportsCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedGoogleAnalyticsRequest<
		GoogleAnalyticsEndpointOutputs['audienceExportsCreate']
	>(`/v1beta/${encodeResourcePath(input.parent)}/audienceExports`, ctx, {
		method: 'POST',
		base: GOOGLE_ANALYTICS_DATA_BASE,
		body: jsonObjectBody(input.audienceExport),
	});

	await logEventFromContext(
		ctx,
		'googleanalytics.audienceExports.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: GoogleAnalyticsEndpoints['audienceExportsGet'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedGoogleAnalyticsRequest<
		GoogleAnalyticsEndpointOutputs['audienceExportsGet']
	>(`/v1beta/${encodeResourcePath(input.name)}`, ctx, {
		method: 'GET',
		base: GOOGLE_ANALYTICS_DATA_BASE,
	});

	await logEventFromContext(
		ctx,
		'googleanalytics.audienceExports.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const list: GoogleAnalyticsEndpoints['audienceExportsList'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedGoogleAnalyticsRequest<
		GoogleAnalyticsEndpointOutputs['audienceExportsList']
	>(`/v1beta/${encodeResourcePath(input.parent)}/audienceExports`, ctx, {
		method: 'GET',
		base: GOOGLE_ANALYTICS_DATA_BASE,
		query: listQuery(input),
	});

	await logEventFromContext(
		ctx,
		'googleanalytics.audienceExports.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const query: GoogleAnalyticsEndpoints['audienceExportsQuery'] = async (
	ctx,
	input,
) => {
	const { name, ...body } = input;
	const result = await makeAuthenticatedGoogleAnalyticsRequest<
		GoogleAnalyticsEndpointOutputs['audienceExportsQuery']
	>(`/v1beta/${encodeResourcePath(name)}:query`, ctx, {
		method: 'POST',
		base: GOOGLE_ANALYTICS_DATA_BASE,
		body,
	});

	await logEventFromContext(
		ctx,
		'googleanalytics.audienceExports.query',
		{ ...input },
		'completed',
	);
	return result;
};
