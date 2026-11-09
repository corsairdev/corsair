import { z } from 'zod';

const reminderFilter = z.object({
	userId: z.string().min(1),
	workspaceId: z.string().optional(),
	types: z.array(z.enum(['FLOW', 'MANUAL'])),
	taskAction: z.array(z.enum(['CALL'])),
	status: z.array(z.enum(['OPEN', 'DONE', 'DISMISSED'])),
});
const priority = z
	.object({
		id: z.number().optional(),
		name: z.string().optional(),
		weight: z.number().optional(),
	})
	.passthrough();
const task = z
	.object({
		id: z.number().optional(),
		userId: z.number().optional(),
		created: z.string().optional(),
		updated: z.string().optional(),
		status: z.enum(['OPEN', 'DONE', 'DISMISSED']).optional(),
		type: z.enum(['FLOW', 'MANUAL']).optional(),
		actions: z.array(z.enum(['CALL'])).optional(),
		dueDate: z.string().optional(),
		title: z.string().optional(),
		priority: priority.optional(),
		hasSpecificTime: z.boolean().optional(),
	})
	.passthrough();

export const GongTasksInputSchemas = {
	listTasks: z.object({ filter: reminderFilter }),
	updateReminder: z.object({
		taskId: z.string().regex(/^\d{1,20}$/),
		userId: z.string().min(1),
		status: z.enum(['OPEN', 'DONE', 'DISMISSED']).optional(),
		dueDate: z.string().datetime({ offset: true }).optional(),
		priority: z.string().optional(),
		hasSpecificTime: z.boolean().optional(),
	}),
} as const;
export const GongTasksOutputSchemas = {
	listTasks: z
		.object({
			requestId: z.string(),
			tasks: z.array(task),
			crmType: z
				.enum(['SALESFORCE', 'HUBSPOT', 'MICROSOFT_DYNAMICS', 'GENERIC'])
				.optional(),
		})
		.passthrough(),
	updateReminder: z.object({ requestId: z.string() }).passthrough(),
} as const;
export type GongTasksInputs = {
	[K in keyof typeof GongTasksInputSchemas]: z.infer<
		(typeof GongTasksInputSchemas)[K]
	>;
};
export type GongTasksOutputs = {
	[K in keyof typeof GongTasksOutputSchemas]: z.infer<
		(typeof GongTasksOutputSchemas)[K]
	>;
};
