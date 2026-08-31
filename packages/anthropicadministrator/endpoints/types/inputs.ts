import { z } from 'zod';
import {
	AssignableOrganizationRoleSchema,
	OrganizationRoleSchema,
	paginationFields,
	WorkspaceRoleSchema,
} from './shared';

// ── organization ─────────────────────────────────────────────────────────────
export const GetOrganizationInputSchema = z.object({});

// ── users ────────────────────────────────────────────────────────────────────
export const ListUsersInputSchema = z.object({
	...paginationFields,
	email: z.string().optional().describe('Filter by user email'),
	roles: z
		.array(OrganizationRoleSchema)
		.optional()
		.describe('Filter to users whose role matches any supplied value'),
});

export const GetUserInputSchema = z.object({
	user_id: z.string().min(1).max(256),
});

export const UpdateUserInputSchema = z.object({
	user_id: z.string().min(1).max(256),
	role: AssignableOrganizationRoleSchema.describe('New organization role'),
});

export const RemoveUserInputSchema = z.object({
	user_id: z.string().min(1).max(256),
});

export const RemoveUserResponseSchema = z
	.object({ id: z.string(), type: z.literal('user_deleted') })
	.loose();

// ── invites ──────────────────────────────────────────────────────────────────
export const ListInvitesInputSchema = z.object({
	...paginationFields,
	email: z.string().optional(),
	roles: z.array(OrganizationRoleSchema).optional(),
	statuses: z.array(z.enum(['accepted', 'expired', 'pending'])).optional(),
});

export const CreateInviteInputSchema = z.object({
	email: z.string().min(1).describe('Email address to invite'),
	role: AssignableOrganizationRoleSchema,
	rbac_group_ids: z.array(z.string()).optional(),
});

export const GetInviteInputSchema = z.object({
	invite_id: z.string().min(1).max(256),
});

export const DeleteInviteInputSchema = z.object({
	invite_id: z.string().min(1).max(256),
});

export const DeleteInviteResponseSchema = z
	.object({ id: z.string(), type: z.literal('invite_deleted') })
	.loose();

// ── workspaces ───────────────────────────────────────────────────────────────
export const ListWorkspacesInputSchema = z.object({
	...paginationFields,
	include_archived: z
		.boolean()
		.optional()
		.describe('Include archived workspaces in the results'),
});

export const CreateWorkspaceInputSchema = z.object({
	name: z.string().min(1).describe('Workspace name'),
	data_residency: z.record(z.string(), z.unknown()).nullable().optional(),
	external_key_id: z.string().nullable().optional(),
	tags: z.record(z.string(), z.string()).nullable().optional(),
});

export const GetWorkspaceInputSchema = z.object({
	workspace_id: z.string().min(1).max(256),
});

export const UpdateWorkspaceInputSchema = z.object({
	workspace_id: z.string().min(1).max(256),
	name: z.string().optional(),
	data_residency: z.record(z.string(), z.unknown()).nullable().optional(),
	external_key_id: z.string().optional(),
	tags: z.record(z.string(), z.string()).nullable().optional(),
});

export const ArchiveWorkspaceInputSchema = z.object({
	workspace_id: z.string().min(1).max(256),
});

// ── workspace members ────────────────────────────────────────────────────────
export const ListWorkspaceMembersInputSchema = z.object({
	workspace_id: z.string().min(1).max(256),
	...paginationFields,
});

export const CreateWorkspaceMemberInputSchema = z.object({
	workspace_id: z.string().min(1).max(256),
	user_id: z.string().min(1).max(256),
	workspace_role: z.enum([
		'workspace_admin',
		'workspace_developer',
		'workspace_restricted_developer',
		'workspace_user',
	]),
});

export const GetWorkspaceMemberInputSchema = z.object({
	workspace_id: z.string().min(1).max(256),
	user_id: z.string().min(1).max(256),
});

export const UpdateWorkspaceMemberInputSchema = z.object({
	workspace_id: z.string().min(1).max(256),
	user_id: z.string().min(1).max(256),
	workspace_role: WorkspaceRoleSchema,
});

export const DeleteWorkspaceMemberInputSchema = z.object({
	workspace_id: z.string().min(1).max(256),
	user_id: z.string().min(1).max(256),
});

export const DeleteWorkspaceMemberResponseSchema = z
	.object({
		type: z.literal('workspace_member_deleted'),
		user_id: z.string(),
		workspace_id: z.string(),
	})
	.loose();

// ── api keys ─────────────────────────────────────────────────────────────────
export const ListApiKeysInputSchema = z.object({
	...paginationFields,
	created_by_user_id: z.string().optional(),
	status: z.enum(['active', 'archived', 'expired', 'inactive']).optional(),
	workspace_id: z.string().optional(),
});

export const GetApiKeyInputSchema = z.object({
	api_key_id: z.string().min(1).max(256),
});

export const UpdateApiKeyInputSchema = z.object({
	api_key_id: z.string().min(1).max(256),
	name: z.string().nullable().optional(),
	status: z.enum(['active', 'archived', 'inactive']).nullable().optional(),
});

// ── messages ─────────────────────────────────────────────────────────────────
export const CreateMessageInputSchema = z.object({
	model: z.string(),
	messages: z.array(
		z
			.object({
				role: z.string(),
				content: z.union([
					z.string(),
					z.array(
						z
							.object({
								type: z.string(),
								text: z.string().optional(),
								source: z.any().optional(),
								cache_control: z.object({ type: z.string() }).optional(),
							})
							.loose(),
					),
				]),
			})
			.loose(),
	),
	max_tokens: z.number(),
	system: z.any().optional(),
	metadata: z.any().optional(),
	stop_sequences: z.array(z.string()).optional(),
	stream: z.boolean().optional(),
	temperature: z.number().optional(),
	top_k: z.number().optional(),
	top_p: z.number().optional(),
});

// ── models ───────────────────────────────────────────────────────────────────
export const GetModelInputSchema = z.object({
	model_id: z.string().min(1),
});

export const ListModelsInputSchema = z.object({
	...paginationFields,
});
