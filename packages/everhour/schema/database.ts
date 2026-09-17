import { z } from 'zod';

const Id = z.union([z.string(), z.number()]);

export const EverhourUser = z
	.object({
		id: Id,
		name: z.string().optional(),
		first_name: z.string().optional(),
		last_name: z.string().optional(),
		email: z.string().optional(),
		avatarUrl: z.string().optional(),
		avatar: z.string().optional(),
		role: z.string().optional(),
		status: z.string().optional(),
		headline: z.string().nullable().optional(),
		team: z.unknown().optional(),
	})
	.passthrough();
export type EverhourUser = z.infer<typeof EverhourUser>;

export const EverhourProject = z
	.object({
		id: z.string(),
		name: z.string(),
		description: z.string().optional(),
		client: z.union([z.string(), z.number()]).nullable().optional(),
		client_id: z.string().optional(),
		color: z.string().optional(),
		is_archived: z.boolean().optional(),
		users: z.array(z.union([z.string(), z.number()])).optional(),
		type: z.string().optional(),
	})
	.passthrough();
export type EverhourProject = z.infer<typeof EverhourProject>;

export const EverhourTask = z
	.object({
		id: z.string(),
		name: z.string(),
		projects: z.array(z.string()).optional(),
		project_id: z.string().optional(),
		description: z.string().nullable().optional(),
		estimate: z.unknown().optional(),
		status: z.string().optional(),
		is_archived: z.boolean().optional(),
		section: z.number().nullable().optional(),
		labels: z.array(z.string()).optional(),
	})
	.passthrough();
export type EverhourTask = z.infer<typeof EverhourTask>;

export const EverhourTimeEntry = z
	.object({
		id: Id,
		time: z.number().optional(),
		user: Id.optional(),
		date: z.string().optional(),
		task: z.unknown().optional(),
		task_id: z.string().optional(),
		user_id: z.string().optional(),
		start_date: z.coerce.date().optional(),
		end_date: z.coerce.date().nullable().optional(),
		duration: z.number().optional(),
		description: z.string().optional(),
		comment: z.string().optional(),
		is_billable: z.boolean().optional(),
	})
	.passthrough();
export type EverhourTimeEntry = z.infer<typeof EverhourTimeEntry>;

export const EverhourClient = z
	.object({
		id: Id,
		name: z.string(),
		email: z.union([z.string(), z.array(z.string())]).optional(),
		phone: z.string().optional(),
		address: z.string().optional(),
		projects: z.array(z.string()).optional(),
		businessDetails: z.string().nullable().optional(),
		status: z.string().optional(),
	})
	.passthrough();
export type EverhourClient = z.infer<typeof EverhourClient>;

export const EverhourPlatform = z
	.object({
		id: Id,
		name: z.string().optional(),
		type: z.string().optional(),
	})
	.passthrough();
export type EverhourPlatform = z.infer<typeof EverhourPlatform>;

export const EverhourSection = z
	.object({
		id: Id,
		name: z.string(),
		project: z.string(),
		position: z.number(),
		status: z.string().optional(),
		collapsed: z.boolean().nullable().optional(),
	})
	.passthrough();
export type EverhourSection = z.infer<typeof EverhourSection>;

export const EverhourTimecard = z
	.object({
		user: Id,
		workTime: z.number(),
		clockIn: z.string().optional(),
		clockOut: z.string().optional(),
		breakTime: z.number().optional(),
		date: z.string().optional(),
		weekId: z.number().optional(),
		isLocked: z.boolean().optional(),
	})
	.passthrough();
export type EverhourTimecard = z.infer<typeof EverhourTimecard>;

export const EverhourWebhook = z
	.object({
		id: Id,
		targetUrl: z.string(),
		events: z.array(z.string()),
		project: z.string().nullable().optional(),
		active: z.boolean().optional(),
		createdAt: z.string(),
		lastUsedAt: z.string().optional(),
	})
	.passthrough();
export type EverhourWebhook = z.infer<typeof EverhourWebhook>;

export const EverhourExpense = z
	.object({
		id: Id,
		amount: z.number().optional(),
		date: z.string().optional(),
		project: z.string().optional(),
		category: z.union([z.string(), z.number()]).optional(),
		user: Id.optional(),
		billable: z.boolean().optional(),
		details: z.string().optional(),
	})
	.passthrough();
export type EverhourExpense = z.infer<typeof EverhourExpense>;

export const EverhourExpenseCategory = z
	.object({
		id: Id,
		name: z.string().optional(),
		color: z.string().optional(),
		unitBased: z.boolean().optional(),
		unitName: z.string().optional(),
		unitPrice: z.number().optional(),
	})
	.passthrough();
export type EverhourExpenseCategory = z.infer<typeof EverhourExpenseCategory>;

export const EverhourInvoice = z
	.object({
		id: Id,
		status: z.string().optional(),
		createdAt: z.string().optional(),
		publicId: z.string().optional(),
		totalAmount: z.number().optional(),
	})
	.passthrough();
export type EverhourInvoice = z.infer<typeof EverhourInvoice>;

export const EverhourTag = z
	.object({
		id: Id,
		name: z.string().optional(),
		color: z.string().optional(),
	})
	.passthrough();
export type EverhourTag = z.infer<typeof EverhourTag>;

export const EverhourTimesheetApproval = z
	.object({
		id: Id.optional(),
		user: Id.optional(),
		weekId: z.number().optional(),
		status: z.string().optional(),
	})
	.passthrough();
export type EverhourTimesheetApproval = z.infer<
	typeof EverhourTimesheetApproval
>;
