import {
	SlackbotChannel,
	SlackbotFile,
	SlackbotMessage,
	SlackbotReminder,
	SlackbotScheduledMessage,
	SlackbotUser,
} from './database';

export const SlackbotSchema = {
	version: '1.0.0',
	entities: {
		messages: SlackbotMessage,
		channels: SlackbotChannel,
		users: SlackbotUser,
		files: SlackbotFile,
		scheduled_messages: SlackbotScheduledMessage,
		reminders: SlackbotReminder,
	},
} as const;

export * from './database';
