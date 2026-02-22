import { logEventFromContext } from '../../utils/events';
import type { DiscordEndpoints } from '..';
import { makeDiscordRequest } from '../client';
import type { DiscordEndpointOutputs } from './types';

export const list: DiscordEndpoints['membersList'] = async (ctx, input) => {
	const { guild_id, ...query } = input;

	const result = await makeDiscordRequest<
		DiscordEndpointOutputs['membersList']
	>(`guilds/${guild_id}/members`, ctx.key, { query });

	if (ctx.db.members) {
		try {
			for (const member of result) {
				const userId = member.user?.id;
				if (userId) {
					await ctx.db.members.upsertByEntityId(userId, {
						id: userId,
						guild_id,
						nick: member.nick,
						roles: member.roles,
						joined_at: member.joined_at,
						premium_since: member.premium_since,
						deaf: member.deaf,
						mute: member.mute,
						pending: member.pending,
					});
				}
			}
		} catch (error) {
			console.warn('Failed to save members to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'discord.members.list',
		{ guild_id },
		'completed',
	);
	return result;
};

export const get: DiscordEndpoints['membersGet'] = async (ctx, input) => {
	const { guild_id, user_id } = input;

	const result = await makeDiscordRequest<DiscordEndpointOutputs['membersGet']>(
		`guilds/${guild_id}/members/${user_id}`,
		ctx.key,
	);

	if (ctx.db.members) {
		try {
			await ctx.db.members.upsertByEntityId(user_id, {
				id: user_id,
				guild_id,
				nick: result.nick,
				roles: result.roles,
				joined_at: result.joined_at,
				premium_since: result.premium_since,
				deaf: result.deaf,
				mute: result.mute,
				pending: result.pending,
			});
		} catch (error) {
			console.warn('Failed to save member to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'discord.members.get',
		{ guild_id, user_id },
		'completed',
	);
	return result;
};
