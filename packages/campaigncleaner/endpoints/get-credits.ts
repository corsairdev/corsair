import { AuthMissingError } from 'corsair/core';
import { makeCampaignCleanerRequest } from '../client';
import type { CampaignCleanerContext } from '../index';
import type {
	CampaignCleanerEndpointInputs,
	CampaignCleanerEndpointOutputs,
} from './types';

export const credits = async (
	ctx: CampaignCleanerContext,
	_input: CampaignCleanerEndpointInputs['getCredits'],
): Promise<CampaignCleanerEndpointOutputs['getCredits']> => {
	if (!ctx.key) {
		throw new AuthMissingError('campaigncleaner', 'api_key');
	}
	return makeCampaignCleanerRequest('/v1/get_credits', ctx.key, {
		method: 'GET',
	});
};
