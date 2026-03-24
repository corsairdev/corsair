import { z } from 'zod';

export const JiraIssue = z.object({
	id: z.string(),
	key: z.string(),
	summary: z.string().optional(),
	description: z.string().optional(),
	status: z.string().optional(),
	assigneeAccountId: z.string().optional(),
	assigneeDisplayName: z.string().optional(),
	reporterAccountId: z.string().optional(),
	reporterDisplayName: z.string().optional(),
	priority: z.string().optional(),
	issueType: z.string().optional(),
	projectKey: z.string().optional(),
	projectId: z.string().optional(),
	labels: z.array(z.string()).optional(),
	created: z.string().optional(),
	updated: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export const JiraProject = z.object({
	id: z.string(),
	key: z.string(),
	name: z.string().optional(),
	description: z.string().optional(),
	projectTypeKey: z.string().optional(),
	leadAccountId: z.string().optional(),
	leadDisplayName: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export const JiraComment = z.object({
	id: z.string(),
	issueKey: z.string(),
	body: z.string().optional(),
	authorAccountId: z.string().optional(),
	authorDisplayName: z.string().optional(),
	created: z.string().optional(),
	updated: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export const JiraSprint = z.object({
	id: z.number(),
	name: z.string().optional(),
	state: z.string().optional(),
	goal: z.string().optional(),
	startDate: z.string().optional(),
	endDate: z.string().optional(),
	originBoardId: z.number().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export const JiraUser = z.object({
	accountId: z.string(),
	displayName: z.string().optional(),
	emailAddress: z.string().optional(),
	active: z.boolean().optional(),
	timeZone: z.string().optional(),
	locale: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export const JiraBoard = z.object({
	id: z.number(),
	name: z.string().optional(),
	type: z.string().optional(),
	projectId: z.number().optional(),
	projectKey: z.string().optional(),
	projectName: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export type JiraIssue = z.infer<typeof JiraIssue>;
export type JiraProject = z.infer<typeof JiraProject>;
export type JiraComment = z.infer<typeof JiraComment>;
export type JiraSprint = z.infer<typeof JiraSprint>;
export type JiraUser = z.infer<typeof JiraUser>;
export type JiraBoard = z.infer<typeof JiraBoard>;
