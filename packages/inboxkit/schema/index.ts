import { InboxkitDomain, InboxkitMailbox, InboxkitWorkspace } from './database';

export const InboxkitSchema = {
	version: '1.0.0',
	entities: {
		workspaces: InboxkitWorkspace,
		domains: InboxkitDomain,
		mailboxes: InboxkitMailbox,
	},
} as const;

export type {
	InboxkitDomain,
	InboxkitMailbox,
	InboxkitWorkspace,
} from './database';
