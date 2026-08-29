import { AuthMissingError } from 'corsair/core';
import { makeCampaignCleanerRequest } from '../client';
import type { CampaignCleanerContext } from '../index';
import type {
	CampaignCleanerEndpointInputs,
	CampaignCleanerEndpointOutputs,
} from './types';

export const pdfAnalysis = async (
	ctx: CampaignCleanerContext,
	input: CampaignCleanerEndpointInputs['getCampaignPdfAnalysis'],
): Promise<CampaignCleanerEndpointOutputs['getCampaignPdfAnalysis']> => {
	if (!ctx.key) {
		throw new AuthMissingError('campaigncleaner', 'api_key');
	}
	return makeCampaignCleanerRequest('/v1/get_campaign_pdf_analysis', ctx.key, {
		method: 'POST',
		body: {
			campaign: {
				id: input.campaign_id,
			},
		},
	});
};
