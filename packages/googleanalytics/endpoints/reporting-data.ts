import { logEventFromContext } from 'corsair/core';
import type { GoogleAnalyticsEndpoints } from '..';
import {
	encodeResourcePath,
	listQuery,
	makeAuthenticatedGoogleAnalyticsRequest,
} from '../client';
import type { GoogleAnalyticsEndpointOutputs } from './types';

export const listAnnotations: GoogleAnalyticsEndpoints['reportingDataListAnnotations'] =
	async (ctx, input) => {
		const result = await makeAuthenticatedGoogleAnalyticsRequest<
			GoogleAnalyticsEndpointOutputs['reportingDataListAnnotations']
		>(
			`/v1alpha/${encodeResourcePath(input.parent)}/reportingDataAnnotations`,
			ctx,
			{
				method: 'GET',
				query: listQuery(input),
			},
		);

		await logEventFromContext(
			ctx,
			'googleanalytics.reportingData.listAnnotations',
			{ ...input },
			'completed',
		);
		return result;
	};

export const listSubpropertyEventFilters: GoogleAnalyticsEndpoints['reportingDataListSubpropertyEventFilters'] =
	async (ctx, input) => {
		const result = await makeAuthenticatedGoogleAnalyticsRequest<
			GoogleAnalyticsEndpointOutputs['reportingDataListSubpropertyEventFilters']
		>(
			`/v1alpha/${encodeResourcePath(input.parent)}/subpropertyEventFilters`,
			ctx,
			{
				method: 'GET',
				query: listQuery(input),
			},
		);

		await logEventFromContext(
			ctx,
			'googleanalytics.reportingData.listSubpropertyEventFilters',
			{ ...input },
			'completed',
		);
		return result;
	};

export const listSubpropertySyncConfigs: GoogleAnalyticsEndpoints['reportingDataListSubpropertySyncConfigs'] =
	async (ctx, input) => {
		const result = await makeAuthenticatedGoogleAnalyticsRequest<
			GoogleAnalyticsEndpointOutputs['reportingDataListSubpropertySyncConfigs']
		>(
			`/v1alpha/${encodeResourcePath(input.parent)}/subpropertySyncConfigs`,
			ctx,
			{
				method: 'GET',
				query: listQuery(input),
			},
		);

		await logEventFromContext(
			ctx,
			'googleanalytics.reportingData.listSubpropertySyncConfigs',
			{ ...input },
			'completed',
		);
		return result;
	};
