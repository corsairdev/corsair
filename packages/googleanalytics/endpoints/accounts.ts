import { logEventFromContext } from 'corsair/core';
import type { GoogleAnalyticsEndpoints } from '..';
import {
	GOOGLE_ANALYTICS_ADMIN_BASE,
	listQuery,
	makeAuthenticatedGoogleAnalyticsRequest,
} from '../client';
import type { GoogleAnalyticsEndpointOutputs } from './types';

// accounts.get lives on the v1beta Admin API. The name is the full resource,
// e.g. "accounts/123".
export const get: GoogleAnalyticsEndpoints['accountsGet'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedGoogleAnalyticsRequest<
		GoogleAnalyticsEndpointOutputs['accountsGet']
	>(`/v1beta/${input.name}`, ctx, {
		method: 'GET',
	});

	if (result.name && ctx.db.accounts) {
		try {
			await ctx.db.accounts.upsertByEntityId(result.name, {
				...result,
				createdAt: new Date(),
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

// Deprecated in favour of the v1beta variant; routed at v1alpha.
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

// name is "accounts/{id}/dataSharingSettings".
export const getDataSharingSettings: GoogleAnalyticsEndpoints['accountsGetDataSharingSettings'] =
	async (ctx, input) => {
		const result = await makeAuthenticatedGoogleAnalyticsRequest<
			GoogleAnalyticsEndpointOutputs['accountsGetDataSharingSettings']
		>(`/v1beta/${input.name}`, ctx, {
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
