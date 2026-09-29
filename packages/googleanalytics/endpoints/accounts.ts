import { logEventFromContext } from 'corsair/core';
import type { GoogleAnalyticsEndpoints } from '..';
import {
	encodeResourcePath,
	GOOGLE_ANALYTICS_ADMIN_BASE,
	listQuery,
	makeAuthenticatedGoogleAnalyticsRequest,
} from '../client';
import type { GoogleAnalyticsEndpointOutputs } from './types';

export const get: GoogleAnalyticsEndpoints['accountsGet'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedGoogleAnalyticsRequest<
		GoogleAnalyticsEndpointOutputs['accountsGet']
	>(`/v1beta/${encodeResourcePath(input.name)}`, ctx, {
		method: 'GET',
	});

	if (result.name && ctx.db.accounts) {
		try {
			await ctx.db.accounts.upsertByEntityId(result.name, {
				...result,
			});
		} catch (error) {
			console.warn('Failed to save account to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'googleanalytics.accounts.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const list: GoogleAnalyticsEndpoints['accountsList'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedGoogleAnalyticsRequest<
		GoogleAnalyticsEndpointOutputs['accountsList']
	>('/v1alpha/accounts', ctx, {
		method: 'GET',
		base: GOOGLE_ANALYTICS_ADMIN_BASE,
		query: listQuery(input),
	});

	await logEventFromContext(
		ctx,
		'googleanalytics.accounts.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const listV1Beta: GoogleAnalyticsEndpoints['accountsListV1Beta'] =
	async (ctx, input) => {
		const result = await makeAuthenticatedGoogleAnalyticsRequest<
			GoogleAnalyticsEndpointOutputs['accountsListV1Beta']
		>('/v1beta/accounts', ctx, {
			method: 'GET',
			query: listQuery(input),
		});

		await logEventFromContext(
			ctx,
			'googleanalytics.accounts.listV1Beta',
			{ ...input },
			'completed',
		);
		return result;
	};

export const listSummaries: GoogleAnalyticsEndpoints['accountsListSummaries'] =
	async (ctx, input) => {
		const result = await makeAuthenticatedGoogleAnalyticsRequest<
			GoogleAnalyticsEndpointOutputs['accountsListSummaries']
		>('/v1beta/accountSummaries', ctx, {
			method: 'GET',
			query: listQuery(input),
		});

		await logEventFromContext(
			ctx,
			'googleanalytics.accounts.listSummaries',
			{ ...input },
			'completed',
		);
		return result;
	};

export const getDataSharingSettings: GoogleAnalyticsEndpoints['accountsGetDataSharingSettings'] =
	async (ctx, input) => {
		const result = await makeAuthenticatedGoogleAnalyticsRequest<
			GoogleAnalyticsEndpointOutputs['accountsGetDataSharingSettings']
		>(`/v1beta/${encodeResourcePath(input.name)}`, ctx, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'googleanalytics.accounts.getDataSharingSettings',
			{ ...input },
			'completed',
		);
		return result;
	};

export const provisionAccountTicket: GoogleAnalyticsEndpoints['accountsProvisionAccountTicket'] =
	async (ctx, input) => {
		const result = await makeAuthenticatedGoogleAnalyticsRequest<
			GoogleAnalyticsEndpointOutputs['accountsProvisionAccountTicket']
		>('/v1beta/accounts:provisionAccountTicket', ctx, {
			method: 'POST',
			body: input,
		});

		await logEventFromContext(
			ctx,
			'googleanalytics.accounts.provisionAccountTicket',
			{ ...input },
			'completed',
		);
		return result;
	};
