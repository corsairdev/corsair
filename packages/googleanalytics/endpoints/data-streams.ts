import { logEventFromContext } from 'corsair/core';
import type { GoogleAnalyticsEndpoints } from '..';
import { listQuery, makeAuthenticatedGoogleAnalyticsRequest } from '../client';
import type { GoogleAnalyticsEndpointOutputs } from './types';

// parent is "properties/{id}".
export const list: GoogleAnalyticsEndpoints['dataStreamsList'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedGoogleAnalyticsRequest<
		GoogleAnalyticsEndpointOutputs['dataStreamsList']
	>(`/v1beta/${input.parent}/dataStreams`, ctx, {
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

// parent is "properties/{id}/dataStreams/{stream}".
export const listMeasurementProtocolSecrets: GoogleAnalyticsEndpoints['dataStreamsListMeasurementProtocolSecrets'] =
	async (ctx, input) => {
		const result = await makeAuthenticatedGoogleAnalyticsRequest<
			GoogleAnalyticsEndpointOutputs['dataStreamsListMeasurementProtocolSecrets']
		>(`/v1beta/${input.parent}/measurementProtocolSecrets`, ctx, {
			method: 'GET',
			query: listQuery(input),
		});

		await logEventFromContext(
			ctx,
			'googleanalytics.dataStreams.listMeasurementProtocolSecrets',
			{ ...input },
			'completed',
		);
		return result;
	};

// parent is "properties/{id}/dataStreams/{stream}". Event create rules are v1alpha.
export const listEventCreateRules: GoogleAnalyticsEndpoints['dataStreamsListEventCreateRules'] =
	async (ctx, input) => {
		const result = await makeAuthenticatedGoogleAnalyticsRequest<
			GoogleAnalyticsEndpointOutputs['dataStreamsListEventCreateRules']
		>(`/v1alpha/${input.parent}/eventCreateRules`, ctx, {
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

// parent is "properties/{id}/dataStreams/{stream}". v1alpha only.
export const listSKAdNetworkConversionValueSchemas: GoogleAnalyticsEndpoints['dataStreamsListSKAdNetworkConversionValueSchemas'] =
	async (ctx, input) => {
		const result = await makeAuthenticatedGoogleAnalyticsRequest<
			GoogleAnalyticsEndpointOutputs['dataStreamsListSKAdNetworkConversionValueSchemas']
		>(`/v1alpha/${input.parent}/sKAdNetworkConversionValueSchema`, ctx, {
			method: 'GET',
			query: listQuery(input),
		});

		await logEventFromContext(
			ctx,
			'googleanalytics.dataStreams.listSKAdNetworkConversionValueSchemas',
			{ ...input },
			'completed',
		);
		return result;
	};
