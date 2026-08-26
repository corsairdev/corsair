import { logEventFromContext } from 'corsair/core';
import type { GoogleAnalyticsEndpoints } from '..';
import {
	encodeResourcePath,
	jsonObjectBody,
	listQuery,
	makeAuthenticatedGoogleAnalyticsRequest,
} from '../client';
import type { GoogleAnalyticsEndpointOutputs } from './types';

export const create: GoogleAnalyticsEndpoints['customDimensionsCreate'] =
	async (ctx, input) => {
		const result = await makeAuthenticatedGoogleAnalyticsRequest<
			GoogleAnalyticsEndpointOutputs['customDimensionsCreate']
		>(`/v1beta/${encodeResourcePath(input.parent)}/customDimensions`, ctx, {
			method: 'POST',
			body: jsonObjectBody(input.customDimension),
		});

		await logEventFromContext(
			ctx,
			'googleanalytics.customDimensions.create',
			{ ...input },
			'completed',
		);
		return result;
	};

export const get: GoogleAnalyticsEndpoints['customDimensionsGet'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedGoogleAnalyticsRequest<
		GoogleAnalyticsEndpointOutputs['customDimensionsGet']
	>(`/v1beta/${encodeResourcePath(input.name)}`, ctx, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'googleanalytics.customDimensions.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const list: GoogleAnalyticsEndpoints['customDimensionsList'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedGoogleAnalyticsRequest<
		GoogleAnalyticsEndpointOutputs['customDimensionsList']
	>(`/v1beta/${encodeResourcePath(input.parent)}/customDimensions`, ctx, {
		method: 'GET',
		query: listQuery(input),
	});

	await logEventFromContext(
		ctx,
		'googleanalytics.customDimensions.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const archive: GoogleAnalyticsEndpoints['customDimensionsArchive'] =
	async (ctx, input) => {
		await makeAuthenticatedGoogleAnalyticsRequest<
			GoogleAnalyticsEndpointOutputs['customDimensionsArchive']
		>(`/v1beta/${encodeResourcePath(input.name)}:archive`, ctx, {
			method: 'POST',
		});

		await logEventFromContext(
			ctx,
			'googleanalytics.customDimensions.archive',
			{ ...input },
			'completed',
		);
		return {};
	};
