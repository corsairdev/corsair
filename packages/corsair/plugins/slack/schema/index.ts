import {
	SlackChannel,
	SlackFile,
	SlackMessage,
	SlackUser,
	SlackUserGroup,
} from './database';

export const SlackSchema = {
	version: '1.1.0',
	entities: {
		messages: SlackMessage,
		channels: SlackChannel,
		users: SlackUser,
		files: SlackFile,
		userGroups: SlackUserGroup,
	},
} as const;
