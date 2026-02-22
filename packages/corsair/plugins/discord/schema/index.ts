import {
	DiscordChannel,
	DiscordGuild,
	DiscordMember,
	DiscordMessage,
} from './database';

export const DiscordSchema = {
	version: '1.0.0',
	entities: {
		messages: DiscordMessage,
		channels: DiscordChannel,
		guilds: DiscordGuild,
		members: DiscordMember,
	},
} as const;
