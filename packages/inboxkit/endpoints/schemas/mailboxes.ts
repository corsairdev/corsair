import { z } from 'zod';
import { bool, num, obj, str, WorkspaceId } from '../schema-helpers';

export const MailboxesInputSchemas = {
	mailboxesList: z
		.object({
			workspaceId: WorkspaceId,
			page: z.number().int().optional().describe('Default 1.'),
			limit: z.number().int().optional().describe('Default 10.'),
			keyword: z.string().optional(),
			domain: z.string().optional(),
			domain_uid: z.string().optional(),
			platform: z.string().optional(),
			status: z
				.enum([
					'active',
					'inactive',
					'scheduled',
					'scheduled_for_cancellation',
					'cancelled',
					'pending',
					'processing',
					'waiting_for_dns_propagation',
					'failed',
					'deleted',
					'suspended',
					'archived',
					'waiting_for_activation_email',
					'activation_email_received',
					'configuring_workspace',
					'configuring_dns',
					'configuring_dkim',
					'configuring_auth',
					'finalizing_setup',
					'renewal_failed',
				])
				.optional(),
			uids: z.array(z.string()).optional(),
		})
		.strict(),
	mailboxesGet: z
		.object({
			workspaceId: WorkspaceId,
			uid: z.string().describe('Mailbox UID'),
		})
		.strict(),
	mailboxesCheckAvailability: z
		.object({
			username: z.string().describe('Username to check availability for'),
			domain: z.string().describe('Domain to check username availability for'),
		})
		.strict(),
	mailboxesGetStatus: z
		.object({
			workspaceId: WorkspaceId,
			uids: z
				.array(z.string())
				.optional()
				.describe('Mailbox UIDs to check status for'),
			domain_uids: z
				.array(z.string())
				.optional()
				.describe('Check mailbox status by domain uids'),
			page: z.number().int().optional(),
			limit: z.number().int().optional(),
		})
		.strict(),
	mailboxesGetFailureReason: z
		.object({
			workspaceId: WorkspaceId,
			uid: z.string().describe('Unique identifier of the mailbox'),
		})
		.strict(),
	mailboxesBuy: z
		.object({
			workspaceId: WorkspaceId,
			mailboxes: z
				.array(
					z
						.object({
							first_name: z
								.string()
								.describe(
									'First name of the mailbox user. Used as the display name for the email account.',
								),
							last_name: z
								.string()
								.describe(
									'Last name of the mailbox user. Used as the display name for the email account.',
								),
							profile_picture: z
								.string()
								.nullable()
								.optional()
								.describe(
									'URL of a profile picture for the mailbox user. If not provided, no profile picture is set.',
								),
							username: z
								.string()
								.describe(
									'The local part of the email address (before the @). For example, if the desired email is john.doe@example.com, the username is john.doe. Automatically converted to lowercase. Must be unique per domain.',
								),
							platform: z
								.enum(['GOOGLE', 'MICROSOFT', 'AZURE'])
								.describe(
									'The email service provider for this mailbox. All mailboxes on the same domain must use the same platform. Default "GOOGLE".',
								),
							domain_name: z
								.string()
								.describe(
									'The domain for this mailbox (e.g., example.com). Must already exist in your workspace. Case-insensitive.',
								),
						})
						.strict(),
				)
				.describe('Mailbox configurations'),
			use_wallet_balance: z
				.boolean()
				.optional()
				.describe(
					"Controls the payment method for this purchase. When set to false (default), mailboxes are allocated from your subscription's available mailbox slots at no additional credit cost.",
				),
			warmup_addon_enabled: z
				.boolean()
				.optional()
				.describe(
					'Adds warmup to every mailbox in this request. Default false.',
				),
		})
		.strict(),
	mailboxesCancel: z
		.object({
			workspaceId: WorkspaceId,
			uids: z.array(z.string()).describe('Mailbox UIDs to cancel'),
			domain_uids: z.array(z.string()).optional(),
		})
		.strict(),
	mailboxesUncancel: z
		.object({
			workspaceId: WorkspaceId,
			uids: z.array(z.string()).describe('Mailbox UIDs to uncancel (max 1000)'),
		})
		.strict(),
	mailboxesReactivate: z
		.object({
			workspaceId: WorkspaceId,
			uids: z
				.array(z.string())
				.describe('Mailbox UIDs to reactivate (max 1000)'),
			allow_charge: z
				.boolean()
				.optional()
				.describe(
					"Set to `true` to approve an automatic re-purchase when a mailbox's license has expired. Defaults to `false`: those mailboxes wait for your approval instead of being charged.",
				),
		})
		.strict(),
	mailboxesReactivateRebuy: z
		.object({
			workspaceId: WorkspaceId,
			uids: z
				.array(z.string())
				.describe(
					'UIDs of mailboxes with `mailbox_reactivation_status: needs_rebuy` (max 1000)',
				),
		})
		.strict(),
	mailboxesUpdate: z
		.object({
			workspaceId: WorkspaceId,
			uid: z.string().describe('Mailbox UID'),
			first_name: z.string().optional().describe('First name'),
			last_name: z.string().optional().describe('Last name'),
			profile_picture: z.string().optional().describe('Profile picture URL'),
			tags: z.array(z.string()).optional().describe('Tags for the mailbox'),
		})
		.strict(),
	mailboxesUpdateProfilePicture: z
		.object({
			workspaceId: WorkspaceId,
			uid: z.string().describe('Mailbox UID'),
			profile_picture: z.string().describe('Profile picture URL'),
		})
		.strict(),
	mailboxesChangeUsername: z
		.object({
			workspaceId: WorkspaceId,
			uid: z.string().optional().describe('Mailbox UID'),
			username: z.string().optional().describe('New username'),
		})
		.strict(),
	mailboxesChangePassword: z
		.object({
			workspaceId: WorkspaceId,
			uid: z.string().optional().describe('Mailbox UID'),
			password: z.string().optional().describe('New password'),
		})
		.strict(),
	mailboxesShowCredentials: z
		.object({
			workspaceId: WorkspaceId,
			uid: z.string().optional().describe('Mailbox UID'),
			email: z.string().optional(),
		})
		.strict(),
	mailboxesGenerateTotp: z
		.object({
			workspaceId: WorkspaceId,
			uid: z.string().describe('Mailbox UID'),
		})
		.strict(),
	mailboxesAddSignature: z
		.object({
			workspaceId: WorkspaceId,
			mailbox_uids: z
				.array(z.string())
				.describe('Array of mailbox UIDs to add/update signature for'),
			signature: z
				.string()
				.describe('HTML signature string to apply to mailboxes'),
		})
		.strict(),
	mailboxesDeleteSignature: z
		.object({
			workspaceId: WorkspaceId,
			mailbox_uids: z
				.array(z.string())
				.describe('Array of mailbox UIDs to delete signatures for'),
		})
		.strict(),
	mailboxesResetup: z
		.object({
			workspaceId: WorkspaceId,
			mailbox_uids: z
				.array(z.string())
				.min(1)
				.max(2000)
				.describe(
					'Mailbox UIDs to resetup (1-2000). The list may span multiple domains; the endpoint groups by domain and creates one resetup job per domain.',
				),
			domain_uid: z
				.string()
				.optional()
				.describe(
					'Optional. When supplied, the entire selection must belong to this domain — a multi-domain selection paired with domain_uid is rejected with 400.',
				),
		})
		.strict(),
	mailboxesGetResetupStatus: z
		.object({
			workspaceId: WorkspaceId,
			domain_uid: z
				.string()
				.optional()
				.describe(
					'Domain UID. Either `domain_uid` or `domain_name` is required.',
				),
			domain_name: z
				.string()
				.optional()
				.describe('Domain name. Used when domain_uid is not supplied.'),
		})
		.strict(),
} as const;

export const MailboxesOutputSchemas = {
	mailboxesList: z
		.object({
			error: bool,
			message: str,
			mailboxes: z
				.array(
					z
						.object({
							uid: str,
							domain_name: str,
							forwarding_email: str,
							first_name: str,
							last_name: str,
							profile_picture: str,
							username: str,
							platform: str,
							status: str,
							is_admin: bool,
							tags: z.array(str).nullish(),
							sequencers: z.array(obj).nullish(),
							createdAt: str,
							updatedAt: str,
							renewal_date: str,
							mailbox_update_status: str,
							sequencer_status: str,
							dns_propagation_status: str,
							renewal_cycle: str,
							renewal_status: str,
							mailbox_reactivation_status: str,
							prepaid_until: str,
						})
						.loose(),
				)
				.nullish(),
			total: num.describe('Total number of mailboxes'),
			pages: num.describe('Total number of pages'),
			current_page: num.describe('Current page number'),
			limit: num.describe('Items per page'),
		})
		.loose(),
	mailboxesGet: z
		.object({
			error: bool,
			message: str,
			mailbox: z
				.object({
					uid: str.describe('Mailbox UID'),
					first_name: str,
					last_name: str,
					username: str,
					platform: str,
					status: str,
					domain: str,
					profile_picture: str,
					sequencers: z
						.array(
							z
								.object({
									name: str,
									status: str,
								})
								.loose(),
						)
						.nullish()
						.describe('Associated sequencers'),
					signature: str.describe('Signature assigned to mailbox'),
					mailbox_reactivation_status: str.describe(
						'Progress of a Microsoft 365 / Azure reactivation requested with `POST /v1/api/mailboxes/reactivate`.',
					),
					domain_name: str,
					forwarding_email: str,
					is_admin: bool,
					tags: z.array(str).nullish(),
					mailbox_update_status: str,
					sequencer_status: str,
					dns_propagation_status: str,
					renewal_date: str,
					renewal_cycle: str,
					renewal_status: str,
					createdAt: str,
					updatedAt: str,
				})
				.loose()
				.nullish(),
		})
		.loose(),
	mailboxesCheckAvailability: z
		.object({
			error: bool,
			message: str,
			available: bool.describe('Whether the username is available'),
		})
		.loose(),
	mailboxesGetStatus: z
		.object({
			error: bool,
			message: str,
			mailboxes: z
				.array(
					z
						.object({
							uid: str,
							status: str,
							first_name: str,
							last_name: str,
							username: str,
							platform: str,
							mailbox_reactivation_status: str,
							mailbox_update_status: str,
							sequencer_status: str,
							dns_propagation_status: str,
						})
						.loose(),
				)
				.nullish()
				.describe('Mailboxes with current status'),
			page: num,
			limit: num,
			total: num,
		})
		.loose(),
	mailboxesGetFailureReason: z
		.object({
			error: bool.describe('Indicates if there was an error'),
			message: str.describe('Human-readable response message'),
			data: z
				.object({
					uid: str.describe('Mailbox UID'),
					email: str.describe('Full email address of the mailbox'),
					status: str.describe('Current mailbox status'),
					is_failed: bool.describe('Whether the mailbox is in failed status'),
					failure_message: str.describe('User-friendly failure message'),
					failure_code: str.describe('Standardized failure code'),
					action_required: bool.describe(
						'Whether user action is required to resolve',
					),
					internal_status: str.describe(
						'Internal workflow status (for debugging)',
					),
					original_reason: str.describe('Raw internal status reason'),
					inherited_from_admin: bool.describe(
						'Whether the failure reason was inherited from the admin mailbox of this domain',
					),
				})
				.loose()
				.nullish()
				.describe('Failure reason details'),
		})
		.loose(),
	mailboxesBuy: z
		.object({
			error: bool.describe('Whether the request encountered an error.'),
			message: str.describe('A human-readable message describing the result.'),
			mailboxes: z
				.array(
					z
						.object({
							uid: str,
							domain_name: str,
							first_name: str,
							last_name: str,
							username: str,
							platform: str,
							status: str,
							renewal_date: str,
							renewal_cycle: str,
							createdAt: str,
							updatedAt: str,
						})
						.loose(),
				)
				.nullish()
				.describe(
					'List of mailboxes that have been scheduled for provisioning.',
				),
			warmup_addon: z
				.object({
					enabled: bool.describe('Always true when this object is returned.'),
					status: str.describe(
						'pending_activation when warmup was added. It starts automatically once each mailbox is ready. failed when warmup could not be added.',
					),
					subscriptions_created: num.describe(
						'Number of mailboxes that warmup was added to.',
					),
					skipped: num.describe(
						'Mailboxes in the request that already had warmup. They are not charged again.',
					),
					price_per_mailbox: num.describe(
						'Monthly warmup price per mailbox, in credits.',
					),
					total_cost: num.describe(
						'Warmup amount charged with this purchase, in credits.',
					),
					message: str.describe('Returned only when status is failed.'),
				})
				.loose()
				.nullish()
				.describe(
					'Warmup added with this purchase. Returned only when warmup_addon_enabled was true.',
				),
		})
		.loose(),
	mailboxesCancel: z
		.object({
			error: bool,
			message: str,
		})
		.loose(),
	mailboxesUncancel: z
		.object({
			error: bool,
			message: str,
			results: z
				.object({
					success: z
						.array(
							z
								.object({
									uid: str,
									action: str,
								})
								.loose(),
						)
						.nullish()
						.describe('Successfully uncancelled mailboxes'),
					failed: z
						.array(
							z
								.object({
									uid: str,
									error: str,
								})
								.loose(),
						)
						.nullish()
						.describe('Mailboxes that could not be uncancelled'),
				})
				.loose()
				.nullish(),
		})
		.loose(),
	mailboxesReactivate: z
		.object({
			error: bool,
			message: str,
			batch_id: str.describe('Identifier for this request'),
			results: z
				.object({
					success: z
						.array(
							z
								.object({
									uid: str,
									action: str,
								})
								.loose(),
						)
						.nullish()
						.describe('Mailboxes queued for reactivation'),
					failed: z
						.array(
							z
								.object({
									uid: str,
									error: str,
								})
								.loose(),
						)
						.nullish()
						.describe('Mailboxes that could not be queued, with the reason'),
				})
				.loose()
				.nullish(),
			allow_charge: bool.describe(
				'Whether automatic re-purchase was approved for this request',
			),
		})
		.loose(),
	mailboxesReactivateRebuy: z
		.object({
			error: bool,
			message: str,
			charged: num.describe('Credits charged to your wallet'),
			batch_id: str.describe('Identifier for this request'),
			results: z
				.object({
					success: z
						.array(
							z
								.object({
									uid: str,
									action: str,
								})
								.loose(),
						)
						.nullish()
						.describe('Mailboxes re-purchased and queued for setup'),
					failed: z
						.array(
							z
								.object({
									uid: str,
									error: str,
								})
								.loose(),
						)
						.nullish()
						.describe(
							'Always empty. UIDs that were not waiting for a re-purchase are left out',
						),
				})
				.loose()
				.nullish(),
		})
		.loose(),
	mailboxesUpdate: z
		.object({
			error: bool,
			message: str,
		})
		.loose(),
	mailboxesUpdateProfilePicture: z
		.object({
			error: bool,
			message: str,
		})
		.loose(),
	mailboxesChangeUsername: z
		.object({
			error: bool,
			message: str,
		})
		.loose(),
	mailboxesChangePassword: z
		.object({
			error: bool,
			message: str,
		})
		.loose(),
	mailboxesShowCredentials: z
		.object({
			error: bool,
			message: str,
			password: str.describe('Mailbox password'),
			secret: str.describe('Mailbox secret'),
			app_password: str.describe('App-specific password'),
		})
		.loose(),
	mailboxesGenerateTotp: z
		.object({
			error: bool,
			message: str,
			totp: str.describe('Generated TOTP code'),
			expires_at: num.describe('Timestamp'),
		})
		.loose(),
	mailboxesAddSignature: z
		.object({
			error: bool,
			message: str,
			results: z
				.object({
					updated: z
						.array(str)
						.nullish()
						.describe('UIDs of mailboxes whose signatures were updated'),
					created: z
						.array(str)
						.nullish()
						.describe(
							'UIDs of mailboxes for which new signatures were created',
						),
					failed: z
						.array(
							z
								.object({
									uid: str,
									reason: str,
								})
								.loose(),
						)
						.nullish()
						.describe('UIDs that failed with reasons'),
				})
				.loose()
				.nullish(),
			summary: z
				.object({
					total_requested: num,
					updated_count: num,
					created_count: num,
					failed_count: num,
				})
				.loose()
				.nullish(),
		})
		.loose(),
	mailboxesDeleteSignature: z
		.object({
			error: bool,
			message: str,
			results: z
				.object({
					deleted: z
						.array(str)
						.nullish()
						.describe('UIDs of mailboxes whose signatures were deleted'),
					not_found_signature: z
						.array(str)
						.nullish()
						.describe(
							'UIDs of valid mailboxes that had no signature to delete',
						),
					failed: z
						.array(
							z
								.object({
									uid: str,
									reason: str,
								})
								.loose(),
						)
						.nullish()
						.describe('UIDs that failed with reasons'),
				})
				.loose()
				.nullish(),
			summary: z
				.object({
					total_requested: num,
					deleted_count: num,
					not_found_signature_count: num,
					failed_count: num,
				})
				.loose()
				.nullish(),
		})
		.loose(),
	mailboxesResetup: z
		.object({
			error: bool,
			message: str.describe(
				"Top-level status. One of: 'Resetup scheduled', 'Some resetups scheduled; some domains were skipped', 'No resetups could be scheduled'.",
			),
			results: z
				.array(
					z
						.object({
							error: bool,
							domain_uid: str,
							domain_name: str,
							resetup_uid: str,
							mailbox_uids_to_reprovision: z.array(str).nullish(),
							mailbox_uids_to_backup: z.array(str).nullish(),
							scheduled_run_at: str,
							deferred: bool,
							message: str,
						})
						.loose(),
				)
				.nullish()
				.describe(
					'Per-domain outcome. The request groups mailbox_uids by domain and creates one resetup job per domain — each domain is validated independently, so the array can…',
				),
		})
		.loose(),
	mailboxesGetResetupStatus: z
		.object({
			error: bool,
			resetup: z
				.object({
					uid: str.describe('Resetup job identifier.'),
					domain: str,
					domain_name: str,
					team: str,
					workspace: str,
					status: str.describe(
						"User-facing status: 'pending', 'in_progress', 'completed', or 'failed'.",
					),
					createdAt: str,
					updatedAt: str,
				})
				.loose()
				.nullish()
				.describe(
					'Most recent resetup job for the domain. `null` when no resetup has ever been scheduled for it. Sensitive credential fields are stripped from the response.',
				),
		})
		.loose(),
} as const;
