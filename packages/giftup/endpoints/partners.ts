import { makeGiftUpRequest } from '../client';
import type { GiftUpContext } from '../index';
import type {
	PartnersCreateAccountInput,
	PartnersCreateAccountResponse,
} from './types';
import {
	PartnersCreateAccountInputSchema,
	PartnersCreateAccountResponseSchema,
} from './types';

export const Partners = {
	createAccount: async (
		ctx: GiftUpContext,
		input: PartnersCreateAccountInput,
	): Promise<PartnersCreateAccountResponse> => {
		const parsed = PartnersCreateAccountInputSchema.parse(input);
		const response = await makeGiftUpRequest<PartnersCreateAccountResponse>(
			'/partners/account/create',
			ctx.key,
			{
				method: 'POST',
				body: parsed,
				testMode: ctx.options?.testMode,
			},
		);
		return PartnersCreateAccountResponseSchema.parse(response);
	},
};
