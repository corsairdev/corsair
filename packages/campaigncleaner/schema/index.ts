import { CampaignCleaner, CampaignCleanerCampaign } from './database';

export const CampaignCleanerSchema = {
	version: '1.0.0',
	entities: {
		campaigns: CampaignCleanerCampaign,
	},
};

export type {
	CampaignCleanerCampaign,
	CampaignCleanerCampaignList,
	CampaignCleanerCredits,
	CampaignCleanerPDFAnalysis,
} from './database';
