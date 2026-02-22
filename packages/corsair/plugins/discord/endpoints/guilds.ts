import { logEventFromContext } from '../../utils/events';
import type { DiscordEndpoints } from '..';
import { makeDiscordRequest } from '../client';
import type { DiscordEndpointOutputs } from './types';

export const list: DiscordEndpoints['guildsList'] = async (ctx, input) => {
	const result = await makeDiscordRequest<DiscordEndpointOutputs['guildsList']>(
		'users/@me/guilds',
		ctx.key,
		{ query: input },
	);

	await logEventFromContext(ctx, 'discord.guilds.list', {}, 'completed');
	return result;
};

export const get: DiscordEndpoints['guildsGet'] = async (ctx, input) => {
	const { guild_id, ...query } = input;

	const result = await makeDiscordRequest<DiscordEndpointOutputs['guildsGet']>(
		`guilds/${guild_id}`,
		ctx.key,
		{ query },
	);

	if (ctx.db.guilds) {
		try {
			await ctx.db.guilds.upsertByEntityId(result.id, {
				...result,
				approximate_member_count: result.approximate_member_count,
				approximate_presence_count: result.approximate_presence_count,
			});
		} catch (error) {
			console.warn('Failed to save guild to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'discord.guilds.get',
		{ guild_id },
		'completed',
	);
	return result;
};
