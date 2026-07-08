import { logEventFromContext } from 'corsair/core';
import type { GoogleAdsEndpoints } from '..';
import { makeGoogleAdsRequest } from '../client';
import { assertDigitsOnly, escapeGaqlString } from './gaql-utils';
import type { GoogleAdsEndpointOutputs } from './types';

export const getById: GoogleAdsEndpoints['campaignsGetById'] = async (
	ctx,
	input,
) => {
	try {
		// Defence-in-depth: the Zod schema already validates this, but we guard
		// at the query construction site too in case validation is ever loosened.
		assertDigitsOnly(input.campaignId, 'campaignId');
		assertDigitsOnly(input.customerId, 'customerId');

		const query = `SELECT
		campaign.resource_name,
		campaign.id,
		campaign.name,
		campaign.status,
		campaign.advertising_channel_type,
		campaign.bidding_strategy_type,
		campaign.start_date,
		campaign.end_date,
		campaign.campaign_budget,
		campaign.serving_status,
		campaign.optimization_score,
		campaign_budget.resource_name,
		campaign_budget.id,
		campaign_budget.name,
		campaign_budget.amount_micros,
		campaign_budget.delivery_method,
		campaign_budget.status
	FROM campaign
	WHERE campaign.id = ${input.campaignId}`;

		const response = await makeGoogleAdsRequest<
			GoogleAdsEndpointOutputs['campaignsGetById']
		>(`/customers/${input.customerId}/googleAds:search`, ctx.key, {
			method: 'POST',
			body: { query },
			developerToken: ctx.options?.developerToken,
			loginCustomerId: ctx.options?.loginCustomerId,
		});

		if (response.results) {
			for (const row of response.results) {
				if (row.campaign?.id) {
					const { campaignBudget: _apiBudget, ...campaignData } = row.campaign;
					await ctx.db.campaigns.upsertByEntityId(row.campaign.id, {
						...campaignData,
						budgetAmountMicros: row.campaignBudget?.amountMicros,
					});
				}
			}
		}

		await logEventFromContext(
			ctx,
			'googleads.campaigns.getById',
			{ ...input },
			'completed',
		);
		return response;
	} catch (error) {
		await logEventFromContext(
			ctx,
			'googleads.campaigns.getById',
			{ ...input },
			'failed',
		);
		throw error;
	}
};

export const getByName: GoogleAdsEndpoints['campaignsGetByName'] = async (
	ctx,
	input,
) => {
	try {
		assertDigitsOnly(input.customerId, 'customerId');
		const escapedName = escapeGaqlString(input.campaignName);

		const query = `SELECT
		campaign.resource_name,
		campaign.id,
		campaign.name,
		campaign.status,
		campaign.advertising_channel_type,
		campaign.bidding_strategy_type,
		campaign.start_date,
		campaign.end_date,
		campaign.campaign_budget,
		campaign.serving_status,
		campaign.optimization_score,
		campaign_budget.resource_name,
		campaign_budget.id,
		campaign_budget.name,
		campaign_budget.amount_micros,
		campaign_budget.delivery_method,
		campaign_budget.status
	FROM campaign
	WHERE campaign.name = '${escapedName}'
	LIMIT 1000`;

		const response = await makeGoogleAdsRequest<
			GoogleAdsEndpointOutputs['campaignsGetByName']
		>(`/customers/${input.customerId}/googleAds:search`, ctx.key, {
			method: 'POST',
			body: { query },
			developerToken: ctx.options?.developerToken,
			loginCustomerId: ctx.options?.loginCustomerId,
		});

		if (response.results) {
			for (const row of response.results) {
				if (row.campaign?.id) {
					const { campaignBudget: _apiBudget, ...campaignData } = row.campaign;
					await ctx.db.campaigns.upsertByEntityId(row.campaign.id, {
						...campaignData,
						budgetAmountMicros: row.campaignBudget?.amountMicros,
					});
				}
			}
		}

		await logEventFromContext(
			ctx,
			'googleads.campaigns.getByName',
			{ ...input },
			'completed',
		);
		return response;
	} catch (error) {
		await logEventFromContext(
			ctx,
			'googleads.campaigns.getByName',
			{ ...input },
			'failed',
		);
		throw error;
	}
};
