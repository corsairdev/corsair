import { logEventFromContext } from 'corsair/core';
import type { BotsonicEndpoints } from '..';
import { makeBotsonicRequest } from '../client';

export const getAllFaqs: BotsonicEndpoints['getAllFaqs'] = async (
	ctx,
	input,
) => {
	const response = await makeBotsonicRequest(
		'/v1/business/bot-faq/all',
		ctx.key,
		{
			method: 'GET',
			query: input,
			authType: 'bot-key',
		},
	);

	await logEventFromContext(
		ctx,
		'botsonic.faq.get-all',
		{ ...input },
		'completed',
	);

	return response;
};
