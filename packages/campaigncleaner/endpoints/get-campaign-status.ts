import { AuthMissingError } from 'corsair/core';
import { makeCampaignCleanerRequest } from '../client';
import type { CampaignCleanerContext } from '../index';
import type {
	CampaignCleanerEndpointInputs,
	CampaignCleanerEndpointOutputs,
} from './types';

export const status = async (
	ctx: CampaignCleanerContext,
	input: CampaignCleanerEndpointInputs['getCampaignStatus'],
): Promise<CampaignCleanerEndpointOutputs['getCampaignStatus']> => {
	if (!ctx.key) {
		throw new AuthMissingError('campaigncleaner', 'api_key');
	}
	return makeCampaignCleanerRequest('/v1/get_campaign_status', ctx.key, {
		method: 'POST',
		body: {
			campaign: {
				id: input.campaign_id,
			},
		},
	});
};
