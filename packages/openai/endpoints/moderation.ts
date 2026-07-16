import { logEventFromContext } from 'corsair/core';
import { makeOpenaiRequest } from '../client';
import type { OpenaiEndpoints } from '../index';
import type { ModerationCreateResponse } from '../schema/moderation';

export const create: OpenaiEndpoints['moderationCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeOpenaiRequest<ModerationCreateResponse>(
		'moderations',
		ctx.key,
		{
			method: 'POST',
			body: { input: input.input, model: input.model },
		},
	);

	await logEventFromContext(
		ctx,
		'openai.moderation.create',
		{ model: input.model },
		'completed',
	);
	return result;
};
