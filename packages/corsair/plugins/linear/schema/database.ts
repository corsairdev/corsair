import { z } from 'zod';

export const LinearIssue = z.object({
	id: z.string(),
	title: z.string(),
	description: z.string().nullable().optional(),
	priority: z.union([
		z.literal(0),
		z.literal(1),
		z.literal(2),
		z.literal(3),
		z.literal(4),
	]),
	estimate: z.number().nullable().optional(),
	sortOrder: z.number().optional(),
	number: z.number(),
	identifier: z.string(),
	url: z.string(),
	stateId: z.string(),
	teamId: z.string(),
	assigneeId: z.string().nullable().optional(),
	creatorId: z.string(),
	projectId: z.string().nullable().optional(),
	cycleId: z.string().nullable().optional(),
	parentId: z.string().nullable().optional(),
	dueDate: z.coerce.date().nullable().optional(),
	startedAt: z.coerce.date().nullable().optional(),
	completedAt: z.coerce.date().nullable().optional(),
	canceledAt: z.coerce.date().nullable().optional(),
	triagedAt: z.coerce.date().nullable().optional(),
	snoozedUntilAt: z.coerce.date().nullable().optional(),
	createdAt: z.coerce.date().nullable().optional(),
	updatedAt: z.coerce.date().nullable().optional(),
	archivedAt: z.coerce.date().nullable().optional(),
});

export const LinearTeam = z.object({
	id: z.string(),
	name: z.string(),
	key: z.string(),
	description: z.string().nullable().optional(),
	icon: z.string().nullable().optional(),
	color: z.string().nullable().optional(),
	private: z.boolean(),
	createdAt: z.coerce.date().nullable().optional(),
	updatedAt: z.coerce.date().nullable().optional(),
	archivedAt: z.coerce.date().nullable().optional(),
});

export const LinearProject = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().nullable().optional(),
	icon: z.string().nullable().optional(),
	color: z.string().nullable().optional(),
	state: z.enum([
		'planned',
		'started',
		'paused',
		'completed',
		'canceled',
		'backlog',
	]),
	priority: z.number(),
	sortOrder: z.number().optional(),
	startDate: z.coerce.date().nullable().optional(),
	targetDate: z.coerce.date().nullable().optional(),
	completedAt: z.coerce.date().nullable().optional(),
	canceledAt: z.coerce.date().nullable().optional(),
	leadId: z.string().nullable().optional(),
	createdAt: z.coerce.date().nullable().optional(),
	updatedAt: z.coerce.date().nullable().optional(),
	archivedAt: z.coerce.date().nullable().optional(),
});

export const LinearComment = z.object({
	id: z.string(),
	body: z.string(),
	issueId: z.string(),
	userId: z.string(),
	parentId: z.string().nullable().optional(),
	editedAt: z.coerce.date().nullable().optional(),
	createdAt: z.coerce.date().nullable().optional(),
	updatedAt: z.coerce.date().nullable().optional(),
	archivedAt: z.coerce.date().nullable().optional(),
});

export const LinearUser = z.object({
	id: z.string(),
	name: z.string(),
	email: z.string().optional(),
	displayName: z.string(),
	avatarUrl: z.string().optional(),
	active: z.boolean(),
	admin: z.boolean(),
	createdAt: z.coerce.date().nullable().optional(),
	updatedAt: z.coerce.date().nullable().optional(),
});

export type LinearIssue = z.infer<typeof LinearIssue>;
export type LinearTeam = z.infer<typeof LinearTeam>;
export type LinearProject = z.infer<typeof LinearProject>;
export type LinearComment = z.infer<typeof LinearComment>;
export type LinearUser = z.infer<typeof LinearUser>;
