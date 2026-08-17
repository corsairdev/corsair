import { logEventFromContext } from 'corsair/core';
import type { GoogleAnalyticsEndpoints } from '..';
import {
	encodeResourcePath,
	GOOGLE_ANALYTICS_DATA_BASE,
	listQuery,
	makeAuthenticatedGoogleAnalyticsRequest,
} from '../client';
import type { GoogleAnalyticsEndpointOutputs } from './types';

// Recurring audience lists live on the Data API v1alpha.
// parent/name are "properties/{id}" / "properties/{id}/recurringAudienceLists/{list}".

export const create: GoogleAnalyticsEndpoints['recurringAudienceListsCreate'] =
	async (ctx, input) => {
		const result = await makeAuthenticatedGoogleAnalyticsRequest<
			GoogleAnalyticsEndpointOutputs['recurringAudienceListsCreate']
		>(
			`/v1alpha/${encodeResourcePath(input.parent)}/recurringAudienceLists`,
			ctx,
			{
				method: 'POST',
				base: GOOGLE_ANALYTICS_DATA_BASE,
				body: { recurringAudienceList: input.recurringAudienceList },
			},
		);

		await logEventFromContext(
			ctx,
			'googleanalytics.recurringAudienceLists.create',
			{ ...input },
			'completed',
		);
		return result;
	};

export const get: GoogleAnalyticsEndpoints['recurringAudienceListsGet'] =
	async (ctx, input) => {
		const result = await makeAuthenticatedGoogleAnalyticsRequest<
			GoogleAnalyticsEndpointOutputs['recurringAudienceListsGet']
		>(`/v1alpha/${encodeResourcePath(input.name)}`, ctx, {
			method: 'GET',
			base: GOOGLE_ANALYTICS_DATA_BASE,
		});

		await logEventFromContext(
			ctx,
			'googleanalytics.recurringAudienceLists.get',
			{ ...input },
			'completed',
		);
		return result;
	};

export const list: GoogleAnalyticsEndpoints['recurringAudienceListsList'] =
	async (ctx, input) => {
		const result = await makeAuthenticatedGoogleAnalyticsRequest<
			GoogleAnalyticsEndpointOutputs['recurringAudienceListsList']
		>(
			`/v1alpha/${encodeResourcePath(input.parent)}/recurringAudienceLists`,
			ctx,
			{
				method: 'GET',
				base: GOOGLE_ANALYTICS_DATA_BASE,
				query: listQuery(input),
			},
		);

		await logEventFromContext(
			ctx,
			'googleanalytics.recurringAudienceLists.list',
			{ ...input },
			'completed',
		);
		return result;
	};
