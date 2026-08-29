import { z } from 'zod';

export const CampaignCleanerCredits = z.object({
	credits: z.number().int().optional(),
});

export const CampaignCleanerCampaign = z.object({
	id: z.string(),
	name: z.string().optional(),
	status: z.enum(['pending', 'processing', 'completed', 'failed']).optional(),
	created_at: z.string().optional(),
	updated_at: z.string().optional(),
});

export const CampaignCleanerCampaignList = z.object({
	campaigns: z.array(CampaignCleanerCampaign).optional(),
	has_more: z.boolean().optional(),
	next_cursor: z.string().optional(),
});

export const CampaignCleanerPDFAnalysis = z.object({
	analysis_id: z.string(),
	download_url: z.string(),
	filename: z.string().optional(),
});

export type CampaignCleanerCredits = z.infer<typeof CampaignCleanerCredits>;
export type CampaignCleanerCampaign = z.infer<typeof CampaignCleanerCampaign>;
export type CampaignCleanerCampaignList = z.infer<
	typeof CampaignCleanerCampaignList
>;
export type CampaignCleanerPDFAnalysis = z.infer<
	typeof CampaignCleanerPDFAnalysis
>;
