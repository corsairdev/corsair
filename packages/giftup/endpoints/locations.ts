import { makeGiftUpRequest } from '../client';
import type { GiftUpContext } from '../index';
import type {
	Location,
	LocationsListInput,
	LocationsListResponse,
} from './types';
import { LocationsListInputSchema, LocationsListResponseSchema } from './types';

export const Locations = {
	list: async (
		ctx: GiftUpContext,
		input: LocationsListInput,
	): Promise<LocationsListResponse> => {
		LocationsListInputSchema.parse(input);
		const response = await makeGiftUpRequest<Location[]>(
			'/locations',
			ctx.key,
			{
				method: 'GET',
				testMode: ctx.options?.testMode,
			},
		);
		return LocationsListResponseSchema.parse(response);
	},
};
