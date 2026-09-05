import { z } from 'zod';

// ==================== Delete Campaign ====================

const DeleteCampaignInputSchema = z.object({
	campaignId: z.string().min(1),
});

export type DeleteCampaignInput = z.infer<typeof DeleteCampaignInputSchema>;

const DeleteCampaignResponseSchema = z.object({
	status: z.enum(['success', 'failure']),
	error: z.string().optional(),
});

export type DeleteCampaignResponse = z.infer<
	typeof DeleteCampaignResponseSchema
>;

// ==================== Get Campaign PDF Analysis ====================

const GetCampaignPdfAnalysisInputSchema = z.object({
	campaignId: z.string().min(1),
});

export type GetCampaignPdfAnalysisInput = z.infer<
	typeof GetCampaignPdfAnalysisInputSchema
>;

const GetCampaignPdfAnalysisResponseSchema = z.instanceof(ArrayBuffer);

export type GetCampaignPdfAnalysisResponse = z.infer<
	typeof GetCampaignPdfAnalysisResponseSchema
>;

// ==================== Campaign ====================

const CampaignSchema = z.object({
	id: z.string(),
	campaign_name: z.string(),
	status: z.enum(['processing', 'completed', 'paused']),
	date_added: z.string(),
});

// ==================== Get Campaign List ====================

const GetCampaignListInputSchema = z.object({});

export type GetCampaignListInput = z.infer<typeof GetCampaignListInputSchema>;

const GetCampaignListResponseSchema = z.object({
	campaign_list: z.array(CampaignSchema),
});

export type GetCampaignListResponse = z.infer<
	typeof GetCampaignListResponseSchema
>;

// ==================== Get Campaign Status ====================

const GetCampaignStatusInputSchema = z.object({
	campaignId: z.string().min(1),
});

export type GetCampaignStatusInput = z.infer<
	typeof GetCampaignStatusInputSchema
>;

const GetCampaignStatusResponseSchema = z.object({
	campaign_status: CampaignSchema,
});

export type GetCampaignStatusResponse = z.infer<
	typeof GetCampaignStatusResponseSchema
>;

// ==================== Get Credits ====================

const GetCreditsInputSchema = z.object({});

export type GetCreditsInput = z.infer<typeof GetCreditsInputSchema>;

const GetCreditsResponseSchema = z.object({
	credits: z.number(),
});

export type GetCreditsResponse = z.infer<typeof GetCreditsResponseSchema>;

// ==================== Endpoint Input Types ====================

export type CampaignCleanerEndpointInputs = {
	deleteCampaign: DeleteCampaignInput;
	getCampaignPdfAnalysis: GetCampaignPdfAnalysisInput;
	getCampaignList: GetCampaignListInput;
	getCampaignStatus: GetCampaignStatusInput;
	getCredits: GetCreditsInput;
};

// ==================== Endpoint Output Types ====================

export type CampaignCleanerEndpointOutputs = {
	deleteCampaign: DeleteCampaignResponse;
	getCampaignPdfAnalysis: GetCampaignPdfAnalysisResponse;
	getCampaignList: GetCampaignListResponse;
	getCampaignStatus: GetCampaignStatusResponse;
	getCredits: GetCreditsResponse;
};

// ==================== Runtime Input Schemas ====================

export const CampaignCleanerEndpointInputSchemas = {
	deleteCampaign: DeleteCampaignInputSchema,
	getCampaignPdfAnalysis: GetCampaignPdfAnalysisInputSchema,
	getCampaignList: GetCampaignListInputSchema,
	getCampaignStatus: GetCampaignStatusInputSchema,
	getCredits: GetCreditsInputSchema,
} as const;

// ==================== Runtime Output Schemas ====================

export const CampaignCleanerEndpointOutputSchemas = {
	deleteCampaign: DeleteCampaignResponseSchema,
	getCampaignPdfAnalysis: GetCampaignPdfAnalysisResponseSchema,
	getCampaignList: GetCampaignListResponseSchema,
	getCampaignStatus: GetCampaignStatusResponseSchema,
	getCredits: GetCreditsResponseSchema,
} as const;
