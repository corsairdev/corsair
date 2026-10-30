import { logEventFromContext } from 'corsair/core';
import { makeAuthenticatedGoogleBigqueryRequest } from '../client';
import type { GoogleBigqueryEndpoints } from '../index';
import type { GoogleBigqueryEndpointOutputs } from './types';

export const listListings: GoogleBigqueryEndpoints['analyticsHubListListings'] =
	async (ctx, input) => {
		const { projectId, location, dataExchangeId, ...query } = input;
		const result = await makeAuthenticatedGoogleBigqueryRequest<
			GoogleBigqueryEndpointOutputs['analyticsHubListListings']
		>(
			`/projects/${projectId}/locations/${location}/dataExchanges/${dataExchangeId}/listings`,
			ctx,
			{ method: 'GET', host: 'analyticsHub', query },
		);

		await logEventFromContext(
			ctx,
			'googlebigquery.analyticsHub.listListings',
			{ ...input },
			'completed',
		);
		return result;
	};

export const listDataexchangesListings: GoogleBigqueryEndpoints['analyticsHubListDataexchangesListings'] =
	async (ctx, input) => {
		const { projectId, location, ...query } = input;
		const result = await makeAuthenticatedGoogleBigqueryRequest<
			GoogleBigqueryEndpointOutputs['analyticsHubListDataexchangesListings']
		>(`/projects/${projectId}/locations/${location}/dataExchanges`, ctx, {
			method: 'GET',
			host: 'analyticsHub',
			query,
		});

		await logEventFromContext(
			ctx,
			'googlebigquery.analyticsHub.listDataexchangesListings',
			{ ...input },
			'completed',
		);
		return result;
	};

// Analytics Hub v1 (`analyticsHub` host: analyticshub.googleapis.com/v1).
// Single create-listing operation — do not reintroduce a second op on the same
// path under a different host alias (review bot: duplicate endpoint).
export const createListing: GoogleBigqueryEndpoints['analyticsHubCreateListing'] =
	async (ctx, input) => {
		const { projectId, location, dataExchangeId, listingId, ...body } = input;
		const result = await makeAuthenticatedGoogleBigqueryRequest<
			GoogleBigqueryEndpointOutputs['analyticsHubCreateListing']
		>(
			`/projects/${projectId}/locations/${location}/dataExchanges/${dataExchangeId}/listings`,
			ctx,
			{ method: 'POST', host: 'analyticsHub', query: { listingId }, body },
		);

		await logEventFromContext(
			ctx,
			'googlebigquery.analyticsHub.createListing',
			{ ...input },
			'completed',
		);
		return result;
	};

export const createDataExchange: GoogleBigqueryEndpoints['analyticsHubCreateDataExchange'] =
	async (ctx, input) => {
		const { projectId, location, dataExchangeId, ...body } = input;
		const result = await makeAuthenticatedGoogleBigqueryRequest<
			GoogleBigqueryEndpointOutputs['analyticsHubCreateDataExchange']
		>(`/projects/${projectId}/locations/${location}/dataExchanges`, ctx, {
			method: 'POST',
			host: 'analyticsHub',
			query: { dataExchangeId },
			body,
		});

		await logEventFromContext(
			ctx,
			'googlebigquery.analyticsHub.createDataExchange',
			{ ...input },
			'completed',
		);
		return result;
	};

export const listOrganizationDataExchanges: GoogleBigqueryEndpoints['analyticsHubListOrganizationDataExchanges'] =
	async (ctx, input) => {
		const { organizationId, location, ...query } = input;
		const result = await makeAuthenticatedGoogleBigqueryRequest<
			GoogleBigqueryEndpointOutputs['analyticsHubListOrganizationDataExchanges']
		>(
			`/organizations/${organizationId}/locations/${location}/dataExchanges`,
			ctx,
			{
				method: 'GET',
				host: 'analyticsHub',
				query,
			},
		);

		await logEventFromContext(
			ctx,
			'googlebigquery.analyticsHub.listOrganizationDataExchanges',
			{ ...input },
			'completed',
		);
		return result;
	};

// Query Templates are only available on Analytics Hub v1beta1
export const listQueryTemplates: GoogleBigqueryEndpoints['analyticsHubListQueryTemplates'] =
	async (ctx, input) => {
		const { projectId, location, dataExchangeId, ...query } = input;
		const result = await makeAuthenticatedGoogleBigqueryRequest<
			GoogleBigqueryEndpointOutputs['analyticsHubListQueryTemplates']
		>(
			`/projects/${projectId}/locations/${location}/dataExchanges/${dataExchangeId}/queryTemplates`,
			ctx,
			{ method: 'GET', host: 'analyticsHubBeta', query },
		);

		await logEventFromContext(
			ctx,
			'googlebigquery.analyticsHub.listQueryTemplates',
			{ ...input },
			'completed',
		);
		return result;
	};

// Query Templates are only available on Analytics Hub v1beta1
export const createQueryTemplate: GoogleBigqueryEndpoints['analyticsHubCreateQueryTemplate'] =
	async (ctx, input) => {
		const { projectId, location, dataExchangeId, ...body } = input;
		const result = await makeAuthenticatedGoogleBigqueryRequest<
			GoogleBigqueryEndpointOutputs['analyticsHubCreateQueryTemplate']
		>(
			`/projects/${projectId}/locations/${location}/dataExchanges/${dataExchangeId}/queryTemplates`,
			ctx,
			{ method: 'POST', host: 'analyticsHubBeta', body },
		);

		await logEventFromContext(
			ctx,
			'googlebigquery.analyticsHub.createQueryTemplate',
			{ ...input },
			'completed',
		);
		return result;
	};
