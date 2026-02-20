import { logEventFromContext } from '../../utils/events';
import type { TelegramEndpoints } from '..';
import { makeTelegramRequest } from '../client';
import type { TelegramEndpointOutputs } from './types';

export const answerCallbackQuery: TelegramEndpoints['answerCallbackQuery'] =
	async (ctx, input) => {
		const result = await makeTelegramRequest<
			TelegramEndpointOutputs['answerCallbackQuery']
		>('answerCallbackQuery', ctx.key, {
			method: 'POST',
			body: input,
		});

		await logEventFromContext(
			ctx,
			'telegram.callback.answerCallbackQuery',
			{ ...input },
			'completed',
		);
		return result;
	};

export const answerInlineQuery: TelegramEndpoints['answerInlineQuery'] = async (
	ctx,
	input,
) => {
	const result = await makeTelegramRequest<
		TelegramEndpointOutputs['answerInlineQuery']
	>('answerInlineQuery', ctx.key, {
		method: 'POST',
		body: input,
	});

	await logEventFromContext(
		ctx,
		'telegram.callback.answerInlineQuery',
		{ ...input },
		'completed',
	);
	return result;
};
