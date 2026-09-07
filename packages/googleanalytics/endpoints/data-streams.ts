import { logEventFromContext } from 'corsair/core';
import type { GoogleAnalyticsEndpoints } from '..';
import {
	encodeResourcePath,
	listQuery,
	makeAuthenticatedGoogleAnalyticsRequest,
} from '../client';
import type { GoogleAnalyticsEndpointOutputs } from './types';

export const list: GoogleAnalyticsEndpoints['dataStreamsList'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedGoogleAnalyticsRequest<
		GoogleAnalyticsEndpointOutputs['dataStreamsList']
	>(`/v1beta/${encodeResourcePath(input.parent)}/dataStreams`, ctx, {
		method: 'GET',
		query: listQuery(input),
	});

	await logEventFromContext(
		ctx,
		'googleanalytics.dataStreams.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const listMeasurementProtocolSecrets: GoogleAnalyticsEndpoints['dataStreamsListMeasurementProtocolSecrets'] =
	async (ctx, input) => {
		const result = await makeAuthenticatedGoogleAnalyticsRequest<
			GoogleAnalyticsEndpointOutputs['dataStreamsListMeasurementProtocolSecrets']
		>(
			`/v1beta/${encodeResourcePath(input.parent)}/measurementProtocolSecrets`,
			ctx,
			{
				method: 'GET',
				query: listQuery(input),
			},
		);

		await logEventFromContext(
			ctx,
			'googleanalytics.dataStreams.listMeasurementProtocolSecrets',
			{ ...input },
			'completed',
		);
		return result;
	};

export const listEventCreateRules: GoogleAnalyticsEndpoints['dataStreamsListEventCreateRules'] =
	async (ctx, input) => {
		const result = await makeAuthenticatedGoogleAnalyticsRequest<
			GoogleAnalyticsEndpointOutputs['dataStreamsListEventCreateRules']
		>(`/v1alpha/${encodeResourcePath(input.parent)}/eventCreateRules`, ctx, {
			method: 'GET',
			query: listQuery(input),
		});

		await logEventFromContext(
			ctx,
			'googleanalytics.dataStreams.listEventCreateRules',
			{ ...input },
			'completed',
		);
		return result;
	};

export const listSKAdNetworkConversionValueSchemas: GoogleAnalyticsEndpoints['dataStreamsListSKAdNetworkConversionValueSchemas'] =
	async (ctx, input) => {
		const result = await makeAuthenticatedGoogleAnalyticsRequest<
			GoogleAnalyticsEndpointOutputs['dataStreamsListSKAdNetworkConversionValueSchemas']
		>(
			`/v1alpha/${encodeResourcePath(input.parent)}/sKAdNetworkConversionValueSchema`,
			ctx,
			{
				method: 'GET',
				query: listQuery(input),
			},
		);

		await logEventFromContext(
			ctx,
			'googleanalytics.dataStreams.listSKAdNetworkConversionValueSchemas',
			{ ...input },
			'completed',
		);
		return result;
	};
