import * as CampaignCleanerEndpoints from './types';

export const campaignCleanerEndpoints = {
	sendCampaign: CampaignCleanerEndpoints.sendCampaign,
	getCampaignList: CampaignCleanerEndpoints.getCampaignList,
	getCampaignStatus: CampaignCleanerEndpoints.getCampaignStatus,
	deleteCampaign: CampaignCleanerEndpoints.deleteCampaign,
	downloadPdfAnalysis: CampaignCleanerEndpoints.downloadPdfAnalysis,
	getCredits: CampaignCleanerEndpoints.getCredits,
};

export type CampaignCleanerEndpoints = typeof campaignCleanerEndpoints;
