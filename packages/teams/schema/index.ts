import {
	TeamsChannel,
	TeamsChat,
	TeamsMember,
	TeamsMessage,
	TeamsTeam,
} from './database';

export const TeamsSchema = {
	version: '1.0.0',
	entities: {
		teams: TeamsTeam,
		channels: TeamsChannel,
		messages: TeamsMessage,
		members: TeamsMember,
		chats: TeamsChat,
	},
} as const;
