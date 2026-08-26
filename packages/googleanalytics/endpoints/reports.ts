import { logEventFromContext } from 'corsair/core';
import type { GoogleAnalyticsEndpoints } from '..';
import {
	encodeResourcePath,
	GOOGLE_ANALYTICS_DATA_BASE,
	makeAuthenticatedGoogleAnalyticsRequest,
	propertyPath,
} from '../client';
import type { GoogleAnalyticsEndpointOutputs } from './types';

export const run: GoogleAnalyticsEndpoints['reportsRun'] = async (
	ctx,
	input,
) => {
	const { property, ...body } = input;
	const result = await makeAuthenticatedGoogleAnalyticsRequest<
		GoogleAnalyticsEndpointOutputs['reportsRun']
	>(`/v1beta/${propertyPath(property)}:runReport`, ctx, {
		method: 'POST',
		base: GOOGLE_ANALYTICS_DATA_BASE,
		body,
	});

	await logEventFromContext(
		ctx,
		'googleanalytics.reports.run',
		{ ...input },
		'completed',
	);
	return result;
};

export const runRealtime: GoogleAnalyticsEndpoints['reportsRunRealtime'] =
	async (ctx, input) => {
		const { property, ...body } = input;
		const result = await makeAuthenticatedGoogleAnalyticsRequest<
			GoogleAnalyticsEndpointOutputs['reportsRunRealtime']
		>(`/v1beta/${propertyPath(property)}:runRealtimeReport`, ctx, {
			method: 'POST',
			base: GOOGLE_ANALYTICS_DATA_BASE,
			body,
		});

		await logEventFromContext(
			ctx,
			'googleanalytics.reports.runRealtime',
			{ ...input },
			'completed',
		);
		return result;
	};

export const runPivot: GoogleAnalyticsEndpoints['reportsRunPivot'] = async (
	ctx,
	input,
) => {
	const { property, ...body } = input;
	const result = await makeAuthenticatedGoogleAnalyticsRequest<
		GoogleAnalyticsEndpointOutputs['reportsRunPivot']
	>(`/v1beta/${propertyPath(property)}:runPivotReport`, ctx, {
		method: 'POST',
		base: GOOGLE_ANALYTICS_DATA_BASE,
		body,
	});

	await logEventFromContext(
		ctx,
		'googleanalytics.reports.runPivot',
		{ ...input },
		'completed',
	);
	return result;
};

export const runFunnel: GoogleAnalyticsEndpoints['reportsRunFunnel'] = async (
	ctx,
	input,
) => {
	const { property, ...body } = input;
	const result = await makeAuthenticatedGoogleAnalyticsRequest<
		GoogleAnalyticsEndpointOutputs['reportsRunFunnel']
	>(`/v1alpha/${propertyPath(property)}:runFunnelReport`, ctx, {
		method: 'POST',
		base: GOOGLE_ANALYTICS_DATA_BASE,
		body,
	});

	await logEventFromContext(
		ctx,
		'googleanalytics.reports.runFunnel',
		{ ...input },
		'completed',
	);
	return result;
};

export const batchRun: GoogleAnalyticsEndpoints['reportsBatchRun'] = async (
	ctx,
	input,
) => {
	const { property, ...body } = input;
	const result = await makeAuthenticatedGoogleAnalyticsRequest<
		GoogleAnalyticsEndpointOutputs['reportsBatchRun']
	>(`/v1beta/${propertyPath(property)}:batchRunReports`, ctx, {
		method: 'POST',
		base: GOOGLE_ANALYTICS_DATA_BASE,
		body,
	});

	await logEventFromContext(
		ctx,
		'googleanalytics.reports.batchRun',
		{ ...input },
		'completed',
	);
	return result;
};

export const batchRunPivot: GoogleAnalyticsEndpoints['reportsBatchRunPivot'] =
	async (ctx, input) => {
		const { property, ...body } = input;
		const result = await makeAuthenticatedGoogleAnalyticsRequest<
			GoogleAnalyticsEndpointOutputs['reportsBatchRunPivot']
		>(`/v1beta/${propertyPath(property)}:batchRunPivotReports`, ctx, {
			method: 'POST',
			base: GOOGLE_ANALYTICS_DATA_BASE,
			body,
		});

		await logEventFromContext(
			ctx,
			'googleanalytics.reports.batchRunPivot',
			{ ...input },
			'completed',
		);
		return result;
	};

export const checkCompatibility: GoogleAnalyticsEndpoints['reportsCheckCompatibility'] =
	async (ctx, input) => {
		const { property, ...body } = input;
		const result = await makeAuthenticatedGoogleAnalyticsRequest<
			GoogleAnalyticsEndpointOutputs['reportsCheckCompatibility']
		>(`/v1beta/${propertyPath(property)}:checkCompatibility`, ctx, {
			method: 'POST',
			base: GOOGLE_ANALYTICS_DATA_BASE,
			body,
		});

		await logEventFromContext(
			ctx,
			'googleanalytics.reports.checkCompatibility',
			{ ...input },
			'completed',
		);
		return result;
	};

export const getMetadata: GoogleAnalyticsEndpoints['reportsGetMetadata'] =
	async (ctx, input) => {
		const result = await makeAuthenticatedGoogleAnalyticsRequest<
			GoogleAnalyticsEndpointOutputs['reportsGetMetadata']
		>(`/v1beta/${encodeResourcePath(input.name)}`, ctx, {
			method: 'GET',
			base: GOOGLE_ANALYTICS_DATA_BASE,
		});

		await logEventFromContext(
			ctx,
			'googleanalytics.reports.getMetadata',
			{ ...input },
			'completed',
		);
		return result;
	};
