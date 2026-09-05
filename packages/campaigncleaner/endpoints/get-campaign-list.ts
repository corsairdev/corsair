import { AuthMissingError } from 'corsair/core';
import { makeCampaignCleanerRequest } from '../client';
import type { CampaignCleanerContext } from '../index';
import type {
	CampaignCleanerEndpointInputs,
	CampaignCleanerEndpointOutputs,
} from './types';

export const list = async (
	ctx: CampaignCleanerContext,
	_input: CampaignCleanerEndpointInputs['getCampaignList'],
): Promise<CampaignCleanerEndpointOutputs['getCampaignList']> => {
	if (!ctx.key) {
		throw new AuthMissingError('campaigncleaner', 'api_key');
	}
	return makeCampaignCleanerRequest('/v1/get_campaign_list', ctx.key, {
		method: 'GET',
	});
};
