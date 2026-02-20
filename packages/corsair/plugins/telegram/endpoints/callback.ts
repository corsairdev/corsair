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
			body: {
				callback_query_id: input.callback_query_id,
				text: input.text,
				show_alert: input.show_alert,
				url: input.url,
				cache_time: input.cache_time,
			},
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
		body: {
			inline_query_id: input.inline_query_id,
			results: input.results,
			cache_time: input.cache_time,
			is_personal: input.is_personal,
			next_offset: input.next_offset,
			switch_pm_text: input.switch_pm_text,
			switch_pm_parameter: input.switch_pm_parameter,
		},
	});

	await logEventFromContext(
		ctx,
		'telegram.callback.answerInlineQuery',
		{ ...input },
		'completed',
	);
	return result;
};
