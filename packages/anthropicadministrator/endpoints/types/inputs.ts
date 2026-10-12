import { z } from 'zod';
import {
	AssignableOrganizationRoleSchema,
	DataResidencyCreateSchema,
	DataResidencyUpdateSchema,
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
	data_residency: DataResidencyCreateSchema.nullable().optional(),
	external_key_id: z.string().nullable().optional(),
	tags: z.record(z.string(), z.string()).nullable().optional(),
});

export const GetWorkspaceInputSchema = z.object({
	workspace_id: z.string().min(1).max(256),
});

export const UpdateWorkspaceInputSchema = z.object({
	workspace_id: z.string().min(1).max(256),
	name: z.string().optional(),
	data_residency: DataResidencyUpdateSchema.nullable().optional(),
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
export const CacheControlSchema = z
	.object({
		type: z.literal('ephemeral'),
		ttl: z
			.enum(['5m', '1h'])
			.optional()
			.describe('Cache lifetime; defaults to 5m'),
	})
	.describe('Marks a prompt-caching breakpoint');

const TextBlockParamSchema = z.object({
	type: z.literal('text'),
	text: z.string().min(1),
	cache_control: CacheControlSchema.nullable().optional(),
});

const ImageBlockParamSchema = z.object({
	type: z.literal('image'),
	source: z.discriminatedUnion('type', [
		z.object({
			type: z.literal('base64'),
			media_type: z.enum([
				'image/jpeg',
				'image/png',
				'image/gif',
				'image/webp',
			]),
			data: z.string(),
		}),
		z.object({ type: z.literal('url'), url: z.string() }),
	]),
	cache_control: CacheControlSchema.nullable().optional(),
});

const DocumentBlockParamSchema = z.object({
	type: z.literal('document'),
	source: z.discriminatedUnion('type', [
		z.object({
			type: z.literal('base64'),
			media_type: z.literal('application/pdf'),
			data: z.string(),
		}),
		z.object({
			type: z.literal('text'),
			media_type: z.literal('text/plain'),
			data: z.string(),
		}),
		z.object({ type: z.literal('url'), url: z.string() }),
	]),
	title: z.string().nullable().optional(),
	context: z.string().nullable().optional(),
	cache_control: CacheControlSchema.nullable().optional(),
});

const ContentBlockParamSchema = z.discriminatedUnion('type', [
	TextBlockParamSchema,
	ImageBlockParamSchema,
	DocumentBlockParamSchema,
]);

export const CreateMessageInputSchema = z.object({
	model: z.string().min(1).describe('Model ID, e.g. from models.listModels'),
	max_tokens: z
		.number()
		.int()
		.min(0)
		.describe(
			'Maximum number of tokens to generate; 0 only warms the prompt cache',
		),
	messages: z
		.array(
			z.object({
				role: z.enum(['user', 'assistant']),
				content: z.union([z.string(), z.array(ContentBlockParamSchema)]),
			}),
		)
		.min(1)
		.describe('Conversation turns, alternating user and assistant'),
	system: z
		.union([z.string(), z.array(TextBlockParamSchema)])
		.optional()
		.describe('System prompt; use text blocks to attach cache_control'),
	cache_control: CacheControlSchema.nullable()
		.optional()
		.describe('Automatic prompt caching for the whole request'),
	metadata: z.object({ user_id: z.string().nullable().optional() }).optional(),
	stop_sequences: z.array(z.string()).optional(),
	stream: z
		.boolean()
		.optional()
		.refine((value) => value !== true, {
			message: 'Streaming is not supported',
		}),
	temperature: z.number().min(0).max(1).optional(),
	top_k: z.number().int().min(0).optional(),
	top_p: z.number().min(0).max(1).optional(),
});

export const CreateCachedMessageInputSchema = CreateMessageInputSchema.omit({
	cache_control: true,
}).extend({
	ttl: z
		.enum(['5m', '1h'])
		.optional()
		.describe('Cache lifetime for the prompt prefix; defaults to 5m'),
});

export type CacheControl = z.infer<typeof CacheControlSchema>;
export type CreateMessageInput = z.infer<typeof CreateMessageInputSchema>;

// ── models ───────────────────────────────────────────────────────────────────
export const GetModelInputSchema = z.object({
	model_id: z.string().min(1).describe('Model identifier or alias'),
});

export const ListModelsInputSchema = z.object({
	...paginationFields,
	lifecycle: z
		.array(z.enum(['active', 'deprecated', 'retired']))
		.max(3)
		.optional()
		.describe('Lifecycle stages to include; defaults to active and deprecated'),
});
