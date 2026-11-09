import { z } from 'zod';
import { bool, num, str } from '../schema-helpers';

export const WorkspacesInputSchemas = {
	workspacesList: z.object({}).strict(),
	workspacesGet: z
		.object({
			uid: z.string().describe('Workspace unique identifier'),
		})
		.strict(),
	workspacesCreate: z
		.object({
			name: z.string().describe('Workspace name'),
			admins_only: z
				.boolean()
				.optional()
				.describe(
					'Optional. If true, only team members with role=admin are copied into the new workspace as initial members; member-role rows (people invited to specific previous workspaces) are skipped. Default false.',
				),
		})
		.strict(),
	workspacesUpdate: z
		.object({
			uid: z.string().describe('Workspace unique identifier'),
			name: z.string().describe('New workspace name'),
			webhook_url: z.string().describe('New webhook URL for notifications'),
		})
		.strict(),
	workspacesDelete: z
		.object({
			uid: z.string().describe('Workspace unique identifier to delete'),
		})
		.strict(),
	workspacesUpdateWebhook: z
		.object({
			uid: z.string().describe('Workspace unique identifier'),
			webhook_url: z.string().describe('New webhook URL for notifications'),
		})
		.strict(),
	workspacesInviteMember: z
		.object({
			email: z.string().describe('Email address of the person to invite'),
			name: z
				.string()
				.optional()
				.describe(
					'Display name for the member. Defaults to email prefix if omitted.',
				),
			role: z
				.enum(['admin', 'member'])
				.describe(
					'Role to assign. admin = full access including member management. member = standard access.',
				),
			workspace_uid: z
				.string()
				.describe(
					'UID of the workspace to invite the member to. Get this from the List Workspaces endpoint.',
				),
			resend: z
				.boolean()
				.optional()
				.describe(
					'Set to true to resend a pending invitation that was already sent. Default false.',
				),
		})
		.strict(),
} as const;

export const WorkspacesOutputSchemas = {
	workspacesList: z
		.object({
			error: bool,
			message: str,
			workspaces: z
				.array(
					z
						.object({
							uid: str,
							name: str,
							team: str,
							webhook_url: str,
							use_shared_billing: bool,
							domains: num,
							assigned_domains: num,
							assignable_domains: num,
							created_at: str,
							updated_at: str,
							workspace_type: str,
						})
						.loose(),
				)
				.nullish()
				.describe('List of workspaces'),
		})
		.loose(),
	workspacesGet: z
		.object({
			error: bool,
			message: str,
			workspace: z
				.object({
					uid: str.describe('Workspace unique identifier'),
					name: str.describe('Workspace name'),
					webhook_url: str.describe('Webhook URL for notifications'),
					use_shared_billing: bool.describe('Whether to use shared billing'),
					members: z
						.array(
							z
								.object({
									email: str,
									role: str,
									full_name: str,
									uid: str,
								})
								.loose(),
						)
						.nullish()
						.describe('Workspace members'),
					domains: num.describe('Total number of domains in workspace'),
					assigned_domains: num.describe(
						'Number of domains with assigned mailboxes',
					),
					assignable_domains: num.describe(
						'Number of domains available for assignment',
					),
					created_at: str.describe('Workspace creation timestamp'),
					updated_at: str.describe('Workspace last update timestamp'),
					workspace_type: str,
					createdAt: str,
					updatedAt: str,
				})
				.loose()
				.nullish(),
		})
		.loose(),
	workspacesCreate: z
		.object({
			error: bool,
			message: str,
			uid: str.describe('Created workspace unique identifier'),
		})
		.loose(),
	workspacesUpdate: z
		.object({
			error: bool,
			message: str,
		})
		.loose(),
	workspacesDelete: z
		.object({
			error: bool,
			message: str,
		})
		.loose(),
	workspacesUpdateWebhook: z
		.object({
			error: bool,
			message: str,
		})
		.loose(),
	workspacesInviteMember: z
		.object({
			error: bool,
			invitation_sent: bool.describe(
				'true if the invitation email was successfully delivered to the upstream provider.',
			),
			message: str.describe(
				'Human-readable status. On invitation_sent=true: "Workspace invitation sent successfully.".',
			),
		})
		.loose(),
} as const;
