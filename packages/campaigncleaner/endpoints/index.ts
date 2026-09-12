import { logEventFromContext } from 'corsair/core';
import type { ZodType } from 'zod';
import { makeCampaignCleanerRequest } from '../client';
import type {
	CampaignCleanerContext,
	CampaignCleanerEndpoints as CampaignCleanerEndpointHandlers,
} from '../index';
import type {
	DeleteCampaignResponse,
	GetCampaignListResponse,
	GetCampaignPdfAnalysisResponse,
	GetCampaignStatusResponse,
	GetCreditsResponse,
} from './types';
import {
	CampaignCleanerEndpointInputSchemas,
	CampaignCleanerEndpointOutputSchemas,
} from './types';

function campaignBody(campaignId: string): { campaign: { id: string } } {
	return { campaign: { id: campaignId } };
}

async function complete<T>(
	ctx: CampaignCleanerContext,
	eventType: string,
	payload: { campaignId?: string },
	schema: ZodType<T>,
	request: Promise<T>,
): Promise<T> {
	const response = schema.parse(await request);
	await logEventFromContext(ctx, eventType, payload, 'completed');
	return response;
}

export const CampaignCleanerEndpoints: CampaignCleanerEndpointHandlers = {
	deleteCampaign: async (ctx, input) => {
		const parsed =
			CampaignCleanerEndpointInputSchemas.deleteCampaign.parse(input);
		const response = CampaignCleanerEndpointOutputSchemas.deleteCampaign.parse(
			await makeCampaignCleanerRequest<DeleteCampaignResponse>(
				'/v1/delete_campaign',
				ctx.key,
				{
					method: 'POST',
					body: campaignBody(parsed.campaignId),
				},
			),
		);
		await logEventFromContext(
			ctx,
			'campaign_cleaner.campaign.delete',
			{ campaignId: parsed.campaignId },
			response.status === 'success' ? 'completed' : 'failed',
		);
		return response;
	},
	getCampaignList: async (ctx, input) => {
		CampaignCleanerEndpointInputSchemas.getCampaignList.parse(input);
		return complete<GetCampaignListResponse>(
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
		return complete<GetCampaignStatusResponse>(
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
		return complete<GetCampaignPdfAnalysisResponse>(
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
		return complete<GetCreditsResponse>(
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
