import { z } from 'zod';

export const LinearIssue = z.object({
	id: z.string(),
	title: z.string(),
	description: z.string().optional(),
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
	assigneeId: z.string().optional(),
	creatorId: z.string(),
	projectId: z.string().optional(),
	cycleId: z.string().optional(),
	parentId: z.string().optional(),
	dueDate: z.string().optional(),
	startedAt: z.string().optional(),
	completedAt: z.string().optional(),
	canceledAt: z.string().optional(),
	triagedAt: z.string().optional(),
	snoozedUntilAt: z.string().optional(),
	createdAt: z.coerce.date().optional(),
	updatedAt: z.coerce.date().optional(),
	archivedAt: z.string().optional(),
});

export const LinearTeam = z.object({
	id: z.string(),
	name: z.string(),
	key: z.string(),
	description: z.string().optional(),
	icon: z.string().optional(),
	color: z.string().optional(),
	private: z.boolean(),
	createdAt: z.coerce.date().optional(),
	updatedAt: z.coerce.date().optional(),
	archivedAt: z.string().optional(),
});

export const LinearProject = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().optional(),
	icon: z.string().optional(),
	color: z.string().optional(),
	state: z.enum(['planned', 'started', 'paused', 'completed', 'canceled']),
	priority: z.number(),
	sortOrder: z.number(),
	startDate: z.string().optional(),
	targetDate: z.string().optional(),
	completedAt: z.string().optional(),
	canceledAt: z.string().optional(),
	leadId: z.string().optional(),
	createdAt: z.coerce.date().optional(),
	updatedAt: z.coerce.date().optional(),
	archivedAt: z.string().optional(),
});

export const LinearComment = z.object({
	id: z.string(),
	body: z.string(),
	issueId: z.string(),
	userId: z.string(),
	parentId: z.string().optional(),
	editedAt: z.string().optional(),
	createdAt: z.coerce.date().optional(),
	updatedAt: z.coerce.date().optional(),
	archivedAt: z.string().optional(),
});

export const LinearUser = z.object({
	id: z.string(),
	name: z.string(),
	email: z.string().optional(),
	displayName: z.string(),
	avatarUrl: z.string().optional(),
	active: z.boolean(),
	admin: z.boolean(),
	createdAt: z.coerce.date().optional(),
	updatedAt: z.coerce.date().optional(),
});

export type LinearIssue = z.infer<typeof LinearIssue>;
export type LinearTeam = z.infer<typeof LinearTeam>;
export type LinearProject = z.infer<typeof LinearProject>;
export type LinearComment = z.infer<typeof LinearComment>;
export type LinearUser = z.infer<typeof LinearUser>;
