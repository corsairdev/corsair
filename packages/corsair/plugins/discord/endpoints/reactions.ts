import { logEventFromContext } from '../../utils/events';
import type { DiscordEndpoints } from '..';
import { makeDiscordRequest } from '../client';
import type { DiscordEndpointOutputs } from './types';

export const add: DiscordEndpoints['reactionsAdd'] = async (ctx, input) => {
	const { channel_id, message_id, emoji } = input;
	const encodedEmoji = encodeURIComponent(emoji);

	await makeDiscordRequest<void>(
		`channels/${channel_id}/messages/${message_id}/reactions/${encodedEmoji}/@me`,
		ctx.key,
		{ method: 'PUT' },
	);

	await logEventFromContext(
		ctx,
		'discord.reactions.add',
		{ channel_id, message_id, emoji },
		'completed',
	);
	return { success: true as const };
};

export const remove: DiscordEndpoints['reactionsRemove'] = async (
	ctx,
	input,
) => {
	const { channel_id, message_id, emoji } = input;
	const encodedEmoji = encodeURIComponent(emoji);

	await makeDiscordRequest<void>(
		`channels/${channel_id}/messages/${message_id}/reactions/${encodedEmoji}/@me`,
		ctx.key,
		{ method: 'DELETE' },
	);

	await logEventFromContext(
		ctx,
		'discord.reactions.remove',
		{ channel_id, message_id, emoji },
		'completed',
	);
	return { success: true as const };
};

export const list: DiscordEndpoints['reactionsList'] = async (ctx, input) => {
	const { channel_id, message_id, emoji, ...query } = input;
	const encodedEmoji = encodeURIComponent(emoji);

	const result = await makeDiscordRequest<
		DiscordEndpointOutputs['reactionsList']
	>(
		`channels/${channel_id}/messages/${message_id}/reactions/${encodedEmoji}`,
		ctx.key,
		{ query },
	);

	await logEventFromContext(
		ctx,
		'discord.reactions.list',
		{ channel_id, message_id, emoji },
		'completed',
	);
	return result;
};
