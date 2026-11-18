import { z } from 'zod';

// unknown: a permission profile has about 60 flags and nested access levels; passed through as Gong defines it.
const record = z.record(z.string(), z.unknown());
const response = z.object({ requestId: z.string() }).passthrough();
const callAccess = z.object({
	callId: z.string().min(1),
	userIds: z.array(z.string().min(1)).min(1),
});
// Gong answers with a `users` list per call, not the `userIds` it takes on input.
const callAccessDetails = z
	.object({
		callId: z.string(),
		users: z
			.array(z.object({ userId: z.string().optional() }).passthrough())
			.optional(),
	})
	.passthrough();
export const GongPermissionsInputSchemas = {
	getPermissionProfile: z.object({ profileId: z.string().min(1) }),
	updatePermissionProfile: z.object({
		profileId: z.string().min(1),
		body: record,
	}),
	createPermissionProfile: z.object({
		workspaceId: z.string().min(1),
		body: record,
	}),
	addUsersAccessToCalls: z.object({ callAccessList: z.array(callAccess) }),
	getUsersAccessToCalls: z.object({
		filter: z.object({ callIds: z.array(z.string().min(1)) }),
	}),
	deleteUsersAccessToCalls: z.object({ callAccessList: z.array(callAccess) }),
	listPermissionProfileUsers: z.object({ profileId: z.string().min(1) }),
	listPermissionProfile: z.object({ workspaceId: z.string().min(1) }),
} as const;
export const GongPermissionsOutputSchemas = {
	getPermissionProfile: response.extend({ profile: record }),
	updatePermissionProfile: response.extend({ profile: record }),
	createPermissionProfile: response.extend({ profile: record }),
	addUsersAccessToCalls: response,
	getUsersAccessToCalls: response.extend({
		callAccessList: z.array(callAccessDetails),
	}),
	deleteUsersAccessToCalls: response,
	listPermissionProfileUsers: response.extend({ users: z.array(record) }),
	listPermissionProfile: response.extend({ profiles: z.array(record) }),
} as const;
export type GongPermissionsInputs = {
	[K in keyof typeof GongPermissionsInputSchemas]: z.infer<
		(typeof GongPermissionsInputSchemas)[K]
	>;
};
export type GongPermissionsOutputs = {
	[K in keyof typeof GongPermissionsOutputSchemas]: z.infer<
		(typeof GongPermissionsOutputSchemas)[K]
	>;
};
