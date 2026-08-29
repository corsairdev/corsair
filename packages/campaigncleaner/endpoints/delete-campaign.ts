import { AuthMissingError } from 'corsair/core';
import { makeCampaignCleanerRequest } from '../client';
import type { CampaignCleanerContext } from '../index';
import type {
	CampaignCleanerEndpointInputs,
	CampaignCleanerEndpointOutputs,
} from './types';

export const remove = async (
	ctx: CampaignCleanerContext,
	input: CampaignCleanerEndpointInputs['deleteCampaign'],
): Promise<CampaignCleanerEndpointOutputs['deleteCampaign']> => {
	if (!ctx.key) {
		throw new AuthMissingError('campaigncleaner', 'api_key');
	}
	return makeCampaignCleanerRequest('/v1/delete_campaign', ctx.key, {
		method: 'POST',
		body: {
			campaign: {
				id: input.campaign_id,
			},
		},
	});
};
