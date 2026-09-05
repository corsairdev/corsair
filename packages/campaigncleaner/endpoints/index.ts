import { logEventFromContext } from 'corsair/core';

import { makeCampaignCleanerRequest } from '../client';

import type {
	CampaignCleanerEndpointInputs,
	CampaignCleanerEndpointOutputs,
} from './types';

import {
	CampaignCleanerEndpointInputSchemas,
	CampaignCleanerEndpointOutputSchemas,
} from './types';

export const DeleteCampaign = {
	remove: async (
		ctx: any,
		input: CampaignCleanerEndpointInputs['deleteCampaign'],
	): Promise<CampaignCleanerEndpointOutputs['deleteCampaign']> => {
		const validatedInput =
			CampaignCleanerEndpointInputSchemas.deleteCampaign.parse(input);

		const response = await makeCampaignCleanerRequest<
			CampaignCleanerEndpointOutputs['deleteCampaign']
		>('v1/delete_campaign', ctx.key, {
			method: 'POST',
			body: {
				campaign: {
					id: validatedInput.campaignId,
				},
			},
		});

		const validatedResponse =
			CampaignCleanerEndpointOutputSchemas.deleteCampaign.parse(response);

		await logEventFromContext(ctx, 'campaign_cleaner.delete_campaign', {
			campaignId: validatedInput.campaignId,
		});

		return validatedResponse;
	},
};

export const GetCampaignList = {
	list: async (
		ctx: any,
		input: CampaignCleanerEndpointInputs['getCampaignList'],
	): Promise<CampaignCleanerEndpointOutputs['getCampaignList']> => {
		CampaignCleanerEndpointInputSchemas.getCampaignList.parse(input);

		const response = await makeCampaignCleanerRequest<
			CampaignCleanerEndpointOutputs['getCampaignList']
		>('v1/get_campaign_list', ctx.key, {
			method: 'GET',
		});

		const validatedResponse =
			CampaignCleanerEndpointOutputSchemas.getCampaignList.parse(response);

		await logEventFromContext(ctx, 'campaign_cleaner.get_campaign_list', {});

		return validatedResponse;
	},
};

export const GetCampaignStatus = {
	status: async (
		ctx: any,
		input: CampaignCleanerEndpointInputs['getCampaignStatus'],
	): Promise<CampaignCleanerEndpointOutputs['getCampaignStatus']> => {
		const validatedInput =
			CampaignCleanerEndpointInputSchemas.getCampaignStatus.parse(input);

		const response = await makeCampaignCleanerRequest<
			CampaignCleanerEndpointOutputs['getCampaignStatus']
		>('v1/get_campaign_status', ctx.key, {
			method: 'POST',
			body: {
				campaign: {
					id: validatedInput.campaignId,
				},
			},
		});

		const validatedResponse =
			CampaignCleanerEndpointOutputSchemas.getCampaignStatus.parse(response);

		await logEventFromContext(ctx, 'campaign_cleaner.get_campaign_status', {
			campaignId: validatedInput.campaignId,
		});

		return validatedResponse;
	},
};

export const GetCampaignPdfAnalysis = {
	pdfAnalysis: async (
		ctx: any,
		input: CampaignCleanerEndpointInputs['getCampaignPdfAnalysis'],
	): Promise<CampaignCleanerEndpointOutputs['getCampaignPdfAnalysis']> => {
		const validatedInput =
			CampaignCleanerEndpointInputSchemas.getCampaignPdfAnalysis.parse(input);

		const response = await makeCampaignCleanerRequest<
			CampaignCleanerEndpointOutputs['getCampaignPdfAnalysis']
		>('v1/get_campaign_pdf_analysis', ctx.key, {
			method: 'POST',
			responseType: 'arrayBuffer',
			body: {
				campaign: {
					id: validatedInput.campaignId,
				},
			},
		});

		const validatedResponse =
			CampaignCleanerEndpointOutputSchemas.getCampaignPdfAnalysis.parse(
				response,
			);

		await logEventFromContext(
			ctx,
			'campaign_cleaner.get_campaign_pdf_analysis',
			{
				campaignId: validatedInput.campaignId,
			},
		);

		return validatedResponse;
	},
};

export const GetCredits = {
	credits: async (
		ctx: any,
		input: CampaignCleanerEndpointInputs['getCredits'],
	): Promise<CampaignCleanerEndpointOutputs['getCredits']> => {
		CampaignCleanerEndpointInputSchemas.getCredits.parse(input);

		const response = await makeCampaignCleanerRequest<
			CampaignCleanerEndpointOutputs['getCredits']
		>('v1/get_credits', ctx.key, {
			method: 'GET',
		});

		const validatedResponse =
			CampaignCleanerEndpointOutputSchemas.getCredits.parse(response);

		await logEventFromContext(ctx, 'campaign_cleaner.get_credits', {});

		return validatedResponse;
	},
};

export const CampaignCleanerEndpoints = {
	deleteCampaign: DeleteCampaign,
	getCampaignList: GetCampaignList,
	getCampaignStatus: GetCampaignStatus,
	getCampaignPdfAnalysis: GetCampaignPdfAnalysis,
	getCredits: GetCredits,
} as const;
