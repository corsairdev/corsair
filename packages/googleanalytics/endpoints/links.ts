import { logEventFromContext } from 'corsair/core';
import type { GoogleAnalyticsEndpoints } from '..';
import {
	encodeResourcePath,
	listQuery,
	makeAuthenticatedGoogleAnalyticsRequest,
} from '../client';
import type { GoogleAnalyticsEndpointOutputs } from './types';

export const listAdSense: GoogleAnalyticsEndpoints['linksListAdSense'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedGoogleAnalyticsRequest<
		GoogleAnalyticsEndpointOutputs['linksListAdSense']
	>(`/v1alpha/${encodeResourcePath(input.parent)}/adSenseLinks`, ctx, {
		method: 'GET',
		query: listQuery(input),
	});

	await logEventFromContext(
		ctx,
		'googleanalytics.links.listAdSense',
		{ ...input },
		'completed',
	);
	return result;
};

export const listBigQuery: GoogleAnalyticsEndpoints['linksListBigQuery'] =
	async (ctx, input) => {
		const result = await makeAuthenticatedGoogleAnalyticsRequest<
			GoogleAnalyticsEndpointOutputs['linksListBigQuery']
		>(`/v1alpha/${encodeResourcePath(input.parent)}/bigQueryLinks`, ctx, {
			method: 'GET',
			query: listQuery(input),
		});

		await logEventFromContext(
			ctx,
			'googleanalytics.links.listBigQuery',
			{ ...input },
			'completed',
		);
		return result;
	};

export const listFirebase: GoogleAnalyticsEndpoints['linksListFirebase'] =
	async (ctx, input) => {
		const result = await makeAuthenticatedGoogleAnalyticsRequest<
			GoogleAnalyticsEndpointOutputs['linksListFirebase']
		>(`/v1beta/${encodeResourcePath(input.parent)}/firebaseLinks`, ctx, {
			method: 'GET',
			query: listQuery(input),
		});

		await logEventFromContext(
			ctx,
			'googleanalytics.links.listFirebase',
			{ ...input },
			'completed',
		);
		return result;
	};

export const listGoogleAds: GoogleAnalyticsEndpoints['linksListGoogleAds'] =
	async (ctx, input) => {
		const result = await makeAuthenticatedGoogleAnalyticsRequest<
			GoogleAnalyticsEndpointOutputs['linksListGoogleAds']
		>(`/v1beta/${encodeResourcePath(input.parent)}/googleAdsLinks`, ctx, {
			method: 'GET',
			query: listQuery(input),
		});

		await logEventFromContext(
			ctx,
			'googleanalytics.links.listGoogleAds',
			{ ...input },
			'completed',
		);
		return result;
	};

export const listDV360Advertiser: GoogleAnalyticsEndpoints['linksListDV360Advertiser'] =
	async (ctx, input) => {
		const result = await makeAuthenticatedGoogleAnalyticsRequest<
			GoogleAnalyticsEndpointOutputs['linksListDV360Advertiser']
		>(
			`/v1alpha/${encodeResourcePath(input.parent)}/displayVideo360AdvertiserLinks`,
			ctx,
			{
				method: 'GET',
				query: listQuery(input),
			},
		);

		await logEventFromContext(
			ctx,
			'googleanalytics.links.listDV360Advertiser',
			{ ...input },
			'completed',
		);
		return result;
	};

export const listDV360Proposals: GoogleAnalyticsEndpoints['linksListDV360Proposals'] =
	async (ctx, input) => {
		const result = await makeAuthenticatedGoogleAnalyticsRequest<
			GoogleAnalyticsEndpointOutputs['linksListDV360Proposals']
		>(
			`/v1alpha/${encodeResourcePath(input.parent)}/displayVideo360AdvertiserLinkProposals`,
			ctx,
			{
				method: 'GET',
				query: listQuery(input),
			},
		);

		await logEventFromContext(
			ctx,
			'googleanalytics.links.listDV360Proposals',
			{ ...input },
			'completed',
		);
		return result;
	};

export const listSearchAds360: GoogleAnalyticsEndpoints['linksListSearchAds360'] =
	async (ctx, input) => {
		const result = await makeAuthenticatedGoogleAnalyticsRequest<
			GoogleAnalyticsEndpointOutputs['linksListSearchAds360']
		>(`/v1alpha/${encodeResourcePath(input.parent)}/searchAds360Links`, ctx, {
			method: 'GET',
			query: listQuery(input),
		});

		await logEventFromContext(
			ctx,
			'googleanalytics.links.listSearchAds360',
			{ ...input },
			'completed',
		);
		return result;
	};
