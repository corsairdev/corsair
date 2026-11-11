import { z } from 'zod';
import { bool, num, obj, str, WorkspaceId } from '../schema-helpers';

export const WarmupInputSchemas = {
	warmupList: z
		.object({
			workspaceId: WorkspaceId,
			page: z
				.number()
				.int()
				.min(1)
				.optional()
				.describe('Page number for pagination. Default 1.'),
			limit: z
				.number()
				.int()
				.min(1)
				.max(100)
				.optional()
				.describe('Number of items per page. Default 10.'),
			status: z
				.enum([
					'active',
					'paused',
					'pending_activation',
					'cancelled',
					'past_due',
				])
				.optional()
				.describe('Filter by warmup subscription status'),
			include_cancelled: z
				.boolean()
				.optional()
				.describe('Include cancelled subscriptions in results. Default false.'),
		})
		.strict(),
	warmupGet: z
		.object({
			workspaceId: WorkspaceId,
			uid: z.string().describe('Mailbox UID to get warmup details for'),
		})
		.strict(),
	warmupGetStats: z
		.object({
			workspaceId: WorkspaceId,
		})
		.strict(),
	warmupGetPricing: z
		.object({
			workspaceId: WorkspaceId,
		})
		.strict(),
	warmupAdd: z
		.object({
			workspaceId: WorkspaceId,
			mailbox_uids: z
				.array(z.string())
				.min(1)
				.max(100)
				.describe('Array of mailbox UIDs to add warmup to (max 100)'),
			activate_immediately: z
				.boolean()
				.optional()
				.describe(
					'Whether to activate warmup immediately for active mailboxes (deducts credits). Default false.',
				),
		})
		.strict(),
	warmupPause: z
		.object({
			workspaceId: WorkspaceId,
			mailbox_uids: z
				.array(z.string())
				.min(1)
				.max(100)
				.describe(
					'Array of mailbox UIDs to pause warmup for (max 100). Only active subscriptions can be paused.',
				),
		})
		.strict(),
	warmupResume: z
		.object({
			workspaceId: WorkspaceId,
			mailbox_uids: z
				.array(z.string())
				.min(1)
				.max(100)
				.describe(
					'Array of mailbox UIDs to resume warmup for (max 100). Only paused subscriptions can be resumed.',
				),
		})
		.strict(),
	warmupCancel: z
		.object({
			workspaceId: WorkspaceId,
			mailbox_uids: z
				.array(z.string())
				.min(1)
				.max(100)
				.describe(
					'Array of mailbox UIDs to cancel warmup for (max 100). Active warmups will be stopped before cancellation.',
				),
		})
		.strict(),
	warmupUpdateSettings: z
		.object({
			workspaceId: WorkspaceId,
			mailbox_uids: z
				.array(z.string())
				.min(1)
				.max(100)
				.describe(
					'UIDs of the mailboxes to update, 1 to 100 per request. A UID sent more than once is updated once.',
				),
			settings: z
				.object({
					starting_volume: z
						.number()
						.int()
						.min(1)
						.max(500)
						.optional()
						.describe(
							'Warmup emails sent on the first day, 1 to 500. Can be changed only before warmup reaches day 2. After that it is skipped and listed in skipped_settings.',
						),
					daily_increase: z
						.number()
						.int()
						.min(1)
						.max(50)
						.optional()
						.describe(
							'Warmup emails added each day until the target volume is reached, 1 to 50.',
						),
					target_volume: z
						.number()
						.int()
						.min(1)
						.max(500)
						.optional()
						.describe(
							'Daily warmup emails once the ramp up is complete, 1 to 500.',
						),
					reply_rates: z
						.object({
							inbox: z
								.object({
									min: z
										.number()
										.int()
										.min(0)
										.max(100)
										.optional()
										.describe('Lowest reply rate, 0 to 100.'),
									max: z
										.number()
										.int()
										.min(0)
										.max(100)
										.optional()
										.describe('Highest reply rate, 0 to 100.'),
								})
								.strict()
								.optional()
								.describe(
									'Reply rate range, in percent, for warmup emails that land in the inbox. Send min, max or both. When you send both, min cannot be greater than max.',
								),
							promotions: z
								.object({
									min: z
										.number()
										.int()
										.min(0)
										.max(100)
										.optional()
										.describe('Lowest reply rate, 0 to 100.'),
									max: z
										.number()
										.int()
										.min(0)
										.max(100)
										.optional()
										.describe('Highest reply rate, 0 to 100.'),
								})
								.strict()
								.optional()
								.describe(
									'Reply rate range, in percent, for warmup emails that land in the promotions tab. Send min, max or both. When you send both, min cannot be greater than max.',
								),
							spam: z
								.number()
								.int()
								.min(0)
								.max(100)
								.optional()
								.describe(
									'Reply rate, in percent, for warmup emails that land in spam, 0 to 100.',
								),
						})
						.strict()
						.optional()
						.describe(
							'How often warmup emails get replies, in percent. Send only the parts you want to change.',
						),
				})
				.strict()
				.describe(
					'The settings to change. Send at least one. Settings you leave out stay as they are.',
				),
		})
		.strict(),
	warmupCreateConnectLink: z
		.object({
			workspaceId: WorkspaceId,
			platform: z
				.enum(['GOOGLE', 'MICROSOFT'])
				.describe('GOOGLE for Google Workspace, MICROSOFT for Microsoft 365.'),
			email: z
				.string()
				.optional()
				.describe(
					'Optional. When set, only this mailbox can complete the sign-in.',
				),
			start_warmup: z
				.boolean()
				.optional()
				.describe(
					'Optional, default false. When true, warmup starts and the first month is charged as soon as the mailbox connects.',
				),
		})
		.strict(),
	warmupGetConnectLink: z
		.object({
			workspaceId: WorkspaceId,
			connection_id: z
				.string()
				.min(1)
				.describe('The connection_id returned by Create a Connect Link.'),
		})
		.strict(),
	warmupAddSmtpMailboxes: z
		.object({
			workspaceId: WorkspaceId,
			mailboxes: z
				.array(
					z
						.object({
							email: z.string().describe('Email address of the mailbox.'),
							display_name: z
								.string()
								.optional()
								.describe('Optional sender name, up to 120 characters.'),
							smtp_host: z
								.string()
								.describe('SMTP server, as a host name (not an IP address).'),
							smtp_port: z.number().int().describe('25, 465, 587 or 2525.'),
							smtp_username: z
								.string()
								.optional()
								.describe('Optional. Defaults to email.'),
							smtp_password: z
								.string()
								.describe('SMTP password, 1 to 512 characters.'),
							smtp_secure: z
								.boolean()
								.optional()
								.describe(
									'Optional. Defaults to true for port 465 and false otherwise (STARTTLS).',
								),
							imap_host: z
								.string()
								.optional()
								.describe('Optional IMAP server, as a host name.'),
							imap_port: z
								.number()
								.int()
								.optional()
								.describe('Optional. 143 or 993, default 993.'),
							imap_username: z
								.string()
								.optional()
								.describe('Optional. Defaults to the SMTP username.'),
							imap_password: z
								.string()
								.optional()
								.describe('Optional. Defaults to the SMTP password.'),
							imap_secure: z
								.boolean()
								.optional()
								.describe('Optional. Defaults to true for port 993.'),
						})
						.strict(),
				)
				.min(1)
				.max(10)
				.describe('1 to 10 mailboxes.'),
			update_existing: z
				.boolean()
				.optional()
				.describe(
					'Optional, default false. When true, a mailbox already connected in this workspace gets the new sign-in details. If its warmup is running, they are tested first and warmup restarts from day one. Never charged.',
				),
		})
		.strict(),
	warmupListConnectedMailboxes: z
		.object({
			workspaceId: WorkspaceId,
			page: z.number().int().optional().describe('Page number, default 1.'),
			limit: z
				.number()
				.int()
				.optional()
				.describe('Mailboxes per page, 1 to 100, default 10.'),
			status: z
				.string()
				.optional()
				.describe('connected (default) or disconnected.'),
			platform: z
				.string()
				.optional()
				.describe('GOOGLE, MICROSOFT or SMTP. Leave out for all.'),
		})
		.strict(),
	warmupDisconnectMailbox: z
		.object({
			workspaceId: WorkspaceId,
			uid: z
				.string()
				.min(1)
				.describe('UID of the mailbox, starting with ext_mbx_.'),
		})
		.strict(),
} as const;

export const WarmupOutputSchemas = {
	warmupList: z
		.object({
			error: bool.describe('Indicates if there was an error'),
			message: str.describe('Human-readable response message'),
			subscriptions: z
				.array(
					z
						.object({
							uid: str,
							status: str,
							mailbox_email: str,
							price_per_month: num,
							health_status: str,
							started_at: str,
							next_billing_date: str,
							cached_stats: z
								.object({
									emails_sent: num,
									emails_received: num,
									health_score: num,
									inbox_rate: num,
									current_volume: num,
									target_volume: num,
									warmup_day: num,
									config: z
										.object({
											starting_volume: num,
											daily_increase: num,
											target_volume: num,
											reply_rates: obj,
										})
										.loose()
										.nullish(),
								})
								.loose()
								.nullish(),
							mailbox: z
								.object({
									uid: str,
									username: str,
									domain_name: str,
									first_name: str,
									last_name: str,
									platform: str,
									status: str,
								})
								.loose()
								.nullish(),
							createdAt: str,
						})
						.loose(),
				)
				.nullish()
				.describe('Array of warmup subscription objects'),
			total: num.describe('Total number of subscriptions matching the query'),
			pages: num.describe('Total number of pages'),
			current_page: num.describe('Current page number'),
			limit: num.describe('Items per page'),
		})
		.loose(),
	warmupGet: z
		.object({
			error: bool,
			message: str,
			subscription: z
				.object({
					uid: str,
					status: str.describe(
						'Current subscription status. pending_activation means warmup is booked and starts automatically once the mailbox is ready.',
					),
					mailbox_email: str,
					price_per_month: num,
					health_status: str,
					started_at: str,
					paused_at: str,
					cancelled_at: str,
					next_billing_date: str.describe(
						'Next billing date. For a subscription that has not started yet, this moves to one month after warmup starts.',
					),
					cached_stats: z
						.object({
							emails_sent: num,
							emails_received: num,
							health_score: num,
							inbox_rate: num,
							current_volume: num,
							target_volume: num,
							warmup_day: num,
							config: z
								.object({
									starting_volume: num,
									daily_increase: num,
									target_volume: num,
									reply_rates: z
										.object({
											inbox: obj,
											promotions: obj,
											spam: num,
										})
										.loose()
										.nullish(),
								})
								.loose()
								.nullish(),
						})
						.loose()
						.nullish(),
					mailbox: z
						.object({
							uid: str,
							username: str,
							domain_name: str,
							first_name: str,
							last_name: str,
							platform: str,
							status: str,
						})
						.loose()
						.nullish(),
					createdAt: str,
				})
				.loose()
				.nullish()
				.describe('Warmup subscription details'),
		})
		.loose(),
	warmupGetStats: z
		.object({
			error: bool,
			message: str,
			stats: z
				.object({
					totalCount: num.describe('Total non-cancelled subscriptions'),
					monthlyTotal: num.describe(
						'Total monthly cost across active subscriptions',
					),
					activeCount: num.describe('Number of active subscriptions'),
					pendingCount: num.describe(
						'Number of pending activation subscriptions',
					),
					pausedCount: num.describe('Number of paused subscriptions'),
					pastDueCount: num.describe('Number of past due subscriptions'),
					excellentHealthCount: num,
					goodHealthCount: num,
					warningHealthCount: num,
					criticalHealthCount: num,
					totalEmailsSent: num.describe(
						'Total warmup emails sent across all subscriptions',
					),
					totalEmailsReceived: num.describe(
						'Total warmup emails received across all subscriptions',
					),
					avgHealthScore: num.describe(
						'Average health score across all subscriptions (null if no data)',
					),
				})
				.loose()
				.nullish()
				.describe('Aggregated warmup statistics for the workspace'),
		})
		.loose(),
	warmupGetPricing: z
		.object({
			error: bool,
			price_per_mailbox: num.describe('Price per mailbox per month'),
			currency: str.describe('Currency code'),
			billing_cycle: str.describe('Billing cycle'),
			active_subscriptions: num.describe(
				'Number of active warmup subscriptions',
			),
			pending_subscriptions: num.describe(
				'Number of pending activation subscriptions',
			),
			total_subscriptions: num.describe('Total non-cancelled subscriptions'),
			monthly_cost: num.describe(
				'Current monthly cost for active subscriptions',
			),
		})
		.loose(),
	warmupAdd: z
		.object({
			error: bool,
			message: str,
			subscriptions: z
				.array(
					z
						.object({
							uid: str,
							status: str,
							mailbox_email: str,
							price_per_month: num,
							started_at: str,
							next_billing_date: str,
							createdAt: str,
						})
						.loose(),
				)
				.nullish()
				.describe('Array of created warmup subscription objects'),
			errors: z
				.array(
					z
						.object({
							mailbox_uid: str,
							error: str,
						})
						.loose(),
				)
				.nullish()
				.describe(
					'Errors for mailboxes that failed (only present if errors occurred)',
				),
			skipped: num.describe(
				'Number of mailboxes skipped (already have warmup)',
			),
		})
		.loose(),
	warmupPause: z
		.object({
			error: bool,
			message: str,
			results: z
				.object({
					success: z
						.array(
							z
								.object({
									mailbox_uid: str,
									subscription_uid: str,
									action: str,
								})
								.loose(),
						)
						.nullish(),
					failed: z
						.array(
							z
								.object({
									mailbox_uid: str,
									reason: str,
								})
								.loose(),
						)
						.nullish(),
				})
				.loose()
				.nullish(),
			summary: z
				.object({
					total_requested: num,
					success_count: num,
					failed_count: num,
				})
				.loose()
				.nullish(),
		})
		.loose(),
	warmupResume: z
		.object({
			error: bool,
			message: str,
			results: z
				.object({
					success: z
						.array(
							z
								.object({
									mailbox_uid: str,
									subscription_uid: str,
									action: str,
								})
								.loose(),
						)
						.nullish(),
					failed: z
						.array(
							z
								.object({
									mailbox_uid: str,
									reason: str,
								})
								.loose(),
						)
						.nullish(),
				})
				.loose()
				.nullish(),
			summary: z
				.object({
					total_requested: num,
					success_count: num,
					failed_count: num,
				})
				.loose()
				.nullish(),
		})
		.loose(),
	warmupCancel: z
		.object({
			error: bool,
			message: str,
			results: z
				.object({
					success: z
						.array(
							z
								.object({
									mailbox_uid: str,
									subscription_uid: str,
									action: str,
								})
								.loose(),
						)
						.nullish(),
					failed: z
						.array(
							z
								.object({
									mailbox_uid: str,
									reason: str,
								})
								.loose(),
						)
						.nullish(),
				})
				.loose()
				.nullish(),
			summary: z
				.object({
					total_requested: num,
					success_count: num,
					failed_count: num,
				})
				.loose()
				.nullish(),
		})
		.loose(),
	warmupUpdateSettings: z
		.object({
			error: bool.describe('false when the request was processed.'),
			message: str.describe('Summary of the result.'),
			results: z
				.object({
					success: z
						.array(
							z
								.object({
									mailbox_uid: str,
									subscription_uid: str,
									settings: obj,
									skipped_settings: z.array(str).nullish(),
								})
								.loose(),
						)
						.nullish()
						.describe('Mailboxes that were updated.'),
					failed: z
						.array(
							z
								.object({
									mailbox_uid: str,
									reason: str,
								})
								.loose(),
						)
						.nullish()
						.describe('Mailboxes that were not updated.'),
				})
				.loose()
				.nullish(),
			summary: z
				.object({
					total_requested: num.describe(
						'Number of UIDs in the request, including any sent more than once.',
					),
					success_count: num.describe('Number of mailboxes updated.'),
					failed_count: num.describe('Number of mailboxes not updated.'),
				})
				.loose()
				.nullish(),
		})
		.loose(),
	warmupCreateConnectLink: z
		.object({
			error: bool.describe('false when the link was created.'),
			message: str.describe('Summary.'),
			connection: z
				.object({
					connection_id: str.describe(
						'ID of the connect link, starting with ext_con_.',
					),
					platform: str.describe('GOOGLE or MICROSOFT.'),
					status: str.describe(
						'awaiting_consent, connected, warmup_started, failed or expired.',
					),
					failure_reason: str.describe(
						'Fixed code when the link failed, expired, or connected without starting warmup.',
					),
					failure_message: str.describe('The same in plain words.'),
					email: str.describe(
						'The only address allowed to use the link, when you set one.',
					),
					start_warmup: bool.describe(
						'Whether warmup starts as soon as the mailbox connects.',
					),
					external_mailbox_uid: str.describe(
						'UID of the connected mailbox, once there is one.',
					),
					subscription_uid: str.describe(
						'UID of the warmup subscription, once warmup started.',
					),
					created_at: str.describe('When the link was created (ISO 8601).'),
					completed_at: str.describe('When the link was used (ISO 8601).'),
					expires_at: str.describe('When the link stops working (ISO 8601).'),
					external_mailbox: z
						.object({
							uid: str,
							email: str,
							display_name: str,
							platform: str,
							connection_type: str,
							status: str,
							status_reason: str,
							status_message: str,
							warmup: z
								.object({
									subscription_uid: str,
									status: str,
									health_status: str,
								})
								.loose()
								.nullish(),
							connected_at: str,
							disconnected_at: str,
							created_at: str,
						})
						.loose()
						.nullish()
						.describe(
							'The connected mailbox, in the same shape as List Your Connected Mailboxes, or null.',
						),
					connect_url: str.describe(
						'The sign-in link to send to the mailbox owner. Returned only here.',
					),
				})
				.loose()
				.nullish(),
			setup: z
				.object({
					client_id: str.describe('Client ID of the InboxKit app.'),
					scopes: z
						.array(str)
						.nullish()
						.describe('Google Workspace only: the access the app needs.'),
					admin_console_url: str.describe(
						'Google Workspace only: where an admin trusts the app.',
					),
					admin_consent_url: str.describe(
						'Microsoft 365 only: where an admin approves the app.',
					),
				})
				.loose()
				.nullish()
				.describe('One-time admin setup for the platform.'),
		})
		.loose(),
	warmupGetConnectLink: z
		.object({
			error: bool.describe('false when the link was found.'),
			message: str.describe('Summary.'),
			connection: z
				.object({
					connection_id: str.describe(
						'ID of the connect link, starting with ext_con_.',
					),
					platform: str.describe('GOOGLE or MICROSOFT.'),
					status: str.describe(
						'awaiting_consent, connected, warmup_started, failed or expired.',
					),
					failure_reason: str.describe(
						'Fixed code when the link failed, expired, or connected without starting warmup.',
					),
					failure_message: str.describe('The same in plain words.'),
					email: str.describe(
						'The only address allowed to use the link, when you set one.',
					),
					start_warmup: bool.describe(
						'Whether warmup starts as soon as the mailbox connects.',
					),
					external_mailbox_uid: str.describe(
						'UID of the connected mailbox, once there is one.',
					),
					subscription_uid: str.describe(
						'UID of the warmup subscription, once warmup started.',
					),
					created_at: str.describe('When the link was created (ISO 8601).'),
					completed_at: str.describe('When the link was used (ISO 8601).'),
					expires_at: str.describe('When the link stops working (ISO 8601).'),
					external_mailbox: z
						.object({
							uid: str,
							email: str,
							display_name: str,
							platform: str,
							connection_type: str,
							status: str,
							status_reason: str,
							status_message: str,
							warmup: z
								.object({
									subscription_uid: str,
									status: str,
									health_status: str,
								})
								.loose()
								.nullish(),
							connected_at: str,
							disconnected_at: str,
							created_at: str,
						})
						.loose()
						.nullish()
						.describe(
							'The connected mailbox, in the same shape as List Your Connected Mailboxes, or null.',
						),
				})
				.loose()
				.nullish(),
		})
		.loose(),
	warmupAddSmtpMailboxes: z
		.object({
			error: bool.describe('false when the request was processed.'),
			message: str.describe('Summary of the result.'),
			results: z
				.array(
					z
						.object({
							email: str,
							status: str,
							reason: str,
							message: str,
							external_mailbox_uid: str,
							subscription_uid: str,
							amount_charged: num,
						})
						.loose(),
				)
				.nullish()
				.describe('One result per mailbox, in request order.'),
			summary: z
				.object({
					started: num.describe('Mailboxes started (and charged).'),
					updated: num.describe(
						'Mailboxes whose sign-in details were replaced.',
					),
					failed: num.describe('Mailboxes that failed.'),
					skipped: num.describe('Mailboxes skipped.'),
					total_charged: num.describe(
						'Charged to your wallet by this request.',
					),
				})
				.loose()
				.nullish(),
		})
		.loose(),
	warmupListConnectedMailboxes: z
		.object({
			error: bool.describe('false when the list was retrieved.'),
			message: str.describe('Summary.'),
			mailboxes: z
				.array(
					z
						.object({
							uid: str,
							email: str,
							display_name: str,
							platform: str,
							connection_type: str,
							status: str,
							status_reason: str,
							status_message: str,
							warmup: z
								.object({
									subscription_uid: str,
									status: str,
									health_status: str,
								})
								.loose()
								.nullish(),
							connected_at: str,
							disconnected_at: str,
							created_at: str,
						})
						.loose(),
				)
				.nullish()
				.describe('The mailboxes on this page.'),
			total: num.describe('Mailboxes matching the filters.'),
			pages: num.describe('Number of pages.'),
			current_page: num.describe('This page.'),
			limit: num.describe('Mailboxes per page.'),
		})
		.loose(),
	warmupDisconnectMailbox: z
		.object({
			error: bool.describe('false when the mailbox is disconnected.'),
			message: str.describe('Summary.'),
			mailbox: z
				.object({
					uid: str.describe(
						'UID of the mailbox, starting with ext_mbx_. Use it with the warmup endpoints.',
					),
					email: str.describe('Email address of the mailbox.'),
					display_name: str.describe('Sender name, when known.'),
					platform: str.describe('GOOGLE, MICROSOFT or SMTP.'),
					connection_type: str.describe(
						'oauth for Google Workspace and Microsoft 365, smtp for SMTP.',
					),
					status: str.describe('connected or disconnected.'),
					status_reason: str.describe(
						'When set, a fixed code saying why the mailbox needs attention.',
					),
					status_message: str.describe('The same in plain words.'),
					warmup: z
						.object({
							subscription_uid: str,
							status: str,
							health_status: str,
						})
						.loose()
						.nullish()
						.describe(
							"The mailbox's current warmup, or null when it has none.",
						),
					connected_at: str.describe('When the mailbox connected (ISO 8601).'),
					disconnected_at: str.describe(
						'When the mailbox was disconnected (ISO 8601).',
					),
					created_at: str.describe(
						'When the mailbox was first added (ISO 8601).',
					),
				})
				.loose()
				.nullish(),
			warmup_cancelled: bool.describe(
				'true when a running warmup was cancelled.',
			),
		})
		.loose(),
} as const;
