import type { DiscordContext } from '../index';
import { makeDiscordRequest } from '../client';
import type { DiscordEndpointOutputs } from './types';
import type {
	GuildsBanAddInput,
	GuildsBanGetInput,
	GuildsBanRemoveInput,
	GuildsBansListInput,
} from './types';

export const guildsBanAdd = async (
	ctx: DiscordContext,
	input: GuildsBanAddInput,
) => {
	const { guild_id, user_id, ...body } = input;
	await makeDiscordRequest<void>(
		`guilds/${guild_id}/bans/${user_id}`,
		ctx.key,
		{ method: 'PUT', body },
	);
	return { success: true } as const;
};

export const guildsBanRemove = async (
	ctx: DiscordContext,
	input: GuildsBanRemoveInput,
) => {
	await makeDiscordRequest<void>(
		`guilds/${input.guild_id}/bans/${input.user_id}`,
		ctx.key,
		{ method: 'DELETE' },
	);
	return { success: true } as const;
};

export const guildsBansList = async (
	ctx: DiscordContext,
	input: GuildsBansListInput,
) => {
	const { guild_id, ...query } = input;
	return makeDiscordRequest<DiscordEndpointOutputs['guildsBansList']>(
		`guilds/${guild_id}/bans`,
		ctx.key,
		{ query },
	);
};

export const guildsBanGet = async (
	ctx: DiscordContext,
	input: GuildsBanGetInput,
) => {
	return makeDiscordRequest<DiscordEndpointOutputs['guildsBanGet']>(
		`guilds/${input.guild_id}/bans/${input.user_id}`,
		ctx.key,
	);
};
