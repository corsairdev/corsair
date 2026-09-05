import { remove as deleteCampaignRemove } from './delete-campaign';
import { list as getCampaignListList } from './get-campaign-list';
import { pdfAnalysis as getCampaignPdfAnalysisPdfAnalysis } from './get-campaign-pdf-analysis';
import { status as getCampaignStatusStatus } from './get-campaign-status';
import { credits as getCreditsCredits } from './get-credits';

export const DeleteCampaign = {
	remove: deleteCampaignRemove,
};

export const GetCampaignList = {
	list: getCampaignListList,
};

export const GetCampaignStatus = {
	status: getCampaignStatusStatus,
};

export const GetCampaignPdfAnalysis = {
	pdfAnalysis: getCampaignPdfAnalysisPdfAnalysis,
};

export const GetCredits = {
	credits: getCreditsCredits,
};

export * from './types';
