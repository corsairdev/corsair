import { z } from 'zod';
import { bool, num, obj, str, untyped, WorkspaceId } from '../schema-helpers';

export const SequencersInputSchemas = {
	sequencersListPlatforms: z
		.object({
			workspaceId: WorkspaceId,
		})
		.strict(),
	sequencersList: z
		.object({
			workspaceId: WorkspaceId,
			limit: z.number().int().optional(),
			offset: z.number().int().optional(),
			sequencer_platforms: z.array(z.string()).optional(),
			keyword: z.string().optional(),
			status: z.string().optional(),
			uids: z.array(z.string()).optional(),
		})
		.strict(),
	sequencersGetTags: z
		.object({
			workspaceId: WorkspaceId,
			platform: z
				.string()
				.describe(
					'Sequencer platform identifier (for example: instantly, smartlead, lemlist, emailbison).',
				),
			api_key: z
				.string()
				.describe(
					'API key for the sequencer account. The key is validated against the platform before tags are returned.',
				),
		})
		.strict(),
	sequencersAdd: z
		.object({
			workspaceId: WorkspaceId,
			name: z
				.string()
				.describe('Display name for the sequencer in your workspace.'),
			platform: z
				.string()
				.describe(
					'Sequencer platform identifier (for example: instantly, smartlead, lemlist, emailbison). Use List sequencer platforms to discover supported values.',
				),
			sequencer_login: z
				.string()
				.optional()
				.describe(
					'Username or email for the sequencer account. Some platforms use a different field name — check List sequencer platforms for the exact name.',
				),
			sequencer_password: z
				.string()
				.optional()
				.describe('Password for the sequencer account.'),
			sequencer_workspace: z
				.string()
				.optional()
				.describe(
					'Workspace or organization name on the sequencer. Used by platforms with multiple workspaces (instantly, emailbison, lemlist, plusvibe, reachinbox, manyreach, hothawk, automailer).',
				),
			workspace_id: z
				.string()
				.optional()
				.describe(
					'Workspace identifier on the sequencer. Used by salesforge and warmforge (optional) and by masterinbox, where it is REQUIRED.',
				),
			app_url: z
				.string()
				.optional()
				.describe(
					'Application URL for self-hosted instances (e.g., your EmailBison subdomain).',
				),
			client_id: z
				.string()
				.optional()
				.describe(
					'OAuth client ID from your sequencer account (used by EmailBison to authenticate and link mailboxes).',
				),
			api_key: z
				.string()
				.optional()
				.describe(
					'API key for the sequencer account. Optional in general, but required to enable warmup configuration, tag assignment, and the auto_reconnect_mailboxes flag. Validated against the platform when supplied.',
				),
			tags: z
				.array(z.string())
				.optional()
				.describe(
					'Tag IDs to assign to this sequencer (use Get sequencer tags to retrieve available IDs). Requires a valid API key.',
				),
			enable_warmup: z
				.boolean()
				.optional()
				.describe(
					"Turn on the platform's built-in warmup for mailboxes connected to this sequencer. Requires a valid API key.",
				),
			warmup_enable_custom_tracking: z
				.boolean()
				.optional()
				.describe(
					'Use custom tracking domains during warmup. Requires a valid API key.',
				),
			warmup_limit: z
				.number()
				.optional()
				.describe(
					'Maximum number of warmup emails sent per mailbox per day. Requires a valid API key.',
				),
			warmup_replyrate: z
				.number()
				.optional()
				.describe(
					'Target reply rate for warmup emails, as a percentage (0–100). Requires a valid API key.',
				),
			warmup_increment: z
				.enum(['1', '2', '3', '4', '5', '6', '7', '8', 'disable', 'disabled'])
				.optional()
				.describe(
					'How many additional warmup emails to add each day. For Smartlead the minimum is "5". For Instantly the maximum is "4". Requires a valid API key.',
				),
			auto_reconnect_mailboxes: z
				.boolean()
				.optional()
				.describe(
					"Automatically reconnect mailboxes to this sequencer if they get disconnected. Setting this to true requires an API key on the sequencer (the platform's API is used to perform the reconnect).",
				),
			sender_name: z
				.string()
				.optional()
				.describe('Sender name for the mailboxes. MailToaster requires it.'),
		})
		.strict()
		.refine(
			(input) =>
				Boolean(
					(input.sequencer_login && input.sequencer_password) || input.api_key,
				),
			{
				message:
					'Pass sequencer_login and sequencer_password, or api_key, as sequencers.listPlatforms lists for this platform.',
			},
		),
	sequencersUpdate: z
		.object({
			workspaceId: WorkspaceId,
			uid: z.string().describe('ID of the sequencer to update.'),
			name: z
				.string()
				.describe('Display name for the sequencer in your workspace.'),
			platform: z
				.string()
				.describe(
					'Sequencer platform identifier (for example: instantly, smartlead, lemlist, emailbison).',
				),
			username: z
				.string()
				.optional()
				.describe(
					'Username or email for the sequencer account. Optional: leave it out to keep the current one.',
				),
			password: z
				.string()
				.optional()
				.describe(
					'Password for the sequencer account. Optional: leave it out to keep the current one. Not used by `sendkit`, `brandjet`, `supersend`, `ken`, `automailer`, `mailstrike`, and `outboundry`.',
				),
			api_key: z
				.string()
				.optional()
				.describe(
					'API key for the sequencer account. Validated against the platform when changed.',
				),
			workspace_name: z
				.string()
				.optional()
				.describe(
					'Workspace or organization name for platforms that have multiple workspaces. Pass an empty string to clear.',
				),
			auto_reconnect_mailboxes: z
				.boolean()
				.optional()
				.describe(
					'Automatically reconnect mailboxes to this sequencer if they get disconnected. Setting this to true requires the sequencer to have an API key (either already saved or supplied in this request).',
				),
		})
		.strict(),
	sequencersDelete: z
		.object({
			workspaceId: WorkspaceId,
			uids: z
				.array(z.string())
				.min(1)
				.describe('Array of sequencer UIDs to delete'),
		})
		.strict(),
	sequencersExportMailboxes: z
		.object({
			workspaceId: WorkspaceId,
			sequencer_uid: z.string(),
			mailbox_uids: z.array(z.string()),
		})
		.strict(),
	sequencersGetExportStatus: z
		.object({
			workspaceId: WorkspaceId,
			uids: z
				.array(z.string())
				.optional()
				.describe('Filter the response to a specific set of export job IDs.'),
			limit: z
				.number()
				.int()
				.min(1)
				.max(100)
				.optional()
				.describe('How many results to return per page (1–100, default 50).'),
			offset: z
				.number()
				.int()
				.min(0)
				.optional()
				.describe('Number of results to skip for pagination. Default 0.'),
			status: z
				.enum([
					'queued',
					'pending',
					'processing',
					'completed',
					'errored',
					'failed',
					'cancelled',
				])
				.optional()
				.describe('Return only export jobs in this status.'),
			sequencer_uid: z
				.string()
				.optional()
				.describe('Return only export jobs that targeted this sequencer.'),
			mailbox_uids: z
				.array(z.string())
				.optional()
				.describe('Return only export jobs for these mailboxes.'),
		})
		.strict(),
	sequencersVerifyLemlistOtp: z
		.object({
			workspaceId: WorkspaceId,
			verification_id: z
				.string()
				.describe('From the /v1/api/sequencers/add 202 response.'),
			verification_url: z
				.string()
				.describe(
					'The confirmation URL from the Lemlist verification email. Right-click the verify button in the email and choose Copy link address.',
				),
			otp: z.string().describe('6-digit code from the verification email'),
			email: z
				.string()
				.describe('Same email passed to /v1/api/sequencers/add.'),
			password: z
				.string()
				.describe('Same password passed to /v1/api/sequencers/add.'),
			name: z
				.string()
				.optional()
				.describe(
					'Optional display name for the sequencer record (same as /v1/api/sequencers/add).',
				),
		})
		.strict(),
} as const;

export const SequencersOutputSchemas = {
	sequencersListPlatforms: z
		.object({
			error: bool,
			message: str,
			platforms: z
				.array(
					z
						.object({
							platform: str,
							name: str,
							logo: str,
							fields: z
								.array(
									z
										.object({
											name: str,
											type: str,
											required: bool,
										})
										.loose(),
								)
								.nullish(),
						})
						.loose(),
				)
				.nullish()
				.describe('Sequencer platforms available in your workspace.'),
		})
		.loose(),
	sequencersList: z
		.object({
			error: bool,
			message: str,
			data: z
				.array(
					z
						.object({
							_id: str,
							uid: str,
							name: str,
							platform: str,
							username: str,
							status: str,
							status_reason: str,
							workspace_name: str,
							consent_url: str,
							createdAt: str,
							updatedAt: str,
							platform_metadata: z
								.object({
									platform_name: str,
									logo: str,
									client_id: str,
									cname: str,
									version: str,
									ui_config: z
										.object({
											theme: str,
											layout: str,
											submit_button_text: str,
											loading_text: str,
											responsive: bool,
										})
										.loose()
										.nullish(),
									fields: z.array(obj).nullish(),
								})
								.loose()
								.nullish(),
							status_reason_type: str,
							status_reason_updated_at: str,
						})
						.loose(),
				)
				.nullish(),
			pagination: z
				.object({
					total: num,
					limit: num,
					offset: num,
					hasMore: bool,
				})
				.loose()
				.nullish(),
		})
		.loose(),
	sequencersGetTags: z
		.object({
			error: bool,
			tags: z
				.array(
					z
						.object({
							id: str,
							name: str,
						})
						.loose(),
				)
				.nullish()
				.describe('List of available tags'),
		})
		.loose(),
	sequencersAdd: z
		.object({
			error: bool,
			message: str,
			uid: str.describe('Created sequencer unique identifier'),
		})
		.loose(),
	sequencersUpdate: z
		.object({
			error: bool,
			message: str,
			uid: str.describe('Updated sequencer unique identifier'),
		})
		.loose(),
	sequencersDelete: z
		.object({
			error: bool,
			message: str,
			data: z
				.object({
					deletedCount: num.describe('Number of sequencers actually deleted'),
					requestedCount: num.describe(
						'Number of sequencers requested for deletion',
					),
				})
				.loose()
				.nullish(),
		})
		.loose(),
	sequencersExportMailboxes: z
		.object({
			error: bool,
			message: str,
			results: z
				.object({
					total_mailboxes: num,
					new_exports_created: num,
					duplicate_exports_skipped: num,
					weekly_limit_reached: num,
					active_exports_to_this_sequencer: num,
					weekly_export_limit: num,
				})
				.loose()
				.nullish(),
			exports: z
				.object({
					created: z
						.array(
							z
								.object({
									uid: str,
									sequencer_uid: str,
									mailbox_uid: str,
									mailbox_email: str,
									status: str,
									client_id_processed: bool,
									created_at: str,
								})
								.loose(),
						)
						.nullish(),
					duplicates: z
						.array(
							z
								.object({
									mailbox_uid: str,
									mailbox_email: str,
									status: str,
									existing_sequencer_uid: str,
									restriction_reason: str,
									next_available_at: untyped,
									last_export_date: str,
									weekly_exports_used: num,
									weekly_exports_limit: num,
								})
								.loose(),
						)
						.nullish(),
				})
				.loose()
				.nullish(),
		})
		.loose(),
	sequencersGetExportStatus: z
		.object({
			error: bool,
			message: str,
			data: z
				.array(
					z
						.object({
							_id: str,
							uid: str,
							sequencer_uid: str,
							sequencer_platform: str,
							sequencer_name: str,
							sequencer_platform_name: str,
							sequencer_logo: str,
							mailbox_uid: str,
							mailbox_email: str,
							mailbox_count: num,
							status: str,
							error_message: str,
							attempts: num,
							completed_at: str,
							created_at: str,
							updated_at: str,
							failure_details: obj,
						})
						.loose(),
				)
				.nullish()
				.describe(
					'List of export jobs, each with the sequencer it targeted and the mailbox it tried to connect.',
				),
			pagination: z
				.object({
					total: num,
					limit: num,
					offset: num,
					hasMore: bool,
				})
				.loose()
				.nullish(),
		})
		.loose(),
	sequencersVerifyLemlistOtp: z
		.object({
			error: bool,
			status: str,
			uid: str,
			message: str,
		})
		.loose(),
} as const;
