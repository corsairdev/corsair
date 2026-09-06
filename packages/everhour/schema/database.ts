import { z } from 'zod';

export const EverhourUser = z.object({
	id: z.string(),
	first_name: z.string().optional(),
	last_name: z.string().optional(),
	email: z.string().email().optional(),
	avatar: z.string().url().optional(),
	role: z.string().optional(),
});
export type EverhourUser = z.infer<typeof EverhourUser>;

export const EverhourProject = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().optional(),
	client_id: z.string().optional(),
	color: z.string().optional(),
	is_archived: z.boolean().optional(),
});
export type EverhourProject = z.infer<typeof EverhourProject>;

export const EverhourTask = z.object({
	id: z.string(),
	name: z.string(),
	project_id: z.string(),
	description: z.string().optional(),
	estimate: z.number().optional(),
	status: z.string().optional(),
	is_archived: z.boolean().optional(),
});
export type EverhourTask = z.infer<typeof EverhourTask>;

export const EverhourTimeEntry = z.object({
	id: z.string(),
	task_id: z.string(),
	user_id: z.string(),
	start_date: z.coerce.date(),
	end_date: z.coerce.date().nullable().optional(),
	duration: z.number().optional(), // in seconds
	description: z.string().optional(),
	is_billable: z.boolean().optional(),
});
export type EverhourTimeEntry = z.infer<typeof EverhourTimeEntry>;

export const EverhourClient = z.object({
	id: z.string(),
	name: z.string(),
	email: z.string().email().optional(),
	phone: z.string().optional(),
	address: z.string().optional(),
});
export type EverhourClient = z.infer<typeof EverhourClient>;

export const EverhourPlatform = z.object({
	id: z.string(),
	name: z.string(),
	type: z.string().optional(),
});
export type EverhourPlatform = z.infer<typeof EverhourPlatform>;
