import { logEventFromContext } from 'corsair/core';
import { z } from 'zod';
import { makeRecallaiContextRequest } from '../client';
import type { RecallaiContext } from '../index';
import type { RecallaiJsonValue } from '../json';

const idSchema = z.string().uuid();
const loginModeSchema = z.enum(['always', 'only_if_required']);

const GoogleLoginSchema = z
	.object({
		id: idSchema,
		email: z.string().email(),
		is_active: z.boolean().optional(),
		sso_v2_workspace_domain: z.string(),
		sso_v2_private_key: z.string(),
		sso_v2_cert: z.string(),
		group_id: idSchema,
		created_at: z.string().datetime(),
		updated_at: z.string().datetime(),
	})
	.passthrough();

const GoogleLoginGroupSchema = z
	.object({
		id: idSchema,
		name: z.string().max(2000),
		// Open on output so a mode Recall adds later does not fail the call.
		login_mode: loginModeSchema.or(z.string()),
		created_at: z.string().datetime(),
		updated_at: z.string().datetime(),
		logins: z.array(GoogleLoginSchema),
	})
	.passthrough();

const paginated = <T extends z.ZodType>(item: T) =>
	z
		.object({
			next: z.string().nullable().optional(),
			previous: z.string().nullable().optional(),
			results: z.array(item),
		})
		.passthrough();

const GoogleLoginGroupsPageSchema = paginated(GoogleLoginGroupSchema);
const GoogleLoginsPageSchema = paginated(GoogleLoginSchema);

export const ListGoogleLoginGroupsInputSchema = z.object({
	cursor: z.string().optional(),
	name: z.string().optional(),
	name__contains: z.string().optional(),
	ordering: z.string().optional(),
});
export const CreateGoogleLoginGroupInputSchema = z.object({
	name: z.string().min(1).max(2000),
	login_mode: loginModeSchema,
});
export const GoogleLoginGroupIdInputSchema = z.object({ id: idSchema });
export const UpdateGoogleLoginGroupInputSchema = z.object({
	id: idSchema,
	name: z.string().min(1).max(2000),
	login_mode: loginModeSchema,
});
export const PartialUpdateGoogleLoginGroupInputSchema = z.object({
	id: idSchema,
	name: z.string().min(1).max(2000).optional(),
	login_mode: loginModeSchema.optional(),
});

export const ListGoogleLoginsInputSchema = z.object({
	cursor: z.string().optional(),
	email: z.string().optional(),
	group_id: idSchema.optional(),
	is_active: z.boolean().optional(),
	ordering: z.string().optional(),
	sso_v2_workspace_domain: z.string().optional(),
});
export const CreateGoogleLoginInputSchema = z.object({
	email: z.string().min(1).email(),
	is_active: z.boolean().optional(),
	sso_v2_workspace_domain: z.string().min(1),
	sso_v2_private_key: z.string().min(1),
	sso_v2_cert: z.string().min(1),
	group_id: idSchema,
});
export const GoogleLoginIdInputSchema = z.object({ id: idSchema });
export const UpdateGoogleLoginInputSchema = z.object({
	id: idSchema,
	email: z.string().min(1).email(),
	is_active: z.boolean().optional(),
	sso_v2_workspace_domain: z.string().min(1),
	sso_v2_private_key: z.string().min(1),
	sso_v2_cert: z.string().min(1),
	group_id: idSchema,
});
export const PartialUpdateGoogleLoginInputSchema = z.object({
	id: idSchema,
	email: z.string().min(1).email().optional(),
	is_active: z.boolean().optional(),
	sso_v2_workspace_domain: z.string().min(1).optional(),
	sso_v2_private_key: z.string().min(1).optional(),
	sso_v2_cert: z.string().min(1).optional(),
	group_id: idSchema.optional(),
});

export const GoogleLoginInputSchemas = {
	listGoogleLoginGroups: ListGoogleLoginGroupsInputSchema,
	createGoogleLoginGroup: CreateGoogleLoginGroupInputSchema,
	retrieveGoogleLoginGroup: GoogleLoginGroupIdInputSchema,
	updateGoogleLoginGroup: UpdateGoogleLoginGroupInputSchema,
	partialUpdateGoogleLoginGroup: PartialUpdateGoogleLoginGroupInputSchema,
	deleteGoogleLoginGroup: GoogleLoginGroupIdInputSchema,
	listGoogleLogins: ListGoogleLoginsInputSchema,
	createGoogleLogin: CreateGoogleLoginInputSchema,
	retrieveGoogleLogin: GoogleLoginIdInputSchema,
	updateGoogleLogin: UpdateGoogleLoginInputSchema,
	partialUpdateGoogleLogin: PartialUpdateGoogleLoginInputSchema,
	deleteGoogleLogin: GoogleLoginIdInputSchema,
} as const;

export const GoogleLoginOutputSchemas = {
	listGoogleLoginGroups: GoogleLoginGroupsPageSchema,
	createGoogleLoginGroup: GoogleLoginGroupSchema,
	retrieveGoogleLoginGroup: GoogleLoginGroupSchema,
	updateGoogleLoginGroup: GoogleLoginGroupSchema,
	partialUpdateGoogleLoginGroup: GoogleLoginGroupSchema,
	deleteGoogleLoginGroup: z.undefined(),
	listGoogleLogins: GoogleLoginsPageSchema,
	createGoogleLogin: GoogleLoginSchema,
	retrieveGoogleLogin: GoogleLoginSchema,
	updateGoogleLogin: GoogleLoginSchema,
	partialUpdateGoogleLogin: GoogleLoginSchema,
	deleteGoogleLogin: z.undefined(),
} as const;

export type GoogleLoginEndpointInputs = {
	[K in keyof typeof GoogleLoginInputSchemas]: z.infer<
		(typeof GoogleLoginInputSchemas)[K]
	>;
};
export type GoogleLoginEndpointOutputs = {
	[K in keyof typeof GoogleLoginOutputSchemas]: z.infer<
		(typeof GoogleLoginOutputSchemas)[K]
	>;
};

export const googleLoginSchemas = {
	listGoogleLoginGroups: {
		input: GoogleLoginInputSchemas.listGoogleLoginGroups,
		output: GoogleLoginOutputSchemas.listGoogleLoginGroups,
	},
	createGoogleLoginGroup: {
		input: GoogleLoginInputSchemas.createGoogleLoginGroup,
		output: GoogleLoginOutputSchemas.createGoogleLoginGroup,
	},
	retrieveGoogleLoginGroup: {
		input: GoogleLoginInputSchemas.retrieveGoogleLoginGroup,
		output: GoogleLoginOutputSchemas.retrieveGoogleLoginGroup,
	},
	updateGoogleLoginGroup: {
		input: GoogleLoginInputSchemas.updateGoogleLoginGroup,
		output: GoogleLoginOutputSchemas.updateGoogleLoginGroup,
	},
	partialUpdateGoogleLoginGroup: {
		input: GoogleLoginInputSchemas.partialUpdateGoogleLoginGroup,
		output: GoogleLoginOutputSchemas.partialUpdateGoogleLoginGroup,
	},
	deleteGoogleLoginGroup: {
		input: GoogleLoginInputSchemas.deleteGoogleLoginGroup,
		output: GoogleLoginOutputSchemas.deleteGoogleLoginGroup,
	},
	listGoogleLogins: {
		input: GoogleLoginInputSchemas.listGoogleLogins,
		output: GoogleLoginOutputSchemas.listGoogleLogins,
	},
	createGoogleLogin: {
		input: GoogleLoginInputSchemas.createGoogleLogin,
		output: GoogleLoginOutputSchemas.createGoogleLogin,
	},
	retrieveGoogleLogin: {
		input: GoogleLoginInputSchemas.retrieveGoogleLogin,
		output: GoogleLoginOutputSchemas.retrieveGoogleLogin,
	},
	updateGoogleLogin: {
		input: GoogleLoginInputSchemas.updateGoogleLogin,
		output: GoogleLoginOutputSchemas.updateGoogleLogin,
	},
	partialUpdateGoogleLogin: {
		input: GoogleLoginInputSchemas.partialUpdateGoogleLogin,
		output: GoogleLoginOutputSchemas.partialUpdateGoogleLogin,
	},
	deleteGoogleLogin: {
		input: GoogleLoginInputSchemas.deleteGoogleLogin,
		output: GoogleLoginOutputSchemas.deleteGoogleLogin,
	},
} as const;

const googleLoginGroupPath = (id: string) =>
	`/api/v2/google-login-groups/${encodeURIComponent(id)}/`;
const googleLoginPath = (id: string) =>
	`/api/v2/google-logins/${encodeURIComponent(id)}/`;

const send = async <T>(
	ctx: RecallaiContext,
	path: string,
	operation: string,
	options: NonNullable<Parameters<typeof makeRecallaiContextRequest>[2]> = {},
	outputSchema: z.ZodType<T>,
): Promise<T> => {
	const response = await makeRecallaiContextRequest<RecallaiJsonValue>(
		ctx,
		path,
		{
			...options,
			headers: { ...options.headers, Authorization: `Token ${ctx.key}` },
		},
	);
	const parsed = outputSchema.parse(response);
	await logEventFromContext(
		ctx,
		`recallai.${String(operation)}`,
		{},
		'completed',
	);
	return parsed;
};

export const listGoogleLoginGroups = async (
	ctx: RecallaiContext,
	input: GoogleLoginEndpointInputs['listGoogleLoginGroups'],
) => {
	const parsed = ListGoogleLoginGroupsInputSchema.parse(input);
	return send(
		ctx,
		'/api/v2/google-login-groups/',
		'googleLoginGroups.list',
		{ method: 'GET', query: parsed },
		GoogleLoginOutputSchemas.listGoogleLoginGroups,
	);
};

export const createGoogleLoginGroup = async (
	ctx: RecallaiContext,
	input: GoogleLoginEndpointInputs['createGoogleLoginGroup'],
) => {
	const parsed = CreateGoogleLoginGroupInputSchema.parse(input);
	return send(
		ctx,
		'/api/v2/google-login-groups/',
		'googleLoginGroups.create',
		{ method: 'POST', body: parsed },
		GoogleLoginOutputSchemas.createGoogleLoginGroup,
	);
};

export const retrieveGoogleLoginGroup = async (
	ctx: RecallaiContext,
	input: GoogleLoginEndpointInputs['retrieveGoogleLoginGroup'],
) => {
	const parsed = GoogleLoginGroupIdInputSchema.parse(input);
	return send(
		ctx,
		googleLoginGroupPath(parsed.id),
		'googleLoginGroups.retrieve',
		{ method: 'GET' },
		GoogleLoginOutputSchemas.retrieveGoogleLoginGroup,
	);
};

export const updateGoogleLoginGroup = async (
	ctx: RecallaiContext,
	input: GoogleLoginEndpointInputs['updateGoogleLoginGroup'],
) => {
	const { id, ...body } = UpdateGoogleLoginGroupInputSchema.parse(input);
	return send(
		ctx,
		googleLoginGroupPath(id),
		'googleLoginGroups.update',
		{ method: 'PUT', body },
		GoogleLoginOutputSchemas.updateGoogleLoginGroup,
	);
};

export const partialUpdateGoogleLoginGroup = async (
	ctx: RecallaiContext,
	input: GoogleLoginEndpointInputs['partialUpdateGoogleLoginGroup'],
) => {
	const { id, ...body } = PartialUpdateGoogleLoginGroupInputSchema.parse(input);
	return send(
		ctx,
		googleLoginGroupPath(id),
		'googleLoginGroups.partialUpdate',
		{ method: 'PATCH', body },
		GoogleLoginOutputSchemas.partialUpdateGoogleLoginGroup,
	);
};

export const deleteGoogleLoginGroup = async (
	ctx: RecallaiContext,
	input: GoogleLoginEndpointInputs['deleteGoogleLoginGroup'],
) => {
	const parsed = GoogleLoginGroupIdInputSchema.parse(input);
	await send(
		ctx,
		googleLoginGroupPath(parsed.id),
		'googleLoginGroups.delete',
		{ method: 'DELETE' },
		GoogleLoginOutputSchemas.deleteGoogleLoginGroup,
	);
};

export const listGoogleLogins = async (
	ctx: RecallaiContext,
	input: GoogleLoginEndpointInputs['listGoogleLogins'],
) => {
	const parsed = ListGoogleLoginsInputSchema.parse(input);
	return send(
		ctx,
		'/api/v2/google-logins/',
		'googleLogins.list',
		{ method: 'GET', query: parsed },
		GoogleLoginOutputSchemas.listGoogleLogins,
	);
};

export const createGoogleLogin = async (
	ctx: RecallaiContext,
	input: GoogleLoginEndpointInputs['createGoogleLogin'],
) => {
	const parsed = CreateGoogleLoginInputSchema.parse(input);
	return send(
		ctx,
		'/api/v2/google-logins/',
		'googleLogins.create',
		{ method: 'POST', body: parsed },
		GoogleLoginOutputSchemas.createGoogleLogin,
	);
};

export const retrieveGoogleLogin = async (
	ctx: RecallaiContext,
	input: GoogleLoginEndpointInputs['retrieveGoogleLogin'],
) => {
	const parsed = GoogleLoginIdInputSchema.parse(input);
	return send(
		ctx,
		googleLoginPath(parsed.id),
		'googleLogins.retrieve',
		{ method: 'GET' },
		GoogleLoginOutputSchemas.retrieveGoogleLogin,
	);
};

export const updateGoogleLogin = async (
	ctx: RecallaiContext,
	input: GoogleLoginEndpointInputs['updateGoogleLogin'],
) => {
	const { id, ...body } = UpdateGoogleLoginInputSchema.parse(input);
	return send(
		ctx,
		googleLoginPath(id),
		'googleLogins.update',
		{ method: 'PUT', body },
		GoogleLoginOutputSchemas.updateGoogleLogin,
	);
};

export const partialUpdateGoogleLogin = async (
	ctx: RecallaiContext,
	input: GoogleLoginEndpointInputs['partialUpdateGoogleLogin'],
) => {
	const { id, ...body } = PartialUpdateGoogleLoginInputSchema.parse(input);
	return send(
		ctx,
		googleLoginPath(id),
		'googleLogins.partialUpdate',
		{ method: 'PATCH', body },
		GoogleLoginOutputSchemas.partialUpdateGoogleLogin,
	);
};

export const deleteGoogleLogin = async (
	ctx: RecallaiContext,
	input: GoogleLoginEndpointInputs['deleteGoogleLogin'],
) => {
	const parsed = GoogleLoginIdInputSchema.parse(input);
	await send(
		ctx,
		googleLoginPath(parsed.id),
		'googleLogins.delete',
		{ method: 'DELETE' },
		GoogleLoginOutputSchemas.deleteGoogleLogin,
	);
};
