import { z } from 'zod';

export const DeleteCampaignInputSchema = z.object({
	campaign_id: z.string().describe('The ID of the campaign to delete'),
});
export type DeleteCampaignInput = z.infer<typeof DeleteCampaignInputSchema>;

export const DeleteCampaignResponseSchema = z.any();
export type DeleteCampaignResponse = z.infer<
	typeof DeleteCampaignResponseSchema
>;

export const GetCampaignListInputSchema = z.object({});
export type GetCampaignListInput = z.infer<typeof GetCampaignListInputSchema>;

export const GetCampaignListResponseSchema = z.object({
	campaign_list: z.array(
		z.object({
			id: z.string(),
			campaign_name: z.string(),
			status: z.enum(['processing', 'completed', 'paused']),
			date_added: z.string(),
		}),
	),
});
export type GetCampaignListResponse = z.infer<
	typeof GetCampaignListResponseSchema
>;

export const GetCampaignStatusInputSchema = z.object({
	campaign_id: z.string().describe('The ID of the campaign'),
});
export type GetCampaignStatusInput = z.infer<
	typeof GetCampaignStatusInputSchema
>;

export const GetCampaignStatusResponseSchema = z.object({
	campaign_status: z
		.object({
			id: z.string(),
			campaign_name: z.string(),
			status: z.enum(['processing', 'completed', 'paused']),
			date_added: z.string(),
		})
		.optional(),
});
export type GetCampaignStatusResponse = z.infer<
	typeof GetCampaignStatusResponseSchema
>;

export const GetCampaignPdfAnalysisInputSchema = z.object({
	campaign_id: z.string().describe('The ID of the campaign'),
});
export type GetCampaignPdfAnalysisInput = z.infer<
	typeof GetCampaignPdfAnalysisInputSchema
>;

export const GetCampaignPdfAnalysisResponseSchema = z.any();
export type GetCampaignPdfAnalysisResponse = z.infer<
	typeof GetCampaignPdfAnalysisResponseSchema
>;

export const GetCreditsInputSchema = z.object({});
export type GetCreditsInput = z.infer<typeof GetCreditsInputSchema>;

export const GetCreditsResponseSchema = z.any();
export type GetCreditsResponse = z.infer<typeof GetCreditsResponseSchema>;

export const CampaignCleanerEndpointInputSchemas = {
	deleteCampaign: DeleteCampaignInputSchema,
	getCampaignList: GetCampaignListInputSchema,
	getCampaignStatus: GetCampaignStatusInputSchema,
	getCampaignPdfAnalysis: GetCampaignPdfAnalysisInputSchema,
	getCredits: GetCreditsInputSchema,
} as const;

export const CampaignCleanerEndpointOutputSchemas = {
	deleteCampaign: DeleteCampaignResponseSchema,
	getCampaignList: GetCampaignListResponseSchema,
	getCampaignStatus: GetCampaignStatusResponseSchema,
	getCampaignPdfAnalysis: GetCampaignPdfAnalysisResponseSchema,
	getCredits: GetCreditsResponseSchema,
} as const;

export type CampaignCleanerEndpointInputs = {
	deleteCampaign: DeleteCampaignInput;
	getCampaignList: GetCampaignListInput;
	getCampaignStatus: GetCampaignStatusInput;
	getCampaignPdfAnalysis: GetCampaignPdfAnalysisInput;
	getCredits: GetCreditsInput;
};

export type CampaignCleanerEndpointOutputs = {
	deleteCampaign: DeleteCampaignResponse;
	getCampaignList: GetCampaignListResponse;
	getCampaignStatus: GetCampaignStatusResponse;
	getCampaignPdfAnalysis: GetCampaignPdfAnalysisResponse;
	getCredits: GetCreditsResponse;
};
