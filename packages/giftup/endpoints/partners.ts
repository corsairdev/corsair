import { makeGiftUpRequest } from '../client';
import type { GiftUpContext } from '../index';
import type { PartnerAccount, PartnersCreateAccountInput } from './types';
import {
	PartnerAccountSchema,
	PartnersCreateAccountInputSchema,
} from './types';

export const Partners = {
	createAccount: async (
		ctx: GiftUpContext,
		input: PartnersCreateAccountInput,
	): Promise<PartnerAccount> => {
		const parsed = PartnersCreateAccountInputSchema.parse(input);
		const response = await makeGiftUpRequest<PartnerAccount>(
			'/partners/account/create',
			ctx.key,
			{
				method: 'POST',
				body: parsed,
				testMode: ctx.options?.testMode,
			},
		);
		return PartnerAccountSchema.parse(response);
	},
};
