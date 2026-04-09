import { logEventFromContext } from 'corsair/core';
import type { TelegramEndpoints } from '..';
import { makeTelegramRequest } from '../client';
import type { TelegramEndpointOutputs } from './types';

export const getChat: TelegramEndpoints['getChat'] = async (ctx, input) => {
	const result = await makeTelegramRequest<TelegramEndpointOutputs['getChat']>(
		'getChat',
		ctx.key,
		{
			method: 'POST',
			body: {
				chat_id: input.chat_id,
			},
		},
	);

	if (result && ctx.db.chats) {
		try {
			await ctx.db.chats.upsertByEntityId(result.id.toString(), {
				...result,
				chat_id: result.id,
				id: result.id.toString(),
			});
		} catch (error) {
			console.warn('Failed to save chat to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'telegram.chat.getChat',
		{ ...input },
		'completed',
	);
	return result;
};

export const getChatAdministrators: TelegramEndpoints['getChatAdministrators'] =
	async (ctx, input) => {
		const result = await makeTelegramRequest<
			TelegramEndpointOutputs['getChatAdministrators']
		>('getChatAdministrators', ctx.key, {
			method: 'POST',
			body: {
				chat_id: input.chat_id,
			},
		});

		await logEventFromContext(
			ctx,
			'telegram.chat.getChatAdministrators',
			{ ...input },
			'completed',
		);
		return result;
	};

export const getChatMember: TelegramEndpoints['getChatMember'] = async (
	ctx,
	input,
) => {
	const result = await makeTelegramRequest<
		TelegramEndpointOutputs['getChatMember']
	>('getChatMember', ctx.key, {
		method: 'POST',
		body: input,
	});

	await logEventFromContext(
		ctx,
		'telegram.chat.getChatMember',
		{ ...input },
		'completed',
	);
	return result;
};
