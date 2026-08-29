import type { CorsairEndpoint } from 'corsair/core';
import { z } from 'zod';
import type {
	CampaignCleanerCampaign,
	CampaignCleanerCampaignList,
	CampaignCleanerCredits,
	CampaignCleanerPDFAnalysis,
} from '../schema/database';

export const CampaignCleanerEndpointInputSchemas = {
	sendCampaign: z.object({
		name: z.string().describe('Campaign name'),
		subject: z.string().optional().describe('Email subject'),
		content: z.string().describe('Email content'),
		recipients: z.string().describe('Email recipients'),
	}),
	getCampaignList: z.object({
		cursor: z.string().optional().describe('Pagination cursor'),
		limit: z.number().optional().default(50).describe('Max results per page'),
	}),
	getCampaignStatus: z.object({
		campaign_id: z.string().describe('Campaign ID'),
	}),
	deleteCampaign: z.object({
		campaign_id: z.string().describe('Campaign ID to delete'),
	}),
	downloadPdfAnalysis: z.object({
		analysis_id: z.string().describe('PDF analysis ID'),
	}),
	getCredits: z.object({}),
} as const;

export type CampaignCleanerEndpointInputs = {
	[K in keyof typeof CampaignCleanerEndpointInputSchemas]: z.infer<
		(typeof CampaignCleanerEndpointInputSchemas)[K]
	>;
};

export const CampaignCleanerEndpointOutputSchemas = {
	sendCampaign: CampaignCleanerCampaign,
	getCampaignList: CampaignCleanerCampaignList,
	getCampaignStatus: CampaignCleanerCampaign,
	deleteCampaign: z.void(),
	downloadPdfAnalysis: CampaignCleanerPDFAnalysis,
	getCredits: CampaignCleanerCredits,
} as const;

export type CampaignCleanerEndpointOutputs = {
	[K in keyof typeof CampaignCleanerEndpointOutputSchemas]: z.infer<
		(typeof CampaignCleanerEndpointOutputSchemas)[K]
	>;
};
