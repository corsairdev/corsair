import { z } from 'zod';

export const TodoistTask = z
	.object({
		id: z.string(),
		project_id: z.string().nullable().optional(),
		section_id: z.string().nullable().optional(),
		content: z.string(),
		description: z.string().optional(),
		is_completed: z.boolean().optional(),
		labels: z.array(z.string()).optional(),
		parent_id: z.string().nullable().optional(),
		order: z.number().optional(),
		priority: z.number().optional(),
		// due is loosely typed because the Todoist due object structure is not strictly defined
		due: z.record(z.unknown()).nullable().optional(),
		url: z.string().optional(),
		comment_count: z.number().optional(),
		created_at: z.string().optional(),
		creator_id: z.string().optional(),
		assignee_id: z.string().optional(),
		assigner_id: z.string().optional(),
	})
	.passthrough();

export const TodoistProject = z
	.object({
		id: z.string(),
		name: z.string(),
		color: z.string().optional(),
		parent_id: z.string().optional(),
		order: z.number().optional(),
		favorite: z.boolean().optional(),
		comment_count: z.number().optional(),
		is_shared: z.boolean().optional(),
		is_archived: z.boolean().optional(),
		is_favorite: z.boolean().optional(),
		view_style: z.string().optional(),
	})
	.passthrough();

export const TodoistSection = z
	.object({
		id: z.string(),
		project_id: z.string(),
		name: z.string(),
		order: z.number().optional(),
	})
	.passthrough();

export const TodoistComment = z
	.object({
		id: z.string(),
		task_id: z.string().optional(),
		project_id: z.string().optional(),
		content: z.string(),
		posted_at: z.string().optional(),
	})
	.passthrough();

export const TodoistLabel = z
	.object({
		id: z.string(),
		name: z.string(),
		color: z.string().optional(),
		order: z.number().optional(),
		favorite: z.boolean().optional(),
	})
	.passthrough();

export const TodoistReminder = z
	.object({
		id: z.string(),
		task_id: z.string().optional(),
		notify_uid: z.string().optional(),
		// due is loosely typed because the Todoist due object structure is not strictly defined
		due: z.record(z.unknown()).optional(),
	})
	.passthrough();

export type TodoistTask = z.infer<typeof TodoistTask>;
export type TodoistProject = z.infer<typeof TodoistProject>;
export type TodoistSection = z.infer<typeof TodoistSection>;
export type TodoistComment = z.infer<typeof TodoistComment>;
export type TodoistLabel = z.infer<typeof TodoistLabel>;
export type TodoistReminder = z.infer<typeof TodoistReminder>;
