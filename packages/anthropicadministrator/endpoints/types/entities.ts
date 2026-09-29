import { z } from 'zod';
import { OrganizationRoleSchema, WorkspaceRoleSchema } from './shared';

export const OrganizationSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		type: z.literal('organization'),
	})
	.loose();

export const UserSchema = z
	.object({
		id: z.string(),
		added_at: z.string(),
		email: z.string(),
		name: z.string(),
		role: OrganizationRoleSchema,
		type: z.literal('user'),
	})
	.loose();

export const InviteSchema = z
	.object({
		id: z.string(),
		accepted_at: z.string().nullable(),
		email: z.string(),
		expires_at: z.string(),
		invited_at: z.string(),
		rbac_group_ids: z.array(z.string()).optional(),
		role: OrganizationRoleSchema,
		status: z.enum(['accepted', 'deleted', 'expired', 'pending']),
		type: z.literal('invite'),
	})
	.loose();

export const WorkspaceSchema = z
	.object({
		id: z.string(),
		archived_at: z.string().nullable(),
		compartment_id: z.string().optional(),
		created_at: z.string(),
		data_residency: z.record(z.string(), z.unknown()).nullable().optional(),
		display_color: z.string().optional(),
		external_key_id: z.string().nullable().optional(),
		name: z.string(),
		tags: z.record(z.string(), z.string()).nullable().optional(),
		type: z.literal('workspace'),
	})
	.loose();

export const WorkspaceMemberSchema = z
	.object({
		type: z.literal('workspace_member'),
		user_id: z.string(),
		workspace_id: z.string(),
		workspace_role: WorkspaceRoleSchema,
	})
	.loose();

const ActorRefSchema = z
	.object({ id: z.string(), type: z.string() })
	.loose()
	.nullable();

export const ApiKeySchema = z
	.object({
		id: z.string(),
		created_at: z.string(),
		created_by: ActorRefSchema.optional(),
		expires_at: z.string().nullable().optional(),
		name: z.string(),
		partial_key_hint: z.string().nullable().optional(),
		principal: ActorRefSchema.optional(),
		status: z.enum(['active', 'archived', 'expired', 'inactive']),
		type: z.literal('api_key'),
		workspace_id: z.string().nullable().optional(),
	})
	.loose();

export const MessageSchema = z
	.object({
		id: z.string(),
		type: z.literal('message'),
		role: z.string(),
		content: z.array(z.any()),
		model: z.string(),
		stop_reason: z.string().nullable().optional(),
		stop_sequence: z.string().nullable().optional(),
		usage: z.object({
			input_tokens: z.number(),
			output_tokens: z.number(),
			cache_creation_input_tokens: z.number().optional(),
			cache_read_input_tokens: z.number().optional(),
		}),
	})
	.loose();

export const ModelSchema = z
	.object({
		type: z.literal('model'),
		id: z.string(),
		display_name: z.string(),
		created_at: z.string(),
	})
	.loose();
