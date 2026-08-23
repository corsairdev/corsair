import { logEventFromContext } from 'corsair/core';
import { makeAeroleadsRequest } from '../client';
import type { AeroleadsContext } from '../index';
import { cacheLinkedinDetails } from './persist';
import type {
	GetLinkedinDetailsInput,
	GetLinkedinDetailsResponse,
} from './types';
import {
	AeroleadsEndpointInputSchemas,
	AeroleadsEndpointOutputSchemas,
} from './types';

export const LinkedinDetails = {
	get: async (
		ctx: AeroleadsContext,
		input: GetLinkedinDetailsInput,
	): Promise<GetLinkedinDetailsResponse> => {
		const parsedInput =
			AeroleadsEndpointInputSchemas.linkedinDetailsGet.parse(input);

		const rawResponse = await makeAeroleadsRequest<GetLinkedinDetailsResponse>(
			'/api/get_linkedin_details',
			ctx.key,
			{
				method: 'GET',
				query: {
					linkedin_url: parsedInput.linkedin_url,
				},
			},
		);
		const response =
			AeroleadsEndpointOutputSchemas.linkedinDetailsGet.parse(rawResponse);
		await cacheLinkedinDetails(ctx, parsedInput.linkedin_url, response);
		await logEventFromContext(
			ctx,
			'aeroleads.linkedinDetails.get',
			{ ...input },
			'completed',
		);
		return response;
	},
};
