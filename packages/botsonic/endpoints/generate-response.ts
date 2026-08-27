import { logEventFromContext } from 'corsair/core';
import type { BotsonicEndpoints } from '..';
import { makeBotsonicRequest } from '../client';

export const generateResponse: BotsonicEndpoints['generateResponse'] = async (
	ctx,
	input,
) => {
	const response = await makeBotsonicRequest('/v1/botsonic/generate', ctx.key, {
		method: 'POST',
		body: input,
	});

	await logEventFromContext(
		ctx,
		'botsonic.generate-response',
		{ ...input },
		'completed',
	);

	return response;
};
