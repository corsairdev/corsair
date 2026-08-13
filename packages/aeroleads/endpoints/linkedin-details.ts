import { logEventFromContext } from 'corsair/core';
import { makeAeroleadsRequest } from '../client';
import type { AeroleadsContext } from '../index';
import type {
	GetLinkedinDetailsInput,
	GetLinkedinDetailsResponse,
} from './types';
import { AeroleadsEndpointOutputSchemas } from './types';

export const LinkedinDetails = {
	get: async (
		ctx: AeroleadsContext,
		input: GetLinkedinDetailsInput,
	): Promise<GetLinkedinDetailsResponse> => {
		const rawResponse = await makeAeroleadsRequest<GetLinkedinDetailsResponse>(
			'/api/get_linkedin_details',
			ctx.key,
			{
				method: 'GET',
				query: {
					linkedin_url: input.linkedin_url,
				},
			},
		);
		const response =
			AeroleadsEndpointOutputSchemas.linkedinDetailsGet.parse(rawResponse);
		await logEventFromContext(
			ctx,
			'aeroleads.linkedinDetails.get',
			{ ...input },
			'completed',
		);
		return response;
	},
};
