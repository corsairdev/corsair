import { logEventFromContext } from 'corsair/core';
import type { BotsonicEndpoints } from '..';
import { makeBotsonicRequest } from '../client';
import {
	BotsonicEndpointInputSchemas,
	BotsonicEndpointOutputSchemas,
} from './types';

export const generateResponse: BotsonicEndpoints['generateResponse'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		BotsonicEndpointInputSchemas.generateResponse.parse(input);
	const response = await makeBotsonicRequest<unknown>(
		'/v1/botsonic/generate',
		ctx.key,
		{
			method: 'POST',
			body: parsedInput,
		},
	);

	const parsed = BotsonicEndpointOutputSchemas.generateResponse.parse(response);

	await logEventFromContext(
		ctx,
		'botsonic.generate-response',
		{ ...parsedInput },
		'completed',
	);

	return parsed;
};
