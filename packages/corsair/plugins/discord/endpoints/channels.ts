import { logEventFromContext } from '../../utils/events';
import type { DiscordEndpoints } from '..';
import { makeDiscordRequest } from '../client';
import type { DiscordEndpointOutputs } from './types';

export const list: DiscordEndpoints['channelsList'] = async (ctx, input) => {
	const result = await makeDiscordRequest<
		DiscordEndpointOutputs['channelsList']
	>(`guilds/${input.guild_id}/channels`, ctx.key);

	if (ctx.db.channels) {
		try {
			for (const channel of result) {
				await ctx.db.channels.upsertByEntityId(channel.id, {
					...channel,
				});
			}
		} catch (error) {
			console.warn('Failed to save channels to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'discord.channels.list',
		{ guild_id: input.guild_id },
		'completed',
	);
	return result;
};
