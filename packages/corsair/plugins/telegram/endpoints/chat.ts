import { logEventFromContext } from '../../utils/events';
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
				id: result.id.toString(),
				chat_id: result.id,
				type: result.type as 'private' | 'group' | 'supergroup' | 'channel',
				title: result.title,
				username: result.username,
				first_name: result.first_name,
				last_name: result.last_name,
				is_forum: result.is_forum,
				description: result.description,
				invite_link: result.invite_link,
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
		body: {
			chat_id: input.chat_id,
			user_id: input.user_id,
		},
	});

	await logEventFromContext(
		ctx,
		'telegram.chat.getChatMember',
		{ ...input },
		'completed',
	);
	return result;
};
