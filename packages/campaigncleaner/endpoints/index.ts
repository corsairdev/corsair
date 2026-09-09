import { logEventFromContext } from 'corsair/core';
import { makeCampaignCleanerRequest } from '../client';
import type {
	CampaignCleanerContext,
	CampaignCleanerEndpoints as CampaignCleanerEndpointHandlers,
} from '../index';
import {
	CampaignCleanerEndpointInputSchemas,
	CampaignCleanerEndpointOutputSchemas,
} from './types';

function campaignBody(campaignId: string): Record<string, unknown> {
	return { campaign: { id: campaignId } };
}

async function complete<T>(
	ctx: CampaignCleanerContext,
	eventType: string,
	payload: Record<string, unknown>,
	schema: { parse: (value: unknown) => T },
	request: Promise<unknown>,
): Promise<T> {
	const response = schema.parse(await request);
	await logEventFromContext(ctx, eventType, payload, 'completed');
	return response;
}

export const CampaignCleanerEndpoints: CampaignCleanerEndpointHandlers = {
	deleteCampaign: async (ctx, input) => {
		const parsed =
			CampaignCleanerEndpointInputSchemas.deleteCampaign.parse(input);
		return complete(
			ctx,
			'campaign_cleaner.campaign.delete',
			{ campaignId: parsed.campaignId },
			CampaignCleanerEndpointOutputSchemas.deleteCampaign,
			makeCampaignCleanerRequest('/v1/delete_campaign', ctx.key, {
				method: 'POST',
				body: campaignBody(parsed.campaignId),
			}),
		);
	},
	getCampaignList: async (ctx, input) => {
		CampaignCleanerEndpointInputSchemas.getCampaignList.parse(input);
		return complete(
			ctx,
			'campaign_cleaner.campaign.list',
			{},
			CampaignCleanerEndpointOutputSchemas.getCampaignList,
			makeCampaignCleanerRequest('/v1/get_campaign_list', ctx.key, {
				method: 'GET',
			}),
		);
	},
	getCampaignStatus: async (ctx, input) => {
		const parsed =
			CampaignCleanerEndpointInputSchemas.getCampaignStatus.parse(input);
		return complete(
			ctx,
			'campaign_cleaner.campaign.status',
			{ campaignId: parsed.campaignId },
			CampaignCleanerEndpointOutputSchemas.getCampaignStatus,
			makeCampaignCleanerRequest('/v1/get_campaign_status', ctx.key, {
				method: 'POST',
				body: campaignBody(parsed.campaignId),
			}),
		);
	},
	getCampaignPdfAnalysis: async (ctx, input) => {
		const parsed =
			CampaignCleanerEndpointInputSchemas.getCampaignPdfAnalysis.parse(input);
		return complete(
			ctx,
			'campaign_cleaner.campaign.pdfAnalysis',
			{ campaignId: parsed.campaignId },
			CampaignCleanerEndpointOutputSchemas.getCampaignPdfAnalysis,
			makeCampaignCleanerRequest('/v1/get_campaign_pdf_analysis', ctx.key, {
				method: 'POST',
				binary: true,
				body: campaignBody(parsed.campaignId),
			}),
		);
	},
	getCredits: async (ctx, input) => {
		CampaignCleanerEndpointInputSchemas.getCredits.parse(input);
		return complete(
			ctx,
			'campaign_cleaner.credits.get',
			{},
			CampaignCleanerEndpointOutputSchemas.getCredits,
			makeCampaignCleanerRequest('/v1/get_credits', ctx.key, {
				method: 'GET',
			}),
		);
	},
};
