import { logEventFromContext } from 'corsair/core';
import { makeGroqcloudRequest } from '../client';
import type { GroqcloudEndpoints } from '../index';
import type {
	ChatCreateCompletionResponse,
	ChatCreateResponseOutput,
} from '../schema/chat';

export const createCompletion: GroqcloudEndpoints['chatCreateCompletion'] =
	async (ctx, input) => {
		const result = await makeGroqcloudRequest<ChatCreateCompletionResponse>(
			'chat/completions',
			ctx.key,
			{
				method: 'POST',
				body: input,
			},
		);

		await logEventFromContext(
			ctx,
			'groqcloud.chat.createCompletion',
			{ model: input.model },
			'completed',
		);

		return result;
	};

export const createResponse: GroqcloudEndpoints['chatCreateResponse'] = async (
	ctx,
	input,
) => {
	const result = await makeGroqcloudRequest<ChatCreateResponseOutput>(
		'responses',
		ctx.key,
		{
			method: 'POST',
			body: input,
		},
	);

	await logEventFromContext(
		ctx,
		'groqcloud.chat.createResponse',
		{ model: input.model },
		'completed',
	);

	return result;
};
