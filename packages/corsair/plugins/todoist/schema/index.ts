import {
	TodoistComment,
	TodoistLabel,
	TodoistProject,
	TodoistReminder,
	TodoistSection,
	TodoistTask,
} from './database';

export const TodoistSchema = {
	version: '1.0.0',
	entities: {
		tasks: TodoistTask,
		projects: TodoistProject,
		sections: TodoistSection,
		comments: TodoistComment,
		labels: TodoistLabel,
		reminders: TodoistReminder,
	},
} as const;
