import { logEventFromContext } from '../../utils/events';
import type { DiscordEndpoints } from '..';
import { makeDiscordRequest } from '../client';
import type { DiscordEndpointOutputs } from './types';

export const send: DiscordEndpoints['messagesSend'] = async (ctx, input) => {
	const { channel_id, ...body } = input;

	const result = await makeDiscordRequest<
		DiscordEndpointOutputs['messagesSend']
	>(`channels/${channel_id}/messages`, ctx.key, { method: 'POST', body });

	if (ctx.db.messages) {
		try {
			await ctx.db.messages.upsertByEntityId(result.id, {
				...result,
				channel_id: result.channel_id,
				authorId: result.author.id,
				createdAt: new Date(result.timestamp),
			});
		} catch (error) {
			console.warn('Failed to save message to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'discord.messages.send',
		{ channel_id, ...body },
		'completed',
	);
	return result;
};

export const reply: DiscordEndpoints['messagesReply'] = async (ctx, input) => {
	const { channel_id, message_id, fail_if_not_exists = true, ...rest } = input;

	const result = await makeDiscordRequest<
		DiscordEndpointOutputs['messagesReply']
	>(`channels/${channel_id}/messages`, ctx.key, {
		method: 'POST',
		body: {
			...rest,
			message_reference: {
				type: 0,
				message_id,
				channel_id,
				fail_if_not_exists,
			},
		},
	});

	if (ctx.db.messages) {
		try {
			await ctx.db.messages.upsertByEntityId(result.id, {
				...result,
				channel_id: result.channel_id,
				authorId: result.author.id,
				createdAt: new Date(result.timestamp),
			});
		} catch (error) {
			console.warn('Failed to save reply to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'discord.messages.reply',
		{ channel_id, message_id },
		'completed',
	);
	return result;
};

export const get: DiscordEndpoints['messagesGet'] = async (ctx, input) => {
	const result = await makeDiscordRequest<
		DiscordEndpointOutputs['messagesGet']
	>(`channels/${input.channel_id}/messages/${input.message_id}`, ctx.key);

	await logEventFromContext(
		ctx,
		'discord.messages.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const list: DiscordEndpoints['messagesList'] = async (ctx, input) => {
	const { channel_id, ...query } = input;

	const result = await makeDiscordRequest<
		DiscordEndpointOutputs['messagesList']
	>(`channels/${channel_id}/messages`, ctx.key, { query });

	await logEventFromContext(
		ctx,
		'discord.messages.list',
		{ channel_id },
		'completed',
	);
	return result;
};

export const edit: DiscordEndpoints['messagesEdit'] = async (ctx, input) => {
	const { channel_id, message_id, ...body } = input;

	const result = await makeDiscordRequest<
		DiscordEndpointOutputs['messagesEdit']
	>(`channels/${channel_id}/messages/${message_id}`, ctx.key, {
		method: 'PATCH',
		body,
	});

	if (ctx.db.messages) {
		try {
			await ctx.db.messages.upsertByEntityId(result.id, {
				...result,
				channel_id: result.channel_id,
				authorId: result.author.id,
				createdAt: new Date(result.timestamp),
			});
		} catch (error) {
			console.warn('Failed to update message in database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'discord.messages.edit',
		{ channel_id, message_id },
		'completed',
	);
	return result;
};

export const del: DiscordEndpoints['messagesDelete'] = async (ctx, input) => {
	await makeDiscordRequest<void>(
		`channels/${input.channel_id}/messages/${input.message_id}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	if (ctx.db.messages) {
		try {
			await ctx.db.messages.deleteByEntityId(input.message_id);
		} catch (error) {
			console.warn('Failed to delete message from database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'discord.messages.delete',
		{ ...input },
		'completed',
	);
	return { success: true as const };
};
