import { z } from 'zod';
import {
	CampaignCleanerCampaign,
	CampaignCleanerCredits,
} from '../schema/database';

const CampaignIdInputSchema = z.object({
	campaignId: z.string().min(1),
});

export const DeleteCampaignInputSchema = CampaignIdInputSchema;
export type DeleteCampaignInput = z.infer<typeof DeleteCampaignInputSchema>;

export const DeleteCampaignResponseSchema = z
	.object({
		status: z.enum(['success', 'failure']),
		error: z.string().optional(),
	})
	.loose();
export type DeleteCampaignResponse = z.infer<
	typeof DeleteCampaignResponseSchema
>;

export const GetCampaignPdfAnalysisInputSchema = CampaignIdInputSchema;
export type GetCampaignPdfAnalysisInput = z.infer<
	typeof GetCampaignPdfAnalysisInputSchema
>;

export const GetCampaignPdfAnalysisResponseSchema = z.object({
	content_type: z.string(),
	content_base64: z.string().min(1),
});
export type GetCampaignPdfAnalysisResponse = z.infer<
	typeof GetCampaignPdfAnalysisResponseSchema
>;

export const GetCampaignListInputSchema = z.object({});
export type GetCampaignListInput = z.infer<typeof GetCampaignListInputSchema>;

export const GetCampaignListResponseSchema = z
	.object({
		campaign_list: z.array(CampaignCleanerCampaign),
	})
	.loose();
export type GetCampaignListResponse = z.infer<
	typeof GetCampaignListResponseSchema
>;

export const GetCampaignStatusInputSchema = CampaignIdInputSchema;
export type GetCampaignStatusInput = z.infer<
	typeof GetCampaignStatusInputSchema
>;

export const GetCampaignStatusResponseSchema = z
	.object({
		campaign_status: CampaignCleanerCampaign,
	})
	.loose();
export type GetCampaignStatusResponse = z.infer<
	typeof GetCampaignStatusResponseSchema
>;

export const GetCreditsInputSchema = z.object({});
export type GetCreditsInput = z.infer<typeof GetCreditsInputSchema>;

export const GetCreditsResponseSchema = CampaignCleanerCredits;
export type GetCreditsResponse = z.infer<typeof GetCreditsResponseSchema>;

export type CampaignCleanerEndpointInputs = {
	deleteCampaign: DeleteCampaignInput;
	getCampaignPdfAnalysis: GetCampaignPdfAnalysisInput;
	getCampaignList: GetCampaignListInput;
	getCampaignStatus: GetCampaignStatusInput;
	getCredits: GetCreditsInput;
};

export type CampaignCleanerEndpointOutputs = {
	deleteCampaign: DeleteCampaignResponse;
	getCampaignPdfAnalysis: GetCampaignPdfAnalysisResponse;
	getCampaignList: GetCampaignListResponse;
	getCampaignStatus: GetCampaignStatusResponse;
	getCredits: GetCreditsResponse;
};

export const CampaignCleanerEndpointInputSchemas = {
	deleteCampaign: DeleteCampaignInputSchema,
	getCampaignPdfAnalysis: GetCampaignPdfAnalysisInputSchema,
	getCampaignList: GetCampaignListInputSchema,
	getCampaignStatus: GetCampaignStatusInputSchema,
	getCredits: GetCreditsInputSchema,
} as const;

export const CampaignCleanerEndpointOutputSchemas = {
	deleteCampaign: DeleteCampaignResponseSchema,
	getCampaignPdfAnalysis: GetCampaignPdfAnalysisResponseSchema,
	getCampaignList: GetCampaignListResponseSchema,
	getCampaignStatus: GetCampaignStatusResponseSchema,
	getCredits: GetCreditsResponseSchema,
} as const;
