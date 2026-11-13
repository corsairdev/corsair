import { z } from 'zod';

// Reject unsafe route segments before percent-encoding them.
export const pathSegment = z
	.string()
	.min(1)
	.refine(
		(value) => value !== '.' && value !== '..' && !/[\\/"']/.test(value),
		'Invalid path segment',
	);
const nonEmpty = z.string().min(1);
const status = z.object({ status: z.literal(1), request: z.string() });
const noInput = z.object({});
const flag = z.union([z.literal(0), z.literal(1)]);
const user = z.object({ user: nonEmpty, device: z.string().optional() });
const groupPath = z.object({ group: pathSegment });
const groupMember = groupPath.extend({
	user: nonEmpty,
	device: z.string().optional(),
});
const message = z
	.object({
		user: nonEmpty,
		message: nonEmpty,
		device: z.string().optional(),
		title: z.string().optional(),
		url: z.string().optional(),
		url_title: z.string().optional(),
		html: flag.optional(),
		monospace: flag.optional(),
		priority: z
			.union([
				z.literal(-2),
				z.literal(-1),
				z.literal(0),
				z.literal(1),
				z.literal(2),
			])
			.optional(),
		retry: z.number().int().min(30).optional(),
		expire: z.number().int().min(1).max(10800).optional(),
		callback: z.string().url().optional(),
		tags: z.string().optional(),
		timestamp: z.number().int().optional(),
		ttl: z.number().positive().optional(),
		sound: z.string().optional(),
		attachment_base64: z.string().optional(),
		attachment_type: z.string().optional(),
		encrypted: flag.optional(),
	})
	.refine(
		(v) =>
			v.priority !== 2 || (v.retry !== undefined && v.expire !== undefined),
		'Emergency messages require retry and expire',
	)
	.refine(
		(v) => !(v.html === 1 && v.monospace === 1),
		'HTML and monospace are mutually exclusive',
	)
	.refine(
		(v) => v.attachment_base64 === undefined || v.attachment_type !== undefined,
		'Base64 attachments require attachment_type',
	);
const glance = user
	.extend({
		title: z.string().max(100).optional(),
		text: z.string().max(100).optional(),
		subtext: z.string().max(100).optional(),
		count: z.union([z.number().int(), z.literal('')]).optional(),
		percent: z
			.union([z.number().int().min(0).max(100), z.literal('')])
			.optional(),
	})
	.refine(
		(v) =>
			[v.title, v.text, v.subtext, v.count, v.percent].some(
				(x) => x !== undefined,
			),
		'A glance field is required',
	);

export const PushoverEndpointInputSchemas = {
	messagesSend: message,
	usersValidate: user,
	soundsList: noInput,
	appsLimits: noInput,
	receiptsGet: z.object({ receipt: pathSegment }),
	receiptsCancel: z.object({ receipt: pathSegment }),
	receiptsCancelByTag: z.object({ tag: pathSegment }),
	groupsCreate: z.object({ name: nonEmpty }),
	groupsList: noInput,
	groupsGet: groupPath,
	groupsAddUser: groupMember.extend({ memo: z.string().max(200).optional() }),
	groupsRemoveUser: groupMember,
	groupsDisableUser: groupMember,
	groupsEnableUser: groupMember,
	groupsRename: groupPath.extend({ name: nonEmpty }),
	glancesUpdate: glance,
	subscriptionsMigrate: z.object({
		subscription: nonEmpty,
		user: nonEmpty,
		device_name: z.string().optional(),
		sound: z.string().optional(),
	}),
	licensesGet: noInput,
	licensesAssign: z
		.object({
			user: nonEmpty.optional(),
			email: z.string().email().optional(),
			os: z.enum(['Android', 'iOS', 'Desktop', '']).optional(),
		})
		.refine(
			(v) => v.user !== undefined || v.email !== undefined,
			'user or email is required',
		),
	teamsGet: noInput,
	teamsAddUser: z.object({
		email: z.string().email(),
		name: z.string().optional(),
		password: z.string().optional(),
		instant: z.literal('true').optional(),
		admin: z.literal('true').optional(),
		group: z.string().optional(),
	}),
	teamsRevokeInvitation: z.object({ email: z.string().email() }),
	teamsRemoveUser: z.object({ email: z.string().email() }),
} as const;
const groupUser = z.object({
	user: z.string(),
	device: z.string().nullable(),
	memo: z.string().nullable(),
	disabled: z.boolean(),
	name: z.string().optional(),
	email: z.string().optional(),
});
const teamDevice = z.object({
	name: z.string(),
	os: z.string(),
	os_version: z.string(),
	enabled: z.boolean(),
	administratively_disabled: z.boolean(),
});
const receiptResponse = status.extend({
	acknowledged: flag,
	acknowledged_at: z.number(),
	acknowledged_by: z.string().nullable().optional(),
	acknowledged_by_device: z.string().nullable().optional(),
	last_delivered_at: z.number(),
	expired: flag,
	expires_at: z.number(),
	called_back: flag,
	called_back_at: z.number(),
});
const credits = status.extend({ credits: z.number() });
export const PushoverEndpointOutputSchemas = {
	messagesSend: status.extend({ receipt: z.string().optional() }),
	usersValidate: status.extend({
		devices: z.array(z.string()).optional(),
		licenses: z.array(z.string()).optional(),
	}),
	soundsList: status.extend({ sounds: z.record(z.string(), z.string()) }),
	appsLimits: status.extend({
		limit: z.number(),
		remaining: z.number(),
		reset: z.number(),
	}),
	receiptsGet: receiptResponse,
	receiptsCancel: status,
	receiptsCancelByTag: status,
	groupsCreate: status.extend({ group: z.string() }),
	groupsList: status.extend({
		groups: z.array(z.object({ group: z.string(), name: z.string() })),
	}),
	groupsGet: status.extend({ name: z.string(), users: z.array(groupUser) }),
	groupsAddUser: status,
	groupsRemoveUser: status,
	groupsDisableUser: status,
	groupsEnableUser: status,
	groupsRename: status,
	glancesUpdate: status,
	subscriptionsMigrate: status.extend({ subscribed_user_key: z.string() }),
	licensesGet: credits,
	licensesAssign: credits,
	teamsGet: status.extend({
		name: z.string(),
		users: z.array(
			z.object({
				id: z.string(),
				name: z.string(),
				email: z.string(),
				administrator: z.boolean(),
				devices: z.array(teamDevice),
			}),
		),
	}),
	teamsAddUser: status,
	teamsRevokeInvitation: status,
	teamsRemoveUser: status,
} as const;
export type PushoverEndpointInputs = {
	[K in keyof typeof PushoverEndpointInputSchemas]: z.input<
		(typeof PushoverEndpointInputSchemas)[K]
	>;
};
export type PushoverEndpointOutputs = {
	[K in keyof typeof PushoverEndpointOutputSchemas]: z.output<
		(typeof PushoverEndpointOutputSchemas)[K]
	>;
};
