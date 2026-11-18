import { makeLapostaRequest } from '../client';
import type {
	GetCampaignInput,
	GetCampaignOutput,
	GetCampaignsInput,
	GetCampaignsOutput,
} from './types';
import { GetCampaignOutputSchema, GetCampaignsOutputSchema } from './types';

export const campaigns = {
	list: async (
		_input: GetCampaignsInput,
		apiKey?: string,
	): Promise<GetCampaignsOutput> => {
		const raw = await makeLapostaRequest<unknown>('/campaign', apiKey, {
			method: 'GET',
		});
		return GetCampaignsOutputSchema.parse(raw);
	},

	get: async (
		input: GetCampaignInput,
		apiKey?: string,
	): Promise<GetCampaignOutput> => {
		const raw = await makeLapostaRequest<unknown>(
			`/campaign/${encodeURIComponent(input.campaign_id)}`,
			apiKey,
			{ method: 'GET' },
		);
		return GetCampaignOutputSchema.parse(raw);
	},
};
