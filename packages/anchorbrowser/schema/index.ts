import {
	AnchorBrowserProfile,
	AnchorBrowserSession,
	AnchorBrowserTask,
} from './database';

export const AnchorBrowserSchema = {
	version: '1.0.0',
	entities: {
		sessions: AnchorBrowserSession,
		tasks: AnchorBrowserTask,
		profiles: AnchorBrowserProfile,
	},
} as const;
