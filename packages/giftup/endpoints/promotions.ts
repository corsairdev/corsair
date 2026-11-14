import { makeGiftUpRequest } from '../client';
import type { GiftUpContext } from '../index';
import type {
	Promotion,
	PromotionsListInput,
	PromotionsListResponse,
} from './types';
import {
	PromotionsListInputSchema,
	PromotionsListResponseSchema,
} from './types';

export const Promotions = {
	list: async (
		ctx: GiftUpContext,
		input: PromotionsListInput,
	): Promise<PromotionsListResponse> => {
		PromotionsListInputSchema.parse(input);
		const response = await makeGiftUpRequest<Promotion[]>(
			'/promotions',
			ctx.key,
			{
				method: 'GET',
				testMode: ctx.options?.testMode,
			},
		);
		return PromotionsListResponseSchema.parse(response);
	},
};
