import { z } from 'zod';

const recordsSchema = z.object({ cursor: z.string().optional() }).passthrough();
const userSchema = z.record(z.string(), z.unknown());

export const GongUsersInputSchemas = {
	listUsers: z.object({
		cursor: z.string().optional(),
		includeAvatars: z.boolean().optional(),
	}),
	listMultipleUsers: z.object({
		cursor: z.string().optional(),
		filter: z.record(z.string(), z.unknown()),
	}),
	getUser: z.object({ id: z.string().regex(/^\d{1,20}$/) }),
	getUserHistory: z.object({ id: z.string().regex(/^\d{1,20}$/) }),
} as const;

export const GongUsersOutputSchemas = {
	listUsers: z
		.object({
			requestId: z.string(),
			users: z.array(userSchema),
			records: recordsSchema.optional(),
		})
		.passthrough(),
	listMultipleUsers: z
		.object({
			requestId: z.string(),
			users: z.array(userSchema),
			records: recordsSchema.optional(),
		})
		.passthrough(),
	getUser: z.object({ requestId: z.string(), user: userSchema }).passthrough(),
	getUserHistory: z
		.object({ requestId: z.string(), userSettingsHistory: z.array(userSchema) })
		.passthrough(),
} as const;

export type GongUsersInputs = {
	[K in keyof typeof GongUsersInputSchemas]: z.infer<
		(typeof GongUsersInputSchemas)[K]
	>;
};
export type GongUsersOutputs = {
	[K in keyof typeof GongUsersOutputSchemas]: z.infer<
		(typeof GongUsersOutputSchemas)[K]
	>;
};
