import { z } from 'zod';

export const TodoistTask = z.object({
	id: z.string(),
	project_id: z.string().nullable().optional(),
	section_id: z.string().nullable().optional(),
	content: z.string().optional(),
	description: z.string().optional(),
	is_completed: z.boolean().optional(),
	created_at: z.coerce.date().nullable().optional(),
	assignee_id: z.string().nullable().optional(),
	priority: z.number().optional(),
});

export const TodoistProject = z.object({
	id: z.string(),
	name: z.string().optional(),
	color: z.string().optional(),
	parent_id: z.string().nullable().optional(),
	order: z.number().optional(),
	favorite: z.boolean().optional(),
});

export const TodoistSection = z.object({
	id: z.string(),
	project_id: z.string(),
	name: z.string().optional(),
	order: z.number().optional(),
});

export const TodoistComment = z.object({
	id: z.string(),
	task_id: z.string().nullable().optional(),
	project_id: z.string().nullable().optional(),
	content: z.string().optional(),
	posted_at: z.coerce.date().nullable().optional(),
});

export const TodoistLabel = z.object({
	id: z.string(),
	name: z.string().optional(),
	color: z.string().optional(),
	order: z.number().optional(),
	favorite: z.boolean().optional(),
});

export const TodoistReminder = z.object({
	id: z.string(),
	task_id: z.string().nullable().optional(),
	notify_uid: z.string().nullable().optional(),
	due_at: z.coerce.date().nullable().optional(),
});

export type TodoistTask = z.infer<typeof TodoistTask>;
export type TodoistProject = z.infer<typeof TodoistProject>;
export type TodoistSection = z.infer<typeof TodoistSection>;
export type TodoistComment = z.infer<typeof TodoistComment>;
export type TodoistLabel = z.infer<typeof TodoistLabel>;
export type TodoistReminder = z.infer<typeof TodoistReminder>;
