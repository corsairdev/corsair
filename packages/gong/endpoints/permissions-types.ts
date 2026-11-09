import { z } from 'zod';

const record = z.record(z.string(), z.unknown());
const response = z.object({ requestId: z.string() }).passthrough();
const callAccess = z.object({
	callId: z.string().min(1),
	userIds: z.array(z.string().min(1)).min(1),
});
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
		callAccessList: z.array(callAccess),
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
