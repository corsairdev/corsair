import { logEventFromContext } from 'corsair/core';
import type { WebScrapingAIEndpoints } from '..';
import { makeWebScrapingAIRequest } from '../client';
import { AccountInfoResponseSchema, GetAccountInfoInputSchema } from './types';

export const getInfo: WebScrapingAIEndpoints['accountGetInfo'] = async (
	ctx,
	rawInput,
) => {
	GetAccountInfoInputSchema.parse(rawInput);
	const response = AccountInfoResponseSchema.parse(
		await makeWebScrapingAIRequest<unknown>('/account', ctx.key),
	);
	await logEventFromContext(
		ctx,
		'webscrapingai.account.getInfo',
		{ remainingCredits: response.remaining_total_credits },
		'completed',
	);
	return response;
};
