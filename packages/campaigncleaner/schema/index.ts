import { CampaignCleanerCampaign, CampaignCleanerCredits } from './database';

export const CampaignCleanerSchema = {
	version: '1.0.0',
	entities: {
		campaigns: CampaignCleanerCampaign,
		credits: CampaignCleanerCredits,
	},
} as const;

export * from './database';
