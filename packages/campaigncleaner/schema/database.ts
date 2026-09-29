import { z } from 'zod';

/**
 * Saved campaign row from GET /v1/get_campaign_list and POST /v1/get_campaign_status.
 * Field names match https://docs.campaigncleaner.com/api-reference/endpoint/get-campaign-list
 */
export const CampaignCleanerCampaign = z
	.object({
		id: z.string(),
		campaign_name: z.string(),
		status: z.enum(['processing', 'completed', 'paused']),
		date_added: z.string(),
	})
	.loose();
export type CampaignCleanerCampaign = z.infer<typeof CampaignCleanerCampaign>;

/** GET /v1/get_credits — https://docs.campaigncleaner.com/api-reference/endpoint/get-credits */
export const CampaignCleanerCredits = z
	.object({
		credits: z.number(),
	})
	.loose();
export type CampaignCleanerCredits = z.infer<typeof CampaignCleanerCredits>;
