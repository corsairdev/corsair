import {
	SentryComment,
	SentryEvent,
	SentryIssue,
	SentryOrganization,
	SentryProject,
	SentryRelease,
	SentryTeam,
} from './database';

export const SentrySchema = {
	version: '1.0.0',
	entities: {
		issues: SentryIssue,
		projects: SentryProject,
		organizations: SentryOrganization,
		teams: SentryTeam,
		releases: SentryRelease,
		events: SentryEvent,
		comments: SentryComment,
	},
} as const;
