import { z } from 'zod';

export const SentryIssue = z.object({
	id: z.string(),
	shortId: z.string(),
	title: z.string(),
	culprit: z.string().nullable().optional(),
	permalink: z.string().nullable().optional(),
	level: z.string().nullable().optional(),
	status: z.string(),
	platform: z.string().nullable().optional(),
	project: z.string().nullable().optional(),
	type: z.string().nullable().optional(),
	count: z.string().nullable().optional(),
	userCount: z.number().nullable().optional(),
	firstSeen: z.coerce.date().nullable().optional(),
	lastSeen: z.coerce.date().nullable().optional(),
	isPublic: z.boolean().nullable().optional(),
	isBookmarked: z.boolean().nullable().optional(),
	hasSeen: z.boolean().nullable().optional(),
	isSubscribed: z.boolean().nullable().optional(),
});

export const SentryProject = z.object({
	id: z.string(),
	slug: z.string(),
	name: z.string(),
	platform: z.string().nullable().optional(),
	dateCreated: z.coerce.date().nullable().optional(),
	isBookmarked: z.boolean().nullable().optional(),
	isMember: z.boolean().nullable().optional(),
	hasAccess: z.boolean().nullable().optional(),
	organization: z.string().nullable().optional(),
	team: z.string().nullable().optional(),
});

export const SentryOrganization = z.object({
	id: z.string(),
	slug: z.string(),
	name: z.string(),
	status: z.string().nullable().optional(),
	dateCreated: z.coerce.date().nullable().optional(),
	isEarlyAdopter: z.boolean().nullable().optional(),
	require2FA: z.boolean().nullable().optional(),
});

export const SentryTeam = z.object({
	id: z.string(),
	slug: z.string(),
	name: z.string(),
	dateCreated: z.coerce.date().nullable().optional(),
	isMember: z.boolean().nullable().optional(),
	memberCount: z.number().nullable().optional(),
	hasAccess: z.boolean().nullable().optional(),
	isPending: z.boolean().nullable().optional(),
});

export const SentryRelease = z.object({
	id: z.number(),
	version: z.string(),
	shortVersion: z.string().nullable().optional(),
	dateCreated: z.coerce.date().nullable().optional(),
	dateReleased: z.coerce.date().nullable().optional(),
	firstEvent: z.coerce.date().nullable().optional(),
	lastEvent: z.coerce.date().nullable().optional(),
	newGroups: z.number().nullable().optional(),
});

export const SentryEvent = z.object({
	eventID: z.string(),
	title: z.string().nullable().optional(),
	message: z.string().nullable().optional(),
	platform: z.string().nullable().optional(),
	dateCreated: z.coerce.date().nullable().optional(),
	dateReceived: z.coerce.date().nullable().optional(),
	type: z.string().nullable().optional(),
	groupID: z.string().nullable().optional(),
});

export const SentryComment = z.object({
	comment_id: z.string(),
	issue_id: z.string().nullable().optional(),
	project_slug: z.string().nullable().optional(),
	comment: z.string().nullable().optional(),
	timestamp: z.coerce.date().nullable().optional(),
});

export type SentryIssue = z.infer<typeof SentryIssue>;
export type SentryProject = z.infer<typeof SentryProject>;
export type SentryOrganization = z.infer<typeof SentryOrganization>;
export type SentryTeam = z.infer<typeof SentryTeam>;
export type SentryRelease = z.infer<typeof SentryRelease>;
export type SentryEvent = z.infer<typeof SentryEvent>;
export type SentryComment = z.infer<typeof SentryComment>;
