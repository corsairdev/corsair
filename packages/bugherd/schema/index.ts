import {
	BugherdAttachment,
	BugherdColumn,
	BugherdComment,
	BugherdOrganization,
	BugherdProject,
	BugherdTask,
	BugherdUser,
	BugherdWebhook,
} from './database';

export const BugherdSchema = {
	version: '1.0.0',
	entities: {
		projects: BugherdProject,
		tasks: BugherdTask,
		columns: BugherdColumn,
		attachments: BugherdAttachment,
		comments: BugherdComment,
		webhooks: BugherdWebhook,
		users: BugherdUser,
		organization: BugherdOrganization,
	},
} as const;
