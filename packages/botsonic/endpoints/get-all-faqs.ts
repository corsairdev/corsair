import { logEventFromContext } from 'corsair/core';
import type { BotsonicEndpoints } from '..';
import { makeBotsonicRequest } from '../client';
import {
	BotsonicEndpointInputSchemas,
	BotsonicEndpointOutputSchemas,
} from './types';

export const getAllFaqs: BotsonicEndpoints['getAllFaqs'] = async (
	ctx,
	input,
) => {
	const parsedInput = BotsonicEndpointInputSchemas.getAllFaqs.parse(input);
	const response = await makeBotsonicRequest<unknown>(
		'/v1/business/bot-faq/all',
		ctx.key,
		{
			method: 'GET',
			query: parsedInput,
			authType: 'bot-key',
		},
	);

	const parsed = BotsonicEndpointOutputSchemas.getAllFaqs.parse(response);

	await logEventFromContext(
		ctx,
		'botsonic.faq.get-all',
		{ ...parsedInput },
		'completed',
	);

	return parsed;
};
