import { makeGiftUpRequest } from '../client';
import type { GiftUpContext } from '../index';
import type { Company, CompanyGetInput } from './types';
import { CompanyGetInputSchema, CompanySchema } from './types';

export const CompanyEndpoints = {
	get: async (ctx: GiftUpContext, input: CompanyGetInput): Promise<Company> => {
		CompanyGetInputSchema.parse(input);
		const response = await makeGiftUpRequest<Company>('/company', ctx.key, {
			method: 'GET',
			testMode: ctx.options?.testMode,
		});
		return CompanySchema.parse(response);
	},
};
