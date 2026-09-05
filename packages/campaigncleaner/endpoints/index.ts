import { logEventFromContext } from 'corsair/core';
import { makeCampaignCleanerRequest } from '../client';
import type {
	CampaignCleanerEndpointInputs,
	CampaignCleanerEndpointOutputs,
} from './types';

export const DeleteCampaign = {
	remove: async (
		ctx: any,
		input: CampaignCleanerEndpointInputs['deleteCampaign'],
	): Promise<CampaignCleanerEndpointOutputs['deleteCampaign']> => {
		const response = await makeCampaignCleanerRequest<
			CampaignCleanerEndpointOutputs['deleteCampaign']
		>('v1/delete_campaign', ctx.key, {
			method: 'POST',
			body: {
				campaign: {
					id: input.campaignId,
				},
			},
		});

		await logEventFromContext(ctx, 'campaign_cleaner.delete_campaign', {
			campaignId: input.campaignId,
		});

		return response;
	},
};

export const GetCampaignList = {
	list: async (
		ctx: any,
		_input: CampaignCleanerEndpointInputs['getCampaignList'],
	): Promise<CampaignCleanerEndpointOutputs['getCampaignList']> => {
		const response = await makeCampaignCleanerRequest<
			CampaignCleanerEndpointOutputs['getCampaignList']
		>('v1/get_campaign_list', ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(ctx, 'campaign_cleaner.get_campaign_list', {});

		return response;
	},
};

export const GetCampaignStatus = {
	status: async (
		ctx: any,
		input: CampaignCleanerEndpointInputs['getCampaignStatus'],
	): Promise<CampaignCleanerEndpointOutputs['getCampaignStatus']> => {
		const response = await makeCampaignCleanerRequest<
			CampaignCleanerEndpointOutputs['getCampaignStatus']
		>('v1/get_campaign_status', ctx.key, {
			method: 'POST',
			body: {
				campaign: {
					id: input.campaignId,
				},
			},
		});

		await logEventFromContext(ctx, 'campaign_cleaner.get_campaign_status', {
			campaignId: input.campaignId,
		});

		return response;
	},
};

export const GetCampaignPdfAnalysis = {
	pdfAnalysis: async (
		ctx: any,
		input: CampaignCleanerEndpointInputs['getCampaignPdfAnalysis'],
	): Promise<CampaignCleanerEndpointOutputs['getCampaignPdfAnalysis']> => {
		const response = await makeCampaignCleanerRequest<
			CampaignCleanerEndpointOutputs['getCampaignPdfAnalysis']
		>('v1/get_campaign_pdf_analysis', ctx.key, {
			method: 'POST',
			body: {
				campaign: {
					id: input.campaignId,
				},
			},
		});

		await logEventFromContext(
			ctx,
			'campaign_cleaner.get_campaign_pdf_analysis',
			{
				campaignId: input.campaignId,
			},
		);

		return response;
	},
};

export const GetCredits = {
	credits: async (
		ctx: any,
		_input: CampaignCleanerEndpointInputs['getCredits'],
	): Promise<CampaignCleanerEndpointOutputs['getCredits']> => {
		const response = await makeCampaignCleanerRequest<
			CampaignCleanerEndpointOutputs['getCredits']
		>('v1/get_credits', ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(ctx, 'campaign_cleaner.get_credits', {});

		return response;
	},
};

export const CampaignCleanerEndpoints = {
	deleteCampaign: DeleteCampaign,
	getCampaignList: GetCampaignList,
	getCampaignStatus: GetCampaignStatus,
	getCampaignPdfAnalysis: GetCampaignPdfAnalysis,
	getCredits: GetCredits,
} as const;
